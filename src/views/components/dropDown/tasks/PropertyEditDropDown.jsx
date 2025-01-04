import { Tooltip } from 'antd';
import React, { memo } from 'react';

const PropertyEditDropDown = ({ children }) => {
	return (
		<Tooltip
			title={<div className="property-edit-dropdown-wrapper">Edit Property</div>}
			trigger="click"
			placement="bottomRight"
			overlayClassName="property-edit-dropdown-container"
			color="transparent"
		>
			{children}
		</Tooltip>
	);
};

export default memo(PropertyEditDropDown);
