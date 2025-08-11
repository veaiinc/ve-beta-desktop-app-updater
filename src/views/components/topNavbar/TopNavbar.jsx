import { Fragment, useContext, useEffect, useState } from 'react';
import s from './topNavbar.module.scss';
import useWorkspaceMode from '../../../hooks/useWorkspaceMode';
import { useLocation, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import ShareAndEarnModal from '../../features/shareAndEarn/ShareAndEarnModal';

// components
import Settings from './components/settings/Settings';
import Notifications from './components/notifications/Notifications';
import FilesTooltip from './components/filesTooltip/FilesTooltip';
import ToolsTooltip from './components/toolsTooltip/ToolsTooltip';
import { Tooltip } from 'antd';

// svg icons
import DownCaret from './assets/DownCaret';
import { ReactComponent as LightMode } from './assets/light-mode.svg';
import { ReactComponent as DarkMode } from './assets/dark-mode.svg';
import { ReactComponent as NotificationsSvg } from './assets/notification.svg';
import { ReactComponent as ShareAndEarnSvg } from './assets/share-and-earn.svg';
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
		label: 'Priority',
		route: '/priority',
	},
	{
		id: 2,
		label: 'Chats',
		route: '/chats',
	},
	{
		id: 3,
		label: 'Agents',
		route: '/agents',
	},
	{
		id: 4,
		label: 'Files',
		route: '/files',
	},
	{
		id: 5,
		label: 'Tools',
		route: '/home',
	},
];

const middleContainerItems = [
	{
		id: 1,
		label: 'Solo',
		activeLabel: 'Solo Mode',
	},
	// {
	// 	id: 2,
	// 	label: 'Team',
	// 	activeLabel: 'Team Mode',
	// },
	{
		id: 3,
		label: 'Meeting',
		activeLabel: 'Meeting Mode',
	},
];

const activeNavItemMap = {
	'/home': 5,
	'/chats': 2,
	'/agents': 3,
};

const TopNavbar = () => {
	const region = localStorage.getItem('region') ?? 'us-east-1';
	const navigate = useNavigate();
	const { workspaceMode } = useWorkspaceMode();
	const { pathname } = useLocation();
	const hideTopNavbar =
		pathname.includes('builder') ||
		pathname.includes('galleries') ||
		pathname.includes('create-workspace');
	//  ||
	// pathname.includes('	plan-billing');

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
	});

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
			items = items.filter((item) => item.label !== 'Files' && item.label !== 'Tools');
		}

		if (region === 'ap-south-1') {
			items = items.filter(
				(item) =>
					item.label !== 'Insights' && item.label !== 'Chats' && item.label !== 'Agents',
			);
		}

		return items;
	})();

	const showMiddleContainer = region !== 'ap-south-1';

	useEffect(() => {
		if (!userWorkSpaceList) {
			getUserWorkSpaceList();
		}
	}, [userWorkSpaceList]);

	useEffect(() => {
		if (pathname.includes('/meet')) setInfo((prev) => ({ ...prev, activeMode: 3 }));
		else setInfo((prev) => ({ ...prev, activeMode: 1 }));
	}, [pathname]);

	const handleNavigation = ({ navItemId, route }) => {
		setInfo((prev) => ({
			...prev,
			activeNavItem: navItemId,
		}));

		// reset chat data when navigating to chat
		if (navItemId === 2) {
			updateStateValues({ currentChatData: null });
		}

		if (navItemId === 4) {
			setInfo((prev) => ({
				...prev,
				filesTooltipOpen: true,
				toolsTooltipOpen: false,
				settingsTooltipOpen: false,
			}));
			navigate(`/files?active-tab=Documents&viewMode=card`);
			return;
		}
		navigate(route);
	};

	const handleMiddleNavigation = ({ id }) => {
		setInfo((prev) => ({
			...prev,
			activeMode: id,
		}));
		if (id === 1) {
			navigate('/home');
		}
		if (id === 3) {
			navigate('/meet');
		}
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
		{
			id: 2,
			label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`,
			icon: (
				<Tooltip
					title={
						<div style={tooltipStyle}>
							<span>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</span>
						</div>
					}
					placement="bottom"
					arrow={false}
					color={'transparent'}
				>
					{theme === 'dark' ? <LightMode /> : <DarkMode />}
				</Tooltip>
			),
		},
		{
			id: 3,
			label: 'Notifications',
			icon: (
				<Tooltip
					title={<Notifications />}
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
					{info.activeMode === 3
						? [leftContainerItems[0]].map((navItem, index) => (
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
									{navItem.label}
								</li>
						  ))
						: leftContainerItems.map((navItem, index) =>
								navItem.id === 4 ? (
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
											{navItem.label}
										</li>
									</Tooltip>
								) : navItem.id === 5 ? (
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
												navigate('/home');
												setInfo((prev) => ({
													...prev,
													toolsTooltipOpen: false,
													settingsTooltipOpen: false,
													filesTooltipOpen: false,
												}));
											}}
											className={`${s.navItem} ${s.profileItem} ${
												pathname.includes('/home') ? s.active : ''
											}`}
										>
											{navItem.label}
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
										{navItem.label}
									</li>
								),
						  )}
				</ul>
			),
		},
		...(showMiddleContainer
			? [
					{
						id: 2,
						element: (
							<ul className={s.middleContainer}>
								{middleContainerItems.map((navItem, index) => (
									<li
										className={`${s.navItem} ${
											info.activeMode === navItem.id ? s.active : ''
										}`}
										onClick={() => handleMiddleNavigation(navItem)}
										key={`${navItem.id}-${index}`}
									>
										{info.activeMode === navItem.id
											? navItem.activeLabel
											: navItem.label}
									</li>
								))}
							</ul>
						),
					},
			  ]
			: []),
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
							{/* <DownCaret /> */}
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
					{navItems.map((navItem) => {
						return <Fragment key={navItem.id}>{navItem.element}</Fragment>;
					})}
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
