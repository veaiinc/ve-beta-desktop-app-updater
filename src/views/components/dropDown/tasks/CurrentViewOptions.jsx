import { memo, useEffect, useState, useRef, useContext, useMemo, useCallback } from 'react';
import { Tooltip } from 'antd';
import { ReactComponent as SortIcon } from '../../../../assets/svg/tasks/newSort.svg';
import '../../../../assets/scss/dropdown/tasks/currentViewOptions.scss';
import { ReactComponent as ListViewIcon } from '../../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardViewIcon } from '../../../../assets/svg/tasks/board.svg';
import { ReactComponent as TableViewIcon } from '../../../../assets/svg/tasks/grid.svg';
import { ReactComponent as GalleryViewIcon } from '../../../../assets/svg/tasks/blocks.svg';
import { ReactComponent as ChevronSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as PieSvg } from '../../../../assets/svg/tasks/ChartDonut.svg';
import { ReactComponent as PrioritySvg } from '../../../../assets/svg/tasks/ChartBar.svg';
import { ReactComponent as Tick } from '../../../../assets/svg/tasks/tick.svg';

import Context from '../../../../context/context';
import StatusEditDropDown from './StatusEditDropDown';

const viewOptions = [
	{
		value: 'list',
		label: 'List',
		Icon: ListViewIcon,
	},
	{
		value: 'board',
		label: 'Board',
		Icon: BoardViewIcon,
	},
	{
		value: 'table',
		label: 'Table',
		Icon: TableViewIcon,
	},
	{
		value: 'gallery',
		label: 'Widget',
		Icon: GalleryViewIcon,
	},
];

const groupByOptions = [
	{
		value: 'status',
		label: 'Status',
		Icon: PieSvg,
	},
	{
		value: 'priority',
		label: 'Priority',
		Icon: PrioritySvg,
	},
];

