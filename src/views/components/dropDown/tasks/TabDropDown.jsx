import React from 'react';
import '../../../../assets/scss/dropdown/tasks/tabDropDown.scss';

const TabDropDown = ({ options = [], onOptionClick }) => {
	const handleOptionClick = (option) => {
		onOptionClick?.(option);
	};

	return (
		<div className="tab-dropdown-content">
			{options.map((option) => (
				<div
					key={option.value}
					className="dropdown-item"
					onClick={() => handleOptionClick(option)}
				>
					{option.label}
				</div>
			))}
		</div>
	);
};

export default TabDropDown;
