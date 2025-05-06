import { memo } from 'react';
import '../../../../assets/scss/dropdown/tasks/textFilter.scss';

const TextFilter = () => {
	return (
		<div className="filter-dropdown-text-filter">
			<div className="filter-dropdown-text-filter-title">Title</div>
			<input className="filter-dropdown-text-filter-input" placeholder="Add Filter" />
		</div>
	);
};

export default memo(TextFilter);
