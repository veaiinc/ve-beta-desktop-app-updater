import { memo, useCallback, useState } from 'react';
import moment from 'moment';
import '../../../../assets/scss/tasks/listItems.scss';
import DropDown from '../../dropDown/tasks/DropDown';
import { DatePicker, Tooltip } from 'antd';
// import { ReactComponent as CalendarIcon } from '../../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as CalendarIcon } from '../../../../assets/svg/tasks/calender.svg';
const DateView = ({
	value,
	format = 'MMM DD',
	timestamp = false,
	title = '',
	className = '',
	customListItemStyle = {},
	onOptionClick,
	showIcon = false,
	showTime = false,
	showTitle = false,
	placement = 'bottom',
	hideRemove = false,
	disabled = false,
}) => {
	const [info, setInfo] = useState({
		showDatePicker: false,
		dateOptions: [
			{ label: 'Remove date', value: null },
			{ label: 'Custom', value: 'custom' },
			{ label: 'Today', value: moment().endOf('day').unix() },
			{ label: 'Tomorrow', value: moment().add(1, 'days').endOf('day').unix() },
			{ label: 'End of the week', value: moment().endOf('week').unix() },
			{ label: 'In one week', value: moment().add(1, 'weeks').endOf('day').unix() },
		],
		daterPickerOpen: false,
	});

	const updatedOnOptionClick = useCallback(
		(value) => {
			if (value === 'custom') {
				setInfo((prevInfo) => ({
					...prevInfo,
					showDatePicker: true,
					daterPickerOpen: true,
				}));
			} else {
				onOptionClick(value);
			}
		},
		[onOptionClick],
	);

	return !timestamp ? (
		<div onClick={(e) => e.stopPropagation()} className={className}>
			{info?.showDatePicker ? (
				<div className="listItem-datePicker-wrapper">
					<DatePicker
						className="dateView-datePicker"
						// ghost
						format={format}
						allowClear
						showTime={showTime}
						open={info?.daterPickerOpen}
						onOpenChange={(open) => {
							if (!open) {
								setInfo((prevInfo) => ({
									...prevInfo,
									showDatePicker: false,
									daterPickerOpen: false,
								}));
							}
						}}
						onChange={({ $d }) => {
							setInfo((prevInfo) => ({ ...prevInfo, showDatePicker: false }));
							onOptionClick($d ? moment($d).endOf('day').unix() : null);
						}}
						placeholder={title ? `Select ${title}` : 'Select date'}
					/>
				</div>
			) : (
				<DropDown
					title={`Change ${title ? title : 'date'}`}
					options={info?.dateOptions?.filter(
						(item) => !((!value || hideRemove) && item?.value === null),
					)}
					onOptionClick={updatedOnOptionClick}
					selected={info?.dueDate}
					valueSelector="value"
					placement={placement}
				>
					<Tooltip
						title={showTitle && <div className="tooltip-inner">{title}</div>}
						classNames={{ root: 'tooltip-overlay-container' }}
						color="transparent"
					>
						<div className={`listItem-date ${className}`} style={customListItemStyle}>
							{showIcon && <CalendarIcon width={16} height={16} />}
							{value
								? moment.unix(value).format(format)
								: showIcon
								? ''
								: 'Not selected'}
						</div>
					</Tooltip>
				</DropDown>
			)}
		</div>
	) : (
		<Tooltip
			title={showTitle ? <div className="tooltip-inner">{title}</div> : ''}
			placement="bottom"
			classNames={{ root: 'tooltip-overlay-container' }}
			color="transparent"
		>
			<div
				className={`listItem-date ${timestamp && !value ? 'disabled' : ''}`}
				style={customListItemStyle}
			>
				{value ? moment.unix(value).format(format) : 'No data'}
			</div>
		</Tooltip>
	);
};

export default memo(DateView);
