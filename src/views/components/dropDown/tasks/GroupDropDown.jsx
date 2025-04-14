import React, { memo, useEffect, useState } from 'react';
import { ReactComponent as OpenEye } from '../../../../assets/svg/gallery/open-eye.svg';
import { ReactComponent as CrossedOpenEye } from '../../../../assets/svg/gallery/crossedOpenEye.svg';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SixDotsSvg } from '../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as ArrowLeftSvg } from '../../../../assets/svg/tasks/arrowLeft.svg';
import { ReactComponent as DustbinOutlined } from '../../../../assets/svg/tasks/dustBin.svg';
import { ReactComponent as CheckSvg } from '../../../../assets/svg/tasks/checkmark.svg';
import ToggleSwitch from '../../../../views/components/input/slider';

import '../../../../assets/scss/dropdown/tasks/groupDropDown.scss';
import DropDown from './DropDown';
import { message } from '../../globalComponents/CustomToast';

const availableGroups = ['status', 'priority'];

const groupByOptions = {
	status: {
		label: 'Status by',
		options: [
			{ value: 'option', label: 'Option' },
			// { value: 'group', label: 'Group' },
		],
	},
	text: {
		label: 'Text by',
		options: [
			{ value: 'exact', label: 'Exact' },
			{ value: 'alphabetical', label: 'Alphabetical' },
		],
	},
	date: {
		label: 'Date by',
		options: [
			{ value: 'relative', label: 'Relative' },
			{ value: 'day', label: 'Day' },
			{ value: 'week', label: 'Week' },
			{ value: 'month', label: 'Month' },
			{ value: 'year', label: 'Year' },
		],
	},
};

