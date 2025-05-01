import { memo } from 'react';

const TabNavigation = ({ tab, handleSetTab, isVisible }) => {
	const tabs = ['Home', 'Mission', 'For Enterprise'];

	return (
		<ul className={`tabNavigation ${isVisible ? 'slide-in' : 'slide-out'}`}>
			{tabs.map((label, index) => (
				<li
					className={index === tab ? 'active' : ''}
					onClick={() => {
						handleSetTab(index);
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
