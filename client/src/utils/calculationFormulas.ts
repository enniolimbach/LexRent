/**
 * Swiss Rental Law Calculation Formulas (Art. 270a OR)
 * 
 * These formulas calculate potential rent reductions based on:
 * - Reference interest rate changes (Referenzzinssatz)
 * - Cost increases (Kostensteigerungen)
 * - Inflation (Teuerung/LIK)
 */

/**
 * Calculate interest rate differential
 * 
 * @param oldRate - Reference rate at contract signing
 * @param currentRate - Current reference rate
 * @returns Difference in percentage points
 */
export function calculateRateDifferential(oldRate: number, currentRate: number): number {
  return oldRate - currentRate;
}

/**
 * Calculate rent reduction percentage from interest rate change
 * Swiss formula: (Δ rate / 0.25) × 2.91%
 * 
 * For every 0.25% change in reference rate, rent can change by ±2.91%
 * 
 * @param rateDifferential - Difference in reference rates
 * @returns Reduction percentage
 */
export function calculateInterestReduction(rateDifferential: number): number {
  return (rateDifferential / 0.25) * 2.91;
}

/**
 * Calculate cost increases over time
 * 
 * @param yearsSinceLastAdjustment - Years since last rent adjustment
 * @param costIncreasePerYear - Estimated cost increase percentage per year
 * @returns Total cost increase percentage
 */
export function calculateCostIncrease(
  yearsSinceLastAdjustment: number,
  costIncreasePerYear: number
): number {
  return yearsSinceLastAdjustment * costIncreasePerYear;
}

/**
 * Calculate inflation adjustment based on Swiss consumer price index (LIK)
 * Formula: LIK difference × 0.4
 * 
 * @param inflationSinceContract - Total inflation percentage since contract
 * @returns Inflation adjustment percentage
 */
export function calculateInflationAdjustment(inflationSinceContract: number): number {
  return inflationSinceContract * 0.4;
}

/**
 * Calculate effective rent reduction
 * Formula: Interest reduction - (Cost increase + Inflation)
 * 
 * @param interestReduction - Reduction from rate change
 * @param costIncrease - Cost increases over time
 * @param inflationAdjustment - Inflation adjustment
 * @returns Net reduction percentage (can be negative)
 */
export function calculateEffectiveReduction(
  interestReduction: number,
  costIncrease: number,
  inflationAdjustment: number
): number {
  return interestReduction - (costIncrease + inflationAdjustment);
}

/**
 * Calculate new rent amount
 * 
 * @param currentRent - Current net rent
 * @param reductionPercent - Effective reduction percentage
 * @returns New rent amount
 */
export function calculateNewRent(currentRent: number, reductionPercent: number): number {
  return currentRent * (1 - reductionPercent / 100);
}

/**
 * Calculate years between two dates
 * 
 * @param fromDate - Start date (ISO string)
 * @param toDate - End date (ISO string), defaults to today
 * @returns Years (decimal)
 */
export function calculateYearsBetween(fromDate: string, toDate?: string): number {
  const from = new Date(fromDate);
  const to = toDate ? new Date(toDate) : new Date();
  
  const diffMs = to.getTime() - from.getTime();
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  
  return Math.max(0, diffYears);
}

/**
 * Determine reference date for last adjustment
 * Returns either last_increase date or contract_date
 * 
 * @param contractDate - Original contract date
 * @param lastIncrease - Date of last increase (null if none)
 * @returns Most recent adjustment date
 */
export function determineLastAdjustmentDate(
  contractDate: string,
  lastIncrease: string | null
): string {
  return lastIncrease || contractDate;
}
