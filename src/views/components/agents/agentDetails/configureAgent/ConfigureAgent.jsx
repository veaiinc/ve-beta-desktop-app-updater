import { memo, useState } from 'react';
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
	const [info, setInfo] = useState({
		activeNavItem: 1,
	});

	return (
		<div className={s.container}>
			<nav>
				<ol>
					{navItems.map((item) => (
						<li
							className={`${s.navItem} ${
								item.id === info.activeNavItem ? s.active : ''
							}`}
							key={item.id}
							onClick={() => setInfo((prev) => ({ ...prev, activeNavItem: item.id }))}
							role="button"
							tabIndex={0}
						>
							{item.label}
						</li>
					))}
				</ol>
			</nav>
		</div>
	);
};

export default memo(ConfigureAgent);
