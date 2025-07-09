import React, { memo, useCallback, useContext, useState, useEffect } from 'react';
import SearchSvg from '../../../assets/svg/sidebar/SearchSvg';
// import LogoutRedSvg from '../../../assets/svg/sidebar/logout_red.svg';
// import PlusSvg from '../../../assets/svg/sidebar/PlusSvg';
import Cookies from 'js-cookie';
import Context from '../../../context/context';
// import useLogout from '../../hooks/useLogout';
import { fetchDomainName } from '../../../helpers';
import { ReactComponent as TickSvg } from '../../../assets/svg/tick.svg';
// import LogoutRedSvg from '../../../assets/svg/sidebar/logout_red.svg';
// import PlusSvg from '../../../assets/svg/sidebar/PlusSvg';

const workspaceOpenStyle = {
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	background: 'var(--card)',
	opacity: 0.4,
	height: '100vh',
	zIndex: 997,
	cursor: 'pointer',
};

const workspaceStyle = { display: 'flex', gap: '4px', alignItems: 'center' };
const currentId = localStorage.getItem('workspaceId');
const WorkspaceListComponent = ({ sidebarStates, setsidebarStates, info }) => {
	const {
		profileInfo: { userWorkSpaceList },
	} = useContext(Context);
	// const navigate = useNavigate();
	// const logoutFunc = useLogout();
	const [searchWorkspace, setSearchWorkspace] = useState('');
	const [focusedIndex, setFocusedIndex] = useState(0);

	useEffect(() => {
		if (userWorkSpaceList && info?.activeBusniessName?.activeWorkspaceId) {
			const activeIndex = userWorkSpaceList.findIndex(
				(workspace) =>
					workspace.activeWorkspaceId === info.activeBusniessName.activeWorkspaceId,
			);
			// if (activeIndex !== -1) {
			// 	setFocusedIndex(activeIndex);
			// }
		}
	}, [userWorkSpaceList, info?.activeBusniessName?.activeWorkspaceId]);

	const closeWorkspaceList = () => {
		setsidebarStates({ ...sidebarStates, workSpaceOpen: false, navStyle: 'open' });
	};

	const filteredWorkspaces =
		userWorkSpaceList
			?.filter((ws) =>
				ws?.businessName?.toLowerCase()?.includes(searchWorkspace?.toLowerCase()),
			)
			.sort((a, b) => {
				if (a?.activeWorkspaceId === currentId) return -1;
				if (b?.activeWorkspaceId === currentId) return 1;
				return 0;
			}) ?? [];

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (!filteredWorkspaces || filteredWorkspaces?.length === 0) return;

			if (e?.key === 'ArrowDown') {
				e?.preventDefault();
				setFocusedIndex((prev) =>
					prev < filteredWorkspaces?.length - 1 ? prev + 1 : prev,
				);
			} else if (e?.key === 'ArrowUp') {
				e?.preventDefault();
				setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
			} else if (e?.key === 'Enter') {
				handleSwitchWorkSpaceLogic(filteredWorkspaces[focusedIndex]);
			}
		};

		window?.addEventListener('keydown', handleKeyDown);
		return () => window?.removeEventListener('keydown', handleKeyDown);
	}, [filteredWorkspaces, focusedIndex]);
	useEffect(() => {
		const el = document.querySelector(`.singleWorkspace[data-index="${focusedIndex}"]`);
		if (el) {
			el.scrollIntoView({ block: 'nearest' });
		}
	}, [focusedIndex]);

	const handleSwitchWorkSpaceLogic = useCallback(
		(data) => {
			if (!data) return;
			const { activeWorkspaceId, isOnboard } = data;
			const workspaceId = localStorage.getItem('workspaceId');
			if (workspaceId === activeWorkspaceId) {
				return;
			}
			localStorage.setItem('workspaceId', activeWorkspaceId);
			localStorage.setItem('isOnboard', isOnboard);
			localStorage.setItem('showSettingsSidebar', 'false');
			const host = fetchDomainName();

			Cookies?.set('workspaceId', activeWorkspaceId, {
				sameSite: 'lax',
				domain: host,
			});

			// case : if there is no usertoken in cookies so everytime make sure usertoken and cookies should be set,
			let accessToken = localStorage.getItem('usertoken');
			Cookies?.set('usertoken', accessToken, {
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
				Cookies?.set('region', newWorkspaceRegion, {
					sameSite: 'lax',
					domain: host,
				});
			}
			window.location.href = '/home';
		},
		[userWorkSpaceList],
	);

	// const handleCreateWorkspace = () => {
	// 	navigate(`/create-workspace`);
	// };

	// const handleLogout = useCallback(() => {
	// 	logoutFunc();
	// }, [logoutFunc]);

	return (
		<>
			{sidebarStates?.workSpaceOpen && (
				<div style={workspaceOpenStyle} onClick={closeWorkspaceList} />
			)}
			<div className="workspaceListComponent">
				<div className="workspaceListHeader">
					<div className="backContinaer" onClick={closeWorkspaceList}>
						<h6>Switch Workspace</h6>
					</div>
					{userWorkSpaceList?.length > 10 && (
						<div className="searchContainer">
							<SearchSvg className="searchIcon" />
							<input
								type="text"
								placeholder="Search"
								className="searchWorkspace"
								onChange={(e) => setSearchWorkspace(e?.target?.value)}
								autoFocus={true}
							/>
						</div>
					)}
				</div>
				{userWorkSpaceList ? (
					<div className="workspaceList">
						{filteredWorkspaces?.map((singleWorkspace, index) => (
							<div
								key={singleWorkspace?.activeWorkspaceId}
								data-index={index}
								className={`singleWorkspace ${
									singleWorkspace?.activeWorkspaceId ===
									info?.activeBusniessName?.activeWorkspaceId
										? 'activeWorkspace '
										: ''
								}${index === focusedIndex ? 'focused' : ''}`}
								onClick={() => {
									handleSwitchWorkSpaceLogic(singleWorkspace);
								}}
							>
								<div style={workspaceStyle}>
									<div className="workSpaceCircle">
										{singleWorkspace?.logo_s3_500w_key ? (
											<img
												src={singleWorkspace?.logo_s3_500w_key}
												alt={singleWorkspace?.businessName}
											/>
										) : (
											<div className="no-logo">
												{singleWorkspace?.businessName?.slice(0, 2)}
											</div>
										)}
									</div>
									<h6>{singleWorkspace?.businessName}</h6>
								</div>

								{singleWorkspace?.activeWorkspaceId ===
									info?.activeBusniessName?.activeWorkspaceId && (
									<div className="activeWorkspaceCheck">
										<TickSvg />
									</div>
								)}
							</div>
						))}

						{/* <div className="workspaceListFooter">
							<hr
								style={{
									border: '0.1px solid var(--stroke)',
									opacity: '.4',
									width: '212px',
									alignSelf: 'center',
								}}
							/>
							<div className="singleWorkspace logoutOption" onClick={handleLogout}>
								<h6 style={{ color: 'var(--error)' }}>Logout</h6>
								<div className="workSpaceCircle">
									<LogoutRedSvg />
								</div>
							</div>
						</div> */}
					</div>
				) : (
					''
				)}
			</div>
		</>
	);
};

export default memo(WorkspaceListComponent);
