import { useState, useEffect, Fragment, memo } from 'react';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import { ReactComponent as RemoveIcon } from '../../../assets/svg/calendar/bin.svg';
import { Tooltip, TimePicker } from 'antd';
import dayjs from 'dayjs';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const REPEAT_OPTIONS = [
	{ value: 'weekly', label: 'Repeat weekly' },
	// { value: 'none', label: 'Does not repeat' },
	// { value: 'custom', label: 'Custom' },
];
const defaultWeekly = () =>
	WEEKDAYS.map((d) => ({ day: d, slots: d === 'Sun' ? [] : [{ from: '09:00', to: '17:00' }] }));

const validateTimeRange = (startTime, endTime) => {
	const [startHour, startMinute] = startTime.split(':').map(Number);
	const [endHour, endMinute] = endTime.split(':').map(Number);
	const startTotal = startHour * 60 + startMinute;
	const endTotal = endHour * 60 + endMinute;
	return endTotal > startTotal;
};

const AvailabilitySection = ({ value, onChange, onSummaryChange }) => {
	const [mode, setMode] = useState('weekly');
	const [modeOpen, setModeOpen] = useState(false);
	const [weekly, setWeekly] = useState(defaultWeekly());
	const [dates, setDates] = useState([
		{ date: dayjs().format('YYYY-MM-DD'), slots: [{ from: '09:00', to: '17:00' }] },
	]);
	const [custom, setCustom] = useState({
		unit: 'weeks',
		interval: 2,
		start: dayjs().format('YYYY-MM-DD'),
		end: dayjs().add(1, 'month').format('YYYY-MM-DD'),
		never: false,
	});
	const [slotErrors, setSlotErrors] = useState({});

	// Compute summary
	useEffect(() => {
		let summary = '';
		if (mode === 'weekly') {
			// Example: if all weekdays have default slot, show 'Weekdays, 9 AM - 5 PM'
			const weekdays = weekly.slice(1, 6);
			const allDefault = weekdays.every(
				(day) =>
					day.slots.length === 1 &&
					day.slots[0].from === '09:00' &&
					day.slots[0].to === '17:00',
			);
			if (allDefault) summary = 'Weekdays, 9 AM - 5 PM';
			else summary = 'Custom weekly slots';
		} else if (mode === 'none') {
			summary =
				dates.length > 0
					? `${dates.length} custom date${dates.length > 1 ? 's' : ''}`
					: 'No dates set';
		} else if (mode === 'custom') {
			summary = 'Custom slots set';
		}
		if (onSummaryChange) onSummaryChange(summary);
	}, [mode, weekly, dates, custom, onSummaryChange]);

	// Helper to update parent
	const emitChange = (data) => {
		onChange && onChange({ mode, weekly, dates, custom, ...data });
	};

	// --- Weekly Handlers ---
	const handleAddSlot = (dayIdx) => {
		setWeekly((prev) => {
			const updated = [...prev];
			updated[dayIdx].slots.push({ from: '09:00', to: '17:00' });
			emitChange({ weekly: updated });
			return updated;
		});
	};
	const handleRemoveSlot = (dayIdx, slotIdx) => {
		setWeekly((prev) => {
			const updated = [...prev];
			updated[dayIdx].slots.splice(slotIdx, 1);
			if (updated[dayIdx].slots.length === 0) updated[dayIdx].slots = [];
			emitChange({ weekly: updated });
			return updated;
		});
	};
	const handleSetUnavailable = (dayIdx) => {
		setWeekly((prev) => {
			const updated = [...prev];
			updated[dayIdx].slots = [];
			emitChange({ weekly: updated });
			return updated;
		});
	};
	const handleSlotChange = (dayIdx, slotIdx, field, val) => {
		setWeekly((prev) => {
			const updated = [...prev];
			updated[dayIdx].slots[slotIdx][field] = val;
			// Validate slot
			const slot = updated[dayIdx].slots[slotIdx];
			const key = `${updated[dayIdx].day}-${slotIdx}`;
			if (!validateTimeRange(slot.from, slot.to)) {
				setSlotErrors((prevErrs) => ({ ...prevErrs, [key]: true }));
			} else {
				setSlotErrors((prevErrs) => {
					const newErrs = { ...prevErrs };
					delete newErrs[key];
					return newErrs;
				});
			}
			emitChange({ weekly: updated });
			return updated;
		});
	};

	// --- Dates Handlers ---
	const handleAddDate = () => {
		setDates((prev) => {
			const updated = [
				...prev,
				{ date: dayjs().format('YYYY-MM-DD'), slots: [{ from: '09:00', to: '17:00' }] },
			];
			emitChange({ dates: updated });
			return updated;
		});
	};
	const handleRemoveDate = (dateIdx) => {
		setDates((prev) => {
			const updated = prev.filter((_, i) => i !== dateIdx);
			emitChange({ dates: updated });
			return updated;
		});
	};
	const handleDateChange = (dateIdx, val) => {
		setDates((prev) => {
			const updated = [...prev];
			updated[dateIdx].date = val;
			emitChange({ dates: updated });
			return updated;
		});
	};
	const handleAddDateSlot = (dateIdx) => {
		setDates((prev) => {
			const updated = [...prev];
			updated[dateIdx].slots.push({ from: '09:00', to: '17:00' });
			emitChange({ dates: updated });
			return updated;
		});
	};
	const handleRemoveDateSlot = (dateIdx, slotIdx) => {
		setDates((prev) => {
			const updated = [...prev];
			updated[dateIdx].slots.splice(slotIdx, 1);
			if (updated[dateIdx].slots.length === 0) updated[dateIdx].slots = [];
			emitChange({ dates: updated });
			return updated;
		});
	};
	const handleDateSlotChange = (dateIdx, slotIdx, field, val) => {
		setDates((prev) => {
			const updated = [...prev];
			updated[dateIdx].slots[slotIdx][field] = val;
			emitChange({ dates: updated });
			return updated;
		});
	};

	// --- Custom Handlers ---
	const handleCustomChange = (field, val) => {
		setCustom((prev) => {
			const updated = { ...prev, [field]: val };
			emitChange({ custom: updated });
			return updated;
		});
	};
	const handleCustomNever = (e) => {
		const checked = e.target.checked;
		setCustom((prev) => {
			const updated = checked
				? { ...prev, never: true, end: '' }
				: {
						...prev,
						never: false,
						end: prev.end || dayjs().add(1, 'month').format('YYYY-MM-DD'),
				  };
			emitChange({ custom: updated });
			return updated;
		});
	};
	const handleCustomEnd = (val) => {
		setCustom((prev) => {
			const updated = { ...prev, end: val, never: false };
			emitChange({ custom: updated });
			return updated;
		});
	};

	// --- Mode Change ---
	const handleModeChange = (val) => {
		setMode(val);
		emitChange({ mode: val });
	};

	// --- Renderers ---
	const renderWeekly = () => (
		<div className="availability-days">
			{weekly.map((day, i) => (
				<div className="availability-day-row" key={day.day}>
					<span className="day-label">{day.day}</span>
					<div className="availability-day-row-content">
						{day.slots.length === 0 ? (
							<span className="unavailable-label">Unavailable</span>
						) : (
							day.slots.map((slot, idx) => {
								const key = `${day.day}-${idx}`;
								const error = slotErrors[key];
								return (
									<Fragment key={idx}>
										<TimePicker
											className={`slot-input${error ? ' error' : ''}`}
											value={
												slot.from ? dayjs(`2000-01-01 ${slot.from}`) : null
											}
											onChange={(time) =>
												handleSlotChange(
													i,
													idx,
													'from',
													time ? time.format('HH:mm') : '',
												)
											}
											format="HH:mm"
											placeholder="Start time"
										/>
										<TimePicker
											className={`slot-input${error ? ' error' : ''}`}
											value={slot.to ? dayjs(`2000-01-01 ${slot.to}`) : null}
											onChange={(time) =>
												handleSlotChange(
													i,
													idx,
													'to',
													time ? time.format('HH:mm') : '',
												)
											}
											format="HH:mm"
											placeholder="End time"
										/>
										<button
											className="icon-btn remove"
											onClick={() => handleRemoveSlot(i, idx)}
										>
											<RemoveIcon />
										</button>
										{error && (
											<div
												style={{
													color: '#ff4d4f',
													fontSize: 12,
													marginTop: 2,
												}}
											>
												End time must be after start time
											</div>
										)}
									</Fragment>
								);
							})
						)}
					</div>
					<button className="icon-btn add" onClick={() => handleAddSlot(i)}>
						<PlusIcon />
					</button>
				</div>
			))}
		</div>
	);
	const renderDates = () => (
		<div className="availability-dates">
			{dates.map((date, i) => (
				<div className="availability-date-row" key={i}>
					<input
						className="slot-input"
						type="date"
						value={date.date}
						onChange={(e) => handleDateChange(i, e.target.value)}
					/>
					{date.slots.length === 0 ? (
						<span className="unavailable-label">Unavailable</span>
					) : (
						date.slots.map((slot, idx) => (
							<Fragment key={idx}>
								<TimePicker
									className="slot-input"
									value={slot.from ? dayjs(`2000-01-01 ${slot.from}`) : null}
									onChange={(time) =>
										handleDateSlotChange(
											i,
											idx,
											'from',
											time ? time.format('HH:mm') : '',
										)
									}
									format="HH:mm"
									placeholder="Start time"
								/>
								<TimePicker
									className="slot-input"
									value={slot.to ? dayjs(`2000-01-01 ${slot.to}`) : null}
									onChange={(time) =>
										handleDateSlotChange(
											i,
											idx,
											'to',
											time ? time.format('HH:mm') : '',
										)
									}
									format="HH:mm"
									placeholder="End time"
								/>
								<button
									className="icon-btn remove"
									onClick={() => handleRemoveDateSlot(i, idx)}
								>
									<RemoveIcon />
								</button>
							</Fragment>
						))
					)}
					<button className="icon-btn add" onClick={() => handleAddDateSlot(i)}>
						<PlusIcon />
					</button>
					<button className="icon-btn remove" onClick={() => handleRemoveDate(i)}>
						<RemoveIcon />
					</button>
				</div>
			))}
			<button className="add-date-btn" onClick={handleAddDate}>
				Add a date
			</button>
		</div>
	);
	const renderCustom = () => (
		<>
			{/* <div className="repeat-custom-row">
				<span className="repeat-label">Repeat every</span>
				<input
					className="repeat-input"
					type="number"
					min={1}
					value={custom.interval}
					onChange={(e) => handleCustomChange('interval', e.target.value)}
				/>
				<span className="repeat-label" style={{ marginLeft: 8 }}>
					weeks
				</span>
			</div> */}
			<div className="custom-date-row">
				<div className="date-row-item">
					<span className="date-label">Starts</span>
					<input
						className="date-input"
						type="date"
						value={custom.start}
						onChange={(e) => handleCustomChange('start', e.target.value)}
					/>
					<span className="date-label">Ends</span>
					<input
						className="date-input"
						type="date"
						value={custom.end}
						onChange={(e) => handleCustomEnd(e.target.value)}
						disabled={custom.never}
						required={!custom.never}
					/>
				</div>
				<div className="never-checkbox">
					<div className="custom-checkbox ">
						<input
							type="checkbox"
							id="never"
							checked={custom.never}
							onChange={handleCustomNever}
						/>
						<label htmlFor="never" className="checkbox-label">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="12"
								height="10"
								viewBox="0 0 12 10"
								fill="none"
							>
								<path
									d="M0.959839 5.86677L4.15976 8.7467L11.0396 1.54688"
									stroke="#E8E8E8"
									style={{
										stroke: 'color(display-p3 0.9097 0.9096 0.9096)',
										strokeOpacity: 1,
									}}
									strokeWidth="1.19997"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</label>
					</div>
					<span>Never</span>
				</div>
			</div>
		</>
	);

	useEffect(() => {
		if (value) {
			// Always set weekly slots if present
			if (Array.isArray(value.availabilitySlots)) {
				const apiSlots = value.availabilitySlots;
				const fullToShort = {
					Sunday: 'Sun',
					Monday: 'Mon',
					Tuesday: 'Tue',
					Wednesday: 'Wed',
					Thursday: 'Thu',
					Friday: 'Fri',
					Saturday: 'Sat',
				};
				const newWeekly = WEEKDAYS.map((d) => {
					const apiDay = apiSlots.find((slot) => fullToShort[slot.dayOfWeek] === d);
					if (apiDay) {
						return {
							day: d,
							slots: apiDay.timeRanges.map((tr) => ({
								from: tr.startTime,
								to: tr.endTime,
							})),
						};
					} else {
						return { day: d, slots: [] };
					}
				});
				setWeekly(newWeekly);
			}

			// Always set custom exception if present
			if (Array.isArray(value.customExceptions) && value.customExceptions.length > 0) {
				const exception = value.customExceptions[value.customExceptions.length - 1];
				setCustom((prev) => ({
					...prev,
					start: exception.date
						? exception.date.slice(0, 10)
						: dayjs().format('YYYY-MM-DD'),
					end: exception.date
						? exception.date.slice(0, 10)
						: dayjs().add(1, 'month').format('YYYY-MM-DD'),
					never: false, // You can infer this if you store it in the backend
					// Optionally, handle customTimeRanges here
				}));
			}

			// Set mode based on value.mode, fallback to 'weekly'
			if (value.mode) {
				setMode(value.mode);
			} else {
				setMode('weekly');
			}
		}
	}, [value]);
	return (
		<div>
			<div className="availability-dropdown">
				<div
					className="typeOfSession-lable"
					style={{ border: '1px solid var(--stroke)', borderRadius: '8px' }}
				>
					<Tooltip
						open={modeOpen}
						onOpenChange={setModeOpen}
						placement="bottom"
						distance={0}
						arrow={true}
						title={
							<div className="createSession-sessionType-dropdown">
								{REPEAT_OPTIONS.map((opt) => (
									<div
										key={opt.value}
										className="sessionType-dropdown-item"
										onClick={() => {
											setMode(opt.value);
											setModeOpen(false);
											emitChange({ mode: opt.value });
										}}
									>
										{opt.label}
									</div>
								))}
							</div>
						}
						trigger={'click'}
						color={'transparent'}
						overlayStyle={{ width: '100%', padding: '0' }}
					>
						<div className="typeOfSession-lable">
							{REPEAT_OPTIONS.find((opt) => opt.value === mode)?.label}
						</div>
					</Tooltip>
				</div>
			</div>
			{mode === 'weekly' && renderWeekly()}
			{mode === 'none' && renderDates()}
			{mode === 'custom' && renderCustom()}
		</div>
	);
};

export default memo(AvailabilitySection);
