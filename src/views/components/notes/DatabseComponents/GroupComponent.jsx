import { Tooltip } from 'antd';
import { memo, useContext, useState, useEffect } from 'react';
import s from '../../../../assets/scss/notes/databaseComponents/groupComponent.module.scss';
import Context from '../../../../context/context';
import { ReactComponent as Tick } from '../../../../assets/svg/tasks/tick.svg';
import { ReactComponent as ChevronIcon } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import GroupConfigOptions from '../../dropDown/notes/database/GroupConfigOptions';

// config: {
// 	statusBy: {
// 		type: String,
// 		enum: ['option', 'group'],
// 	},
// 	dateBy: {
// 		type: String,
// 		enum: ['relative', 'day', 'week', 'month', 'year'],
// 	},
// 	textBy: {
// 		type: String,
// 		enum: ['exact', 'alphabetical'],
// 	},
// 	numberBy: {
// 		groupRange: [Number],
// 		groupInterval: Number,
// 	},
// },

const groupOptions = {
	date: [
		{ label: 'Relative', value: 'relative' },
		{ label: 'Day', value: 'day' },
		{ label: 'Week', value: 'week' },
		{ label: 'Month', value: 'month' },
		{ label: 'Year', value: 'year' },
	],
	status: [
		{ label: 'Option', value: 'option' },
		{ label: 'Group', value: 'group' },
	],
	text: [
		{ label: 'Exact', value: 'exact' },
		{ label: 'Alphabetical', value: 'alphabetical' },
	],
	number: [{ label: 'Group', value: 'group' }],
};
const chevronStyles = {
	transform: 'rotate(-180deg)',
};

