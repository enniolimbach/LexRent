import type { ContractData } from "@shared/schema";
import { DialogField } from "@shared/schema";

/**
 * Detects which required fields are missing from contract data
 * Used to determine which questions to ask in the dialog flow
 * 
 * @param data - Partial contract data from OCR
 * @returns Array of missing field identifiers
 */
export function getMissingFields(data: Partial<ContractData>): DialogField[] {
  const missing: DialogField[] = [];

  // Check last_increase
  if (data.last_increase === undefined || data.last_increase === null) {
    missing.push(DialogField.LAST_INCREASE);
  }

  // Check improvements
  if (data.improvements === undefined) {
    missing.push(DialogField.IMPROVEMENTS);
  }

  // Check kanton (if not extractable from address)
  if (!data.kanton || data.kanton.trim() === "") {
    missing.push(DialogField.KANTON);
  }

  // Check gross_rent (optional but helpful)
  if (!data.gross_rent) {
    missing.push(DialogField.GROSS_RENT);
  }

  // Check ziel (user's goal)
  if (!data.ziel) {
    missing.push(DialogField.ZIEL);
  }

  return missing;
}

/**
 * Validates if contract data is complete enough for calculation
 * 
 * @param data - Contract data to validate
 * @returns True if all required fields are present
 */
export function isContractDataComplete(data: Partial<ContractData>): boolean {
  const required = [
    'net_rent',
    'reference_rate_contract',
    'contract_date',
    'address',
    'kanton',
    'current_reference_rate',
    'inflation_since_contract',
    'cost_increase_per_year',
  ];

  return required.every(field => {
    const value = data[field as keyof ContractData];
    return value !== undefined && value !== null && value !== '';
  });
}

/**
 * Calculates completion percentage
 * 
 * @param totalFields - Total number of fields to collect
 * @param missingFields - Number of fields still missing
 * @returns Percentage (0-100)
 */
export function calculateProgress(totalFields: number, missingFields: number): number {
  if (totalFields === 0) return 100;
  const completed = totalFields - missingFields;
  return Math.round((completed / totalFields) * 100);
}
