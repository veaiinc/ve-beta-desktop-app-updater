import '../../../assets/scss/commandKSearch/commandKSearch.scss';
import { ReactComponent as CrossSvg } from '../../../assets/svg/docs/cross.svg';
import { ReactComponent as SearchSvg } from '../../../assets/svg/elastic_search/search-icon.svg';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import Context from '../../../context/context';
import { message } from '../globalComponents/CustomToast';
import Spinner from '../loaders/Spinner';
import ElasticSearchResults from './ElasticSearchResults';
// import CustomDropdown from './CustomDropdownForCommandK';

const CommandKSearch = () => {
	// Optional filter states if needed
	// selectedFilters: {
	// 	source: null,
	// 	collection: null,
	// 	assistance: null,
	// 	date: null,
	// },

	const elasticSearchTimeoutRef = useRef(null);
	const modalRef = useRef(null);
	const inputRef = useRef(null);

	const {
		elasticSearch: { elasticSearchResults, performElasticSearch },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isOpen: false,
		isLoading: false,
		elasticSearchLoading: false,
		showElasticSearchResults: false,
	});

	const noResults = elasticSearchResults?.length === 0 && info.showElasticSearchResults;

	// useEffect(() => {
	// 	const handleKeyDown = (e) => {
	// 		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
	// 			e.preventDefault();
	// 			setInfo((prev) => ({ ...prev, isOpen: !prev.isOpen }));
	// 		}
	// 		if (e.key === 'Escape') {
	// 			setInfo((prev) => ({ ...prev, isOpen: false }));
	// 		}
	// 	};

	// 	document.addEventListener('keydown', handleKeyDown);

	// 	if (info.isOpen) {
	// 		// ✅ Clear local search info
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			elasticSearchLoading: false,
	// 			showElasticSearchResults: false,
	// 		}));

	// 		// ✅ Clear input and focus after modal mounts
	// 		const timer = setTimeout(() => {
	// 			if (inputRef.current) {
	// 				inputRef.current.value = ''; // if uncontrolled
	// 				inputRef.current.focus();
	// 			}
	// 		}, 50);

	// 		document.addEventListener('mousedown', handleOutsideClick);

	// 		return () => {
	// 			clearTimeout(timer);
	// 			document.removeEventListener('mousedown', handleOutsideClick);
	// 			document.removeEventListener('keydown', handleKeyDown);
	// 		};
	// 	}

	// 	return () => {
	// 		document.removeEventListener('keydown', handleKeyDown);
	// 	};
	// }, [info.isOpen]);

	const handleCloseModal = () => {
		setInfo((prev) => ({ ...prev, isOpen: false }));
	};

	const handleSearch = async (e) => {
		clearTimeout(elasticSearchTimeoutRef.current);
		const searchInput = e.target.value;
		const emptySearchInput = searchInput === '';

		if (emptySearchInput) {
			setInfo((prev) => ({
				...prev,
				elasticSearchLoading: false,
				showElasticSearchResults: false,
			}));
			return;
		}

		setInfo((prev) => ({ ...prev, isLoading: true }));

		elasticSearchTimeoutRef.current = setTimeout(async () => {
			setInfo((prev) => ({
				...prev,
				elasticSearchLoading: true,
				showElasticSearchResults: false,
			}));

			const response = await performElasticSearch(searchInput);
			const apiSuccess = response[0];

			if (!apiSuccess) {
				const errMsg = response[1];
				message.error(errMsg);
			}

			setInfo((prev) => ({
				...prev,
				elasticSearchLoading: false,
				showElasticSearchResults: true,
				isLoading: false,
			}));
		}, 500);
	};

	// If filter functionality is needed
	// const handleFilterChange = (filterType, selectedOption) => {
	// 	setInfo(prev => ({
	// 		...prev,
	// 		selectedFilters: {
	// 			...prev.selectedFilters,
	// 			[filterType]: selectedOption,
	// 		}
	// 	}));
	// };

	// const resetFilters = () => {
	// 	setInfo(prev => ({
	// 		...prev,
	// 		selectedFilters: {
	// 			source: null,
	// 			collection: null,
	// 			assistance: null,
	// 			date: null,
	// 		}
	// 	}));
	// };

	// Handle clicks outside the modal to close it
	const handleOutsideClick = (e) => {
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			setInfo((prev) => ({ ...prev, isOpen: false }));
		}
	};

	// Render the modal
	return (
		<div className={`command-k-search-container ${info.isOpen ? 'open' : ''}`}>
			<div className="command-k-search" ref={modalRef}>
				<div className="search-header">
					<h2>Search</h2>
					<button onClick={handleCloseModal}>
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
							ref={inputRef}
						/>
						{info.isLoading && (
							<div className="spinner-wrapper">
								<Spinner
									width={'16px'}
									height={'16px'}
									color={'var(--primary-font)'}
								/>
							</div>
						)}
					</div>
				</div>
				<div className={`search-output-container ${noResults ? 'noResultsContainer' : ''}`}>
					{noResults ? (
						<p className="noResults">No results found</p>
					) : (
						info.showElasticSearchResults && (
							<ElasticSearchResults handleCloseSearchModal={handleCloseModal} />
						)
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(CommandKSearch);
