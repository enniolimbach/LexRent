/**
 * Consent Dialog Component
 * Privacy notice and data processing consent
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, AlertCircle } from "lucide-react";

interface ConsentDialogProps {
  open: boolean;
  onConsent: () => void;
  onDecline: () => void;
}

export function ConsentDialog({ open, onConsent, onDecline }: ConsentDialogProps) {
  const [hasConsented, setHasConsented] = useState(false);

  const handleAccept = () => {
    if (hasConsented) {
      onConsent();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDecline()}>
      <DialogContent className="max-w-2xl" data-testid="consent-dialog">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-xl">Datenschutz und Nutzungsbedingungen</DialogTitle>
          </div>
          <DialogDescription className="text-base space-y-4 pt-4">
            <p>
              Willkommen bei LexRent. Bevor Sie fortfahren, beachten Sie bitte folgende wichtige Hinweise:
            </p>

            <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-4 space-y-3">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Keine Rechtsberatung</h4>
                  <p className="text-sm">
                    LexRent bietet <strong>keine Rechtsberatung oder Rechtsvertretung</strong>. 
                    Die Anwendung liefert automatisierte Informationen gemäss Art. 270a OR zur 
                    Orientierung. Für verbindliche rechtliche Auskünfte wenden Sie sich bitte an 
                    eine qualifizierte Fachperson oder einen Mieterverband.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Datenschutz</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Ihre hochgeladene Datei wird <strong>nur temporär</strong> während Ihrer 
                    Browser-Sitzung verarbeitet</li>
                    <li><strong>Keine Speicherung</strong> Ihrer Daten nach Sessionende</li>
                    <li><strong>Keine Übermittlung</strong> an Dritte oder externe Server</li>
                    <li>Alle Berechnungen erfolgen lokal in Ihrem Browser</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Aktuelle Einschränkung</h4>
                  <p className="text-sm">
                    Dies ist eine <strong>Prototyp-Version</strong>. Die OCR-Extraktion verwendet 
                    derzeit Beispieldaten. Eine Integration echter OCR-Dienste erfolgt in einer 
                    späteren Version.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="consent"
                checked={hasConsented}
                onCheckedChange={(checked) => setHasConsented(checked === true)}
                data-testid="checkbox-consent"
              />
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-relaxed cursor-pointer"
              >
                Ich habe die Hinweise gelesen und bin einverstanden, dass meine hochgeladene 
                Datei temporär analysiert wird. Ich verstehe, dass LexRent keine Rechtsberatung 
                bietet und die Ergebnisse informativen Charakter haben.
              </label>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onDecline}
            data-testid="button-decline-consent"
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!hasConsented}
            data-testid="button-accept-consent"
          >
            Akzeptieren und fortfahren
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
