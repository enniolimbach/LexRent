/**
 * PDF Letter Templates
 * German text templates for formal rental reduction letters per Art. 270a OR
 */

export interface LetterData {
  tenant: {
    name: string;
    address: string;
    city: string;
  };
  landlord: {
    name?: string;
    address?: string;
  };
  contract: {
    property_address: string;
    net_rent: number;
    reference_rate_contract: number;
    current_reference_rate: number;
  };
  calculation: {
    effective_reduction_percent: number;
    new_net_rent: number;
    monthly_savings: number;
  };
  date: string;
}

export const LetterTemplates = {
  /**
   * Generate subject line
   */
  subject: (): string => {
    return "Gesuch um Mietzinssenkung gemäss Art. 270a OR";
  },

  /**
   * Generate salutation
   */
  salutation: (landlordName?: string): string => {
    if (landlordName) {
      return `Sehr geehrte Damen und Herren der ${landlordName}`;
    }
    return "Sehr geehrte Damen und Herren";
  },

  /**
   * Generate main body of the letter
   */
  mainBody: (data: LetterData): string[] => {
    const {
      contract,
      calculation,
    } = data;

    const formatCurrency = (val: number) =>
      `CHF ${Math.round(val).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, "'")}`;
    const formatPercent = (val: number) => `${val.toFixed(2)} %`;

    const paragraphs: string[] = [];

    // Introduction paragraph
    paragraphs.push(
      `Ich bin Mieter/Mieterin der oben genannten Liegenschaft mit einem aktuellen Nettomietzins von ${formatCurrency(contract.net_rent)} pro Monat.`
    );

    // Reference rate reduction paragraph
    paragraphs.push(
      `Aufgrund der Senkung des hypothekarischen Referenzzinssatzes von ${formatPercent(contract.reference_rate_contract)} auf ${formatPercent(contract.current_reference_rate)} ersuche ich Sie hiermit um eine entsprechende Anpassung meines Mietzinses gemäss Art. 270a OR.`
    );

    // Calculation result paragraph
    const reductionPercent = formatPercent(calculation.effective_reduction_percent);
    const newRent = formatCurrency(calculation.new_net_rent);
    const savings = formatCurrency(calculation.monthly_savings);

    paragraphs.push(
      `Gemäss der durchgeführten Berechnung ergibt sich eine Reduktion von ${reductionPercent}, was einem neuen Nettomietzins von ${newRent} pro Monat entspricht. Dies bedeutet eine monatliche Reduktion von ${savings}.`
    );

    // Request paragraph
    paragraphs.push(
      `Ich bitte Sie, diese Mietzinssenkung per nächstmöglichem Termin umzusetzen und mir dies schriftlich zu bestätigen.`
    );

    // Cooperation paragraph
    paragraphs.push(
      `Für Rückfragen stehe ich Ihnen gerne zur Verfügung. Ich danke Ihnen für Ihr Verständnis und freue mich auf eine positive Rückmeldung.`
    );

    return paragraphs;
  },

  /**
   * Generate closing
   */
  closing: (): string => {
    return "Mit freundlichen Grüssen";
  },

  /**
   * Generate footer note
   */
  footer: (): string => {
    return "Erstellt mit LexRent – Ihre digitale Unterstützung für Mietrecht in der Schweiz";
  },
};
