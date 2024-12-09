import React, { useState, memo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { veAiModulesItemsList, bottomOptionsList, veAiSubModulesItemsList } from './sidebarindex';
import { ReactComponent as DownArrowSmallSvg } from '../../../assets/svg/sidebar/downarrowsmall.svg';
import { ReactComponent as RefreshSvg } from '../../../assets/svg/sidebar/Refresh.svg';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as LogoutRedSvg } from '../../../assets/svg/sidebar/logout_red.svg';
import { ReactComponent as CrossSvg } from '../../../assets/svg/sidebar/CrossSvg.svg';
import { ReactComponent as RightArrowSvg } from '../../../assets/svg/sidebar/RightArrow.svg';
import WorkspaceListComponent from './Workspace';
import useLogout from '../../hooks/useLogout';

const CommonBottomSection = ({ handleLogout, openWorkspacesFunction }) => (
	<>
		<div className="currentWorkspaceDiv" onClick={openWorkspacesFunction}>
			<div className="detailsDiv">
				<div style={{ fontSize: '14px', fontWeight: '500', color: 'white' }}>
					Switch Workspace
				</div>
				<div>
					<RefreshSvg style={{ width: '16px', height: '16px' }} />
				</div>
			</div>
		</div>
		<div className={'singleModuleItem logoutItem'} onClick={handleLogout}>
			<p style={{ fontSize: '14px', fontWeight: '500', color: '#D73A49' }}>Logout</p>
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
					justifyContent: 'space-between',
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
				{subModules?.length > 0 && (
					<div onClick={toggleDropdown}>
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
	const [selectedChat, setSelectedChat] = useState(null);
	const [activeChat, setActiveChat] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 500);

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

	const handleChatSelect = (chatName) => {
		setSelectedChat(chatName);
		setActiveChat(chatName);
	};

	const handleCloseChatPanel = () => {
		setSelectedChat(null);
		setActiveChat(null);
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
		<div style={{ display: 'flex' }}>
			{(!isMobile || (isMobile && !selectedChat)) && (
				<div className="openSideBarComponent">
					<div className="topOptionsList">
						<div
							className="veAiLogoDiv"
							style={{ cursor: 'pointer' }}
							onClick={() => navigate(`/home`)}
						>
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
						<div
							className="allmodulesList"
							style={{
								height: '100%',
								gap: '4px',
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							{veAiModulesItemsList?.map((singleItems, index) => (
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
						<hr style={{ border: '0.7px solid #333334', margin: '16px 0px' }} />
						<div
							className="AichatDiv"
							onClick={() => setAiChatsDropdownVisible(!aiChatsDropdownVisible)}
						>
							<div style={{ fontSize: '14px', fontWeight: '500', color: '#E8E8E8' }}>
								Recent AI chats
							</div>
							<DownArrowSmallSvg
								className={`downArrow ${aiChatsDropdownVisible ? 'rotate' : ''}`}
								style={{ height: '16px', width: '16px' }}
							/>
						</div>
						{/* {aiChatsDropdownVisible && (
							<div
								className="aiChatsSubmodules"
								style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
							>
								{['Chat 1', 'Chat 2', 'Chat 3'].map((chatName) => (
									<div
										key={chatName}
										className={`subModule ${
											activeChat === chatName ? 'activeListModule' : ''
										}`}
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											padding: '12px 16px',
											cursor: 'pointer',
											borderRadius: activeChat === chatName ? '100px' : '',
											background: activeChat === chatName ? '#2E2F33' : '',
										}}
										onClick={() => handleChatSelect(chatName)}
									>
										<p
											style={{
												fontSize: '14px',
												fontWeight: '500',
												color: '#E8E8E8',
											}}
										>
											{chatName}
										</p>
									</div>
								))}
							</div>
						)} */}
					</div>

					<div className="bottomOptionsList">
						{
							<>
								<div className="planExpiresDiv">
									<div className="planExpiresTitle">Plan Expires in 7 days</div>
									<button className="renewNowDiv">Renew Now</button>
								</div>
								<div className="creditsLeft">
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
												fontWeight: '500',
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
								</div>
							</>
						}
						{bottomOptionsList?.map((singleItems, index) => (
							<OpenedSideBarHoverStateIcons2
								name={singleItems?.name}
								Icon={singleItems?.icon}
								route={singleItems?.route}
								initialColor={singleItems?.initialColor}
								navigateTo={handleNavigateFunction}
								key={singleItems?.name}
								isActive={info?.activeRoute === singleItems?.moduleRoute}
								style={{
									fontSize: '14px',
									padding: '12px 16px',
								}}
							/>
						))}
						<CommonBottomSection
							handleLogout={handleLogout}
							openWorkspacesFunction={openWorkspacesFunction}
						/>
					</div>
				</div>
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
