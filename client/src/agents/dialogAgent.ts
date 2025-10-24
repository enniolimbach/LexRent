import type { ContractData, DialogQuestion, DialogState } from "@shared/schema";
import { DialogField } from "@shared/schema";
import { getMissingFields } from "@/utils/validation";

/**
 * Dialog Agent - State machine for interactive question flow
 * Manages the conversation to collect missing contract data
 */

// Question templates for each field
const QUESTIONS: Record<DialogField, DialogQuestion> = {
  [DialogField.LAST_INCREASE]: {
    field: DialogField.LAST_INCREASE,
    question: "Wann wurde Ihr Mietzins zuletzt angepasst?",
    type: "text",
    placeholder: "z.B. 01.01.2023 oder 'keine'",
  },
  [DialogField.IMPROVEMENTS]: {
    field: DialogField.IMPROVEMENTS,
    question: "Gab es seither bauliche Verbesserungen am Gebäude?",
    type: "boolean",
  },
  [DialogField.KANTON]: {
    field: DialogField.KANTON,
    question: "In welchem Kanton befindet sich die Mietwohnung?",
    type: "select",
    options: [
      "Zürich", "Bern", "Luzern", "Uri", "Schwyz", "Obwalden", "Nidwalden",
      "Glarus", "Zug", "Freiburg", "Solothurn", "Basel-Stadt", "Basel-Landschaft",
      "Schaffhausen", "Appenzell Ausserrhoden", "Appenzell Innerrhoden", "St. Gallen",
      "Graubünden", "Aargau", "Thurgau", "Tessin", "Waadt", "Wallis", "Neuenburg",
      "Genf", "Jura"
    ],
    placeholder: "Kanton auswählen",
  },
  [DialogField.GROSS_RENT]: {
    field: DialogField.GROSS_RENT,
    question: "Wie hoch ist Ihr Bruttomietzins (inkl. Nebenkosten)?",
    type: "text",
    placeholder: "z.B. 2650",
  },
  [DialogField.ZIEL]: {
    field: DialogField.ZIEL,
    question: "Was möchten Sie tun?",
    type: "select",
    options: ["nur Prüfung", "Brief"],
    placeholder: "Ziel auswählen",
  },
};

export class DialogAgent {
  private contractData: Partial<ContractData>;
  private state: DialogState;

  constructor(initialData: Partial<ContractData>) {
    this.contractData = { ...initialData };
    const missingFields = getMissingFields(this.contractData);
    
    this.state = {
      currentField: missingFields.length > 0 ? missingFields[0] : null,
      missingFields,
      completedFields: [],
      totalQuestions: missingFields.length,
      currentQuestionIndex: 0,
      isComplete: missingFields.length === 0,
    };
  }

  /**
   * Get current question to display
   */
  getCurrentQuestion(): DialogQuestion | null {
    if (!this.state.currentField) return null;
    return QUESTIONS[this.state.currentField];
  }

  /**
   * Process user's answer and move to next question
   * Returns result indicating if answer was accepted
   */
  processAnswer(answer: string): { accepted: boolean; error?: string } {
    if (!this.state.currentField) {
      return { accepted: false, error: "Keine aktive Frage" };
    }

    // Update contract data based on field type
    const question = QUESTIONS[this.state.currentField];
    
    switch (question.type) {
      case "boolean":
        const boolValue = answer.toLowerCase().includes("ja") || 
                         answer.toLowerCase().includes("yes") ||
                         answer.toLowerCase() === "true";
        (this.contractData as any)[this.state.currentField] = boolValue;
        break;
      
      case "text":
        if (this.state.currentField === DialogField.LAST_INCREASE) {
          // Handle "keine" or actual date
          (this.contractData as any)[this.state.currentField] = 
            answer.toLowerCase().includes("keine") ? null : answer;
        } else if (this.state.currentField === DialogField.GROSS_RENT) {
          // Parse as number with validation
          const numValue = parseFloat(answer.replace(/[^\d.]/g, ''));
          if (isNaN(numValue) || numValue <= 0) {
            return { 
              accepted: false, 
              error: "Bitte geben Sie einen gültigen Betrag ein (z.B. 2650)." 
            };
          }
          (this.contractData as any)[this.state.currentField] = numValue;
        } else {
          (this.contractData as any)[this.state.currentField] = answer;
        }
        break;
      
      case "select":
        // Validate that answer is in options
        if (question.options && !question.options.includes(answer)) {
          return {
            accepted: false,
            error: "Bitte wählen Sie eine der verfügbaren Optionen."
          };
        }
        (this.contractData as any)[this.state.currentField] = answer;
        break;
    }

    // Mark field as completed
    this.state.completedFields.push(this.state.currentField);
    this.state.currentQuestionIndex++;

    // Move to next missing field
    const remainingFields = this.state.missingFields.filter(
      field => !this.state.completedFields.includes(field)
    );

    if (remainingFields.length > 0) {
      this.state.currentField = remainingFields[0];
    } else {
      this.state.currentField = null;
      this.state.isComplete = true;
    }

    return { accepted: true };
  }

  /**
   * Get current dialog state
   */
  getState(): DialogState {
    return { ...this.state };
  }

  /**
   * Get updated contract data
   */
  getContractData(): Partial<ContractData> {
    return { ...this.contractData };
  }

  /**
   * Get progress information
   */
  getProgress(): { current: number; total: number; percentage: number } {
    return {
      current: this.state.currentQuestionIndex,
      total: this.state.totalQuestions,
      percentage: this.state.totalQuestions > 0 
        ? Math.round((this.state.currentQuestionIndex / this.state.totalQuestions) * 100)
        : 100,
    };
  }

  /**
   * Check if dialog is complete
   */
  isComplete(): boolean {
    return this.state.isComplete;
  }
}
