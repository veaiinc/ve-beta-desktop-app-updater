import { memo, useState, useEffect, useRef } from 'react';
import '../../../assets/scss/notesPage/notesPage.scss';

// Icons
import CardsViewIcon from '../../../assets/svg/notesPage/CardsViewIcon';
import ListViewIcon from '../../../assets/svg/notesPage/ListViewIcon';
import SortIcon from '../../../assets/svg/notesPage/SortIcon';
import FilterIcon from '../../../assets/svg/notesPage/FilterIcon';
import SortAndFilterTooltip from './SortAndFilterTooltip';
import { ReactComponent as Search } from '../../../assets/svg/search.svg';
import Spinner from '../loaders/Spinner';

const ViewModeSortFilter = ({
	viewMode,
	setViewMode,
	setSelectedFilter,
	setSelectedSort,
	setSearchQuery,
	loading,
}) => {
	const [info, setInfo] = useState({
		sort: { label: 'Recently Updated', value: 'updatedAt' },
		filter: { label: 'All', value: 'all' },
		sortTooltipOpen: false,
		filterTooltipOpen: false,
		searchQuery: '',
		searchLoading: false,
	});

	const debounceTimeout = useRef();
	const searchLoading = loading && info?.searchQuery?.length > 0;

	useEffect(() => {
		if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
		debounceTimeout.current = setTimeout(() => {
			setSearchQuery(info.searchQuery);
		}, 1000);
		return () => clearTimeout(debounceTimeout.current);
	}, [info.searchQuery, setSearchQuery]);

	return (
		<div className="ctaContainer">
			<div className="viewModeAndFilters">
				<div className="viewMode">
					<button
						onClick={() => setViewMode('list')}
						aria-label="Switch to list view"
						className={`viewModeIcon ${viewMode === 'list' ? 'active' : ''}`}
					>
						<ListViewIcon active={viewMode === 'list'} />
					</button>
					<button
						onClick={() => setViewMode('cards')}
						aria-label="Switch to card view"
						className={`viewModeIcon ${viewMode === 'cards' ? 'active' : ''}`}
					>
						<CardsViewIcon active={viewMode === 'cards'} />
					</button>
				</div>
				<div className="sortContainer">
					<SortAndFilterTooltip
						type="sort"
						tooltipOpen={info.sortTooltipOpen}
						toggleTooltipOpen={() =>
							setInfo((prev) => ({
								...prev,
								sortTooltipOpen: !prev.sortTooltipOpen,
							}))
						}
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
						toggleTooltipOpen={() =>
							setInfo((prev) => ({
								...prev,
								filterTooltipOpen: !prev.filterTooltipOpen,
							}))
						}
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

				<div className="filter-container-search">
					<Search width={16} height={16} />
					<input
						type="text"
						placeholder="Search"
						value={info.searchQuery}
						onChange={(e) => {
							setInfo({ ...info, searchQuery: e.target.value });
						}}
						className="search-input"
					/>
					{searchLoading && (
						<div className="search-spinner">
							<Spinner
								size="small"
								width={16}
								height={16}
								borderWidth={1.5}
								color="var(--primary-button)"
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(ViewModeSortFilter);
