import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 *
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details to console
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Update state with error details
    this.state = {
      hasError: true,
      error,
      errorInfo,
    };

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReload = (): void => {
    // Reload the page to recover from error
    window.location.reload();
  };

  handleGoHome = (): void => {
    // Navigate to home page
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-brand-nude flex items-center justify-center px-6">
          <div className="max-w-2xl w-full">
            <div className="bg-white p-12 shadow-2xl text-center">
              {/* Error Icon */}
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h1 className="text-3xl font-serif text-brand-dark mb-4">
                Oops! Something went wrong
              </h1>

              <p className="text-brand-dark/60 mb-8 leading-relaxed">
                We're sorry for the inconvenience. An unexpected error occurred while loading this page.
                Please try refreshing, or return to our homepage.
              </p>

              {/* Error Details (Only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-8 text-left bg-red-50 p-4 rounded border border-red-200">
                  <summary className="cursor-pointer font-bold text-red-800 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="text-xs text-red-700 space-y-2">
                    <p className="font-mono break-all">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="overflow-auto max-h-64 bg-white p-2 rounded text-[10px]">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReload}
                  className="bg-brand-gold text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-brand-dark transition-colors"
                >
                  Refresh Page
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="bg-brand-dark text-white px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-colors"
                >
                  Go to Homepage
                </button>
              </div>

              {/* Support Information */}
              <div className="mt-12 pt-8 border-t border-brand-accent">
                <p className="text-xs text-brand-dark/40 uppercase tracking-widest mb-2">
                  Need Help?
                </p>
                <p className="text-sm text-brand-dark/60">
                  Contact us at{' '}
                  <a
                    href="tel:+6582926388"
                    className="text-brand-gold hover:underline"
                  >
                    +65 8292 6388
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
