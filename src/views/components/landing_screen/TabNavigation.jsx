import { Tooltip } from 'antd';
import { memo } from 'react';
import ProactiveDropdown from './ProactiveDropdown';

const TabNavigation = ({ tab, handleSetTab, isVisible }) => {
	const tabs = ['Home', 'Mission', 'For Enterprise', 'Pricing'];
	// ${isVisible ? 'slide-in' : 'slide-out'}
	return (
		<ul className={`tabNavigation`}>
			<Tooltip
				title={<ProactiveDropdown />}
				placement="bottom"
				trigger="hover"
				overlayClassName="proactive-tooltip"
				getPopupContainer={() => document.body}
				overlayStyle={{ width: '100%', maxWidth: '100vw' }}
			>
				<div className="proactiveDropdown">Proactive</div>
			</Tooltip>
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
