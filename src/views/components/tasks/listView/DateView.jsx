import moment from 'moment';
import { ReactComponent as DateIcon } from '../../../../assets/svg/tasks/date.svg';

const Date = ({ value, format, timestamp = false, title }) => {
	return (
		<div className={`date ${!timestamp ? 'dateBorder' : ''}`} title={title}>
			{!timestamp ? <DateIcon /> : ''}
			{moment(value).format(format)}
		</div>
	);
};

export default Date;
