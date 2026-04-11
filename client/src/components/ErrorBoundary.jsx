import React from 'react';

/**
 * Global Error Boundary Component.
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the app.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service like Sentry
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Premium fallback UI
      return (
        <div className="min-h-screen bg-[#050804] flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-[#0a0f08] border border-[#d4ff00]/10 rounded-2xl p-8 shadow-2xl">
            <div className="w-16 h-16 bg-[#d4ff00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-[#d4ff00] text-3xl">warning</span>
            </div>
            <h1 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase italic">
              Something went wrong
            </h1>
            <p className="text-neutral-400 mb-8 text-sm leading-relaxed">
              BettingBread encountered an unexpected error. Don't worry, your data 
              is safe. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-[#d4ff00] text-black font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 uppercase tracking-widest text-xs"
            >
              Refresh App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
