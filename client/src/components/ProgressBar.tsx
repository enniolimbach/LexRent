/**
 * Progress Bar Component
 * Shows user journey steps: Upload → Dialog → Calculation → Letter
 */

import { CheckCircle2, FileUp, MessageSquare, Calculator, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "upload" | "dialog" | "summary" | "calculation" | "letter";

interface ProgressBarProps {
  currentStep: Step;
  className?: string;
}

const steps = [
  {
    id: "upload" as Step,
    label: "Vertrag hochladen",
    icon: FileUp,
  },
  {
    id: "dialog" as Step,
    label: "Angaben vervollständigen",
    icon: MessageSquare,
  },
  {
    id: "calculation" as Step,
    label: "Berechnung durchführen",
    icon: Calculator,
  },
  {
    id: "letter" as Step,
    label: "Schreiben erstellen",
    icon: FileText,
  },
];

export function ProgressBar({ currentStep, className }: ProgressBarProps) {
  // Map summary to calculation for display purposes
  const displayStep = currentStep === "summary" ? "calculation" : currentStep;
  
  const currentStepIndex = steps.findIndex(step => step.id === displayStep);

  return (
    <div className={cn("w-full py-6", className)} data-testid="progress-bar">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted hidden sm:block">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center flex-1"
                  data-testid={`progress-step-${step.id}`}
                >
                  {/* Icon circle */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 mb-2 bg-background",
                      isCompleted && "border-primary bg-primary text-primary-foreground",
                      isCurrent && "border-primary bg-background text-primary ring-4 ring-primary/20",
                      !isCompleted && !isCurrent && "border-muted-foreground/30 text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className={cn(
                      "text-xs sm:text-sm text-center max-w-[80px] sm:max-w-none transition-colors",
                      isCurrent && "font-semibold text-foreground",
                      isCompleted && "text-foreground",
                      !isCompleted && !isCurrent && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
