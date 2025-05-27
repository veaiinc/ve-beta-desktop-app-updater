import React, { useState, useEffect } from 'react';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/plus.svg';
import { ReactComponent as RemoveIcon } from '../../../assets/svg/calendar/bin.svg';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const REPEAT_OPTIONS = [
	{ value: 'weekly', label: 'Repeat weekly' },
	// { value: 'none', label: 'Does not repeat' },
	{ value: 'custom', label: 'Custom' },
];
const defaultWeekly = () =>
	WEEKDAYS.map((d) => ({ day: d, slots: d === 'Sun' ? [] : [{ from: '09:00', to: '17:00' }] }));

export default function AvailabilitySection({ value, onChange, onSummaryChange }) {
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
					<span>{day.day}</span>
					{day.slots.length === 0 ? (
						<span className="unavailable-label">Unavailable</span>
					) : (
						day.slots.map((slot, idx) => (
							<React.Fragment key={idx}>
								<input
									className="slot-input"
									type="time"
									value={slot.from}
									onChange={(e) =>
										handleSlotChange(i, idx, 'from', e.target.value)
									}
								/>
								<input
									className="slot-input"
									type="time"
									value={slot.to}
									onChange={(e) => handleSlotChange(i, idx, 'to', e.target.value)}
								/>
								<button
									className="icon-btn remove"
									onClick={() => handleRemoveSlot(i, idx)}
								>
									<RemoveIcon />
								</button>
							</React.Fragment>
						))
					)}
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
							<React.Fragment key={idx}>
								<input
									className="slot-input"
									type="time"
									value={slot.from}
									onChange={(e) =>
										handleDateSlotChange(i, idx, 'from', e.target.value)
									}
								/>
								<input
									className="slot-input"
									type="time"
									value={slot.to}
									onChange={(e) =>
										handleDateSlotChange(i, idx, 'to', e.target.value)
									}
								/>
								<button
									className="icon-btn remove"
									onClick={() => handleRemoveDateSlot(i, idx)}
								>
									<RemoveIcon />
								</button>
							</React.Fragment>
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
			<div className="repeat-custom-row">
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
			</div>
			<div className="custom-date-row">
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
				<label className="radio">
					<input type="checkbox" checked={custom.never} onChange={handleCustomNever} />
					Never
				</label>
			</div>
		</>
	);

	return (
		<div>
			<div className="availability-dropdown">
				<div className="typeOfSession-lable" style={{ marginBottom: 12 }}>
					<Tooltip
						open={modeOpen}
						onOpenChange={setModeOpen}
						placement="bottom"
						distance={0}
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
}
