import { Tooltip } from 'antd';
import moment from 'moment';
import DateFilterDropdown from '../../dropDown/notes/database/DateFilterDropdown';
import {
	relativeTodayTimeFrames,
	relativeTodayTimeScopes,
} from '../../../../helpers/databaseHelpers';

const inlineStyle = {
	fontSize: '12px',
	fontWeight: '500',
	color: 'var(--primary-font)',
	cursor: 'pointer',
};

const getDisplayText = (value, showStartEnd, filterType) => {
	if (!value) return 'Select Date';

	if (filterType === 'relative_to_today') {
		return `${relativeTodayTimeScopes?.[value?.timeScope]?.label} ${
			value?.timeFrameCount !== 0 ? `${value?.timeFrameCount} ` : ``
		}${relativeTodayTimeFrames?.[value?.timeFrame]?.label}`;
	}

	if (Array.isArray(value?.date)) {
		const startDate = value?.date[0] ? moment.unix(value.date[0]).format('MMM DD, YYYY') : null;
		const endDate = value?.date[1] ? moment.unix(value.date[1]).format('MMM DD, YYYY') : null;
		if (showStartEnd) {
			return `${
				value?.dateType === 'startDate' ? 'Start: ' : 'End: '
			}${startDate} → ${endDate}`;
		} else {
			return `${startDate} → ${endDate}`;
		}
	} else {
		const dateValue = value?.date ? moment.unix(value.date).format('MMM DD, YYYY') : null;
		if (showStartEnd) {
			return `${value?.dateType === 'startDate' ? 'Start: ' : 'End: '}${dateValue}`;
		} else {
			return dateValue;
		}
	}
};

const DateFilterComponent = ({ value, onChange, title, showStartEnd, filterType }) => {
	return (
		<Tooltip
			title={
				<DateFilterDropdown
					selected={value}
					onChange={onChange}
					title={title}
					showStartEnd={showStartEnd}
					filterType={filterType}
				/>
			}
			placement="bottomLeft"
			classNames={{ root: 'status-dropdown' }}
			color="transparent"
			trigger={['click']}
			destroyOnHide={true}
		>
			<div style={inlineStyle}>{getDisplayText(value, showStartEnd, filterType)}</div>
		</Tooltip>
	);
};

export default DateFilterComponent;
