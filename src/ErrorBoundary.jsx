import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Overload crashed:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: 24,
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
            color: '#1A1A1A',
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 800 }}>Something went wrong</div>
          <div style={{ fontSize: 14, color: '#4A4A4A' }}>
            Try reloading the page. Your data is safe.
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8,
              padding: '12px 24px',
              background: '#2C2C2C',
              color: 'white',
              border: 'none',
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
