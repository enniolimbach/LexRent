import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QuestionCard } from "./QuestionCard";
import { Bot, User, CheckCircle2 } from "lucide-react";
import type { DialogMessage, DialogQuestion } from "@shared/schema";

interface ChatInterfaceProps {
  messages: DialogMessage[];
  currentQuestion: DialogQuestion | null;
  onAnswer: (answer: string) => void;
  progress: { current: number; total: number; percentage: number };
  isComplete: boolean;
}

export function ChatInterface({
  messages,
  currentQuestion,
  onAnswer,
  progress,
  isComplete,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-2xl font-semibold">
            Fehlende Angaben ergänzen
          </CardTitle>
          <Badge variant="secondary" data-testid="badge-progress">
            {progress.current} / {progress.total} Fragen
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Fortschritt</span>
            <span data-testid="text-percentage">{progress.percentage}%</span>
          </div>
          <Progress value={progress.percentage} className="h-2" data-testid="progress-bar" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Messages Display */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2" data-testid="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === "answer" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type !== "answer" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.type === "answer"
                    ? "bg-primary text-primary-foreground"
                    : message.type === "system"
                    ? "bg-accent/50 text-accent-foreground border border-accent"
                    : "bg-muted text-muted-foreground"
                }`}
                data-testid={`message-${message.type}`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>

              {message.type === "answer" && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <User className="w-4 h-4 text-accent-foreground" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Current Question or Completion Message */}
        <div className="pt-2">
          {isComplete ? (
            <Card className="border-green-500/50 bg-green-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-lg mb-1" data-testid="text-complete">
                      Alle Angaben vollständig!
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Sie können jetzt die Berechnung starten oder die Zusammenfassung ansehen.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : currentQuestion ? (
            <QuestionCard
              question={currentQuestion}
              onAnswer={onAnswer}
              data-testid="question-card"
            />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
