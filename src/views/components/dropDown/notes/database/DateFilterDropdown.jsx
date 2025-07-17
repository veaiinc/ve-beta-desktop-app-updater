import React, { useState, useMemo } from 'react';
import moment from 'moment';
import CalendarPicker from '../../../notes/DatabseComponents/CalendarPicker';
import s from '../../../../../assets/scss/notes/dropdown/dateFilterDropdown.module.scss';
import FilterHelperDropdown from './FilterHelperDropdown';
import {
	getRelativeToTodayRange,
	relativeTodayTimeFrames,
	relativeTodayTimeFramesArray,
	relativeTodayTimeScopes,
	relativeTodayTimeScopesArray,
} from '../../../../../helpers/databaseHelpers';

const DateFilterDropdown = ({ selected, onChange, title, showStartEnd = false, filterType }) => {
	const [info, setInfo] = useState({
		dateType: selected?.dateType || 'startDate',
		activeInput: 0,
		isSelectingRange: false,
		hoverDate: null,
		timeScope: selected?.timeScope || 'this',
		timeFrame: selected?.timeFrame || 'day',
		timeFrameCount: selected?.timeFrameCount || 1,
	});

	const handleDateTypeChange = (e) => {
		const newDateType = e.target.value;
		setInfo((prev) => ({ ...prev, dateType: newDateType }));
		if (filterType === 'relative_to_today') {
			onChange({
				timeScope: info.timeScope,
				timeFrame: info.timeFrame,
				timeFrameCount: info.timeFrameCount,
				dateType: newDateType,
			});
		} else if (showStartEnd && selected?.date) {
			onChange({
				date: selected.date,
				dateType: newDateType,
			});
		}
	};

	const calculateRelativeDates = useMemo(() => {
		if (filterType !== 'relative_to_today') return null;
		const [startDate, endDate] = getRelativeToTodayRange(
			info.timeScope,
			info.timeFrame,
			info.timeFrameCount,
		);
		return startDate && endDate
			? {
					startDate: startDate.toDate(),
					endDate: endDate.toDate(),
			  }
			: null;
	}, [filterType, info.timeScope, info.timeFrame, info.timeFrameCount]);

	const handleDateSelect = (date) => {
		if (filterType === 'relative_to_today') {
			return;
		}

		const timestamp = moment(date).unix();

		if (Array.isArray(selected?.date)) {
			if (info.activeInput === 0) {
				if (selected.date[1] && timestamp > selected.date[1]) {
					onChange({
						date: [selected.date[1], timestamp],
						dateType: info.dateType,
					});
				} else {
					onChange({
						date: [timestamp, selected.date[1]],
						dateType: info.dateType,
					});
				}
				setInfo((prev) => ({
					...prev,
					activeInput: 1,
					isSelectingRange: true,
				}));
			} else {
				if (timestamp < selected.date[0]) {
					onChange({
						date: [timestamp, selected.date[0]],
						dateType: info.dateType,
					});
				} else {
					onChange({
						date: [selected.date[0], timestamp],
						dateType: info.dateType,
					});
				}
				setInfo((prev) => ({
					...prev,
					activeInput: 0,
					isSelectingRange: false,
				}));
			}
		} else {
			onChange({
				date: timestamp,
				dateType: info.dateType,
			});
		}
		setInfo((prev) => ({ ...prev, hoverDate: null }));
	};

	const handleDateHover = (date) => {
		if (
			Array.isArray(selected?.date) &&
			info.isSelectingRange &&
			selected.date[0] &&
			!selected.date[1]
		) {
			setInfo((prev) => ({ ...prev, hoverDate: date }));
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

	const getStartDate = () => {
		if (Array.isArray(selected?.date)) {
			return selected.date[0] ? moment.unix(selected.date[0]) : null;
		}
		return selected?.date ? moment.unix(selected.date) : null;
	};

	const getEndDate = () => {
		if (Array.isArray(selected?.date)) {
			return selected.date[1] ? moment.unix(selected.date[1]) : null;
		}
		return selected?.date ? moment.unix(selected.date) : null;
	};

	const handleRelativeTimeChange = (newTimeScope, newTimeFrame, newTimeFrameCount) => {
		onChange({
			timeScope: newTimeScope,
			timeFrame: newTimeFrame,
			timeFrameCount: newTimeScope === 'this' ? 0 : newTimeFrameCount,
			dateType: info.dateType,
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
						value={info.dateType}
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
								options={relativeTodayTimeScopesArray}
								selectedOption={info.timeScope}
								onChange={(value) => {
									setInfo((prev) => ({ ...prev, timeScope: value }));
									handleRelativeTimeChange(
										value,
										info.timeFrame,
										info.timeFrameCount,
									);
								}}
							>
								<div className={s.relativeToTodaySelected}>
									{relativeTodayTimeScopes?.[info.timeScope]?.label}
								</div>
							</FilterHelperDropdown>
						</div>
						{info.timeScope !== 'this' && (
							<div className={s.countInputWrapper}>
								<input
									type="number"
									placeholder="Count"
									min={1}
									value={info.timeFrameCount}
									onChange={(e) => {
										const value = e.target.value;
										// Allow empty input
										if (value === '') {
											setInfo((prev) => ({ ...prev, timeFrameCount: '' }));
											return;
										}
										const newCount = parseInt(value) || 1;
										setInfo((prev) => ({ ...prev, timeFrameCount: newCount }));
										handleRelativeTimeChange(
											info.timeScope,
											info.timeFrame,
											newCount,
										);
									}}
								/>
							</div>
						)}
						<div className={s.relativeToTodaySelectedWrapper}>
							<FilterHelperDropdown
								options={relativeTodayTimeFramesArray}
								selectedOption={info.timeFrame}
								onChange={(value) => {
									setInfo((prev) => ({ ...prev, timeFrame: value }));
									handleRelativeTimeChange(
										info.timeScope,
										value,
										info.timeFrameCount,
									);
								}}
							>
								<div className={s.relativeToTodaySelected}>
									{relativeTodayTimeFrames?.[info.timeFrame]?.label}
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
									onClick={() => setInfo((prev) => ({ ...prev, activeInput: 0 }))}
									className={info.activeInput === 0 ? s.activeInput : ''}
								/>
								<input
									type="text"
									placeholder="End Date"
									value={getDisplayDate(1)}
									readOnly
									onClick={() => setInfo((prev) => ({ ...prev, activeInput: 1 }))}
									className={info.activeInput === 1 ? s.activeInput : ''}
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
				hoverDate={info.hoverDate}
				onDateSelect={handleDateSelect}
				onHover={handleDateHover}
			/>
		</div>
	);
};

export default DateFilterDropdown;
