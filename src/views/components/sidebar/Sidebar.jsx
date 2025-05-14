import { useState, useContext, useEffect, memo } from 'react';
import '../../../assets/scss/sidebar.scss';
import { useLocation } from 'react-router-dom';
import Intercom from '@intercom/messenger-js-sdk';
import OpenedSidebar from './OpenedSidebar';
import Context from '../../../context/context';
import { styles } from './sidebarindex';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { veAiModulesItemsList } from './sidebarindex';
import { Tooltip } from 'antd';
import Notifications from './notifications/Notifications';
import Notes from './notes/Notes';
import SidebarTooltip from './SidebarTooltip';

const Sidebar = ({ activeWorkspaceId }) => {
	const {
		// subscriptionInfo: { renewBanner },
		profileInfo: { userWorkSpaceList, getUserWorkSpaceList, userDetailsData, getUserDetails },
		templates: { leftSidebarState, updateStateValues },
	} = useContext(Context);
	const location = useLocation();
	const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
	const [showNotesDrawer, setShowNotesDrawer] = useState(false);
	const [showChatsDrawer, setShowChatsDrawer] = useState(false);
	const [sidebarStates, setsidebarStates] = useState({
		workSpaceOpen: false,
		navStyle: 'close',
		selectedModule: null,
	});
	const [hideClosedSidebarIcon, setHideClosedSidebarIcon] = useState(false);
	const [isOpen, setIsOpen] = useState(() => {
		return JSON.parse(localStorage.getItem('isOpen')) ?? true;
	});
	const [isClosing, setIsClosing] = useState(false);
	// conditional margin top for home page
	const isHome = location?.pathname?.includes('notes');

	const isChatSidebarRoute =
		location?.pathname?.includes('calendar') ||
		location?.pathname?.includes('tasks') ||
		location?.pathname?.includes('contact');

	useEffect(() => {
		localStorage.setItem('isOpen', JSON.stringify(isOpen));
	}, [isOpen]);
	const [info, setInfo] = useState({
		switchWorkspaceModal: false,
		activeBusniessName: '',
		createLeadModal: false,
		isNewFeaturePlusOpen: false,
		activeRoute: '/' + location.pathname.split('/')[1],
		selectedModule: null,
	});

	useEffect(() => {
		if (leftSidebarState === 'open') {
			if (!isOpen) {
				setIsOpen(true);
			}
			updateStateValues({ leftSidebarState: null });
		} else if (leftSidebarState === 'close') {
			if (isOpen) {
				setIsOpen(false);
			}
			updateStateValues({ leftSidebarState: null });
		}
	}, [leftSidebarState]);

	useEffect(() => {
		if (!userWorkSpaceList) {
			getUserWorkSpaceList();
		}
		if (!userDetailsData) {
			getUserDetails();
		}
	}, []);

	useEffect(() => {
		if (userDetailsData && info) {
			Intercom({
				app_id: 'vmvweabd',
				user_id: userDetailsData?._id,
				name: userDetailsData?.firstName + ' ' + userDetailsData?.lastName,
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

	useEffect(() => {
		if (userWorkSpaceList) {
			const activeBusniessName = userWorkSpaceList?.find(
				(item) => item.activeWorkspaceId === activeWorkspaceId,
			);
			setInfo((prev) => ({ ...prev, activeBusniessName }));
		}
	}, [userWorkSpaceList]);

	useEffect(() => {
		if (location?.pathname) {
			setInfo((prev) => ({ ...prev, activeRoute: '/' + location.pathname.split('/')[1] }));
		}
	}, [location?.pathname]);
	useEffect(() => {
		if (location?.pathname) {
			const currentPath = '/' + location.pathname.split('/')[1];
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

	const handleOpen = () => {
		setIsOpen(true); // Sidebar comes into view
	};
	const handleClose = () => {
		setIsClosing(true);
		setTimeout(() => {
			setIsOpen(false); // Sidebar disappears
			setIsClosing(false);
		}, 400); // Match this with the SCSS transition duration
	};
	return (
		<>
			<div
				className={`FullScreenSidebar ${isOpen ? 'opened' : ''} ${
					sidebarStates.selectedModule &&
					veAiModulesItemsList.find(
						(module) => module.name === sidebarStates.selectedModule,
					)?.subModules?.length > 0
						? 'has-submodules'
						: 'no-submodules'
				} ${isChatSidebarRoute ? 'contacts-sidebar' : ''}`}
				style={{
					// height: isOpen
					// 	? renewBanner
					// 		? 'calc(100dvh - 58px)'
					// 		: '100dvh'
					// 	: 'fit-content',
					height: isOpen ? '100dvh' : 'fit-content',
					alignItems: sidebarStates?.workSpaceOpen ? 'flex-start' : ' ',
					maxHeight: info?.activeRoute === '/home' ? (isOpen ? '' : '') : '',
					minHeight: info?.activeRoute === '/home' ? (isOpen ? '' : '250px') : '',
					marginTop: isHome ? '0' : isChatSidebarRoute ? '0' : '',
					display: hideClosedSidebarIcon ? 'none' : '',
					marginLeft: isChatSidebarRoute ? '0' : '',
					// top: isOpen ? '' : renewBanner ? '105px' : '',
				}}
			>
				<nav
					className={`sidebarComponent ${isOpen && !isClosing ? 'open' : ''} ${
						isClosing ? 'closing' : ''
					} ${!isOpen && isHome && 'padding-48'}`}
					style={styles[sidebarStates?.navStyle]}
				>
					{isOpen ? (
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
							// renewBanner={renewBanner}
						/>
					) : (
						<SidebarTooltip
							label="Open Sidebar"
							icon={
								<SidebarClosingSvg
									onClick={handleOpen}
									style={{ cursor: 'pointer' }}
								/>
							}
						/>
					)}
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