const CurrentViewOptions = ({
	showEditViewDropDown,
	taskPreferences,
	handleEditViewDropDown,
	viewData,
	updateViewInfo,
	properties,
	updateTaskInfo,
}) => {
	const debounceRef = useRef(null);

	const {
		tasks: { updateTaskPrefix, taskMetadata },
	} = useContext(Context);

	const [info, setInfo] = useState({
		label: viewData?.label,
		group: viewData?.group,
		viewType: viewData?.viewType,
		prefix: taskMetadata?.prefix,
		groupDropDownOpen: false,
		statusEditDropDownOpen: false,
	});

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			label: viewData?.label,
			group: viewData?.group,
			idPrefix: viewData?.idPrefix,
			viewType: viewData?.viewType,
		}));
	}, [viewData]);

	useEffect(() => {
		if (taskMetadata) {
			setInfo((prev) => ({
				...prev,
				prefix: taskMetadata?.prefix,
			}));
		}
	}, [taskMetadata]);

	const handleStateChange = (data) => {
		setInfo({ ...info, ...data });

		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		if (data?.label !== undefined && !data?.label) {
			return;
		}

		if (data?.prefix !== undefined) {
			// Convert to uppercase and remove any non-alphanumeric characters
			const sanitizedPrefix = data.prefix.toUpperCase().replace(/[^A-Z0-9]/g, '');
			// Limit to 4 characters
			const truncatedPrefix = sanitizedPrefix.slice(0, 4);

			// Only update if the sanitized value is different
			if (sanitizedPrefix !== data.prefix) {
				setInfo((prev) => ({ ...prev, prefix: truncatedPrefix }));
				data.prefix = truncatedPrefix;
			}

			if (!data?.prefix) {
				return;
			}
		}

		debounceRef.current = setTimeout(() => {
			if (data?.prefix !== undefined) {
				updateTaskPrefix({ input: { prefix: data.prefix } });
			} else {
				updateViewInfo(viewData?._id, { ...info, ...data });
			}
		}, 500);
	};

	const handleViewTypeChange = (viewType) => {
		handleStateChange({ viewType });
	};

	const handleStatusEditDropDown = (value) => {
		setInfo((prev) => ({
			...prev,
			statusEditDropDownOpen: value,
		}));
	};

	const updatePropertyPreference = useCallback(
		(propName, value) => {
			// Update the properties array
			const newProperties = properties.map((property) =>
				property.value === propName ? { ...property, ...value } : property,
			);

			// Update task preferences
			const newTaskPreferences = {
				...taskPreferences,
				preferences: {
					...taskPreferences?.preferences,
					[propName]: {
						...taskPreferences?.preferences?.[propName],
						...value,
					},
				},
			};

			// Apply the updates
			updateTaskInfo({
				properties: newProperties,
				taskPreferences: newTaskPreferences,
			});
		},
		[properties, updateTaskInfo, taskPreferences],
	);

	const handleGroupByChange = (value) => {
		setInfo((prev) => ({
			...prev,
			group: value?.value || null,
			groupDropDownOpen: false,
		}));
		updateViewInfo(viewData?._id, {
			group: value?.value || null,
		});
	};

	return (
		<Tooltip
			title={
				info?.statusEditDropDownOpen ? (
					<StatusEditDropDown handleClose={() => handleStatusEditDropDown(false)} />
				) : (
					<div className="current-view-options-tooltip">
						<div className="current-view-options-tooltip-header">Current View</div>
						<div className="view-options-container">
							{viewOptions.map((option) => (
								<div
									className={`view-option-item ${
										info?.viewType === option?.value ? 'active' : ''
									}`}
									key={option.value}
									onClick={() => handleViewTypeChange(option.value)}
								>
									<option.Icon />
									<span className="view-option-item-label">{option.label}</span>
								</div>
							))}
						</div>
						<input
							type="text"
							className="view-name-input"
							placeholder="View Name"
							value={info.label}
							onChange={(e) => handleStateChange({ label: e.target.value })}
						/>
						{info?.viewType === 'board' && (
							<div className="groupby-wrapper">
								<div className="current-view-option-title">Group By</div>
								<Tooltip
									title={
										<div className="groupby-tooltip-content">
											<div className="groupby-tooltip-content-title">
												Group By
											</div>
											<div className="groupby-tooltip-content-body">
												{groupByOptions.map((option) => (
													<div
														className="groupby-item"
														key={option.value}
														onClick={() => handleGroupByChange(option)}
													>
														<option.Icon />
														<div className="groupby-item-label">
															{option.label}
														</div>
														{info?.group === option?.value && (
															<Tick className="groupby-item-tick" />
														)}
													</div>
												))}
											</div>
										</div>
									}
									arrow={false}
									trigger={'click'}
									color={'transparent'}
									placement={'bottomRight'}
									overlayStyle={{ minWidth: 'fit-content' }}
									open={info?.groupDropDownOpen}
									onOpenChange={(value) => {
										setInfo((prev) => ({
											...prev,
											groupDropDownOpen: value,
										}));
									}}
								>
									<div
										className="selected-group-wrapper"
										onClick={() =>
											setInfo((prev) => ({
												...prev,
												groupDropDownOpen: !info?.groupDropDownOpen,
											}))
										}
									>
										<div className="selected-group-label">
											{info?.group === 'status'
												? 'Status'
												: info?.group === 'priority'
												? 'Priority'
												: ''}
										</div>
										<ChevronSvg
											className={`groupby-chevron-icon ${
												info?.groupDropDownOpen ? 'active' : ''
											}`}
										/>
									</div>
								</Tooltip>
							</div>
						)}
						<div className="id-prefix-wrapper">
							<div className="current-view-option-title">ID Prefix</div>
							<input
								className="current-view-id-prefix-input"
								value={info.prefix}
								onChange={(e) => handleStateChange({ prefix: e.target.value })}
							/>
						</div>
						<div
							className="status-edit-wrapper"
							onClick={() => handleStatusEditDropDown(true)}
						>
							<div className="current-view-option-title">Status</div>
							<ChevronSvg />
						</div>
						<div className="properties-wrapper">
							<div className="current-view-option-title">Task Properties</div>
							<div className="property-items-wrapper">
								{properties?.map((property) => (
									<div
										className={`property-item ${property?.show ? 'show' : ''} ${
											property.value === 'title' ? 'disabled' : ''
										}`}
										key={property?.value}
										onClick={() =>
											updatePropertyPreference(property?.value, {
												show: !property?.show,
											})
										}
									>
										{property?.label}
									</div>
								))}
							</div>
						</div>
					</div>
				)
			}
			open={showEditViewDropDown}
			onOpenChange={(value) => {
				if (!value) {
					handleEditViewDropDown(false);
				}
			}}
			arrow={false}
			trigger={'click'}
			color={'transparent'}
			placement={'bottomRight'}
			overlayStyle={{ minWidth: 'fit-content' }}
		>
			<div
				className="current-view-options-icon"
				onClick={() => handleEditViewDropDown(!showEditViewDropDown)}
			>
				<SortIcon />
			</div>
		</Tooltip>
	);
};

export default memo(CurrentViewOptions);