const GroupDropDown = ({
	handleClose,
	handleBack,
	properties,
	group,
	updateViewInfo,
	viewType,
}) => {
	const [info, setInfo] = useState({
		hideEmptyGroups: false,
		groupBy: group,
		showSelectionDropDown: false,
		sort: [],
		search: '',
		groupByType: null,
	});

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			groupByType: groupByOptions?.[info?.groupBy?.type]?.options[0] ?? null,
		}));
	}, [info?.groupBy]);

	useEffect(() => {
		const groupBy = properties?.find((property) => property?.value === group);
		setInfo((prevInfo) => ({
			...prevInfo,
			groupBy: group
				? {
						value: group,
						label: groupBy?.label,
						type: groupBy?.type,
				  }
				: null,
		}));
	}, [group, properties]);

	const handleGroupByChange = (value) => {
		if (!value && viewType === 'board') {
			message.error('Grouping is required in board view');
			return;
		}
		setInfo((prevInfo) => ({
			...prevInfo,
			groupBy: value,
			showSelectionDropDown: value ? false : true,
			search: value ? '' : prevInfo?.search,
		}));
		updateViewInfo({
			group: value?.value || null,
		});
	};

	const handleGroupByTypeChange = (value) => {
		const groupByType = groupByOptions?.[info?.groupBy?.type]?.options.find(
			(option) => option.value === value,
		);
		setInfo((prevInfo) => ({
			...prevInfo,
			groupByType: groupByType,
		}));
	};

	return (
		<div className="group-dropDown">
			{info.showSelectionDropDown || !info.groupBy ? (
				<>
					<div className="group-dropDown-header">
						<ArrowLeftSvg className="cursor-pointer" onClick={handleBack} />
						<span className="group-dropDown-header-title">Group</span>
						<CrossSvg className="cursor-pointer" onClick={handleClose} />
					</div>
					<div className="group-dropDown-select">
						<input
							className="group-dropDown-select-search"
							placeholder="Search for a property..."
							value={info?.search}
							onChange={(e) => setInfo({ ...info, search: e.target.value })}
						/>
						<div className="group-dropDown-select-options">
							{viewType !== 'board' &&
								'none'?.includes(info?.search?.toLowerCase()) && (
									<div
										className="group-dropDown-select-options-item"
										key="none"
										onClick={() => handleGroupByChange(null)}
									>
										<span className="group-dropDown-select-options-item-label">
											None
										</span>
										{info?.groupBy === null ? (
											<CheckSvg className="icon-check" />
										) : null}
									</div>
								)}
							{properties
								?.filter((property) => availableGroups?.includes(property?.value))
								?.filter((property) =>
									property?.label
										?.toLowerCase()
										?.includes(info?.search?.toLowerCase()),
								)
								?.map((property) => (
									<div
										className="group-dropDown-select-options-item"
										key={property?.value}
										onClick={() =>
											handleGroupByChange({
												value: property?.value,
												label: property?.label,
												type: property?.type,
											})
										}
									>
										{property?.Icon && (
											<property.Icon className={'icon-' + property?.type} />
										)}
										<span className="group-dropDown-select-options-item-label">
											{property.label}
										</span>
										{info?.groupBy?.value === property?.value ? (
											<CheckSvg className="icon-check" />
										) : null}
									</div>
								))}
						</div>
					</div>
				</>
			) : (
				<>
					<div className="group-dropDown-header">
						<ArrowLeftSvg className="cursor-pointer" onClick={handleBack} />
						<span className="group-dropDown-header-title">Group</span>
						<CrossSvg className="cursor-pointer" onClick={handleClose} />
					</div>
					<div className="group-dropDown-options">
						<div
							className="group-dropDown-options-item"
							onClick={() =>
								setInfo((prevInfo) => ({
									...prevInfo,
									showSelectionDropDown: true,
								}))
							}
						>
							<span className="group-dropDown-options-item-label">Group by</span>
							<span className="group-dropDown-options-item-value">
								{info?.groupBy?.label}
								<ChevronRightThinSvg />
							</span>
						</div>
						{groupByOptions?.[info?.groupBy?.type] ? (
							<DropDown
								options={groupByOptions?.[info?.groupBy?.type]?.options}
								onOptionClick={handleGroupByTypeChange}
								valueSelector="value"
								selected={info?.groupByType?.value}
								selectedOptionStyles={{
									width: '100%',
									justifyContent: 'space-between',
									alignItems: 'center',
									alignSelf: 'stretch',
								}}
							>
								<div className="group-dropDown-options-item">
									<span className="group-dropDown-options-item-label">
										{groupByOptions?.[info?.groupBy?.type]?.label}
									</span>
									<span className="group-dropDown-options-item-value">
										{info?.groupByType?.label}
										<ChevronRightThinSvg />
									</span>
								</div>
							</DropDown>
						) : null}
						{/* <div className="group-dropDown-options-item">
							<span className="group-dropDown-options-item-label">Sort</span>
							<span className="group-dropDown-options-item-value">
								Ascending
								<ChevronRightThinSvg />
							</span>
						</div> */}
						<div className="group-dropDown-options-item">
							<span className="group-dropDown-options-item-label">
								Hide empty groups
							</span>
							<ToggleSwitch
								value={info?.hideEmptyGroups}
								onChange={(value) => setInfo({ ...info, hideEmptyGroups: value })}
							/>
						</div>
					</div>
					{/* <div className="group-drag-list">
						<div className="group-drag-list-header">
							<span className="group-drag-list-header-title">Visible groups</span>
							<button className="group-drag-list-header-button">Hide all</button>
						</div>
						<div className="group-drag-list-item">
							<span className="group-drag-list-item-label">Status</span>
							<span className="group-drag-list-item-value">Option</span>
						</div>
					</div>
					<div className="group-drag-list">
						<div className="group-drag-list-header">
							<span className="group-drag-list-header-title">Hidden groups</span>
							<button className="group-drag-list-header-button">Show all</button>
						</div>
						<div className="group-drag-list-item">
							<span className="group-drag-list-item-label">Status</span>
							<span className="group-drag-list-item-value">Option</span>
						</div>
					</div> */}
					<div className="group-dropDown-footer">
						<button
							className="group-dropDown-footer-button"
							onClick={() => handleGroupByChange(null)}
						>
							<DustbinOutlined />
							Remove grouping
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default memo(GroupDropDown);
