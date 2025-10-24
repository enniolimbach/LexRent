import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ResultCard } from "@/components/ResultCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileCheck, Calculator, AlertCircle } from "lucide-react";
import type { ContractData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ContractData | null>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setExtractedData(null);
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setExtractedData(null);
  };

  const handleExtractData = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      // Simulate OCR processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Import mock data
      const mockData: ContractData = {
        net_rent: 2400,
        reference_rate_contract: 1.75,
        contract_date: "2019-10-01",
        address: "Nordstrasse 9, 8006 Zürich",
        kanton: "Zürich",
        last_increase: null,
        improvements: false,
        current_reference_rate: 1.25,
        inflation_since_contract: 3.8,
        cost_increase_per_year: 0.5,
      };

      setExtractedData(mockData);
      
      toast({
        title: "Erfolgreich extrahiert",
        description: "Die Vertragsdaten wurden erfolgreich aus Ihrer Datei extrahiert.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler",
        description: "Die Datei konnte nicht verarbeitet werden.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedData(null);
  };

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
                      Daten prüfen
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Überprüfen Sie die extrahierten Informationen und ergänzen Sie bei Bedarf fehlende Angaben.
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

      {/* Upload Section */}
      <div id="upload" className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              Mietvertrag analysieren
            </h2>
            <p className="text-base text-muted-foreground">
              Laden Sie Ihren Mietvertrag hoch, um die Analyse zu starten
            </p>
          </div>

          <div className="space-y-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              selectedFile={selectedFile}
              isProcessing={isProcessing}
            />

            {selectedFile && !extractedData && (
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

            {extractedData && (
              <div className="space-y-6">
                <ResultCard data={extractedData} />
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    size="lg"
                    disabled
                    data-testid="button-calculate"
                  >
                    Berechnung durchführen (TODO)
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
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="py-12 bg-muted/30 border-t">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">Phase 1 - Prototyp</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Diese Version zeigt die Kernfunktionalität: Datei-Upload und strukturierte Datenanzeige.
                    Die OCR-Extraktion verwendet aktuell Beispieldaten. In Phase 2 folgen die juristische
                    Berechnung gemäss Art. 270a OR und die automatische Generierung eines Schreibens
                    an die Hausverwaltung.
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
          </div>
        </div>
      </footer>
    </div>
  );
}
