import React, { useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { veAiModulesItemsList, bottomOptionsList } from './sidebarindex';
// import { ReactComponent as DownArrowSmallSvg } from '../../../../assets/svg/sidebar/downarrowsmall.svg';
import { ReactComponent as DownArrowSmallSvg } from '../../../assets/svg/sidebar/downarrowsmall.svg';
import { ReactComponent as LogoutRedSvg } from '../../../assets/svg/sidebar/logout_red.svg';
import WorkspaceListComponent from './Workspace';
import useLogout from '../../hooks/useLogout';

const OpenedSideBarHoverStateIcons = ({
	name,
	Icon,
	route,
	initialColor = null,
	isActive,
	navigateTo,
}) => {
	const [isHover, setisHover] = useState(false);

	const onMoutseEnter = () => {
		if (isActive) return;
		setisHover(true);
	};
	const onMoutseLeave = () => {
		if (isActive) return;
		setisHover(false);
	};

	const redirectToFunction = () => {
		if (!route) return;
		navigateTo(route);
	};

	return (
		<div
			className={`singleModuleItem ${isActive ? 'activeListModule' : ''}`}
			onMouseEnter={onMoutseEnter}
			onMouseLeave={onMoutseLeave}
			onClick={redirectToFunction}
		>
			<p>{name}</p>
			{isActive ? <Icon fill={'#FFF'} /> : <Icon fill={isHover ? '#FFF' : initialColor} />}
		</div>
	);
};

const OpenedSideBarItemsComponent = ({
	sidebarStates,
	setsidebarStates,
	info,
	userWorkSpaceList,
}) => {
	const navigate = useNavigate();
	const logoutFunc = useLogout();

	const handleLogout = useCallback(async () => {
		logoutFunc();
	}, [logoutFunc]);

	const openWorkspacesFunction = () => {
		setsidebarStates({ ...sidebarStates, workSpaceOpen: true, navStyle: 'workspace' });
	};

	const handleNavigateFunction = (route) => {
		navigate(route);
		setsidebarStates({ ...sidebarStates, isOpen: false, navStyle: 'close' });
	};

	return sidebarStates?.workSpaceOpen ? (
		<WorkspaceListComponent
			setsidebarStates={setsidebarStates}
			sidebarStates={sidebarStates}
			info={info}
			userWorkSpaceList={userWorkSpaceList}
		/>
	) : (
		<div className="openSideBarComponent">
			<div className="topOptionsList">
				<div className="currentWorkspaceDiv" onClick={openWorkspacesFunction}>
					<div className="detailsDiv">
						{info?.activeBusniessName?.logo_s3_500w_key ? (
							<img
								src={info?.activeBusniessName?.logo_s3_500w_key}
								alt={info?.activeBusniessName?.businessName}
							/>
						) : (
							<div className="no-logo">
								{info?.activeBusniessName?.businessName?.slice(0, 2)}
							</div>
						)}
						<h6>{info?.activeBusniessName?.businessName}</h6>
					</div>
					<DownArrowSmallSvg />
				</div>

				<div className="allmodulesList">
					{veAiModulesItemsList?.map((singleItems, index) => (
						<OpenedSideBarHoverStateIcons
							name={singleItems.name}
							Icon={singleItems.icon}
							initialColor={singleItems.initialColor}
							route={singleItems?.route}
							navigateTo={handleNavigateFunction}
							key={singleItems?.name}
							isActive={info?.activeRoute === singleItems?.moduleRoute}
						/>
					))}
				</div>
			</div>

			<div className="bottomOptionsList">
				{bottomOptionsList?.map((singleItems, index) => (
					<OpenedSideBarHoverStateIcons
						name={singleItems?.name}
						Icon={singleItems?.icon}
						route={singleItems?.route}
						initialColor={singleItems?.initialColor}
						navigateTo={handleNavigateFunction}
						key={singleItems?.name}
						isActive={info?.activeRoute === singleItems?.moduleRoute}
					/>
				))}

				<div className={'singleModuleItem logoutItem'} onClick={handleLogout}>
					<p>Logout</p>
					<LogoutRedSvg />
				</div>
			</div>
		</div>
	);
};

export default memo(OpenedSideBarItemsComponent);
