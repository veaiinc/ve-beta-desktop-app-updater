import moment from 'moment';
import '../../../../assets/scss/tasks/listItems.scss';
import { ReactComponent as DateIcon } from '../../../../assets/svg/tasks/date.svg';

const Date = ({ value, format = 'MMM DD', timestamp = false, title = '' }) => {
	return (
		<div className={`listItem-date ${!timestamp ? 'listItem-dateBorder' : ''}`} title={title}>
			{!timestamp ? <DateIcon /> : ''}
			{moment.unix(value).format(format)}
		</div>
	);
};

export default Date;
