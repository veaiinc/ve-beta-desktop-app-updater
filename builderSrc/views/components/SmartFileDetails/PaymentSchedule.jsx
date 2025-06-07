import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/smart-file-components/payment-schedule.scss';
import { DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import ObjectID from 'bson-objectid';
import { ReactComponent as Close } from '../../../assets/svg/smartFile/close.svg';
const PaymentSchedule = ({ editable, data, handlePaymentScheduleChanges }) => {
	const [info, setInfo] = useState({
		paymentSchedule: [],
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
					date: value,
					dueDate: value,
				};
			}

			requiredData.blocks[innerIndex] = requiredBlocks;
			paymentScheduleData[outerIndex] = requiredData;
			handlePaymentScheduleChanges(requiredData);
			setInfo((prev) => ({ ...prev, paymentSchedule: paymentScheduleData }));
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
										<DatePicker
											onChange={(date, dateString) => {
												handlePaymentScheduleChange(
													'date',
													dateString,
													index,
													ind,
												);
											}}
											format={['YYYY-MM-DD', 'DD-MM-YYYY']}
											value={
												payment?.subBlocks?.[0]?.date
													? dayjs(
															`${moment(
																payment?.subBlocks?.[0]?.date,
															)?.format('YYYY-MM-DD')}`,
															'YYYY-MM-DD',
													  )
													: payment?.subBlocks?.[0]?.date || ''
											}
											className={`custominputContainer `}
											style={{ height: '50px' }}
											// disabled={!editable}
											// defaultPickerValue={
											// 	info?.calenderStartDate
											// 		? dayjs(`${info?.calenderStartDate}`, 'YYYY-MM-DD')
											// 		: ''
											// }
											allowClear={false}
										/>
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
