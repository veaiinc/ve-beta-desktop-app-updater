import { useContext, useState } from 'react';
import '../../../assets/scss/elastic_search/index.scss';
import { ReactComponent as SearchIcon } from '../../../assets/svg/elastic_search/search-icon.svg';
import { ReactComponent as DownArrowIcon } from '../../../assets/svg/elastic_search/down-arrow-icon.svg';
import { ReactComponent as CrossIcon } from '../../../assets/svg/elastic_search/cross-icon.svg';
import Context from '../../../context/context';
import Spinner from '../../components/loaders/Spinner';
import { message } from 'antd';

const filters = [
	{
		id: 1,
		label: 'Integration',
	},
	{
		id: 2,
		label: 'Module',
	},
	{
		id: 3,
		label: 'Assistance',
	},
	{
		id: 4,
		label: 'Date',
	},
];

const cssstyle = {
	position: 'absolute',
	top: 12,
	right: 16,
};

let searchTimeoutId;

const ElasticSearch = () => {
	const {
		elasticSearch: { elasticSearchResults, performElasticSearch },
	} = useContext(Context);
	const [info, setInfo] = useState({
		searchLoading: false,
	});

	const noResults = elasticSearchResults?.length === 0;

	const handleSearch = async (e) => {
		clearTimeout(searchTimeoutId);
		searchTimeoutId = setTimeout(async () => {
			setInfo({
				searchLoading: true,
			});
			const searchInput = e.target.value;
			const response = await performElasticSearch(searchInput);
			const apiSuccess = response[0];
			if (!apiSuccess) {
				const errMsg = response[1];
				message.error(errMsg);
			}
			setInfo({
				searchLoading: false,
			});
		}, 1000);
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
				{info?.searchLoading && (
					<Spinner width={'16px'} height={'16px'} cssstyle={cssstyle} />
				)}
			</div>
			<div className="filtersContainer">
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
			</div>
			<div className="recentSearchResults"></div>
		</div>
	);
};

export default ElasticSearch;
