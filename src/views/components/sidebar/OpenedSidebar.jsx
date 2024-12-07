import React, { useState, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { veAiModulesItemsList, bottomOptionsList, veAiSubModulesItemsList } from './sidebarindex';
import { ReactComponent as DownArrowSmallSvg } from '../../../assets/svg/sidebar/downarrowsmall.svg';
import { ReactComponent as RefreshSvg } from '../../../assets/svg/sidebar/Refresh.svg';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as LogoutRedSvg } from '../../../assets/svg/sidebar/logout_red.svg';

import WorkspaceListComponent from './Workspace';
import useLogout from '../../hooks/useLogout';

const CommonBottomSection = ({ handleLogout, openWorkspacesFunction }) => (
	<>
		<div
			className="currentWorkspaceDiv"
			onClick={openWorkspacesFunction}
			style={{ cursor: 'pointer', width: '218px' }}
		>
			<div
				className="detailsDiv"
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					width: '218px',
					padding: '12px 16px',
					cursor: 'pointer',
				}}
			>
				<div style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>
					Switch Workspace
				</div>
				<div>
					<RefreshSvg />
				</div>
			</div>
		</div>
		<div
			className={'singleModuleItem logoutItem'}
			onClick={handleLogout}
			style={{
				cursor: 'pointer',
				display: 'flex',
				flexDirection: 'row',
				width: '218px',
				justifyContent: 'space-between',
				padding: '12px 16px',
			}}
		>
			<p style={{ fontSize: '14px', fontWeight: '500', color: 'red' }}>Logout</p>
			<LogoutRedSvg />
		</div>
	</>
);

