import { memo, useCallback, useEffect, useState } from 'react';
import '../../../../assets/scss/calendar/modal/udateSessionSlot.scss';
import ReactModal from '../index';
import { ReactComponent as Delete } from '../../../../assets/svg/ai_assistant/delete.svg';
import { ReactComponent as Down } from '../../../../assets/svg/calendar/down.svg';
import { ReactComponent as Clock } from '../../../../assets/svg/workflow/clock.svg';
import { Tooltip, DatePicker } from 'antd';
import moment from 'moment';
import ToggleSwitch from '../../../components/input/slider';

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
	const [info, setInfo] = useState({
		repeat: false,
		slots: [{ from: moment().startOf('day'), to: moment().startOf('day').add(1, 'hours') }],
		selectedSession: null,
		sessionTypeOpen: false,
		sessionWindow: {
			startDate: moment().format('YYYY-MM-DD'),
			endDate: moment().add(1, 'week').format('YYYY-MM-DD'),
		},
	});

	useEffect(() => {
		if (selectedSlotData) {
			// If editing an existing session
			const session = schedulerList?.find((s) => s._id === selectedSlotData._id);
			if (session) {
				// Get the first availability slot's time ranges
				const firstAvailabilitySlot = session.availabilitySlots?.[0];
				const timeRanges = firstAvailabilitySlot?.timeRanges || [];

				const slots = timeRanges.map((range) => ({
					from: moment(range.startTime, 'HH:mm').isValid()
						? moment(range.startTime, 'HH:mm')
						: moment().startOf('day'),
					to: moment(range.endTime, 'HH:mm').isValid()
						? moment(range.endTime, 'HH:mm')
						: moment().startOf('day').add(1, 'hours'),
				}));

				setInfo((prev) => ({
					...prev,
					selectedSession: session,
					slots:
						slots.length > 0
							? slots
							: [
									{
										from: moment().startOf('day'),
										to: moment().startOf('day').add(1, 'hours'),
									},
							  ],
					sessionWindow: {
						startDate:
							session.sessionWindow?.startDate || moment().format('YYYY-MM-DD'),
						endDate:
							session.sessionWindow?.endDate ||
							moment().add(1, 'week').format('YYYY-MM-DD'),
					},
				}));
			}
		} else if (schedulerList?.length > 0) {
			// If creating a new session
			setInfo((prev) => ({
				...prev,
				selectedSession: schedulerList[0],
				slots: [
					{ from: moment().startOf('day'), to: moment().startOf('day').add(1, 'hours') },
				],
				sessionWindow: {
					startDate: moment().format('YYYY-MM-DD'),
					endDate: moment().add(1, 'week').format('YYYY-MM-DD'),
				},
			}));
		}
	}, [schedulerList, selectedSlotData]);

	const addSlot = () => {
		setInfo((prev) => ({
			...prev,
			slots: [
				...prev.slots,
				{
					from: moment().startOf('day'),
					to: moment().startOf('day').add(1, 'hours'),
				},
			],
		}));
	};

	const removeSlot = (index) => {
		setInfo((prev) => ({
			...prev,
			slots: prev.slots.filter((_, i) => i !== index),
		}));
	};

	const ModifyCloseModal = () => {
		closeModal();
		setInfo((prev) => ({
			...prev,
			repeat: false,
			slots: [{ from: moment().startOf('day'), to: moment().startOf('day').add(1, 'hours') }],
			selectedSession: schedulerList[0] || null,
			sessionTypeOpen: false,
			sessionWindow: {
				startDate: moment().format('YYYY-MM-DD'),
				endDate: moment().add(1, 'week').format('YYYY-MM-DD'),
			},
		}));
	};

	const handleSave = useCallback(() => {
		if (!info.selectedSession) return;

		// Get the selected day and date from selectedSlotData
		const selectedDay = selectedSlotData?.selectedDay || 'Monday';
		const selectedDate = selectedSlotData?.selectedDate;

		// Get the week range for the selected date
		const selectedMoment = moment(selectedDate, 'D/M');
		const weekStart = selectedMoment.clone().startOf('isoWeek');
		const weekEnd = selectedMoment.clone().endOf('isoWeek');

		// Format the slots data to match SchedulerAvailability structure
		const formattedSlots = [
			{
				dayOfWeek: selectedDay,
				timeRanges: info.slots.map((slot) => ({
					startTime: slot.from.format('HH:mm'),
					endTime: slot.to.format('HH:mm'),
				})),
			},
		];

		// Create the updated session object with only availabilitySlots and correct date range
		const updatedSession = {
			...info.selectedSession,
			availabilitySlots: formattedSlots,
			sessionWindow: {
				type: 'fixed_date_range',
				startDate: weekStart.format('YYYY-MM-DD'),
				endDate: weekEnd.format('YYYY-MM-DD'),
			},
		};

		// Update the session in the parent component
		if (updateCalendarInfo) {
			updateCalendarInfo(updatedSession);
		}

		ModifyCloseModal();
	}, [info.selectedSession, info.slots, updateCalendarInfo, selectedSlotData]);

	const handleTimeChange = (value, index, type) => {
		if (!value || !value.isValid()) return;

		setInfo((prev) => ({
			...prev,
			slots: prev.slots.map((slot, i) => {
				if (i === index) {
					const newTime = moment().startOf('day').set({
						hour: value.hour(),
						minute: value.minute(),
					});
					return {
						...slot,
						[type]: newTime,
					};
				}
				return slot;
			}),
		}));
	};

	return (
		<ReactModal
			isOpen={open}
			closeModal={ModifyCloseModal}
			modalType={'center'}
			customStyles={customStyles}
		>
			<div className="updateSessionSlotContainer">
				<div className="sessionHeader">
					<Tooltip
						open={info?.sessionTypeOpen}
						onOpenChange={(visible) =>
							setInfo((prev) => ({
								...prev,
								sessionTypeOpen: visible,
							}))
						}
						placement="bottom"
						title={
							<div className="sessionName-dropdown">
								{schedulerList?.map((option) => (
									<div
										key={option._id}
										className="sessionName-dropdown-item"
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
						<div className="selectedSession-lable">
							{info?.selectedSession?.sessionName}
							<Down className={`${info?.sessionTypeOpen ? 'open' : ''}`} />
						</div>
					</Tooltip>
				</div>

				{info?.slots?.map((slot, index) => (
					<div key={index} className="timeSlot">
						<DatePicker
							showTime
							format="hh:mm A"
							picker="time"
							className="timePicker"
							value={slot.from}
							onChange={(value) => handleTimeChange(value, index, 'from')}
							suffixIcon={<Clock />}
						/>
						<span>to</span>
						<DatePicker
							showTime
							format="hh:mm A"
							picker="time"
							className="timePicker"
							value={slot.to}
							onChange={(value) => handleTimeChange(value, index, 'to')}
							suffixIcon={<Clock />}
						/>
						<Delete onClick={() => removeSlot(index)} />
					</div>
				))}

				<div className="addSlot" onClick={addSlot}>
					+ Add Another Time
				</div>

				<div className="disableAvailability">Disable Availability</div>

				<div className="repeatToggle">
					<span>Repeat Every day</span>
					<ToggleSwitch
						onChange={(value) => setInfo((prev) => ({ ...prev, repeat: value }))}
						value={info.repeat}
					/>
				</div>

				<div className="saveButton">
					<button onClick={handleSave}>Save</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(UpdateSessionSlot);
