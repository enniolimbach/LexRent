/**
 * Document Agent
 * Generates formal letter text for rental reduction requests
 */

import type { ContractData, CalculationResult } from "@shared/schema";
import { LetterTemplates, type LetterData } from "@/utils/pdfTemplates";

export class DocumentAgent {
  /**
   * Generate letter data from contract and calculation results
   */
  static generateLetterData(
    contractData: ContractData,
    calculationResult: CalculationResult
  ): LetterData {
    // Parse tenant address into components
    const addressParts = contractData.address?.split(",") || [];
    const street = addressParts[0]?.trim() || "";
    const city = addressParts[1]?.trim() || contractData.kanton || "";

    // Create letter data structure
    const letterData: LetterData = {
      tenant: {
        name: contractData.name || "Mieter",
        address: street,
        city: city,
      },
      landlord: {
        name: contractData.management || undefined,
        address: undefined,
      },
      contract: {
        property_address: contractData.property_address || street,
        net_rent: contractData.net_rent,
        reference_rate_contract: contractData.reference_rate_contract,
        current_reference_rate: contractData.current_reference_rate,
      },
      calculation: {
        effective_reduction_percent: calculationResult.effectiveReductionPercent,
        new_net_rent: calculationResult.newRent,
        monthly_savings: calculationResult.monthlySavings,
      },
      date: this.formatDate(new Date()),
    };

    return letterData;
  }

  /**
   * Generate complete letter text
   */
  static generateLetterText(letterData: LetterData): {
    subject: string;
    salutation: string;
    paragraphs: string[];
    closing: string;
    footer: string;
  } {
    return {
      subject: LetterTemplates.subject(),
      salutation: LetterTemplates.salutation(letterData.landlord.name),
      paragraphs: LetterTemplates.mainBody(letterData),
      closing: LetterTemplates.closing(),
      footer: LetterTemplates.footer(),
    };
  }

  /**
   * Format date in Swiss German format
   */
  private static formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleDateString("de-CH", { month: "long" });
    const year = date.getFullYear();
    return `${day}. ${month} ${year}`;
  }
}
