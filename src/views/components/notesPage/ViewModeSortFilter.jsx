import { memo, useState } from 'react';
import '../../../assets/scss/notesPage/notesPage.scss';

// Icons
import CardsViewIcon from '../../../assets/svg/notesPage/CardsViewIcon';
import ListViewIcon from '../../../assets/svg/notesPage/ListViewIcon';
import SortIcon from '../../../assets/svg/notesPage/SortIcon';
import FilterIcon from '../../../assets/svg/notesPage/FilterIcon';
import SortAndFilterTooltip from './SortAndFilterTooltip';

const ViewModeSortFilter = ({ viewMode, setViewMode, setSelectedFilter, setSelectedSort }) => {
	const [info, setInfo] = useState({
		sort: { label: 'Recently Updated', value: 'updatedAt' },
		filter: { label: 'All', value: 'all' },
		sortTooltipOpen: false,
		filterTooltipOpen: false,
	});

	return (
		<div className="ctaContainer">
			<div className="viewModeAndFilters">
				<div className="viewMode">
					<button
						onClick={() => setViewMode('cards')}
						aria-label="Switch to card view"
						className={`viewModeIcon ${viewMode === 'cards' ? 'active' : ''}`}
					>
						<CardsViewIcon active={viewMode === 'cards'} />
					</button>
					{/* <button
						onClick={() => setViewMode('list')}
						aria-label="Switch to list view"
						className={`viewModeIcon ${viewMode === 'list' ? 'active' : ''}`}
					>
						<ListViewIcon active={viewMode === 'list'} />
					</button> */}
				</div>
				<div className="sortContainer">
					<SortAndFilterTooltip
						type="sort"
						tooltipOpen={info.sortTooltipOpen}
						selectedOption={info.sort}
						handleOptionClick={({ type, value }) => {
							setInfo((prev) => ({
								...prev,
								[type]: value,
								sortTooltipOpen: !prev.sortTooltipOpen,
							}));
							setSelectedSort(value);
						}}
					>
						<button aria-label="Sort" className="sortIcon">
							<SortIcon />
						</button>
					</SortAndFilterTooltip>
				</div>
				<div className="notesFilterContainer">
					<SortAndFilterTooltip
						type="filter"
						tooltipOpen={info.filterTooltipOpen}
						selectedOption={info.filter}
						handleOptionClick={({ type, value }) => {
							setInfo((prev) => ({
								...prev,
								[type]: value,
								filterTooltipOpen: !prev.filterTooltipOpen,
							}));
							setSelectedFilter(value);
						}}
					>
						<button aria-label="Filter" className="filterIcon">
							<FilterIcon />
						</button>
					</SortAndFilterTooltip>
				</div>
			</div>
			<div className="sortAndFilterInfo">
				<span className="sortInfo">Sort By: {info.sort.label}</span>
				<span className="filterInfo">Filter: {info.filter.label}</span>
			</div>
		</div>
	);
};

export default memo(ViewModeSortFilter);
