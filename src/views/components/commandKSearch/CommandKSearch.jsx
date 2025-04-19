import '../../../assets/scss/commandKSearch/commandKSearch.scss';
import { ReactComponent as CrossSvg } from '../../../assets/svg/docs/cross.svg';
import { ReactComponent as SearchSvg } from '../../../assets/svg/elastic_search/search-icon.svg';
import { ReactComponent as ArrowUp } from '../../../assets/svg/ai_agents/arrow-up-dark.svg';
import { memo, useContext, useRef, useState } from 'react';
import Context from '../../../context/context';
import { message } from '../globalComponents/CustomToast';
import Spinner from '../loaders/Spinner';
import ElasticSearchResults from './ElasticSearchResults';

const CommandKSearch = ({ handleCloseSearchModal }) => {
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
						/>
						{info?.elasticSearchLoading && <Spinner width={'16px'} height={'16px'} />}
						<button>
							<ArrowUp className="arrow-up" />
						</button>
					</div>
					<div className="dropdown-container">
						<div className="dropdown-filters">
							<p>source</p>
							<p>collection</p>
							<p>assistance</p>
							<p>date</p>
						</div>
						<div className="reset-filter">
							<p>reset filter</p>
						</div>
					</div>
				</div>
				{/* <div className="search-output-container">
					<div className="search-output">
						<div className="image"></div>
						<div className="content">
							<h2 className="search-output-header">Demo - Sana AI Daily Standup</h2>
							<p className="description">
								Lauren Crichton: Stuff to tackle and a busy day ahead of us. Lauren
								Crichton: As you know, the Salesforce agent is the top prior. Jon,
								can you share where we're at with that? Lauren Crichton: Yes. Jon
								Lexa: Agent is coming along well. Jon...
							</p>
						</div>
					</div>
					<div className="search-output">
						<div className="image"></div>
						<div className="content">
							<h2 className="search-output-header">Demo - Sana AI Daily Standup</h2>
							<p className="description">
								Lauren Crichton: Stuff to tackle and a busy day ahead of us. Lauren
								Crichton: As you know, the Salesforce agent is the top prior. Jon,
								can you share where we're at with that? Lauren Crichton: Yes. Jon
								Lexa: Agent is coming along well. Jon...
							</p>
						</div>
					</div>
					<div className="search-output">
						<div className="image"></div>
						<div className="content">
							<h2 className="search-output-header">Demo - Sana AI Daily Standup</h2>
							<p className="description">
								Lauren Crichton: Stuff to tackle and a busy day ahead of us. Lauren
								Crichton: As you know, the Salesforce agent is the top prior. Jon,
								can you share where we're at with that? Lauren Crichton: Yes. Jon
								Lexa: Agent is coming along well. Jon...
							</p>
						</div>
					</div>
				</div> */}
				<div className={`search-output-container ${noResults ? 'noResultsContainer' : ''}`}>
					{noResults ? (
						<p className="noResults">No results found</p>
					) : (
						info?.showElasticSearchResults && <ElasticSearchResults />
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(CommandKSearch);
