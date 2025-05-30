import { memo } from 'react';
import s from './configureAgent.module.scss';

const navItems = [
	{
		id: 1,
		label: 'Instructions',
		value: 'instructions',
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

const ConfigureAgent = () => {
	return (
		<div>
			<nav>
				<ol>
					{navItems.map((item) => (
						<li key={item.id}>{item.label}</li>
					))}
				</ol>
			</nav>
		</div>
	);
};

export default memo(ConfigureAgent);
