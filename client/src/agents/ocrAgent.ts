import type { ContractData } from "@shared/schema";

/**
 * Mock OCR agent that simulates contract data extraction
 * In production, this would connect to an OCR API (e.g., Google Cloud Vision, Tesseract)
 * 
 * @param file - The uploaded PDF or image file
 * @returns Extracted contract data as structured JSON
 */
export async function extractContractData(file: File): Promise<ContractData> {
  // Simulate processing delay (real OCR would take 2-5 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock data - in production, this would be extracted via OCR
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

  // Log for debugging
  console.log("OCR Agent: Extracted data from file:", file.name);
  console.log("OCR Agent: Mock data:", mockData);

  return mockData;
}
