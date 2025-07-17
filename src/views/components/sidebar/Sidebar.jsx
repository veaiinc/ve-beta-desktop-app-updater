import { useState, useEffect, memo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../../../assets/scss/sidebar.scss';
import OpenedSidebar from './OpenedSidebar';
import Notifications from './notifications/Notifications';
import Notes from './notes/Notes';
import useWorkspaceMode from '../../../hooks/useWorkspaceMode';
import ClosedSidebar from './ClosedSidebar';

const Sidebar = () => {
	const { workspaceMode, workspaceNotFound } = useWorkspaceMode();

	const { pathname } = useLocation();
	const isHome = pathname?.includes('home');

	const sidebarRef = useRef(null);
	const sidebarOpenRef = useRef(null);

	const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
		const sidebarOpen = JSON.parse(localStorage.getItem('isSidebarOpen')) ?? false;
		return sidebarOpen;
	});

	const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
	const [showNotesDrawer, setShowNotesDrawer] = useState(false);

	const [sidebarStates, setsidebarStates] = useState({
		workSpaceOpen: false,
		navStyle: 'close',
		selectedModule: null
	});

	useEffect(() => {
		localStorage.setItem('isSidebarOpen', JSON.stringify(isSidebarOpen));
	}, [isSidebarOpen]);

	const isEarlyAccessPage =
		pathname?.includes('/early-access') ||
		pathname?.includes('/pricing') ||
		workspaceMode === 'suspended' ||
		workspaceNotFound;

	return (
		<>
			<div
				className={`FullScreenSidebar
					${
						isSidebarOpen
							? 'opened'
							: sidebarRef.current?.classList?.contains('sidebar-open')
							? 'closed'
							: ''
					}
					`}
				style={{
					height: isSidebarOpen ? '100dvh' : '100dvh',
					alignItems: sidebarStates?.workSpaceOpen ? 'flex-start' : '',
					maxHeight: isHome ? (isSidebarOpen ? '' : '') : '',
					minHeight: isHome ? (isSidebarOpen ? '' : '250px') : ''
				}}
				ref={sidebarRef}
			>
				<nav className={`sidebarComponent ${!isSidebarOpen && isHome ? 'padding-48' : ''}`}>
					<div
						className={`sidebar-open ${
							isSidebarOpen
								? 'active'
								: sidebarOpenRef.current?.classList?.contains('active')
								? 'inactive'
								: 'inactive'
						}`}
						ref={sidebarOpenRef}
					>
						<OpenedSidebar
							setsidebarStates={setsidebarStates}
							sidebarStates={sidebarStates}
							isSidebarOpen={isSidebarOpen}
							setIsSidebarOpen={setIsSidebarOpen}
							setShowNotificationsDrawer={setShowNotificationsDrawer}
							setShowNotesDrawer={setShowNotesDrawer}
							isThisEarlyAccessPage={isEarlyAccessPage}
						/>
					</div>
				</nav>
				{!isSidebarOpen && (
					<ClosedSidebar
						onIconClick={() => setIsSidebarOpen(true)}
						isEarlyAccessPage={isEarlyAccessPage}
					/>
				)}
				<Notifications
					showNotificationsDrawer={showNotificationsDrawer}
					setShowNotificationsDrawer={setShowNotificationsDrawer}
				/>
				<Notes showNotesDrawer={showNotesDrawer} setShowNotesDrawer={setShowNotesDrawer} />
			</div>

			{isSidebarOpen && <div className="sidebar__overlay"></div>}
		</>
	);
};

export default memo(Sidebar);

// import { useState, useContext, useEffect, memo, useRef } from 'react';
// import { useLocation } from 'react-router-dom';
// import Intercom from '@intercom/messenger-js-sdk';
// import '../../../assets/scss/sidebar.scss';
// import { stableNavigationItems, betaNaviagationItems } from './sidebarindex';
// import OpenedSidebar from './OpenedSidebar';
// import Notifications from './notifications/Notifications';
// import Notes from './notes/Notes';
// import Context from '../../../context/context';
// import useWorkspaceMode from '../../hooks/useWorkspaceMode';

// // Custom hook to detect mobile view
// const useIsMobile = () => {
// 	const [isMobile, setIsMobile] = useState(false);

// 	useEffect(() => {
// 		const checkIsMobile = () => {
// 			setIsMobile(window.innerWidth <= 768);
// 		};

