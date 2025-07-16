import { Component } from 'react';
import s from './errorBoundary.module.scss';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import logError from '../../../services/api/errorLogger';
import { message } from '../globalComponents/CustomToast';
import logout from '../../../helpers/logout';

const extractErrorDetails = (componentStack) => {
	if (!componentStack) {
		return { component: 'Unknown', path: 'Unknown' };
	}
	const lines = componentStack.trim().split('\n');
	const firstFrame = lines.find((line) => line.includes('at') && line.includes('src/'));

	if (!firstFrame) {
		return { component: 'Unknown', path: 'Unknown' };
	}

	const componentMatch = firstFrame.match(/at (\w+)/);
	const fullPathMatch = firstFrame.match(/http:\/\/localhost:\d+(\/src\/[^?\s\)]+)/);

	return {
		component: componentMatch ? componentMatch[1] : 'Unknown',
		path: fullPathMatch ? fullPathMatch[1] : 'Unknown',
	};
};

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
		const { component, path } = extractErrorDetails(errorInfo?.componentStack);
		const payload = {
			errorType: error.name,
			errorMessage: error.message,
			errorPath: path,
			errorComponent: component,
			errorComponentStack: errorInfo?.componentStack || 'Not Available',
		};
		const success = logError(payload);
		if (success) {
			message.error(
				'This issue was reported to the support team. We will get back to you soon!',
			);
		} else {
			console.error('Error logging failed');
		}
		if (error instanceof TypeError) {
			// perform hard reload on errors caused by lazy loading
			const isLazyLoadingErr =
				error.message.includes('Failed to fetch dynamically imported module') ||
				error.message.includes(`'text/html' is not a valid JavaScript MIME type`);
			if (isLazyLoadingErr) window.location.reload(true);
		}
	}

	render() {
		const { hasError } = this.state;
		const { fallback } = this.props;

		if (hasError) {
			return (
				fallback || (
					<div className={s.errorBoundaryContainer}>
						<div className={s.header}>
							<div className={s.logo}>
								<VeLogo />
							</div>
						</div>
						<div className={s.errorContent}>
							<div className={s.errContainer}>
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
									<a href="/home">Home</a>
								</button>
								<button className={s.errorButton} onClick={() => logout()}>
									<span>Logout</span>
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