const GroupComponent = ({ fields, view, databaseId, blockId, metaInfo }) => {
	const {
		notes: { updateViewGroup },
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: false,
		changeGroup: false,
		isOpen: false,
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

	// Sync input values with view prop changes
	useEffect(() => {
		setInputValues({
			rangeStart: view?.groupBy?.config?.numberBy?.groupRange?.[0] ?? 0,
			rangeEnd: view?.groupBy?.config?.numberBy?.groupRange?.[1] ?? 1000,
			interval: view?.groupBy?.config?.numberBy?.groupInterval || '',
		});
	}, [view?.groupBy?.config?.numberBy]);

	const handleInfoChange = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	const handleUpdateViewGroup = async (fieldId) => {
		if (info?.loading || view?.groupBy?.fieldId === fieldId) return;
		setInfo((prev) => ({ ...prev, loading: true }));
		await updateViewGroup(
			{
				pageId: view?.pageId,
				databaseViewId: view?._id,
				databaseId: databaseId,
				input: {
					fieldId,
				},
			},
			blockId,
		);
		setInfo((prev) => ({ ...prev, loading: false }));
	};

	const updateConfig = async (config) => {
		if (info?.loading) return;
		setInfo((prev) => ({ ...prev, loading: true }));
		await updateViewGroup(
			{
				pageId: view?.pageId,
				databaseViewId: view?._id,
				databaseId: databaseId,
				input: {
					fieldId: view?.groupBy?.fieldId,
					config,
				},
			},
			blockId,
		);
		setInfo((prev) => ({ ...prev, loading: false }));
	};

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
				if (view?.groupBy?.config?.numberBy?.groupInterval !== undefined) {
					cleanNumberByConfig.groupInterval = view.groupBy.config.numberBy.groupInterval;
				}

				await updateConfig({
					numberBy: cleanNumberByConfig,
				});
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
				if (view?.groupBy?.config?.numberBy?.groupRange) {
					cleanNumberByConfig.groupRange = view.groupBy.config.numberBy.groupRange;
				}

				await updateConfig({
					numberBy: cleanNumberByConfig,
				});
			}
		} catch (error) {
			console.error('Error updating config:', error);
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

	const selectedGroupOption = fields?.find((field) => field?._id === view?.groupBy?.fieldId);

	return (
		<Tooltip
			title={
				<div className={s.groupComponentDropdown}>
					{info?.changeGroup ? (
						<>
							<div
								className={s.groupComponentDropdownHeader}
								onClick={() => handleInfoChange({ changeGroup: false })}
							>
								<ChevronIcon style={chevronStyles} /> Group by
							</div>
							<div className={s.groupComponentDropdownBody}>
								{view?.type !== 'board' && (
									<div
										className={s.groupComponentDropdownBodyOptions}
										onClick={() => handleUpdateViewGroup('none')}
									>
										<div className={s.groupComponentDropdownBodyOptionsLabel}>
											None
										</div>
										{view?.groupBy?.fieldId === null && <Tick />}
									</div>
								)}

								{fields?.map((field) => (
									<div
										key={field?._id}
										className={s.groupComponentDropdownBodyOptions}
										onClick={() => handleUpdateViewGroup(field?._id)}
									>
										<div className={s.groupComponentDropdownBodyOptionsLabel}>
											{field?.name}
										</div>
										{view?.groupBy?.fieldId === field?._id && <Tick />}
									</div>
								))}
							</div>
						</>
					) : (
						<div className={s.groupComponentDropdownBody}>
							<div
								className={s.groupComponentDropdownBodyOptions}
								onClick={() => handleInfoChange({ changeGroup: true })}
							>
								<span>Group By</span>
								<span>
									{view?.groupBy?.fieldId === null
										? 'None'
										: fields?.find(
												(field) => field?._id === view?.groupBy?.fieldId,
										  )?.name}
								</span>
							</div>

							{groupOptions[selectedGroupOption?.type] && (
								<>
									{selectedGroupOption?.type === 'date' && (
										<Tooltip
											title={
												<GroupConfigOptions
													options={
														groupOptions[selectedGroupOption?.type]
													}
													selectedOption={view?.groupBy?.config?.dateBy}
													onChange={(value) =>
														updateConfig({ dateBy: value })
													}
												/>
											}
											placement="bottomRight"
											overlayClassName="status-dropdown"
											color="transparent"
											trigger={['click']}
										>
											<div className={s.groupComponentDropdownBodyOptions}>
												<span>Date by</span>
												<span>{view?.groupBy?.config?.dateBy}</span>
											</div>
										</Tooltip>
									)}
									{selectedGroupOption?.type === 'status' && (
										<Tooltip
											title={
												<GroupConfigOptions
													options={
														groupOptions[selectedGroupOption?.type]
													}
													selectedOption={view?.groupBy?.config?.statusBy}
													onChange={(value) =>
														updateConfig({ statusBy: value })
													}
												/>
											}
											placement="bottomRight"
											overlayClassName="status-dropdown"
											color="transparent"
											trigger={['click']}
										>
											<div className={s.groupComponentDropdownBodyOptions}>
												<span>Status by</span>
												<span>{view?.groupBy?.config?.statusBy}</span>
											</div>
										</Tooltip>
									)}
									{selectedGroupOption?.type === 'text' && (
										<Tooltip
											title={
												<GroupConfigOptions
													options={
														groupOptions[selectedGroupOption?.type]
													}
													selectedOption={view?.groupBy?.config?.textBy}
													onChange={(value) =>
														updateConfig({ textBy: value })
													}
												/>
											}
											placement="bottomRight"
											overlayClassName="status-dropdown"
											color="transparent"
											trigger={['click']}
										>
											<div className={s.groupComponentDropdownBodyOptions}>
												<span>Text by</span>
												<span>{view?.groupBy?.config?.textBy}</span>
											</div>
										</Tooltip>
									)}
									{selectedGroupOption?.type === 'number' && (
										<>
											<div className={s.groupComponentDropdownBodyOptions}>
												<span>Range</span>
												<div className={s.rangeInputWrapper}>
													<input
														className={
															s.groupComponentDropdownBodyOptionsInput
														}
														type="number"
														placeholder="Start"
														value={inputValues.rangeStart}
														onChange={(e) =>
															handleInputChange(
																'rangeStart',
																e.target.value,
															)
														}
														onBlur={(e) =>
															handleInputAction(
																'rangeStart',
																e.target.value,
															)
														}
														onKeyPress={(e) =>
															handleKeyPress(e, 'rangeStart')
														}
														disabled={
															inputLoading.rangeStart || info?.loading
														}
													/>
													-
													<input
														className={
															s.groupComponentDropdownBodyOptionsInput
														}
														type="number"
														placeholder="End"
														value={inputValues.rangeEnd}
														onChange={(e) =>
															handleInputChange(
																'rangeEnd',
																e.target.value,
															)
														}
														onBlur={(e) =>
															handleInputAction(
																'rangeEnd',
																e.target.value,
															)
														}
														onKeyPress={(e) =>
															handleKeyPress(e, 'rangeEnd')
														}
														disabled={
															inputLoading.rangeEnd || info?.loading
														}
													/>
												</div>
											</div>
											<div className={s.groupComponentDropdownBodyOptions}>
												<span>Interval</span>
												<input
													className={
														s.groupComponentDropdownBodyOptionsInput
													}
													type="number"
													placeholder="Interval"
													value={inputValues.interval}
													onChange={(e) =>
														handleInputChange(
															'interval',
															e.target.value,
														)
													}
													onBlur={(e) =>
														handleInputAction(
															'interval',
															e.target.value,
														)
													}
													onKeyPress={(e) =>
														handleKeyPress(e, 'interval')
													}
													disabled={
														inputLoading.interval || info?.loading
													}
												/>
											</div>
										</>
									)}
								</>
							)}
						</div>
					)}
				</div>
			}
			placement="bottomLeft"
			overlayClassName="status-dropdown"
			color="transparent"
			trigger={['click']}
			open={info?.isOpen}
			onOpenChange={(open) => {
				if (!open) {
					handleInfoChange({ isOpen: open, changeGroup: false });
				}
			}}
			onClick={(e) => {
				e?.stopPropagation();
			}}
		>
			<button onClick={() => handleInfoChange({ isOpen: !info?.isOpen, changeGroup: false })}>
				Group
			</button>
		</Tooltip>
	);
};

export default memo(GroupComponent);
