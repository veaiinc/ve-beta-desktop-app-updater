import { useState, useContext, useEffect, memo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Intercom from '@intercom/messenger-js-sdk';
import { Tooltip } from 'antd';

import '../../../assets/scss/sidebar.scss';
import { stableNavigationItems, betaNaviagationItems } from './sidebarindex';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';

import OpenedSidebar from './OpenedSidebar';
import Notifications from './notifications/Notifications';
import Notes from './notes/Notes';
import SidebarTooltip from './SidebarTooltip';
import Context from '../../../context/context';
import useWorkspaceMode from '../../hooks/useWorkspaceMode';

const Sidebar = ({ activeWorkspaceId }) => {
	const { workspaceMode } = useWorkspaceMode();
	const sidebarNavigationItems =
		workspaceMode === 'stable' ? stableNavigationItems : betaNaviagationItems;
	const {
		profileInfo: { userWorkSpaceList, userDetailsData, getUserDetails },
		templates: { leftSidebarState, updateStateValues },
	} = useContext(Context);

	const location = useLocation();
	const sidebarRef = useRef(null);
	const sidebarOpenRef = useRef(null);
	const hoverTimeoutRef = useRef(null);

	const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
	const [showNotesDrawer, setShowNotesDrawer] = useState(false);
	const [showChatsDrawer, setShowChatsDrawer] = useState(false);
	const [hideClosedSidebarIcon, setHideClosedSidebarIcon] = useState(false);

	// Check if device is mobile
	const isMobile = window.innerWidth <= 500;

	const [isDocked, setIsDocked] = useState(() => {
		// Don't allow docked state on mobile
		if (isMobile) return false;
		return JSON.parse(localStorage.getItem('isDocked')) ?? false;
	});
	const [isHovering, setIsHovering] = useState(false);

	const [isOpen, setIsOpen] = useState(() => {
		return JSON.parse(localStorage.getItem('isOpen')) ?? false;
	});

	const [sidebarStates, setsidebarStates] = useState({
		workSpaceOpen: false,
		navStyle: 'close',
		selectedModule: null,
	});

	const isHome = location?.pathname?.includes('home');
	const isChatSidebarRoute =
		location?.pathname?.includes('calendar') ||
		location?.pathname?.includes('tasks') ||
		location?.pathname?.includes('contact');

	const [info, setInfo] = useState({
		switchWorkspaceModal: false,
		activeBusniessName: '',
		createLeadModal: false,
		isNewFeaturePlusOpen: false,
		activeRoute: '/' + location.pathname.split('/')[1],
		selectedModule: null,
	});

	// Sync isOpen and isDocked to localStorage (only if not mobile)
	useEffect(() => {
		localStorage.setItem('isOpen', JSON.stringify(isOpen));
		if (!isMobile) {
			localStorage.setItem('isDocked', JSON.stringify(isDocked));
		}
	}, [isOpen, isDocked, isMobile]);

	// Listen for template-triggered sidebar state changes
	// useEffect(() => {
	// 	if (leftSidebarState === 'open') {
	// 		if (!isOpen) setIsOpen(true);
	// 		updateStateValues({ leftSidebarState: null });
	// 	} else if (leftSidebarState === 'close') {
	// 		if (isOpen && !isDocked) setIsOpen(false);
	// 		updateStateValues({ leftSidebarState: null });
	// 	}
	// }, [leftSidebarState, isDocked]);

	// Fetch workspace and user info
	useEffect(() => {
		if (!userDetailsData) getUserDetails();
	}, []);

	// Configure Intercom
	useEffect(() => {
		if (userDetailsData && info) {
			Intercom({
				app_id: 'vmvweabd',
				user_id: userDetailsData?._id,
				name: `${userDetailsData?.firstName} ${userDetailsData?.lastName}`,
				email: userDetailsData?.email,
				company: {
					name:
						info?.activeBusniessName?.activeWorkspaceId ??
						localStorage?.getItem('workspaceId'),
					id: info?.activeBusniessName?.businessName,
					region: info?.activeBusniessName?.region,
				},
			});
		}
	}, [userDetailsData, info]);

	// Set active business name
	useEffect(() => {
		if (userWorkSpaceList) {
			const activeBusniessName = userWorkSpaceList.find(
				(item) => item.activeWorkspaceId === activeWorkspaceId,
			);
			setInfo((prev) => ({ ...prev, activeBusniessName }));
		}
	}, [userWorkSpaceList]);

	// Track route change for route-based module
	useEffect(() => {
		if (location?.pathname) {
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
		}
	}, [location?.pathname]);

	const handleMouseEnter = () => {
		if (!isDocked || isMobile) {
			clearTimeout(hoverTimeoutRef.current);
			setIsHovering(true);
			setIsOpen(true);
			if (sidebarRef.current) {
				sidebarRef.current.style.zIndex = '1002';
			}
		}
	};

	const handleMouseLeave = () => {
		if (!isDocked || isMobile) {
			hoverTimeoutRef.current = setTimeout(() => {
				setIsHovering(false);
				setIsOpen(false);
				if (sidebarRef.current) {
					sidebarRef.current.style.zIndex = '1001';
				}
			}, 300); // Small delay to prevent flickering
		}
	};

	const handleDockToggle = () => {
		// Disable dock toggle on mobile
		if (isMobile) return;

		setIsDocked(!isDocked);
		if (!isDocked) {
			setIsOpen(true);
		}
	};

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
			}
		};
	}, []);

	return (
		<>
			<div
				className={`FullScreenSidebar
					${isOpen ? 'opened' : sidebarRef.current?.classList?.contains('opened') ? 'closed' : ''}
					${isDocked && !isMobile ? 'docked' : ''}
					${isHovering ? 'hovering' : ''}
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
					display: hideClosedSidebarIcon ? 'none' : '',
					marginLeft: isChatSidebarRoute ? '0' : '',
				}}
				ref={sidebarRef}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<nav className={`sidebarComponent ${!isOpen && isHome ? 'padding-48' : ''}`}>
					<div
						className={`sidebar-open ${
							isOpen
								? 'active'
								: sidebarOpenRef.current?.classList?.contains('active')
								? 'inactive'
								: 'inactive-no-animation'
						}`}
						ref={sidebarOpenRef}
					>
						<OpenedSidebar
							setsidebarStates={setsidebarStates}
							sidebarStates={sidebarStates}
							info={info}
							setInfo={setInfo}
							userWorkSpaceList={userWorkSpaceList}
							isOpen={isOpen}
							setIsOpen={setIsOpen}
							setShowChatsDrawer={setShowChatsDrawer}
							setShowNotificationsDrawer={setShowNotificationsDrawer}
							setShowNotesDrawer={setShowNotesDrawer}
							setHideClosedSidebarIcon={setHideClosedSidebarIcon}
							isDocked={isDocked}
							handleDockToggle={handleDockToggle}
						/>
					</div>
				</nav>

				<Notifications
					showNotificationsDrawer={showNotificationsDrawer}
					setShowNotificationsDrawer={setShowNotificationsDrawer}
				/>
				<Notes showNotesDrawer={showNotesDrawer} setShowNotesDrawer={setShowNotesDrawer} />
			</div>

			{/* Sidebar toggle button, always visible and not animated */}
			<div
				className="sidebar-toggle-btn"
				style={{
					position: 'fixed',
					top: 24,
					left: 20, // Fixed position, doesn't change with sidebar state
					zIndex: 900,
				}}
				onMouseEnter={handleMouseEnter}
			>
				<SidebarTooltip
					label={isDocked && !isMobile ? 'Undock Sidebar' : 'Open Sidebar'}
					icon={
						<SidebarClosingSvg
							onClick={handleDockToggle}
							style={{ cursor: 'pointer' }}
						/>
					}
				/>
			</div>

			{isOpen && <div className="sidebar__overlay"></div>}
		</>
	);
};

export default memo(Sidebar);
