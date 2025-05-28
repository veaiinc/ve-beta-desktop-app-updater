import { memo } from 'react';

const TabNavigation = ({ tab, handleSetTab, isVisible }) => {
	const tabs = ['Home', 'Mission', 'For Enterprise'];
	// ${isVisible ? 'slide-in' : 'slide-out'}
	return (
		<ul className={`tabNavigation`}>
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
