import { Component, type ErrorInfo, type ReactNode } from 'react'

/**
 * Last line of defence. A single render throw inside a section would otherwise
 * unmount the whole tree and leave a blank white page with no explanation.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    if (this.props.fallback) return this.props.fallback

    return (
      <div className="grid min-h-screen place-items-center bg-ink-950 px-6 text-center">
        <div className="max-w-md">
          <p className="font-mono text-[11px] tracking-[0.2em] text-nv-400 uppercase">
            Runtime error
          </p>
          <h1 className="mt-4 font-display text-3xl font-extrabold text-mist-100">
            Something broke while rendering.
          </h1>
          <pre className="mt-6 overflow-auto rounded-xl border border-nv-400/20 bg-ink-900 p-4 text-left font-mono text-xs text-mist-300">
            {this.state.error.message}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 rounded-full bg-nv-400 px-6 py-3 font-semibold text-ink-950 transition-colors hover:bg-nv-300"
          >
            Reload the page
          </button>
        </div>
      </div>
    )
  }
}
