import { memo, useEffect, useState, useContext } from 'react';
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
import { Tooltip } from 'antd';
import GroupConfigOptions from '../notes/database/GroupConfigOptions';
import Context from '../../../../context/context';

const groupByOptions = {
	status: {
		label: 'Status by',
		options: [
			{ value: 'option', label: 'Option' },
			{ value: 'group', label: 'Group' },
		],
	},
	text: {
		label: 'Text by',
		options: [
			{ value: 'exact', label: 'Exact' },
			{ value: 'alphabetical', label: 'Alphabetical' },
		],
	},
	title: {
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
	number: {
		label: 'Number by',
		options: [
			{ value: 'exact', label: 'Exact' },
			{ value: 'range', label: 'Range' },
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
	view,
	databaseId,
	blockId,
}) => {
	const {
		notes: { updateViewGroup },
	} = useContext(Context);

	const [info, setInfo] = useState({
		hideEmptyGroups: false,
		groupBy: null,
		showSelectionDropDown: false,
		sort: [],
		search: '',
		groupByType: null,
		loading: false,
	});

	// Add state for input fields
	const [inputValues, setInputValues] = useState({
		rangeStart: '',
		rangeEnd: '',
		interval: '',
	});

	const [inputLoading, setInputLoading] = useState({
		rangeStart: false,
		rangeEnd: false,
		interval: false,
	});

	// Helper function to get the current grouping configuration value
	const getCurrentGroupingConfig = (fieldType) => {
		if (!group?.config) return null;

		switch (fieldType) {
			case 'status':
				return group.config.statusBy;
			case 'text':
			case 'title':
				return group.config.textBy;
			case 'date':
				return group.config.dateBy;
			case 'number':
				return group.config.numberBy;
			default:
				return null;
		}
	};

	// Helper function to get the current grouping type option
	const getCurrentGroupingTypeOption = (fieldType, configValue) => {
		if (!configValue || !groupByOptions[fieldType]) return null;

		return (
			groupByOptions[fieldType].options.find((option) => option.value === configValue) ||
			groupByOptions[fieldType].options[0]
		);
	};

	useEffect(() => {
		if (group?.fieldId && properties?.length > 0) {
			// Try different possible ID field names
			const selectedProperty = properties?.find(
				(property) =>
					property?.value === group.fieldId ||
					property?._id === group.fieldId ||
					property?.id === group.fieldId ||
					property?.fieldId === group.fieldId,
			);

			// Try different property name fields
			const propertyName =
				selectedProperty?.name ||
				selectedProperty?.label ||
				selectedProperty?.title ||
				selectedProperty?.displayName;

			const currentConfigValue = getCurrentGroupingConfig(group.fieldType);
			const currentTypeOption = getCurrentGroupingTypeOption(
				group.fieldType,
				currentConfigValue,
			);

			setInfo((prevInfo) => ({
				...prevInfo,
				groupBy: {
					value: group.fieldId,
					label: propertyName || 'Unknown Field',
					type: group.fieldType,
				},
				groupByType: currentTypeOption,
			}));
		} else if (group?.fieldId && (!properties || properties.length === 0)) {
			// Set a temporary state until properties are loaded
			setInfo((prevInfo) => ({
				...prevInfo,
				groupBy: {
					value: group.fieldId,
					label: 'Loading...',
					type: group.fieldType,
				},
				groupByType: null,
			}));
		} else {
			setInfo((prevInfo) => ({
				...prevInfo,
				groupBy: null,
				groupByType: null,
			}));
		}
	}, [group, properties]);

	// Sync input values with group configuration changes
	useEffect(() => {
		setInputValues({
			rangeStart: group?.config?.numberBy?.groupRange?.[0] ?? 0,
			rangeEnd: group?.config?.numberBy?.groupRange?.[1] ?? 1000,
			interval: group?.config?.numberBy?.groupInterval || '',
		});
	}, [group?.config?.numberBy]);

	// Handle input changes
	const handleInputChange = (field, value) => {
		setInputValues((prev) => ({ ...prev, [field]: value }));
	};

	// Handle input blur and enter key press
	const handleInputAction = async (field, value) => {
		if (info?.loading || inputLoading[field]) return;

		// Don't update if value is empty (but allow 0)
		if (value === '' || value === null || value === undefined) return;

		setInputLoading((prev) => ({ ...prev, [field]: true }));

		try {
			if (field === 'rangeStart' || field === 'rangeEnd') {
				// Get current values for range
				const currentStart =
					field === 'rangeStart' ? parseFloat(value) : parseFloat(inputValues.rangeStart);
				const currentEnd =
					field === 'rangeEnd' ? parseFloat(value) : parseFloat(inputValues.rangeEnd);

				// Only update if we have valid numbers
				if (isNaN(currentStart) || isNaN(currentEnd)) {
					console.warn('Invalid range values');
					return;
				}

				// Validation based on which field is being updated
				let finalStart = currentStart;
				let finalEnd = currentEnd;

				if (field === 'rangeStart') {
					// User is updating start value
					if (finalStart > finalEnd) {
						finalStart = finalEnd;
						// Update the input value to reflect the correction
						setInputValues((prev) => ({
							...prev,
							rangeStart: finalStart.toString(),
						}));
					}
				} else if (field === 'rangeEnd') {
					// User is updating end value
					if (finalEnd < finalStart) {
						finalEnd = finalStart;
						// Update the input value to reflect the correction
						setInputValues((prev) => ({
							...prev,
							rangeEnd: finalEnd.toString(),
						}));
					}
				}

				// Create clean config with only expected fields
				const cleanNumberByConfig = {
					groupRange: [Number(finalStart), Number(finalEnd)],
				};

				// Only include groupInterval if it exists in the current config
				if (group?.config?.numberBy?.groupInterval !== undefined) {
					cleanNumberByConfig.groupInterval = group.config.numberBy.groupInterval;
				}

				await updateViewGroup(
					{
						pageId: view?.pageId,
						databaseViewId: view?._id,
						databaseId: databaseId,
						input: {
							fieldId: view?.groupBy?.fieldId,
							config: {
								numberBy: cleanNumberByConfig,
							},
						},
					},
					blockId,
				);
			} else if (field === 'interval') {
				const intervalValue = parseFloat(value);
				if (isNaN(intervalValue)) {
					console.warn('Invalid interval value');
					return;
				}

				// Create clean config with only expected fields
				const cleanNumberByConfig = {
					groupInterval: Number(intervalValue),
				};

				// Only include groupRange if it exists in the current config
				if (group?.config?.numberBy?.groupRange) {
					cleanNumberByConfig.groupRange = group.config.numberBy.groupRange;
				}

				await updateViewGroup(
					{
						pageId: view?.pageId,
						databaseViewId: view?._id,
						databaseId: databaseId,
						input: {
							fieldId: view?.groupBy?.fieldId,
							config: {
								numberBy: cleanNumberByConfig,
							},
						},
					},
					blockId,
				);
			}
		} catch (error) {
			console.error('Error updating number config:', error);
			message.error('Failed to update number configuration');
		} finally {
			setInputLoading((prev) => ({ ...prev, [field]: false }));
		}
	};

	// Handle key press for enter
	const handleKeyPress = (e, field) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleInputAction(field, inputValues[field]);
		}
	};

	const handleGroupByChange = async (value) => {
		if (!value && viewType === 'board') {
			message.error('Grouping is required in board view');
			return;
		}

		if (info?.loading) return;
		setInfo((prevInfo) => ({ ...prevInfo, loading: true }));

		try {
			// Call the API to update the view group
			await updateViewGroup(
				{
					pageId: view?.pageId,
					databaseViewId: view?._id,
					databaseId: databaseId,
					input: {
						fieldId: value ? value.value : 'none',
					},
				},
				blockId,
			);

			setInfo((prevInfo) => ({
				...prevInfo,
				groupBy: value,
				showSelectionDropDown: value ? false : true,
				search: value ? '' : prevInfo?.search,
				loading: false,
			}));

			// Also call the original updateViewInfo for backward compatibility
			if (updateViewInfo) {
				updateViewInfo({
					group: value
						? {
								fieldId: value.value,
								fieldType: value.type,
								config: {
									statusBy: value.type === 'status' ? 'option' : null,
									textBy: ['text', 'title'].includes(value.type) ? 'exact' : null,
									dateBy: value.type === 'date' ? 'relative' : null,
									numberBy: value.type === 'number' ? 'exact' : null,
								},
								defaultGroups: [],
								visibleGroups: [],
						  }
						: null,
				});
			}
		} catch (error) {
			console.error('Error updating view group:', error);
			message.error('Failed to update grouping');
			setInfo((prevInfo) => ({ ...prevInfo, loading: false }));
		}
	};

	const handleGroupByTypeChange = async (groupByType) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			groupByType,
		}));
		const value = groupByType?.value;

		// Update the group configuration with the new type
		if (info?.groupBy && group && !info?.loading) {
			setInfo((prevInfo) => ({ ...prevInfo, loading: true }));

			try {
				// Create a clean config object without __typename
				const cleanConfig = {};

				switch (info.groupBy.type) {
					case 'status':
						cleanConfig.statusBy = value;
						break;
					case 'text':
					case 'title':
						cleanConfig.textBy = value;
						break;
					case 'date':
						cleanConfig.dateBy = value;
						break;
					case 'number':
						cleanConfig.numberBy = value;
						break;
				}

				await updateViewGroup(
					{
						pageId: view?.pageId,
						databaseViewId: view?._id,
						databaseId: databaseId,
						input: {
							fieldId: view?.groupBy?.fieldId,
							config: cleanConfig,
						},
					},
					blockId,
				);

				setInfo((prevInfo) => ({ ...prevInfo, loading: false }));
			} catch (error) {
				console.error('Error updating group configuration:', error);
				message.error('Failed to update group configuration');
				setInfo((prevInfo) => ({ ...prevInfo, loading: false }));
			}
		}
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
										style={{
											opacity: info?.loading ? 0.6 : 1,
											pointerEvents: info?.loading ? 'none' : 'auto',
										}}
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
								?.filter((property) =>
									property?.name
										?.toLowerCase()
										?.includes(info?.search?.toLowerCase()),
								)
								?.map((property) => (
									<div
										className="group-dropDown-select-options-item"
										key={property?._id}
										onClick={() =>
											handleGroupByChange({
												value: property?._id,
												label: property?.name,
												type: property?.type,
											})
										}
										style={{
											opacity: info?.loading ? 0.6 : 1,
											pointerEvents: info?.loading ? 'none' : 'auto',
										}}
									>
										{property?.Icon && (
											<property.Icon className={'icon-' + property?.type} />
										)}
										<span className="group-dropDown-select-options-item-label">
											{property.name}
										</span>
										{info?.groupBy?.value === property?._id ? (
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
							style={{
								opacity: info?.loading ? 0.6 : 1,
								pointerEvents: info?.loading ? 'none' : 'auto',
							}}
						>
							<span className="group-dropDown-options-item-label">Group by</span>
							<span className="group-dropDown-options-item-value">
								{info?.groupBy?.label}
								<ChevronRightThinSvg />
							</span>
						</div>
						{info?.groupBy?.type !== 'number' &&
						groupByOptions?.[info?.groupBy?.type] ? (
							<Tooltip
								title={
									<GroupConfigOptions
										options={groupByOptions?.[info?.groupBy?.type]?.options}
										selectedOption={info?.groupByType?.value}
										onChange={handleGroupByTypeChange}
									/>
								}
								placement="bottomLeft"
								overlayClassName="status-dropdown"
								color="transparent"
								trigger={['click']}
								zIndex={50100}
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
							</Tooltip>
						) : null}
						{info?.groupBy?.type === 'number' && (
							<>
								<div className="group-dropDown-options-item">
									<span className="group-dropDown-options-item-label">Range</span>
									<div className="group-dropDown-range-input-wrapper">
										<input
											className="group-dropDown-options-input"
											type="number"
											placeholder="Start"
											value={inputValues.rangeStart}
											onChange={(e) =>
												handleInputChange('rangeStart', e.target.value)
											}
											onBlur={(e) =>
												handleInputAction('rangeStart', e.target.value)
											}
											onKeyPress={(e) => handleKeyPress(e, 'rangeStart')}
											disabled={inputLoading.rangeStart || info?.loading}
										/>
										<span>-</span>
										<input
											className="group-dropDown-options-input"
											type="number"
											placeholder="End"
											value={inputValues.rangeEnd}
											onChange={(e) =>
												handleInputChange('rangeEnd', e.target.value)
											}
											onBlur={(e) =>
												handleInputAction('rangeEnd', e.target.value)
											}
											onKeyPress={(e) => handleKeyPress(e, 'rangeEnd')}
											disabled={inputLoading.rangeEnd || info?.loading}
										/>
									</div>
								</div>
								<div className="group-dropDown-options-item">
									<span className="group-dropDown-options-item-label">
										Interval
									</span>
									<input
										className="group-dropDown-options-input"
										type="number"
										placeholder="Interval"
										value={inputValues.interval}
										onChange={(e) =>
											handleInputChange('interval', e.target.value)
										}
										onBlur={(e) =>
											handleInputAction('interval', e.target.value)
										}
										onKeyPress={(e) => handleKeyPress(e, 'interval')}
										disabled={inputLoading.interval || info?.loading}
									/>
								</div>
							</>
						)}
					</div>
					<div className="group-dropDown-footer">
						<button
							className="group-dropDown-footer-button"
							onClick={() => handleGroupByChange(null)}
							disabled={info?.loading}
							style={{ opacity: info?.loading ? 0.6 : 1 }}
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
