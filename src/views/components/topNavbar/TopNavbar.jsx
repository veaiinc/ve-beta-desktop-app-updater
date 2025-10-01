import { Fragment, useContext, useEffect, useState, useRef } from 'react';
import s from './topNavbar.module.scss';
import useWorkspaceMode from '../../../hooks/useWorkspaceMode';
import { useLocation, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';

// components
import Settings from './components/settings/Settings';
import Notifications from './components/notifications/Notifications';
import FilesTooltip from './components/filesTooltip/FilesTooltip';
import ToolsTooltip from './components/toolsTooltip/ToolsTooltip';
import ShareAndEarnModal from '../../features/shareAndEarn/ShareAndEarnModal';
import { Tooltip } from 'antd';

// svg icons
// import { ReactComponent as LightMode } from './assets/light-mode.svg';
// import { ReactComponent as DarkMode } from './assets/dark-mode.svg';
import { ReactComponent as NotificationsSvg } from './assets/notification.svg';
import { ReactComponent as ShareAndEarnSvg } from './assets/share-and-earn.svg';
import { ReactComponent as MenuSvg } from '../../../assets/svg/mobile/menu.svg';
import { ReactComponent as CloseSvg } from '../../../assets/svg/mobile/close.svg';
import CreditsLeftSvg from '../sidebar/chatHistory/CreditsLeftSvg';
import CreditsLeft from './components/creditsLeft/CreditsLeft';
import AddOnCards from '../settings/planbilling/addOnCards';

const tooltipStyle = {
	padding: 8,
	borderRadius: 8,
	color: 'var(--primary-font)',
	background: 'var(--navbar)',
	border: '1px solid var(--dividers)',
};

const baseLeftContainerItems = [
	{
		id: 1,
		label: 'Proactive AI',
		route: '/home',
		showBetaBadge: true,
	},
	{
		id: 2,
		label: 'Meetings',
		route: '/meet',
		showBetaBadge: false,
	},
	{
		id: 3,
		label: (
			<>
				Ask&nbsp;<span style={{ color: 'var(--primary-button)' }}>Ve</span>
			</>
		),
		route: '/chats',
		showBetaBadge: false,
	},
	// {
	// 	id: 4,
	// 	label: 'Agents',
	// 	route: '/agents',
	// 	showBetaBadge: true,
	// },
	{
		id: 5,
		label: 'Vault',
		route: '/files',
		showBetaBadge: true,
	},
	{
		id: 6,
		label: 'Tools',
		route: '/tools',
		showBetaBadge: true,
	},
];

const activeNavItemMap = {
	'/home': 1,
	'/meet': 2,
	'/chats': 3,
	'/agents': 4,
	'/files': 5,
	'/tools': 6,
};

const TopNavbar = () => {
	const region = localStorage.getItem('region') ?? 'us-east-1';
	const navigate = useNavigate();
	const { workspaceMode } = useWorkspaceMode();
	const { pathname } = useLocation();
	const hideTopNavbar =
		pathname.includes('builder') ||
		pathname.includes('galleries') ||
		pathname.includes('create-workspace') ||
		pathname.includes('agent/') ||
		pathname.includes('note/') ||
		pathname.includes('meet/') ||
		pathname.includes('chat/');

	const {
		profileInfo: {
			userDetailsData,
			tennantSettingsData,
			userWorkSpaceList,
			getUserWorkSpaceList,
		},
		templates: { updateStateValues },
		subscriptionInfo: { currentPlan },
		themeInfo: { theme, updateTheme },
	} = useContext(Context);

	const [info, setInfo] = useState({
		activeNavItem: activeNavItemMap[pathname],
		settingsTooltipOpen: false,
		activeMode: 1,
		showNotifications: false,
		filesTooltipOpen: false,
		toolsTooltipOpen: false,
		addOnCardsModalOpen: false,
		creditsLeftTooltipOpen: false,
		shareAndEarnModalOpen: false,
		mobileMenuOpen: false,
		notificationsTooltipOpen: false,
	});

	const mobileMenuRef = useRef(null);

	const { firstName, lastName, dp_s3_500w_key, googleMeta } = userDetailsData;
	const firstInitial = firstName?.charAt(0) ?? '';
	const lastInitial = lastName?.charAt(0) ?? '';
	const nameInitials = firstInitial + lastInitial;
	const profilePic = dp_s3_500w_key ?? googleMeta?.picture;
	const profilePicExists = profilePic ?? false;
	const businessName = tennantSettingsData?.businessName?.toUpperCase();
	const oppositeTheme = theme === 'dark' ? 'light' : 'dark';
	const leftContainerItems = (() => {
		let items = [...baseLeftContainerItems];

		if (workspaceMode === 'stable') {
			items = items.filter(
				(item) =>
					item.label !== 'Vault' &&
					item.label !== 'Tools' &&
					item.label !== 'Proactive AI' &&
					item.label !== 'Agents',
			);
		}

		if (region === 'ap-south-1') {
			items = items.filter(
				(item) =>
					item.label !== 'Insights' && item.label !== 'Chats' && item.label !== 'Agents',
			);
		}

		return items;
	})();

	useEffect(() => {
		if (!userWorkSpaceList) {
			getUserWorkSpaceList();
		}
	}, [userWorkSpaceList]);

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			activeNavItem: activeNavItemMap[pathname],
		}));
	}, [pathname]);

	useEffect(() => {
		setInfo((prev) => ({ ...prev, mobileMenuOpen: false }));
	}, [pathname]);

	useEffect(() => {
		if (info.mobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [info.mobileMenuOpen]);

	useEffect(() => {
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, []);

	const handleNavigation = ({ navItemId, route }) => {
		setInfo((prev) => ({
			...prev,
			activeNavItem: navItemId,
			mobileMenuOpen: false,
		}));

		// reset chat data when navigating to chat
		if (navItemId === 3) {
			updateStateValues({ currentChatData: null });
		}

		if (navItemId === 5) {
			setInfo((prev) => ({
				...prev,
				filesTooltipOpen: true,
				toolsTooltipOpen: false,
				settingsTooltipOpen: false,
				mobileMenuOpen: false,
			}));
			navigate(`/files?active-tab=Documents&viewMode=card`);
			return;
		}
		navigate(route);
	};

	const handleAction = ({ id }) => {
		if (id === 2) {
			updateTheme(oppositeTheme);
		}
		if (id === 4) {
			setInfo((prev) => ({
				...prev,
				shareAndEarnModalOpen: true,
			}));
		}
	};

	const toggleMobileMenu = () => {
		setInfo((prev) => ({
			...prev,
			mobileMenuOpen: !prev.mobileMenuOpen,
		}));
	};

	const closeMobileMenu = () => {
		setInfo((prev) => ({
			...prev,
			mobileMenuOpen: false,
		}));
	};

	const baseRightContainerItems = [
		{
			id: 1,
			label: 'Credits Left',
			icon: (
				<Tooltip
					open={info.creditsLeftTooltipOpen}
					onOpenChange={() =>
						setInfo((prev) => ({
							...prev,
							creditsLeftTooltipOpen: !prev.creditsLeftTooltipOpen,
						}))
					}
					title={
						<CreditsLeft
							totalAiCreditLimit={currentPlan?.totalAiCreditLimit}
							totalAiCreditUsed={currentPlan?.totalAiCreditUsed}
							openAddOnCardsModal={() =>
								setInfo((prev) => ({
									...prev,
									addOnCardsModalOpen: true,
									creditsLeftTooltipOpen: false,
								}))
							}
						/>
					}
					placement="bottom"
					arrow={false}
					color={'transparent'}
					rootClassName={s.topNavbarSettings}
				>
					<div className={s.creditsLeftContainer}>
						<CreditsLeftSvg
							totalAiCreditLimit={currentPlan?.totalAiCreditLimit}
							totalAiCreditUsed={currentPlan?.totalAiCreditUsed}
						/>
					</div>
				</Tooltip>
			),
		},
		// {
		// 	id: 2,
		// 	label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`,
		// 	icon: (
		// 		<Tooltip
		// 			title={
		// 				<div style={tooltipStyle}>
		// 					<span>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</span>
		// 				</div>
		// 			}
		// 			placement="bottom"
		// 			arrow={false}
		// 			color={'transparent'}
		// 			rootClassName={s.themeTooltip}
		// 		>
		// 			{theme === 'dark' ? <LightMode /> : <DarkMode />}
		// 		</Tooltip>
		// 	),
		// },
		{
			id: 3,
			label: 'Notifications',
			icon: (
				<Tooltip
					open={info.notificationsTooltipOpen}
					onOpenChange={(open) =>
						setInfo((prev) => ({ ...prev, notificationsTooltipOpen: open }))
					}
					title={
						<Notifications
							onClose={() =>
								setInfo((p) => ({ ...p, notificationsTooltipOpen: false }))
							}
						/>
					}
					placement="bottom"
					arrow={false}
					color={'transparent'}
					rootClassName={s.topNavbarNotifications}
				>
					<div className={s.creditsLeftContainer}>
						<NotificationsSvg />
					</div>
				</Tooltip>
			),
		},
		{
			id: 4,
			label: 'Share And Earn',
			icon: (
				<Tooltip
					title={
						<div style={tooltipStyle}>
							<span>Share and Earn</span>
						</div>
					}
					placement="bottom"
					arrow={false}
					rootClassName={s.shareAndEarnTooltip}
					color={'transparent'}
				>
					<ShareAndEarnSvg />
				</Tooltip>
			),
		},
	];

	const rightContainerItems =
		region === 'ap-south-1'
			? baseRightContainerItems.filter((item) => item.label !== 'Credits Left')
			: baseRightContainerItems;

	const navItems = [
		{
			id: 1,
			element: (
				<ul className={s.leftContainer}>
					{info.activeMode !== 3
						? leftContainerItems.map((navItem, index) =>
								navItem.id === 5 ? (
									<Tooltip
										open={info.filesTooltipOpen}
										onOpenChange={() =>
											setInfo((prev) => ({
												...prev,
												filesTooltipOpen: !prev.filesTooltipOpen,
												toolsTooltipOpen: false,
												settingsTooltipOpen: false,
											}))
										}
										key={`tooltip1-${navItem.id}-${index}`}
										title={
											<FilesTooltip
												closeTooltip={() =>
													setInfo((prev) => ({
														...prev,
														filesTooltipOpen: false,
														toolsTooltipOpen: false,
														settingsTooltipOpen: false,
													}))
												}
											/>
										}
										placement="bottom"
										arrow={false}
										color={'transparent'}
										rootClassName={s.topNavbarSettings}
									>
										<li
											className={`${s.navItem} ${s.profileItem} ${
												pathname.includes('/files') ? s.active : ''
											}`}
											onClick={() =>
												handleNavigation({
													navItemId: navItem.id,
													route: navItem.route,
												})
											}
										>
											{navItem.label}{' '}
											{navItem.showBetaBadge && (
												<span className={s.betaBadge}>Beta</span>
											)}
										</li>
									</Tooltip>
								) : navItem.id === 6 ? (
									<Tooltip
										open={info.toolsTooltipOpen}
										onOpenChange={() =>
											setInfo((prev) => ({
												...prev,
												toolsTooltipOpen: !prev.toolsTooltipOpen,
											}))
										}
										title={
											<ToolsTooltip
												closeTooltip={() =>
													setInfo((prev) => ({
														...prev,
														toolsTooltipOpen: false,
														settingsTooltipOpen: false,
														filesTooltipOpen: false,
													}))
												}
											/>
										}
										placement="bottom"
										arrow={false}
										color={'transparent'}
										rootClassName={s.topNavbarSettings}
										key={`tooltip2-${navItem.id}-${index}`}
									>
										<li
											onClick={() => {
												navigate('/tools');
												setInfo((prev) => ({
													...prev,
													toolsTooltipOpen: false,
													settingsTooltipOpen: false,
													filesTooltipOpen: false,
												}));
											}}
											className={`${s.navItem} ${s.profileItem}`}
										>
											{navItem.label}{' '}
											{navItem.showBetaBadge && (
												<span className={s.betaBadge}>Beta</span>
											)}
										</li>
									</Tooltip>
								) : (
									<li
										className={`${s.navItem} ${
											info.activeNavItem === navItem.id ? s.active : ''
										}`}
										onClick={() =>
											handleNavigation({
												navItemId: navItem.id,
												route: navItem.route,
											})
										}
										key={`${navItem.id}-${index}`}
									>
										{navItem.label}{' '}
										{navItem.showBetaBadge && (
											<span className={s.betaBadge}>Beta</span>
										)}
									</li>
								),
						  )
						: null}
				</ul>
			),
		},
		{
			id: 3,
			element: (
				<ul className={s.rightContainer}>
					{rightContainerItems.map((navItem, index) => (
						<li
							className={s.navItem}
							onClick={() => handleAction(navItem, index)}
							key={`${navItem.id}-${index}`}
						>
							{navItem.icon}
						</li>
					))}

					<Tooltip
						open={info.settingsTooltipOpen}
						onOpenChange={() =>
							setInfo((prev) => ({
								...prev,
								settingsTooltipOpen: !prev.settingsTooltipOpen,
								toolsTooltipOpen: false,
								filesTooltipOpen: false,
							}))
						}
						title={
							<Settings
								profilePicExists={profilePicExists}
								nameInitials={nameInitials}
								profilePic={profilePic}
								firstName={firstName}
								lastName={lastName}
								businessName={businessName}
								closeSettingsTooltip={() =>
									setInfo((prev) => ({
										...prev,
										settingsTooltipOpen: false,
										toolsTooltipOpen: false,
										filesTooltipOpen: false,
									}))
								}
							/>
						}
						placement="bottomRight"
						arrow={false}
						color={'transparent'}
						rootClassName={s.topNavbarSettings}
					>
						<li className={`${s.navItem} ${s.profileItem}`}>
							{profilePicExists ? (
								<img className={s.profileImg} src={profilePic} alt="profile" />
							) : (
								<p className={s.nameInitials}>{nameInitials}</p>
							)}
						</li>
					</Tooltip>
				</ul>
			),
		},
	];

	return (
		!hideTopNavbar && (
			<>
				<nav className={s.topNavbarContainer}>
					{/* Mobile Menu Button */}
					<button
						className={s.mobileMenuButton}
						onClick={toggleMobileMenu}
						aria-label="Toggle mobile menu"
					>
						<MenuSvg />
					</button>

					{/* Desktop Navigation */}
					{navItems.map((navItem) => {
						return <Fragment key={navItem.id}>{navItem.element}</Fragment>;
					})}

					{/* Mobile Menu Overlay */}
					{info.mobileMenuOpen && (
						<div
							className={`${s.mobileMenuOverlay} ${s.active}`}
							onClick={closeMobileMenu}
						></div>
					)}

					{/* Mobile Menu Content */}
					<div
						ref={mobileMenuRef}
						className={`${s.mobileMenuContent} ${info.mobileMenuOpen ? s.active : ''}`}
					>
						<div className={s.mobileMenuHeader}>
							<h3>Menu</h3>
							<button
								className={s.mobileCloseButton}
								onClick={closeMobileMenu}
								aria-label="Close mobile menu"
							>
								<CloseSvg />
							</button>
						</div>

						{/* Mode Selector Section */}
						{/* {showMiddleContainer && (
							<div className={s.mobileMenuSection}>
								<div className={s.sectionTitle}>Mode</div>
								<div className={s.mobileModeSelector}>
									{middleContainerItems.map((navItem) => (
										<button
											key={navItem.id}
											className={`${s.mobileModeButton} ${
												info.activeMode === navItem.id ? s.active : ''
											}`}
											onClick={() => handleMiddleNavigation(navItem)}
										>
											{info.activeMode === navItem.id
												? navItem.activeLabel
												: navItem.label}
										</button>
									))}
								</div>
							</div>
						)} */}

						{/* Navigation Section */}
						<div className={s.mobileMenuSection}>
							<div className={s.sectionTitle}>Navigation</div>
							{leftContainerItems.map((navItem) => (
								<div
									key={navItem.id}
									className={`${s.mobileNavItem} ${
										info.activeNavItem === navItem.id ? s.active : ''
									}`}
									onClick={() =>
										handleNavigation({
											navItemId: navItem.id,
											route: navItem.route,
										})
									}
								>
									{navItem.label}{' '}
									{navItem.showBetaBadge && (
										<span className={s.betaBadge}>Beta</span>
									)}
								</div>
							))}
						</div>
					</div>
				</nav>

				<AddOnCards
					isOpen={info.addOnCardsModalOpen}
					closeModal={() => setInfo((prev) => ({ ...prev, addOnCardsModalOpen: false }))}
					subscriptionState="addOnPlans"
					selectedPeriodProp="One Time Purchase"
				/>
				<ShareAndEarnModal
					isOpen={info.shareAndEarnModalOpen}
					closeModal={() =>
						setInfo((prev) => ({ ...prev, shareAndEarnModalOpen: false }))
					}
				/>
			</>
		)
	);
};

export default TopNavbar;
