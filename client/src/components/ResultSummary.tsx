import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Calculator,
  Info
} from "lucide-react";
import type { CalculationResult } from "@shared/schema";

interface ResultSummaryProps {
  result: CalculationResult;
}

export function ResultSummary({ result }: ResultSummaryProps) {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (value: number, showSign: boolean = false): string => {
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const isPositive = result.effectiveReductionPercent > 0;
  const isNegative = result.effectiveReductionPercent < 0;

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <Card className={`shadow-lg ${
        isPositive ? 'border-green-500/50 bg-green-500/5' : 
        isNegative ? 'border-orange-500/50 bg-orange-500/5' : 
        'border-border'
      }`}>
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle className="text-2xl md:text-3xl font-semibold">
              Berechnungsergebnis
            </CardTitle>
            <Badge 
              variant={isPositive ? "default" : isNegative ? "secondary" : "outline"}
              className="text-sm"
              data-testid="badge-result-status"
            >
              {isPositive ? "Reduktion möglich" : isNegative ? "Keine Reduktion" : "Neutral"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Hero Section - Main Result */}
          <div className="text-center py-6 px-4 bg-card rounded-lg border">
            {isPositive ? (
              <>
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <TrendingDown className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-base font-medium text-muted-foreground mb-2">
                  Mögliche monatliche Ersparnis
                </h3>
                <p className="text-4xl md:text-5xl font-bold text-green-600 mb-2" data-testid="text-monthly-savings">
                  {formatCurrency(result.monthlySavings)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(result.annualSavings)} pro Jahr
                </p>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Aktuelle Nettomiete</p>
                    <p className="text-lg font-semibold" data-testid="text-current-rent-calc">
                      {formatCurrency(result.currentRent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Neue Nettomiete</p>
                    <p className="text-lg font-semibold text-green-600" data-testid="text-new-rent">
                      {formatCurrency(result.newRent)}
                    </p>
                  </div>
                </div>
              </>
            ) : isNegative ? (
              <>
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
                <h3 className="text-base font-medium text-muted-foreground mb-2">
                  Keine Mietzinssenkung möglich
                </h3>
                <p className="text-3xl font-bold text-orange-600 mb-2" data-testid="text-no-reduction">
                  {formatPercent(result.effectiveReductionPercent, true)}
                </p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Die Kostensteigerungen und Teuerung überwiegen die Zinssenkung
                </p>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-base font-medium text-muted-foreground mb-2">
                  Keine Änderung
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Die verschiedenen Faktoren gleichen sich aus
                </p>
              </>
            )}
          </div>

          {/* Explanation */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-2">Juristische Begründung</h4>
                <div className="text-sm text-muted-foreground whitespace-pre-line" data-testid="text-explanation">
                  {result.explanationDe}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-semibold">
              Detaillierte Berechnung
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Schritt-für-Schritt Aufschlüsselung gemäss Art. 270a OR
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result.detailedBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex items-start justify-between gap-4 py-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1" data-testid={`step-title-${index}`}>
                      {item.step}
                    </h4>
                    <p className="text-xs text-muted-foreground" data-testid={`step-explanation-${index}`}>
                      {item.explanation}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span 
                      className={`text-base font-semibold ${
                        item.value.startsWith('+') && index > 0 ? 'text-red-600' :
                        item.value.startsWith('-') ? 'text-orange-600' :
                        index === result.detailedBreakdown.length - 1 && result.effectiveReductionPercent > 0 ? 'text-green-600' :
                        'text-foreground'
                      }`}
                      data-testid={`step-value-${index}`}
                    >
                      {item.value}
                    </span>
                  </div>
                </div>
                {index < result.detailedBreakdown.length - 1 && <Separator />}
              </div>
            ))}
          </div>

          {/* Warning for negative results */}
          {isNegative && (
            <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">
                    Hinweis
                  </h4>
                  <p className="text-xs text-orange-800 dark:text-orange-200">
                    Aufgrund der Berechnungen ergibt sich aktuell keine Grundlage für eine Mietzinssenkung.
                    Die Kostensteigerungen und die Teuerung überwiegen die Zinssenkung.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps Card */}
      {isPositive && (
        <Card className="shadow-md border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-2">Nächste Schritte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Laden Sie die vollständige Berechnung als PDF herunter (Phase 4)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Generieren Sie ein rechtsgültiges Schreiben an Ihre Hausverwaltung (Phase 4)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Senden Sie das Schreiben per Einschreiben an Ihren Vermieter</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
