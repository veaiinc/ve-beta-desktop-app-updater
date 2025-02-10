import React, { useState, useContext, useEffect, useCallback, memo } from 'react';
import '../../../assets/scss/sidebar.scss';
import { useLocation } from 'react-router-dom';
import Intercom from '@intercom/messenger-js-sdk';
import OpenedSideBarItemsComponent from './OpenedSidebar';
import ClosedSideBarItemsComponent from './ClosedSidebar';
import Context from '../../../context/context';
import { styles } from './sidebarindex';
import CreateLeadModal from '../modalsV2/proposalModals/CreateLeadModal';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { veAiModulesItemsList } from './sidebarindex';
import { Tooltip } from 'antd';
const Sidebar = ({ activeWorkspaceId }) => {
	const {
		profileInfo: { userWorkSpaceList, getUserWorkSpaceList, userDetailsData, getUserDetails },
	} = useContext(Context);
	const location = useLocation();

	const [sidebarStates, setsidebarStates] = useState({
		workSpaceOpen: false,
		navStyle: 'close',
		selectedModule: null,
	});

	// conditional margin top for home page
	const isHome = location?.pathname?.includes('home') || location?.pathname?.includes('notes');

	const [isOpen, setIsOpen] = useState(() => {
		return JSON.parse(localStorage.getItem('isOpen')) ?? true;
	});
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

	const closeCreateLeadModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, createLeadModal: false }));
	}, []);

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
				}`}
				style={{
					alignItems: sidebarStates?.workSpaceOpen ? 'flex-start' : ' ',
					maxHeight: info?.activeRoute === '/home' ? (isOpen ? '' : '') : '',
					minHeight: info?.activeRoute === '/home' ? (isOpen ? '' : '250px') : '',
					marginTop: isHome && '0',
				}}
			>
				<nav
					className={`sidebarComponent ${isOpen ? 'open' : ''}`}
					style={styles[sidebarStates?.navStyle]}
				>
					{isOpen ? (
						<OpenedSideBarItemsComponent
							setsidebarStates={setsidebarStates}
							sidebarStates={sidebarStates}
							info={info}
							setInfo={setInfo}
							userWorkSpaceList={userWorkSpaceList}
							isOpen={isOpen}
							setIsOpen={setIsOpen}
						/>
					) : (
						<Tooltip
							title="Open Sidebar"
							placement="right"
							arrow={false}
							overlayInnerStyle={{
								padding: '6px 10px',
								borderRadius: '10px',
								fontSize: '14px',
								background: '#E8E8E8',
								color: '#202123',
								textAlign: 'center',
								marginLeft: '12px',
							}}
						>
							<SidebarClosingSvg
								onClick={() => setIsOpen(true)}
								style={{ cursor: 'pointer' }}
							/>
						</Tooltip>
					)}
				</nav>

				<CreateLeadModal
					modalIsOpen={info?.createLeadModal}
					closeModal={closeCreateLeadModal}
				/>
			</div>

			{isOpen && <div className="sidebar__overlay"></div>}
		</>
	);
};

export default memo(Sidebar);
