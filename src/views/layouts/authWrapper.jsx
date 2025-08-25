import { memo } from 'react';
import { Helmet } from 'react-helmet';
// import Sidebar from '../components/sidebar/Sidebar';
import TopNavbar from '../components/topNavbar/TopNavbar';
import '../../assets/scss/authWrapper.scss';
import ExpiredSubscriptionModal from '../components/modalsV2/subscription/ExpiredSubscriptionModal';
import ExpiredTokenModal from '../components/modalsV2/subscription/ExpiredTokenModal';
import AccessDeniedPopup from '../components/accessPopups/accessDeniedPopup';
import CustomToast, { message } from '../components/globalComponents/CustomToast';
import PageLoader from '../features/app/PageLoader';
import useAuthInitializer from '../../hooks/useAuthInitializer';
import usePushNotifications from '../../hooks/usePushNotifications';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import Offline from '../features/offline/Offline';

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
	const { isOnline } = useNetworkStatus();
	const { authInitialized } = useAuthInitializer();
	usePushNotifications((payload) => {
		const { title, body } = payload.notification || {};
		message.success(`${title || 'Notification'}: ${body || ''}`);
	});

	// const layoutMode = showSidebar && workspaceMode !== 'stable' ? 'sidebar' : 'topNavbar';
	// const layoutModeComponentMap = {
	// 	sidebar: (
	// 		<div
	// 			style={{
	// 				...sidebarContainerStyles,
	// 				height: 'fit-content',
	// 				position: 'relative',
	// 				padding: '0',
	// 				margin: '0',
	// 			}}
	// 			className={sidebarContainerClassName}
	// 		>
	// 			<Sidebar />
	// 		</div>
	// 	),
	// 	topNavbar: <TopNavbar />,
	// };

	return isOnline ? (
		authInitialized ? (
			<PageLoader />
		) : (
			<main className="main-container">
				<div
					className="authParentContainer"
					style={{ ...(authParentContainerStyle || {}) }}
				>
					<Helmet>
						<meta charSet="utf-8" />
						<title>{title}</title>
					</Helmet>
					<div
						style={{
							display: 'flex',
							// flexDirection: layoutMode === 'topNavbar' ? 'column' : 'row',
							flexDirection: 'column',
							height: '100dvh',
							padding: '0',
							...outerContainerStyle,
						}}
						className="auth-wrapper-container"
					>
						{/* {layoutModeComponentMap[layoutMode]} */}
						<TopNavbar />
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
					</div>
				</div>
				<ExpiredSubscriptionModal />
				<ExpiredTokenModal />
				<AccessDeniedPopup />
				<CustomToast />
			</main>
		)
	) : (
		<Offline />
	);
};

export default memo(AuthWrapper);
