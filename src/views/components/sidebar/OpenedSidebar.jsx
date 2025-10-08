import { createElement, useState, useCallback, useEffect, useContext, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	stableNavigationItems,
	betaNavigationItems,
	internalNavigationItems,
	stableSettingsNavItems,
	betaSettingsNavItems,
} from './sidebarindex.js';
import { ReactComponent as DownArrowSmallSvg } from '../../../assets/svg/sidebar/downarrowsmall.svg';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as CrossSvg } from '../../../assets/svg/sidebar/CrossSvg.svg';
import { ReactComponent as SingleRightArrowSvg } from '../../../assets/svg/sidebar/singleRightArrow.svg';
import { ReactComponent as SwitchWorkspaceSvg } from '../../../assets/svg/sidebar/switchWorkspace.svg';
import { ReactComponent as SunIcon } from '../../../assets/svg/sun.svg';
import { ReactComponent as MoonIcon } from '../../../assets/svg/moon.svg';
import { ReactComponent as NewEditSvg } from '../../../assets/svg/sidebar/newEdit.svg';
import { ReactComponent as PencilkSvg } from '../../../assets/svg/pencilSimple.svg';
import WorkspaceListComponent from './Workspace';
import useLogout from '../../../hooks/useLogout';
import ChatHistory from './chatHistory/ChatHistory';
import { ReactComponent as TickSvg } from '../../../assets/svg/tick.svg';
import { ReactComponent as LogoutRedSvg } from '../../../assets/svg/sidebar/logout_red.svg';
import Cropper from 'react-easy-crop';
import Context from '../../../context/context';
import { message } from '../globalComponents/CustomToast';
import SearchSvg from '../../../assets/svg/sidebar/SearchSvg';
import ObjectID from 'bson-objectid';
import { ReactComponent as CreateWorkspaceSvg } from '../../../assets/svg/sidebar/createWorkspace.svg';
import SidebarTooltip from './SidebarTooltip';
import UploadAvatarPopupComponent from '../settings/profile/UploadAvatarPopup';
import UploadFileProiflePopup from '../settings/profile/UploadFileProiflePopup';
import useWorkspaceMode from '../../../hooks/useWorkspaceMode';
import CreditsLeft from './chatHistory/CreditsLeft';
import useBroadcastChannel from '../../../hooks/useBroadcastChannel';

const workspaceStyles = {
	position: 'absolute',
	bottom: '122px',
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
	'ai assistant': 'conversationalAgent',
	'knowledge agent': 'knowledgeAgent',
};

const routeType = 'public';

const isMac = navigator?.platform?.toUpperCase()?.indexOf('MAC') >= 0;

