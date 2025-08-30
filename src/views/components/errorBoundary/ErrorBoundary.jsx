import { Component } from 'react';
import s from './errorBoundary.module.scss';
import { ReactComponent as VeLogo } from '../../../assets/svg/veLogo.svg';
import logError from '../../../helpers/errorLogger';
import logout from '../../../helpers/logout';
import PageLoader from '../../features/app/PageLoader';

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
		this.state = {
			hasError: false,
			error: null,
			isLazyLoadingError: false,
		};
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	async componentDidCatch(error, errorInfo) {
		console.error('Error caught in ErrorBoundary:', error, errorInfo);
		const { component, path } = extractErrorDetails(errorInfo?.componentStack);
		// It happens if you are on a page and you release a new version. The file that contains the dynamically imported module, does not exist anymore (https://stackoverflow.com/questions/72376333/failed-to-fetch-dynamically-imported-module)
		// Logic for lazy-loading errors:
		// - Failed dynamic import
		// - Invalid MIME type
		// - Suspense in component stack
		const isLazyLoadingErr =
			(error instanceof TypeError &&
				(error.message.includes('Failed to fetch dynamically imported module') ||
					error.message.includes(`'text/html' is not a valid JavaScript MIME type`))) ||
			(errorInfo?.componentStack && errorInfo.componentStack.includes('Suspense'));

		if (isLazyLoadingErr) {
			this.setState({ isLazyLoadingError: true });

			setTimeout(() => {
				// window.location.reload(true);
			}, 300);
			return;
		}

		if (window.location.hostname !== 'localhost') {
			const payload = {
				errorType: error.name,
				errorMessage: error.message,
				errorPath: path,
				errorComponent: component,
				errorComponentStack: errorInfo?.componentStack || 'Not Available',
			};

			if (isLazyLoadingErr) return;
			const success = await logError(payload);
			if (success) {
				console.log('Error logged successfully');
			} else {
				console.error('Error logging failed');
			}
		}
	}

	render() {
		const { hasError, isLazyLoadingError } = this.state;
		const { fallback } = this.props;

		if (hasError) {
			if (isLazyLoadingError) {
				return <PageLoader />;
			}

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
								<button
									onClick={() => (window.location.href = '/home')}
									className={s.errorButton}
								>
									<span>Home</span>
								</button>
								<button className={s.errorButton} onClick={logout}>
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
