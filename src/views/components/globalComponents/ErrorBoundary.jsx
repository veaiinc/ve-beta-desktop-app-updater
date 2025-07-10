import { Component } from 'react';
import s from './errorBoundary.module.scss';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
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
			window.location.reload(true);
		}

		if (
			error instanceof TypeError &&
			error.message.includes(`'text/html' is not a valid JavaScript MIME type`)
		) {
			console.warn('Detected invalid MIME type from dynamic import. Reloading...');
			window.location.reload(true);
		}
	}

	render() {
		const { hasError } = this.state;
		const { fallback } = this.props;

		if (hasError) {
			return (
				fallback || (
					<div className={s.errorBoundaryWrapper}>
						<div className={s.header}>
							<div className={s.logo}>
								<VeLogo />
							</div>
						</div>
						<div className={s.errorContent}>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: '20px',
								}}
							>
								<h2 className={s.errorTitle}>Something went wrong.</h2>
								<p className={s.errorText}>
									Please refresh the page or contact support if the issue
									persists.
								</p>
							</div>
							<div className={s.errorActions}>
								<button
									className={s.errorButton}
									onClick={() => window.location.reload(true)}
								>
									Refresh
								</button>
								<button className={s.errorButton}>
									<a href="mailto:support@ve.ai">Contact Support</a>
								</button>
							</div>
						</div>
						<footer className={s.footer}>
							Need Help? Contact our support team at{' '}
							<a href="mailto:support@ve.ai" className={s.footerLink}>
								support@ve.ai
							</a>
						</footer>
					</div>
				)
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