const OpenedSidebarModules = ({
	name,
	Icon,
	route,
	navigateTo,
	subModules,
	isDropdownVisible,
	onDropdownToggle,
	setActiveDropdown,
	activeSubModule,
	setActiveSubModule,
	handleSubModuleClick,
	setShowNotificationsDrawer,
}) => {
	const location = useLocation();

	const { workspaceMode } = useWorkspaceMode();

	const {
		aiSetup: { isVoiceIntegrationActive },
	} = useContext(Context);

	const redirectToFunction = (subModules, route, name) => {
		if (name === 'Help') {
			let iframe = document.getElementById('ve-ai-chat-iframe');
			if (iframe) {
				const requiredStyle = iframe.style.display === 'none' ? 'block' : 'none';
				iframe.style.display = requiredStyle;
			} else {
				console.log('Iframe not found');
			}
			return;
		}

		if (name === 'Notifications') {
			setShowNotificationsDrawer((prev) => !prev);
		} else {
			setShowNotificationsDrawer(false);
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

		if (name === 'Agents') {
			return currentPath.includes('/agents') || currentPath.includes('/ai-assistant');
		}
		if (name === 'New Chat') {
			return currentPath.includes('/chat');
		}

		return currentPath === routePath;
	}, [location.pathname, route, name]);

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
			}}
		>
			<div
				className={`singleModuleItem ${isExactPathMatch() ? 'isExactPathMatch ' : ''} ${
					isDropdownVisible ? 'calendar-active' : ''
				}`}
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
					{Icon && <Icon />}
					<p style={{ margin: 0 }}>{name}</p>
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
										createElement(subItem.icon, {
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

const navigationItemsMap = {
	beta: betaNavigationItems,
	internal: internalNavigationItems,
	stable: stableNavigationItems,
};

const settingsNavItemsMap = {
	beta: betaSettingsNavItems,
	internal: betaSettingsNavItems,
	stable: stableSettingsNavItems,
};

const OpenedSidebar = ({
	sidebarStates,
	setsidebarStates,
	setIsSidebarOpen,
	setShowNotificationsDrawer,
	setShowNotesDrawer,
	isThisEarlyAccessPage,
	isSidebarOpen,
}) => {
	const { workspaceMode, workspaceNotFound } = useWorkspaceMode();
	const workspaceId = localStorage.getItem('workspaceId');

	const sidebarNavigationItems = navigationItemsMap[workspaceMode];
	const settingsNavigationItems = settingsNavItemsMap[workspaceMode];

	const {
		templates: { updateStateValues },
		profileInfo: {
			userDetailsData,
			updateUserLogo,
			updateUserDetailsState,
			updateUserDetails: updateUserDetailsProfile,
			tenantUserAccessControls,
			tennantSettingsData,
			getTenantSettings,
			userWorkSpaceList,
			getUserWorkSpaceList,
		},
		themeInfo: { theme, updateTheme },
		authInfo: { updateUserDetails },
	} = useContext(Context);

	const [userDetails, setUserDetails] = useState({
		fullName: '',
		email: '',
		phoneNumber: '',
		is2FAEnabled: '',
		logoURL: '',
		cropSettings: { crop: { x: 0, y: 0 }, zoom: 1 },
	});

	const [uploadAvatarPopup, setuploadAvatarPopup] = useState({ theme: false, file: false });

	const [logoFile, setlogoFile] = useState(null);

	useEffect(() => {
		if (userDetailsData) {
			setUserDetails((prev) => ({
				...prev,
				logoURL: userDetailsData?.dp_s3_500w_key || '',
				cropSettings: userDetailsData?.dp_style || { crop: { x: 0, y: 0 }, zoom: 1 },
			}));
		}
	}, [userDetailsData]);

	useEffect(() => {
		if (!userWorkSpaceList) getUserWorkSpaceList();
	}, [userWorkSpaceList]);

	const navigate = useNavigate();
	const [selectedOption, setSelectedOption] = useState(null);
	const [selectedChat, setSelectedChat] = useState(null);
	const [activeChat, setActiveChat] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 500);
	const [activeDropdown, setActiveDropdown] = useState(null);
	const [activeSubModule, setActiveSubModule] = useState(null);
	const [showSettingsSidebar, setShowSettingsSidebar] = useState(null);
	const settingsSidebar = JSON.parse(localStorage.getItem('showSettingsSidebar')) || false;
	const [selectedSettingsOption, setSelectedSettingsOption] = useState(null);

	const location = useLocation();

	const isAdmin = tenantUserAccessControls?.role === 'admin';
	const isWorkspaceSuspended = workspaceMode === 'suspended';

	const settingsOptions = isWorkspaceSuspended
		? []
		: isAdmin
		? settingsNavigationItems?.admin || []
		: settingsNavigationItems?.user || [];

	const newThemeValue = theme === 'dark' ? 'light' : 'dark';
	useEffect(() => {
		if (isSidebarOpen) {
			setShowSettingsSidebar(settingsSidebar);
		}
	}, [isSidebarOpen]);
	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, [tennantSettingsData]);

	const channel = useBroadcastChannel();
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

	const handleNewChat = () => {
		const sessionId = ObjectID()?.toString();
		navigate(`/chat/${sessionId}`);
		updateStateValues({
			currentChatData: null,
		});
	};

	const handleLogout = useCallback(async () => {
		logout();
		channel.postMessage('reload');
	}, [logoutFunc]);

	const openWorkspacesFunction = (isSidebarOpen) => {
		setsidebarStates((prevState) => ({
			...prevState,
			workSpaceOpen: isSidebarOpen,
			navStyle: isSidebarOpen ? 'workspace' : 'close',
		}));
	};

	const handleSidebarCollapse = (e) => {
		setsidebarStates({ ...sidebarStates, navStyle: 'close' });
		setIsSidebarOpen(false);
	};

	const handleNavigateFunction = useCallback(
		(route, singleItems) => {
			if (singleItems?.name === 'Settings') {
				setShowSettingsSidebar(true);
				navigate('/settings/my-profile');
				// Close sidebar on mobile after navigation
				if (isMobile) {
					handleSidebarCollapse();
				}
				return;
			}

			if (!route) return;
			setSelectedOption(singleItems?.name);
			setsidebarStates((prev) => ({
				...prev,
				selectedModule: singleItems?.name,
			}));
			if (singleItems?.name === 'New Chat') {
				handleNewChat();
				// Close sidebar on mobile after navigation
				if (isMobile) {
					handleSidebarCollapse();
				}
				return;
			}
			navigate(route);
			// Close sidebar on mobile after navigation
			if (isMobile) {
				handleSidebarCollapse();
			}
		},
		[navigate, workspaceMode, isMobile, handleSidebarCollapse],
	);

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
			// Close sidebar on mobile after navigation
			if (isMobile) {
				handleSidebarCollapse();
			}
		}
	};

	const filterModules = (modulesList, accessControls, allPossibleApps) => {
		if (!accessControls?.length) {
			return modulesList; // If no access control data, return the modules as is
		}

		return modulesList
			?.map((module) => {
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

	const filteredModules =
		tenantUserAccessControls?.role === 'admin'
			? sidebarNavigationItems
			: filterModules(
					sidebarNavigationItems,
					tenantUserAccessControls?.accessControls,
					allPossibleApps,
			  );

	const settingEssentials = isWorkspaceSuspended
		? []
		: tenantUserAccessControls?.role === 'admin'
		? settingsNavigationItems?.essentials || []
		: filterModules(
				settingsNavigationItems?.essentials || [],
				tenantUserAccessControls?.accessControls,
				allPossibleApps,
		  );

	const isExactPathMatch = useCallback(
		(currentRoute, moduleName) => {
			const currentPath = location.pathname.replace(/\/$/, '');
			const routePath = currentRoute?.replace(/\/$/, '');

			if (moduleName === 'Agents') {
				return currentPath.includes('/agents') || currentPath.includes('/ai-assistant');
			}

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

	const tooltipItems = [
		{
			key: 'theme',
			label: (theme) => `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`,
			icon: (theme) => (theme === 'dark' ? <SunIcon /> : <MoonIcon />),
			onClick: (updateTheme, newThemeValue) => () => updateTheme(newThemeValue),
		},
		// {
		//  key: 'search',
		//  label: (_, isMac) => (isMac ? 'Search ⌘ + k' : 'Search Ctrl + k'),
		//  icon: () => <SearchSvg />,
		//  onClick: (_, __, triggerCmdK) => () => triggerCmdK(),
		// },
		// {
		//  key: 'newChat',
		//  label: () => 'New Chat',
		//  icon: () => <NewEditSvg />,
		//  onClick: (_, __, ___, handleNewChat) => () => handleNewChat(),
		// },
	];

	const updateProfileImage = async (settings) => {
		let json = {
			dp_style: settings,
		};
		const response = await updateUserDetailsProfile(json);

		if (response[0]) {
			setUserDetails((prev) => ({ ...prev, cropSettings: settings }));
			updateUserLogo(logoFile);
		}
	};

	const updateDpThemeHandler = async (color) => {
		let json = {
			dp_style: {
				...userDetails?.cropSettings,
				profileDpColor: color,
			},
		};

		const response = await updateUserDetails(json);
		if (response[0]) {
			updateUserDetailsState({
				...json.dp_style,
			});
		}
	};

	const handleZoom = (zoom) => {
		setUserDetails((prev) => {
			return {
				...prev,
				cropSettings: {
					...prev.cropSettings,
					zoom,
				},
			};
		});
	};

	const handleCrop = (crop) => {
		setUserDetails((prev) => {
			return {
				...prev,
				cropSettings: {
					...prev.cropSettings,
					crop,
				},
			};
		});
	};

	const handleImageChange = (acceptedFiles) => {
		const file = acceptedFiles[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setUserDetails({
					...userDetails,
					logoURL: reader.result,
				});
			};
			reader.readAsDataURL(file);

			setuploadAvatarPopup((prev) => ({ ...prev, theme: false, file: true }));
			setlogoFile(file);
		}
	};

	const getInitials = (firstName, lastName) => {
		const firstNameInitial = firstName ? firstName?.charAt(0) : '-';
		const lastNameInitial = lastName ? lastName?.charAt(0) : '';
		const initials = `${firstNameInitial?.toUpperCase()}${lastNameInitial?.toUpperCase()}`;
		return initials;
	};

	return (
		<>
			<div
				style={{
					display: 'flex',
					position: 'relative',
				}}
			>
				{tenantUserAccessControls && (
					<div style={{ display: 'flex' }}>
						{(!isMobile || (isMobile && !selectedChat)) && (
							<>
								<div
									className="openSideBarComponent"
									style={{
										height: '100dvh',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'space-between',
										overflowY: 'auto',
										borderRight: '1px solid var(--dividers)',
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
													{tennantSettingsData?.logo_s3_500w_key && (
														<div className="workspaceLogoContainer">
															<img
																className="workspaceLogo"
																src={
																	tennantSettingsData?.logo_s3_500w_key
																}
																alt={
																	tennantSettingsData?.businessName
																}
															/>
														</div>
													)}
													{workspaceNotFound ? (
														<h6 className="workspaceName">
															{workspaceId}
														</h6>
													) : (
														<h6 className="workspaceName">
															{tennantSettingsData?.businessName}
														</h6>
													)}
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
											<SidebarTooltip
												label="Close Sidebar"
												icon={
													<SidebarClosingSvg
														className="collapseArrow"
														style={{ cursor: 'pointer' }}
														onClick={(e) => {
															e.stopPropagation();
															handleSidebarCollapse();
														}}
													/>
												}
											/>

											{!isThisEarlyAccessPage && (
												<div className="sideBarOptions">
													{tooltipItems?.map(
														({ key, label, icon, onClick }) => (
															<SidebarTooltip
																key={key}
																label={label(theme, isMac)}
																icon={icon(theme)}
																onClick={onClick(
																	updateTheme,
																	newThemeValue,
																	triggerCmdK,
																	handleNewChat,
																)}
															/>
														),
													)}
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
												overflowY: 'auto',
												justifyContent: `${
													isThisEarlyAccessPage ? 'flex-end' : ''
												}`,
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
													{filteredModules?.map((singleItem, index) => (
														<div key={index}>
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
																isActive={isExactPathMatch(
																	singleItem.route,
																	singleItem.name,
																)}
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
														<hr className={'horizontal-line-sidebar'} />
														<ChatHistory />
													</div>
													<CreditsLeft />
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
																		{tennantSettingsData?.businessName?.toUpperCase()}
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
														{!workspaceNotFound && (
															<>
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
																		{userDetailsData?.firstName}
																	</span>
																	<span className="workspaceId">
																		{
																			tennantSettingsData?.businessName
																		}
																	</span>
																</div>
															</>
														)}
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
						// style={{ height: renewBanner ? 'calc(100dvh - 41px)' : '100dvh' }}
						style={{ height: '100dvh' }}
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
									{/* <div className="eachOption" onClick={triggerCmdK}>
                                        <SearchSvg />
                                    </div> */}
									<div className="eachOption" onClick={handleNewChat}>
										<NewEditSvg />
									</div>
								</div>
							)}
						</div>

						<div className="profile-image-div">
							<div className="imageCircleDiv">
								{userDetails?.logoURL ? (
									<div className="crop-container">
										<Cropper
											image={userDetails?.logoURL} // Image URL to crop
											crop={userDetails?.cropSettings?.crop}
											zoom={userDetails?.cropSettings?.zoom}
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
												userDetails?.cropSettings?.profileDpColor || '',
										}}
									>
										{getInitials(
											userDetailsData?.firstName,
											userDetailsData?.lastName,
										)}
									</div>
								)}

								<div
									className="editImage"
									onClick={() =>
										setuploadAvatarPopup((prev) => ({ ...prev, theme: true }))
									}
								>
									<PencilkSvg />
								</div>
							</div>
						</div>

						<UploadAvatarPopupComponent
							userDetails={userDetails}
							userDetailsData={userDetailsData}
							uploadAvatarPopup={uploadAvatarPopup}
							setuploadAvatarPopup={setuploadAvatarPopup}
							handleImageChange={handleImageChange}
							updateDpThemeHandler={updateDpThemeHandler}
							setZoom={handleZoom}
							setCrop={handleCrop}
						/>

						<UploadFileProiflePopup
							userDetails={userDetails}
							userDetailsData={userDetailsData}
							uploadAvatarPopup={uploadAvatarPopup}
							setuploadAvatarPopup={setuploadAvatarPopup}
							updateProfileImage={updateProfileImage}
						/>

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
										// Close sidebar on mobile after navigation
										if (isMobile) {
											handleSidebarCollapse();
										}
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
							{settingEssentials?.map((singleItem, index) => (
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
										isActive={isExactPathMatch(
											singleItem.route,
											singleItem.name,
										)}
										subModules={singleItem.subModules}
										isDropdownVisible={activeDropdown === singleItem.name}
										onDropdownToggle={() =>
											handleDropdownToggle(singleItem.name)
										}
										setActiveDropdown={setActiveDropdown}
										activeSubModule={activeSubModule}
										setActiveSubModule={setActiveSubModule}
										handleSubModuleClick={handleSubModuleClick}
										setShowNotificationsDrawer={setShowNotificationsDrawer}
										setShowNotesDrawer={setShowNotesDrawer}
										handleSidebarCollapse={handleSidebarCollapse}
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
								style={{ width: '100%', position: 'relative' }}
								className={`${
									showSettingsSidebar ? 'settingsAnimationContainer' : ''
								}`}
							>
								{!sidebarStates?.workSpaceOpen && (
									<div
										className="settings-footer"
										onClick={() => openWorkspacesFunction(true)}
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
												{tennantSettingsData?.businessName?.toUpperCase()}
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
							sidebarStates?.workSpaceOpen ? 'slideUpSidebar' : 'slideDown'
						} 0.3s ease-out`,
						top: `${isThisEarlyAccessPage ? '40px' : ''}`,
						transformOrigin: `${isThisEarlyAccessPage ? 'top' : 'bottom'}`,
					}}
				>
					<WorkspaceListComponent
						setsidebarStates={setsidebarStates}
						sidebarStates={sidebarStates}
						sidebarSettings="close"
						isThisEarlyAccessPage={isThisEarlyAccessPage}
					/>
				</div>
			)}
		</>
	);
};

export default memo(OpenedSidebar);
