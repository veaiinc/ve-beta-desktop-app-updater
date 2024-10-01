import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowLeftSvg } from '../../../assets/svg/sidebar/leftarrowwhite.svg';
import { ReactComponent as CircletickwhiteSvg } from '../../../assets/svg/sidebar/circletickwhite.svg';
import PlusSvg from '../../../assets/svg/sidebar/PlusSvg';
import Cookies from 'js-cookie';

const WorkspaceListComponent = ({ sidebarStates, setsidebarStates, userWorkSpaceList, info }) => {
	const navigate = useNavigate();

	const closeWorkspaceList = () => {
		setsidebarStates({ ...sidebarStates, workSpaceOpen: false, navStyle: 'open' });
	};

	const handleSwitchWorkSpaceLogic = useCallback((data) => {
		const workspaceId = localStorage.getItem('workspaceId');
		if (workspaceId === data) {
			return;
		}
		localStorage.setItem('workspaceId', data);
		console.log(userWorkSpaceList?.[0]);
		Cookies.set('workspaceID', userWorkSpaceList?.[0], {
			sameSite: 'lax',
			domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
		});

		navigate('/sales');

		// window.location.reload();
	}, []);

	return (
		<div className="workspaceListComponent">
			<div className="backContinaer" onClick={closeWorkspaceList}>
				<ArrowLeftSvg />
				<h6>Switch Workspace</h6>
			</div>

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
							handleSwitchWorkSpaceLogic(singleWorkspace?.activeWorkspaceId);
						}}
					>
						<div className="workSpaceCircle">
							<img
								src={singleWorkspace?.logo_s3_500w_key}
								alt={singleWorkspace?.businessName}
							/>
						</div>
						<h6>{singleWorkspace?.businessName}</h6>

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
		</div>
	);
};

export default memo(WorkspaceListComponent);
