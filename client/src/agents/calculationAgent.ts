import type { ContractData } from "@shared/schema";
import {
  calculateRateDifferential,
  calculateInterestReduction,
  calculateCostIncrease,
  calculateInflationAdjustment,
  calculateEffectiveReduction,
  calculateNewRent,
  calculateYearsBetween,
  determineLastAdjustmentDate,
} from "@/utils/calculationFormulas";

export interface CalculationResult {
  isReductionPossible: boolean;
  rateDifferential: number;
  interestReductionPercent: number;
  yearsSinceAdjustment: number;
  costIncreasePercent: number;
  inflationAdjustmentPercent: number;
  effectiveReductionPercent: number;
  currentRent: number;
  newRent: number;
  monthlySavings: number;
  annualSavings: number;
  explanationDe: string;
  detailedBreakdown: {
    step: string;
    value: string;
    explanation: string;
  }[];
}

/**
 * Calculation Agent for Swiss Rental Law (Art. 270a OR)
 * Performs complete rent reduction calculation with plausibility checks
 */
export class CalculationAgent {
  /**
   * Perform complete rent calculation
   * 
   * @param data - Complete contract data
   * @returns Detailed calculation result with German explanation
   */
  static calculate(data: ContractData): CalculationResult {
    // Plausibility checks
    this.validateInput(data);

    // Calculate reference rate differential
    const rateDifferential = calculateRateDifferential(
      data.reference_rate_contract,
      data.current_reference_rate
    );

    // Calculate interest-based reduction
    const interestReductionPercent = calculateInterestReduction(rateDifferential);

    // Determine last adjustment date
    const lastAdjustmentDate = determineLastAdjustmentDate(
      data.contract_date,
      data.last_increase ?? null
    );

    // Calculate years since last adjustment
    const yearsSinceAdjustment = calculateYearsBetween(lastAdjustmentDate);

    // Calculate cost increases
    const costIncreasePercent = calculateCostIncrease(
      yearsSinceAdjustment,
      data.cost_increase_per_year
    );

    // Calculate inflation adjustment
    const inflationAdjustmentPercent = calculateInflationAdjustment(
      data.inflation_since_contract
    );

    // Calculate effective reduction
    const effectiveReductionPercent = calculateEffectiveReduction(
      interestReductionPercent,
      costIncreasePercent,
      inflationAdjustmentPercent
    );

    // Calculate new rent
    const newRent = calculateNewRent(data.net_rent, effectiveReductionPercent);
    const monthlySavings = data.net_rent - newRent;
    const annualSavings = monthlySavings * 12;

    // Generate explanation
    const explanationDe = this.generateExplanation({
      originalRate: data.reference_rate_contract,
      currentRate: data.current_reference_rate,
      rateDifferential,
      interestReductionPercent,
      yearsSinceAdjustment,
      costIncreasePercent,
      inflationAdjustmentPercent,
      effectiveReductionPercent,
      currentRent: data.net_rent,
      newRent,
      monthlySavings,
    });

    // Generate detailed breakdown
    const detailedBreakdown = this.generateDetailedBreakdown({
      rateDifferential,
      interestReductionPercent,
      yearsSinceAdjustment,
      costIncreasePercent,
      inflationAdjustmentPercent,
      effectiveReductionPercent,
    });

    return {
      isReductionPossible: effectiveReductionPercent > 0,
      rateDifferential,
      interestReductionPercent,
      yearsSinceAdjustment,
      costIncreasePercent,
      inflationAdjustmentPercent,
      effectiveReductionPercent,
      currentRent: data.net_rent,
      newRent,
      monthlySavings,
      annualSavings,
      explanationDe,
      detailedBreakdown,
    };
  }

  /**
   * Validate input data for plausibility
   */
  private static validateInput(data: ContractData): void {
    if (data.net_rent <= 0) {
      throw new Error("Nettomiete muss grösser als 0 sein");
    }

    if (data.reference_rate_contract < 0 || data.current_reference_rate < 0) {
      throw new Error("Referenzzinssätze müssen nicht-negativ sein");
    }

    const contractYear = new Date(data.contract_date).getFullYear();
    const currentYear = new Date().getFullYear();
    
    if (contractYear < 1990 || contractYear > currentYear) {
      throw new Error("Vertragsdatum ist nicht plausibel");
    }

    if (data.cost_increase_per_year < 0 || data.cost_increase_per_year > 10) {
      throw new Error("Kostensteigerung pro Jahr muss zwischen 0% und 10% liegen");
    }
  }

