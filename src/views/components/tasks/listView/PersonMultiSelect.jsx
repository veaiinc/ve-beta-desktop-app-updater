import React, { memo, useState, useEffect, useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../../../../assets/scss/tasks/personMultiSelect.scss';
import { Tooltip } from 'antd';
import Context from '../../../../context/context';

const PersonMultiSelect = ({
	value = [],
	showTitle = false,
	title = '',
	onOptionClick,
	disabled = false,
	showLabel = false,
}) => {
	const {
		contacts: { getClientsForTask, clientListForTask },
	} = useContext(Context);

	const [info, setInfo] = useState({
		options: [],
		open: false,
		hasMore: true,
		currentPage: 1,
		selected: [],
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
		} else {
			getClientsForTask({ clientFilterInput: { page: 1, limit: 20 } });
		}
	}, [clientListForTask]);

	useEffect(() => {
		setInfo((prev) => ({ ...prev, selected: value }));
	}, []);

	const fetchMoreClients = () => {
		if (info?.hasMore) {
			const nextPage = info.currentPage + 1;
			getClientsForTask({
				clientFilterInput: {
					page: nextPage,
					limit: 20,
				},
			});
		}
	};

	const handleOptionClick = (option) => {
		const isSelected = info?.selected?.some((item) => item._id === option._id);
		let newSelected;

		if (isSelected) {
			newSelected = info?.selected?.filter((item) => item._id !== option._id);
		} else {
			newSelected = [...info?.selected, option];
		}

		onOptionClick?.(newSelected);
		setInfo((prev) => ({ ...prev, selected: newSelected }));
	};

	return (
		<div className="person-multi-select-container">
			<Tooltip
				title={showTitle ? <div className="tooltip-inner">{title}</div> : ''}
				placement="bottom"
				overlayClassName="tooltip-overlay-container"
				color="transparent"
			>
				<Tooltip
					title={
						!disabled ? (
							<PersonDropDown
								options={info.options}
								title={title}
								hasMore={info.hasMore}
								fetchMoreData={fetchMoreClients}
								selectedOptions={info?.selected}
								onOptionClick={handleOptionClick}
							/>
						) : null
					}
					open={info.open}
					onOpenChange={(open) => {
						setInfo((prev) => ({ ...prev, open: !prev.open }));
					}}
					placement="bottom"
					trigger="click"
					arrow={false}
					color="transparent"
					overlayStyle={{ minWidth: 'fit-content' }}
				>
					<div
						className="person-multi-select-selected"
						onClick={(e) => {
							e?.stopPropagation();
							setInfo((prev) => ({ ...prev, open: true }));
						}}
					>
						{info?.selected?.length > 0 ? (
							<div className="person-multi-select-selected-list">
								{(showLabel ? info?.selected : info?.selected?.slice(0, 3)).map(
									(item) => (
										<div
											className={
												'person-multi-select-selected-item ' +
												(!showLabel
													? 'person-multi-select-selected-item-stacked'
													: '')
											}
											key={item?._id}
										>
											<div className="person-multi-select-selected-item-avatar">
												{item?.name?.charAt(0)}
											</div>
											{showLabel && (
												<div className="person-multi-select-selected-item-name">
													<span className="person-multi-select-selected-item-name-text">
														{item?.name}
													</span>
													{item?.email && (
														<span className="person-multi-select-selected-item-email">
															{item?.email}
														</span>
													)}
												</div>
											)}
										</div>
									),
								)}
								{!showLabel && info?.selected?.length > 3 && (
									<div
										className="person-multi-select-selected-item person-multi-select-selected-item-stacked"
										onClick={() => setInfo((prev) => ({ ...prev, open: true }))}
									>
										<div className="person-multi-select-selected-item-avatar">
											+{info?.selected?.length - 3}
										</div>
									</div>
								)}
							</div>
						) : (
							`Select ${title}`
						)}
					</div>
				</Tooltip>
			</Tooltip>
		</div>
	);
};

export default memo(PersonMultiSelect);

const PersonDropDown = memo(
	({ options = [], selectedOptions = [], onOptionClick, title, hasMore, fetchMoreData }) => {
		return (
			<div className="person-drop-down-container">
				<div className="person-drop-down-header">
					<div className="person-drop-down-title">{title}</div>
				</div>
				<InfiniteScroll
					dataLength={options?.length || 0}
					next={fetchMoreData}
					hasMore={hasMore}
					loader={<div className="loading">Loading...</div>}
					height={300}
					scrollThreshold={0.8}
					className="person-drop-down-body"
				>
					<div className="person-drop-down-body-list">
						{options?.map((option) => {
							const isSelected = selectedOptions.some(
								(item) => item._id === option._id,
							);
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
								</div>
							);
						})}
					</div>
				</InfiniteScroll>
			</div>
		);
	},
);
