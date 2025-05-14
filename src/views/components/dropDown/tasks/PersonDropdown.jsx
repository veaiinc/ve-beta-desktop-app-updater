import { memo, useContext, useEffect, useRef, useState } from 'react';
import '../../../../assets/scss/tasks/personMultiSelect.scss';
import InfiniteScroll from '../../globalComponents/InfiniteScroll';
import Context from '../../../../context/context';
import { ReactComponent as Tick } from '../../../../assets/svg/tasks/tick.svg';

const PersonDropdown = memo(({ selected = [], onOptionClick, title, value }) => {
	const searchDebounceRef = useRef(null);
	const searchRef = useRef('');

	const {
		contacts: { getClientsForTask, clientListForTask },
	} = useContext(Context);

	const [info, setInfo] = useState({
		options: [],
		hasMore: true,
		currentPage: 1,
		selected: [],
		search: '',
	});

	useEffect(() => {
		if (clientListForTask) {
			if (clientListForTask?.data) {
				setInfo((prev) => {
					const newData = clientListForTask?.data?.data || [];
					const currentPage = clientListForTask?.data?.currentPage;

					return {
						...prev,
						options: newData,
						hasMore: clientListForTask?.data?.hasNextPage,
						currentPage: currentPage,
					};
				});
			}
		}
	}, [clientListForTask]);

	useEffect(() => {
		setInfo((prev) => ({ ...prev, selected: value }));
	}, [value]);

	useEffect(() => {
		searchRef.current = info?.search;
	}, [info?.search]);

	useEffect(() => {
		return () => {
			if (searchRef.current?.trim()) {
				setInfo((prevInfo) => ({ ...prevInfo, search: '' }));
				handleFetchData(1, '');
			}
		};
	}, []);

	const handleFetchData = (page = 1, search = info?.search) => {
		getClientsForTask({
			filters: {
				page,
				limit: 20,
				name: search,
			},
		});
	};

	const fetchMoreData = () => {
		if (info?.hasMore) {
			const nextPage = info.currentPage + 1;
			handleFetchData(nextPage, info?.search);
		}
	};

	const debounceFetchData = (search, delay = 500) => {
		if (searchDebounceRef.current) {
			clearTimeout(searchDebounceRef.current);
		}

		searchDebounceRef.current = setTimeout(() => {
			handleFetchData(1, search);
		}, delay);
	};

	const handleSearchChange = (search) => {
		setInfo((prevInfo) => ({ ...prevInfo, search }));
		debounceFetchData(search);
	};

	return (
		<div className="person-drop-down-container" onClick={(e) => e?.stopPropagation()}>
			<div className="person-drop-down-header">
				<div className="person-drop-down-title">{title}</div>
				<div className="person-dropdown-menu-header-search">
					<input
						type="text"
						placeholder="Search..."
						value={info?.search}
						onChange={(e) => handleSearchChange(e?.target?.value)}
					/>
				</div>
			</div>
			<InfiniteScroll
				dataLength={info?.options?.length || 0}
				next={fetchMoreData}
				hasMore={info?.hasMore}
				loader={<div className="loading">Loading...</div>}
				maxHeight={300}
				scrollThreshold={0.8}
				className="person-drop-down-body"
			>
				<div className="person-drop-down-body-list">
					{info?.options?.length > 0 ? (
						info?.options?.map((option) => {
							const isSelected = selected.some((item) => item?._id === option?._id);
							return (
								<div
									className={`person-multi-select-selected-item ${
										isSelected ? 'selected' : ''
									}`}
									key={option?._id}
									onClick={(e) => {
										e?.stopPropagation();
										onOptionClick?.(option);
									}}
								>
									<div className="person-multi-select-selected-item-avatar">
										{option?.name?.charAt(0)}
									</div>
									<div className="person-multi-select-selected-item-name">
										<span className="person-multi-select-selected-item-name-text">
											{option?.name}
										</span>
										{option?.email && (
											<span className="person-multi-select-selected-item-email">
												{option?.email}
											</span>
										)}
									</div>
									<div className="select-option-item-tick-wrapper">
										{isSelected && <Tick />}
									</div>
								</div>
							);
						})
					) : (
						<span className="no-data-error-text">No clients</span>
					)}
				</div>
			</InfiniteScroll>
		</div>
	);
});

export default PersonDropdown;
