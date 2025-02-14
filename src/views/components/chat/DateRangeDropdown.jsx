import { memo, useCallback, useState } from 'react';
import moment from 'moment';
import '../../../assets/scss/chat/timeStamp.scss';
import DropDown from '../dropDown/tasks/DropDown';
import { DatePicker, Tooltip } from 'antd';
import { ReactComponent as ChevronSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
const DateRangeDropdown = ({
	value,
	startDate,
	endDate,
	format = 'DD MMM YY',
	timestamp = false,
	title = '',
	className = '',
	customListItemStyle = {},
	onOptionClick,
	showIcon = false,
	showTime = false,
	showTitle = false,
	resetFilters = false,
}) => {
	const { RangePicker } = DatePicker;
	const [info, setInfo] = useState({
		showDatePicker: false,
		dateOptions: [
			{
				label: 'Any time',
				value: null,
			},
			{
				label: 'Today',
				value: [moment().startOf('day'), moment().endOf('day')],
			},
			{
				label: 'Last 7 days',
				value: [moment().subtract(6, 'days').startOf('day'), moment().endOf('day')],
			},
			{
				label: 'Last 30 Days',
				value: [moment().subtract(29, 'days').startOf('day'), moment().endOf('day')],
			},
			{
				label: 'Last Year',
				value: [
					moment().subtract(1, 'year').startOf('year'),
					moment().subtract(1, 'year').endOf('year'),
				],
			},
			{ label: 'Custom', value: 'custom' },
		],
	});

	const updatedOnOptionClick = useCallback(
		(value) => {
			if (value === 'custom') {
				setInfo((prevInfo) => ({ ...prevInfo, showDatePicker: true }));
			} else {
				onOptionClick(value);
			}
		},
		[onOptionClick],
	);

	return (
		<div onClick={(e) => e.stopPropagation()} className={className}>
			{info?.showDatePicker && !resetFilters ? (
				<div>
					<RangePicker
						className="date-rangePicker"
						ghost
						format={format}
						value={value}
						allowClear
						// showTime={showTime}
						onChange={(dates) => {
							setInfo((prevInfo) => ({ ...prevInfo, showDatePicker: false }));
							const startDate = moment(
								dates?.[0]?.['$d'] ? moment(dates?.[0]?.['$d']) : null,
							);
							const endDate = moment(
								dates?.[1]?.['$d'] ? moment(dates?.[1]?.['$d']) : null,
							);
							onOptionClick([startDate, endDate]);
						}}
						placeholder={title ? `Select ${title}` : 'Select date'}
					/>
				</div>
			) : (
				<DropDown
					title={false}
					options={info?.dateOptions}
					onOptionClick={updatedOnOptionClick}
					selected={info?.dueDate}
					valueSelector="value"
				>
					<Tooltip
						title={showTitle && <div className="tooltip-inner">{title}</div>}
						placement="bottom"
						overlayClassName="tooltip-overlay-container"
						color="transparent"
					>
						<div className={`date-header ${className}`} style={customListItemStyle}>
							{startDate && endDate
								? moment(startDate).format(format) +
								  ' - ' +
								  moment(endDate).format(format)
								: 'Date'}
							<div className="chevron-icon-container">
								<ChevronSvg />
							</div>
						</div>
					</Tooltip>
				</DropDown>
			)}
		</div>
	);
};

export default memo(DateRangeDropdown);