  /**
   * Generate human-readable explanation in German
   */
  private static generateExplanation(params: {
    originalRate: number;
    currentRate: number;
    rateDifferential: number;
    interestReductionPercent: number;
    yearsSinceAdjustment: number;
    costIncreasePercent: number;
    inflationAdjustmentPercent: number;
    effectiveReductionPercent: number;
    currentRent: number;
    newRent: number;
    monthlySavings: number;
  }): string {
    const {
      originalRate,
      currentRate,
      rateDifferential,
      interestReductionPercent,
      yearsSinceAdjustment,
      costIncreasePercent,
      inflationAdjustmentPercent,
      effectiveReductionPercent,
      currentRent,
      newRent,
      monthlySavings,
    } = params;

    const formatPercent = (val: number) => `${val.toFixed(2)}%`;
    const formatCurrency = (val: number) => 
      `CHF ${val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;

    let explanation = "";

    if (rateDifferential > 0) {
      explanation += `Der hypothekarische Referenzzinssatz ist seit Vertragsabschluss von ${originalRate.toFixed(2)}% auf ${currentRate.toFixed(2)}% gesunken. `;
      explanation += `Gemäss Art. 270a OR entspricht diese Senkung um ${formatPercent(Math.abs(rateDifferential))} einer möglichen Mietzinsreduktion von ${formatPercent(interestReductionPercent)}.\n\n`;
    } else if (rateDifferential < 0) {
      explanation += `Der hypothekarische Referenzzinssatz ist seit Vertragsabschluss von ${originalRate.toFixed(2)}% auf ${currentRate.toFixed(2)}% gestiegen. `;
      explanation += `Dies würde theoretisch eine Mieterhöhung um ${formatPercent(Math.abs(interestReductionPercent))} rechtfertigen.\n\n`;
    } else {
      explanation += `Der hypothekarische Referenzzinssatz ist seit Vertragsabschluss unverändert bei ${originalRate.toFixed(2)}% geblieben.\n\n`;
    }

    if (yearsSinceAdjustment > 0) {
      explanation += `Seit der letzten Mietanpassung sind ${yearsSinceAdjustment.toFixed(1)} Jahre vergangen. `;
      explanation += `In dieser Zeit sind geschätzte Kostensteigerungen von ${formatPercent(costIncreasePercent)} angefallen.\n\n`;
    }

    if (inflationAdjustmentPercent > 0) {
      explanation += `Die Teuerung (Landesindex für Konsumentenpreise) wird mit ${formatPercent(inflationAdjustmentPercent)} berücksichtigt.\n\n`;
    }

    if (effectiveReductionPercent > 0) {
      explanation += `**Ergebnis:** Nach Abzug aller Faktoren ergibt sich eine mögliche Mietzinssenkung von ${formatPercent(effectiveReductionPercent)}. `;
      explanation += `Ihre monatliche Nettomiete könnte von ${formatCurrency(currentRent)} auf ${formatCurrency(newRent)} gesenkt werden. `;
      explanation += `Das entspricht einer monatlichen Ersparnis von ${formatCurrency(monthlySavings)} bzw. ${formatCurrency(monthlySavings * 12)} pro Jahr.`;
    } else if (effectiveReductionPercent < 0) {
      explanation += `**Ergebnis:** Nach Berücksichtigung aller Faktoren ergibt sich leider keine Mietzinssenkung. `;
      explanation += `Die Kostensteigerungen und Teuerung überwiegen die Zinssenkung.`;
    } else {
      explanation += `**Ergebnis:** Die verschiedenen Faktoren gleichen sich aus. Eine Mietzinsänderung ist nicht gerechtfertigt.`;
    }

    return explanation;
  }

  /**
   * Generate detailed calculation breakdown for transparency
   */
  private static generateDetailedBreakdown(params: {
    rateDifferential: number;
    interestReductionPercent: number;
    yearsSinceAdjustment: number;
    costIncreasePercent: number;
    inflationAdjustmentPercent: number;
    effectiveReductionPercent: number;
  }) {
    const formatPercent = (val: number) => `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;

    return [
      {
        step: "1. Referenzzinssatz-Differenz",
        value: `${params.rateDifferential.toFixed(2)}%`,
        explanation: "Änderung des hypothekarischen Referenzzinssatzes seit Vertragsbeginn",
      },
      {
        step: "2. Zinsbedingte Reduktion",
        value: formatPercent(params.interestReductionPercent),
        explanation: "Pro 0.25% Zinssenkung ergibt sich 2.91% Mietreduktion (Art. 270a OR)",
      },
      {
        step: "3. Kostensteigerungen",
        value: formatPercent(-params.costIncreasePercent),
        explanation: `Geschätzte Kostensteigerung über ${params.yearsSinceAdjustment.toFixed(1)} Jahre`,
      },
      {
        step: "4. Teuerungsausgleich",
        value: formatPercent(-params.inflationAdjustmentPercent),
        explanation: "Anpassung basierend auf dem Landesindex der Konsumentenpreise (LIK)",
      },
      {
        step: "5. Effektive Reduktion",
        value: formatPercent(params.effectiveReductionPercent),
        explanation: "Gesamtbilanz aller Faktoren",
      },
    ];
  }
}
