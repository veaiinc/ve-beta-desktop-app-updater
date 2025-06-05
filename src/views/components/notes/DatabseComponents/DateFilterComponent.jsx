import { Tooltip } from 'antd';
import moment from 'moment';
import DateFilterDropdown from '../../dropDown/notes/database/DateFilterDropdown';

const inlineStyle = {
	fontSize: '12px',
	fontWeight: '500',
	color: 'var(--primary-font)',
	cursor: 'pointer',
};

const DateFilterComponent = ({ value, onChange, title }) => {
	const dateValue = value?.date ? moment.unix(value.date).format('MMM DD, YYYY') : null;
	const displayText = value
		? `${value.dateType === 'startDate' ? 'Start: ' : 'End: '}${dateValue}`
		: 'Select Date';

	return (
		<Tooltip
			title={<DateFilterDropdown selected={value} onChange={onChange} title={title} />}
			placement="bottomLeft"
			overlayClassName="status-dropdown"
			color="transparent"
			trigger={['click']}
			destroyOnHide={true}
		>
			<div style={inlineStyle}>{displayText}</div>
		</Tooltip>
	);
};

export default DateFilterComponent;
