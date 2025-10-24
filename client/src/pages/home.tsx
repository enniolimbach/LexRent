import { useState, useEffect, useMemo } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ResultCard } from "@/components/ResultCard";
import { ChatInterface } from "@/components/ChatInterface";
import { ResultSummary } from "@/components/ResultSummary";
import { PdfPreview } from "@/components/PdfPreview";
import { ProgressBar } from "@/components/ProgressBar";
import { ConsentDialog } from "@/components/ConsentDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileCheck, Calculator, AlertCircle, ArrowRight, FileText, Info } from "lucide-react";
import type { ContractData, DialogMessage, CalculationResult } from "@shared/schema";
import { DialogAgent } from "@/agents/dialogAgent";
import { CalculationAgent } from "@/agents/calculationAgent";
import { DocumentAgent } from "@/agents/documentAgent";
import { getMissingFields } from "@/utils/validation";
import { useToast } from "@/hooks/use-toast";

type AppState = "upload" | "dialog" | "summary" | "calculation" | "letter";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<Partial<ContractData> | null>(null);
  const [appState, setAppState] = useState<AppState>("upload");
  const [dialogAgent, setDialogAgent] = useState<DialogAgent | null>(null);
  const [messages, setMessages] = useState<DialogMessage[]>([]);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [letterData, setLetterData] = useState<{
    letterData: any;
    subject: string;
    salutation: string;
    paragraphs: string[];
    closing: string;
    footer: string;
  } | null>(null);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const { toast } = useToast();

  // Initialize dialog agent when data is extracted
  useEffect(() => {
    if (extractedData && appState === "upload") {
      const missingFields = getMissingFields(extractedData);
      
      if (missingFields.length > 0) {
        // Start dialog flow
        const agent = new DialogAgent(extractedData);
        setDialogAgent(agent);
        setAppState("dialog");
        
        // Add welcome message
        const welcomeMsg: DialogMessage = {
          id: `msg-${Date.now()}`,
          type: "system",
          content: "Ich habe einige Informationen extrahiert. Bitte beantworten Sie noch ein paar Fragen, um die Analyse zu vervollständigen.",
          timestamp: new Date(),
        };
        setMessages([welcomeMsg]);
        
        // Add first question
        const question = agent.getCurrentQuestion();
        if (question) {
          const questionMsg: DialogMessage = {
            id: `msg-${Date.now() + 1}`,
            type: "question",
            content: question.question,
            timestamp: new Date(),
            field: question.field,
          };
          setMessages(prev => [...prev, questionMsg]);
        }
      } else {
        // All data complete, go to summary
        setAppState("summary");
      }
    }
  }, [extractedData, appState]);

  const handleFileSelect = async (file: File) => {
    // Check consent before allowing file selection
    if (!hasConsented) {
      setSelectedFile(file);
      setShowConsentDialog(true);
      return;
    }
    
    setSelectedFile(file);
    setExtractedData(null);
    setAppState("upload");
  };

  const handleConsent = () => {
    setHasConsented(true);
    setShowConsentDialog(false);
    toast({
      title: "Einwilligung erteilt",
      description: "Sie können nun mit der Vertragsanalyse fortfahren.",
    });
  };

  const handleDeclineConsent = () => {
    setShowConsentDialog(false);
    setSelectedFile(null);
    toast({
      variant: "destructive",
      title: "Einwilligung erforderlich",
      description: "Sie müssen den Datenschutzbestimmungen zustimmen, um LexRent nutzen zu können.",
    });
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setExtractedData(null);
    setAppState("upload");
    setDialogAgent(null);
    setMessages([]);
  };

  const handleExtractData = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/upload-contract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setExtractedData(result.data);
      
      toast({
        title: "Erfolgreich extrahiert",
        description: "Die Vertragsdaten wurden erfolgreich aus Ihrer Datei extrahiert.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: error instanceof Error ? error.message : "Die Datei konnte nicht verarbeitet werden.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (!dialogAgent) return;

    // Add user's answer to messages
    const answerMsg: DialogMessage = {
      id: `msg-${Date.now()}`,
      type: "answer",
      content: answer,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, answerMsg]);

    // Process answer
    const result = dialogAgent.processAnswer(answer);
    
    // Check if answer was rejected (validation failed)
    if (!result.accepted) {
      const errorMsg: DialogMessage = {
        id: `msg-${Date.now() + 1}`,
        type: "system",
        content: result.error || "Ungültige Eingabe. Bitte versuchen Sie es erneut.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
      
      // Re-ask the same question
      const sameQuestion = dialogAgent.getCurrentQuestion();
      if (sameQuestion) {
        const questionMsg: DialogMessage = {
          id: `msg-${Date.now() + 2}`,
          type: "question",
          content: sameQuestion.question,
          timestamp: new Date(),
          field: sameQuestion.field,
        };
        setMessages(prev => [...prev, questionMsg]);
      }
      return;
    }
    
    // Update contract data
    setExtractedData(dialogAgent.getContractData());

    // Check if more questions
    if (!dialogAgent.isComplete()) {
      const nextQuestion = dialogAgent.getCurrentQuestion();
      if (nextQuestion) {
        const questionMsg: DialogMessage = {
          id: `msg-${Date.now() + 1}`,
          type: "question",
          content: nextQuestion.question,
          timestamp: new Date(),
          field: nextQuestion.field,
        };
        setMessages(prev => [...prev, questionMsg]);
      }
    } else {
      // Dialog complete - transition to summary
      const completeMsg: DialogMessage = {
        id: `msg-${Date.now() + 2}`,
        type: "system",
        content: "Perfekt! Alle Angaben sind jetzt vollständig.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, completeMsg]);
      
      // Automatically transition to summary after a brief delay
      setTimeout(() => {
        setAppState("summary");
      }, 1500);
    }
  };

  const handleShowSummary = () => {
    setAppState("summary");
  };

  const handleCalculate = async () => {
    if (!extractedData) return;

    setIsCalculating(true);

    try {
      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const result = CalculationAgent.calculate(extractedData as ContractData);
      setCalculationResult(result);
      setAppState("calculation");

      toast({
        title: "Berechnung abgeschlossen",
        description: result.isReductionPossible 
          ? "Eine Mietzinssenkung ist möglich!" 
          : "Die Berechnung wurde durchgeführt.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler bei der Berechnung",
        description: error instanceof Error ? error.message : "Die Berechnung konnte nicht durchgeführt werden.",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleGenerateLetter = () => {
    if (!extractedData || !calculationResult) return;

    try {
      // Generate letter data
      const data = DocumentAgent.generateLetterData(
        extractedData as ContractData,
        calculationResult
      );

      // Generate letter text
      const letterText = DocumentAgent.generateLetterText(data);

      // Store letter data for preview
      setLetterData({
        letterData: data,
        ...letterText,
      });

      setAppState("letter");

      toast({
        title: "Schreiben generiert",
        description: "Ihr formelles Schreiben wurde erstellt.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: error instanceof Error ? error.message : "Das Schreiben konnte nicht generiert werden.",
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedData(null);
    setAppState("upload");
    setDialogAgent(null);
    setMessages([]);
    setCalculationResult(null);
    setLetterData(null);
  };

  const progress = useMemo(() => {
    if (dialogAgent) {
      return dialogAgent.getProgress();
    }
    return { current: 0, total: 0, percentage: 0 };
  }, [dialogAgent, messages]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide mb-4">
              <Shield className="w-3 h-3" />
              Basierend auf Art. 270a OR
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              LexRent
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              Ihr digitaler Assistent für die Prüfung von Mietverträgen in der Schweiz.
              Finden Sie heraus, ob Sie Anspruch auf eine Mietzinssenkung haben.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild data-testid="button-scroll-to-upload">
                <a href="#upload">
                  Jetzt prüfen
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild data-testid="button-learn-more">
                <a href="#how-it-works">
                  Mehr erfahren
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-16 md:py-24 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              So funktioniert's
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              In drei einfachen Schritten zu Ihrer Mietvertragsanalyse
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="hover-elevate transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <div className="flex-1">
                    <FileCheck className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-lg font-semibold mb-2">
                      Vertrag hochladen
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Laden Sie Ihren Mietvertrag als PDF oder Foto hoch. Unsere OCR-Technologie liest die wichtigsten Daten aus.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <div className="flex-1">
                    <Calculator className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-lg font-semibold mb-2">
                      Fragen beantworten
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Ergänzen Sie im Dialog fehlende Angaben. Das System führt Sie Schritt für Schritt durch die benötigten Informationen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <div className="flex-1">
                    <Shield className="w-8 h-8 text-primary mb-3" />
                    <h3 className="text-lg font-semibold mb-2">
                      Ergebnis erhalten
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Erhalten Sie eine Analyse basierend auf Art. 270a OR und ein fertiges Schreiben für Ihre Hausverwaltung.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {appState !== "upload" && (
        <ProgressBar currentStep={appState} />
      )}

      {/* Main Content Section */}
      <div id="upload" className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Upload State */}
          {appState === "upload" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                  Mietvertrag analysieren
                </h2>
                <p className="text-base text-muted-foreground">
                  Laden Sie Ihren Mietvertrag hoch, um die Analyse zu starten
                </p>
              </div>

              <FileUpload
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                selectedFile={selectedFile}
                isProcessing={isProcessing}
              />

              {selectedFile && (
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={handleExtractData}
                    disabled={isProcessing}
                    data-testid="button-extract-data"
                    className="min-w-[200px]"
                  >
                    {isProcessing ? "Verarbeitung läuft..." : "Daten extrahieren"}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Dialog State */}
          {appState === "dialog" && dialogAgent && extractedData && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                  Angaben vervollständigen
                </h2>
                <p className="text-base text-muted-foreground">
                  Bitte beantworten Sie noch einige Fragen zu Ihrem Mietvertrag
                </p>
              </div>

              <ChatInterface
                messages={messages}
                currentQuestion={dialogAgent.getCurrentQuestion()}
                onAnswer={handleAnswer}
                progress={progress}
                isComplete={dialogAgent.isComplete()}
              />

              {dialogAgent.isComplete() && (
                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={handleShowSummary}
                    data-testid="button-show-summary"
                  >
                    Zusammenfassung anzeigen
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Summary State */}
          {appState === "summary" && extractedData && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                  Vollständige Zusammenfassung
                </h2>
                <p className="text-base text-muted-foreground">
                  Alle Vertragsdaten wurden erfolgreich erfasst
                </p>
              </div>

              <ResultCard data={extractedData as ContractData} />
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  data-testid="button-calculate"
                >
                  {isCalculating ? "Berechnung läuft..." : "Berechnung durchführen"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleReset}
                  data-testid="button-reset"
                >
                  Neu beginnen
                </Button>
              </div>
            </div>
          )}

          {/* Calculation Result State */}
          {appState === "calculation" && calculationResult && extractedData && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                  Berechnung nach Art. 270a OR
                </h2>
                <p className="text-base text-muted-foreground">
                  Ihr persönliches Ergebnis zur Mietzinssenkung
                </p>
              </div>

              <ResultSummary result={calculationResult} />

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {calculationResult.isReductionPossible && (
                  <Button
                    size="lg"
                    onClick={handleGenerateLetter}
                    data-testid="button-generate-letter"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Schreiben generieren
                  </Button>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setAppState("summary")}
                  data-testid="button-back-to-summary"
                >
                  Zurück zur Zusammenfassung
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleReset}
                  data-testid="button-reset-after-calc"
                >
                  Neu beginnen
                </Button>
              </div>
            </div>
          )}

          {/* Letter Preview State */}
          {appState === "letter" && letterData && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                  Ihr Schreiben an die Hausverwaltung
                </h2>
                <p className="text-base text-muted-foreground">
                  Prüfen Sie das Schreiben und laden Sie es als PDF herunter
                </p>
              </div>

              <PdfPreview
                letterData={letterData.letterData}
                subject={letterData.subject}
                salutation={letterData.salutation}
                paragraphs={letterData.paragraphs}
                closing={letterData.closing}
                footer={letterData.footer}
                onClose={() => setAppState("calculation")}
              />
            </div>
          )}
        </div>
      </div>

      {/* Legal Disclaimer Section */}
      <div className="py-12 bg-muted/30 border-t">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Disclaimer */}
          <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Info className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">
                    Wichtiger rechtlicher Hinweis
                  </h3>
                  <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                    LexRent bietet <strong>keine Rechtsberatung oder Rechtsvertretung</strong>. 
                    Die bereitgestellten Informationen und Berechnungen gemäss Art. 270a OR dienen 
                    ausschliesslich Ihrer Orientierung. Für verbindliche rechtliche Auskünfte wenden 
                    Sie sich bitte an eine qualifizierte Fachperson, einen Mieterverband oder eine 
                    Rechtsberatungsstelle.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Info */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Shield className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Phase 5 - Präsentationsfähiger MVP</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Vollständig integrierte Funktionalität mit Datenschutz-Compliance, verbesserter UX 
                    und stabiler Fehlerbehandlung. Upload → Dialog → Berechnung → PDF-Brief-Generierung 
                    läuft vollständig automatisiert.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Über LexRent</h4>
              <p className="text-sm text-muted-foreground">
                Digitaler Assistent für Schweizer Mieterinnen und Mieter zur Prüfung von Mietverträgen.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Rechtliches</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Datenschutz</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Impressum</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Nutzungsbedingungen</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Kontakt</h4>
              <p className="text-sm text-muted-foreground">
                Fragen oder Feedback?<br />
                <a href="mailto:info@lexrent.ch" className="hover:text-foreground transition-colors">
                  info@lexrent.ch
                </a>
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 LexRent. Alle Rechte vorbehalten.</p>
            <p className="mt-2 text-xs">
              Keine Speicherung personenbezogener Daten • Keine Weitergabe an Dritte • 
              Temporäre Verarbeitung nur während Ihrer Session
            </p>
          </div>
        </div>
      </footer>

      {/* Consent Dialog */}
      <ConsentDialog
        open={showConsentDialog}
        onConsent={handleConsent}
        onDecline={handleDeclineConsent}
      />
    </div>
  );
}
