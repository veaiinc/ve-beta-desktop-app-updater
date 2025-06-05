import { memo, useCallback, useEffect, useState } from 'react';
import '../../../../assets/scss/calendar/modal/udateSessionSlot.scss';
import ReactModal from '../index';
import { ReactComponent as Delete } from '../../../../assets/svg/ai_assistant/delete.svg';
import { ReactComponent as Down } from '../../../../assets/svg/calendar/down.svg';
import { ReactComponent as Clock } from '../../../../assets/svg/workflow/clock.svg';
import moment from 'moment';
import ToggleSwitch from '../../../components/input/slider';
import { Tooltip } from 'antd';

const customStyles = {
	content: { zIndex: 1003, borderRadius: '24px' },
	overlay: { zIndex: 1002 },
};

const UpdateSessionSlot = ({
	open,
	closeModal,
	schedulerList,
	selectedSlotData,
	updateCalendarInfo,
}) => {
	const [slots, setSlots] = useState([]);
	const [selectedSession, setSelectedSession] = useState(null);
	const [sessionTypeOpen, setSessionTypeOpen] = useState(false);

	// When modal opens or selectedSlotData changes, set selectedSession
	useEffect(() => {
		if (!open || !selectedSlotData || !schedulerList) return;
		const s = schedulerList.find((ss) => ss._id === selectedSlotData._id) || schedulerList[0];
		setSelectedSession(s);
	}, [open, selectedSlotData, schedulerList]);

	// When selectedSession or selectedSlotData changes, update slots
	useEffect(() => {
		if (!open || !selectedSlotData || !selectedSession) return;
		// Get selected date and day name
		const selectedDate = selectedSlotData.selectedDate
			? moment(selectedSlotData.selectedDate, [
					'YYYY-MM-DD',
					'D/M',
					'YYYY-MM-DDTHH:mm:ss.SSSZ',
			  ]).format('YYYY-MM-DD')
			: null;
		const selectedDayName =
			selectedSlotData.selectedDay ||
			(selectedDate ? moment(selectedDate).format('dddd') : null);

		// 1. Check for custom exception for this day
		const exception = (selectedSession.customExceptions || []).find((e) => {
			const exceptionDate = moment(e.date).format('YYYY-MM-DD');
			return exceptionDate === selectedDate;
		});
		if (exception && exception.customTimeRanges?.length > 0) {
			setSlots(exception.customTimeRanges.map((r) => ({ from: r.startTime, to: r.endTime })));
			return;
		}

		// 2. Else, check for default weekly availability for this day
		const avail = (selectedSession.availabilitySlots || []).find((a) => {
			return a.dayOfWeek === selectedDayName;
		});
		if (avail && avail.timeRanges?.length > 0) {
			setSlots(avail.timeRanges.map((r) => ({ from: r.startTime, to: r.endTime })));
			return;
		}

		// 3. No slots for this day
		setSlots([]);
	}, [open, selectedSlotData, selectedSession]);

	const handleSlotChange = (idx, field, value) => {
		setSlots((prev) => prev.map((slot, i) => (i === idx ? { ...slot, [field]: value } : slot)));
	};

	const addSlot = () => {
		setSlots((prev) => [...prev, { from: '09:00', to: '10:00' }]);
	};

	const removeSlot = (idx) => {
		setSlots((prev) => prev.filter((_, i) => i !== idx));
	};

	const handleSave = useCallback(() => {
		if (!selectedSession || !selectedSlotData?.selectedDate) return;
		const selectedDate = moment(selectedSlotData.selectedDate, [
			'YYYY-MM-DD',
			'D/M',
			'YYYY-MM-DDTHH:mm:ss.SSSZ',
		]).format('YYYY-MM-DD');
		let updatedSession = { ...selectedSession };
		const newException = {
			date: moment(selectedDate).format('YYYY-MM-DD[T]00:00:00.000[Z]'),
			overrideAvailability: true,
			customTimeRanges: slots.map((s) => ({ startTime: s.from, endTime: s.to })),
		};
		// Remove any existing exception for this day
		let customExceptions = (selectedSession.customExceptions || []).filter(
			(e) => moment(e.date).format('YYYY-MM-DD') !== selectedDate,
		);
		// Only add if slots exist
		if (slots.length > 0) {
			customExceptions = [...customExceptions, newException];
		}
		updatedSession.customExceptions = customExceptions;
		if (updateCalendarInfo) updateCalendarInfo(updatedSession);
		closeModal();
	}, [selectedSession, selectedSlotData, slots, updateCalendarInfo, closeModal]);

	const ModifyCloseModal = () => {
		closeModal();
		setSlots([]);
		setSelectedSession(null);
		setSessionTypeOpen(false);
	};

	return (
		<ReactModal
			isOpen={open}
			onRequestClose={ModifyCloseModal}
			closeModal={ModifyCloseModal}
			style={customStyles}
			className="update-session-slot-modal"
		>
			<div className="updateSessionSlotContainer">
				<div className="sessionHeader">
					<Tooltip
						open={sessionTypeOpen}
						onOpenChange={(visible) => setSessionTypeOpen(visible)}
						placement="bottom"
						title={
							<div className="sessionName-dropdown">
								{schedulerList?.map((option) => (
									<div
										key={option._id}
										className="sessionName-dropdown-item"
										onClick={() => {
											setSelectedSession(option);
											setSessionTypeOpen(false);
										}}
									>
										{option.sessionName}
									</div>
								))}
							</div>
						}
						arrow={false}
						trigger={'click'}
						color={'transparent'}
						overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
					>
						<div className="selectedSession-lable">
							{selectedSession?.sessionName}
							<Down className={`${sessionTypeOpen ? 'open' : ''}`} />
						</div>
					</Tooltip>
				</div>
				<h3 style={{ color: '#e4e5e6', fontWeight: 500, fontSize: 14 }}>
					{selectedSlotData?.selectedDate
						? `Slots for ${selectedSlotData.selectedDate}`
						: 'No day selected'}
				</h3>
				{slots.length === 0 ? (
					<div style={{ color: '#888', margin: '16px 0' }}>No slots for this day.</div>
				) : (
					slots.map((slot, idx) => (
						<div key={idx} className="timeSlot">
							<input
								type="time"
								className="slot-input"
								value={slot.from}
								onChange={(e) => handleSlotChange(idx, 'from', e.target.value)}
							/>
							<span>to</span>
							<input
								type="time"
								className="slot-input"
								value={slot.to}
								onChange={(e) => handleSlotChange(idx, 'to', e.target.value)}
							/>
							<Delete
								width={8}
								height={8}
								onClick={() => removeSlot(idx)}
								style={{ cursor: 'pointer' }}
							/>
						</div>
					))
				)}
				<div className="addSlot" onClick={addSlot}>
					+ Add Time Slot
				</div>
				<div className="saveButton">
					<div className="saveButton-text" onClick={handleSave}>
						Save Changes
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(UpdateSessionSlot);
