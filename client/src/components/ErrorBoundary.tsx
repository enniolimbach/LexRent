/**
 * Error Boundary Component
 * Catches React errors and displays friendly error message
 */

import { Component, ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-lg border-destructive/50" data-testid="error-boundary">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <CardTitle>Ein Fehler ist aufgetreten</CardTitle>
                  <CardDescription>
                    Die Anwendung hat einen unerwarteten Fehler festgestellt
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Fehlerdetails:</p>
                <code className="text-xs break-all">
                  {this.state.error?.message || "Unbekannter Fehler"}
                </code>
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  Wir entschuldigen uns für die Unannehmlichkeiten. Bitte versuchen Sie Folgendes:
                </p>
                <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Laden Sie die Seite neu</li>
                  <li>Löschen Sie den Browser-Cache</li>
                  <li>Versuchen Sie es zu einem späteren Zeitpunkt erneut</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button onClick={this.handleReset} className="flex-1" data-testid="button-reset-error">
                  Zur Startseite
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  data-testid="button-reload"
                >
                  Neu laden
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
