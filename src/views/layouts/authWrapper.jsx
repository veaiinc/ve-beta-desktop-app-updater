import { memo, useContext, useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
// import Sidebar from '../components/sidebar/Sidebar';
// import TopNavbar from '../components/topNavbar/TopNavbar';
import '../../assets/scss/authWrapper.scss';
import ExpiredSubscriptionModal from '../components/modalsV2/subscription/ExpiredSubscriptionModal';
import ExpiredTokenModal from '../components/modalsV2/subscription/ExpiredTokenModal';
import AccessDeniedPopup from '../components/accessPopups/accessDeniedPopup';
import CustomToast, { message } from '../components/globalComponents/CustomToast';
import PageLoader from '../features/app/PageLoader';
import useAuthInitializer from '../../hooks/useAuthInitializer';
import usePushNotifications from '../../hooks/usePushNotifications';
// const useMigrationGate = lazy(() => import('../../hooks/useMigrationGate'));
import VoiceWrapper from './VoiceWrapper';
import Context from '../../context/context';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import useIntercom from '../../hooks/useIntercom';
import Offline from '../features/offline/Offline';
// const UnderMaintainence = lazy(() => import('../features/underMaintainence/underMaintainence'));
import { internalServerEmitter } from '../../services';
import InternalServer from '../components/globalComponents/InternalServer';
import NewSidebar from '../components/sidebar/newSidebar/NewSidebar';
// import useWorkspaceMode from '../../hooks/useWorkspaceMode';
import { useLocation, useNavigate } from 'react-router-dom';
import GlobalMeetingHelper from '../features/meetBot/GlobalMeetingHelper';

const AuthWrapper = ({
	title,
	children,
	maxWidth = '',
	outerContainerStyle = {},
	authParentContainerStyle = {},
	// sidebarContainerStyles = {},
	// sidebarContainerClassName = '',
	childrenContainerStyles = {},
	// showSidebar = true,
}) => {
	const navigate = useNavigate();
	const { isOnline } = useNetworkStatus();
	// const { workspaceMode } = useWorkspaceMode();
	const location = useLocation();
	const { pathname } = location;

	const showPushNotification = useCallback((payload) => {
		const { title, body } = payload.notification || {};
		message.success(`${title || 'Notification'}: ${body || ''}`);
		const firebasePN = {
			firebasePN: payload,
		};
		const strPayload = JSON.stringify(firebasePN);
		console.log('firebasePN', strPayload);
		window.electronApi.sendMessageFrmVeApp(strPayload);
	}, []);

	usePushNotifications(showPushNotification);
	const { authInitialized } = useAuthInitializer();

	// Initialize Intercom for all authenticated users
	useIntercom();

	const {
		aiSetup: { showVoiceWidget },
		templates: { sidebarState, isSidebarMobileView, updateStateValues },
	} = useContext(Context);
	const [showServerError, setShowServerError] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(
		JSON.parse(localStorage.getItem('isSidebarOpen')) ?? false,
	);
	const isSidebarOverlay = (sidebarState?.overlay || isSidebarMobileView) ?? false;
	const hideSidebar =
		pathname.includes('builder') ||
		pathname.includes('galleries') ||
		pathname.includes('create-workspace') ||
		pathname.includes('agent/') ||
		pathname.includes('note/') ||
		pathname.includes('meet/');

	useEffect(() => {
		if (typeof sidebarState?.open === 'boolean' && sidebarState?.open !== isSidebarOpen) {
			setIsSidebarOpen(sidebarState?.open);

			const windowWidth = window.innerWidth;
			if (windowWidth > 1200) {
				return;
			}
			const width = windowWidth + (sidebarState?.open ? 280 : -280);

			if (window?.electronApi?.resizeMainWindow) {
				window.electronApi.resizeMainWindow({
					dimensions: { width, height: window.innerHeight },
					animate: true,
					duration: 250,
					easing: 'easeInOutCubic',
				});
			}
		}
	}, [sidebarState?.open]);

	useEffect(() => {
		const handler = () => setShowServerError(true);

		internalServerEmitter.on('serverError', handler);

		return () => {
			internalServerEmitter.off('serverError', handler);
		};
	});

	useEffect(() => {
		window.electronApi.onNavigate((data) => {
			const { path, updateObject = null } = data;

			if (updateObject) {
				if (updateObject.type === 'chat') {
					const sessionId = path.split('/')[2];
					const imagesArray = updateObject.payload?.imagesArray;
					updateStateValues({
						activePromptForChat: {
							sessionId: sessionId,
							prompt: updateObject.payload?.query,
							...(imagesArray?.length ? { imagesArray } : {}),
						},
					});
				}
			}
			navigate(path); // client-side navigation
		});
	}, [navigate]);

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

	if (!isOnline) return <Offline />;

	// const region = localStorage.getItem('region');

	// if (region === 'ap-south-1') {
	// 	const { migrationLoading, migrationInProgress } = useMigrationGate();

	// 	// While checking migration, show loader to avoid flicker
	// 	if (migrationLoading) return <PageLoader />;

	// 	// Show offline-like page when migration is in progress (status 102)
	// 	if (migrationInProgress) return <UnderMaintainence />;
	// }

	return authInitialized ? (
		<PageLoader />
	) : (
		<main className="main-container translucent">
			<div className="authParentContainer" style={{ ...(authParentContainerStyle || {}) }}>
				<Helmet>
					<meta charSet="utf-8" />
					<title>{title}</title>
				</Helmet>
				<div
					style={{
						...outerContainerStyle,
						paddingLeft:
							isSidebarOpen && !isSidebarOverlay && !hideSidebar ? '280px' : '0',
					}}
					className="auth-wrapper-container"
				>
					{/* {layoutModeComponentMap[layoutMode]} */}
					{/* {workspaceMode === 'stable' ? ( */}
					{!hideSidebar ? <NewSidebar /> : null}
					{/* ) : (
					<TopNavbar />
				)} */}

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
							{showServerError ? <InternalServer /> : children}
						</div>
					</div>
				</div>
			</div>
			<ExpiredSubscriptionModal />
			<ExpiredTokenModal />
			<AccessDeniedPopup />
			<CustomToast />
			<GlobalMeetingHelper />

			{showVoiceWidget && <VoiceWrapper />}
		</main>
	);
};

export default memo(AuthWrapper);
