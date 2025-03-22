import React, { useState, memo, useCallback, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	veAiModulesItemsList,
	veAiSubModulesItemsList,
	veAiModules,
	AiOptions,
} from './sidebarindex';
import { ReactComponent as ArrowUpRightSvg } from '../../../assets/svg/sidebar/arrowupright.svg';
import { ReactComponent as DownArrowSmallSvg } from '../../../assets/svg/sidebar/downarrowsmall.svg';
import { ReactComponent as NotificationSvg } from '../../../assets/svg/sidebar/notification.svg';
import { ReactComponent as RefreshSvg } from '../../../assets/svg/sidebar/Refresh.svg';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as LogoutRedSvg } from '../../../assets/svg/sidebar/logout_red.svg';
import { ReactComponent as CrossSvg } from '../../../assets/svg/sidebar/CrossSvg.svg';
import { ReactComponent as RightArrowSvg } from '../../../assets/svg/sidebar/RightArrow.svg';
import WorkspaceListComponent from './Workspace';
import useLogout from '../../hooks/useLogout';
import { message, Tooltip } from 'antd';

import Context from '../../../context/context';

const MODULE_NAME_MAP = {
	'conversational agent': 'conversationalAgent',
	'classic gallery': 'classicGallery',
	'lite gallery': 'liteGallery',
	documents: 'workflow',
	'my templates': 'template',
	tasks: 'task',
	calendar: 'calendar',
	forms: 'form',
	contacts: 'contact',
};

