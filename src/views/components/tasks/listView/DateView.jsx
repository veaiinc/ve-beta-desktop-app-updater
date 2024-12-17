import moment from 'moment';
import '../../../../assets/scss/tasks/listItems.scss';
import DropDown from '../../dropDown/tasks/DropDown';
import { Tooltip } from 'antd';
import { memo, useState } from 'react';

const Date = ({
	value,
	format = 'MMM DD',
	timestamp = false,
	title = '',
	customListItemStyle = {},
	onOptionClick,
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

	return !timestamp ? (
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
					<Tooltip title={title} placement="bottom">
						<div className={`listItem-date`} style={customListItemStyle}>
							{value ? moment.unix(value).format(format) : 'Not selected'}
						</div>
					</Tooltip>
				</DropDown>
			)}
		</div>
	) : (
		<Tooltip title={title} placement="bottom">
			<div className={`listItem-date`} style={customListItemStyle}>
				{value ? moment.unix(value).format(format) : 'No data'}
			</div>
		</Tooltip>
	);
};

export default memo(Date);
