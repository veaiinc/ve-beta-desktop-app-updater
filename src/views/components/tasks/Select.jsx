import React, { useState } from 'react';
import DropDown from '../dropDown/tasks/DropDown';

const Select = ({ title, value, options = [], multi = false, showLabel = false }) => {
	const [info, setInfo] = useState({
		isDropdownOpen: false,
	});

	const updateSelectInfo = (key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, isDropdownOpen: !prevInfo.isDropdownOpen }));
	};
	return (
		<div className="select">
			<DropDown
				open={info?.isDropdownOpen}
				options={options}
				closeDropDown={() => updateSelectInfo('isDropdownOpen', false)}
			>
				<span
					onClick={() => updateSelectInfo('isDropdownOpen', !info?.isDropdownOpen)}
					className={`selectContainer ${showLabel ? `listItemBorder` : ``}`}
				>
					<span className="text">{value}</span>
				</span>
			</DropDown>
		</div>
	);
};

export default Select;
