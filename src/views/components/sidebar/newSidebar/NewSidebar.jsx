import { memo, useCallback, useContext, useEffect, useState } from 'react';
import s from '../../../../assets/scss/sidebar/sidebar.module.scss';
import { ReactComponent as VeLogoSvg } from '../../../../assets/svg/veLogo.svg';
import { ReactComponent as SidebarClosingSvg } from '../../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as LogoutSvg } from '../../../../assets/svg/sidebar/logout.svg';
import Context from '../../../../context/context';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarMainContent from './SidebarMainContent';
import CreditsLeftSvg from '../chatHistory/CreditsLeftSvg';
import logout from '../../../../helpers/logout';
import useBroadcastChannel from '../../../../hooks/useBroadcastChannel';
import SidebarSettings from './SidebarSettings';
import CreditsUpgradeTooltip from './CreditsUpgradeTooltip';

const NewSidebar = () => {
	const [info, setInfo] = useState({
		activeTab: null,
		activeType: 'chats',
		expanded: true,
		sidebarOpen: JSON.parse(localStorage.getItem('isSidebarOpen')) ?? false,
		overlay: false,
		sidebarHoverState: false,
		showSettings: false,
		logoutLoading: false,
	});
	const location = useLocation();
	const channel = useBroadcastChannel();
	const navigate = useNavigate();

	const {
		templates: { sidebarState, updateStateValues },
		profileInfo: { userDetailsData, tennantSettingsData, tenantUserAccessControls },
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

	useEffect(() => {
		if (sidebarState) {
			const { open, overlay } = sidebarState;
			if (info?.sidebarOpen === open && info?.overlay === overlay) return;
			setInfo((prev) => ({ ...prev, sidebarOpen: open ?? false, overlay: overlay ?? false }));
			localStorage.setItem('isSidebarOpen', JSON.stringify(open));
		}
	}, [sidebarState]);

	useEffect(() => {
		const isSidebarOpen = JSON.parse(localStorage.getItem('isSidebarOpen')) ?? false;
		if (sidebarState?.open !== isSidebarOpen) {
			updateStateValues({
				sidebarState: {
					overlay: sidebarState?.overlay ?? false,
					open: isSidebarOpen,
				},
			});
		}
	}, []);

	useEffect(() => {
		if (location.pathname) {
			const routeName = location.pathname.split('/')[1];

			if (routeName === 'chat') {
				setInfo((prev) => ({ ...prev, activeTab: null }));
			}
		}
	}, [location.pathname]);

	const handleTabChange = useCallback(
		(tab) => {
			if (info?.activeTab === tab) return;
			setInfo((prev) => ({ ...prev, activeTab: tab }));
		},
		[info?.activeTab],
	);

	const handleTypeChange = useCallback(
		(type) => {
			if (info?.activeType === type) return;
			setInfo((prev) => ({ ...prev, activeType: type }));
		},
		[info?.activeType],
	);

	const handleToggleChatsExpand = useCallback(() => {
		setInfo((prev) => ({ ...prev, expanded: !prev?.expanded }));
	}, []);

	const handleSidebarStateChange = useCallback(
		(open = false) => {
			updateStateValues({
				sidebarState: {
					overlay: sidebarState?.overlay ?? false,
					open,
				},
			});
		},
		[sidebarState, updateStateValues],
	);

	const handleSidebarHoverEnter = useCallback(() => {
		setInfo((prev) => ({ ...prev, sidebarHoverState: true }));
	}, []);

	const handleSidebarHoverLeave = useCallback(() => {
		setInfo((prev) => {
			if (prev?.sidebarOpen) return prev;
			return { ...prev, sidebarHoverState: false };
		});
	}, []);

	const handleLogout = async (e) => {
		e?.stopPropagation();
		setInfo((prev) => ({ ...prev, logoutLoading: true }));
		await logout();
		channel.postMessage('logout');
		setInfo((prev) => ({ ...prev, logoutLoading: false }));
	};

	const handleSettingsClick = useCallback(() => {
		setInfo((prev) => ({ ...prev, showSettings: !prev?.showSettings }));
	}, []);

	const handleVeLogoClick = useCallback(() => {
		if (info?.activeTab !== 'newChat') {
			navigate('/new-chat');
			handleTabChange('newChat');
		}
	}, [info?.activeTab]);

	return (
		<>
			<div
				className={`${s.sidebarLayout} ${info?.sidebarOpen ? s.active : ''}`}
				style={{
					...(!info?.sidebarOpen && {
						transform: info?.sidebarHoverState ? 'translateX(0)' : 'translateX(-256px)',
					}),
					...(info?.overlay &&
						info?.sidebarOpen && {
							backgroundColor: 'var(--card-hover)',
						}),
				}}
				onMouseLeave={handleSidebarHoverLeave}
			>
				<div className={s.sidebarContainer}>
					<div
						className={s.header}
						style={{
							...(!info?.sidebarOpen && {
								opacity: 0,
								pointerEvents: 'none',
							}),
						}}
					>
						<div className={s.veLogo} onClick={handleVeLogoClick}>
							<VeLogoSvg width={34} height={20} />
						</div>
						<div
							className={s.closeIcon}
							onClick={() => handleSidebarStateChange(false)}
						>
							<SidebarClosingSvg width={24} height={24} />
						</div>
					</div>
					<div className={s.mainContent}>
						{info?.showSettings ? (
							<SidebarSettings
								handleTabChange={handleTabChange}
								activeTab={info?.activeTab}
							/>
						) : (
							<SidebarMainContent
								activeTab={info?.activeTab}
								handleTabChange={handleTabChange}
								activeType={info?.activeType}
								handleTypeChange={handleTypeChange}
								expanded={info?.expanded}
								handleToggleChatsExpand={handleToggleChatsExpand}
							/>
						)}
					</div>

					<div className={s.footer} onClick={handleSettingsClick}>
						<div className={s.leftContainer}>
							<div className={s.userInfo}>
								{profilePicExists ? (
									<img className={s.profileImg} src={profilePic} alt="profile" />
								) : (
									<p className={s.nameInitials}>{nameInitials}</p>
								)}
								{workspaceImage && (
									<img
										className={s.workspaceImage}
										src={workspaceImage}
										alt="workspaceImage"
									/>
								)}

								<div className={s.userInfoDetails}>
									<p className={s.nameAndRole}>
										<span className={s.fullName}>{fullName}</span>{' '}
										<span className={s.role}>
											{isAdmin ? '(Admin)' : '(Member)'}
										</span>
									</p>
									<p className={s.businessName}>{businessName}</p>
								</div>
							</div>
						</div>

						<div className={s.rightContainer} onClick={(e) => e.stopPropagation()}>
							{info?.showSettings ? (
								<button
									className={s.logoutButton}
									onClick={handleLogout}
									style={{
										opacity: info?.logoutLoading ? 0.5 : 1,
										cursor: info?.logoutLoading ? 'not-allowed' : 'pointer',
									}}
									disabled={info?.logoutLoading}
								>
									<LogoutSvg />
								</button>
							) : (
								<CreditsUpgradeTooltip>
									<div className={s.creditsLeftContainer}>
										<CreditsLeftSvg
											totalAiCreditLimit={currentPlan?.totalAiCreditLimit}
											totalAiCreditUsed={currentPlan?.totalAiCreditUsed}
										/>
									</div>
								</CreditsUpgradeTooltip>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className={`${s.sidebarCloseState} ${!info?.sidebarOpen ? s.active : ''}`}>
				<button
					className={`${s.closeSidebar} ${s.btn}`}
					onClick={() => handleSidebarStateChange(true)}
				>
					<SidebarClosingSvg width={24} height={24} />
				</button>
			</div>

			{!info?.sidebarOpen && (
				<div className={s.sidebarHoverElement} onMouseEnter={handleSidebarHoverEnter}></div>
			)}

			{info?.sidebarOpen && info?.overlay && (
				<div className={s.sidebarOverlay} onClick={() => handleSidebarStateChange(false)} />
			)}
		</>
	);
};

export default memo(NewSidebar);
