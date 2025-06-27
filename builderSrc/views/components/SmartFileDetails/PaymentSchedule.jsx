import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/smart-file-components/payment-schedule.scss';
import { DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import ObjectID from 'bson-objectid';
import { ReactComponent as Close } from '../../../assets/svg/smartFile/close.svg';
import { ReactComponent as UpDown } from '../library/svgs/dropDown.svg';
const PaymentSchedule = ({ editable, data, handlePaymentScheduleChanges, invoiceDates = {} }) => {
	const [info, setInfo] = useState({
		paymentSchedule: [],
	});
	const [dateValues, setDateValues] = useState({
		showDateInput: false,
		currentDateInput: null,
		activeDateId: null,
		showDateOptions: false,
	});

	useEffect(() => {
		setInfo((prev) => ({ ...prev, paymentSchedule: [...(data || [])] }));
	}, [data]);

	const handlePaymentScheduleChange = useCallback(
		(type, value, outerIndex, innerIndex) => {
			const paymentScheduleData = [...(info?.paymentSchedule || [])];

			let requiredData = paymentScheduleData?.[outerIndex];
			let requiredBlocks = { ...requiredData?.blocks?.[innerIndex] };

			if (type === 'amountPercentage') {
				let val = value?.replace(/[^0-9]/g, '');
				val = val <= 100 ? +val : -1;
				if (val === -1) {
					return message.error('Percentage cannot be greater than 100');
				}
				requiredBlocks.subBlocks[0] = {
					...(requiredBlocks.subBlocks?.[0] || {}),
					amountPercentage: +val,
				};
			}

			if (type === 'date') {
				requiredBlocks.subBlocks[0] = {
					...(requiredBlocks.subBlocks?.[0] || {}),
					date: value?.includes('-') ? value : requiredBlocks.subBlocks[0]?.date,
					dueDate: value,
					type: value?.includes('-') ? 'custom Date' : value,
				};
			}

			requiredData.blocks[innerIndex] = requiredBlocks;
			paymentScheduleData[outerIndex] = requiredData;
			handlePaymentScheduleChanges(requiredData);
			setInfo((prev) => ({ ...prev, paymentSchedule: paymentScheduleData }));
			if (type === 'date') {
				setDateValues((prev) => ({
					...prev,
					showDateInput: false,
					showDateOptions: false,
					currentDateInput: prev.currentDateInput ? prev.currentDateInput : null,
				}));
			}
		},
		[info, handlePaymentScheduleChanges],
	);

	const handleAddRemoveInstallments = useCallback(
		(type, outerIndex, innerIndex) => {
			const paymentScheduleData = [...(info?.paymentSchedule || [])];

			let requiredData = paymentScheduleData?.[outerIndex];

			if (type === 'add') {
				const newBlockData = {
					className: `payment-schedule-${requiredData?.blocks?.length}`,
					subBlocks: [
						{
							amount: 0,
							amountPercentage: 0,
							dueDate: '',
							equalValue: '',
							paymentDate: null,
							paymentId: null,
							status: 'upcoming',
							type: '',
							_id: ObjectID().toString(),
						},
					],
					order: 1,
					_id: ObjectID().toString(),
				};
				requiredData.blocks.push(newBlockData);
			}

			if (type === 'remove') {
				requiredData?.blocks?.splice(innerIndex, 1);
			}

			paymentScheduleData[outerIndex] = requiredData;
			handlePaymentScheduleChanges(requiredData);
			setInfo((prev) => ({ ...prev, paymentSchedule: paymentScheduleData }));
		},
		[info, handlePaymentScheduleChanges],
	);

	// functin for rendering and returning Date of Installment
	const renderDateInput = (block, sectionIndex, blockIndex) => {
		const data = block?.subBlocks[0];
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		if (dateValues?.showDateInput && dateValues.currentDateInput === blockIndex) {
			return (
				<DatePicker
					onChange={(date, dateString) => {
						handlePaymentScheduleChange('date', dateString, sectionIndex, blockIndex);
					}}
					format={['YYYY-MM-DD', 'DD-MM-YYYY']}
					value={
						data?.date
							? dayjs(`${moment(data?.date)?.format('YYYY-MM-DD')}`, 'YYYY-MM-DD')
							: data?.date || ''
					}
					className={`custominputContainer `}
					style={{ height: '50px' }}
					allowClear={false}
				/>
			);
		}
		const dueDate = new Date(data.type === 'custom Date' && data.dueDate);
		const invoiceSentDate = new Date(invoiceDates?.invoiceSentDate * 1000);
		const invoiceAcceptedDate = new Date(invoiceDates?.invoiceAcceptedDate * 1000);
		return (
			<>
				<p
					style={{
						color: '#e8e8e8',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						width: '80%',
					}}
				>
					{data?.type === 'custom Date'
						? dueDate?.toLocaleDateString('en-US', options)
						: data?.type === 'invoice Sent Date' && invoiceDates?.invoiceSentDate
						? invoiceSentDate?.toLocaleDateString('en-US', options)
						: data?.type === 'invoice Accepted Date' &&
						  invoiceDates?.invoiceAcceptedDate
						? invoiceAcceptedDate?.toLocaleDateString('en-US', options)
						: data?.dueDate}
				</p>

				<UpDown
					onClick={() => {
						if (dateValues?.activeDateId != blockIndex) {
							setDateValues((prev) => ({
								...prev,
								showDateOptions: true,
								activeDateId: blockIndex,
							}));
						} else {
							setDateValues((prev) => ({
								...prev,
								showDateOptions: !dateValues?.showDateOptions,
							}));
						}
					}}
					style={{
						cursor: 'pointer',
					}}
				/>
			</>
		);
	};

	// function for date input on Blur
	const handleDateInputBlur = (e) => {
		if (!e.relatedTarget || !e.relatedTarget.closest('.date-input-calendar')) {
			setDateValues((prev) => ({
				...prev,
				showDateInput: false,
				currentDateInput: null,
			}));
		}
	};
	return (
		<>
			{info?.paymentSchedule?.length &&
			info.paymentSchedule.some((ele) => ele?.blocks?.length > 0)
				? info?.paymentSchedule?.map((ele, index) => (
						<div className="paymentScheduleSuperParentContainer" key={index}>
							<span className="paymentsBlockTitle">Payment Schedule</span>
							<div className="paymentScheduleParentContainer">
								{ele?.blocks?.map((payment, ind, array) => (
									<div className="paymentScheduleRowContainer" key={index}>
										<span className="paymentScheduleRowContainerlabel">
											Installment - {ind + 1}
										</span>
										<div className="paymentPercentageContainer">
											<input
												type="text"
												className="paymentInputContainer"
												value={
													ele?.style?.isEqualPercentage
														? Number((100 / array?.length).toFixed(2))
														: payment?.subBlocks?.[0]?.amountPercentage
												}
												onChange={(e) =>
													handlePaymentScheduleChange(
														'amountPercentage',
														e?.target?.value,
														index,
														ind,
													)
												}
												readOnly={ele?.style?.isEqualPercentage}
											/>
											<span>%</span>
										</div>
										<div
											className="custominputContainer"
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												// maxWidth: '190px',
											}}
										>
											{renderDateInput(payment, index, ind)}
										</div>
										{dateValues?.showDateOptions &&
											dateValues?.activeDateId === ind && (
												<div className="payment-date-drop-down">
													<p
														onClick={(e) => {
															e.stopPropagation();
															handlePaymentScheduleChange(
																'date',
																'invoice Sent Date',
																index,
																ind,
															);
														}}
													>
														Invoice Sent Date
													</p>
													<p
														onClick={(e) => {
															e.stopPropagation();
															handlePaymentScheduleChange(
																'date',
																'invoice Accepted Date',
																index,
																ind,
															);
														}}
													>
														Invoice Accepted Date
													</p>
													<p
														onClick={() =>
															setDateValues((prev) => ({
																...prev,
																showDateInput: true,
																showDateOptions: false,
																currentDateInput: ind,
															}))
														}
													>
														Custom Date
													</p>
												</div>
											)}
										<span
											className="removeRoleContainer"
											onClick={() =>
												handleAddRemoveInstallments('remove', index, ind)
											}
											style={{ cursor: 'pointer' }}
										>
											<Close />
										</span>
									</div>
								))}

								<div
									className="addMoreInstallmentsBtn"
									onClick={() => handleAddRemoveInstallments('add', index)}
								>
									+ Add Installments
								</div>
							</div>
						</div>
				  ))
				: null}
		</>
	);
};

export default memo(PaymentSchedule);
