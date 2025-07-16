import { memo, useState, useEffect, useRef } from 'react';
import '../../../assets/scss/notesPage/notesPage.scss';

// Icons
import CardsViewIcon from '../../../assets/svg/notesPage/CardsViewIcon';
import ListViewIcon from '../../../assets/svg/notesPage/ListViewIcon';
import SortIcon from '../../../assets/svg/notesPage/SortIcon';
import FilterIcon from '../../../assets/svg/notesPage/FilterIcon';
import SortAndFilterTooltip from './SortAndFilterTooltip';
import { ReactComponent as Search } from '../../../assets/svg/search.svg';
import { ReactComponent as CancelSvg } from '../../../assets/svg/notesPage/cancelnCircle.svg';
import Spinner from '../loaders/Spinner';
import CreateNewNote from './CreateNewNote';

const ViewModeSortFilter = ({
	viewMode,
	setViewMode,
	setSelectedFilter,
	setSelectedSort,
	setSearchQuery,
	selectedFilter,
	selectedSort,
	loading,
	isDatabase,
}) => {
	const searchRef = useRef(null);
	const [info, setInfo] = useState({
		sortTooltipOpen: false,
		filterTooltipOpen: false,
		searchQuery: '',
		searchLoading: false,
		showSearchInput: false,
	});

	const debounceTimeout = useRef();
	const searchLoading = loading && info?.searchQuery?.length > 0;

	useEffect(() => {
		if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
		debounceTimeout.current = setTimeout(() => {
			setSearchQuery(info.searchQuery);
		}, 1000);
		return () => clearTimeout(debounceTimeout.current);
	}, [info.searchQuery]);

	const handleSearchInputToggle = () => {
		setInfo((prevInfo) => ({ ...prevInfo, showSearchInput: !info?.showSearchInput }));
		if (!info?.showSearchInput && searchRef?.current) {
			searchRef?.current?.focus();
		}
	};

	return (
		<div className="ctaContainer">
			<CreateNewNote viewMode="list" isDatabase={isDatabase} />
			<div className="sortAndFilterInfo">
				{/* <span className="sortInfo">Sort By: {info.sort.label}</span>
				<span className="filterInfo">Filter: {info.filter.label}</span> */}

				<div className="filter-container-search">
					<div className="searchIcon" onClick={handleSearchInputToggle}>
						<Search width={20} height={20} />
					</div>

					<div
						className={`search-wrapper ${
							!info?.showSearchInput ? `hide-search-input` : ``
						}`}
					>
						<input
							type="text"
							placeholder="Search..."
							value={info.searchQuery}
							onChange={(e) => {
								setInfo({ ...info, searchQuery: e.target.value });
							}}
							className="search-input"
							ref={searchRef}
						/>
						<div className="search-spinner">
							{searchLoading ? (
								<Spinner
									size="small"
									width={16}
									height={16}
									borderWidth={1.5}
									color="var(--primary-button)"
								/>
							) : (
								<CancelSvg
									onClick={() =>
										setInfo({
											...info,
											searchQuery: '',
											showSearchInput: false,
										})
									}
								/>
							)}
						</div>
					</div>
				</div>
				<div className="sortFilterWrapper">
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
							selectedOption={selectedSort}
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
							selectedOption={selectedFilter}
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
			</div>
		</div>
	);
};

export default memo(ViewModeSortFilter);
