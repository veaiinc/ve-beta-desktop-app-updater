import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import s from '../../../../assets/scss/sidebar/sidebar.module.scss';
import { ReactComponent as SidebarClosingSvg } from '../../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as LogoutSvg } from '../../../../assets/svg/sidebar/logout.svg';
import { ReactComponent as NotificationsSvg } from '../../../../assets/svg/sidebar/notifications.svg';
import { ReactComponent as SettingSvg } from '../../../../assets/svg/sidebar/setting.svg';
import { ReactComponent as SwitchWorkspaceSvg } from '../../../../assets/svg/sidebar/switchWorkspace.svg';
import { ReactComponent as CreateWorkspaceSvg } from '../../../../assets/svg/sidebar/createWorkspace.svg';
import { ReactComponent as ShortcutBarSvg } from '../../../../assets/svg/sidebar/shortcutBar.svg';
import Context from '../../../../context/context';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarMainContent from './SidebarMainContent';
import CreditsLeftSvg from '../chatHistory/CreditsLeftSvg';
import logout from '../../../../helpers/logout';
import useBroadcastChannel from '../../../../hooks/useBroadcastChannel';
import CreditsUpgradeTooltip from './CreditsUpgradeTooltip';
import SwitchWorkspace from './SwitchWorkspace';
import Notifications from '../../topNavbar/components/notifications/Notifications';
import Shortcuts from '../../topNavbar/components/shortcuts/Shortcuts';
import { Tooltip } from 'antd';
import WindowChromeButtons from '../../../../components/WindowChromeButtons';

