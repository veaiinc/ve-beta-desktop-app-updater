import s from './toolsTooltip.module.scss';
import { ReactComponent as CalendarIcon } from './assets/calendar.svg';
import { ReactComponent as ContactsIcon } from './assets/contacts.svg';
import { ReactComponent as AutomationIcon } from './assets/automation.svg';
import { ReactComponent as TasksIcon } from './assets/tasks.svg';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import Context from '../../../../../context/context';

// ✅ Mapping: UI Label → Backend App Name
const toolLabelToAppName = {
	Calendar: 'calendar',
	Tasks: 'task',
	Contacts: 'contact', // ← adjust to 'contacts' if backend uses plural
	Automations: 'automation',
};

const tools = [
	{
		id: 1,
		icon: <CalendarIcon />,
		label: 'Calendar',
		description: 'Schedule events, set reminders, share availability.',
		link: '/calendar',
	},
	{
		id: 2,
		icon: <TasksIcon />,
		label: 'Tasks',
		description: 'Create to-dos, set priorities, track progress.',
		link: '/tasks',
	},
	{
		id: 3,
		icon: <ContactsIcon />,
		label: 'Contacts',
		description: 'Store info, sync across devices, quick access.',
		link: '/contacts',
	},
	{
		id: 4,
		icon: <AutomationIcon />,
		label: 'Automations',
		description: 'Trigger actions, save time, reduce manual work.',
		link: '/automations',
	},
];

const ToolsTooltip = ({ closeTooltip }) => {
	const region = localStorage.getItem('region');
	const navigate = useNavigate();
	const {
		profileInfo: { tenantUserAccessControls, getTenantUserAccessControls },
	} = useContext(Context);

	useEffect(() => {
		if (!tenantUserAccessControls) {
			getTenantUserAccessControls();
		}
	}, [tenantUserAccessControls]);

	const accessControls = tenantUserAccessControls?.accessControls;

	// Build lookup map: { [app]: isEnabled }
	const appsMap = {};
	if (Array.isArray(accessControls)) {
		accessControls.forEach((control) => {
			const appName = control.app;
			if (appName) {
				appsMap[appName] = control.isEnabled;
			}
		});
	}

	// ✅ NEW LOGIC: Only show if app is explicitly present AND enabled
	const shouldShowTool = (toolLabel) => {
		const appNames = toolLabelToAppName[toolLabel];

		// If no mapping defined → hide (defensive)
		if (!appNames) return false;

		const namesToCheck = Array.isArray(appNames) ? appNames : [appNames];

		// For arrays: show if ANY is present and enabled
		for (let name of namesToCheck) {
			if (appsMap.hasOwnProperty(name)) {
				if (appsMap[name] === true) {
					return true; // explicitly enabled → show
				}
				// if false, we don't return yet — check other variants
			}
			// if not in appsMap → skip (we’ll hide at the end)
		}

		// None found or all disabled → HIDE
		return false;
	};

	// Filter visible tools
	const visibleTools = tools.filter((tool) => shouldShowTool(tool.label));

	return (
		<div
			className={s.toolsTooltipContainer}
			style={region === 'ap-south-1' ? { left: '-76px' } : { left: '-290px' }}
		>
			{visibleTools.map((tool) => (
				<div
					key={tool.id}
					className={s.toolContainer}
					onClick={() => {
						if (tool.link) {
							navigate(tool.link);
						}
						closeTooltip();
					}}
				>
					<div className={s.toolIcon}>{tool.icon}</div>
					<div className={s.toolInfo}>
						<h3 className={s.toolLabel}>{tool.label}</h3>
						{/* <p className={s.toolDescription}>{tool.description}</p> */}
					</div>
				</div>
			))}
		</div>
	);
};

export default ToolsTooltip;