// 		// Check on mount
// 		checkIsMobile();

// 		// Add event listener for window resize
// 		window.addEventListener('resize', checkIsMobile);

// 		// Cleanup
// 		return () => window.removeEventListener('resize', checkIsMobile);
// 	}, []);

// 	return isMobile;
// };
// import ClosedSidebar from './ClosedSidebar';

// const Sidebar = ({ activeWorkspaceId }) => {
// 	const { workspaceMode } = useWorkspaceMode();
// 	const isMobile = useIsMobile();
// 	const { pathname } = useLocation();
// 	const sidebarRef = useRef(null);
// 	const sidebarOpenRef = useRef(null);
// 	const hasClosedForRouteRef = useRef(false);

// 	const {
// 		profileInfo: { userWorkSpaceList, userDetailsData, getUserDetails, getUserWorkSpaceList },
// 	} = useContext(Context);

// 	const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
// 	const [showNotesDrawer, setShowNotesDrawer] = useState(false);
// 	const [showChatsDrawer, setShowChatsDrawer] = useState(false);
// 	const [hideClosedSidebarIcon, setHideClosedSidebarIcon] = useState(false);

// 	const [isOpen, setIsOpen] = useState(() => {
// 		// If mobile, default to closed unless explicitly set in localStorage
// 		if (isMobile) {
// 			const savedState = localStorage.getItem('isOpen');
// 			return savedState ? JSON.parse(savedState) : false;
// 		}

// 		// If desktop, use the existing logic
// 		return JSON.parse(localStorage.getItem('isOpen')) ?? true;
// 	});

// 	const [sidebarStates, setsidebarStates] = useState({
// 		workSpaceOpen: false,
// 		navStyle: 'close',
// 		selectedModule: null,
// 	});

// 	const isHome = pathname?.includes('home');
// 	const isChatSidebarRoute =
// 		pathname?.includes('calendar') ||
// 		pathname?.includes('tasks') ||
// 		pathname?.includes('contact');

// 	const [info, setInfo] = useState({
// 		switchWorkspaceModal: false,
// 		activeBusniessName: '',
// 		createLeadModal: false,
// 		isNewFeaturePlusOpen: false,
// 		activeRoute: '/' + pathname.split('/')[1],
// 		selectedModule: null,
// 	});

// 	const sidebarNavigationItems =
// 		workspaceMode === 'stable' ? stableNavigationItems : betaNaviagationItems;

// 	// Sync isOpen to localStorage
// 	useEffect(() => {
// 		localStorage.setItem('isOpen', JSON.stringify(isOpen));
// 	}, [isOpen]);

// 	// Handle responsive behavior when switching between mobile and desktop
// 	useEffect(() => {
// 		// If switching to mobile and sidebar is open, close it
// 		if (isMobile && isOpen) {
// 			setIsOpen(false);
// 		}
// 		// If switching to desktop and no saved state exists, open it
// 		else if (!isMobile && !localStorage.getItem('isOpen')) {
// 			setIsOpen(true);
// 		}
// 	}, [isMobile]);

// 	// Fetch workspace and user info
// 	useEffect(() => {
// 		if (!userDetailsData) getUserDetails();
// 		if (!userWorkSpaceList) getUserWorkSpaceList();
// 	}, []);

// 	// Configure Intercom
// 	useEffect(() => {
// 		if (userDetailsData && info) {
// 			Intercom({
// 				app_id: 'vmvweabd',
// 				user_id: userDetailsData?._id,
// 				name: `${userDetailsData?.firstName} ${userDetailsData?.lastName}`,
// 				email: userDetailsData?.email,
// 				company: {
// 					name:
// 						info?.activeBusniessName?.activeWorkspaceId ??
// 						localStorage?.getItem('workspaceId'),
// 					id: info?.activeBusniessName?.businessName,
// 					region: info?.activeBusniessName?.region,
// 				},
// 			});
// 		}
// 	}, [userDetailsData, info]);
// 	// Set active business name
// 	useEffect(() => {
// 		if (userWorkSpaceList) {
// 			const activeBusniessName = userWorkSpaceList.find(
// 				(item) => item.activeWorkspaceId === activeWorkspaceId,
// 			);
// 			setInfo((prev) => ({ ...prev, activeBusniessName }));
// 		}
// 	}, [userWorkSpaceList]);

