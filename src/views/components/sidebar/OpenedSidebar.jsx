import React, { useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { veAiModulesItemsList, bottomOptionsList, veAiSubModulesItemsList } from './sidebarindex';
// import { ReactComponent as DownArrowSmallSvg } from '../../../../assets/svg/sidebar/downarrowsmall.svg';
import { ReactComponent as DownArrowSmallSvg } from '../../../assets/svg/sidebar/downarrowsmall.svg';
import { ReactComponent as RefreshSvg } from '../../../assets/svg/sidebar/Refresh.svg';
import { ReactComponent as VeAiSvg } from '../../../assets/svg/sidebar/VeAi.svg';

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
	const [isDropdownVisible, setDropdownVisible] = useState(false);
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
	const toggleDropdown = () => {
		setDropdownVisible(!isDropdownVisible);
	};

	return (
		<div
			className={`singleModuleItem ${isActive ? 'activeListModule' : ''} ${
				isDropdownVisible ? 'calendar-active' : ''
			}`}
			onMouseEnter={onMoutseEnter}
			onMouseLeave={onMoutseLeave}
			onClick={redirectToFunction}
		>
			{isActive ? <Icon fill={'#FFF'} /> : <Icon fill={isHover ? '#FFF' : initialColor} />}
			<p>{name}</p>
			{name === 'Calendar' && (
				<>
					<div>
						<span onClick={toggleDropdown} style={{ marginLeft: '35px' }}>
							<DownArrowSmallSvg
								className={`downArrow ${isDropdownVisible ? 'rotate' : ''}`}
								style={{ height: '16px', width: '16px' }}
							/>
						</span>
					</div>
					{isDropdownVisible && (
						<div className={`dropdownMenu ${isDropdownVisible ? 'visible' : ''}`}>
							{veAiSubModulesItemsList?.map((subItem, index) => (
								<div key={subItem?.name} className="subItem">
									{subItem.icon && <subItem.icon fill={'#FFF'} />}{' '}
									{/* Render icon */}
									<p>{subItem.name}</p> {/* Render title */}
								</div>
							))}
						</div>
					)}
				</>
			)}
		</div>
	);
};
const OpenedSideBarHoverStateIcons2 = ({
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
				<div className="veAiLogoDiv">
					<VeAiSvg />
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
							style={{
								fontSize: '14px',
								fontStyle: 'normal',
								fontWeight: '500',
								fontFamily: 'Inter',
							}}
						/>
					))}
				</div>
				<hr style={{ border: '0.7px solid #333334' }} />
			</div>

			<div className="bottomOptionsList">
				{bottomOptionsList?.map((singleItems, index) => (
					<OpenedSideBarHoverStateIcons2
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
				<div className="currentWorkspaceDiv" onClick={openWorkspacesFunction}>
					<div className="detailsDiv">
						<div className="workspaceDetailsDiv">
							<img
								src={info?.activeBusniessName?.logo_s3_500w_key}
								alt={info?.activeBusniessName?.activeWorkspaceId}
							/>
							<h6>{info?.activeBusniessName?.businessName}</h6>
						</div>
						<div>
							<RefreshSvg />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(OpenedSideBarItemsComponent);
