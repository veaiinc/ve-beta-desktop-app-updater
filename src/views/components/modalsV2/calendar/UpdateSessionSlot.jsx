import { memo, useCallback, useEffect, useState, useRef } from 'react';
import styles from '../../../../assets/scss/calendar/modal/udateSessionSlot.module.scss';
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
	const timeSlotsContainerRef = useRef(null);
	const [info, setInfo] = useState({
		slots: [],
		selectedSession: null,
		sessionTypeOpen: false,
	});

	// When modal opens or selectedSlotData changes, set selectedSession
	useEffect(() => {
		if (!open || !selectedSlotData || !schedulerList) return;
		const s = schedulerList.find((ss) => ss._id === selectedSlotData._id) || schedulerList[0];
		setInfo((prev) => ({ ...prev, selectedSession: s }));
	}, [open, selectedSlotData, schedulerList]);

	// When selectedSession or selectedSlotData changes, update slots
	useEffect(() => {
		if (!open || !selectedSlotData || !info.selectedSession) return;
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
		const exception = (info.selectedSession.customExceptions || []).find((e) => {
			const exceptionDate = moment(e.date).format('YYYY-MM-DD');
			return exceptionDate === selectedDate;
		});
		if (exception && exception.customTimeRanges?.length > 0) {
			setInfo((prev) => ({
				...prev,
				slots: exception.customTimeRanges.map((r) => ({
					from: r.startTime,
					to: r.endTime,
				})),
			}));
			return;
		}

		// 2. Else, check for default weekly availability for this day
		const avail = (info.selectedSession.availabilitySlots || []).find((a) => {
			return a.dayOfWeek === selectedDayName;
		});
		if (avail && avail.timeRanges?.length > 0) {
			setInfo((prev) => ({
				...prev,
				slots: avail.timeRanges.map((r) => ({ from: r.startTime, to: r.endTime })),
			}));
			return;
		}

		// 3. No slots for this day
		setInfo((prev) => ({ ...prev, slots: [] }));
	}, [open, selectedSlotData, info.selectedSession]);

	const handleSlotChange = (idx, field, value) => {
		setInfo((prev) => ({
			...prev,
			slots: prev.slots.map((slot, i) => (i === idx ? { ...slot, [field]: value } : slot)),
		}));
	};

	const addSlot = () => {
		setInfo((prev) => ({ ...prev, slots: [...prev.slots, { from: '09:00', to: '10:00' }] }));
		// Scroll to bottom after state update
		setTimeout(() => {
			if (timeSlotsContainerRef.current) {
				timeSlotsContainerRef.current.scrollTo({
					top: timeSlotsContainerRef.current.scrollHeight,
					behavior: 'smooth',
				});
			}
		}, 0);
	};

	const removeSlot = (idx) => {
		setInfo((prev) => ({ ...prev, slots: prev.slots.filter((_, i) => i !== idx) }));
	};

	const handleSave = useCallback(() => {
		if (!info.selectedSession || !selectedSlotData?.selectedDate) return;
		const selectedDate = moment(selectedSlotData.selectedDate, [
			'YYYY-MM-DD',
			'D/M',
			'YYYY-MM-DDTHH:mm:ss.SSSZ',
		]).format('YYYY-MM-DD');
		let updatedSession = { ...info.selectedSession };
		const newException = {
			date: moment(selectedDate).format('YYYY-MM-DD[T]00:00:00.000[Z]'),
			overrideAvailability: true,
			customTimeRanges: info.slots.map((s) => ({ startTime: s.from, endTime: s.to })),
		};
		// Remove any existing exception for this day
		let customExceptions = (info.selectedSession.customExceptions || []).filter(
			(e) => moment(e.date).format('YYYY-MM-DD') !== selectedDate,
		);
		// Only add if slots exist
		if (info.slots.length > 0) {
			customExceptions = [...customExceptions, newException];
		}
		updatedSession.customExceptions = customExceptions;
		if (updateCalendarInfo) updateCalendarInfo(updatedSession);
		closeModal();
	}, [info.selectedSession, info.slots, selectedSlotData, updateCalendarInfo, closeModal]);

	const ModifyCloseModal = () => {
		closeModal();
		setInfo({
			slots: [],
			selectedSession: null,
			sessionTypeOpen: false,
		});
	};

	return (
		<ReactModal
			isOpen={open}
			onRequestClose={ModifyCloseModal}
			closeModal={ModifyCloseModal}
			style={customStyles}
			className="update-session-slot-modal"
		>
			<div className={styles.updateSessionSlotContainer}>
				<div className={styles.sessionHeader}>
					<Tooltip
						open={info.sessionTypeOpen}
						onOpenChange={(visible) =>
							setInfo((prev) => ({ ...prev, sessionTypeOpen: visible }))
						}
						placement="bottom"
						title={
							<div className={styles['sessionName-dropdown']}>
								{schedulerList?.map((option) => (
									<div
										key={option._id}
										className={styles['sessionName-dropdown-item']}
										onClick={() => {
											setInfo((prev) => ({
												...prev,
												selectedSession: option,
												sessionTypeOpen: false,
											}));
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
						<div className={styles['selectedSession-lable']}>
							{info.selectedSession?.sessionName}
							<Down className={`${info.sessionTypeOpen ? styles.open : ''}`} />
						</div>
					</Tooltip>
				</div>
				<h3 style={{ color: 'var(--primary-font)', fontWeight: 500, fontSize: 14 }}>
					{selectedSlotData?.selectedDate
						? `Slots for ${selectedSlotData.selectedDate}`
						: 'No day selected'}
				</h3>
				<div className={styles['timeSlots-container']} ref={timeSlotsContainerRef}>
					{info.slots.length === 0 ? (
						<div style={{ color: 'var(--secondary-font)', margin: '16px 0' }}>
							No slots for this day.
						</div>
					) : (
						info.slots.map((slot, idx) => (
							<div key={idx} className={styles.timeSlot}>
								<input
									type="time"
									className={styles['slot-input']}
									value={slot.from}
									onChange={(e) => handleSlotChange(idx, 'from', e.target.value)}
								/>
								<span>to</span>
								<input
									type="time"
									className={styles['slot-input']}
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
				</div>
				<div className={styles.addSlot} onClick={addSlot}>
					+ Add Time Slot
				</div>
				<div className={styles.saveButton}>
					<div className={styles['saveButton-text']} onClick={handleSave}>
						Save Changes
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(UpdateSessionSlot);
