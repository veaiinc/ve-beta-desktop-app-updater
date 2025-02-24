import React, { memo, useCallback, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/calendar/modal/createSessionModal.scss';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { ReactComponent as Down } from '../../../../assets/svg/calendar/down.svg';
import InputComponent from '../../ai_assistant/InputComponent';
import { Tooltip } from 'antd';

const sessionTypeOptions = ['In Person', 'Phone Call', 'Video Call'];
const sessionTypeInputOptions = ['In Person', 'Phone Call', 'Video Call'];

const initialInfo = {
	sessionName: '',
	sessionDescription: '',
	addDiscription: false,
	sessionType: 'In Person',
	sessionTypeInput: 'In Person',
	sessionTypeOpen: false,
	sessionTypeInputOpen: false,
};

const CreateSessionModal = ({ open, closeModal }) => {
	const [info, setInfo] = useState({
		...initialInfo,
	});

	const ModifyCloseModal = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			...initialInfo,
		}));
		closeModal();
	}, [closeModal]);

	const handleSessionTypeChange = (type) => {
		setInfo((prev) => ({
			...prev,
			sessionType: type,
			sessionTypeOpen: false,
		}));
	};

	const handleSessionTypeInputChange = (type) => {
		setInfo((prev) => ({
			...prev,
			sessionTypeInput: type,
			sessionTypeInputOpen: false,
		}));
	};

	const handleSessionTypeDropdownVisibility = (visible) => {
		setInfo((prev) => ({
			...prev,
			sessionTypeOpen: visible,
		}));
	};

	const handleSessionTypeInputDropdownVisibility = (visible) => {
		setInfo((prev) => ({
			...prev,
			sessionTypeInputOpen: visible,
		}));
	};

	return (
		<ReactModal
			isOpen={open}
			closeModal={ModifyCloseModal}
			modalType={'center'}
			customStyles={{ content: { borderRadius: '24px' } }}
		>
			<div className="createSessionModalParentContainer">
				<div className="sessionHeader">
					<span>Create a Session</span>
					<Close onClick={ModifyCloseModal} />
				</div>
				<InputComponent
					value={info?.sessionName}
					onChange={(e) => setInfo({ ...info, sessionName: e.target.value })}
					placeholder={'Session name'}
				/>
				<div
					className={`addSessionDesc ${info?.addDiscription ? 'hidden' : ''}`}
					onClick={() =>
						setInfo((prev) => ({ ...prev, addDiscription: !prev.addDiscription }))
					}
				>
					Add Instruction
				</div>

				<div
					className={`sessionDescriptionWrapper ${info?.addDiscription ? 'visible' : ''}`}
				>
					<InputComponent
						value={info?.sessionDescription}
						onChange={(e) =>
							setInfo((prev) => ({
								...prev,
								sessionDescription: e.target.value,
							}))
						}
						placeholder={'Session description'}
					/>
				</div>

				<div className="sessionOptionContainer">
					<div className="sessionTypeWrapper">
						<span>Session Type</span>
						<Tooltip
							open={info?.sessionTypeOpen}
							onOpenChange={handleSessionTypeDropdownVisibility}
							placement="bottom"
							title={
								<div className="sessionType-dropdown">
									{sessionTypeOptions?.map((option) => (
										<div
											key={option}
											className="sessionType-dropdown-item"
											onClick={() => handleSessionTypeChange(option)}
										>
											{option}
										</div>
									))}
								</div>
							}
							arrow={false}
							trigger={'click'}
							color={'transparent'}
							overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
						>
							<div className="typeOfSession-dropdown">
								{info?.sessionType}
								<Down className={`${info?.sessionTypeOpen ? 'open' : ''}`} />
							</div>
						</Tooltip>
					</div>
					<div className="sessionTypeWrapper">
						<span>Session type input</span>
						{/* here will go the inputs based on the session type */}
					</div>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CreateSessionModal);
