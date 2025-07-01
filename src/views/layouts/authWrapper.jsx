import { memo } from 'react';
import { Helmet } from 'react-helmet';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import Sidebar from '../components/sidebar/Sidebar';
import useAuth from '../../hooks/useAuth';
import useSubscription from '../../hooks/useSubscription';
import useTokenExpiry from '../../hooks/useTokenExpiry';

import useAccessControls from '../../hooks/useAccessControls';

import '../../assets/scss/authWrapper.scss';
import ExpiredSubscriptionModal from '../components/modalsV2/subscription/ExpiredSubscriptionModal';
import ExpiredTokenModal from '../components/modalsV2/subscription/ExpiredTokenModal';
import AccessDeniedPopup from '../components/accessPopups/accessDeniedPopup';
import CustomToast from '../components/globalComponents/CustomToast';
import useWorkspaceMode from '../../hooks/useWorkspaceMode';
import useTheme from '../../hooks/useTheme';
import PageLoader from '../features/app/PageLoader';
import useIntercom from '../../hooks/useIntercom';

const AuthWrapper = ({
	title,
	children,
	maxWidth = '',
	outerContainerStyle = {},
	authParentContainerStyle = {},
	sidebarContainerStyles = {},
	sidebarContainerClassName = '',
	childrenContainerStyles = {},
	showSidebar = true,
}) => {
	useAuth();
	useTheme();
	useIntercom();
	useSubscription();
	useTokenExpiry();
	useAccessControls();
	const { loading } = useWorkspaceMode();

	return loading ? (
		<PageLoader />
	) : (
		<main className="main-container">
			<div className="authParentContainer" style={{ ...(authParentContainerStyle || {}) }}>
				<Helmet>
					<meta charSet="utf-8" />
					<title>{title}</title>
				</Helmet>
				<div
					style={{
						display: 'flex',
						height: '100dvh',
						padding: '0',
						...outerContainerStyle,
					}}
					className="auth-wrapper-container"
				>
					<SkeletonTheme baseColor={'var(--card)'} highlightColor={'var(--card-hover)'}>
						{showSidebar && (
							<div
								style={{
									...sidebarContainerStyles,
									height: 'fit-content',
									position: 'relative',
									padding: '0',
									margin: '0',
								}}
								className={sidebarContainerClassName}
							>
								<Sidebar />
							</div>
						)}

						<div
							style={{
								flex: 1,
								overflowY: 'auto',
								maxHeight: '100%',
								height: '100%',
								padding: ' 0',
							}}
							id="scrollableTarget"
						>
							<div
								className="childrenContainer"
								style={{ maxWidth: maxWidth || '', ...childrenContainerStyles }}
							>
								{children}
							</div>
						</div>
					</SkeletonTheme>
				</div>
			</div>
			<ExpiredSubscriptionModal />
			<ExpiredTokenModal />
			<AccessDeniedPopup />
			<CustomToast />
		</main>
	);
};

export default memo(AuthWrapper);
