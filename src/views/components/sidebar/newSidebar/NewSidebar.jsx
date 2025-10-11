import { memo, useCallback, useContext, useEffect, useState } from 'react';
import s from '../../../../assets/scss/sidebar/sidebar.module.scss';
import { ReactComponent as SidebarClosingSvg } from '../../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as LogoutSvg } from '../../../../assets/svg/sidebar/logout.svg';
import { ReactComponent as NotificationsSvg } from '../../../../assets/svg/sidebar/notifications.svg';
import { ReactComponent as SettingSvg } from '../../../../assets/svg/sidebar/setting.svg';
import { ReactComponent as SwitchWorkspaceSvg } from '../../../../assets/svg/sidebar/switchWorkspace.svg';
import { ReactComponent as CreateWorkspaceSvg } from '../../../../assets/svg/sidebar/createWorkspace.svg';
import Context from '../../../../context/context';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarMainContent from './SidebarMainContent';
import CreditsLeftSvg from '../chatHistory/CreditsLeftSvg';
import logout from '../../../../helpers/logout';
import useBroadcastChannel from '../../../../hooks/useBroadcastChannel';
import CreditsUpgradeTooltip from './CreditsUpgradeTooltip';
import SwitchWorkspace from './SwitchWorkspace';
import Notifications from '../../topNavbar/components/notifications/Notifications';
import { Tooltip } from 'antd';

const routeNameMapper = {
	chat: 'removeActiveTab',
	'new-chat': 'newChat',
	'ongoing-meeting': 'ongoingMeeting',
	home: 'meet',
};

// const mediaQuery = window.matchMedia('(max-width: 768px)');