const routeNameMapper = {
	chat: 'removeActiveTab',
	'new-chat': 'newChat',
	'ongoing-meeting': 'ongoingMeeting',
	home: 'meet',
	settings: 'removeActiveTab',
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
		switchWorkspaceEnabled: false,
		workspaceModalOpen: false,
		workspaceListOpen: false,
		notificationsOpen: false,
		shortcutsOpen: false,
	});

	const notificationsRef = useRef(null);
	const shortcutsRef = useRef(null);
	const notificationsButtonRef = useRef(null);
	const shortcutsButtonRef = useRef(null);
	const workspaceModalRef = useRef(null);
	const workspaceListRef = useRef(null);
	const footerRef = useRef(null);

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

	// Load workspace list
	useEffect(() => {
		if (!userWorkSpaceList) {
			getUserWorkSpaceList();
		}
	}, [userWorkSpaceList]);

	// Handle click outside to close overlays
	useEffect(() => {
		const handleClickOutside = (event) => {
			// Check if notifications overlay is open
			if (localState?.notificationsOpen) {
				const clickedInsideNotifications = notificationsRef.current?.contains(event.target);
				const clickedNotificationsButton = notificationsButtonRef.current?.contains(
					event.target,
				);

				if (!clickedInsideNotifications && !clickedNotificationsButton) {
					setLocalState((prev) => ({ ...prev, notificationsOpen: false }));
				}
			}

			// Check if shortcuts overlay is open
			if (localState?.shortcutsOpen) {
				const clickedInsideShortcuts = shortcutsRef.current?.contains(event.target);
				const clickedShortcutsButton = shortcutsButtonRef.current?.contains(event.target);

				if (!clickedInsideShortcuts && !clickedShortcutsButton) {
					setLocalState((prev) => ({ ...prev, shortcutsOpen: false }));
				}
			}

			// Check if workspace modal is open
			if (localState?.workspaceModalOpen) {
				const clickedInsideWorkspaceModal = workspaceModalRef.current?.contains(
					event.target,
				);
				const clickedFooter = footerRef.current?.contains(event.target);

				if (!clickedInsideWorkspaceModal && !clickedFooter) {
					setLocalState((prev) => ({ ...prev, workspaceModalOpen: false }));
				}
			}

			// Check if workspace list is open
			if (localState?.workspaceListOpen) {
				const clickedInsideWorkspaceList = workspaceListRef.current?.contains(event.target);
				const clickedFooter = footerRef.current?.contains(event.target);

				if (!clickedInsideWorkspaceList && !clickedFooter) {
					setLocalState((prev) => ({ ...prev, workspaceListOpen: false }));
				}
			}
		};

		// Add event listener
		document.addEventListener('mousedown', handleClickOutside);

		// Cleanup
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [
		localState?.notificationsOpen,
		localState?.shortcutsOpen,
		localState?.workspaceModalOpen,
		localState?.workspaceListOpen,
	]);

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
			notificationsOpen: false,
			shortcutsOpen: false,
		}));
	}, []);

	const handleWorkspaceOverlayToggle = useCallback(() => {
		// If any overlay is open, close all
		if (
			localState?.workspaceModalOpen ||
			localState?.workspaceListOpen ||
			localState?.notificationsOpen ||
			localState?.shortcutsOpen
		) {
			handleCloseAllOverlays();
		} else {
			// If nothing is open, open workspace modal
			setLocalState((prev) => ({
				...prev,
				workspaceModalOpen: true,
				workspaceListOpen: false,
				notificationsOpen: false,
				shortcutsOpen: false,
			}));
		}
	}, [
		localState?.workspaceModalOpen,
		localState?.workspaceListOpen,
		localState?.notificationsOpen,
		localState?.shortcutsOpen,
		handleCloseAllOverlays,
	]);

	const handleNotificationsToggle = useCallback((e) => {
		e?.stopPropagation();
		setLocalState((prev) => ({
			...prev,
			notificationsOpen: !prev?.notificationsOpen,
			workspaceModalOpen: false,
			workspaceListOpen: false,
			shortcutsOpen: false,
		}));
	}, []);

	const handleShortcutsToggle = useCallback((e) => {
		e?.stopPropagation();
		setLocalState((prev) => ({
			...prev,
			shortcutsOpen: !prev?.shortcutsOpen,
			workspaceModalOpen: false,
			workspaceListOpen: false,
			notificationsOpen: false,
		}));
	}, []);

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

							<button
								ref={notificationsButtonRef}
								className={`${s.notificationsIcon} ${
									localState?.notificationsOpen ? s.active : ''
								}`}
								type="button"
								aria-label="Notifications"
								onClick={handleNotificationsToggle}
							>
								<NotificationsSvg width={20} height={20} />
							</button>

							<button
								ref={shortcutsButtonRef}
								className={`${s.gridIcon} ${
									localState?.shortcutsOpen ? s.active : ''
								}`}
								type="button"
								aria-label="Shortcuts"
								onClick={handleShortcutsToggle}
							>
								<ShortcutBarSvg width={20} height={20} />
							</button>
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

					{/* Notifications Top Overlay - Show when notifications is clicked */}
					{localState?.notificationsOpen && (
						<div ref={notificationsRef} className={s.notificationsTopOverlay}>
							<div className={s.notificationsTopOverlayContent}>
								<Notifications onClose={handleCloseAllOverlays} />
							</div>
						</div>
					)}

					{/* Shortcuts Top Overlay - Show when shortcuts is clicked */}
					{localState?.shortcutsOpen && (
						<div ref={shortcutsRef} className={s.shortcutsTopOverlay}>
							<div className={s.shortcutsTopOverlayContent}>
								<Shortcuts onClose={handleCloseAllOverlays} />
							</div>
						</div>
					)}

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
						ref={footerRef}
						className={`${s.footer} ${
							localState?.workspaceModalOpen || localState?.workspaceListOpen
								? s.expanded
								: ''
						}`}
						onClick={handleWorkspaceOverlayToggle}
					>
						{/* Workspace Options - Show when expanded */}
						{localState?.workspaceModalOpen && (
							<div ref={workspaceModalRef} className={s.workspaceOptions}>
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
							<div ref={workspaceListRef} className={s.workspaceListOverlay}>
								<div className={s.workspaceListHeader}>
									<h3 className={s.workspaceListTitle}>Switch Workspace</h3>
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
			<div
				className={`${s.windowChromeButtonsContainer} ${shouldShowSidebar ? s.active : ''}`}
			>
				<WindowChromeButtons />
			</div>
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
