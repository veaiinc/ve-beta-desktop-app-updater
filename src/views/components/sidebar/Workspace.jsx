import React, { memo, useCallback, useContext, useState } from 'react';
import { ReactComponent as ArrowLeftSvg } from '../../../assets/svg/sidebar/leftarrowwhite.svg';
import { ReactComponent as CircletickwhiteSvg } from '../../../assets/svg/sidebar/circletickwhite.svg';
import PlusSvg from '../../../assets/svg/sidebar/PlusSvg';
import Cookies from 'js-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import Context from '../../../context/context';

const WorkspaceListComponent = ({ sidebarStates, setsidebarStates, userWorkSpaceList, info }) => {
	const navigate = useNavigate();
	const { galleryId } = useParams();
	const [searchWorkspace, setSearchWorkspace] = useState('');
	const {
		profileInfo: { userDetailsData },
	} = useContext(Context);

	const closeWorkspaceList = () => {
		setsidebarStates({ ...sidebarStates, workSpaceOpen: false, navStyle: 'open' });
	};

	const filteredWorkspaces = userWorkSpaceList?.filter((workspace) =>
		workspace.businessName.toLowerCase().includes(searchWorkspace.toLowerCase()),
	);

	const handleSwitchWorkSpaceLogic = useCallback((data) => {
		const { activeWorkspaceId, isOnboard } = data;
		const workspaceId = localStorage.getItem('workspaceId');
		if (workspaceId === data) {
			return;
		}
		localStorage.setItem('workspaceId', activeWorkspaceId);
		localStorage.setItem('isOnboard', isOnboard);
		Cookies.set('workspaceID', activeWorkspaceId, {
			sameSite: 'lax',
			domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
		});
		window.location.reload();
	}, []);

	const handleCreateWorkspace = () => {
		navigate(`/create-workspace`);
	};

	return (
		<div className="workspaceListComponent">
			<div className="backContinaer" onClick={closeWorkspaceList}>
				<ArrowLeftSvg />
				<h6>Switch Workspace</h6>
			</div>
			{userWorkSpaceList?.length > 10 && (
				<div>
					<input
						type="text"
						placeholder="Search Workspace"
						className="searchWorkspace"
						onChange={(e) => setSearchWorkspace(e.target.value)}
					/>
				</div>
			)}
			{userWorkSpaceList ? (
				<div className="workspaceList overlay">
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
									<div className="no-logo">
										{singleWorkspace?.businessName?.slice(0, 2)}
									</div>
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

					<div className="singleWorkspace" onClick={handleCreateWorkspace}>
						<div className="workSpaceCircle">
							<PlusSvg fill={'#5d43fb'} />
						</div>
						<h6>Add Workspace</h6>
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
};

export default memo(WorkspaceListComponent);
