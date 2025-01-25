import React, { memo, useCallback, useEffect } from 'react';
import '../../../../assets/scss/dropdown/tasks/tabDropDown.scss';

const TabDropDown = ({ options = [], onOptionClick }) => {
	const handleOptionClick = useCallback(
		(e, option) => {
			e.preventDefault();
			e.stopPropagation();
			onOptionClick?.(option);
		},
		[onOptionClick],
	);

	return (
		<div
			className="tab-dropdown-content"
			onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling
		>
			{options.map((option) => (
				<div
					key={option.value}
					className="dropdown-item"
					onClick={(e) => handleOptionClick(e, option)}
				>
					{option?.icon}
					{option.label}
				</div>
			))}
		</div>
	);
};

export default memo(TabDropDown);
