import React, { useState, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlusSvg from '../../../assets/svg/sidebar/PlusSvg';
import AppartmentHomeSvg from '../../../assets/svg/sidebar/AppartmentHomeSvg';
import { veAiModulesItemsList } from './sidebarindex';
import DropDrownMenu from './DropDrownMenu';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as TaskSvg } from '../../../assets/svg/sidebar/Task.svg';
import { ReactComponent as HamburgerSvg } from '../../../assets/svg/sidebar/Hamburger.svg';
import { Tooltip } from 'antd';
import { closedSidebarIcons } from './sidebarindex';
import { AiOptions } from './sidebarindex';
const ClosedSideBarHoverStateIcons = ({ Icon, initialColor = null, hoverClassName = '' }) => {
	const [isHover, setisHover] = useState(false);
	return (
		<div
			onMouseEnter={() => setisHover(true)}
			onMouseLeave={() => setisHover(false)}
			className={`hoverStateIconsClosed ${isHover ? hoverClassName : ''}`}
		>
			{Icon && <Icon fill={isHover ? '#FFF' : initialColor} />}
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

	useEffect(() => {
		const currentPath = window.location.pathname;
		const { title } = getPathInfo(currentPath);
		setLastVisitedLocation(title);
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
		return AiOptions.filter((option) => !currentPath.includes(option.route));
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
												marginBottom: '8px',
												display: 'flex',
												alignItems: 'center',
												gap: '12px',
												fontSize: '14px',
												fontWeight: '500',
												fontFamily: 'Inter',
												fontStyle: 'normal',
												lineHeight: '20px',
											}}
										>
											{!AiOptions.find((option) =>
												window.location.pathname.includes(option.route),
											) && (
												<TaskSvg
													style={{ height: '20px', width: '20px' }}
												/>
											)}
											{AiOptions.find((option) =>
												window.location.pathname.includes(option.route),
											)?.name || getPathInfo(window.location.pathname).title}
										</h3>
										{!AiOptions.find((option) =>
											window.location.pathname.includes(option.route),
										) && (
											<p
												style={{
													margin: 0,
													fontSize: '12px',
													fontWeight: '500',
													fontFamily: 'Inter',
													fontStyle: 'normal',
												}}
											>
												{getPathInfo(window.location.pathname).description}
											</p>
										)}
									</div>
								}
								open={showRaindrop}
								placement="rightTop"
								arrow={false}
								overlayInnerStyle={{
									padding: '20px 25px',
									borderRadius: '24px',
									fontSize: '14px',
									backgroundColor: '#1f1f1f',
									color: 'white',
									width: '220px',
									height: AiOptions.find((option) =>
										window.location.pathname.includes(option.route),
									)
										? '60px'
										: '145px', // Reduced height for AI options
									transformOrigin: 'left center',
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
										)?.image ? (
											<img
												src={
													AiOptions.find((option) =>
														window.location.pathname.includes(
															option.route,
														),
													)?.image
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
							<hr style={{ border: '0.7px solid #333334', margin: '16px 0px' }} />
							<div className="ClosedIconsContainer">
								{visibleIcons?.map((singleItem, index) => (
									<div
										key={index}
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
										<ClosedSideBarHoverStateIcons
											Icon={singleItem?.icon}
											initialColor={singleItem?.initialColor}
										/>
									</div>
								))}
								<hr style={{ border: '0.7px solid #333334', margin: '16px 0px' }} />
							</div>
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

							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '12px',
									padding: '0px',
								}}
							>
								<hr style={{ border: '0.7px solid #333334', margin: '16px 0px' }} />
								{getFilteredAiOptions().map((item) => (
									<div
										key={item.route}
										style={{ cursor: 'pointer' }}
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
								))}
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
								<hr style={{ border: '0.7px solid #333334', margin: '16px 0px' }} />
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
								{/* <hr style={{ border: '0.7px solid #333334', margin: '16px 0px' }} /> */}
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
											padding: '20px 25px',
											borderRadius: '24px',
											fontSize: '14px',
											backgroundColor: '#1f1f1f',
											color: 'white',
											transformOrigin: 'left center',
											marginLeft: '20px',
										}}
									>
										<SidebarClosingSvg
											onClick={openModuleFunction}
											className="sidebarClosingSvg"
										/>
									</Tooltip>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default memo(ClosedSideBarItemsComponent);
