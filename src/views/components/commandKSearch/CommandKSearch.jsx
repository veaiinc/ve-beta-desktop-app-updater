import '../../../assets/scss/commandKSearch/commandKSearch.scss';
// import { ReactComponent as CrossSvg } from '../../../assets/svg/docs/cross.svg';
import { ReactComponent as SearchSvg } from '../../../assets/svg/elastic_search/search-icon.svg';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import Context from '../../../context/context';
import { message } from '../globalComponents/CustomToast';
import Spinner from '../loaders/Spinner';
import ElasticSearchResults from '../../features/files/ElasticSearchResults';
// import CustomDropdown from '../../features/files/CustomDropdown';
// import { ReactComponent as Folder } from '../../../assets/svg/files/FolderSearch.svg';
// import { ReactComponent as Plug } from '../../../assets/svg/files/plug.svg';

// const items = [
// 	{
// 		value: 1,
// 		label: 'Files',
// 	},
// 	{
// 		value: 2,
// 		label: 'Meetings',
// 	},
// 	{
// 		value: 3,
// 		label: 'Webpages',
// 	},
// ];

// const customDropdownStyle = {
// 	display: 'flex',
// 	alignItems: 'center',
// 	gap: '5px',
// };

export const triggerCmdK = () => {
	const event = new KeyboardEvent('keydown', {
		key: 'k',
		metaKey: true, // For macOS; use ctrlKey for Windows
		bubbles: true,
	});
	document.dispatchEvent(event);
};

const CommandKSearch = () => {
	const elasticSearchTimeoutRef = useRef(null);
	const modalRef = useRef(null);
	const inputRef = useRef(null);
	const latestSearchInputRef = useRef('');

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

	const handleKeyDown = (e) => {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			setInfo((prev) => ({ ...prev, isOpen: !prev.isOpen }));
		}
		if (e.key === 'Escape') {
			setInfo((prev) => ({ ...prev, isOpen: false }));
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		if (info.isOpen) {
			setInfo((prev) => ({
				...prev,
				elasticSearchLoading: false,
				showElasticSearchResults: false,
			}));

			const timer = setTimeout(() => {
				if (inputRef.current) {
					inputRef.current.value = '';
					inputRef.current.focus();
				}
			}, 50);

			document.addEventListener('mousedown', handleOutsideClick);

			return () => {
				clearTimeout(timer);
				document.removeEventListener('mousedown', handleOutsideClick);
			};
		}
	}, [info.isOpen]);

	const handleCloseModal = () => {
		setInfo((prev) => ({ ...prev, isOpen: false }));
	};

	const handleSearch = async (e) => {
		clearTimeout(elasticSearchTimeoutRef.current);
		const searchInput = e.target.value;
		const emptySearchInput = searchInput === '';
		latestSearchInputRef.current = searchInput;

		if (emptySearchInput) {
			setInfo((prev) => ({
				...prev,
				isLoading: false,
				elasticSearchLoading: false,
				showElasticSearchResults: false,
			}));
			return;
		}

		setInfo((prev) => ({ ...prev, isLoading: true }));

		elasticSearchTimeoutRef.current = setTimeout(async () => {
			// ⛔ Ignore outdated timeout if input has changed
			if (latestSearchInputRef.current !== searchInput) return;

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

			// ⛔ Again check if input is still the same
			if (latestSearchInputRef.current !== searchInput) return;

			setInfo((prev) => ({
				...prev,
				elasticSearchLoading: false,
				showElasticSearchResults: true,
				isLoading: false,
			}));
		}, 500);
	};

	const handleOutsideClick = (e) => {
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			setInfo((prev) => ({ ...prev, isOpen: false }));
		}
	};

	return (
		<div className={`command-k-search-container ${info.isOpen ? 'open' : ''}`}>
			<div className="command-k-search" ref={modalRef}>
				<div className="search-input-container">
					<div className="search-input">
						<input
							type="text"
							placeholder="Search"
							onChange={handleSearch}
							ref={inputRef}
						/>
						<div className="spinner-wrapper">
							{info.isLoading ? (
								<Spinner
									width={'14px'}
									height={'14px'}
									color={'var(--primary-font)'}
								/>
							) : (
								<SearchSvg />
							)}
						</div>
						{/* <div className="dropdown-container" onMouseDown={(e) => e.preventDefault()}>
							<div>
								<CustomDropdown
									options={items}
									value={info.selectedSource}
									onChange={(val) =>
										setInfo((prev) => ({
											...prev,
											selectedSource: val,
										}))
									}
								>
									<div style={customDropdownStyle}>
										<Folder /> Sources
									</div>
								</CustomDropdown>
							</div>
							<div>
								<CustomDropdown
									options={items}
									value={info.selectedIntegration}
									onChange={(val) =>
										setInfo((prev) => ({
											...prev,
											selectedIntegration: val,
										}))
									}
								>
									<div style={customDropdownStyle}>
										<Plug /> Integrations
									</div>
								</CustomDropdown>
							</div>
						</div> */}
					</div>
				</div>
				<div className={`search-output-container ${noResults ? 'noResultsContainer' : ''}`}>
					{noResults || !info.showElasticSearchResults ? (
						<p className="noResults">No results found</p>
					) : (
						<ElasticSearchResults handleCloseSearchModal={handleCloseModal} />
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(CommandKSearch);
