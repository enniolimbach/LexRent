import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, Send } from "lucide-react";
import type { DialogQuestion } from "@shared/schema";

interface QuestionCardProps {
  question: DialogQuestion;
  onAnswer: (answer: string) => void;
  isProcessing?: boolean;
}

export function QuestionCard({ question, onAnswer, isProcessing = false }: QuestionCardProps) {
  const [answer, setAnswer] = useState("");
  const [selectValue, setSelectValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalAnswer = question.type === "select" ? selectValue : answer;
    
    if (!finalAnswer || finalAnswer.trim() === "") return;
    
    onAnswer(finalAnswer);
    setAnswer("");
    setSelectValue("");
  };

  const handleBooleanAnswer = (value: boolean) => {
    onAnswer(value ? "ja" : "nein");
  };

  return (
    <Card className="shadow-md border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1" data-testid="text-question">
              {question.question}
            </h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {question.type === "text" && (
            <div>
              <Label htmlFor="answer-input" className="sr-only">
                Ihre Antwort
              </Label>
              <Input
                id="answer-input"
                type="text"
                placeholder={question.placeholder || "Ihre Antwort..."}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={isProcessing}
                data-testid="input-answer"
                className="text-base"
              />
            </div>
          )}

          {question.type === "boolean" && (
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => handleBooleanAnswer(true)}
                disabled={isProcessing}
                data-testid="button-yes"
              >
                Ja
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => handleBooleanAnswer(false)}
                disabled={isProcessing}
                data-testid="button-no"
              >
                Nein
              </Button>
            </div>
          )}

          {question.type === "select" && question.options && (
            <div>
              <Label htmlFor="answer-select" className="sr-only">
                {question.placeholder || "Auswählen"}
              </Label>
              <Select
                value={selectValue}
                onValueChange={setSelectValue}
                disabled={isProcessing}
              >
                <SelectTrigger id="answer-select" data-testid="select-answer">
                  <SelectValue placeholder={question.placeholder || "Auswählen..."} />
                </SelectTrigger>
                <SelectContent>
                  {question.options.map((option) => (
                    <SelectItem key={option} value={option} data-testid={`option-${option}`}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(question.type === "text" || question.type === "select") && (
            <Button
              type="submit"
              className="w-full"
              disabled={isProcessing || (question.type === "text" ? !answer.trim() : !selectValue)}
              data-testid="button-submit-answer"
            >
              <Send className="w-4 h-4 mr-2" />
              Antwort senden
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
