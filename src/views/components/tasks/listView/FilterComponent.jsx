import React from 'react';
import { ReactComponent as DownArrow } from '../../../../assets/svg/tasks/downArrow.svg';
import '../../../../assets/scss/tasks/filterComponent.scss';
const FilterComponent = ({ Icon, title, value }) => {
	return (
		<div className="filterComponent">
			<Icon className="filterComponent-icon" />
			<span className="filterComponent-title">{title}</span>
			{value && <span className="filterComponent-value"> : {value}</span>}
			<DownArrow />
		</div>
	);
};

export default FilterComponent;
