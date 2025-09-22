import { useContext, useState, useEffect } from 'react';
import s from './settings.module.scss';
import Context from '../../../../../context/context';
import { useLocation, useNavigate } from 'react-router-dom';
import logout from '../../../../../helpers/logout';
import SwitchWorkspaceModal from '../switchWorkspaceModal/SwitchWorkspaceModal';
import Skeleton from 'react-loading-skeleton';
import { ReactComponent as MyProfileSvg } from '../../assets/my-profile.svg';
import { ReactComponent as WorkspaceSvg } from '../../assets/workspace.svg';
import { ReactComponent as TeamMembersSvg } from '../../assets/team-members.svg';
import { ReactComponent as IntegrationsSvg } from '../../assets/integrations.svg';
import { ReactComponent as PlanBillingSvg } from '../../assets/plan-billing.svg';
import { ReactComponent as AISetupSvg } from '../../assets/ai-setup.svg';
import { ReactComponent as HelpSvg } from '../../assets/help.svg';
import { ReactComponent as SwitchWorkspaceSvg } from '../../assets/switch-workspace.svg';
import { ReactComponent as LogoutSvg } from '../../assets/logout.svg';
import { ReactComponent as DownloadMacSvg } from '../../assets/download-mac.svg';
import { ReactComponent as DownloadWindowsSvg } from '../../assets/download-windows.svg';
import { ReactComponent as TemplatesSvg } from '../../assets/templates.svg';
import useIntercom from '../../../../../hooks/useIntercom';
import useBroadcastChannel from '../../../../../hooks/useBroadcastChannel';
import { ReactComponent as BackIcon } from '../../../../../assets/svg/mobile/back.svg';
import { ReactComponent as CloseIcon } from '../../../../../assets/svg/mobile/close.svg';
import { ReactComponent as PlusSvg } from '../../assets/plus.svg';
import CreditsLeftSvg from '../../../sidebar/chatHistory/CreditsLeftSvg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../../assets/svg/tasks/chevronRightThin.svg';
import AddOnCards from '../../../settings/planbilling/addOnCards';

const desktopAppDownloadWindows = import.meta.env.VITE_APP_DESKTOP_APP_WINDOWS_DOWNLOAD_URL || null;
const deepLinkUrl = 'veai://open';
const isMac =
	navigator.userAgentData?.platform === 'macOS' ||
	navigator.userAgent.toLowerCase().indexOf('mac') !== -1;
const isMacIntel64 =
	navigator.userAgent.includes('Macintosh') &&
	navigator.userAgent.includes('Intel') &&
	navigator.userAgent.includes('x86_64');

const desktopAppDownloadUrl = isMacIntel64
	? import.meta.env.VITE_APP_DESKTOP_APP_MACINTEL64_DOWNLOAD_URL
	: import.meta.env.VITE_APP_DESKTOP_APP_DOWNLOAD_URL || null;

export const settingsItems = [
	{
		id: 1,
		label: 'My Profile',
		icon: <MyProfileSvg />,
		route: '/settings/my-profile',
		value: 'my-profile',
	},
	{
		id: 2,
		label: 'Workspace',
		icon: <WorkspaceSvg />,
		route: '/settings/workspace',
		value: 'workspace',
	},
	{
		id: 3,
		label: 'Team Members',
		icon: <TeamMembersSvg />,
		route: '/settings/team-members',
		value: 'team-members',
	},
	{
		id: 4,
		label: 'Integrations',
		icon: <IntegrationsSvg />,
		route: '/settings/integrations',
		value: 'integrations',
	},
	{
		id: 5,
		label: 'Plan Billing',
		icon: <PlanBillingSvg />,
		route: '/settings/plan-billing',
		value: 'plan-billing',
	},
	{
		id: 6,
		label: 'Memory',
		icon: <AISetupSvg />,
		route: '/settings/ai-memory',
		value: 'ai-memory',
	},
	{
		id: 7,
		label: 'Templates',
		icon: <TemplatesSvg />,
		route: '/playbook',
	},
	{
		id: 8,
		label: 'Help',
		icon: <HelpSvg />,
		route: null,
	},
];

