import React, { useState, useCallback, useEffect, useContext, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	veAiModulesItemsList,
	veAiModules,
	photographerModules,
	SETTINGS_OPTIONS,
} from './sidebarindex';
import { ReactComponent as DownArrowSmallSvg } from '../../../assets/svg/sidebar/downarrowsmall.svg';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as CrossSvg } from '../../../assets/svg/sidebar/CrossSvg.svg';
import { ReactComponent as SingleRightArrowSvg } from '../../../assets/svg/sidebar/singleRightArrow.svg';
import { ReactComponent as SwitchWorkspaceSvg } from '../../../assets/svg/sidebar/switchWorkspace.svg';
import { ReactComponent as SunIcon } from '../../../assets/svg/sun.svg';
import { ReactComponent as MoonIcon } from '../../../assets/svg/moon.svg';
import { ReactComponent as NewEditSvg } from '../../../assets/svg/sidebar/newEdit.svg';
import WorkspaceListComponent from './Workspace';
import useLogout from '../../hooks/useLogout';
import { Tooltip } from 'antd';
import ChatHistory from './chatHistory/ChatHistory';
import { ReactComponent as TickSvg } from '../../../assets/svg/tick.svg';
import { ReactComponent as LogoutRedSvg } from '../../../assets/svg/sidebar/logout_red.svg';
import Cropper from 'react-easy-crop';
import Context from '../../../context/context';
import { getInitials } from '../../../helpers/index';
import { message } from '../globalComponents/CustomToast';
import SearchSvg from '../../../assets/svg/sidebar/SearchSvg';
import ObjectID from 'bson-objectid';
import { ReactComponent as CreateWorkspaceSvg } from '../../../assets/svg/sidebar/createWorkspace.svg';

const workspaceStyles = {
	position: 'absolute',
	bottom: '106px',
	left: '0px',
	width: '280px',
	border: 'none',
	zIndex: '10000',
	borderRadius: '16px',
	transformOrigin: 'bottom',
};

const MODULE_NAME_MAP = {
	'conversational agent': 'conversationalAgent',
	'classic gallery': 'classicGallery',
	'lite gallery': 'liteGallery',
	documents: 'workflow',
	'my templates': 'template',
	// tasks: 'task',
	// calendar: 'calendar',
	forms: 'form',
	contacts: 'contact',
	automation: 'automation',
	// notes: 'notes',
	agents: 'knowledgeAgent',
};

const routeType = 'public';

const OpenedSidebarModules = ({
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
	selectedOption,
}) => {
	const location = useLocation();

	const {
		aiSetup: { isVoiceIntegrationActive },
	} = useContext(Context);

	const [isHover, setisHover] = useState(false);

	const onMouseEnter = () => {
		if (isActive) return;
		setisHover(true);
	};
	const onMouseLeave = () => {
		if (isActive) return;
		setisHover(false);
	};

	const redirectToFunction = (subModules, route, name) => {
		if (name === 'Help') {
			let iframe = document.getElementById('ve-ai-chat-iframe');
			if (iframe) {
				const requiredStyle = iframe.style.display === 'block' ? 'none' : 'block';
				iframe.style.display = requiredStyle;
			} else {
				console.log('Iframe not found');
			}
			return;
		}

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
			// setHideClosedSidebarIcon(true);
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
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
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
						justifyContent: 'flex-start',
						gap: '14px',
						alignItems: 'center',
						width: '100%',
					}}
				>
					{Icon && <Icon fill={'var(--secondary-font)'} />}
					<p>{name}</p>
					{isExactPathMatch() && <TickSvg />}
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
										backgroundColor: 'var(--primary-font)',
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
					<div style={{ padding: '0px', margin: '0px', height: '16px' }}>
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

