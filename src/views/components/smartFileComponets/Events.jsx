import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';
import { ReactComponent as Dustbin } from '../../../assets/svg/worflow_builder/dustbin.svg';

const Events = ({ eventsData, eventsDataChange }) => {
	const [info, setInfo] = useState({
		data: [],
	});

	useEffect(() => {
		if (eventsData) {
			setInfo((prev) => ({ ...prev, data: [].concat(...Object.values(eventsData)) }));
		}
	}, [eventsData]);

	const localEventsOnchange = useCallback(
		async (innerIndex, outerIndex, type, val) => {
			let updatedData = [...(info?.data || [])];
			let selectedEventsTable = updatedData?.[outerIndex];
			let valueTobeChanged = selectedEventsTable?.values?.[innerIndex];

			if (type === 'name') {
				valueTobeChanged = { ...valueTobeChanged, name: val };
			}
			if (type === 'location') {
				valueTobeChanged = { ...valueTobeChanged, location: val };
			}
			if (type === 'date') {
				valueTobeChanged = { ...valueTobeChanged, date: val };
			}

			selectedEventsTable?.values?.splice(innerIndex, 1, valueTobeChanged);
			updatedData?.splice(outerIndex, 1, selectedEventsTable);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			eventsDataChange(selectedEventsTable);
		},
		[info?.data],
	);

	const addMoreEventsValues = useCallback(
		async (outerIndex) => {
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
			let updatedData = [...(info?.data || [])];
			let selectedEventsArray = updatedData?.[outerIndex];
			selectedEventsArray?.values?.push(newDummyObj);
			updatedData?.splice(outerIndex, 1, selectedEventsArray);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			eventsDataChange(selectedEventsArray);
		},
		[info?.data],
	);

	const deletEventsValues = useCallback(
		async (innerIndex, outerIndex) => {
			let updatedData = [...(info?.data || [])];
			let selectedEventsArray = updatedData?.[outerIndex];
			selectedEventsArray?.values?.splice(innerIndex, 1);
			updatedData?.splice(outerIndex, 1, selectedEventsArray);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			eventsDataChange(selectedEventsArray);
		},
		[info?.data],
	);

	return info?.data?.map((ele, index) => (
		<div className="eventsParentContainer" key={index}>
			<span className="eventsTitle">Events {index + 1}</span>
			{/* //use map here */}
			{ele?.values?.map((item, ind) => (
				<div className="eventsCard" key={ind}>
					<div
						className="deleteEventsContainer"
						onClick={() => deletEventsValues(ind, index)}
					>
						<Dustbin />
						Delete
					</div>
					<div className="eventsDetailsContainer">
						<div className="inputWithLabelContainer">
							<span className="labelName">Event Name</span>
							<input
								className="custominputContainer"
								value={item?.name}
								onChange={(e) =>
									localEventsOnchange(ind, index, 'name', e.target.value)
								}
							/>
						</div>
						<div className="inputWithLabelContainer">
							<span className="labelName">Date</span>
							<input
								className="custominputContainer"
								type="date"
								value={item?.date}
								onChange={(e) =>
									localEventsOnchange(ind, index, 'date', e.target.value)
								}
							/>
						</div>
						<div className="inputWithLabelContainer">
							<span className="labelName">Location</span>
							<input
								className="custominputContainer"
								value={item?.location}
								onChange={(e) =>
									localEventsOnchange(ind, index, 'location', e.target.value)
								}
							/>
						</div>
					</div>
					<div className="servicesContainer">
						<span className="serviceContainerTitle">Services Provided</span>

						{/* //use map here */}
						<div className="serviceRoleContainer">
							<input className="customInputWithoutLabel" />
							<div className="incrementDecrementContainer">
								<span className="incrementorBtns">-</span>
								<input type="number" className="incrementDecrementinput" />
								<span className="incrementorBtns">+</span>
							</div>
						</div>
						<div className="serviceRoleContainer">
							<input className="customInputWithoutLabel" />
							<div className="incrementDecrementContainer">
								<span className="incrementorBtns">-</span>
								<input type="number" className="incrementDecrementinput" />
								<span className="incrementorBtns">+</span>
							</div>
						</div>

						{/* //add role btn */}
						<div className="addMoreRoleBtn">+ Add Role</div>
					</div>
				</div>
			))}
			<div className="addEventBtn" onClick={() => addMoreEventsValues(index)}>
				+ Add Event
			</div>
		</div>
	));
};

export default memo(Events);
