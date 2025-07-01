import React from 'react';
import { Tooltip } from 'antd';
import CheckBoxFilterDropdown from '../../dropDown/notes/database/CheckBoxFilterDropdown';

const inlineStyle = {
	cursor: 'pointer',
};

const CheckBoxFilter = ({ value, title, onChange }) => {
	return (
		<Tooltip
			title={<CheckBoxFilterDropdown value={value} title={title} onChange={onChange} />}
			placement="bottomLeft"
			overlayClassName="checkbox-dropdown"
			color="transparent"
			trigger={['click']}
		>
			<div className="filter-wrapper" style={inlineStyle}>
				{value ? 'Checked' : 'Unchecked'}
			</div>
		</Tooltip>
	);
};

export default CheckBoxFilter;
