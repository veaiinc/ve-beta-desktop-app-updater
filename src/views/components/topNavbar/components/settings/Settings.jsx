import { useContext, useState, useEffect, memo, useMemo, useCallback } from 'react';
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
import useBroadcastChannel from '../../../../../hooks/useBroadcastChannel';
import { ReactComponent as BackIcon } from '../../../../../assets/svg/mobile/back.svg';
import { ReactComponent as CloseIcon } from '../../../../../assets/svg/mobile/close.svg';
import { ReactComponent as PlusSvg } from '../../assets/plus.svg';
import CreditsLeftSvg from '../../../sidebar/chatHistory/CreditsLeftSvg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../../assets/svg/tasks/chevronRightThin.svg';
import AddOnCards from '../../../settings/planbilling/addOnCards';

// Memoized Settings Item Component
const SettingsItem = memo(({ settingItem, isActive, onItemClick, styles }) => {
	const handleClick = useCallback(() => {
		onItemClick(settingItem);
	}, [settingItem, onItemClick]);

	const handleKeyDown = useCallback(
		(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				handleClick();
			}
		},
		[handleClick],
	);

	return (
		<div
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			tabIndex={0}
			role="button"
			aria-label={`Navigate to ${settingItem.label} settings`}
			className={`${styles.settingItem} ${isActive ? styles.active : ''}`}
		>
			{settingItem.icon}
			<span className={styles.settingItemLabel}>{settingItem.label}</span>
		</div>
	);
});

SettingsItem.displayName = 'SettingsItem';

// Memoized Settings Category Component
const SettingsCategory = memo(({ title, items, pathname, onItemClick, styles }) => (
	<>
		<div className={styles.settingsItemsTitle}>{title}</div>
		{items.map((settingItem) => (
			<SettingsItem
				key={settingItem.id}
				settingItem={settingItem}
				isActive={settingItem.route && settingItem.route.includes(pathname)}
				onItemClick={onItemClick}
				styles={styles}
			/>
		))}
	</>
));

SettingsCategory.displayName = 'SettingsCategory';

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
		category: 'account',
	},
	{
		id: 2,
		label: 'Workspace',
		icon: <WorkspaceSvg />,
		route: '/settings/workspace',
		value: 'workspace',
		category: 'workspace',
	},
	{
		id: 3,
		label: 'Team Members',
		icon: <TeamMembersSvg />,
		route: '/settings/team-members',
		value: 'team-members',
		category: 'workspace',
	},
	{
		id: 4,
		label: 'Connectors',
		icon: <IntegrationsSvg />,
		route: '/settings/integrations',
		value: 'integrations',
		category: 'account',
	},
	{
		id: 5,
		label: 'Plan Billing',
		icon: <PlanBillingSvg />,
		route: '/settings/plan-billing',
		value: 'plan-billing',
		category: 'workspace',
	},
	{
		id: 6,
		label: 'Memory',
		icon: <AISetupSvg />,
		route: '/settings/ai-memory',
		value: 'ai-memory',
		category: 'account',
	},
	{
		id: 7,
		label: 'Workspace Connectors',
		icon: <IntegrationsSvg />,
		route: '/settings/integrations?access=shared',
		value: 'integrations-shared',
		category: 'workspace',
	},
	{
		id: 8,
		label: 'Templates',
		icon: <TemplatesSvg />,
		route: '/playbook',
		category: 'workspace',
	},
	{
		id: 9,
		label: 'Help',
		icon: <HelpSvg />,
		route: null,
		category: 'workspace',
	},
];

const Settings = memo(
	({
		profilePicExists,
		nameInitials,
		profilePic,
		firstName,
		lastName,
		businessName,
		closeSettingsTooltip,
	}) => {
		const { pathname } = useLocation();
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

		// Memoize computed values to prevent unnecessary recalculations
		const fullName = useMemo(
			() => `${firstName ?? ''} ${lastName ?? ''}`,
			[firstName, lastName],
		);
		const isAdmin = useMemo(
			() => tenantUserAccessControls?.role === 'admin',
			[tenantUserAccessControls?.role],
		);
		const workspacesMoreThanOne = useMemo(
			() => userWorkSpaceList?.length > 1,
			[userWorkSpaceList?.length],
		);
		const workspacesLoading = useMemo(() => userWorkSpaceList === null, [userWorkSpaceList]);
		const workspaceImage = useMemo(
			() => tennantSettingsData?.logo_s3_500w_key ?? null,
			[tennantSettingsData?.logo_s3_500w_key],
		);

		// Memoize categorized settings items to prevent unnecessary filtering
		const categorizedSettingsItems = useMemo(() => {
			const accountItems = settingsItems.filter((item) => item.category === 'account');
			const workspaceItems = settingsItems.filter((item) => item.category === 'workspace');
			return { accountItems, workspaceItems };
		}, []);

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
		const handleSettingItemClick = useCallback(
			(settingItem) => {
				if (settingItem.route) {
					navigate(settingItem.route);
				} else {
					if (settingItem.label === 'Help') {
						// Use global Intercom instance
						if (window.Intercom) {
							if (info.intercomOpen) {
								window.Intercom('shutdown');
							} else {
								window.Intercom('show');
							}
							setInfo((prev) => ({
								...prev,
								intercomOpen: !prev.intercomOpen,
							}));
						}
					}
				}
				closeSettingsTooltip();
			},
			[navigate, info.intercomOpen, closeSettingsTooltip],
		);

		const handleLogout = useCallback(() => {
			logout();
			channel.postMessage('logout');
		}, [channel]);

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
						<img
							className={s.workspaceImage}
							src={workspaceImage}
							alt="workspaceImage"
						/>
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
					<SettingsCategory
						title="Account"
						items={categorizedSettingsItems.accountItems}
						pathname={pathname}
						onItemClick={handleSettingItemClick}
						styles={s}
					/>
					<SettingsCategory
						title="Workspace"
						items={categorizedSettingsItems.workspaceItems}
						pathname={pathname}
						onItemClick={handleSettingItemClick}
						styles={s}
					/>
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
	},
);

Settings.displayName = 'Settings';

export default Settings;
