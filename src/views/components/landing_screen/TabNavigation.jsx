import { Tooltip } from 'antd';
import { memo } from 'react';
import ProactiveDropdown from './ProactiveDropdown';
import { ReactComponent as CaretDown } from '../../../assets/svg/CaretDownSecondary.svg';

const tabs = ['Home', 'Manifesto', 'For Enterprise'];

const TabNavigation = ({ tab, handleSetTab, isVisible }) => {
	// const handleProactiveDropdownHover = (isHovered) => {
	// 	if (isHovered) {
	// 		document.body.classList.add('proactive-dropdown-open');
	// 	} else {
	// 		document.body.classList.remove('proactive-dropdown-open');
	// 	}
	// };

	// ${isVisible ? 'slide-in' : 'slide-out'}
	return (
		<ul className={`tabNavigation`}>
			{/* <Tooltip
				title={<ProactiveDropdown />}
				placement="bottom"
				trigger="hover"
				overlayClassName="proactive-tooltip"
				getPopupContainer={() => document.body}
				overlayStyle={{ width: '100%', maxWidth: '100vw' }}
				overlayInnerStyle={{ padding: '0px' }}
				arrow={false}
				onVisibleChange={handleProactiveDropdownHover}
			>
				<div className="proactiveDropdown">
					Ambient <CaretDown />
				</div>
			</Tooltip> */}
			{tabs.map((label, index) => (
				<li
					className={index === tab ? 'active' : ''}
					onClick={() => {
						handleSetTab(index);
					}}
					key={index}
				>
					<span>{label}</span>
				</li>
			))}
		</ul>
	);
};

export default memo(TabNavigation);
