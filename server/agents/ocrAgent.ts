import type { ContractData } from "@shared/schema";

/**
 * Server-side OCR agent for contract data extraction
 * Mock implementation for Phase 1 - returns sample data
 * 
 * Future implementation will integrate with:
 * - Google Cloud Vision API for OCR
 * - Tesseract.js for local OCR
 * - Azure Form Recognizer for structured data extraction
 * 
 * @param fileBuffer - Buffer of uploaded PDF or image file
 * @param filename - Original filename for logging
 * @returns Extracted contract data
 */
export async function extractContractData(
  fileBuffer: Buffer,
  filename: string
): Promise<ContractData> {
  // Simulate OCR processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log(`[OCR Agent] Processing file: ${filename}`);
  console.log(`[OCR Agent] File size: ${fileBuffer.length} bytes`);

  // Mock data for Phase 1
  // In production, this would analyze the actual file content
  const extractedData: ContractData = {
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
    // Phase 4 - Additional fields for letter generation
    name: "Max Muster",
    management: "Muster Immobilien AG",
    property_address: "Nordstrasse 9, 8006 Zürich",
  };

  console.log("[OCR Agent] Extraction complete (mock data)");

  return extractedData;
}
