import React, { useState, memo, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import PlusSvg from '../../../assets/svg/sidebar/PlusSvg';
import LeadPlusSvg from '../../../assets/svg/sidebar/LeadPlusSvg.jsx';
import AppartmentHomeSvg from '../../../assets/svg/sidebar/AppartmentHomeSvg';
import { veAiModulesItemsList } from './sidebarindex';
import DropDrownMenu from './DropDrownMenu';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as HamburgerSvg } from '../../../assets/svg/sidebar/Hamburger.svg';
import { Tooltip } from 'antd';
import { closedSidebarIcons } from './sidebarindex';
import { AiOptions } from './sidebarindex';
import Cookies from 'js-cookie';
import Context from '../../../context/context.js';
const ClosedSideBarHoverStateIcons = ({
	Icon,
	initialColor = null,
	hoverClassName = '',
	isActive = false,
}) => {
	const [isHover, setisHover] = useState(false);
	const {
		themeInfo: { theme },
	} = useContext(Context);
	// const theme = localStorage.getItem('theme') || Cookies.get('theme') || 'dark';

	return (
		<div
			onMouseEnter={() => setisHover(true)}
			onMouseLeave={() => setisHover(false)}
			className={`hoverStateIconsClosed ${isHover ? hoverClassName : ''}`}
		>
			{/* isActive ? '#FFF' : '#7A7E85' */}
			{Icon && (
				<Icon
					fill={
						theme === 'dark'
							? isActive
								? '#FFF'
								: '#7A7E85'
							: isActive
							? 'black'
							: 'rgba(123, 125, 132, 1)'
					}
				/>
			)}
		</div>
	);
};
const getPathInfo = (path) => {
	const cleanPath = path.replace(/\/$/, '');

	const pathInfo = {
		'/home': {
			title: 'Home',
			description: 'Your central dashboard for quick access to everything',
			initial: 'H',
		},
		'/settings': {
			title: 'Settings',
			description: 'Configure your account preferences and system settings',
			initial: 'S',
		},
		'/settings/my-profile': {
			title: 'Settings',
			description: 'Update your personal information and profile settings',
			initial: 'S',
		},
		'/calendar': {
			title: 'Calendar',
			description: 'Schedule and manage your appointments and events',
			initial: 'C',
		},
		'/transcript': {
			title: 'Transcript',
			description: 'Access and review your conversation history',
			initial: 'TS',
		},
		'/galleries': {
			title: 'Gallery',
			description: 'Browse and organize your media collections',
			initial: 'G',
		},
		'/playbook': {
			title: 'Playbook',
			description: 'Explore and manage your playbook content',
			initial: 'P',
		},
		'/share-and-earn': {
			title: 'Share and Earn',
			description: 'Refer friends and earn rewards through our affiliate program',
			initial: 'SE',
		},
		'/tasks': {
			title: 'Tasks',
			description: 'Manage and track your tasks and to-do list',
			initial: 'T',
		},
		'/ai-assistant': {
			title: 'AI Assistant',
			description: 'Access and manage your AI assistant',
			initial: 'AI',
		},
	};

	return pathInfo[cleanPath] || { title: 'Home', description: 'Your workspace dashboard' };
};

