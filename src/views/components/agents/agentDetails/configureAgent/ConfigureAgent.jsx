import { memo, useMemo, useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import s from './configureAgent.module.scss';

// components
import KnowledgeBaseTab from './tabs/knowledgeBaseTab/KnowledgeBaseTab';
import ToolsTab from './tabs/toolsTab/ToolsTab';
import TriggersTab from './tabs/triggersTab/TriggersTab';
import PromptTab from './tabs/promptTab/PromptTab';

import { ReactComponent as PromptIcon } from '../configureAgent/tabs/assets/NotePencil.svg';
import { ReactComponent as KnowledgeBaseIcon } from '../configureAgent/tabs/assets/PencilRuler.svg';
import { ReactComponent as TriggerIcon } from '../configureAgent/tabs/assets/BookOpenText.svg';
import { ReactComponent as ToolIcon } from '../configureAgent/tabs/assets/Lightning.svg';
import jwtDecode from 'jwt-decode';
import Context from '../../../../../context/context';

const navItems = [
	{
		id: 1,
		label: 'Prompt',
		value: 'prompt',
		icon: <PromptIcon />,
	},
	{
		id: 4,
		label: 'Tools',
		value: 'tools',
		icon: <ToolIcon />,
	},
	{
		id: 2,
		label: 'Knowledge Base',
		value: 'knowledgeBase',
		icon: <KnowledgeBaseIcon />,
	},
	{
		id: 3,
		label: 'Triggers',
		value: 'trigger',
		icon: <TriggerIcon />,
	},
];

const ConfigureAgent = ({ agentId, isTemplate }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const {
		knowledgeAgent: { activeKnowledgeAssistant },
	} = useContext(Context);

	const configParam = searchParams.get('config');
	const initialNavItem = navItems.find((item) => item.value === configParam)?.id || 1;

	const [info, setInfo] = useState({
		activeNavItem: initialNavItem,
		myAccess: 'view',
	});

	useEffect(() => {
		if (!configParam) {
			setSearchParams((prev) => {
				const updated = new URLSearchParams(prev);
				updated.set('config', 'prompt');
				return updated;
			});
		}
		setInfo((prev) => ({ ...prev, activeNavItem: initialNavItem }));
	}, []);

	useEffect(() => {
		if (activeKnowledgeAssistant) {
			const userToken = localStorage.getItem('usertoken');
			const userId = jwtDecode(userToken).user_id;
			if (isTemplate) {
				setInfo((prev) => ({ ...prev, myAccess: 'view' }));
			} else {
				const currentUser = activeKnowledgeAssistant?.data?.sharedWith?.find(
					(user) => user?.userId === userId,
				);
				const rank = { 'no-access': -1, view: 0, edit: 1, full: 2 };

				let access = currentUser?.access || 'view';
				const workspaceAccess = activeKnowledgeAssistant?.data?.workspaceUserAccess;

				if (workspaceAccess) {
					access = rank[workspaceAccess] > rank[access] ? workspaceAccess : access;
				}

				setInfo((prev) => ({ ...prev, myAccess: access }));
			}
		}
	}, [activeKnowledgeAssistant]);

	const handleNavItemClick = (item) => {
		setInfo((prev) => ({ ...prev, activeNavItem: item.id }));
		setSearchParams((prev) => {
			const updated = new URLSearchParams(prev);
			updated.set('config', item.value);
			return updated;
		});
	};

	const componentMapper = useMemo(() => {
		return {
			1: <PromptTab isTemplate={isTemplate} myAccess={info.myAccess} />,
			2: <KnowledgeBaseTab agentId={agentId} myAccess={info.myAccess} />,
			3: <TriggersTab isTemplate={isTemplate} myAccess={info.myAccess} />,
			4: <ToolsTab agentId={agentId} myAccess={info.myAccess} />,
		};
	}, [agentId, isTemplate, info.myAccess]);

	return (
		<div className={s.configureAgentContainer}>
			<nav>
				<ol>
					{navItems.map((item) => (
						<li
							className={`${s.navItem} ${
								item.id === info.activeNavItem ? s.active : ''
							}`}
							key={item.id}
							onClick={() => handleNavItemClick(item)}
							role="button"
							tabIndex={0}
						>
							{item.icon}
							{item.label}
						</li>
					))}
				</ol>
			</nav>
			{/* <div className={s.contentContainer}></div> */}
			<div className={s.contentContainer}>{componentMapper[info.activeNavItem]}</div>
		</div>
	);
};

export default memo(ConfigureAgent);
