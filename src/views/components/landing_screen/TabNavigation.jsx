import { memo } from 'react';

const TabNavigation = ({ tab, setTab, isVisible }) => {
	const tabs = ['Home', 'For Enterprise'];

	return (
		<ul className={`tabNavigation ${isVisible ? 'slide-in' : 'slide-out'}`}>
			{tabs.map((label, index) => (
				<li
					className={index === tab ? 'active' : ''}
					onClick={() => {
						setTab(index);
					}}
					key={index}
				>
					{label}
				</li>
			))}
		</ul>
	);
};

export default memo(TabNavigation);
