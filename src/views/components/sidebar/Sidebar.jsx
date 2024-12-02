import React, { useState, useContext, useEffect, useCallback, memo } from 'react';
import '../../../assets/scss/sidebar.scss';
import { useLocation } from 'react-router-dom';
import Intercom from '@intercom/messenger-js-sdk';
import OpenedSideBarItemsComponent from './OpenedSidebar';
import ClosedSideBarItemsComponent from './ClosedSidebar';
import Context from '../../../context/context';
import { styles } from './sidebarindex';
import CreateLeadModal from '../modalsV2/proposalModals/CreateLeadModal';

const Sidebar = ({ activeWorkspaceId }) => {
	const {
		profileInfo: { userWorkSpaceList, getUserWorkSpaceList, userDetailsData, getUserDetails },
	} = useContext(Context);
	const location = useLocation();

	const [sidebarStates, setsidebarStates] = useState({
		isOpen: false,
		workSpaceOpen: false,
		navStyle: 'close',
	});

	const [info, setInfo] = useState({
		switchWorkspaceModal: false,
		activeBusniessName: '',
		createLeadModal: false,
		isNewFeaturePlusOpen: false,
		activeRoute: '/' + location.pathname.split('/')[1],
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

	const closeCreateLeadModal = useCallback(async () => {
		setInfo((prev) => ({ ...prev, createLeadModal: false }));
	}, []);

	return (
		<>
			<div
				className="FullScreenSidebar"
				style={{
					alignItems: sidebarStates?.workSpaceOpen ? 'flex-start' : ' ',
					maxHeight:
						info?.activeRoute === '/home' ? (sidebarStates?.isOpen ? '' : '') : '',
					minHeight:
						info?.activeRoute === '/home' ? (sidebarStates?.isOpen ? '' : '250px') : '',
				}}
			>
				<nav className="sidebarComponent" style={styles[sidebarStates?.navStyle]}>
					{sidebarStates?.isOpen ? (
						<OpenedSideBarItemsComponent
							setsidebarStates={setsidebarStates}
							sidebarStates={sidebarStates}
							info={info}
							setInfo={setInfo}
							userWorkSpaceList={userWorkSpaceList}
						/>
					) : (
						<ClosedSideBarItemsComponent
							setsidebarStates={setsidebarStates}
							sidebarStates={sidebarStates}
							info={info}
							setInfo={setInfo}
						/>
					)}
				</nav>

				<CreateLeadModal
					modalIsOpen={info?.createLeadModal}
					closeModal={closeCreateLeadModal}
				/>
			</div>

			{sidebarStates?.isOpen && (
				<div
					className="sidebar__overlay"
					onClick={() =>
						setsidebarStates({
							...sidebarStates,
							isOpen: false,
							navStyle: 'close',
							workSpaceOpen: false,
						})
					}
				></div>
			)}
		</>
	);
};

export default memo(Sidebar);
