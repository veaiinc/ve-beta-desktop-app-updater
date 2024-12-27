import React, { memo } from 'react';
import '../../../assets/scss/sales/filterCheckBox.scss';
const FilterCheckBox = ({ borderColor }) => {
	return (
		<div
			className="filterCheckBoxParentContainer"
			style={{ borderColor: borderColor ? borderColor : '' }}
		></div>
	);
};

export default memo(FilterCheckBox);
