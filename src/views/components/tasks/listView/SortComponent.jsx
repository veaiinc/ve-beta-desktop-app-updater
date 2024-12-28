import { Tooltip } from 'antd';
import React, { memo, useCallback } from 'react';
import { ReactComponent as DownArrow } from '../../../../assets/svg/tasks/downArrow.svg';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/Settings/CrossWhite.svg';
import { ReactComponent as ArrowUpAndDown } from '../../../../assets/svg/tasks/arrowUpAndDown.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import DropDown from '../../dropDown/tasks/DropDown';

const SortComponent = ({
	sort,
	properties,
	responseMetadata,
	updateListViewInfo,
	handelSortClick,
}) => {
	const handleFieldUpdate = useCallback(
		(sortBy, newValue) => {
			const newSort = sort.map((item) =>
				item?.sortBy === sortBy ? { ...item, sortBy: newValue } : item,
			);
			updateListViewInfo('sort', newSort);
		},
		[sort, updateListViewInfo],
	);

	const handleTypeUpdate = useCallback(
		(sortItem, newValue) => {
			const newSort = sort.map((item) =>
				item?.sortBy === sortItem?.sortBy ? { ...item, sortType: Number(newValue) } : item,
			);
			updateListViewInfo('sort', newSort);
		},
		[sort, updateListViewInfo],
	);

	const handleRemoveSort = useCallback(
		(sortItem) => {
			const newSort = sort.filter((item) => item !== sortItem);
			updateListViewInfo('sort', newSort);
		},
		[sort, updateListViewInfo],
	);

	return (
		<div className="listView-sortContainer">
			{sort.length > 0 && (
				<Tooltip
					title={
						<div className="listView-sortTooltip">
							{sort.map((sortItem) => (
								<div className="listView-sortItemContainer" key={sortItem?.sortBy}>
									<div className="listView-sortItem">
										<select
											name="sort-field"
											id="sort-field"
											value={sortItem?.sortBy}
											onChange={(e) =>
												handleFieldUpdate(sortItem?.sortBy, e.target.value)
											}
										>
											{properties?.map((item) => {
												const isAlreadySelected = sort?.some(
													(sortItem, index, array) =>
														sortItem?.sortBy === item.value &&
														array.indexOf(sortItem) !==
															sort.findIndex((s) => s === item),
												);

												return (
													!isAlreadySelected && (
														<option
															value={item.value}
															key={item?.value}
														>
															{item?.label}
														</option>
													)
												);
											})}
											<option value={sortItem?.sortBy}>
												{responseMetadata?.[sortItem?.sortBy]?.name}
											</option>
										</select>
										<select
											name="sort-by"
											id="sort-by"
											value={sortItem?.sortType}
											onChange={(e) =>
												handleTypeUpdate(sortItem, e.target.value)
											}
										>
											<option value={1}>Ascending</option>
											<option value={-1}>Descending</option>
										</select>
										<button
											className="listView-sortItemRemoveButton"
											onClick={() => handleRemoveSort(sortItem)}
										>
											<CloseSvg />
										</button>
									</div>
								</div>
							))}
							<DropDown
								options={properties?.filter(
									(item) =>
										!sort?.some((sortItem) => sortItem?.sortBy === item.value),
								)}
								onOptionClick={handelSortClick}
								valueSelector="value"
								title="Add Sort"
							>
								<div className="listView-sortItemAddButton">
									<PlusSvg />
									<span>Add Sort</span>
								</div>
							</DropDown>
						</div>
					}
					placement="bottomLeft"
					arrow={false}
					color={'transparent'}
					overlayStyle={{ width: 'fit-content' }}
					trigger={'click'}
				>
					<div className="listView-sortWrapper">
						<ArrowUpAndDown style={{ width: '20px', height: '20px' }} />

						<span className="listView-sortField">{`${sort.length} sort${
							sort.length > 1 ? 's' : ''
						}`}</span>
						<DownArrow />
					</div>
				</Tooltip>
			)}
		</div>
	);
};

export default memo(SortComponent);
