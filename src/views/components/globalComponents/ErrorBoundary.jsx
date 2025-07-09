import { Component } from 'react';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error('Error caught in ErrorBoundary:', error, errorInfo);
		if (
			error instanceof TypeError &&
			error.message.includes('Failed to fetch dynamically imported module')
		) {
			console.warn('Detected dynamic import network failure. Reloading...');
			window.location.reload(true); // hard reload to clear chunk cache
		}
	}

	render() {
		const { hasError } = this.state;
		const { fallback } = this.props;

		if (hasError) {
			return (
				fallback || (
					<div style={{ padding: '2rem', textAlign: 'center' }}>
						<h2>Something went wrong.</h2>
						<p>Please refresh the page or contact support if the issue persists.</p>
					</div>
				)
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
