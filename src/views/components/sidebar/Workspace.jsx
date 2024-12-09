import React, { memo, useCallback, useContext } from 'react';
import { ReactComponent as ArrowLeftSvg } from '../../../assets/svg/sidebar/leftarrowwhite.svg';
import { ReactComponent as CircletickwhiteSvg } from '../../../assets/svg/sidebar/circletickwhite.svg';
import { ReactComponent as DoubleBackArrowSvg } from '../../../assets/svg/sidebar/DoubleBackArrow.svg';
import PlusSvg from '../../../assets/svg/sidebar/PlusSvg';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import { fetchDomainName } from '../../../helpers';

const WorkspaceListComponent = ({ sidebarStates, setsidebarStates, userWorkSpaceList, info }) => {
	const navigate = useNavigate();
	const { galleryId } = useParams();

	const {
		profileInfo: { userDetailsData },
	} = useContext(Context);

	const closeWorkspaceList = () => {
		setsidebarStates({ ...sidebarStates, workSpaceOpen: false, navStyle: 'open' });
	};

	const handleSwitchWorkSpaceLogic = useCallback((data) => {
		const { activeWorkspaceId, isOnboard } = data;
		const workspaceId = localStorage.getItem('workspaceId');
		if (workspaceId === activeWorkspaceId) {
			return;
		}
		const host = fetchDomainName();
		localStorage.setItem('workspaceId', activeWorkspaceId);
		localStorage.setItem('isOnboard', isOnboard);
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
		if (galleryId) {
			navigate(`/home`);
		}

		window.location.reload();
	}, []);

	const handleCreateWorkspace = () => {
		const username = userDetailsData?.firstName ?? '';
		navigate(`/onboarding?username=${username}`);
	};

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
						<h6>
							{singleWorkspace?.businessName.length > 15
								? `${singleWorkspace?.businessName.slice(0, 15)}...`
								: singleWorkspace?.businessName}
						</h6>
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

						{singleWorkspace?.activeWorkspaceId ===
							info?.activeBusniessName?.activeWorkspaceId && (
							<div className="activeWorkspaceCheck">
								<CircletickwhiteSvg />
							</div>
						)}
					</div>
				))}

				<div className="singleWorkspace">
					<div className="workSpaceCircle" onClick={handleCreateWorkspace}>
						<PlusSvg fill={'#5d43fb'} />
					</div>
					<h6>Create Workspace</h6>
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
