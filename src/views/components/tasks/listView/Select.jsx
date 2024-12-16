import React, { memo } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import DropDown from '../../dropDown/tasks/DropDown';

const Select = ({ title, value, options = [], showLabel = false, onOptionClick }) => {
	return (
		<div className="listItem-select" title={title}>
			<DropDown options={options} onOptionClick={onOptionClick}>
				<span className={`selectContainer ${showLabel ? `listItem-border` : ``}`}>
					<span className="listItem-label">{value}</span>
				</span>
			</DropDown>
		</div>
	);
};

export default memo(Select);
