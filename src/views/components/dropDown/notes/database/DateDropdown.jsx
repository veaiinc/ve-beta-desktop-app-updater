import { memo, useState, useEffect } from 'react';
import s from '../../../../../assets/scss/notes/dropdown/dateDropdown.module.scss';
import CalendarPicker from '../../../notes/DatabseComponents/CalendarPicker';
import { Switch } from 'antd';
import moment from 'moment';

const DateDropdown = ({ value, onChange }) => {
	const [info, setInfo] = useState({
		startDate: value?.startDate ? moment.unix(value.startDate) : null,
		endDate: value?.endDate ? moment.unix(value.endDate) : null,
		isEndDateEnabled: value?.isEndDateEnabled,
		isTimeEnabled: value?.isTimeEnabled,
		timeZone: value?.timeZone,
		reminder: value?.reminder,
		isSelectingRange: false,
		activeInput: 'start', // 'start' or 'end'
	});

	// Sync with parent value
	useEffect(() => {
		if (value) {
			setInfo((prev) => ({
				...prev,
				startDate: value.startDate ? moment.unix(value.startDate) : null,
				endDate: value.endDate ? moment.unix(value.endDate) : null,
				isEndDateEnabled: value.isEndDateEnabled,
				isTimeEnabled: value.isTimeEnabled,
				timeZone: value.timeZone,
				reminder: value.reminder,
			}));
		}
	}, [JSON.stringify(value)]);

	const handleInfoChange = (data) => {
		setInfo((prev) => {
			const newInfo = { ...prev, ...data };

			// Only call onChange if date-related values have changed
			const hasDateChanges =
				data.startDate !== undefined ||
				data.endDate !== undefined ||
				data.isEndDateEnabled !== undefined ||
				data.isTimeEnabled !== undefined ||
				data.timeZone !== undefined ||
				data.reminder !== undefined;

			if (hasDateChanges) {
				onChange?.({
					startDate: newInfo.startDate ? newInfo.startDate.unix() : null,
					endDate: newInfo.endDate ? newInfo.endDate.unix() : null,
					isEndDateEnabled: newInfo.isEndDateEnabled,
					isTimeEnabled: newInfo.isTimeEnabled,
					timeZone: newInfo.timeZone,
					reminder: newInfo.reminder,
				});
			}

			return newInfo;
		});
	};

	const handleDateSelect = (date) => {
		// Set time to 12:00 AM
		const dateWithTime = date.clone().startOf('day');

		if (!info.isEndDateEnabled) {
			// Single select mode - set both dates to the same value
			handleInfoChange({
				startDate: dateWithTime,
				endDate: dateWithTime,
				isSelectingRange: false,
				hoverDate: null,
				activeInput: 'start',
			});
		} else {
			// Range select mode
			if (info.activeInput === 'start') {
				handleInfoChange({
					startDate: dateWithTime,
					endDate: null,
					isSelectingRange: true,
					activeInput: 'end',
				});
			} else {
				// When selecting end date
				if (dateWithTime.isBefore(info.startDate)) {
					handleInfoChange({
						startDate: dateWithTime,
						endDate: info.startDate,
						isSelectingRange: false,
						hoverDate: null,
						activeInput: 'start',
					});
				} else {
					handleInfoChange({
						endDate: dateWithTime,
						isSelectingRange: false,
						hoverDate: null,
						activeInput: 'start',
					});
				}
			}
		}
	};

	const handleDateHover = (date) => {
		if (info.isEndDateEnabled && info.isSelectingRange && info.startDate && !info.endDate) {
			handleInfoChange({ hoverDate: date });
		}
	};

	const clearSelection = () => {
		handleInfoChange({
			startDate: null,
			endDate: null,
			hoverDate: null,
			isSelectingRange: false,
			activeInput: 'start',
		});
	};

	const formatDateRange = () => {
		if (!info.startDate) return 'No dates selected';
		if (info.isEndDateEnabled) return info.startDate?.format('MMM DD, YYYY');
		if (!info.endDate) return `Start: ${info.startDate?.format('MMM DD, YYYY')}`;
		return `${info.startDate?.format('MMM DD, YYYY')} - ${info.endDate?.format(
			'MMM DD, YYYY',
		)}`;
	};

	return (
		<div className={s.dateDropdown}>
			<div className={s.inputSection}>
				<input
					type="text"
					placeholder="Select Date"
					className={`${s.dateInput} ${
						info.activeInput === 'start' ? s.activeInput : ''
					}`}
					value={info.startDate?.format('MMM DD, YYYY') || ''}
					readOnly
					onClick={() => handleInfoChange({ activeInput: 'start' })}
				/>
				{info.isEndDateEnabled && (
					<input
						type="text"
						placeholder="Select Date"
						className={`${s.dateInput} ${
							info.activeInput === 'end' ? s.activeInput : ''
						}`}
						value={info.endDate?.format('MMM DD, YYYY') || ''}
						readOnly
						onClick={() => handleInfoChange({ activeInput: 'end' })}
					/>
				)}
			</div>
			<CalendarPicker
				startDate={info.startDate}
				endDate={info.endDate}
				hoverDate={info.hoverDate}
				onDateSelect={handleDateSelect}
				onHover={handleDateHover}
			/>
			<div className={s.configureSection}>
				<div className={s.configureSectionItem}>
					<div className={s.configureSectionItemTitle}>End date</div>
					<Switch
						size="small"
						checked={info.isEndDateEnabled}
						onChange={(checked) => {
							handleInfoChange({
								isEndDateEnabled: checked,
								endDate: checked ? info.endDate : info.startDate || null,
								activeInput: 'start',
							});
						}}
					/>
				</div>
				{/* <div className={s.configureSectionItem}>
					<div className={s.configureSectionItemTitle}>Include time</div>
					<Switch size="small" />
				</div> */}
			</div>
		</div>
	);
};

export default memo(DateDropdown);
