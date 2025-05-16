import { memo } from 'react';
import DateView from '../../tasks/listView/DateView';
import '../../../../assets/scss/dropdown/tasks/dateViewDropdown.scss';

const DateViewDropdown = ({ title, onOptionClick, value }) => {
	return (
		<div className="date-view-dropdown">
			<div className="title">{title}</div>
			<DateView
				placement="bottomRight"
				onOptionClick={onOptionClick}
				value={value}
				hideRemove={true}
			/>
		</div>
	);
};

export default memo(DateViewDropdown);
