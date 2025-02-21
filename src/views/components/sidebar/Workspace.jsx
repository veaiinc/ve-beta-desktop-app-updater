import React, { memo, useCallback, useContext, useState } from 'react';
import { ReactComponent as ArrowLeftSvg } from '../../../assets/svg/sidebar/leftarrowwhite.svg';
import { ReactComponent as CircletickwhiteSvg } from '../../../assets/svg/sidebar/circletickwhite.svg';
import SearchSvg from '../../../assets/svg/sidebar/SearchSvg';
import { ReactComponent as LogoutRedSvg } from '../../../assets/svg/sidebar/logout_red.svg';
import PlusSvg from '../../../assets/svg/sidebar/PlusSvg';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import Context from '../../../context/context';
import useLogout from '../../hooks/useLogout';
import { fetchDomainName } from '../../../helpers';

const WorkspaceListComponent = ({ sidebarStates, setsidebarStates, userWorkSpaceList, info }) => {
	const navigate = useNavigate();
	const { galleryId } = useParams();
	const logoutFunc = useLogout();
	const [searchWorkspace, setSearchWorkspace] = useState('');

	const {
		profileInfo: { userDetailsData },
	} = useContext(Context);

	const closeWorkspaceList = () => {
		setsidebarStates({ ...sidebarStates, workSpaceOpen: false, navStyle: 'open' });
	};

	const filteredWorkspaces = userWorkSpaceList?.filter((workspace) =>
		workspace?.businessName?.toLowerCase().includes(searchWorkspace.toLowerCase()),
	);
	const handleSwitchWorkSpaceLogic = useCallback(
		(data) => {
			const { activeWorkspaceId, isOnboard } = data;
			const workspaceId = localStorage.getItem('workspaceId');
			if (workspaceId === activeWorkspaceId) {
				return;
			}
			localStorage.setItem('workspaceId', activeWorkspaceId);
			localStorage.setItem('isOnboard', isOnboard);

			const host = fetchDomainName();
			Cookies.set('workspaceID', activeWorkspaceId, {
				sameSite: 'lax',
				domain: host,
			});

			const currentRegion = localStorage.getItem('region');
			let newWorkspaceRegion;
			for (let i = 0; i < userWorkSpaceList?.length; i++) {
				if (userWorkSpaceList?.[i]?.activeWorkspaceId === activeWorkspaceId) {
					newWorkspaceRegion = userWorkSpaceList?.[i]?.region;
					break;
				}
			}
			if (newWorkspaceRegion !== currentRegion) {
				localStorage.setItem('region', newWorkspaceRegion);
				Cookies.set('region', newWorkspaceRegion, {
					sameSite: 'lax',
					domain: host,
				});
			}
			window.location.reload();
		},
		[userWorkSpaceList],
	);

	const handleCreateWorkspace = () => {
		navigate(`/create-workspace`);
	};

	const handleLogout = useCallback(() => {
		logoutFunc();
	}, [logoutFunc]);

	return (
		<>
			{sidebarStates?.workSpaceOpen && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: '#0a0a0b',
						opacity: 0.5,
						height: '100vh',
						zIndex: 997,
						cursor: 'pointer',
					}}
					onClick={closeWorkspaceList}
				/>
			)}
			<div className="workspaceListComponent">
				<div className="workspaceListHeader">
					<div className="backContinaer" onClick={closeWorkspaceList}>
						<ArrowLeftSvg />
						<h6>Switch Workspace</h6>
					</div>
					{userWorkSpaceList?.length > 10 && (
						<div className="searchContainer">
							{!searchWorkspace && <SearchSvg className="searchIcon" />}
							<input
								type="text"
								placeholder="Search"
								className="searchWorkspace"
								onChange={(e) => setSearchWorkspace(e.target.value)}
							/>
						</div>
					)}
				</div>
				{userWorkSpaceList ? (
					<div className="workspaceList">
						{filteredWorkspaces?.map((singleWorkspace, index) => (
							<div
								key={singleWorkspace?.activeWorkspaceId}
								className={`singleWorkspace ${
									singleWorkspace?.activeWorkspaceId ===
									info?.activeBusniessName?.activeWorkspaceId
										? 'activeWorkspace'
										: ''
								}`}
								onClick={() => {
									handleSwitchWorkSpaceLogic(singleWorkspace);
								}}
							>
								<h6>{singleWorkspace?.businessName}</h6>
								<div className="workSpaceCircle">
									{singleWorkspace?.logo_s3_500w_key ? (
										<img
											src={singleWorkspace?.logo_s3_500w_key}
											alt={singleWorkspace?.businessName}
										/>
									) : (
										''
										// <div className="no-logo">
										// 	{/* {singleWorkspace?.businessName?.slice(0, 2)} */}
										// </div>
									)}
								</div>

								{/* {singleWorkspace?.activeWorkspaceId ===
								info?.activeBusniessName?.activeWorkspaceId && (
								<div className="activeWorkspaceCheck">
									<CircletickwhiteSvg />
								</div>
							)} */}
							</div>
						))}

						<div className="workspaceListFooter">
							<hr
								style={{
									border: '0.7px solid #333334',
									width: '212px',
									alignSelf: 'center',
								}}
							/>
							<div className="singleWorkspace" onClick={handleCreateWorkspace}>
								<h6>Add Workspace</h6>
								<div className="workSpaceCircle">
									<PlusSvg />
								</div>
							</div>
							<div className="singleWorkspace logoutOption" onClick={handleLogout}>
								<h6 style={{ color: '#D73A49' }}>Logout</h6>
								<div className="workSpaceCircle">
									<LogoutRedSvg />
								</div>
							</div>
						</div>
					</div>
				) : (
					''
				)}
			</div>
		</>
	);
};

export default memo(WorkspaceListComponent);
