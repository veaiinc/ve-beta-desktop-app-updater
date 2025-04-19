import '../../../assets/scss/commandKSearch/commandKSearch.scss';
import { ReactComponent as CrossSvg } from '../../../assets/svg/docs/cross.svg';
import { ReactComponent as SearchSvg } from '../../../assets/svg/elastic_search/search-icon.svg';
import { ReactComponent as ArrowUp } from '../../../assets/svg/ai_agents/arrow-up-dark.svg';
import { memo, useContext, useRef, useState } from 'react';
import Context from '../../../context/context';
import { message } from '../globalComponents/CustomToast';
import Spinner from '../loaders/Spinner';
import ElasticSearchResults from './ElasticSearchResults';
import CustomDropdown from './CustomDropdownForCommandK';

const CommandKSearch = ({ handleCloseSearchModal }) => {
	const elasticSearchTimeoutRef = useRef(null);

	const {
		elasticSearch: { elasticSearchResults, performElasticSearch },
	} = useContext(Context);

	const [info, setInfo] = useState({
		elasticSearchLoading: false,
		showElasticSearchResults: false,
	});

	const [isLoading, setIsLoading] = useState(false);

	const [selectedFilters, setSelectedFilters] = useState({
		source: null,
		collection: null,
		assistance: null,
		date: null,
	});

	const filterOptions = {
		source: [
			{ label: 'All Sources', value: 'all' },
			{ label: 'PDFs', value: 'pdf' },
			{ label: 'Images', value: 'image' },
		],
		collection: [
			{ label: 'All Collections', value: 'all' },
			{ label: 'Work', value: 'work' },
			{ label: 'Personal', value: 'personal' },
		],
		assistance: [
			{ label: 'All Assistance', value: 'all' },
			{ label: 'Templates', value: 'templates' },
		],
		date: [
			{ label: 'All Time', value: 'all' },
			{ label: 'This Week', value: 'week' },
			{ label: 'This Month', value: 'month' },
		],
	};

	const noResults = elasticSearchResults?.length === 0 && info?.showElasticSearchResults;

	const handleSearch = async (e) => {
		clearTimeout(elasticSearchTimeoutRef.current);
		const searchInput = e.target.value;
		const emptySearchInput = searchInput === '';
		if (emptySearchInput) {
			setInfo({
				elasticSearchLoading: false,
				showElasticSearchResults: false,
			});
			return;
		}
		setIsLoading(true);
		elasticSearchTimeoutRef.current = setTimeout(async () => {
			setInfo({
				elasticSearchLoading: true,
				showElasticSearchResults: false,
			});
			const response = await performElasticSearch(searchInput);
			const apiSuccess = response[0];
			if (!apiSuccess) {
				const errMsg = response[1];
				message.error(errMsg);
			}
			setInfo({
				elasticSearchLoading: false,
				showElasticSearchResults: true,
			});
			setIsLoading(false);
		}, 500);
	};

	const handleFilterChange = (filterType, selectedOption) => {
		setSelectedFilters((prev) => ({
			...prev,
			[filterType]: selectedOption,
		}));

		console.log(`${filterType} filter changed to:`, selectedOption);
	};

	const resetFilters = () => {
		setSelectedFilters({
			source: null,
			collection: null,
			assistance: null,
			date: null,
		});
		console.log('Filters reset');
	};

	return (
		<div className="command-k-search-container">
			<div className="command-k-search">
				<div className="search-header">
					<h2>Search </h2>
					<button onClick={handleCloseSearchModal}>
						<CrossSvg />
					</button>
				</div>
				<div className="search-input-container">
					<div className="search-input">
						<SearchSvg className="search-icon" />
						<input
							type="text"
							placeholder="Search any file or documents"
							onChange={handleSearch}
							autoFocus
						/>
						{isLoading && (
							<div className="spinner-wrapper">
								<Spinner
									width={'16px'}
									height={'16px'}
									color={'var(--primary-font)'}
								/>
							</div>
						)}
						<button>
							<ArrowUp className="arrow-up" />
						</button>
					</div>
				</div>
				<div className="filters-container">
					<div className="dropdown-filters">
						<CustomDropdown
							options={filterOptions.source}
							value={selectedFilters.source?.value}
							onChange={(value) => handleFilterChange('source', value)}
							placeholder="Source"
						/>
						<CustomDropdown
							options={filterOptions.collection}
							value={selectedFilters.collection?.value}
							onChange={(value) => handleFilterChange('collection', value)}
							placeholder="Collection"
						/>
						<CustomDropdown
							options={filterOptions.assistance}
							value={selectedFilters.assistance?.value}
							onChange={(value) => handleFilterChange('assistance', value)}
							placeholder="Assistance"
						/>
						<CustomDropdown
							options={filterOptions.date}
							value={selectedFilters.date?.value}
							onChange={(value) => handleFilterChange('date', value)}
							placeholder="Date"
						/>
					</div>
					<div className="reset-filter" onClick={resetFilters}>
						<p>
							Reset filter <span>&times;</span>
						</p>
					</div>
				</div>
				<div className={`search-output-container ${noResults ? 'noResultsContainer' : ''}`}>
					{noResults ? (
						<p className="noResults">No results found</p>
					) : (
						info?.showElasticSearchResults && (
							<ElasticSearchResults handleCloseSearchModal={handleCloseSearchModal} />
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(CommandKSearch);