// 	// Track route change for route-based module
// 	useEffect(() => {
// 		if (pathname) {
// 			const currentPath = '/' + location.pathname.split('/')[1];
// 			setInfo((prev) => ({ ...prev, activeRoute: currentPath }));

// 			const currentModule = sidebarNavigationItems.find(
// 				(module) => module.moduleRoute === currentPath,
// 			);
// 			if (currentModule) {
// 				setsidebarStates((prev) => ({
// 					...prev,
// 					selectedModule: currentModule.name,
// 				}));
// 			}

// 			// Close sidebar only once when first navigating to contacts, calendar, or tasks routes
// 			if (isChatSidebarRoute && isOpen && !hasClosedForRouteRef.current) {
// 				setIsOpen(false);
// 				hasClosedForRouteRef.current = true;
// 			} else if (!isChatSidebarRoute) {
// 				hasClosedForRouteRef.current = false;
// 			}
// 		}
// 	}, [pathname, isChatSidebarRoute, isOpen]);

// 	const isEarlyAccessPage = pathname?.includes('/early-access') || pathname?.includes('/pricing');

// 	return (
// 		<>
// 			<div
// 				className={`FullScreenSidebar
// 					${isOpen ? 'opened' : sidebarRef.current?.classList?.contains('sidebar-open') ? 'closed' : ''}
// 					${isChatSidebarRoute ? 'contacts-sidebar' : ''}
// 					${
// 						sidebarStates.selectedModule &&
// 						sidebarNavigationItems.find(
// 							(module) => module.name === sidebarStates.selectedModule,
// 						)?.subModules?.length > 0
// 							? 'has-submodules'
// 							: 'no-submodules'
// 					}
// 					`}
// 				style={{
// 					height: isOpen ? '100dvh' : '100dvh',
// 					alignItems: sidebarStates?.workSpaceOpen ? 'flex-start' : '',
// 					maxHeight: info?.activeRoute === '/home' ? (isOpen ? '' : '') : '',
// 					minHeight: info?.activeRoute === '/home' ? (isOpen ? '' : '250px') : '',
// 					marginTop: isChatSidebarRoute ? '0' : '',
// 					// display: hideClosedSidebarIcon ? 'none' : '',
// 					marginLeft: isChatSidebarRoute ? '0' : '',
// 				}}
// 				ref={sidebarRef}
// 			>
// 				<nav className={`sidebarComponent ${!isOpen && isHome ? 'padding-48' : ''}`}>
// 					<div
// 						className={`sidebar-open ${
// 							isOpen
// 								? 'active'
// 								: sidebarOpenRef.current?.classList?.contains('active')
// 								? 'inactive'
// 								: 'inactive'
// 						}`}
// 						ref={sidebarOpenRef}
// 					>
// 						<OpenedSidebar
// 							setsidebarStates={setsidebarStates}
// 							sidebarStates={sidebarStates}
// 							info={info}
// 							setInfo={setInfo}
// 							userWorkSpaceList={userWorkSpaceList}
// 							isOpen={isOpen}
// 							setIsOpen={setIsOpen}
// 							setShowChatsDrawer={setShowChatsDrawer}
// 							setShowNotificationsDrawer={setShowNotificationsDrawer}
// 							setShowNotesDrawer={setShowNotesDrawer}
// 							setHideClosedSidebarIcon={setHideClosedSidebarIcon}
// 							isThisEarlyAccessPage={isEarlyAccessPage}
// 						/>
// 					</div>
// 				</nav>
// 				<ClosedSidebar
// 					onIconClick={() => setIsOpen(true)}
// 					isEarlyAccessPage={isEarlyAccessPage}
// 				/>
// 				<Notifications
// 					showNotificationsDrawer={showNotificationsDrawer}
// 					setShowNotificationsDrawer={setShowNotificationsDrawer}
// 				/>
// 				<Notes showNotesDrawer={showNotesDrawer} setShowNotesDrawer={setShowNotesDrawer} />
// 			</div>

// 			{/* Sidebar toggle button, always visible and not animated */}
// 			{/* <div
// 				className="sidebar-toggle-btn"
// 				style={{
// 					position: 'fixed',
// 					top: 29,
// 					left: 20,
// 					zIndex: 900,
// 				}}
// 			>

// 			</div> */}

// 			{isOpen && <div className="sidebar__overlay"></div>}
// 		</>
// 	);
// };

// export default memo(Sidebar);
