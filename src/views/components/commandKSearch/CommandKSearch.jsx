import '../../../assets/scss/commandKSearch/commandKSearch.scss';
import { ReactComponent as CrossSvg } from '../../../assets/svg/docs/cross.svg';
import { ReactComponent as SearchSvg } from '../../../assets/svg/elastic_search/search-icon.svg';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import Context from '../../../context/context';
import { message } from '../globalComponents/CustomToast';
import Spinner from '../loaders/Spinner';
import ElasticSearchResults from './ElasticSearchResults';
// import CustomDropdown from './CustomDropdownForCommandK';
import { createPortal } from 'react-dom';

const CommandKSearch = () => {
	const [isOpen, setIsOpen] = useState(false);
	const elasticSearchTimeoutRef = useRef(null);
	const modalRef = useRef(null);
	const inputRef = useRef(null);

	// Handle clicks outside the modal to close it
	const handleOutsideClick = (e) => {
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setIsOpen((prev) => !prev);
			}
			if (e.key === 'Escape') {
				setIsOpen(false);
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		if (isOpen) {
			// ✅ Clear local search info
			setInfo({
				elasticSearchLoading: false,
				showElasticSearchResults: false,
			});

			// ✅ Clear input and focus after modal mounts
			const timer = setTimeout(() => {
				if (inputRef.current) {
					inputRef.current.value = ''; // if uncontrolled
					inputRef.current.focus();
				}
			}, 50);

			document.addEventListener('mousedown', handleOutsideClick);

			return () => {
				clearTimeout(timer);
				document.removeEventListener('mousedown', handleOutsideClick);
				document.removeEventListener('keydown', handleKeyDown);
			};
		}

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen]);

	// Dependencies include isOpen to update handlers

	const handleCloseModal = () => {
		setIsOpen(false);
	};

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
	};

	const resetFilters = () => {
		setSelectedFilters({
			source: null,
			collection: null,
			assistance: null,
			date: null,
		});
	};

	// Render the modal using createPortal
	return createPortal(
		<div className={`command-k-search-container ${isOpen ? 'open' : ''}`}>
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
						{isLoading && (
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
						info?.showElasticSearchResults && (
							<ElasticSearchResults handleCloseSearchModal={handleCloseModal} />
						)
					)}
				</div>
			</div>
		</div>,
		document.body,
	);
};

export default memo(CommandKSearch);
