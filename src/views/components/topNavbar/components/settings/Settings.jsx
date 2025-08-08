import { useContext, useState, useEffect } from 'react';
import s from './settings.module.scss';
import Context from '../../../../../context/context';
import { useLocation, useNavigate } from 'react-router-dom';
import logout from '../../../../../helpers/logout';
import SwitchWorkspaceModal from '../switchWorkspaceModal/SwitchWorkspaceModal';
import { Tooltip } from 'antd';
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
import { ReactComponent as TemplatesSvg } from '../../assets/templates.svg';
import useIntercom from '../../../../../hooks/useIntercom';
import useBroadcastChannel from '../../../../../hooks/useBroadcastChannel';

const desktopAppDownloadUrl = import.meta.env.VITE_APP_DESKTOP_APP_DOWNLOAD_URL || null;
const isMac =
	navigator.userAgentData?.platform === 'macOS' ||
	navigator.userAgent.toLowerCase().indexOf('mac') !== -1;

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
		label: 'AI Setup',
		icon: <AISetupSvg />,
		route: '/settings/ai-setup',
		value: 'ai-setup',
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
	const { shutdownIntercom, showIntercom } = useIntercom();
	const channel = useBroadcastChannel();
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		workspaceModalOpen: false,
		intercomOpen: false,
	});

	const {
		profileInfo: { tenantUserAccessControls, userWorkSpaceList },
	} = useContext(Context);

	const fullName = `${firstName ?? ''} ${lastName ?? ''}`;
	const isAdmin = tenantUserAccessControls?.role === 'admin';
	const workspacesMoreThanOne = userWorkSpaceList?.length > 1;

	useEffect(() => {
		if (info.intercomOpen) {
			openIntercom();
		} else {
			shutdownIntercom();
		}
	}, [info.intercomOpen]);

	const openIntercom = async () => {
		showIntercom();
	};

	return (
		<div className={s.settingsContainer}>
			<header className={s.userInfo}>
				{profilePicExists ? (
					<img className={s.profileImg} src={profilePic} alt="profile" />
				) : (
					<p className={s.nameInitials}>{nameInitials}</p>
				)}
				<div className={s.userInfoDetails}>
					<p className={s.nameAndRole}>
						<span className={s.fullName}>{fullName}</span>{' '}
						<span className={s.role}>{isAdmin ? '(Admin)' : '(Member)'}</span>
					</p>
					<p className={s.businessName}>{businessName}</p>
				</div>
				<Tooltip
					open={info.switchWorkspaceTooltipOpen}
					title={
						<div className={s.switchWorkspaceTooltip}>
							<span>Switch Workspace</span>
						</div>
					}
					placement="bottom"
					arrow={false}
					color="transparent"
				>
					<button
						className={s.switchWorkspaceButton}
						onClick={(e) => {
							e.stopPropagation();
							setInfo((prev) => ({
								...prev,
								workspaceModalOpen: true,
							}));
							closeSettingsTooltip();
						}}
					>
						<SwitchWorkspaceSvg />
					</button>
				</Tooltip>
			</header>
			<div className={s.settingsItems}>
				{settingsItems.map((settingItem) => (
					<div
						onClick={() => {
							if (settingItem.route) {
								navigate(settingItem.route);
							} else {
								setInfo((prev) => ({
									...prev,
									intercomOpen: !prev.intercomOpen,
								}));
							}
							closeSettingsTooltip();
						}}
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
			<button
				className={s.logoutButton}
				onClick={() => {
					logout();
					channel.postMessage('reload');
				}}
			>
				<LogoutSvg />
				<span>Logout</span>
			</button>
			{isMac && (
				<button
					className={s.downloadMacAppButton}
					onClick={() => {
						if (desktopAppDownloadUrl) {
							window.open(desktopAppDownloadUrl, '_blank');
						}
					}}
				>
					<DownloadMacSvg />
					<span>Download Mac app</span>
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
};

export default Settings;
