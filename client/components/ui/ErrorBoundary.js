'use client';

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center p-5">
          <div className="mb-3" style={{ fontSize: 48 }}>⚠️</div>
          <h4>Something went wrong</h4>
          <p className="text-muted">{this.state.error?.message}</p>
          <button
            className="btn btn-saylani mt-3"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