const OpenedSidebar = ({
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
	renewBanner,
}) => {
	const {
		templates: { leftSidebarState, updateStateValues },
		profileInfo: {
			tenantUserAccessControls,
			userDetailsData,
			tennantSettingsData,
			getTenantSettings,
		},
		themeInfo: { theme, updateTheme },
	} = useContext(Context);
	const navigate = useNavigate();
	const logoutFunc = useLogout();
	const [selectedOption, setSelectedOption] = useState(null);
	const [selectedChat, setSelectedChat] = useState(null);
	const [activeChat, setActiveChat] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
	const [activeDropdown, setActiveDropdown] = useState(null);
	const [activeSubModule, setActiveSubModule] = useState(null);
	const [showSettingsSidebar, setShowSettingsSidebar] = useState(() => {
		return JSON.parse(localStorage.getItem('showSettingsSidebar')) || false;
	});
	const [selectedSettingsOption, setSelectedSettingsOption] = useState(null);

	const location = useLocation();

	const [isThisEarlyAccessPage, setIsThisEarlyAccessPage] = useState(false);
	const isAdmin = tenantUserAccessControls?.role === 'admin';

	// Add this constant for Settings options
	const settingsOptions = isAdmin ? SETTINGS_OPTIONS.admin : SETTINGS_OPTIONS.user;

	const newThemeValue = theme === 'dark' ? 'light' : 'dark';
	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, [tennantSettingsData]);

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

	useEffect(() => {
		localStorage.setItem('showSettingsSidebar', JSON.stringify(showSettingsSidebar));
	}, [showSettingsSidebar]);

	const handleLogout = useCallback(async () => {
		logoutFunc();
	}, [logoutFunc]);

	const openWorkspacesFunction = (isOpen) => {
		setsidebarStates((prevState) => ({
			...prevState,
			workSpaceOpen: isOpen,
			navStyle: isOpen ? 'workspace' : 'close',
		}));
	};

	const handleNavigateFunction = useCallback(
		(route, singleItems) => {
			if (singleItems?.name === 'Settings') {
				setShowSettingsSidebar(true);
				navigate('/settings/my-profile');
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
	const allPossibleApps = Object.values(MODULE_NAME_MAP);

	const tenantModules =
		tennantSettingsData?.businessType === 'photography' ||
		tennantSettingsData?.businessType === 'photographer'
			? photographerModules
			: veAiModulesItemsList;

	const filteredModules =
		tenantUserAccessControls?.role === 'admin'
			? tenantModules
			: filterModules(
					tenantModules,
					tenantUserAccessControls?.accessControls,
					allPossibleApps,
			  );

	const filterModules2 =
		tenantUserAccessControls?.role === 'admin'
			? veAiModules
			: filterModules(veAiModules, tenantUserAccessControls?.accessControls, allPossibleApps);

	const isExactPathMatch = useCallback(
		(route) => {
			const currentPath = location.pathname.replace(/\/$/, '');
			const routePath = route?.replace(/\/$/, '');
			return currentPath === routePath;
		},
		[location.pathname],
	);

	useEffect(() => {
		if (showSettingsSidebar && settingsOptions?.length > 0) {
			const firstItem = settingsOptions[0];
			setSelectedSettingsOption(firstItem.name);
			// navigate(firstItem.route);
		}
	}, [showSettingsSidebar, settingsOptions]);

	const toggleSidebar = () => {
		navigate('/settings/my-profile');
		setShowSettingsSidebar((prev) => !prev);
	};

	const triggerCmdK = () => {
		const event = new KeyboardEvent('keydown', {
			key: 'k',
			metaKey: true, // For macOS; use ctrlKey for Windows
			bubbles: true,
		});
		document.dispatchEvent(event);
	};
	const handleNewChat = () => {
		const sessionId = ObjectID()?.toString();
		navigate(`/chat/${sessionId}`);
		updateStateValues({
			currentChatData: null,
		});
	};
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
										height: renewBanner ? 'calc(100dvh - 58px)' : '100dvh',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'space-between',
										overflowY: 'auto',
										borderRight: '1px solid var(--stroke)',
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
											{isThisEarlyAccessPage && (
												<div
													className="workspaceDetailsDiv"
													onClick={openWorkspacesFunction}
													style={{ cursor: 'pointer' }}
												>
													{info?.activeBusniessName?.logo_s3_500w_key && (
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
													)}
													<h6 className="workspaceName">
														{info?.activeBusniessName?.businessName}
													</h6>
													{userWorkSpaceList?.length > 1 && (
														<DownArrowSmallSvg
															style={{
																height: '16px',
																width: '16px',
															}}
														/>
													)}
												</div>
											)}
											<Tooltip
												title="Close Sidebar"
												placement="right"
												arrow={false}
												overlayInnerStyle={{
													padding: '6px 10px',
													borderRadius: '10px',
													fontSize: '14px',
													backgroundColor: 'var(--card)',
													color: 'var(--primary-font)',
													textAlign: 'center',
													marginLeft: '12px',
													border: '1px solid var(--stroke)',
												}}
											>
												<SidebarClosingSvg
													className="collapseArrow"
													onClick={setIsOpen}
													style={{ cursor: 'pointer' }}
												/>
											</Tooltip>
											{!isThisEarlyAccessPage && (
												<div className="sideBarOptions">
													<div
														className="eachOption"
														onClick={() => updateTheme(newThemeValue)}
													>
														{theme === 'dark' ? (
															<SunIcon />
														) : (
															<MoonIcon />
														)}
													</div>
													<div
														className="eachOption"
														onClick={triggerCmdK}
													>
														<SearchSvg />
													</div>
													<div
														className="eachOption"
														onClick={handleNewChat}
													>
														<NewEditSvg />
													</div>
												</div>
											)}
										</div>

										<div
											className="allmodulesList"
											style={{
												height: 'calc(100% - 65px)',
												gap: '4px',
												display: 'flex',
												flexDirection: 'column',
												width: '100%',
												justifyContent: `${
													isThisEarlyAccessPage ? 'flex-end' : ''
												}`,
												// overflowY: 'auto',
											}}
											id="chatsScroll"
										>
											{!isThisEarlyAccessPage && (
												<>
													{/* <hr
														style={{
															border: '0.7px solid var(--stroke)',
															margin: '16px 0px',
														}}
													/> */}
													{filteredModules?.map((singleItem) => (
														<div key={singleItem.id}>
															<OpenedSidebarModules
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

													<div>
														<hr
															className={`${
																isOpen
																	? 'horizontal-line-sidebar'
																	: ''
															}`}
														/>
													</div>
													<ChatHistory />
													<div
														className={`settingsOptionsContainer  ${
															!showSettingsSidebar
																? 'settingsOptionsContainerOpen'
																: ''
														}`}
														onClick={toggleSidebar}
													>
														<div
															className={`settingsHoverState ${
																!showSettingsSidebar
																	? 'settingsHoverStateOpen'
																	: ''
															}`}
														>
															<div className="settingsOptionsUserInfo">
																<div>
																	{userDetailsData?.logoURL ? (
																		<div className="crop-container">
																			<Cropper
																				image={
																					userDetailsData?.logoURL
																				} // Image URL to crop
																				crop={
																					userDetailsData
																						?.cropSettings
																						?.crop
																				}
																				zoom={
																					userDetailsData
																						?.cropSettings
																						?.zoom
																				}
																				showGrid={false}
																				onCropChange={(e) =>
																					''
																				}
																				onCropComplete={(
																					e,
																				) => ''}
																				onZoomChange={(e) =>
																					''
																				}
																			/>
																		</div>
																	) : (
																		<div
																			className="noImageText"
																			style={{
																				background:
																					userDetailsData
																						?.cropSettings
																						?.profileDpColor ||
																					'',
																				fontSize: '12px',
																			}}
																		>
																			{getInitials(
																				userDetailsData?.firstName,
																				userDetailsData?.lastName,
																			)}
																		</div>
																	)}
																</div>
																<div className="settingsOptionsUserName">
																	<span>
																		{userDetailsData?.firstName}{' '}
																		<span className="workspaceId">
																			(
																			{`${
																				isAdmin
																					? 'Admin'
																					: 'Member'
																			}`}
																			)
																		</span>
																	</span>
																	<span className="workspaceId">
																		{tennantSettingsData?.businessName.toUpperCase()}
																	</span>
																</div>
															</div>
															<SingleRightArrowSvg fill="var(--primary-font)" />
														</div>
													</div>
												</>
											)}
											{isThisEarlyAccessPage && (
												<div
													className={`settingsOptionsContainer ${
														isThisEarlyAccessPage
															? 'settingsOptionsContainerEarlyAccess'
															: ''
													}`}
													style={{ borderTop: '1px solid var(--stroke)' }}
												>
													<div
														className="settingsOptionsUserInfo"
														onClick={() => {
															setShowSettingsSidebar(false);
														}}
													>
														<div>
															{userDetailsData?.logoURL ? (
																<div className="crop-container">
																	<Cropper
																		image={
																			userDetailsData?.logoURL
																		} // Image URL to crop
																		crop={
																			userDetailsData
																				?.cropSettings?.crop
																		}
																		zoom={
																			userDetailsData
																				?.cropSettings?.zoom
																		}
																		showGrid={false}
																		onCropChange={(e) => ''}
																		onCropComplete={(e) => ''}
																		onZoomChange={(e) => ''}
																	/>
																</div>
															) : (
																<div
																	className="noImageText"
																	style={{
																		background:
																			userDetailsData
																				?.cropSettings
																				?.profileDpColor ||
																			'',
																		fontSize: '12px',
																	}}
																>
																	{getInitials(
																		userDetailsData?.firstName,
																		userDetailsData?.lastName,
																	)}
																</div>
															)}
														</div>
														<div className="settingsOptionsUserName">
															<span>
																{userDetailsData?.firstName}
															</span>
															<span className="workspaceId">
																{tennantSettingsData?.businessName}
															</span>
														</div>
													</div>
													<div className="logoutIcon">
														<LogoutRedSvg
															onClick={handleLogout}
															style={{ cursor: 'pointer' }}
														/>
													</div>
												</div>
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
									backgroundColor: 'var(--error)',
									borderLeft: !isMobile ? '1px solid var(--stroke)' : 'none',
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
									<h2 style={{ color: 'var(--primary-font)' }}>{selectedChat}</h2>
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
				{showSettingsSidebar && !isThisEarlyAccessPage && (
					<div
						className="settings-sidebar"
						style={{ height: renewBanner ? 'calc(100dvh - 41px)' : '100dvh' }}
					>
						{/* Settings Header */}
						<div className="settings-header">
							<div className="settings-header-left">
								<SingleRightArrowSvg
									onClick={() => setShowSettingsSidebar(false)}
									className="back-arrow"
									fill="var(--primary-font)"
								/>
								{/* <h6>Settings</h6> */}
							</div>
							{!isThisEarlyAccessPage && (
								<div className="sideBarOptions">
									<div
										className="eachOption"
										onClick={() => updateTheme(newThemeValue, routeType)}
									>
										{theme === 'dark' ? <SunIcon /> : <MoonIcon />}
									</div>
									<div className="eachOption" onClick={triggerCmdK}>
										<SearchSvg />
									</div>
									<div className="eachOption" onClick={handleNewChat}>
										<NewEditSvg />
									</div>
								</div>
							)}
						</div>

						{/* <hr
							style={{
								border: '0.7px solid var(--stroke)',
								margin: '16px 0px',
							}}
						/> */}
						{/* Settings Options */}
						<div className="settings-options">
							<div className="settings-options-title">Settings</div>
							{settingsOptions.map((option, index) => (
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
									<option.icon fill={'var(--secondary-font)'} />
									<p>{option.name}</p>
								</div>
							))}
						</div>
						<hr
							style={{
								border: '0.7px solid var(--stroke)',
								margin: '16px 0px',
							}}
						/>
						<div className="settings-options-container">
							<div className="settings-options-title">Essentials</div>
							{filterModules2?.map((singleItem, index) => (
								<div
									key={index}
									style={{ width: '100%' }}
									className="settings-option"
								>
									<OpenedSidebarModules
										name={singleItem.name}
										Icon={singleItem.icon}
										initialColor={singleItem.initialColor}
										route={singleItem.route}
										navigateTo={(route) =>
											handleNavigateFunction(route, singleItem)
										}
										isSelected={selectedOption === singleItem.name}
										isActive={location.pathname === singleItem.route}
										subModules={singleItem.subModules}
										isDropdownVisible={activeDropdown === singleItem.name}
										onDropdownToggle={() =>
											handleDropdownToggle(singleItem.name)
										}
										setActiveDropdown={setActiveDropdown}
										activeSubModule={activeSubModule}
										setActiveSubModule={setActiveSubModule}
										handleSubModuleClick={handleSubModuleClick}
										setShowChatsDrawer={setShowChatsDrawer}
										setShowNotificationsDrawer={setShowNotificationsDrawer}
										setShowNotesDrawer={setShowNotesDrawer}
										handleSidebarCollapse={handleSidebarCollapse}
										setHideClosedSidebarIcon={setHideClosedSidebarIcon}
									/>
								</div>
							))}
						</div>
						{sidebarStates?.workSpaceOpen && <div className="settingBackdrop"></div>}
						<div
							className="settingsOptionsContainer"
							style={{
								borderTop: `${
									!sidebarStates?.workSpaceOpen ? '1px solid var(--stroke)' : ''
								}`,
							}}
						>
							<div
								style={{ width: '100%', gap: '4px', position: 'relative' }}
								className={`${
									showSettingsSidebar ? 'settingsAnimationContainer' : ''
								}`}
							>
								{!sidebarStates?.workSpaceOpen && (
									<div
										className="settings-footer"
										onMouseEnter={() => openWorkspacesFunction(true)}
										onMouseLeave={() => openWorkspacesFunction(false)}
									>
										<SwitchWorkspaceSvg fill="var(--primary-font)" />
										<p>Switch workspace</p>
									</div>
								)}
								<div
									className="settings-footer"
									onClick={() => {
										navigate('/create-workspace');
									}}
								>
									{' '}
									<CreateWorkspaceSvg />
									<p>Create workspace</p>
								</div>
							</div>
							<div
								className="settingsOptionsContainerInsideOne"
								onClick={toggleSidebar}
							>
								<div className="settingsHoverState">
									<div className="settingsOptionsUserInfo">
										<div>
											{userDetailsData?.logoURL ? (
												<div className="crop-container">
													<Cropper
														image={userDetailsData?.logoURL} // Image URL to crop
														crop={userDetailsData?.cropSettings?.crop}
														zoom={userDetailsData?.cropSettings?.zoom}
														showGrid={false}
														onCropChange={(e) => ''}
														onCropComplete={(e) => ''}
														onZoomChange={(e) => ''}
													/>
												</div>
											) : (
												<div
													className="noImageText"
													style={{
														background:
															userDetailsData?.cropSettings
																?.profileDpColor || '',
														fontSize: '12px',
													}}
												>
													{getInitials(
														userDetailsData?.firstName,
														userDetailsData?.lastName,
													)}
												</div>
											)}
										</div>
										<div className="settingsOptionsUserName">
											<span>
												{userDetailsData?.firstName}{' '}
												<span className="workspaceId">
													({`${isAdmin ? 'Admin' : 'Member'}`})
												</span>
											</span>
											<span className="workspaceId">
												{tennantSettingsData?.businessName.toUpperCase()}
											</span>
										</div>
									</div>
									<LogoutRedSvg
										onClick={handleLogout}
										style={{ cursor: 'pointer' }}
									/>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			{sidebarStates?.workSpaceOpen && (
				<div
					style={{
						...workspaceStyles,
						animation: `${
							sidebarStates?.workSpaceOpen ? 'slideUp' : 'slideDown'
						} 0.3s ease-out`,
						top: `${isThisEarlyAccessPage ? '40px' : ''}`,
						transformOrigin: `${isThisEarlyAccessPage ? 'top' : 'bottom'}`,
					}}
				>
					<WorkspaceListComponent
						setsidebarStates={setsidebarStates}
						sidebarStates={sidebarStates}
						info={info}
						userWorkSpaceList={userWorkSpaceList}
						sidebarSettings="close"
						openWorkspacesFunction={openWorkspacesFunction}
					/>
				</div>
			)}
		</>
	);
};

export default memo(OpenedSidebar);
