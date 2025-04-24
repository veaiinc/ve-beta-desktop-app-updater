import { useContext, useEffect, useState } from 'react';
import Context from '../../../context/context';

const FilesSearch = () => {
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

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			elasticSearchLoading: false,
			showElasticSearchResults: false,
		}));

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
		};
	}, []);

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
	return <div>FilesSearch</div>;
};

export default FilesSearch;