const NewSidebar = () => {
	const [localState, setLocalState] = useState({
		activeTab: null,
		activeType: 'chats',
		expanded: true,
		sidebarHoverState: false,
		logoutLoading: false,
		// isMobileView: mediaQuery.matches,
	});

	const location = useLocation();
	const navigate = useNavigate();
	const channel = useBroadcastChannel();

	const {
		templates: { sidebarState, updateStateValues, isSidebarMobileView },
		profileInfo: {
			userDetailsData,
			tennantSettingsData,
			tenantUserAccessControls,
			userWorkSpaceList,
			getUserWorkSpaceList,
		},
		subscriptionInfo: { currentPlan },
	} = useContext(Context);

	const { firstName, lastName, dp_s3_500w_key, googleMeta } = userDetailsData;
	const firstInitial = firstName?.charAt(0) ?? '';
	const lastInitial = lastName?.charAt(0) ?? '';
	const nameInitials = firstInitial + lastInitial;
	const profilePic = dp_s3_500w_key ?? googleMeta?.picture;
	const profilePicExists = profilePic ?? false;
	const businessName = tennantSettingsData?.businessName?.toUpperCase();
	const workspaceImage = tennantSettingsData?.logo_s3_500w_key ?? null;
	const fullName = `${firstName ?? ''} ${lastName ?? ''}`;
	const isAdmin = tenantUserAccessControls?.role === 'admin';

	// Initialize sidebar state from localStorage
	useEffect(() => {
		const isSidebarOpen = JSON.parse(localStorage.getItem('isSidebarOpen')) ?? false;
		if (!sidebarState) {
			updateStateValues({
				sidebarState: {
					overlay: false,
					open: isSidebarOpen,
				},
			});
		}

		// mediaQuery.addEventListener('change', handleResize);
		// return () => mediaQuery.removeEventListener('change', handleResize);
	}, []);

	// useEffect(() => {
	// 	if (isSidebarMobileView !== info?.isMobileView) {
	// 		updateStateValues({
	// 			isSidebarMobileView: info?.isMobileView,
	// 		});
	// 	}
	// }, [info?.isMobileView]);

	// Reset active tab when navigating to chat
	useEffect(() => {
		if (location.pathname) {
			const routeName = location.pathname.split('/')[1];

			if (routeNameMapper?.[routeName]) {
				let updatedActiveTab = routeNameMapper?.[routeName];
				updatedActiveTab = updatedActiveTab === 'removeActiveTab' ? null : updatedActiveTab;

				if (localState?.activeTab === updatedActiveTab) return;
				setLocalState((prev) => {
					return { ...prev, activeTab: routeNameMapper?.[routeName] };
				});
			}
		}
	}, [location.pathname]);

	// const handleResize = useCallback((e) => {
	// 	setInfo((prev) => ({ ...prev, isMobileView: e.matches }));
	// }, []);

	const handleTabChange = useCallback(
		(tab) => {
			if (localState?.activeTab === tab) return;
			setLocalState((prev) => ({ ...prev, activeTab: tab }));
		},
		[localState?.activeTab],
	);

	const handleTypeChange = useCallback(
		(type) => {
			if (localState?.activeType === type) return;
			setLocalState((prev) => ({ ...prev, activeType: type }));
		},
		[localState?.activeType],
	);

	const handleToggleChatsExpand = useCallback(() => {
		setLocalState((prev) => ({ ...prev, expanded: !prev?.expanded }));
	}, []);

	// Sidebar state management
	const handleSidebarOpen = useCallback(() => {
		const newState = { overlay: sidebarState?.overlay ?? false, open: true };
		updateStateValues({ sidebarState: newState });
		localStorage.setItem('isSidebarOpen', 'true');
	}, [sidebarState, updateStateValues]);

	const handleSidebarClose = useCallback(() => {
		const newState = { overlay: sidebarState?.overlay ?? false, open: false };
		updateStateValues({ sidebarState: newState });
		localStorage.setItem('isSidebarOpen', 'false');
		setLocalState((prev) => ({ ...prev, sidebarHoverState: false }));
	}, [sidebarState, updateStateValues]);

	const handleSidebarHoverEnter = useCallback(() => {
		if (!sidebarState?.open) {
			setLocalState((prev) => ({ ...prev, sidebarHoverState: true }));
		}
	}, [sidebarState?.open]);

	const handleSidebarHoverLeave = useCallback(() => {
		setLocalState((prev) => ({ ...prev, sidebarHoverState: false }));
	}, []);

	const handleLogout = async (e) => {
		e?.stopPropagation();
		setLocalState((prev) => ({ ...prev, logoutLoading: true }));
		await logout();
		channel.postMessage('logout');
		setLocalState((prev) => ({ ...prev, logoutLoading: false }));
	};

	const handleSettingsClick = useCallback(() => {
		navigate('/settings/my-profile');
	}, [navigate]);

	const handleSwitchWorkspace = useCallback((e) => {
		e?.stopPropagation();
		setLocalState((prev) => ({
			...prev,
			workspaceListOpen: !prev?.workspaceListOpen,
			workspaceModalOpen: false, // Close workspace modal if open
		}));
	}, []);

	const handleCreateWorkspace = useCallback(() => {
		navigate('/create-workspace');
	}, [navigate]);

	const handleCloseAllOverlays = useCallback(() => {
		setLocalState((prev) => ({
			...prev,
			workspaceModalOpen: false,
			workspaceListOpen: false,
		}));
	}, []);

	const handleVeLogoClick = useCallback(() => {
		if (info?.activeTab !== 'newChat') {
			navigate('/new-chat');
			handleTabChange('newChat');
			setInfo((prev) => ({ ...prev, showSettings: false }));
		}
	}, [localState?.workspaceModalOpen, localState?.workspaceListOpen, handleCloseAllOverlays]);

	// Derived state for cleaner logic
	const isSidebarOpen = sidebarState?.open ?? false;
	const isSidebarHovered = localState?.sidebarHoverState && !isSidebarOpen;
	const shouldShowOverlay = isSidebarOpen && (sidebarState?.overlay || localState?.isMobileView);
	const shouldShowSidebar = isSidebarOpen || isSidebarHovered;

	return (
		<>
			{/* Main Sidebar */}
			<div
				className={`${s.sidebarLayout} ${shouldShowSidebar ? s.active : ''}`}
				style={{
					transform: shouldShowSidebar ? 'translateX(0)' : 'translateX(-280px)',
					...(shouldShowOverlay && { backgroundColor: 'rgba(46, 83, 107, 0.7)' }),
				}}
				onMouseLeave={handleSidebarHoverLeave}
				role="navigation"
				aria-label="Main navigation"
			>
				<div className={s.sidebarContainer}>
					{/* Header */}
					<div className={s.header}>
						<div className={s.rightContainer}>
							<button
								className={s.settingsIcon}
								onClick={handleSettingsClick}
								aria-label="Open settings"
								type="button"
							>
								<SettingSvg width={20} height={20} />
							</button>

							<Tooltip
								title={<Notifications />}
								placement="bottom"
								arrow={false}
								color={'transparent'}
								rootClassName={s.notificationsTooltip}
							>
								<button
									className={s.notificationsIcon}
									type="button"
									aria-label="Notifications"
								>
									<NotificationsSvg width={20} height={20} />
								</button>
							</Tooltip>
							<CreditsUpgradeTooltip>
								<div className={s.creditsLeftContainer}>
									<CreditsLeftSvg
										totalAiCreditLimit={currentPlan?.totalAiCreditLimit}
										totalAiCreditUsed={currentPlan?.totalAiCreditUsed}
									/>
								</div>
							</CreditsUpgradeTooltip>
						</div>
					</div>

					{/* Main Content */}
					<div className={s.mainContent}>
						<SidebarMainContent
							activeTab={localState?.activeTab}
							handleTabChange={handleTabChange}
							activeType={localState?.activeType}
							handleTypeChange={handleTypeChange}
							expanded={localState?.expanded}
							handleToggleChatsExpand={handleToggleChatsExpand}
						/>
					</div>

					{/* Footer - Click to toggle workspace options */}
					<div
						className={`${s.footer} ${
							localState?.workspaceModalOpen || localState?.workspaceListOpen
								? s.expanded
								: ''
						}`}
						onClick={handleWorkspaceOverlayToggle}
					>
						{/* Workspace Options - Show when expanded */}
						{localState?.workspaceModalOpen && (
							<div className={s.workspaceOptions}>
								<button
									className={s.workspaceOption}
									onClick={handleSwitchWorkspace}
								>
									<div className={s.icon}>
										<SwitchWorkspaceSvg width={18} height={18} />
									</div>
									<div className={s.label}>Switch Workspace</div>
								</button>

								<button
									className={s.workspaceOption}
									onClick={handleCreateWorkspace}
								>
									<div className={s.icon}>
										<CreateWorkspaceSvg width={18} height={18} />
									</div>
									<div className={s.label}>Create Workspace</div>
								</button>
							</div>
						)}

						{/* Workspace List - Show when switch workspace is clicked */}
						{localState?.workspaceListOpen && (
							<div className={s.workspaceListOverlay}>
								<div className={s.workspaceListHeader}>
									<h3 className={s.workspaceListTitle}>Switch Workspace</h3>
									<button
										className={s.closeButton}
										onClick={(e) => {
											e.stopPropagation();
											handleCloseAllOverlays();
										}}
										aria-label="Close workspace list"
									>
										×
									</button>
								</div>
								<div className={s.workspaceListContent}>
									<SwitchWorkspace
										workspaceList={userWorkSpaceList}
										switchWorkspaceEnabled={localState?.workspaceListOpen}
									/>
								</div>
							</div>
						)}

						<div className={s.footerContent}>
							<div className={s.leftContainer}>
								<div className={s.userInfo}>
									{profilePicExists ? (
										<img
											className={s.profileImg}
											src={profilePic}
											alt="Profile"
										/>
									) : (
										<div
											className={s.nameInitials}
											aria-label={`${fullName} initials`}
										>
											{nameInitials}
										</div>
									)}
									{workspaceImage && (
										<img
											className={s.workspaceImage}
											src={workspaceImage}
											alt="Workspace logo"
										/>
									)}

									<div className={s.userInfoDetails}>
										<div className={s.nameAndRole}>
											<span className={s.fullName}>{fullName}</span>
											<span className={s.role} aria-label="User role">
												{isAdmin ? '(Admin)' : '(Member)'}
											</span>
										</div>
										<div className={s.businessName}>{businessName}</div>
									</div>
								</div>
							</div>

							<div className={s.rightContainer}>
								<button
									className={s.logoutButton}
									onClick={handleLogout}
									disabled={localState?.logoutLoading}
									aria-label="Logout"
									type="button"
								>
									<LogoutSvg />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Toggle Button - Always visible, absolute positioned */}
			<button
				className={`${s.sidebarToggle} ${isSidebarOpen ? s.open : s.closed}`}
				onClick={isSidebarOpen ? handleSidebarClose : handleSidebarOpen}
				aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
				type="button"
			>
				<SidebarClosingSvg width={20} height={20} />
			</button>

			{/* Hover Trigger - Only show when sidebar is closed */}
			{!isSidebarOpen && (
				<div
					className={s.sidebarHoverElement}
					onMouseEnter={handleSidebarHoverEnter}
					aria-hidden="true"
				/>
			)}

			{/* Overlay - Only show when sidebar is open and overlay is needed */}
			{shouldShowOverlay && (
				<div className={s.sidebarOverlay} onClick={handleSidebarClose} aria-hidden="true" />
			)}
		</>
	);
};

export default memo(NewSidebar);
