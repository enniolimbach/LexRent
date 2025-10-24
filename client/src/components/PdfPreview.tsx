/**
 * PDF Preview Component
 * Shows preview of the generated letter before download
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, CheckCircle } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { LetterDocument } from "./LetterDocument";
import type { LetterData } from "@/utils/pdfTemplates";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PdfPreviewProps {
  letterData: LetterData;
  subject: string;
  salutation: string;
  paragraphs: string[];
  closing: string;
  footer: string;
  onClose?: () => void;
}

export function PdfPreview({
  letterData,
  subject,
  salutation,
  paragraphs,
  closing,
  footer,
  onClose,
}: PdfPreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Generate PDF blob
      const doc = (
        <LetterDocument
          letterData={letterData}
          subject={subject}
          salutation={salutation}
          paragraphs={paragraphs}
          closing={closing}
          footer={footer}
        />
      );

      const blob = await pdf(doc).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Mietzinssenkung_${letterData.tenant.name.replace(/\s/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "PDF erfolgreich erstellt",
        description: "Das Schreiben wurde heruntergeladen.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fehler beim Erstellen des PDFs",
        description: error instanceof Error ? error.message : "Das PDF konnte nicht erstellt werden.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Ihr Schreiben an die Hausverwaltung
              </CardTitle>
              <CardDescription>
                Formelles Gesuch um Mietzinssenkung gemäss Art. 270a OR
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview of letter content */}
          <div className="border rounded-lg p-6 bg-muted/30 space-y-4 max-h-[500px] overflow-y-auto">
            {/* Sender */}
            <div className="text-sm text-muted-foreground">
              <div>{letterData.tenant.name}</div>
              <div>{letterData.tenant.address}</div>
              <div>{letterData.tenant.city}</div>
            </div>

            {/* Recipient */}
            {letterData.landlord.name && (
              <div className="font-medium">
                <div>{letterData.landlord.name}</div>
              </div>
            )}

            {/* Date */}
            <div className="text-right text-sm">
              {letterData.tenant.city}, {letterData.date}
            </div>

            {/* Subject */}
            <div className="font-semibold">
              Betreff: {subject}
            </div>

            {/* Salutation */}
            <div>{salutation}</div>

            {/* Paragraphs */}
            {paragraphs.map((paragraph, index) => (
              <div key={index} className="text-justify">
                {paragraph}
              </div>
            ))}

            {/* Closing */}
            <div className="mt-6">{closing}</div>
            <div className="mt-2">{letterData.tenant.name}</div>
          </div>

          {/* Info box */}
          <div className="flex gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm">Wichtige Hinweise</h4>
              <p className="text-sm text-muted-foreground">
                Bitte überprüfen Sie das Schreiben sorgfältig. Sie können es als PDF herunterladen,
                ausdrucken, unterschreiben und per Einschreiben an Ihre Hausverwaltung senden.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1"
              data-testid="button-download-pdf"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? "PDF wird erstellt..." : "Als PDF herunterladen"}
            </Button>
            {onClose && (
              <Button
                size="lg"
                variant="outline"
                onClick={onClose}
                data-testid="button-close-preview"
              >
                Schliessen
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
