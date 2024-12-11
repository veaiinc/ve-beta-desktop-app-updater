import moment from 'moment';
import '../../../../assets/scss/tasks/listItems.scss';
import { ReactComponent as DateIcon } from '../../../../assets/svg/tasks/date.svg';
import DropDown from '../../dropDown/tasks/DropDown';

const Date = ({
	value,
	format = 'MMM DD',
	timestamp = false,
	title = '',
	customListItemStyle = {},
	showDropDown = true,
}) => {
	const info = {
		dateOptions: [
			{ label: 'Remove date', value: null },
			{ label: 'Custom', value: 'custom' },
			{ label: 'Tomorrow', value: moment().add(1, 'days').unix() },
			{ label: 'End of the week', value: moment().isoWeekday(7).unix() }, // End of the week (Sunday)
			{ label: 'In one week', value: moment().add(1, 'weeks').unix() },
		],
	};
	const onOptionClick = (value) => {
		console.log(value);
	};
	return showDropDown ? (
		<DropDown
			title={'Change due date'}
			options={info?.dateOptions}
			onOptionClick={onOptionClick}
			selected={info?.dueDate}
			valueSelector="value"
		>
			<div
				className={`listItem-date ${!timestamp ? 'listItem-dateBorder' : ''}`}
				title={title}
				style={customListItemStyle}
			>
				{!timestamp ? <DateIcon /> : ''}
				{moment.unix(value).format(format)}
			</div>
		</DropDown>
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
