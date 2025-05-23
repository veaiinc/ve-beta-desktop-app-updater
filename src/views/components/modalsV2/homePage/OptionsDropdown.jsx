import React, { memo } from 'react';
import '../../../../assets/scss/home_page/modals/optionsDropdown.scss';
import { ReactComponent as TickSvg } from '../../../../assets/svg/tick.svg';
import { Tooltip } from 'antd';

const OptionsDropdown = ({
	options = [],
	value = '',
	children,
	onOptionClick = null,
	questionIndex = null,
}) => {
	return (
		<Tooltip
			trigger={'click'}
			rootClassName="options-dropdown-tooltip"
			placement="bottomRight"
			arrow={false}
			color="transparent"
			title={
				<div className="dropdown-options-container">
					<div className="options-container">
						{options?.map((option, index) => {
							return (
								<div
									key={index}
									className="option"
									onClick={() => onOptionClick?.(questionIndex, option)}
								>
									<div className="text-container">{option || ''}</div>
									{value === option && <TickSvg />}
								</div>
							);
						})}
					</div>
				</div>
			}
		>
			{children}
		</Tooltip>
	);
};

export default memo(OptionsDropdown);