const Settings = ({
	profilePicExists,
	nameInitials,
	profilePic,
	firstName,
	lastName,
	businessName,
	closeSettingsTooltip,
}) => {
	const { pathname } = useLocation();
	const { shutdownIntercom, showIntercom, launchIntercom } = useIntercom();
	const channel = useBroadcastChannel();
	const navigate = useNavigate();

	const [info, setInfo] = useState(() => ({
		workspaceModalOpen: false,
		intercomOpen: false,
		isMobileView: window.matchMedia('(max-width: 767px)').matches,
		isDesktop: false,
		addOnCardsModalOpen: false,
		subscriptionState: null,
		selectedPeriodProp: null,
	}));

	const {
		profileInfo: { tenantUserAccessControls, userWorkSpaceList, tennantSettingsData },
		subscriptionInfo: { currentPlan, subscriptionPlans, getAllSubscriptionPlan },
	} = useContext(Context);

	const fullName = `${firstName ?? ''} ${lastName ?? ''}`;
	const isAdmin = tenantUserAccessControls?.role === 'admin';
	const workspacesMoreThanOne = userWorkSpaceList?.length > 1;
	const workspacesLoading = userWorkSpaceList === null;
	const workspaceImage = tennantSettingsData?.logo_s3_500w_key ?? null;

	useEffect(() => {
		if (window?.electronApi) {
			setInfo((prev) => ({
				...prev,
				isDesktop: true,
			}));
		}
	}, []);
	useEffect(() => {
		if (!subscriptionPlans) {
			getAllSubscriptionPlan();
		}
	}, [subscriptionPlans]);

	const currentPlanData = subscriptionPlans?.find(
		(plan) => plan._id === currentPlan?.currentPlanId,
	);

	// ✅ Extract the plan title (fallback to 'Free' or currentPlan?.currentPlan if not found)
	const currentPlanTitle = currentPlanData?.plan || currentPlan?.currentPlan || 'Free';
	const handleInstallOrOpen = () => {
		window.location.href = deepLinkUrl;

		const timer = setTimeout(() => {
			if (isMac) {
				if (desktopAppDownloadUrl) {
					window.open(desktopAppDownloadUrl, '_blank');
				}
			} else {
				if (desktopAppDownloadWindows) {
					window.open(desktopAppDownloadWindows, '_blank');
				}
			}
		}, 2000);

		// If user switches focus (e.g., app opened), cancel fallback
		window.addEventListener(
			'blur',
			() => {
				clearTimeout(timer);
			},
			{ once: true },
		);
	};
	const handleSettingItemClick = (settingItem) => async () => {
		if (settingItem.route) {
			navigate(settingItem.route);
		} else {
			if (settingItem.label === 'Help') {
				if (info.intercomOpen) {
					shutdownIntercom();
				} else {
					await launchIntercom();
					showIntercom();
				}
				setInfo((prev) => ({
					...prev,
					intercomOpen: !prev.intercomOpen,
				}));
			}
		}
		closeSettingsTooltip();
	};

	const handleLogout = () => {
		logout();
		channel.postMessage('logout');
	};

	const Content = (
		<div className={s.settingsContain}>
			{/* Mobile header (shown only on small screens via CSS) */}
			<div className={s.mobileHeader}>
				<button
					className={s.mobileIconButton}
					onClick={() => {
						closeSettingsTooltip();
					}}
					aria-label="Back"
				>
					<BackIcon />
				</button>
				<span className={s.mobileTitle}>Settings</span>
				<button
					className={s.mobileIconButton}
					onClick={() => {
						closeSettingsTooltip();
					}}
					aria-label="Close"
				>
					<CloseIcon />
				</button>
			</div>
			<header className={s.userInfo}>
				{profilePicExists ? (
					<img className={s.profileImg} src={profilePic} alt="profile" />
				) : (
					<p className={s.nameInitials}>{nameInitials}</p>
				)}
				{workspaceImage && (
					<img className={s.workspaceImage} src={workspaceImage} alt="workspaceImage" />
				)}

				<div className={s.userInfoDetails}>
					<p className={s.nameAndRole}>
						<span className={s.fullName}>{fullName}</span>{' '}
						<span className={s.role}>{isAdmin ? '(Admin)' : '(Member)'}</span>
					</p>
					<p className={s.businessName}>{businessName}</p>
				</div>
			</header>
			<div className={s.settingsPlans}>
				<div className={s.settingCurrentPlan}>
					<div className={s.settingPlanName}>{currentPlanTitle}</div>
					<div
						className={s.settingsUpgrade}
						onClick={() => {
							setInfo((prev) => ({
								...prev,
								addOnCardsModalOpen: true,
								subscriptionState: 'upgradeSubscription',
							}));
						}}
					>
						Upgrade
					</div>
				</div>
				<div className={s.settingsDivider}></div>
				<div className={s.settingsCredits}>
					<div className={s.settingsCreditsLeft}>
						<CreditsLeftSvg
							totalAiCreditLimit={currentPlan?.totalAiCreditLimit}
							totalAiCreditUsed={currentPlan?.totalAiCreditUsed}
						/>
						<span className={s.settingsCreditsTitle}>Credits</span>
					</div>
					<div
						className={s.settingsCreditsCount}
						onClick={() => {
							setInfo((prev) => ({
								...prev,
								addOnCardsModalOpen: true,
								subscriptionState: 'addOnPlans',
								selectedPeriodProp: 'One Time Purchase ',
							}));
						}}
					>
						<span className={s.settingsCreditsLeftCount}>
							{(
								currentPlan?.totalAiCreditLimit - currentPlan?.totalAiCreditUsed
							).toFixed(2)}
						</span>
						<ChevronRightThinSvg />
					</div>
				</div>
			</div>
			<div className={s.settingsItems}>
				{settingsItems.map((settingItem) => (
					<div
						onClick={handleSettingItemClick(settingItem)}
						key={settingItem.id}
						className={`${s.settingItem} ${
							settingItem.route && settingItem.route.includes(pathname)
								? s.active
								: ''
						}`}
					>
						{settingItem.icon}
						<span className={s.settingItemLabel}>{settingItem.label}</span>
					</div>
				))}
			</div>
			<div className={s.switchWorkspaceAndLogoutContainer}>
				{workspacesLoading ? (
					<div className={s.skeletonContainer}>
						<Skeleton
							width="100%"
							height={41}
							style={{
								'--highlight-color': 'gray',
								'--base-color': 'transparent',
								borderRadius: '8px',
							}}
						/>
					</div>
				) : (
					<button
						onClick={(e) => {
							e.stopPropagation();
							if (workspacesMoreThanOne) {
								setInfo((prev) => ({
									...prev,
									workspaceModalOpen: true,
								}));
								closeSettingsTooltip();
							} else {
								navigate('/create-workspace');
								closeSettingsTooltip();
							}
						}}
						className={s.switchWorkspaceButton}
					>
						{workspacesMoreThanOne ? (
							<>
								<SwitchWorkspaceSvg />
								<span>Switch Workspace </span>
							</>
						) : (
							<>
								<PlusSvg />
								<span>Create Workspace</span>
							</>
						)}
					</button>
				)}
				<button
					className={s.logoutButton}
					onClick={handleLogout}
					style={{
						opacity: info.logoutLoading ? 0.5 : 1,
						cursor: info.logoutLoading ? 'not-allowed' : 'pointer',
					}}
					disabled={info.logoutLoading}
				>
					<LogoutSvg />
				</button>
			</div>

			{!info?.isDesktop && (
				<button className={s.downloadMacAppButton} onClick={handleInstallOrOpen}>
					{isMac ? (
						<>
							<DownloadMacSvg />
							<span>Download Mac App</span>
						</>
					) : (
						<>
							<DownloadWindowsSvg />
							<span>Download Windows App</span>
						</>
					)}
				</button>
			)}
			{workspacesMoreThanOne && (
				<SwitchWorkspaceModal
					isOpen={info.workspaceModalOpen}
					closeWorkspaceModal={() => {
						setInfo((prev) => ({ ...prev, workspaceModalOpen: false }));
					}}
					userWorkSpaceList={userWorkSpaceList}
				/>
			)}
		</div>
	);

	return (
		<div className={s.settingsContainer}>
			{info.isMobileView && (
				<div
					className={s.mobileOverlay}
					onClick={() => {
						closeSettingsTooltip();
					}}
				/>
			)}
			{info.isMobileView ? <div className={s.mobileSheet}>{Content}</div> : Content}
			<AddOnCards
				isOpen={info?.addOnCardsModalOpen}
				closeModal={() => setInfo((prev) => ({ ...prev, addOnCardsModalOpen: false }))}
				subscriptionState={info?.subscriptionState}
				selectedPeriodProp={info?.selectedPeriodProp}
			/>
		</div>
	);
};

export default Settings;
