import { memo, useMemo, useState, useEffect } from 'react';
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

const ConfigureAgent = ({ agentId }) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const configParam = searchParams.get('config');
	const initialNavItem = navItems.find((item) => item.value === configParam)?.id || 1;

	const [info, setInfo] = useState({
		activeNavItem: initialNavItem,
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
			1: <PromptTab />,
			2: <KnowledgeBaseTab agentId={agentId} />,
			3: <TriggersTab />,
			4: <ToolsTab agentId={agentId} />,
		};
	}, [agentId]);

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
			<div className={s.contentContainer}>{componentMapper[info.activeNavItem]}</div>
		</div>
	);
};

export default memo(ConfigureAgent);
