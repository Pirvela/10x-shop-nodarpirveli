import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// კლასი, რადგან შეცდომის დაჭერა React-ში მხოლოდ კლასის მეთოდებით შეიძლება
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  // შეცდომისას React ამას იძახებს: ახალი state → fallback დაიხატება
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  // შეცდომის ჩაწერა. ნამდვილ აპში აქ ლოგირების სერვისს (მაგ. Sentry) გავაგზავნიდით
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Caught by ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="py-16 text-center">
          <h1 className="text-4xl font-bold">Something went wrong.</h1>
          <p className="mt-3 text-lg">Try reloading the page.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 rounded-xl border-3 border-ink bg-punch px-6 py-3 text-lg font-bold shadow-brutal transition-all hover:bg-punch-dark active:translate-x-1.5 active:translate-y-1.5 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