const OpenedSideBarHoverStateIcons = ({
	name,
	Icon,
	route,
	initialColor = null,
	isActive,
	navigateTo,
	isSelected,
	subModules,
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
	const toggleDropdown = (e) => {
		e.stopPropagation();
		e.preventDefault();
		setDropdownVisible(!isDropdownVisible);
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
			}}
		>
			<div
				className={`singleModuleItem ${isActive ? 'activeListModule' : ''} ${
					isDropdownVisible ? 'calendar-active' : ''
				}`}
				onMouseEnter={onMoutseEnter}
				onMouseLeave={onMoutseLeave}
				onClick={redirectToFunction}
				style={{
					marginBottom:
						isDropdownVisible && subModules?.length
							? `${subModules.length * 40}px`
							: '0',
				}}
			>
				<p>{name}</p>
				{isDropdownVisible && subModules?.length > 0 && (
					<div className={`dropdownMenu ${isDropdownVisible ? 'visible' : ''}`}>
						{subModules?.map((subItem, index) => (
							<div key={subItem?.name} className="subItem">
								<p>{subItem.name}</p>
								{subItem.icon && <subItem.icon fill={'#FFF'} />}
							</div>
						))}
					</div>
				)}
			</div>
			{subModules?.length > 0 && (
				<div onClick={toggleDropdown} style={{ marginTop: '10px' }}>
					<DownArrowSmallSvg
						className={`downArrow ${isDropdownVisible ? 'rotate' : ''}`}
						style={{ height: '16px', width: '16px' }}
					/>
				</div>
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
	const [selectedOption, setSelectedOption] = useState(null);
	const [aiChatsDropdownVisible, setAiChatsDropdownVisible] = useState(false);

	const handleLogout = useCallback(async () => {
		logoutFunc();
	}, [logoutFunc]);

	const openWorkspacesFunction = () => {
		setsidebarStates({ ...sidebarStates, workSpaceOpen: true, navStyle: 'workspace' });
	};

	const handleNavigateFunction = (route, singleItems) => {
		setSelectedOption(singleItems?.name);
		navigate(route);
		setsidebarStates({
			...sidebarStates,
			selectedModule: singleItems?.name,
		});
	};
	const handleSidebarCollapse = (e) => {
		e.stopPropagation();
		setsidebarStates({ ...sidebarStates, isOpen: false, navStyle: 'close' });
	};

	return sidebarStates?.workSpaceOpen ? (
		<>
			<WorkspaceListComponent
				setsidebarStates={setsidebarStates}
				sidebarStates={sidebarStates}
				info={info}
				userWorkSpaceList={userWorkSpaceList}
			/>
			<CommonBottomSection
				handleLogout={handleLogout}
				openWorkspacesFunction={openWorkspacesFunction}
			/>
		</>
	) : (
		<div className="openSideBarComponent">
			<div className="topOptionsList">
				<div className="veAiLogoDiv">
					<div className="workspaceDetailsDiv">
						<img
							src={info?.activeBusniessName?.logo_s3_500w_key}
							alt={info?.activeBusniessName?.activeWorkspaceId}
						/>
						<h6>{info?.activeBusniessName?.businessName}</h6>
					</div>
					<SidebarClosingSvg
						className="collapseArrow"
						onClick={handleSidebarCollapse}
						style={{ cursor: 'pointer' }}
					/>
				</div>
				<div className="allmodulesList" style={{ marginLeft: '16px' }}>
					{veAiModulesItemsList?.map((singleItems, index) => (
						<div>
							<OpenedSideBarHoverStateIcons
								name={singleItems.name}
								Icon={singleItems.icon}
								initialColor={singleItems.initialColor}
								route={singleItems?.route}
								navigateTo={(route) => {
									handleNavigateFunction(route, singleItems);
								}}
								key={index}
								isSelected={selectedOption === singleItems?.name}
								isActive={info?.activeRoute === singleItems?.moduleRoute}
								subModules={singleItems?.subModules}
								style={{
									fontSize: '14px',
									fontStyle: 'normal',
									fontWeight: '500',
									fontFamily: 'Inter',
								}}
							/>
						</div>
					))}
				</div>
				<hr style={{ border: '0.7px solid #333334' }} />
				<div
					className="AichatDiv"
					onClick={() => setAiChatsDropdownVisible(!aiChatsDropdownVisible)}
				>
					<div style={{ fontSize: '14px', fontWeight: '500', color: '#E8E8E8' }}>
						Recent Ai chats
					</div>
					<DownArrowSmallSvg
						className={`downArrow ${aiChatsDropdownVisible ? 'rotate' : ''}`}
						style={{ height: '16px', width: '16px' }}
					/>
				</div>
				{aiChatsDropdownVisible && (
					<div className="aiChatsSubmodules">
						<div
							className="subModule"
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								padding: '12px 16px',
								cursor: 'pointer',
							}}
						>
							<p
								style={{
									fontSize: '14px',
									fontWeight: '500',
									color: '#E8E8E8',
								}}
							>
								Chat 1
							</p>
						</div>
						<div
							className="subModule"
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								padding: '12px 16px',
								cursor: 'pointer',
							}}
						>
							<p
								style={{
									fontSize: '14px',
									fontWeight: '500',
									color: '#E8E8E8',
								}}
							>
								Chat 2
							</p>
						</div>
						<div
							className="subModule"
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								padding: '12px 16px',
								cursor: 'pointer',
							}}
						>
							<p
								style={{
									fontSize: '14px',
									fontWeight: '500',
									color: '#E8E8E8',
								}}
							>
								Chat 3
							</p>
						</div>
					</div>
				)}
			</div>

			<div className="bottomOptionsList">
				{/* <div></div> */}
				<div className="creditsLeft">
					<div>
						<div style={{ fontSize: '14px', fontWeight: '500', color: '#E8E8E8' }}>
							100
						</div>
						<div style={{ fontSize: '14px', fontWeight: '500', color: '#E8E8E8' }}>
							Credit Left
						</div>
					</div>
					<div className="creditSvg">
						<svg width="30" height="30" viewBox="0 0 30 30">
							<defs>
								<linearGradient
									id="paint0_linear_14532_74799"
									x1="-0.661765"
									y1="2.69729e-07"
									x2="30.4666"
									y2="1.98941"
									gradientUnits="userSpaceOnUse"
								>
									<stop offset="0.000100017" stop-color="#C39DF8" />
									<stop offset="1" stop-color="#EC7C9D" />
								</linearGradient>
							</defs>
							<circle
								cx="15"
								cy="15"
								r="12.5"
								fill="none"
								stroke="#333334"
								strokeWidth="5"
							/>
							{/* Progress circle */}
							<circle
								cx="15"
								cy="15"
								r="12.5"
								fill="none"
								stroke="url(#paint0_linear_14532_74799)"
								strokeWidth="5"
								strokeDasharray={`${(100 / 100) * 78.54} 78.54`}
								transform="rotate(-90 15 15)"
							/>
						</svg>
					</div>
				</div>
				{bottomOptionsList?.map((singleItems, index) => (
					<OpenedSideBarHoverStateIcons2
						name={singleItems?.name}
						Icon={singleItems?.icon}
						route={singleItems?.route}
						initialColor={singleItems?.initialColor}
						navigateTo={handleNavigateFunction}
						key={singleItems?.name}
						isActive={info?.activeRoute === singleItems?.moduleRoute}
						style={{ fontSize: '14px', padding: '12px 16px' }}
					/>
				))}
				<CommonBottomSection
					handleLogout={handleLogout}
					openWorkspacesFunction={openWorkspacesFunction}
				/>
			</div>
		</div>
	);
};

export default memo(OpenedSideBarItemsComponent);
