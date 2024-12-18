import React, { memo, useCallback } from 'react';
import { ReactComponent as ArrowLeftSvg } from '../../../assets/svg/sidebar/leftarrowwhite.svg';
import { ReactComponent as CircletickwhiteSvg } from '../../../assets/svg/sidebar/circletickwhite.svg';
import { ReactComponent as DoubleBackArrowSvg } from '../../../assets/svg/sidebar/DoubleBackArrow.svg';
import PlusSvg from '../../../assets/svg/sidebar/PlusSvg';
import Cookies from 'js-cookie';

const WorkspaceListComponent = ({ sidebarStates, setsidebarStates, userWorkSpaceList, info }) => {
	const closeWorkspaceList = () => {
		setsidebarStates({ ...sidebarStates, workSpaceOpen: false, navStyle: 'open' });
	};

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

	return (
		<div className="workspaceListComponent">
			<div className="workspaceList">
				{userWorkSpaceList.map((singleWorkspace, index) => (
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
						<h6 className="workspaceName">{singleWorkspace?.businessName}</h6>
						<div className="workSpaceCircle">
							<img
								src={singleWorkspace?.logo_s3_500w_key}
								alt={singleWorkspace?.businessName}
							/>
						</div>

						{singleWorkspace?.activeWorkspaceId ===
							info?.activeBusniessName?.activeWorkspaceId && (
							<div className="activeWorkspaceCheck">
								<CircletickwhiteSvg />
							</div>
						)}
					</div>
				))}

				<div className="singleWorkspace">
					<div className="workSpaceCircle">
						<PlusSvg fill={'#5d43fb'} />
					</div>
					<h6>Add Workspace</h6>
				</div>
			</div>
			<div className="backContinaer" onClick={closeWorkspaceList}>
				<DoubleBackArrowSvg />
				<h6>Switch Workspace</h6>
			</div>
		</div>
	);
};

export default memo(WorkspaceListComponent);
