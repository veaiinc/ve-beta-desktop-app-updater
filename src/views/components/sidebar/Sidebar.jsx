import React, { useState, useContext, useEffect, memo } from 'react';
import '../../../assets/scss/sidebar.scss';
import { useNavigate, useLocation } from 'react-router-dom';
import Intercom from '@intercom/messenger-js-sdk';
import OpenedSideBarItemsComponent from './OpenedSidebar';
import ClosedSideBarItemsComponent from './ClosedSidebar';
import Context from '../../../context/context';
import { styles } from './sidebarindex';
import WorkspaceListComponent from './Workspace';

const Sidebar = ({ activeWorkspaceId }) => {
	const {
		profileInfo: { userWorkSpaceList, getUserWorkSpaceList, userDetailsData, getUserDetails },
	} = useContext(Context);
	const location = useLocation();
	const navigate = useNavigate();
	const accessibleWorkspaces = JSON.parse(localStorage.getItem('accessibleWorkspaces'));

	const [sidebarStates, setsidebarStates] = useState({
		isOpen: false,
		workSpaceOpen: false,
		navStyle: 'close',
	});

	const [info, setInfo] = useState({
		switchWorkspaceModal: false,
		activeBusniessName: '',
		createLeadModal: false,
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
				user_id: userDetailsData._id,
				name: userDetailsData.firstName + ' ' + userDetailsData.lastName,
				email: userDetailsData.email,
				company: {
					name: info.activeBusniessName.activeWorkspaceId,
					id: info.activeBusniessName.businessName,
					region: info.activeBusniessName.region,
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

	return (
		<div className="FullScreenSidebar">
			<nav className="sidebar2" style={styles[sidebarStates?.navStyle]}>
				{!sidebarStates?.workSpaceOpen &&
					(sidebarStates?.isOpen ? (
						<OpenedSideBarItemsComponent
							setsidebarStates={setsidebarStates}
							sidebarStates={sidebarStates}
							info={info}
							setInfo={setInfo}
						/>
					) : (
						<ClosedSideBarItemsComponent
							setsidebarStates={setsidebarStates}
							sidebarStates={sidebarStates}
							info={info}
						/>
					))}

				{sidebarStates?.workSpaceOpen && sidebarStates?.isOpen && (
					<WorkspaceListComponent
						setsidebarStates={setsidebarStates}
						sidebarStates={sidebarStates}
						info={info}
						userWorkSpaceList={userWorkSpaceList}
					/>
				)}
			</nav>

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
		</div>
	);
};

export default memo(Sidebar);
