import moment from 'moment';
import '../../../../assets/scss/tasks/listItems.scss';
import { ReactComponent as DateIcon } from '../../../../assets/svg/tasks/date.svg';
import DropDown from '../../dropDown/tasks/DropDown';
import { DatePicker } from 'antd';
import { useState } from 'react';

const Date = ({
	value,
	format = 'MMM DD',
	timestamp = false,
	title = '',
	customListItemStyle = {},
	onOptionClick,
	showDropDown = true,
}) => {
	const [info, setInfo] = useState({
		showDatePicker: false,
		dateOptions: [
			{ label: 'Remove date', value: null },
			{ label: 'Custom', value: 'custom' },
			{ label: 'Tomorrow', value: moment().add(1, 'days').endOf('day').unix() },
			{ label: 'End of the week', value: moment().endOf('week').unix() },
			{ label: 'In one week', value: moment().add(1, 'weeks').endOf('day').unix() },
		],
	});

	const updatedOnOptionClick = (value) => {
		if (value === 'custom') {
			setInfo((prevInfo) => ({ ...prevInfo, showDatePicker: true }));
		} else {
			onOptionClick(value);
		}
	};

	return showDropDown ? (
		<div onClick={(e) => e.stopPropagation()}>
			{info?.showDatePicker ? (
				<input
					type="date"
					value={value ? moment.unix(value).format('YYYY-MM-DD') : ''}
					className="datePicker"
					onChange={(e) => {
						setInfo((prevInfo) => ({ ...prevInfo, showDatePicker: false }));
						onOptionClick(moment(e.target.value).unix());
					}}
				/>
			) : (
				<DropDown
					title={'Change due date'}
					options={info?.dateOptions}
					onOptionClick={updatedOnOptionClick}
					selected={info?.dueDate}
					valueSelector="value"
				>
					<div
						className={`listItem-date ${!timestamp ? 'listItem-dateBorder' : ''}`}
						title={title}
						style={customListItemStyle}
					>
						<DateIcon />
						{value ? moment.unix(value).format(format) : 'Not selected'}
					</div>
				</DropDown>
			)}
		</div>
	) : (
		<div
			className={`listItem-date ${!showDropDown ? 'listItem-timeStamps' : ''}`}
			title={title}
			style={customListItemStyle}
		>
			{moment.unix(value).format(format)}
		</div>
	);
};

export default Date;
