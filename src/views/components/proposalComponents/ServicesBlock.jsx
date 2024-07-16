import React, { memo, useState, useEffect, useCallback } from 'react';
import '../../../assets/scss/modules/proposal/servicesBlock.scss';
import ToggleSlider from '../input/slider';
const ServicesBlock = ({ serviceData, onChangeFunc }) => {
	const [info, setInfo] = useState({
		service: serviceData,
	});

	const onChangeValue = useCallback(
		(index, changeType, value) => {
			let updatedServiceData = { ...info?.service };
			const values = updatedServiceData?.values;
			let updatedValue;
			if (changeType === 'title') {
				updatedValue = { ...values?.[index], title: value };
			}
			if (changeType === 'description') {
				updatedValue = { ...values?.[index], description: value };
			}
			if (changeType === 'quantity') {
				updatedValue = { ...values?.[index], quantity: +value };
			}
			if (changeType === 'amount') {
				updatedValue = { ...values?.[index], amount: +value };
			}
			if (changeType === 'show') {
				updatedValue = { ...values?.[index], show: value };
			}
			if (changeType === 'incrementDecrement') {
				let updatedQuantity = (+values?.[index]?.quantity || 0) + value;
				updatedValue = {
					...values?.[index],
					quantity: updatedQuantity > 0 ? updatedQuantity : 0,
				};
			}
			values?.splice(index, 1, updatedValue);
			updatedServiceData.values = values;
			setInfo((prev) => ({ ...prev, service: updatedServiceData }));

			onChangeFunc(updatedServiceData);
		},
		[info?.service, onChangeFunc],
	);

	return (
		<div className="servicesBlockContainer">
			<span className="serviceBlockHeader">
				<span className="serviceHeaderTitle">Service Table</span>
				<span className="serviceSubheadertitle">
					This table outlines the different services that the business will provide to the
					client, including details and pricing.
				</span>
			</span>
			{info?.service?.values?.map((ele, index) => (
				<div className="serviceCard" key={index}>
					<ToggleSlider
						value={ele?.show}
						onChange={(data) => onChangeValue(index, 'show', data)}
					/>
					<div className="seriveContentContainer">
						{/* titile */}
						<div className="inputHolder">
							<span className="serviceTitle">Service Title</span>
							<input
								className="propsalinputContainer"
								value={ele?.title}
								onChange={(event) =>
									onChangeValue(index, 'title', event?.target?.value)
								}
							/>
						</div>
						{/* description */}
						<div className="inputHolder">
							<span className="serviceTitle">Description (Optional)</span>
							<textarea
								className="propsalinputContainer"
								value={ele?.description}
								onChange={(event) =>
									onChangeValue(index, 'description', event?.target?.value)
								}
							/>
						</div>
						{/* //unitPrice and guests */}
						<div className="multipleInputContainer">
							<div className="inputHolder">
								<span className="serviceTitle">Unit Price</span>
								<div className="inputWrapper">
									<span className="currencyHolder">$</span>
									<input
										type="number"
										className="propsalinputContainer"
										style={{ border: 'none' }}
										value={ele?.amount}
										onChange={(event) =>
											onChangeValue(index, 'amount', event?.target?.value)
										}
									/>
								</div>
							</div>
							<div className="inputHolder">
								<span className="serviceTitle">Number of Guests</span>
								<div className="inputWrapper">
									<input
										type="number"
										className="propsalinputContainer"
										style={{ border: 'none' }}
										value={ele?.quantity}
										onChange={(event) =>
											onChangeValue(index, 'quantity', event?.target?.value)
										}
									/>
									<div className="incrementDecrementBtnHolder">
										<span
											className="decrementBtn"
											onClick={() =>
												onChangeValue(index, 'incrementDecrement', -1)
											}
										>
											-
										</span>
										<span
											className="incrementBtn"
											onClick={() =>
												onChangeValue(index, 'incrementDecrement', 1)
											}
										>
											+
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(ServicesBlock);