const ClosedSideBarItemsComponent = ({ sidebarStates, setsidebarStates, info, setInfo }) => {
	const navigate = useNavigate();
	const [showRaindrop, setShowRaindrop] = useState(false);
	const [selectedIcon, setSelectedIcon] = useState(null);
	const [lastVisitedLocation, setLastVisitedLocation] = useState('');
	const [visibleIcons, setVisibleIcons] = useState([]);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
	const [isThisEarlyAccessPage, setIsThisEarlyAccessPage] = useState(false);
	const {
		themeInfo: { theme },
	} = useContext(Context);

	useEffect(() => {
		const currentPath = window.location.pathname;
		const { title } = getPathInfo(currentPath);
		setLastVisitedLocation(title);
		if (currentPath.includes('/early-access')) {
			setIsThisEarlyAccessPage(true);
		}
	}, [window.location.pathname]);

	useEffect(() => {
		const selectedModule = veAiModulesItemsList.find(
			(module) => module.name === sidebarStates.selectedModule,
		);

		const iconsToShow =
			selectedModule?.subModules?.map((subModule) => ({
				icon: subModule.icon,
				route: subModule.route || '#',
				name: subModule.name,
			})) || [];

		setVisibleIcons(iconsToShow);
	}, [sidebarStates.selectedModule]);

	// ... existing code ...

	useEffect(() => {
		const currentPath = window.location.pathname;
		const selectedAiOption = AiOptions.find(
			(option) =>
				currentPath === option.route ||
				currentPath.startsWith(option.route + '/') ||
				option.subModules?.some(
					(subModule) =>
						currentPath === subModule.route ||
						currentPath.startsWith(subModule.route + '/'),
				),
		);

		// If we found an AI option, use its submodules
		if (selectedAiOption) {
			const iconsToShow =
				selectedAiOption.subModules?.map((subModule) => ({
					icon: subModule.icon,
					route: subModule.route || '#',
					name: subModule.name,
					description: subModule.description,
				})) || [];

			setVisibleIcons(iconsToShow);
			const activeIndex = iconsToShow.findIndex(
				(icon) => currentPath === icon.route || currentPath.startsWith(icon.route + '/'),
			);

			// Set the found index or default to 0 if no match
			setSelectedIcon(activeIndex !== -1 ? activeIndex : 0);
			return;
		}

		// If not an AI route, check regular modules
		const selectedModule = veAiModulesItemsList.find((module) =>
			module.subModules?.some(
				(subModule) =>
					currentPath === subModule.route ||
					currentPath.startsWith(subModule.route + '/'),
			),
		);

		if (selectedModule) {
			const iconsToShow =
				selectedModule.subModules?.map((subModule) => ({
					icon: subModule.icon,
					route: subModule.route || '#',
					name: subModule.name,
				})) || [];

			setVisibleIcons(iconsToShow);

			// Update selected module if different from current
			if (selectedModule.name !== sidebarStates.selectedModule) {
				setsidebarStates((prev) => ({
					...prev,
					selectedModule: selectedModule.name,
				}));
			}
		} else {
			setVisibleIcons([]);
		}
	}, [window.location.pathname, sidebarStates.selectedModule]);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 500);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const openModuleFunction = () => {
		setsidebarStates({ ...sidebarStates, isOpen: true, navStyle: 'open' });
	};

	const openNewFeaturePlus = () => {
		setInfo((prev) => ({ ...prev, isNewFeaturePlusOpen: !prev.isNewFeaturePlusOpen }));
	};
	const handleIconClick = (index, route) => {
		setSelectedIcon(index);
		const selectedIconName = closedSidebarIcons[index]?.name || 'Home';
		setLastVisitedLocation(selectedIconName);
	};
	const getFilteredAiOptions = () => {
		const currentPath = window.location.pathname;

		// Find parent module if we're in a submodule
		const parentModule = AiOptions.find((option) =>
			option.subModules?.some(
				(subModule) =>
					currentPath === subModule.route ||
					currentPath.startsWith(subModule.route + '/'),
			),
		);

		return AiOptions.filter(
			(option) =>
				// Exclude if it's the current direct route
				!currentPath.startsWith(option.route) &&
				// Exclude if it's the parent module of current submodule
				option.route !== parentModule?.route,
		);
	};

	const getParentAiModuleImage = (pathname) => {
		const parentModule = AiOptions.find((option) =>
			option.subModules?.some(
				(subModule) =>
					pathname === subModule.route || pathname.startsWith(subModule.route + '/'),
			),
		);
		return parentModule?.image;
	};

	return (
		<>
			{isMobile ? (
				<div
					className="hamburgerIconContainer"
					onClick={openModuleFunction}
					style={{ position: 'absolute', top: '0%' }}
				>
					<SidebarClosingSvg />
				</div>
			) : (
				<>
					<div
						className={`closedSideBarComponent ${
							visibleIcons.length === 0 ? 'no-submodules' : ''
						}`}
					>
						<div
							className="closedSideBarComponentContainer"
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								gap: '20px',
							}}
						>
							<Tooltip
								title={
									<div>
										<h3
											style={{
												margin: 0,
												// marginBottom: '8px',
												display: 'flex',
												alignItems: 'center',
												gap: '12px',
												fontSize: '14px',
												fontWeight: '500',
												fontFamily: 'Inter',
												fontStyle: 'normal',
												// lineHeight: '20px',
											}}
										>
											{AiOptions.find((option) =>
												window.location.pathname.includes(option.route),
											)?.name ||
												AiOptions.find((option) =>
													option.subModules?.some((subModule) =>
														window.location.pathname.startsWith(
															subModule.route,
														),
													),
												)?.name ||
												getPathInfo(window.location.pathname).title}
										</h3>
										{
											!AiOptions.find((option) =>
												window.location.pathname.includes(option.route),
											)
										}
									</div>
								}
								// open={showRaindrop}
								placement="rightTop"
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
								<div
									className="openWorkFlowContainer"
									onClick={openModuleFunction}
									onMouseEnter={() => setShowRaindrop(true)}
									onMouseLeave={() => setShowRaindrop(false)}
								>
									<div className="gradientCirlce">
										{AiOptions.find((option) =>
											window.location.pathname.includes(option.route),
										)?.image ||
										getParentAiModuleImage(window.location.pathname) ? (
											<img
												src={
													AiOptions.find((option) =>
														window.location.pathname.includes(
															option.route,
														),
													)?.image ||
													getParentAiModuleImage(window.location.pathname)
												}
												alt="AI Option"
												style={{
													height: '40px',
													width: '40px',
													borderRadius: '24px',
													padding: '0px',
												}}
											/>
										) : (
											<p
												style={{
													textTransform: 'capitalize',
													fontSize: '20px',
													fontFamily: 'Inter',
													fontWeight: '500',
													color: 'white',
												}}
											>
												{getPathInfo(window.location.pathname).initial}
											</p>
										)}
									</div>
								</div>
							</Tooltip>
							{visibleIcons?.length > 0 && (
								<hr
									style={{
										border: '0.7px solid #333334',
										width: '70%',
										alignSelf: 'center',
									}}
								/>
							)}
							<div className="ClosedIconsContainer">
								{visibleIcons?.length > 0 && (
									<>
										{visibleIcons?.map((singleItem, index) => {
											return (
												<Tooltip
													key={index}
													title={
														<div>
															<div
																style={{
																	color: '#939393',
																	fontFamily: 'Inter',
																	fontSize: '13px',
																	fontStyle: 'normal',
																	fontWeight: '500',
																	lineHeight: 'normal',
																	letterSpacing: '-0.26px',
																}}
															>
																{singleItem.description}
															</div>
															<div>{singleItem.name}</div>
														</div>
													}
													placement="right"
													arrow={false}
													overlayInnerStyle={{
														padding: '6px 10px',
														borderRadius: '10px',
														fontSize: '13px',
														fontWeight: '500',
														fontFamily: 'Inter',
														fontStyle: 'normal',
														lineHeight: 'normal',
														background: '#E8E8E8',
														color: '#202123',
														textAlign: 'left',
														marginLeft: '20px',
													}}
												>
													<div
														className={`iconContainer ${
															selectedIcon === index ? 'selected' : ''
														}`}
														onClick={() => {
															handleIconClick(index);
															navigate(singleItem?.route || '');
														}}
														style={{
															position: 'relative',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
														}}
													>
														{selectedIcon === index && (
															<div
																style={{
																	position: 'absolute',
																	left: '-65%',
																	top: '50%',
																	transform: 'translateY(-50%)',
																	width: '3px',
																	height: '24px',
																	background: `${
																		theme === 'dark'
																			? 'white'
																			: 'black'
																	}`,
																	borderRadius: '0 2px 2px 0',
																}}
															/>
														)}
														<ClosedSideBarHoverStateIcons
															Icon={singleItem?.icon}
															initialColor={singleItem?.initialColor}
															isActive={selectedIcon === index}
														/>
													</div>
												</Tooltip>
											);
										})}
									</>
								)}
							</div>
							{visibleIcons?.length > 0 && (
								<hr
									style={{
										border: '0.7px solid #333334',
										width: '70%',
										alignSelf: 'center',
									}}
								/>
							)}
						</div>
						<div className="TabOptions">
							{/* <div>
								<Tooltip
									placement="rightTop"
									title={<DropDrownMenu info={info} setInfo={setInfo} />}
									color={'#151515'}
									arrow={false}
									trigger="click"
									overlayClassName="sideBartoolTipContainer toolTipContainer"
									open={info?.isNewFeaturePlusOpen}
									onOpenChange={(open) => {
										if (!open) {
											setInfo((prev) => ({
												...prev,
												isNewFeaturePlusOpen: false,
											}));
										}
									}}
								>
									<div onClick={openNewFeaturePlus}>
										<ClosedSideBarHoverStateIcons
											Icon={PlusSvg}
											hoverClassName="plusIconHover"
										/>
									</div>
								</Tooltip>
							</div> */}

							{/* <div onClick={() => navigate('/home')}>
								<ClosedSideBarHoverStateIcons Icon={AppartmentHomeSvg} />
							</div>
							<div className="activeWorkspaceDiv" onClick={openModuleFunction}>
								<img
									src={info?.activeBusniessName?.logo_s3_500w_key}
									alt={info?.activeBusniessName?.activeWorkspaceId}
								/>
							</div> */}

							{/* <div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '21px',
									padding: '18px 0px',
								}}
							>
								<hr
									style={{
										border: '0.7px solid #333334',
										width: '70%',
										alignSelf: 'center',
									}}
								/>
								{getFilteredAiOptions().map((item) => (
									<Tooltip
										key={item.route}
										title={item.name}
										placement="rightBottom"
										arrow={false}
										overlayInnerStyle={{
											padding: '6px 10px',
											borderRadius: '10px',
											// width: '80px',
											fontSize: '14px',
											fontWeight: '500',
											fontFamily: 'Inter',
											fontStyle: 'normal',
											background: '#E8E8E8',
											color: '#202123',
											textAlign: 'center',
											marginLeft: '20px',
										}}
									>
										<div
											style={{ cursor: 'pointer', alignSelf: 'center' }}
											onClick={() => navigate(item.route)}
										>
											<img
												src={item.image}
												alt={item.name}
												style={{
													height: '24px',
													width: '24px',
													borderRadius: '24px',
												}}
											/>
										</div>
									</Tooltip>
								))}
							</div> */}
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '24px',
								}}
							>
								{!isThisEarlyAccessPage && (
									<>
										<hr
											style={{
												border: '0.7px solid #333334',
												width: '70%',
												alignSelf: 'center',
											}}
										/>
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
											}}
										>
											<div>
												<Tooltip
													placement="right"
													title={
														<DropDrownMenu
															info={info}
															setInfo={setInfo}
														/>
													}
													color={'#151515'}
													arrow={false}
													trigger="click"
													overlayClassName="sideBartoolTipContainer toolTipContainer"
													open={info?.isNewFeaturePlusOpen}
													onOpenChange={(open) => {
														if (!open) {
															setInfo((prev) => ({
																...prev,
																isNewFeaturePlusOpen: false,
															}));
														}
													}}
												>
													<div onClick={openNewFeaturePlus}>
														<ClosedSideBarHoverStateIcons
															style={{ alignSelf: 'center' }}
															Icon={LeadPlusSvg}
															hoverClassName="plusIconHover"
														/>
													</div>
												</Tooltip>
											</div>
										</div>

										<Tooltip
											title="Home"
											placement="left"
											arrow={false}
											overlayInnerStyle={{
												padding: '6px 10px',
												borderRadius: '10px',
												fontSize: '14px',
												background: '#E8E8E8',
												color: '#202123',
												textAlign: 'center',
												marginLeft: '24px',
											}}
										>
											<div
												onClick={() => navigate('/home')}
												style={{ alignSelf: 'center' }}
											>
												<ClosedSideBarHoverStateIcons
													Icon={AppartmentHomeSvg}
												/>
											</div>
										</Tooltip>
									</>
								)}

								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Tooltip
										title="Open the sidebar"
										placement="left"
										arrow={false}
										overlayInnerStyle={{
											padding: '6px 10px',
											borderRadius: '10px',
											fontSize: '14px',
											fontWeight: '500',
											fontFamily: 'Inter',
											fontStyle: 'normal',
											background: '#E8E8E8',
											color: '#202123',
											textAlign: 'center',
											marginLeft: '24px',
										}}
									>
										<SidebarClosingSvg
											onClick={openModuleFunction}
											className="sidebarClosingSvg"
										/>
									</Tooltip>
								</div>
								{!isThisEarlyAccessPage ? (
									<Tooltip
										title="Credit"
										placement="left"
										arrow={false}
										overlayInnerStyle={{
											padding: '6px 10px',
											borderRadius: '10px',
											fontSize: '14px',
											background: '#E8E8E8',
											color: '#202123',
											textAlign: 'center',
											marginLeft: '24px',
										}}
									>
										<div className="creditSvg" style={{ alignSelf: 'center' }}>
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
									</Tooltip>
								) : (
									<div className="creditSvg" style={{ alignSelf: 'center' }}>
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
								)}
								{/* <hr style={{ border: '0.7px solid #333334', margin: '16px 0px' }} /> */}
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default memo(ClosedSideBarItemsComponent);
