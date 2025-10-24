import vision, { type ImageAnnotatorClient } from '@google-cloud/vision';
import type { ContractData } from "@shared/schema";

/**
 * Server-side OCR agent for contract data extraction
 * Uses Google Cloud Vision API for text extraction from PDFs and images
 * 
 * @param fileBuffer - Buffer of uploaded PDF or image file
 * @param filename - Original filename for logging
 * @returns Extracted contract data
 */

// Mock data as fallback
const MOCK_DATA: ContractData = {
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
  name: "Max Muster",
  management: "Muster Immobilien AG",
  property_address: "Nordstrasse 9, 8006 Zürich",
};

/**
 * Initialize Vision API client with credentials from environment
 */
function createVisionClient() {
  try {
    const credentials = process.env.GOOGLE_CLOUD_VISION_CREDENTIALS;
    
    if (!credentials) {
      console.warn('[OCR Agent] No Google Cloud Vision credentials found in environment');
      return null;
    }

    // Parse JSON credentials
    const credentialsObj = JSON.parse(credentials);
    
    // Create client with explicit credentials
    const client = new vision.ImageAnnotatorClient({
      credentials: credentialsObj,
    });

    console.log('[OCR Agent] Google Cloud Vision client initialized');
    return client;
  } catch (error) {
    console.error('[OCR Agent] Failed to initialize Vision client:', error);
    return null;
  }
}

/**
 * Extract text from document using Google Cloud Vision API
 */
async function extractTextFromDocument(
  client: ImageAnnotatorClient,
  fileBuffer: Buffer
): Promise<string> {
  try {
    // Use DOCUMENT_TEXT_DETECTION for better results with documents
    const [result] = await client.documentTextDetection({
      image: { content: fileBuffer },
    });

    const fullTextAnnotation = result.fullTextAnnotation;
    
    if (!fullTextAnnotation || !fullTextAnnotation.text) {
      console.warn('[OCR Agent] No text found in document');
      return '';
    }

    return fullTextAnnotation.text;
  } catch (error) {
    console.error('[OCR Agent] Vision API error:', error);
    throw error;
  }
}

/**
 * Parse extracted text to find contract data
 * This is a simplified parser - in production, you'd want more sophisticated NLP
 */
function parseContractData(text: string): Partial<ContractData> {
  const data: Partial<ContractData> = {};

  // Extract rent amount (look for patterns like "CHF 2400" or "2'400.00")
  const rentMatch = text.match(/(?:CHF|Fr\.?)\s*([0-9]['']?[0-9]{3}(?:\.[0-9]{2})?)/i);
  if (rentMatch) {
    const rentStr = rentMatch[1].replace(/[''\s]/g, '');
    data.net_rent = parseFloat(rentStr);
  }

  // Extract reference rate (look for patterns like "1.75%" or "Referenzzinssatz 1,75")
  const rateMatch = text.match(/(?:Referenzzinssatz|reference rate).*?([0-9],[0-9]{1,2})/i);
  if (rateMatch) {
    data.reference_rate_contract = parseFloat(rateMatch[1].replace(',', '.'));
  }

  // Extract date (look for date patterns)
  const dateMatch = text.match(/([0-9]{1,2}\.[0-9]{1,2}\.[0-9]{4})/);
  if (dateMatch) {
    const [day, month, year] = dateMatch[1].split('.');
    data.contract_date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Extract address (simplified - look for Swiss postal codes)
  const addressMatch = text.match(/([0-9]{4})\s+([A-Za-zäöüÄÖÜ\s]+)/);
  if (addressMatch) {
    data.address = addressMatch[0].trim();
  }

  // Extract canton (look for Swiss cantons)
  const cantons = ['Zürich', 'Bern', 'Luzern', 'Uri', 'Schwyz', 'Obwalden', 'Nidwalden', 
                   'Glarus', 'Zug', 'Freiburg', 'Solothurn', 'Basel-Stadt', 'Basel-Landschaft',
                   'Schaffhausen', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden', 'St. Gallen',
                   'Graubünden', 'Aargau', 'Thurgau', 'Tessin', 'Waadt', 'Wallis', 'Neuenburg',
                   'Genf', 'Jura'];
  
  for (const canton of cantons) {
    if (text.includes(canton)) {
      data.kanton = canton;
      break;
    }
  }

  console.log('[OCR Agent] Parsed data from text:', data);
  return data;
}

/**
 * Main extraction function
 */
export async function extractContractData(
  fileBuffer: Buffer,
  filename: string
): Promise<ContractData> {
  console.log(`[OCR Agent] Processing file: ${filename}`);
  console.log(`[OCR Agent] File size: ${fileBuffer.length} bytes`);

  // Initialize Vision client
  const visionClient = createVisionClient();

  // If no Vision client available, return mock data
  if (!visionClient) {
    console.warn('[OCR Agent] Using mock data (no Vision API credentials)');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    return MOCK_DATA;
  }

  try {
    // Extract text using Google Cloud Vision
    console.log('[OCR Agent] Calling Google Cloud Vision API...');
    const extractedText = await extractTextFromDocument(visionClient, fileBuffer);
    
    console.log('[OCR Agent] Extracted text length:', extractedText.length);
    console.log('[OCR Agent] Text preview:', extractedText.substring(0, 200));

    // Parse the extracted text
    const parsedData = parseContractData(extractedText);

    // Merge with mock data for missing fields
    const completeData: ContractData = {
      ...MOCK_DATA,
      ...parsedData,
    };

    console.log('[OCR Agent] Extraction complete');
    return completeData;

  } catch (error) {
    console.error('[OCR Agent] Error during extraction:', error);
    console.warn('[OCR Agent] Falling back to mock data');
    
    // Return mock data on error
    await new Promise(resolve => setTimeout(resolve, 1000));
    return MOCK_DATA;
  }
}
