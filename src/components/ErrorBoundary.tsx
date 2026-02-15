import React from 'react';

type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('Uncaught error in component tree', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-3">Application error</h2>
          <pre className="bg-surface p-3 rounded text-sm overflow-auto">{String(this.state.error)}</pre>
          <p className="text-sm text-muted-foreground mt-3">Check the browser console for stack traces.</p>
        </div>
      );
    }
    // @ts-ignore
    return this.props.children;
  }
}

export default ErrorBoundary;
