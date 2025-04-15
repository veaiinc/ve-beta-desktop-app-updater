import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../../assets/scss/calendar/modal/udateSessionSlot.scss';
import ReactModal from '../index';
import { ReactComponent as Delete } from '../../../../assets/svg/ai_assistant/delete.svg';
import { ReactComponent as Down } from '../../../../assets/svg/calendar/down.svg';
import { ReactComponent as Clock } from '../../../../assets/svg/workflow/clock.svg';
import { Tooltip, DatePicker } from 'antd';
import moment from 'moment';
import ToggleSwitch from '../../../components/input/slider';

const UpdateSessionSlot = ({ open, closeModal, schedulerList, selectedSlotData }) => {
	const [info, setInfo] = useState({
		repeat: false,
		slots: [{ from: moment(), to: moment().add(1, 'hours') }],
		selectedSession: null,
	});

	useEffect(() => {
		if (schedulerList?.length > 0 && selectedSlotData) {
			const session = schedulerList?.find(
				(s) => s.sessionName === selectedSlotData.selectedSlot.sessionName,
			);
			if (session) {
				setInfo((prev) => ({
					...prev,
					selectedSession: session,
					slots: [
						{
							from: moment(selectedSlotData.selectedSlot.startTime, 'HH:mm'),
							to: moment(selectedSlotData.selectedSlot.endTime, 'HH:mm'),
						},
					],
				}));
			}
		} else if (schedulerList?.length > 0) {
			setInfo((prev) => ({
				...prev,
				selectedSession: schedulerList[0],
			}));
		}
	}, [schedulerList, selectedSlotData]);

	const addSlot = () => {
		setInfo((prev) => ({
			...prev,
			slots: [...prev.slots, { from: moment(), to: moment().add(1, 'hours') }],
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
			slots: [{ from: moment(), to: moment().add(1, 'hours') }],
			selectedSession: schedulerList[0] || null,
		}));
	};

	const handleSave = useCallback(() => {
		ModifyCloseModal();
	}, []);

	return (
		<ReactModal
			isOpen={open}
			closeModal={ModifyCloseModal}
			modalType={'center'}
			customStyles={{
				content: { zIndex: 1003, borderRadius: '24px' },
				overlay: { zIndex: 1002 },
			}}
		>
			<div className="updateSessionSlotContainer">
				<div className="sessionHeader">
					{/* <span>{sessionName || 'Session Name'}</span> */}
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
					<span className="sessionDate">
						{selectedSlotData
							? `${selectedSlotData.selectedDay}, ${selectedSlotData.selectedDate}`
							: 'Select a date'}
					</span>
				</div>

				{info?.slots?.map((slot, index) => (
					<div key={index} className="timeSlot">
						<DatePicker
							showTime
							format="hh:mm A"
							picker="time"
							className="timePicker"
							value={slot.from}
							onChange={(value) =>
								setInfo((prev) => ({
									...prev,
									slots: prev?.slots?.map((s, i) =>
										i === index ? { ...s, from: value } : s,
									),
								}))
							}
							suffixIcon={<Clock />}
						/>
						<span>to</span>
						<DatePicker
							showTime
							format="hh:mm A"
							picker="time"
							className="timePicker"
							value={slot.to}
							onChange={(value) =>
								setInfo((prev) => ({
									...prev,
									slots: prev?.slots?.map((s, i) =>
										i === index ? { ...s, to: value } : s,
									),
								}))
							}
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
					<span>Repeat Every {selectedSlotData?.selectedDay || 'day'}</span>
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
