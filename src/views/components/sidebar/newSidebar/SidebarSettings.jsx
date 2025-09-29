import { memo, useCallback, useContext, useState } from 'react';
import s from '../../../../assets/scss/sidebar/sidebarSettings.module.scss';
import { ReactComponent as MyProfileSvg } from '../../../../assets/svg/sidebar/my-profile.svg';
import { ReactComponent as WorkspaceSvg } from '../../../../assets/svg/sidebar/workspace.svg';
import { ReactComponent as TeamMembersSvg } from '../../../../assets/svg/sidebar/team-members.svg';
import { ReactComponent as IntegrationsSvg } from '../../../../assets/svg/sidebar/integrations.svg';
import { ReactComponent as PlanBillingSvg } from '../../../../assets/svg/sidebar/plan-billing.svg';
import { ReactComponent as AISetupSvg } from '../../../../assets/svg/sidebar/ai-setup.svg';
import { ReactComponent as HelpSvg } from '../../../../assets/svg/sidebar/help.svg';
import { ReactComponent as TemplatesSvg } from '../../../../assets/svg/sidebar/templates.svg';
import { ReactComponent as CreateWorkspaceSvg } from '../../../../assets/svg/sidebar/createworkspace.svg';
import { ReactComponent as SwitchWorkspaceSvg } from '../../../../assets/svg/sidebar/switchworkspace.svg';
import { ReactComponent as NotificationsSvg } from '../../../../assets/svg/sidebar/notifications.svg';
import { ReactComponent as GiftSvg } from '../../../../assets/svg/sidebar/gift.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../../context/context';
import SwitchWorkspace from './SwitchWorkspace';
import ShareAndEarnModal from '../../../features/shareAndEarn/ShareAndEarnModal';

const settingsItems = [
	{
		label: 'My Profile',
		icon: <MyProfileSvg width={18} height={18} />,
		route: '/settings/my-profile',
		value: 'my-profile',
	},
	{
		label: 'Workspace',
		icon: <WorkspaceSvg width={17} height={17} />,
		route: '/settings/workspace',
		value: 'workspace',
	},
	{
		label: 'Team Members',
		icon: <TeamMembersSvg width={18} height={18} />,
		route: '/settings/team-members',
		value: 'team-members',
	},
	{
		label: 'Integrations',
		icon: <IntegrationsSvg width={18} height={18} />,
		route: '/settings/integrations',
		value: 'integrations',
	},
	{
		label: 'Plan Billing',
		icon: <PlanBillingSvg width={18} height={18} />,
		route: '/settings/plan-billing',
		value: 'plan-billing',
	},
	{
		label: 'AI Setup',
		icon: <AISetupSvg width={18} height={18} />,
		route: '/settings/ai-memory',
		value: 'ai-memory',
	},
];

const essentialsItems = [
	{
		label: 'Templates',
		icon: <TemplatesSvg width={18} height={18} />,
		route: '/playbook',
		value: 'templates',
	},
	// {
	// 	label: 'Notifications',
	// 	icon: <NotificationsSvg width={18} height={18} />,
	// 	value: 'notifications',
	// },
	{
		label: 'Share & Earn',
		icon: <GiftSvg width={18} height={18} />,
		value: 'share-and-earn',
	},
	{
		label: 'Help',
		icon: <HelpSvg width={18} height={18} />,
		route: null,
		value: 'help',
	},
];

const createWorkspace = { value: 'create-workspace', route: '/create-workspace' };

const SidebarSettings = ({ activeTab, handleTabChange, handleSidebarHoverLeave, sidebarOpen }) => {
	const {
		profileInfo: { userWorkSpaceList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		switchWorkspaceEnabled: false,
		shareAndEarnModalOpen: false,
		notificationsModalOpen: false,
	});

	const navigate = useNavigate();

	const hasMoreThanOneWorkspace = userWorkSpaceList?.length > 1;

	const handleItemClick = useCallback(
		(item) => {
			if (item?.value === activeTab) return;

			if (item?.route) {
				navigate(item?.route);
			} else {
				if (item.value === 'help') {
					// Use global Intercom instance
					if (window.Intercom) {
						window.Intercom('show');
					}
					handleTabChange(null);
					return;
				} else if (item?.value === 'share-and-earn') {
					setInfo((prev) => ({ ...prev, shareAndEarnModalOpen: true }));
					if (!sidebarOpen) {
						handleSidebarHoverLeave();
					}
					return;
				}
			}

			handleTabChange(item?.value);
		},
		[handleTabChange, activeTab, handleSidebarHoverLeave, sidebarOpen],
	);

	const handleSwitchWorkspace = useCallback(() => {
		setInfo((prev) => ({ ...prev, switchWorkspaceEnabled: !prev?.switchWorkspaceEnabled }));
	}, []);

	const handleShareAndEarnModalClose = useCallback(() => {
		setInfo((prev) => ({ ...prev, shareAndEarnModalOpen: false }));
	}, []);

	const handleNotificationsModalClose = useCallback(() => {
		setInfo((prev) => ({ ...prev, notificationsModalOpen: false }));
	}, []);

	return (
		<div className={s.container}>
			<div className={s.settings}>
				<div className={s.settingsContainer}>
					<div className={s.title}>Settings</div>
					<div className={s.settingsItemsContainer}>
						{settingsItems?.map((item, index) => (
							<div
								role="button"
								className={`${s.item} ${activeTab === item?.value ? s.active : ''}`}
								key={index}
								onClick={() => handleItemClick(item)}
							>
								<div className={s.icon}>{item?.icon}</div>
								<div className={s.label}>{item?.label}</div>
							</div>
						))}
					</div>
				</div>

				<div className={s.settingsContainer}>
					<div className={s.title}>Essentials</div>
					<div className={s.settingsItemsContainer}>
						{essentialsItems?.map((item, index) => (
							<div
								role="button"
								className={`${s.item} ${activeTab === item?.value ? s.active : ''}`}
								key={index}
								onClick={() => handleItemClick(item)}
							>
								<div className={s.icon}>{item?.icon}</div>
								<div className={s.label}>{item?.label}</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className={s.footer}>
				{hasMoreThanOneWorkspace && (
					<button className={s.workspaceBtn} onClick={handleSwitchWorkspace}>
						<SwitchWorkspaceSvg />
						Switch Workspace
					</button>
				)}

				<button
					className={`${s.workspaceBtn} ${
						activeTab === createWorkspace?.value ? s.active : ''
					}`}
					onClick={() => handleItemClick(createWorkspace)}
				>
					<CreateWorkspaceSvg />
					Create Workspace
				</button>
			</div>
			<div
				className={s.switchWorkspaceContainer}
				style={{
					display: info?.switchWorkspaceEnabled ? 'block' : 'none',
				}}
			>
				<div className={s.overlay} onClick={handleSwitchWorkspace}></div>
				<div className={s.switchWorkspaceContent}>
					<SwitchWorkspace
						workspaceList={userWorkSpaceList}
						switchWorkspaceEnabled={info?.switchWorkspaceEnabled}
					/>
				</div>
			</div>
			<ShareAndEarnModal
				isOpen={info?.shareAndEarnModalOpen}
				closeModal={handleShareAndEarnModalClose}
			/>
		</div>
	);
};

export default memo(SidebarSettings);
