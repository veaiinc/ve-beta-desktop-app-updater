import { useState, useContext, useEffect, memo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Intercom from '@intercom/messenger-js-sdk';
import { Tooltip } from 'antd';

import '../../../assets/scss/sidebar.scss';
import { veAiModulesItemsList } from './sidebarindex';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';

import OpenedSidebar from './OpenedSidebar';
import Notifications from './notifications/Notifications';
import Notes from './notes/Notes';
import SidebarTooltip from './SidebarTooltip';
import Context from '../../../context/context';

const Sidebar = ({ activeWorkspaceId }) => {
	const {
		profileInfo: { userWorkSpaceList, getUserWorkSpaceList, userDetailsData, getUserDetails },
		templates: { leftSidebarState, updateStateValues },
	} = useContext(Context);

	const location = useLocation();
	const sidebarRef = useRef(null);
	const sidebarOpenRef = useRef(null);

	const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
	const [showNotesDrawer, setShowNotesDrawer] = useState(false);
	const [showChatsDrawer, setShowChatsDrawer] = useState(false);
	const [hideClosedSidebarIcon, setHideClosedSidebarIcon] = useState(false);

	const [isOpen, setIsOpen] = useState(() => {
		return JSON.parse(localStorage.getItem('isOpen')) ?? true;
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

	// Sync isOpen to localStorage
	useEffect(() => {
		localStorage.setItem('isOpen', JSON.stringify(isOpen));
	}, [isOpen]);

	// Listen for template-triggered sidebar state changes
	useEffect(() => {
		if (leftSidebarState === 'open') {
			if (!isOpen) setIsOpen(true);
			updateStateValues({ leftSidebarState: null });
		} else if (leftSidebarState === 'close') {
			if (isOpen) setIsOpen(false);
			updateStateValues({ leftSidebarState: null });
		}
	}, [leftSidebarState]);

	// Fetch workspace and user info
	useEffect(() => {
		if (!userWorkSpaceList) getUserWorkSpaceList();
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

			const currentModule = veAiModulesItemsList.find(
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

	const handleOpen = () => setIsOpen(true);
	const handleClose = () => setIsOpen(false);

	return (
		<>
			<div
				className={`FullScreenSidebar
					${isOpen ? 'opened' : sidebarRef.current?.classList?.contains('opened') ? 'closed' : ''}
					${
						sidebarStates.selectedModule &&
						veAiModulesItemsList.find(
							(module) => module.name === sidebarStates.selectedModule,
						)?.subModules?.length > 0
							? 'has-submodules'
							: 'no-submodules'
					}
					${isChatSidebarRoute ? 'contacts-sidebar' : ''}`}
				style={{
					height: isOpen ? '100dvh' : 'fit-content',
					alignItems: sidebarStates?.workSpaceOpen ? 'flex-start' : '',
					maxHeight: info?.activeRoute === '/home' ? (isOpen ? '' : '') : '',
					minHeight: info?.activeRoute === '/home' ? (isOpen ? '' : '250px') : '',
					marginTop: isChatSidebarRoute ? '0' : '',
					display: hideClosedSidebarIcon ? 'none' : '',
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
							setIsOpen={handleClose}
							setShowChatsDrawer={setShowChatsDrawer}
							setShowNotificationsDrawer={setShowNotificationsDrawer}
							setShowNotesDrawer={setShowNotesDrawer}
							setHideClosedSidebarIcon={setHideClosedSidebarIcon}
						/>
					</div>

					<div className={`sidebar-close ${isOpen ? 'inactive' : 'active'}`}>
						<SidebarTooltip
							label="Open Sidebar"
							icon={
								<SidebarClosingSvg
									onClick={handleOpen}
									style={{ cursor: 'pointer' }}
								/>
							}
						/>
					</div>
				</nav>

				<Notifications
					showNotificationsDrawer={showNotificationsDrawer}
					setShowNotificationsDrawer={setShowNotificationsDrawer}
				/>
				<Notes showNotesDrawer={showNotesDrawer} setShowNotesDrawer={setShowNotesDrawer} />
			</div>

			{isOpen && <div className="sidebar__overlay"></div>}
		</>
	);
};

export default memo(Sidebar);
