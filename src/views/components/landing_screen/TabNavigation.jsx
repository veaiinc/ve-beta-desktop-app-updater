import { memo } from 'react';

const TabNavigation = ({ tab, setTab, isVisible, handleCloseSidebar }) => {
	const tabs = ['Home', 'Mission', 'For Investors', 'For Enterprise'];

	return (
		<ul className={`tabNavigation ${isVisible ? 'slide-in' : 'slide-out'}`}>
			{tabs.map((label, index) => (
				<li
					className={index === tab ? 'active' : ''}
					onClick={() => {
						setTab(index);
						handleCloseSidebar();
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
