import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { extractContractData } from "./agents/ocrAgent";
import { contractDataSchema } from "@shared/schema";

// Configure multer for file uploads (memory storage for processing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for contract upload and OCR extraction
  app.post('/api/upload-contract', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          error: 'No file uploaded' 
        });
      }

      console.log(`[API] Received file: ${req.file.originalname}`);

      // Extract contract data using OCR agent
      const extractedData = await extractContractData(
        req.file.buffer,
        req.file.originalname
      );

      // Validate extracted data
      const validationResult = contractDataSchema.safeParse(extractedData);
      
      if (!validationResult.success) {
        console.error('[API] Validation error:', validationResult.error);
        return res.status(500).json({ 
          error: 'Data extraction failed validation',
          details: validationResult.error.errors 
        });
      }

      console.log('[API] Successfully extracted and validated contract data');

      res.json({
        success: true,
        data: validationResult.data,
      });
    } catch (error) {
      console.error('[API] Error processing upload:', error);
      res.status(500).json({ 
        error: 'Failed to process file',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
