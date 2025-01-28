import React, { useState, memo, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	veAiModulesItemsList,
	bottomOptionsList,
	veAiSubModulesItemsList,
	veAiModules,
	AiOptions,
} from './sidebarindex';
import { ReactComponent as DownArrowSmallSvg } from '../../../assets/svg/sidebar/downarrowsmall.svg';
import { ReactComponent as NotificationSvg } from '../../../assets/svg/sidebar/notification.svg';
import { ReactComponent as RefreshSvg } from '../../../assets/svg/sidebar/Refresh.svg';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as LogoutRedSvg } from '../../../assets/svg/sidebar/logout_red.svg';
import { ReactComponent as CrossSvg } from '../../../assets/svg/sidebar/CrossSvg.svg';
import { ReactComponent as RightArrowSvg } from '../../../assets/svg/sidebar/RightArrow.svg';
import WorkspaceListComponent from './Workspace';
import useLogout from '../../hooks/useLogout';
import { Tooltip } from 'antd';
const CommonBottomSection = ({ handleLogout, openWorkspacesFunction, workSpaceOpen }) => (
	<div
		className="commonBottomSection"
		style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
	>
		{/* <div className="currentWorkspaceDiv" onClick={openWorkspacesFunction}>
			<div
				className="singleModuleItem currentWorkspaceDetails"
				style={{
					display: 'flex',
					width: '218px',
					justifyContent: 'space-between',
					padding: '12px 16px',
					backgroundColor: workSpaceOpen ? '#2E2F33' : '',
					borderRadius: '100px',
				}}
			>
				<div style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>
					Switch Workspace
				</div>
				<div>
					<RefreshSvg style={{ width: '16px', height: '16px' }} />
				</div>
			</div>
		</div> */}
		{/* <div
			className={`singleModuleItem logoutItem ${workSpaceOpen ? 'workspace-active' : ''}`}
			onClick={handleLogout}
			style={{
				padding: '12px 16px',
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				alignSelf: 'stretch',
				width: '218px',
				cursor: 'pointer',
			}}
		>
			<p style={{ fontSize: '14px', fontWeight: '500', color: '#D73A49' }}>Logout</p>
			<LogoutRedSvg />
		</div> */}
	</div>
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
	const location = useLocation();
	const [isHover, setisHover] = useState(false);
	const [isDropdownVisible, setDropdownVisible] = useState(false);
	const [activeSubModule, setActiveSubModule] = useState(null);
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

	const handleSubModuleClick = (e, subModule) => {
		e.stopPropagation();
		if (subModule.route) {
			navigateTo(subModule.route);
		}
	};
	const toggleDropdown = (e) => {
		e.stopPropagation();
		e.preventDefault();
		setDropdownVisible(!isDropdownVisible);
	};

	const isExactPathMatch = useCallback(() => {
		const currentPath = location.pathname.replace(/\/$/, '');
		const routePath = route?.replace(/\/$/, '');
		return currentPath === routePath;
	}, [location.pathname, route]);

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
			}}
		>
			<div
				className={`singleModuleItem ${isExactPathMatch() ? 'activeListModule' : ''} ${
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
					justifyContent: 'space-between',
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
					}}
				>
					<p>{name}</p>
					{Icon && (
						<Icon fill={isExactPathMatch() ? '#FFF' : isHover ? '#FFF' : '#FFF'} />
					)}
				</div>
				{isDropdownVisible && subModules?.length > 0 && (
					<div>
						<div className={`dropdownMenu ${isDropdownVisible ? 'visible' : ''}`}>
							<div
								style={{
									position: 'absolute',
									left: '8px',
									top: '10px',
									bottom: '0',
									width: '1px',
									backgroundColor: '#333334',
								}}
							/>
							{activeSubModule !== null && (
								<div
									style={{
										position: 'absolute',
										left: '8px',
										top: `${activeSubModule * 40}px`, // 40px is the height of each subModule
										height: '40px',
										width: '1px',
										backgroundColor: '#FFFFFF',
									}}
								/>
							)}
							{subModules?.map((subItem, index) => (
								<div
									key={subItem?.name}
									className="subItem"
									onClick={(e) => handleSubModuleClick(e, subItem)}
									style={{ cursor: 'pointer' }}
								>
									<div className="subitem-content">
										<p>{subItem.name}</p>
									</div>
									{subItem.icon &&
										React.createElement(subItem.icon, {
											fill: activeSubModule === index ? '#FFFFFF' : '#939393',
										})}
								</div>
							))}
						</div>
					</div>
				)}
				{subModules?.length > 0 && (
					<div onClick={toggleDropdown} style={{ padding: '0px', margin: '0px' }}>
						<DownArrowSmallSvg
							className={`downArrow ${isDropdownVisible ? 'rotate' : ''}`}
							style={{ height: '16px', width: '16px' }}
						/>
					</div>
				)}
			</div>
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
		<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '4px' }}>
			<div
				className={`singleModuleItem ${isActive ? 'activeListModule' : ''} ${
					isHover ? 'hover' : ''
				}`}
				onMouseEnter={onMoutseEnter}
				onMouseLeave={onMoutseLeave}
				onClick={redirectToFunction}
				style={{
					backgroundColor: isActive ? '#2E2F33' : '',
				}}
			>
				<p>{name}</p>
				{isActive ? (
					<Icon fill={'#FFF'} />
				) : (
					<Icon fill={isHover ? '#FFF' : initialColor} />
				)}
			</div>
		</div>
	);
};

const AiModulesList = ({ image, name, route, navigateTo }) => {
	const redirectToFunction = () => {
		if (!route) return;
		navigateTo(route);
	};
	return (
		<div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
			<img
				src={image}
				alt={name}
				style={{ width: '24px', height: '24px', borderRadius: '50%' }}
			/>
			<p
				onClick={redirectToFunction}
				style={{
					color: '#E8E8E8',
					fontFamily: 'Inter',
					fontSize: '14px',
					fontStyle: 'normal',
					fontWeight: '500',
					lineHeight: 'normal',
				}}
			>
				{name}
			</p>
		</div>
	);
};

const OpenedSideBarItemsComponent = ({
	sidebarStates,
	setsidebarStates,
	info,
	setInfo,
	userWorkSpaceList,
}) => {
	const navigate = useNavigate();
	const logoutFunc = useLogout();
	const [selectedOption, setSelectedOption] = useState(null);
	const [aiChatsDropdownVisible, setAiChatsDropdownVisible] = useState(false);
	const [selectedChat, setSelectedChat] = useState(null);
	const [activeChat, setActiveChat] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

	const location = useLocation();

	const [isThisEarlyAccessPage, setIsThisEarlyAccessPage] = useState(false);
	useEffect(() => {
		setIsThisEarlyAccessPage(location?.pathname?.includes('/early-access'));
	}, [location?.pathname]);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 500);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleLogout = useCallback(async () => {
		logoutFunc();
	}, [logoutFunc]);

	const openWorkspacesFunction = () => {
		setsidebarStates((prevState) => ({
			...prevState,
			workSpaceOpen: !prevState.workSpaceOpen, // Toggle the state
			navStyle: prevState.workSpaceOpen ? 'close' : 'workspace', // Adjust navStyle accordingly
		}));
	};

	const handleNavigateFunction = useCallback(
		(route, singleItems) => {
			if (!route) return;

			setSelectedOption(singleItems?.name);

			setsidebarStates((prev) => ({
				...prev,
				selectedModule: singleItems?.name,
			}));
			navigate(route);
		},
		[navigate],
	);

	const handleSidebarCollapse = (e) => {
		e.stopPropagation();
		setsidebarStates({ ...sidebarStates, isOpen: false, navStyle: 'close' });
	};

	const handleChatSelect = (chatName) => {
		setSelectedChat(chatName);
		setActiveChat(chatName);
	};

	const handleCloseChatPanel = () => {
		setSelectedChat(null);
		setActiveChat(null);
	};

	return (
		// <div className="sidebarWorkspace">
		// 	<WorkspaceListComponent
		// 		setsidebarStates={setsidebarStates}
		// 		sidebarStates={sidebarStates}
		// 		info={info}
		// 		userWorkSpaceList={userWorkSpaceList}
		// 	/>
		// 	<CommonBottomSection
		// 		handleLogout={handleLogout}
		// 		openWorkspacesFunction={openWorkspacesFunction}
		// 		workSpaceOpen={sidebarStates.workSpaceOpen}
		// 	/>
		// </div>
		// ) : (
		<div style={{ display: 'flex' }}>
			{(!isMobile || (isMobile && !selectedChat)) && (
				<>
					<div
						className="openSideBarComponent"
						style={{
							height: '100vh',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
						}}
					>
						<div className="topOptionsList">
							<div
								className="veAiLogoDiv"
								style={{
									cursor: 'pointer',
									position: 'sticky',
									top: '0',
									backgroundColor: '#202123',
									zIndex: '1000',
								}}
							>
								<div
									className="workspaceDetailsDiv"
									onClick={openWorkspacesFunction}
									style={{ cursor: 'pointer' }}
								>
									{info?.activeBusniessName?.logo_s3_500w_key && (
										<img
											src={info?.activeBusniessName?.logo_s3_500w_key}
											alt={info?.activeBusniessName?.activeWorkspaceId}
										/>
									)}
									<h6 style={{ maxWidth: '100px' }}>
										{info?.activeBusniessName?.businessName}
									</h6>
									<DownArrowSmallSvg style={{ height: '16px', width: '16px' }} />
								</div>
								{/* <NotificationSvg /> */}
								<Tooltip
									title="Close Sidebar"
									placement="right"
									arrow={false}
									overlayInnerStyle={{
										padding: '6px 10px',
										borderRadius: '10px',
										fontSize: '14px',
										background: '#E8E8E8',
										color: '#202123',
										textAlign: 'center',
										marginLeft: '12px',
									}}
								>
									<SidebarClosingSvg
										className="collapseArrow"
										onClick={handleSidebarCollapse}
										style={{ cursor: 'pointer' }}
									/>
								</Tooltip>
							</div>

							<div
								className="allmodulesList"
								style={{
									height: '100%',
									gap: '4px',
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								{sidebarStates?.workSpaceOpen && (
									<div
										style={{
											position: 'absolute',
											top: '20px',
											left: '0',
											width: '230px',
											marginLeft: '10px',
											border: 'none',
											zIndex: '1000',
											background: '#202123',
											borderRadius: '16px',
											animation: 'slideDown 0.3s ease-out',
											transformOrigin: 'top',
										}}
									>
										<WorkspaceListComponent
											setsidebarStates={setsidebarStates}
											sidebarStates={sidebarStates}
											info={info}
											userWorkSpaceList={userWorkSpaceList}
										/>
									</div>
								)}
								{/* {AiOptions.map((singleItem, index) => {
									return (
										<div key={index} style={{ padding: '8px 16px' }}>
											<AiModulesList
												image={singleItem.image}
												name={singleItem.name}
												route={singleItem.route}
												navigateTo={(route) => {
													handleNavigateFunction(route, singleItem);
												}}
												isSelected={selectedOption === singleItem?.name}
											/>
										</div>
									);
								})} */}
								{!isThisEarlyAccessPage && (
									<hr
										style={{
											border: '0.7px solid #333334',
											margin: '16px 0px',
										}}
									/>
								)}
								{!isThisEarlyAccessPage &&
									veAiModulesItemsList?.map((singleItems, index) => (
										<div key={index}>
											<OpenedSideBarHoverStateIcons
												name={singleItems.name}
												Icon={singleItems.icon}
												initialColor={singleItems.initialColor}
												route={singleItems?.route}
												navigateTo={(route) => {
													handleNavigateFunction(route, singleItems);
												}}
												isSelected={selectedOption === singleItems?.name}
												isActive={location.pathname === singleItems?.route}
												subModules={singleItems?.subModules}
											/>
										</div>
									))}

								{!isThisEarlyAccessPage && (
									<hr
										style={{
											border: '0.7px solid #333334',
											margin: '16px 0px',
										}}
									/>
								)}
								{!isThisEarlyAccessPage &&
									veAiModules?.map((singleItems, index) => (
										<div key={index}>
											<OpenedSideBarHoverStateIcons
												name={singleItems.name}
												Icon={singleItems.icon}
												initialColor={singleItems.initialColor}
												route={singleItems?.route}
												navigateTo={(route) => {
													handleNavigateFunction(route, singleItems);
												}}
												isSelected={selectedOption === singleItems?.name}
												isActive={location.pathname === singleItems?.route}
												subModules={singleItems?.subModules}
											/>
										</div>
									))}
							</div>
						</div>

						<div className="bottomOptionsList">
							{
								<>
									{/* <div className="planExpiresDiv">
									<div
										style={{
											width: '100%',
											display: 'flex',
											justifyContent: 'start',
										}}
									>
										<div className="planExpiresTitle">
											Your Plan has been Expired
										</div>
									</div>
									<div
										style={{
											width: '100%',
											display: 'flex',
											justifyContent: 'end',
										}}
									>
										<button
											className="renewNowDiv"
											onClick={() => {
												navigate('/subscription');
											}}
											style={{
												cursor: 'pointer',
											}}
										>
											Renew Now
										</button>
									</div>
								</div> */}
									{/* <div className="creditsLeft">
									<div>
										<div
											style={{
												fontSize: '14px',
												fontWeight: '500',
												color: '#E8E8E8',
											}}
										>
											100
										</div>
										<div
											style={{
												fontSize: '14px',
												fontWeight: '400',
												color: '#939393',
											}}
										>
											Credits Left This Month
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
													<stop
														offset="0.000100017"
														stop-color="#C39DF8"
													/>
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
								</div> */}
								</>
							}
							{bottomOptionsList?.map((singleItems, index) => (
								<OpenedSideBarHoverStateIcons2
									name={singleItems?.name}
									Icon={singleItems?.icon}
									route={singleItems?.route}
									initialColor={singleItems?.initialColor}
									navigateTo={(route) =>
										handleNavigateFunction(route, singleItems)
									}
									key={singleItems?.name}
									isActive={
										selectedOption === singleItems?.name ||
										sidebarStates.selectedModule === singleItems?.name
									}
									style={{
										fontSize: '14px',
										padding: '12px 16px',
									}}
								/>
							))}
							<CommonBottomSection
								handleLogout={handleLogout}
								openWorkspacesFunction={openWorkspacesFunction}
								workSpaceOpen={sidebarStates.workSpaceOpen}
							/>
						</div>
					</div>
				</>
			)}
			{selectedChat && (
				<div
					className="chatDetailPanel"
					style={{
						width: isMobile ? '100%' : '300px',
						backgroundColor: '#1E1E1E',
						borderLeft: !isMobile ? '1px solid #333334' : 'none',
						padding: '20px',
						position: isMobile ? 'fixed' : 'absolute',
						left: isMobile ? '0' : '100%',
						top: '0',
						height: '100vh',
						zIndex: isMobile ? 1000 : 1,
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '20px',
						}}
					>
						<h2 style={{ color: '#E8E8E8' }}>{selectedChat}</h2>
						<CrossSvg style={{ cursor: 'pointer' }} onClick={handleCloseChatPanel} />
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(OpenedSideBarItemsComponent);
