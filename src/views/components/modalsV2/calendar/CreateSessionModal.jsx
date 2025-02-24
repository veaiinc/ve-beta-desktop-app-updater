import React, { memo, useCallback, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/calendar/modal/createSessionModal.scss';
import { ReactComponent as Close } from '../../../../assets/svg/close.svg';
import { ReactComponent as Down } from '../../../../assets/svg/calendar/down.svg';
import { ReactComponent as DateSvg } from '../../../../assets/svg/calendar/date.svg';
import InputComponent from '../../ai_assistant/InputComponent';
import { Tooltip, DatePicker } from 'antd';
import moment from 'moment';

const sessionTypeOptions = ['In Person', 'Phone Call', 'Video Call'];

const sessionTypeInputConfig = {
	'In Person': {
		value: 'location',
		tag: 'Location',
		type: 'text',
		placeholder: 'Enter location',
	},
	'Phone Call': {
		value: 'phoneNumber',
		tag: 'Phone Number',
		type: 'number',
		placeholder: 'Enter phone number',
	},
	'Video Call': {
		value: 'videoLink',
		tag: 'Platform Link',
		type: 'url',
		placeholder: 'Enter video call link',
	},
};

const initialInfo = {
	sessionName: '',
	sessionDescription: '',
	addDiscription: false,
	sessionType: 'In Person',
	sessionTypeOpen: false,
	location: '',
	phoneNumber: '',
	videoLink: '',
	scheduleFrom: moment().format('DD MMM YYYY hh:mm A'),
	scheduleTo: moment().add(1, 'weeks').format('DD MMM YYYY hh:mm A'),
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

	const handleSessionTypeChange = useCallback((type) => {
		if (type === info?.sessionDescription) return;
		setInfo((prev) => ({
			...prev,
			sessionType: type,
			sessionTypeOpen: false,
			location: '',
			phoneNumber: '',
			videoLink: '',
		}));
	}, []);

	const renderSessionTypeInput = () => {
		const config = sessionTypeInputConfig[info.sessionType];
		return (
			<InputComponent
				type={config.type}
				value={info[config.value]}
				onChange={(e) =>
					setInfo((prev) => ({
						...prev,
						[config.value]: e.target.value,
					}))
				}
				placeholder={config.placeholder}
				className="inputHeight"
			/>
		);
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
					className="inputHeight"
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
						className="inputHeight"
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
							onOpenChange={(visible) =>
								setInfo((prev) => ({
									...prev,
									sessionTypeOpen: visible,
								}))
							}
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
							<div className="typeOfSession-lable">
								{info?.sessionType}
								<Down className={`${info?.sessionTypeOpen ? 'open' : ''}`} />
							</div>
						</Tooltip>
					</div>
					<div className="sessionTypeWrapper">
						<span>{sessionTypeInputConfig[info?.sessionType]?.tag}</span>
						{renderSessionTypeInput()}
					</div>
				</div>

				<div className="sessionOptionContainer">
					<div className="sessionTypeWrapper">
						<span>From</span>
						<Tooltip
							open={info?.fromOpen}
							onOpenChange={(visible) =>
								setInfo((prev) => ({
									...prev,
									fromOpen: visible,
								}))
							}
							placement="bottom"
							arrow={false}
							trigger={'click'}
							title={
								<DatePicker
									format="MMMM DD, YYYY hh:mm A"
									allowClear
									ghost
									showTime={true}
									onChange={(value) =>
										setInfo((prev) => ({
											...prev,
											scheduleFrom:
												moment(value).format('DD MMM YYYY hh:mm A'),
										}))
									}
								/>
							}
						>
							<div className="typeOfSession-lable">
								{info?.scheduleFrom}
								<DateSvg />
							</div>
						</Tooltip>
					</div>
					<div className="sessionTypeWrapper">
						<span>To</span>
						<Tooltip
							open={info?.toOpen}
							onOpenChange={(visible) =>
								setInfo((prev) => ({
									...prev,
									toOpen: visible,
								}))
							}
							placement="bottom"
							title={
								<DatePicker
									format="MMMM DD, YYYY hh:mm A"
									allowClear
									ghost
									showTime={true}
									onChange={(value) =>
										setInfo((prev) => ({
											...prev,
											scheduleTo: moment(value).format('DD MMM YYYY hh:mm A'),
										}))
									}
								/>
							}
							arrow={false}
							trigger={'click'}
							overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
						>
							<div className="typeOfSession-lable">
								{info?.scheduleTo}
								<DateSvg />
							</div>
						</Tooltip>
					</div>
				</div>

				<div className="scheduleBtnContainer">
					<button className="scheduleBtn">Create</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default memo(CreateSessionModal);
