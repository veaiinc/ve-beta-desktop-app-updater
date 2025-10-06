import { memo, useContext, useEffect, useState, useCallback, lazy } from 'react';
import { Helmet } from 'react-helmet';
// import Sidebar from '../components/sidebar/Sidebar';
import TopNavbar from '../components/topNavbar/TopNavbar';
import '../../assets/scss/authWrapper.scss';
const ExpiredSubscriptionModal = lazy(() =>
	import('../components/modalsV2/subscription/ExpiredSubscriptionModal'),
);
const ExpiredTokenModal = lazy(() =>
	import('../components/modalsV2/subscription/ExpiredTokenModal'),
);
const AccessDeniedPopup = lazy(() => import('../components/accessPopups/accessDeniedPopup'));
const CustomToast = lazy(() => import('../components/globalComponents/CustomToast'));
const { message } = lazy(() => import('../components/globalComponents/CustomToast'));
const PageLoader = lazy(() => import('../features/app/PageLoader'));
import useAuthInitializer from '../../hooks/useAuthInitializer';
import usePushNotifications from '../../hooks/usePushNotifications';
// const useMigrationGate = lazy(() => import('../../hooks/useMigrationGate'));
const VoiceWrapper = lazy(() => import('./VoiceWrapper'));
import Context from '../../context/context';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import useIntercom from '../../hooks/useIntercom';
const Offline = lazy(() => import('../features/offline/Offline'));
// const UnderMaintainence = lazy(() => import('../features/underMaintainence/underMaintainence'));
import { internalServerEmitter } from '../../services';
const InternalServer = lazy(() => import('../components/globalComponents/InternalServer'));
import { useNavigate } from 'react-router-dom';

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
		templates: { updateStateValues },
	} = useContext(Context);
	const [showServerError, setShowServerError] = useState(false);

	useEffect(() => {
		const handler = () => setShowServerError(true);

		internalServerEmitter.on('serverError', handler);

		return () => {
			internalServerEmitter.off('serverError', handler);
		};
	});

	useEffect(() => {
		window.electronApi.onNavigate((data) => {
			const { path, updateObject=null } = data;

			if(updateObject) {
				if(updateObject.type ==='chat') {
					const sessionId = path.split('/')[2];
					updateStateValues({activePromptForChat:{sessionId:sessionId,prompt:updateObject.payload?.query}});
				}
			}
			console.log('navigate',updateObject, path);
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
		<main className="main-container">
			<div className="authParentContainer" style={{ ...(authParentContainerStyle || {}) }}>
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
							{showServerError ? <InternalServer /> : children}
						</div>
					</div>
				</div>
			</div>
			<ExpiredSubscriptionModal />
			<ExpiredTokenModal />
			<AccessDeniedPopup />
			<CustomToast />
			{showVoiceWidget && <VoiceWrapper />}
		</main>
	);
};

export default memo(AuthWrapper);
