import React, { memo, useCallback } from 'react';
import '../../../../assets/scss/tasks/listViewHeader.scss';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
// import { ReactComponent as SearchSvg } from '../../../../assets/svg/tasks/searchWhite.svg';
// import { ReactComponent as ThunderSvg } from '../../../../assets/svg/tasks/thunder.svg';
import { ReactComponent as FilterLinesSvg } from '../../../../assets/svg/tasks/filterLines.svg';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';
import { ReactComponent as ArrowUpAndDown } from '../../../../assets/svg/tasks/arrowUpAndDown.svg';
import { Tooltip } from 'antd';
import OptionsDropDown from '../../dropDown/tasks/OptionsDropDown';
import DropDown from '../../dropDown/tasks/DropDown';
import SortComponent from './SortComponent';

const ListViewHeader = ({
	updateListViewInfo,
	properties,
	togglePropertyVisibility,
	sort,
	responseTypes,
}) => {
	const handelSortClick = useCallback(
		(value) => {
			const newSort = sort.some((item) => item.sortBy === value)
				? sort
				: [...sort, { sortBy: value, sortType: 1 }];
			updateListViewInfo('sort', newSort);
			updateListViewInfo('page', 1);
		},
		[sort, updateListViewInfo],
	);

	return (
		<div className="listViewHeaderContainer">
			<div className="listViewHeader">
				<div className="listViewHeaderTitle">Tasks</div>
				<div className="listViewHeaderActions">
					<button
						className="listViewHeaderActionButton"
						onClick={() => {
							updateListViewInfo('isCreatingSubtask', false);
							updateListViewInfo('isCreateModalOpen', true);
						}}
					>
						<PlusSvg style={{ width: '20px', height: '20px' }} />
					</button>
					{
						// 	<button className="listViewHeaderActionButton">
						// 	<SearchSvg />
						// </button>
						// <button className="listViewHeaderActionButton">
						// 	<ThunderSvg />
						// </button>
					}
					<DropDown
						title="Sort"
						options={properties}
						onOptionClick={handelSortClick}
						valueSelector="value"
					>
						<button className="listViewHeaderActionButton">
							<ArrowUpAndDown style={{ width: '20px', height: '20px' }} />
						</button>
					</DropDown>
					<button className="listViewHeaderActionButton">
						<FilterLinesSvg />
					</button>
					<Tooltip
						placement="bottom"
						title={
							<OptionsDropDown
								properties={properties}
								togglePropertyVisibility={togglePropertyVisibility}
							/>
						}
						arrow={false}
						trigger={'click'}
						color={'transparent'}
						overlayStyle={{ minWidth: 'fit-content' }}
					>
						<button className="btn-options">
							<HorizontalMoreIcon style={{ width: '20px', height: '20px' }} />
						</button>
					</Tooltip>
				</div>
			</div>
			<div className="listViewOptionsContainer">
				<SortComponent
					sort={sort}
					properties={properties}
					responseTypes={responseTypes}
					updateListViewInfo={updateListViewInfo}
					handelSortClick={handelSortClick}
				/>
				<div className="listView-filterContainer">
					<div className="listView-filterWrapper">
						<div className="listView-filterTitle">Filter</div>
						<div className="listView-filterOptions">
							<span className="listView-filterOption">Name</span>
							<span className="listView-filterOption">Name</span>
						</div>
					</div>
					<div className="listView-filterWrapper">
						<div className="listView-filterTitle">Filter</div>
						<div className="listView-filterOptions">
							<span className="listView-filterOption">Name</span>
							<span className="listView-filterOption">Name</span>
						</div>
					</div>
					<div className="listView-filterWrapper">
						<div className="listView-filterTitle">Filter</div>
						<div className="listView-filterOptions">
							<span className="listView-filterOption">Name</span>
							<span className="listView-filterOption">Name</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(ListViewHeader);
