import { memo, useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import s from './configureAgent.module.scss';
import KnowledgeBaseTab from './tabs/KnowledgeBaseTab';
import ActionsTab from './tabs/ActionsTab';
import TriggersTab from './tabs/TriggersTab';
import PromptTab from './tabs/PromptTab';

const navItems = [
	{
		id: 1,
		label: 'Prompt',
		value: 'prompt',
	},
	{
		id: 2,
		label: 'Knowledge Base',
		value: 'knowledgeBase',
	},
	{
		id: 3,
		label: 'Triggers',
		value: 'trigger',
	},
	{
		id: 4,
		label: 'Actions',
		value: 'actions',
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
			setSearchParams({ config: 'instructions' });
		}
		setInfo((prev) => ({ ...prev, activeNavItem: initialNavItem }));
	}, []);

	const handleNavItemClick = (item) => {
		setInfo((prev) => ({ ...prev, activeNavItem: item.id }));
		setSearchParams({ config: item.value });
	};

	const componentMapper = useMemo(() => {
		return {
			1: <PromptTab />,
			2: <KnowledgeBaseTab agentId={agentId} />,
			3: <TriggersTab />,
			4: <ActionsTab />,
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