const OpenedSideBarHoverStateIcons = ({
	name,
	Icon,
	route,
	initialColor = null,
	isActive,
	navigateTo,
	isSelected,
	subModules,
	isDropdownVisible,
	onDropdownToggle,
	setActiveDropdown,
	activeSubModule,
	setActiveSubModule,
	handleSubModuleClick,
	setShowNotificationsDrawer,
	setShowChatsDrawer,
	setShowNotesDrawer,
	setHideClosedSidebarIcon,
}) => {
	let {
		aiSetup: { isVoiceIntegrationActive },
	} = useContext(Context);

	const location = useLocation();
	const [isHover, setisHover] = useState(false);

	const onMoutseEnter = () => {
		if (isActive) return;
		setisHover(true);
	};
	const onMoutseLeave = () => {
		if (isActive) return;
		setisHover(false);
	};

	const redirectToFunction = (subModules, route, name) => {
		if (name === 'Notes') {
			setShowNotesDrawer((prev) => !prev);
		} else {
			setShowNotesDrawer(false);
		}

		if (name === 'Notifications') {
			setShowNotificationsDrawer((prev) => !prev);
		} else {
			setShowNotificationsDrawer(false);
		}
		if (name === 'Chats') {
			setShowChatsDrawer((prev) => !prev);
			setHideClosedSidebarIcon(true);
		} else {
			setShowChatsDrawer(false);
		}

		if (!subModules) {
			setActiveDropdown(null);
			setActiveSubModule(null);
			navigateTo(route);
		} else {
			onDropdownToggle();
		}
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
				onClick={() => {
					if (isVoiceIntegrationActive) {
						return message.error(
							'Voice integration is active, please disable it to use this feature',
						);
					}
					redirectToFunction(subModules, route, name);
				}}
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
									left: '15px',
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
										left: '14px',
										top: `${activeSubModule?.id * 40}px`, // 40px is the height of each subModule
										height: '32px',
										width: '3px',
										backgroundColor: '#FFFFFF',
										borderRadius: '100px',
									}}
								/>
							)}
							{subModules?.map((subItem, index) => (
								<div
									key={subItem?.name}
									className={`subItem ${
										activeSubModule?.id === index ? 'active' : ''
									}`}
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
					<div style={{ padding: '0px', margin: '0px' }}>
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

// Add this constant for Settings options
const SETTINGS_OPTIONS = [
	{ name: 'My Profile', route: '/settings/my-profile' },
	{ name: 'Workspace', route: '/settings/workspace' },
	// { name: 'Brand Setup', route: '/settings/brand-setup' },
	{ name: 'Team Settings', route: '/settings/team-settings' },
	{ name: 'Integration', route: '/settings/integrations' },
	{ name: 'Plan Billing', route: '/settings/plan-billing' },
	{ name: 'AI Setup', route: '/settings/ai-setup' },
];

const OpenedSideBarItemsComponent = ({
	sidebarStates,
	setsidebarStates,
	info,
	setInfo,
	userWorkSpaceList,
	isOpen,
	setIsOpen,
	setShowNotificationsDrawer,
	setShowChatsDrawer,
	setShowNotesDrawer,
	setHideClosedSidebarIcon,
}) => {
	const {
		templates: { leftSidebarState, updateStateValues },
		profileInfo: { tenantUserAccessControls },
	} = useContext(Context);
	const navigate = useNavigate();
	const logoutFunc = useLogout();
	const [selectedOption, setSelectedOption] = useState(null);
	const [aiChatsDropdownVisible, setAiChatsDropdownVisible] = useState(false);
	const [selectedChat, setSelectedChat] = useState(null);
	const [activeChat, setActiveChat] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
	const [activeDropdown, setActiveDropdown] = useState(null);
	const [activeSubModule, setActiveSubModule] = useState(null);
	const [showSettingsSidebar, setShowSettingsSidebar] = useState(false);
	const [selectedSettingsOption, setSelectedSettingsOption] = useState(null);

	const location = useLocation();

	const [isThisEarlyAccessPage, setIsThisEarlyAccessPage] = useState(false);

	useEffect(() => {
		if (leftSidebarState && leftSidebarState === 'close') {
			handleSidebarCollapse();
			updateStateValues({ leftSidebarState: null });
		}
	}, [leftSidebarState]);

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
			workSpaceOpen: !prevState?.workSpaceOpen,
			navStyle: prevState?.workSpaceOpen ? 'close' : 'workspace',
		}));
	};

	const handleNavigateFunction = useCallback(
		(route, singleItems) => {
			if (singleItems?.name === 'Settings') {
				setShowSettingsSidebar(true);
				return;
			}

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

	//close sidebar
	const handleSidebarCollapse = (e) => {
		// e.stopPropagation();
		setsidebarStates({ ...sidebarStates, navStyle: 'close' });
		setIsOpen(false);
		// setShowChatsDrawer(false);
	};

	const handleChatSelect = (chatName) => {
		setSelectedChat(chatName);
		setActiveChat(chatName);
	};

	const handleCloseChatPanel = () => {
		setSelectedChat(null);
		setActiveChat(null);
	};

	const handleDropdownToggle = (moduleName) => {
		setActiveDropdown(activeDropdown === moduleName ? null : moduleName);
		setActiveSubModule(null);
	};
	const handleSubModuleClick = (e, subModule) => {
		setActiveSubModule(subModule);
		e.stopPropagation();
		if (subModule.route) {
			navigate(subModule.route);
		}
	};

	const filterModules = (modulesList, accessControls, allPossibleApps) => {
		if (!accessControls?.length) {
			return modulesList; // If no access control data, return the modules as is
		}

		return modulesList
			.map((module) => {
				// Convert the module name to its mapped name (if exists in MODULE_NAME_MAP)
				const formattedModuleName = module?.name?.toLowerCase();
				const mappedName = MODULE_NAME_MAP[formattedModuleName] || formattedModuleName;

				// Check if the module is in allPossibleApps
				const isModuleInAllApps = allPossibleApps?.includes(mappedName);

				// If the module is in allPossibleApps, check if it's enabled in accessControls
				if (isModuleInAllApps) {
					const access = accessControls?.find((control) => control?.app === mappedName);
					if (!access || !access?.isEnabled) {
						return null; // Exclude module if it's not in accessControls or not enabled
					}
				}

				// Filter submodules based on similar access control logic
				const filteredSubModules = module?.subModules?.filter((subModule) => {
					const formattedSubModuleName = subModule?.name?.toLowerCase();
					const mappedSubModuleName =
						MODULE_NAME_MAP[formattedSubModuleName] || formattedSubModuleName;

					// Check if the submodule is in the list of all possible apps
					const isSubModuleInAllApps = allPossibleApps?.includes(mappedSubModuleName);

					if (isSubModuleInAllApps) {
						const subAccess = accessControls?.find(
							(control) => control?.app === mappedSubModuleName,
						);
						return subAccess ? subAccess?.isEnabled : false; // Exclude if not enabled
					}

					// If the submodule is NOT in allPossibleApps, include it regardless of access control
					return true;
				});

				// If no valid submodules exist after filtering, remove the module
				if (
					module?.subModules &&
					(!filteredSubModules || filteredSubModules?.length === 0)
				) {
					return null; // Exclude module if no valid submodules are left
				}

				// Return the module, including the filtered submodules
				return {
					...module,
					subModules: filteredSubModules?.length ? filteredSubModules : undefined,
				};
			})
			.filter(Boolean); // Remove any null values (modules without access or submodules)
	};

	// Extract all possible app names (values from MODULE_NAME_MAP)
	const allPossibleApps = Object.values(MODULE_NAME_MAP);

	const filteredModules =
		tenantUserAccessControls?.role === 'admin'
			? veAiModulesItemsList
			: filterModules(
					veAiModulesItemsList,
					tenantUserAccessControls?.accessControls,
					allPossibleApps,
			  );

	const filterModules2 =
		tenantUserAccessControls?.role === 'admin'
			? veAiModules
			: filterModules(veAiModules, tenantUserAccessControls?.accessControls, allPossibleApps);

	return (
		<>
			<div style={{ display: 'flex', position: 'relative' }}>
				{tenantUserAccessControls && (
					<div style={{ display: 'flex' }}>
						{(!isMobile || (isMobile && !selectedChat)) && (
							<>
								<div
									className="openSideBarComponent"
									style={{
										height: '99.1vh',
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
												zIndex: '1000',
											}}
										>
											<div
												className="workspaceDetailsDiv"
												onClick={openWorkspacesFunction}
												style={{ cursor: 'pointer' }}
											>
												{info?.activeBusniessName?.logo_s3_500w_key ? (
													<div className="workspaceLogoContainer">
														<img
															className="workspaceLogo"
															src={
																info?.activeBusniessName
																	?.logo_s3_500w_key
															}
															alt={
																info?.activeBusniessName
																	?.activeWorkspaceId
															}
														/>
													</div>
												) : (
													<div className="workspaceLogoContainer"></div>
												)}
												<h6 className="workspaceName">
													{info?.activeBusniessName?.businessName}
												</h6>
												<DownArrowSmallSvg
													style={{ height: '16px', width: '16px' }}
												/>
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
											{!isThisEarlyAccessPage && (
												<>
													<hr
														style={{
															border: '0.7px solid #333334',
															margin: '16px 0px',
														}}
													/>

													{filteredModules?.map((singleItem) => (
														<div key={singleItem.id}>
															<OpenedSideBarHoverStateIcons
																name={singleItem.name}
																Icon={singleItem.icon}
																initialColor={
																	singleItem.initialColor
																}
																route={singleItem.route}
																navigateTo={(route) =>
																	handleNavigateFunction(
																		route,
																		singleItem,
																	)
																}
																isSelected={
																	selectedOption ===
																	singleItem.name
																}
																isActive={
																	location.pathname ===
																	singleItem.route
																}
																subModules={singleItem.subModules}
																isDropdownVisible={
																	activeDropdown ===
																	singleItem.name
																}
																onDropdownToggle={() =>
																	handleDropdownToggle(
																		singleItem.name,
																	)
																}
																setActiveDropdown={
																	setActiveDropdown
																}
																activeSubModule={activeSubModule}
																setActiveSubModule={
																	setActiveSubModule
																}
																handleSubModuleClick={
																	handleSubModuleClick
																}
																setShowChatsDrawer={
																	setShowChatsDrawer
																}
																setShowNotificationsDrawer={
																	setShowNotificationsDrawer
																}
																setShowNotesDrawer={
																	setShowNotesDrawer
																}
															/>
														</div>
													))}

													<hr
														style={{
															border: '0.7px solid #333334',
															margin: '16px 0px',
														}}
													/>

													{filterModules2?.map((singleItem, index) => (
														<div key={index}>
															<OpenedSideBarHoverStateIcons
																name={singleItem.name}
																Icon={singleItem.icon}
																initialColor={
																	singleItem.initialColor
																}
																route={singleItem.route}
																navigateTo={(route) =>
																	handleNavigateFunction(
																		route,
																		singleItem,
																	)
																}
																isSelected={
																	selectedOption ===
																	singleItem.name
																}
																isActive={
																	location.pathname ===
																	singleItem.route
																}
																subModules={singleItem.subModules}
																isDropdownVisible={
																	activeDropdown ===
																	singleItem.name
																}
																onDropdownToggle={() =>
																	handleDropdownToggle(
																		singleItem.name,
																	)
																}
																setActiveDropdown={
																	setActiveDropdown
																}
																activeSubModule={activeSubModule}
																setActiveSubModule={
																	setActiveSubModule
																}
																handleSubModuleClick={
																	handleSubModuleClick
																}
																setShowChatsDrawer={
																	setShowChatsDrawer
																}
																setShowNotificationsDrawer={
																	setShowNotificationsDrawer
																}
																setShowNotesDrawer={
																	setShowNotesDrawer
																}
																handleSidebarCollapse={
																	handleSidebarCollapse
																}
																setHideClosedSidebarIcon={
																	setHideClosedSidebarIcon
																}
															/>
														</div>
													))}
												</>
											)}
										</div>
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
									<CrossSvg
										style={{ cursor: 'pointer' }}
										onClick={handleCloseChatPanel}
									/>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Settings Sidebar Overlay */}
				{showSettingsSidebar && (
					<div className="settings-sidebar">
						{/* Settings Header */}
						<div className="settings-header">
							<div className="settings-header-left">
								<RightArrowSvg
									onClick={() => setShowSettingsSidebar(false)}
									className="back-arrow"
								/>
								<h6>Settings</h6>
							</div>
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

						{/* Settings Options */}
						<div className="settings-options">
							{SETTINGS_OPTIONS.map((option, index) => (
								<div
									key={index}
									className={`settings-option-item ${
										location.pathname === option.route ? 'active' : ''
									}`}
									onClick={() => {
										navigate(option.route);
										setSelectedSettingsOption(option.name);
									}}
								>
									<p>{option.name}</p>
								</div>
							))}
						</div>
						<div className="settings-footer">
							<p>Create workspace</p>
							<ArrowUpRightSvg />
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default memo(OpenedSideBarItemsComponent);
