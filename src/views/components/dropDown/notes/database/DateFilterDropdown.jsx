import React, { useState, useMemo } from 'react';
import moment from 'moment';
import CalendarPicker from '../../../notes/DatabseComponents/CalendarPicker';
import s from '../../../../../assets/scss/notes/dropdown/dateFilterDropdown.module.scss';
import FilterHelperDropdown from './FilterHelperDropdown';
import {
	relativeTodayTimeFrames,
	relativeTodayTimeFramesArray,
	relativeTodayTimeScopes,
	relativeTodayTimeScopesArray,
} from '../../../../../helpers/databaseHelpers';

const DateFilterDropdown = ({ selected, onChange, title, showStartEnd = false, filterType }) => {
	const [dateType, setDateType] = useState(selected?.dateType || 'startDate');
	const [activeInput, setActiveInput] = useState(0); // 0 for first input, 1 for second input
	const [isSelectingRange, setIsSelectingRange] = useState(false);
	const [hoverDate, setHoverDate] = useState(null);
	const [timeFrame, setTimeFrame] = useState(selected?.timeFrame || 'this');
	const [timeScope, setTimeScope] = useState(selected?.timeScope || 'day');
	const [timeFrameCount, setTimeFrameCount] = useState(selected?.timeFrameCount || 1);

	const handleDateTypeChange = (e) => {
		const newDateType = e.target.value;
		setDateType(newDateType);
		if (showStartEnd && selected?.date) {
			onChange({
				date: selected.date,
				dateType: newDateType,
			});
		}
	};

	const calculateRelativeDates = useMemo(() => {
		if (filterType !== 'relative_to_today') return null;

		const today = moment();
		const count = timeFrameCount || 1;

		const ranges = {
			this: {
				day: [today.clone().startOf('day'), today.clone().endOf('day')],
				week: [today.clone().startOf('week'), today.clone().endOf('week')],
				month: [today.clone().startOf('month'), today.clone().endOf('month')],
				year: [today.clone().startOf('year'), today.clone().endOf('year')],
			},
			past: {
				day: [
					today.clone().subtract(count, 'days').startOf('day'),
					today.clone().endOf('day'),
				],
				week: [
					today.clone().subtract(count, 'weeks').startOf('day'),
					today.clone().endOf('day'),
				],
				month: [
					today.clone().subtract(count, 'months').startOf('day'),
					today.clone().endOf('day'),
				],
				year: [
					today.clone().subtract(count, 'years').startOf('day'),
					today.clone().endOf('day'),
				],
			},
			next: {
				day: [today.clone().startOf('day'), today.clone().add(count, 'days').endOf('day')],
				week: [
					today.clone().startOf('day'),
					today.clone().add(count, 'weeks').endOf('day'),
				],
				month: [
					today.clone().startOf('day'),
					today.clone().add(count, 'months').endOf('day'),
				],
				year: [
					today.clone().startOf('day'),
					today.clone().add(count, 'years').endOf('day'),
				],
			},
		};

		const [startDate, endDate] = ranges[timeFrame]?.[timeScope] || [null, null];

		return startDate && endDate
			? {
					startDate: startDate.toDate(),
					endDate: endDate.toDate(),
			  }
			: null;
	}, [filterType, timeFrame, timeScope, timeFrameCount]);

	const handleDateSelect = (date) => {
		if (filterType === 'relative_to_today') {
			return; // Don't handle date selection for relative_to_today filter type
		}

		const timestamp = moment(date).unix();

		if (Array.isArray(selected?.date)) {
			if (activeInput === 0) {
				// When selecting first date
				if (selected.date[1] && timestamp > selected.date[1]) {
					// If selected date is after the end date, swap them
					onChange({
						date: [selected.date[1], timestamp],
						dateType: dateType,
					});
				} else {
					// Normal case - update start date
					onChange({
						date: [timestamp, selected.date[1]],
						dateType: dateType,
					});
				}
				setActiveInput(1); // Move to end date selection
				setIsSelectingRange(true);
			} else {
				// When selecting second date
				if (timestamp < selected.date[0]) {
					// If selected date is before the start date, swap them
					onChange({
						date: [timestamp, selected.date[0]],
						dateType: dateType,
					});
				} else {
					// Normal case - update end date
					onChange({
						date: [selected.date[0], timestamp],
						dateType: dateType,
					});
				}
				setActiveInput(0); // Move back to start date selection
				setIsSelectingRange(false);
			}
		} else {
			// Single date selection
			onChange({
				date: timestamp,
				dateType: dateType,
			});
		}
		setHoverDate(null);
	};

	const handleDateHover = (date) => {
		if (
			Array.isArray(selected?.date) &&
			isSelectingRange &&
			selected.date[0] &&
			!selected.date[1]
		) {
			setHoverDate(date);
		}
	};

	const getDisplayDate = (index = 0) => {
		if (Array.isArray(selected?.date)) {
			return selected.date[index]
				? moment.unix(selected.date[index]).format('MMM DD, YYYY')
				: '';
		}
		return selected?.date ? moment.unix(selected.date).format('MMM DD, YYYY') : '';
	};

	const getCalendarDate = () => {
		if (Array.isArray(selected?.date)) {
			return selected.date[activeInput] ? moment.unix(selected.date[activeInput]) : null;
		}
		return selected?.date ? moment.unix(selected.date) : null;
	};

	const getStartDate = () => {
		if (Array.isArray(selected?.date)) {
			return selected.date[0] ? moment.unix(selected.date[0]) : null;
		}
		return null;
	};

	const getEndDate = () => {
		if (Array.isArray(selected?.date)) {
			return selected.date[1] ? moment.unix(selected.date[1]) : null;
		}
		return null;
	};

	const handleRelativeTimeChange = (newTimeFrame, newTimeScope, newTimeFrameCount) => {
		onChange({
			timeFrame: newTimeFrame,
			timeScope: newTimeScope,
			timeFrameCount: newTimeFrame === 'this' ? 0 : newTimeFrameCount,
			dateType: dateType,
		});
	};

	return (
		<div className={s.dateFilterDropdown}>
			<div className={s.topSection}>
				<div className={s.topSectionTitle}>{title}</div>
			</div>
			<div className={s.bodySection}>
				{showStartEnd && (
					<select
						className={s.dateTypeSelect}
						value={dateType}
						onChange={handleDateTypeChange}
					>
						<option value="startDate">Start Date</option>
						<option value="endDate">End Date</option>
					</select>
				)}
				{filterType === 'relative_to_today' ? (
					<div className={s.relativeToTodayContainer}>
						<div className={s.relativeToTodaySelectedWrapper}>
							<FilterHelperDropdown
								options={relativeTodayTimeFramesArray}
								onChange={(value) => {
									setTimeFrame(value);
									handleRelativeTimeChange(value, timeScope, timeFrameCount);
								}}
							>
								<div className={s.relativeToTodaySelected}>
									{relativeTodayTimeFrames?.[timeFrame]?.label}
								</div>
							</FilterHelperDropdown>
						</div>
						{timeFrame !== 'this' && (
							<div className={s.countInputWrapper}>
								<input
									type="number"
									placeholder="Count"
									min={1}
									value={timeFrameCount}
									onChange={(e) => {
										const value = e.target.value;
										// Allow empty input
										if (value === '') {
											setTimeFrameCount('');
											return;
										}
										const newCount = parseInt(value) || 1;
										setTimeFrameCount(newCount);
										handleRelativeTimeChange(timeFrame, timeScope, newCount);
									}}
								/>
							</div>
						)}
						<div className={s.relativeToTodaySelectedWrapper}>
							<FilterHelperDropdown
								options={relativeTodayTimeScopesArray}
								onChange={(value) => {
									setTimeScope(value);
									handleRelativeTimeChange(timeFrame, value, timeFrameCount);
								}}
							>
								<div className={s.relativeToTodaySelected}>
									{relativeTodayTimeScopes?.[timeScope]?.label}
								</div>
							</FilterHelperDropdown>
						</div>
					</div>
				) : (
					<div className={s.inputContainer}>
						{Array.isArray(selected?.date) ? (
							<>
								<input
									type="text"
									placeholder="Start Date"
									value={getDisplayDate(0)}
									readOnly
									onClick={() => setActiveInput(0)}
									className={activeInput === 0 ? s.activeInput : ''}
								/>
								<input
									type="text"
									placeholder="End Date"
									value={getDisplayDate(1)}
									readOnly
									onClick={() => setActiveInput(1)}
									className={activeInput === 1 ? s.activeInput : ''}
								/>
							</>
						) : (
							<input
								type="text"
								placeholder="Select Date"
								value={getDisplayDate()}
								readOnly
							/>
						)}
					</div>
				)}
			</div>
			<CalendarPicker
				startDate={
					filterType === 'relative_to_today'
						? calculateRelativeDates?.startDate
						: getStartDate()
				}
				endDate={
					filterType === 'relative_to_today'
						? calculateRelativeDates?.endDate
						: getEndDate()
				}
				hoverDate={hoverDate}
				onDateSelect={handleDateSelect}
				onHover={handleDateHover}
			/>
		</div>
	);
};

export default DateFilterDropdown;
