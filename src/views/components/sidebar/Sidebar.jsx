import { useState, useContext, useEffect, memo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../../../assets/scss/sidebar.scss';
import {
	stableNavigationItems,
	betaNavigationItems,
	internalNavigationItems,
} from './sidebarindex';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import OpenedSidebar from './OpenedSidebar';
import Notifications from './notifications/Notifications';
import Notes from './notes/Notes';
// import SidebarTooltip from './SidebarTooltip';
import Context from '../../../context/context';
import useWorkspaceMode from '../../../hooks/useWorkspaceMode';

// Custom hook to detect mobile view
const useIsMobile = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		// Check on mount
		checkIsMobile();

		// Add event listener for window resize
		window.addEventListener('resize', checkIsMobile);

		// Cleanup
		return () => window.removeEventListener('resize', checkIsMobile);
	}, []);

	return isMobile;
};
import ClosedSidebar from './ClosedSidebar';

const Sidebar = ({ activeWorkspaceId }) => {
	const { workspaceMode } = useWorkspaceMode();
	const isMobile = useIsMobile();
	const { pathname } = useLocation();
	const sidebarRef = useRef(null);
	const sidebarOpenRef = useRef(null);
	const hasClosedForRouteRef = useRef(false);
	const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
	const [showNotesDrawer, setShowNotesDrawer] = useState(false);
	const [showChatsDrawer, setShowChatsDrawer] = useState(false);
	const [hideClosedSidebarIcon, setHideClosedSidebarIcon] = useState(false);

	const [isOpen, setIsOpen] = useState(() => {
		// If mobile, default to closed unless explicitly set in localStorage
		if (isMobile) {
			const savedState = localStorage.getItem('isOpen');
			return savedState ? JSON.parse(savedState) : false;
		}

		// If desktop, use the existing logic
		return JSON.parse(localStorage.getItem('isOpen')) ?? true;
	});

	const [sidebarStates, setsidebarStates] = useState({
		workSpaceOpen: false,
		navStyle: 'close',
		selectedModule: null,
	});

	const isHome = pathname?.includes('home');
	const isChatSidebarRoute =
		// pathname?.includes('calendar') ||
		pathname?.includes('tasks') || pathname?.includes('contact');

	const [info, setInfo] = useState({
		switchWorkspaceModal: false,
		activeBusniessName: '',
		createLeadModal: false,
		isNewFeaturePlusOpen: false,
		activeRoute: '/' + pathname.split('/')[1],
		selectedModule: null,
	});

	const sidebarNavigationItems =
		workspaceMode === 'beta'
			? betaNavigationItems
			: workspaceMode === 'internal'
			? internalNavigationItems
			: stableNavigationItems;

	// Sync isOpen to localStorage
	useEffect(() => {
		localStorage.setItem('isOpen', JSON.stringify(isOpen));
	}, [isOpen]);

	// Handle responsive behavior when switching between mobile and desktop
	useEffect(() => {
		// If switching to mobile and sidebar is open, close it
		if (isMobile && isOpen) {
			setIsOpen(false);
		}
		// If switching to desktop and no saved state exists, open it
		else if (!isMobile && !localStorage.getItem('isOpen')) {
			setIsOpen(true);
		}
	}, [isMobile]);

	// Track route change for route-based module
	useEffect(() => {
		if (pathname) {
			const currentPath = '/' + location.pathname.split('/')[1];
			setInfo((prev) => ({ ...prev, activeRoute: currentPath }));

			const currentModule = sidebarNavigationItems.find(
				(module) => module.moduleRoute === currentPath,
			);
			if (currentModule) {
				setsidebarStates((prev) => ({
					...prev,
					selectedModule: currentModule.name,
				}));
			}

			// Close sidebar only once when first navigating to contacts, calendar, or tasks routes
			if (isChatSidebarRoute && isOpen && !hasClosedForRouteRef.current) {
				setIsOpen(false);
				hasClosedForRouteRef.current = true;
			} else if (!isChatSidebarRoute) {
				hasClosedForRouteRef.current = false;
			}
		}
	}, [pathname, isChatSidebarRoute, isOpen]);

	const isEarlyAccessPage = pathname?.includes('/early-access') || pathname?.includes('/pricing');

	return (
		<>
			<div
				className={`FullScreenSidebar
					${isOpen ? 'opened' : sidebarRef.current?.classList?.contains('sidebar-open') ? 'closed' : ''}
					${isChatSidebarRoute ? 'contacts-sidebar' : ''}
					${
						sidebarStates.selectedModule &&
						sidebarNavigationItems.find(
							(module) => module.name === sidebarStates.selectedModule,
						)?.subModules?.length > 0
							? 'has-submodules'
							: 'no-submodules'
					}
					`}
				style={{
					height: isOpen ? '100dvh' : '100dvh',
					alignItems: sidebarStates?.workSpaceOpen ? 'flex-start' : '',
					maxHeight: info?.activeRoute === '/home' ? (isOpen ? '' : '') : '',
					minHeight: info?.activeRoute === '/home' ? (isOpen ? '' : '250px') : '',
					marginTop: isChatSidebarRoute ? '0' : '',
					// display: hideClosedSidebarIcon ? 'none' : '',
					marginLeft: isChatSidebarRoute ? '0' : '',
				}}
				ref={sidebarRef}
			>
				<nav className={`sidebarComponent ${!isOpen && isHome ? 'padding-48' : ''}`}>
					<div
						className={`sidebar-open ${
							isOpen
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
							info={info}
							setInfo={setInfo}
							// userWorkSpaceList={userWorkSpaceList}
							isOpen={isOpen}
							setIsOpen={setIsOpen}
							setShowChatsDrawer={setShowChatsDrawer}
							setShowNotificationsDrawer={setShowNotificationsDrawer}
							setShowNotesDrawer={setShowNotesDrawer}
							setHideClosedSidebarIcon={setHideClosedSidebarIcon}
							isThisEarlyAccessPage={isEarlyAccessPage}
						/>
					</div>
				</nav>
				{!isOpen && (
					<ClosedSidebar
						onIconClick={() => setIsOpen(true)}
						isEarlyAccessPage={isEarlyAccessPage}
					/>
				)}

				<Notifications
					showNotificationsDrawer={showNotificationsDrawer}
					setShowNotificationsDrawer={setShowNotificationsDrawer}
				/>
				<Notes showNotesDrawer={showNotesDrawer} setShowNotesDrawer={setShowNotesDrawer} />
			</div>

			{/* Sidebar toggle button, always visible and not animated */}
			{/* <div
				className="sidebar-toggle-btn"
				style={{
					position: 'fixed',
					top: 29,
					left: 20,
					zIndex: 900,
				}}
			>
				
			</div> */}

			{isOpen && <div className="sidebar__overlay"></div>}
		</>
	);
};

export default memo(Sidebar);
