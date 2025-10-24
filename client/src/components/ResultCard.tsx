import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, Calendar, MapPin, TrendingDown, TrendingUp } from "lucide-react";
import type { ContractData } from "@shared/schema";

interface ResultCardProps {
  data: ContractData;
}

export function ResultCard({ data }: ResultCardProps) {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('de-CH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-2xl md:text-3xl font-semibold">
            Erkannte Vertragsdaten
          </CardTitle>
          <Badge variant="secondary" className="text-xs uppercase tracking-wide">
            Phase 1 - Mock Daten
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Automatisch extrahierte Informationen aus Ihrem Mietvertrag
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mietinformationen */}
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-4">
            Mietinformationen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1">
                Nettomietzins
              </label>
              <p className="text-base font-semibold" data-testid="text-net-rent">
                {formatCurrency(data.net_rent)}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1">
                Adresse
              </label>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-base" data-testid="text-address">
                  {data.address}
                </p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1">
                Kanton
              </label>
              <p className="text-base" data-testid="text-kanton">
                {data.kanton}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1">
                Vertragsdatum
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-base" data-testid="text-contract-date">
                  {formatDate(data.contract_date)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Referenzzinssatz */}
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-4">
            Referenzzinssatz
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1">
                Bei Vertragsabschluss
              </label>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold" data-testid="text-reference-rate-contract">
                  {formatPercent(data.reference_rate_contract)}
                </p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1">
                Aktueller Referenzzinssatz
              </label>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <p className="text-base font-semibold text-green-600" data-testid="text-current-reference-rate">
                  {formatPercent(data.current_reference_rate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Weitere Faktoren */}
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-4">
            Weitere Faktoren
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1">
                Letzte Erhöhung
              </label>
              <p className="text-base" data-testid="text-last-increase">
                {data.last_increase ? formatDate(data.last_increase) : 'Keine'}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1">
                Wertvermehrende Investitionen
              </label>
              <div className="flex items-center gap-2">
                {data.improvements ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <p className="text-base" data-testid="text-improvements">Ja</p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-muted-foreground" />
                    <p className="text-base" data-testid="text-improvements">Nein</p>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1">
                Teuerung seit Vertragsabschluss
              </label>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <p className="text-base font-semibold" data-testid="text-inflation">
                  {formatPercent(data.inflation_since_contract)}
                </p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground block mb-1">
                Kostensteigerung pro Jahr
              </label>
              <p className="text-base" data-testid="text-cost-increase">
                {formatPercent(data.cost_increase_per_year)}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* JSON Anzeige */}
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground mb-3">
            Rohdaten (JSON)
          </h3>
          <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs font-mono" data-testid="text-json-data">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
