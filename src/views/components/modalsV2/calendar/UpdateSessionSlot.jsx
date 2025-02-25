import React, { memo, useState } from 'react';
import '../../../../assets/scss/calendar/modal/udateSessionSlot.scss';
import ReactModal from '../index';
import { ReactComponent as Delete } from '../../../../assets/svg/ai_assistant/delete.svg';
import { ReactComponent as Clock } from '../../../../assets/svg/workflow/clock.svg';
import { DatePicker } from 'antd';
import moment from 'moment';
import ToggleSwitch from '../../../components/input/slider';

const UpdateSessionSlot = ({ open, closeModal, sessionName }) => {
	const [info, setInfo] = useState({
		repeat: false,
		slots: [{ from: moment(), to: moment().add(1, 'hours') }],
	});

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
		setInfo({
			repeat: false,
			slots: [{ from: moment(), to: moment().add(1, 'hours') }],
		});
	};

	return (
		<ReactModal
			isOpen={open}
			closeModal={ModifyCloseModal}
			modalType={'center'}
			customStyles={{ content: { borderRadius: '24px' } }}
		>
			<div className="updateSessionSlotContainer">
				<div className="sessionHeader">
					<span>{sessionName || 'Session Name'}</span>
					<span className="sessionDate">Friday, 25th Feb 2025</span>
				</div>

				{info?.slots?.map((slot, index) => (
					<div key={index} className="timeSlot">
						<DatePicker
							showTime
							format="hh:mm A"
							picker="time"
							className="timePicker"
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
					<span>Repeat Every Monday</span>
					<ToggleSwitch onChange={(value) => console.log('value', value)} value={true} />
				</div>

				<div className="saveButton">
					<button>Save</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(UpdateSessionSlot);
