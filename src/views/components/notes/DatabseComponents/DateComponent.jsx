import { Tooltip } from 'antd';
import { memo } from 'react';
import DateDropdown from '../../dropDown/notes/database/DateDropdown';
import moment from 'moment';
const inlineStyle = {
	fontSize: '12px',
	fontWeight: '500',
	color: 'var(--primary-font)',
	cursor: 'pointer',
};

const DateComponent = ({ value, onChange, disabled = false }) => {
	const dateValue = value?.startDate
		? `${moment.unix(value?.startDate).format('DD/MM/YYYY')}${
				value?.isEndDateEnabled
					? ` → ${moment.unix(value?.endDate).format('DD/MM/YYYY')}`
					: ''
		  }`
		: null;
	return (
		<Tooltip
			title={disabled ? null : <DateDropdown value={value} onChange={onChange} />}
			placement="bottomLeft"
			overlayClassName="status-dropdown"
			color="transparent"
			trigger={['click']}
			destroyOnHide={true}
		>
			<div style={inlineStyle}>{value ? dateValue : 'No date'}</div>
		</Tooltip>
	);
};

export default memo(DateComponent);
