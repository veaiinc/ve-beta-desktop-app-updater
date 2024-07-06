import React, { useState, memo, useCallback } from 'react';
import '../../../assets/scss/modules/proposal/eventsBlock.scss';
const EventsBlock = ({ onChangeFunc, selectedIndex, eventData }) => {
	const [info, setInfo] = useState({
		event: eventData,
	});

	const onChangeValue = useCallback(
		async (index, changeType, value, subData) => {
			let updatedEventData = { ...info?.event };
			const values = updatedEventData?.values;
			let updatedValue;
			if (changeType === 'name') {
				updatedValue = { ...values?.[index], name: value };
			}
			if (changeType === 'description') {
				updatedValue = { ...values?.[index], description: value };
			}
			if (changeType === 'location') {
				updatedValue = { ...values?.[index], location: value };
			}
			if (changeType === 'addlServices') {
			}
			if (changeType === 'date') {
				updatedValue = { ...values?.[index], date: value };
			}
			if (changeType === 'addNewRole') {
				let rolesArray = [...(values?.[index]?.roles || [])];
				let targetRoleObj = { ...(rolesArray?.[subData?.categoryInde] || {}) };
				let categoriesArray = [...(targetRoleObj?.categories || [])];
				categoriesArray?.push({ role: '', quantity: 0 });
				targetRoleObj.categories = categoriesArray;
				rolesArray?.splice(subData?.categoryInde, 1, targetRoleObj);
				updatedValue = { ...values?.[index], roles: rolesArray };
			}
			if (changeType === 'roleLabel') {
				let rolesArray = [...(values?.[index]?.roles || [])];
				let targetRoleObj = { ...(rolesArray?.[subData?.categoryInde] || {}) };
				let categoriesArray = [...(targetRoleObj?.categories || [])];
				let updatedRoleValues = {
					...categoriesArray?.[subData?.roleIndex],
					category: value,
				};
				categoriesArray?.splice(subData?.roleIndex, 1, updatedRoleValues);
				targetRoleObj.categories = categoriesArray;
				rolesArray?.splice(subData?.categoryInde, 1, targetRoleObj);
				updatedValue = { ...values?.[index], roles: rolesArray };
			}
			if (
				changeType === 'roleCount' ||
				changeType === 'roleCountIncrement' ||
				changeType === 'roleCountDecrement'
			) {
				let rolesArray = [...(values?.[index]?.roles || [])];
				let targetRoleObj = { ...(rolesArray?.[subData?.categoryInde] || {}) };
				let categoriesArray = [...(targetRoleObj?.categories || [])];
				let newQuantity =
					changeType === 'roleCount'
						? +value
						: (+categoriesArray?.[subData?.roleIndex]?.quantity || 0) + value;

				let updatedRoleValues = {
					...categoriesArray?.[subData?.roleIndex],
					quantity: newQuantity > 0 ? newQuantity : 0,
				};
				categoriesArray?.splice(subData?.roleIndex, 1, updatedRoleValues);
				targetRoleObj.categories = categoriesArray;
				rolesArray?.splice(subData?.categoryInde, 1, targetRoleObj);
				updatedValue = { ...values?.[index], roles: rolesArray };
			}

			values?.splice(index, 1, updatedValue);
			updatedEventData.values = values;
			setInfo((prev) => ({ ...prev, event: updatedEventData }));
			onChangeFunc(updatedEventData, selectedIndex);
		},
		[info?.event, selectedIndex, onChangeFunc],
	);

	const addNewEvent = useCallback(() => {
		const newDummyObj = {
			name: '',
			description: '',
			date: 0,
			location: '',
			addlServices: [],
			roles: [
				{
					type: 'cinematographer',
					categories: [
						{
							category: 'candid',
							quantity: 0,
						},
						{
							category: 'traditional',
							quantity: 0,
						},
					],
				},
				{
					type: 'photographer',
					categories: [
						{
							category: 'candid',
							quantity: 0,
						},
						{
							category: 'traditional',
							quantity: 0,
						},
					],
				},
				{
					type: 'support',
					categories: [
						{
							category: 'candid',
							quantity: 0,
						},
						{
							category: 'traditional',
							quantity: 0,
						},
					],
				},
			],
		};
		let updatedEventData = { ...info?.event };
		updatedEventData?.values?.push(newDummyObj);
		setInfo((prev) => ({ ...prev, event: updatedEventData }));
		onChangeFunc(updatedEventData, selectedIndex);
	}, [info?.event, selectedIndex, onChangeFunc]);

	return (
		<div className="eventsBlockContainer">
			<span className="serviceBlockHeader">
				<span className="serviceHeaderTitle">Event Table</span>
				<span className="serviceSubheadertitle">
					This table outlines the different events that will be covered by the business,
					including dates, locations, and descriptions.
				</span>
			</span>
			{/* //use Map here */}
			{info?.event?.values?.map((ele, index) => (
				<div className="eventCardContainer" key={index}>
					{/* //event name and date */}
					<div className="multipleInputContainer">
						<div className="inputHolder">
							<span className="serviceTitle">Event Name</span>
							<input
								type="text"
								className="propsalinputContainer"
								value={ele?.name}
								onChange={(event) =>
									onChangeValue(index, 'name', event?.target?.value)
								}
							/>
						</div>
						<div className="inputHolder">
							<span className="serviceTitle">Date</span>
							<input
								type="date"
								className="propsalinputContainer"
								value={ele?.date}
								onChange={(event) =>
									onChangeValue(index, 'date', event?.target?.value)
								}
							/>
						</div>
					</div>
					{/* //location and guests */}
					<div className="multipleInputContainer">
						<div className="inputHolder">
							<span className="serviceTitle">Location</span>
							<input
								type="text"
								className="propsalinputContainer"
								value={ele?.location}
								onChange={(event) =>
									onChangeValue(index, 'location', event?.target?.value)
								}
							/>
						</div>
						<div className="inputHolder">
							<span className="serviceTitle">Number of Guests</span>
							<div className="inputWrapper">
								<input
									type="number"
									className="propsalinputContainer"
									style={{ border: 'none' }}
								/>
								<div className="incrementDecrementBtnHolder">
									<span className="decrementBtn">-</span>
									<span className="incrementBtn">+</span>
								</div>
							</div>
						</div>
					</div>
					{/* //photographers and other data */}
					<div className="photographersRoleData">
						{ele?.roles?.map((item, ind) => (
							<div className="rolesinfo" key={ind}>
								<span className="roleHeader">{item?.type}</span>
								<div className="rolesOverflowContainer">
									{item?.categories?.map((rolesInfo, roleIndex) => (
										<div className="rolesdetailsContainer" key={roleIndex}>
											<div className="countIncrementor">
												<span
													className="decrementBtn"
													onClick={() =>
														onChangeValue(
															index,
															'roleCountDecrement',
															-1,
															{
																roleIndex,
																categoryInde: ind,
															},
														)
													}
												>
													-
												</span>
												<input
													type="number"
													className="countInput"
													placeholder="0"
													value={rolesInfo?.quantity}
													onChange={(event) =>
														onChangeValue(
															index,
															'roleCount',
															event.target.value,
															{ roleIndex, categoryInde: ind },
														)
													}
												/>
												<span
													className="incrementBtn"
													onClick={() =>
														onChangeValue(
															index,
															'roleCountIncrement',
															1,
															{
																roleIndex,
																categoryInde: ind,
															},
														)
													}
												>
													+
												</span>
											</div>
											<input
												type="text"
												className="roles"
												placeholder="Role"
												value={rolesInfo?.category}
												onChange={(event) =>
													onChangeValue(
														index,
														'roleLabel',
														event.target.value,
														{ roleIndex, categoryInde: ind },
													)
												}
											/>
										</div>
									))}

									<span
										className="addRoleBtn"
										onClick={(event) =>
											onChangeValue(index, 'addNewRole', '', {
												categoryInde: ind,
											})
										}
									>
										+ Add role
									</span>
								</div>
							</div>
						))}
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
				</div>
			))}

			<div className="addEventBtn" onClick={addNewEvent}>
				+ Add Event
			</div>
		</div>
	);
};

export default memo(EventsBlock);
