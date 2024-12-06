import React, { useState } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import DropDown from '../../dropDown/tasks/DropDown';

const Select = ({ title, value, options = [], multi = false, showLabel = false }) => {
	const [info, setInfo] = useState({
		isDropdownOpen: false,
	});

	const updateSelectInfo = (key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, isDropdownOpen: !prevInfo.isDropdownOpen }));
	};
	return (
		<div className="listItem-select">
			<DropDown
				open={info?.isDropdownOpen}
				options={options}
				closeDropDown={() => updateSelectInfo('isDropdownOpen', false)}
			>
				<span className={`selectContainer ${showLabel ? `listItem-border` : ``}`}>
					<span className="listItem-label">{value}</span>
				</span>
			</DropDown>
		</div>
	);
};

export default Select;
