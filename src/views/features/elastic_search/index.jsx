import { memo, useContext, useRef, useState } from 'react';
import '../../../assets/scss/elastic_search/index.scss';
import { ReactComponent as SearchIcon } from '../../../assets/svg/elastic_search/search-icon.svg';
import { ReactComponent as DownArrowIcon } from '../../../assets/svg/elastic_search/down-arrow-icon.svg';
import { ReactComponent as CrossIcon } from '../../../assets/svg/elastic_search/cross-icon.svg';
import Context from '../../../context/context';
import Spinner from '../../components/loaders/Spinner';
import { message } from 'antd';
import ElasticSearchResults from '../../components/elastic_search/ElasticSearchResults';

// const filters = [
// 	{
// 		id: 1,
// 		label: 'Integration',
// 	},
// 	{
// 		id: 2,
// 		label: 'Module',
// 	},
// 	{
// 		id: 3,
// 		label: 'Assistance',
// 	},
// 	{
// 		id: 4,
// 		label: 'Date',
// 	},
// ];

const cssstyle = {
	position: 'absolute',
	top: 12,
	right: 16,
};

const ElasticSearch = () => {
	const elasticSearchTimeoutRef = useRef(null);

	const {
		elasticSearch: { elasticSearchResults, performElasticSearch },
	} = useContext(Context);

	const [info, setInfo] = useState({
		elasticSearchLoading: false,
		showElasticSearchResults: false,
	});

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
		}, 500);
	};

	return (
		<div className="ElasticSearchContainer">
			<h1 className="title">Search</h1>
			<div className="searchContainer">
				<SearchIcon />
				<input
					type="text"
					className="searchInput"
					placeholder="Search any file or documents"
					autoFocus
					onChange={handleSearch}
				/>
				{info?.elasticSearchLoading && (
					<Spinner width={'16px'} height={'16px'} cssstyle={cssstyle} />
				)}
			</div>
			{/* <div className="filtersContainer">
				<div className="filters">
					{filters.map((filter) => (
						<button className="filter" key={filter.id}>
							<p className="filterLabel">{filter.label}</p>
							<DownArrowIcon />
						</button>
					))}
				</div>
				<div className="filters">
					<button className="resetFilters">
						<CrossIcon />
						<p className="filterLabel">Reset Filters</p>
					</button>
				</div>
			</div> */}
			<div
				className={`elasticSearchResultsContainer ${noResults ? 'noResultsContainer' : ''}`}
			>
				{noResults ? (
					<p className="noResults">No results found</p>
				) : (
					info?.showElasticSearchResults && <ElasticSearchResults />
				)}
			</div>
		</div>
	);
};

export default memo(ElasticSearch);
