import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';
import { ReactComponent as Dustbin } from '../../../assets/svg/worflow_builder/dustbin.svg';
import Services from './Services';

const Events = ({ eventsData, eventsDataChange, editable }) => {
	const [info, setInfo] = useState({
		data: [],
	});

	useEffect(() => {
		if (eventsData) {
			setInfo((prev) => ({ ...prev, data: [].concat(...Object.values(eventsData)) }));
		}
	}, [eventsData]);

	const localEventsOnchange = useCallback(
		async (innerIndex, outerIndex, type, val, roleIndex) => {
			if (!editable) {
				return;
			}
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
			if (type === 'serviecType') {
				let roleArray = [...(valueTobeChanged?.roles || [])];
				let roleTobeChanged = roleArray?.[roleIndex];
				roleTobeChanged = { ...roleTobeChanged, type: val };
				roleArray?.splice(roleIndex, 1, roleTobeChanged);
				valueTobeChanged = { ...valueTobeChanged, roles: roleArray };
			}
			if (type === 'serviceTypeQuantity') {
				let roleArray = [...(valueTobeChanged?.roles || [])];
				let roleTobeChanged = roleArray?.[roleIndex];
				let categoriesArray = [...roleTobeChanged?.categories];
				let categoryTobeChanged = { ...categoriesArray?.[0], quantity: val };
				categoriesArray[0] = categoryTobeChanged;
				roleTobeChanged = { ...roleTobeChanged, categories: categoriesArray };
				roleArray?.splice(roleIndex, 1, roleTobeChanged);
				valueTobeChanged = { ...valueTobeChanged, roles: roleArray };
			}
			if (type === 'decrementQuantity') {
				let roleArray = [...(valueTobeChanged?.roles || [])];
				let roleTobeChanged = roleArray?.[roleIndex];
				let categoriesArray = [...roleTobeChanged?.categories];
				let categoryTobeChanged = {
					...categoriesArray?.[0],
					quantity:
						categoriesArray?.[0]?.quantity - 1 > 0
							? categoriesArray?.[0]?.quantity - 1
							: 0,
				};
				categoriesArray[0] = categoryTobeChanged;
				roleTobeChanged = { ...roleTobeChanged, categories: categoriesArray };
				roleArray?.splice(roleIndex, 1, roleTobeChanged);
				valueTobeChanged = { ...valueTobeChanged, roles: roleArray };
			}
			if (type === 'incrementQuantity') {
				let roleArray = [...(valueTobeChanged?.roles || [])];
				let roleTobeChanged = roleArray?.[roleIndex];
				let categoriesArray = [...roleTobeChanged?.categories];
				let categoryTobeChanged = {
					...categoriesArray?.[0],
					quantity: categoriesArray?.[0]?.quantity + 1,
				};
				categoriesArray[0] = categoryTobeChanged;
				roleTobeChanged = { ...roleTobeChanged, categories: categoriesArray };
				roleArray?.splice(roleIndex, 1, roleTobeChanged);
				valueTobeChanged = { ...valueTobeChanged, roles: roleArray };
			}

			if (type === 'addRole') {
				let roleArray = [...(valueTobeChanged?.roles || [])];
				roleArray?.push({ type: '', categories: [{ category: '', quantity: 0 }] });
				valueTobeChanged = { ...valueTobeChanged, roles: roleArray };
			}
			selectedEventsTable?.values?.splice(innerIndex, 1, valueTobeChanged);
			updatedData?.splice(outerIndex, 1, selectedEventsTable);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			eventsDataChange(selectedEventsTable);
		},
		[info?.data, editable],
	);

	const addMoreEventsValues = useCallback(
		async (outerIndex) => {
			if (!editable) {
				return;
			}
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
		[info?.data, editable],
	);

	const deletEventsValues = useCallback(
		async (innerIndex, outerIndex) => {
			if (!editable) {
				return;
			}
			let updatedData = [...(info?.data || [])];
			let selectedEventsArray = updatedData?.[outerIndex];
			selectedEventsArray?.values?.splice(innerIndex, 1);
			updatedData?.splice(outerIndex, 1, selectedEventsArray);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			eventsDataChange(selectedEventsArray);
		},
		[info?.data, editable],
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
								readOnly={!editable}
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
								readOnly={!editable}
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
								readOnly={!editable}
							/>
						</div>
					</div>
					<div className="servicesContainer">
						<span className="serviceContainerTitle">Services Provided</span>

						{item?.roles?.map((x, lt) => (
							<div className="serviceRoleContainer" key={lt}>
								<input
									className="customInputWithoutLabel"
									value={x?.type}
									onChange={(e) =>
										localEventsOnchange(
											ind,
											index,
											'serviecType',
											e.target.value,
											lt,
										)
									}
									readOnly={!editable}
								/>
								<div className="incrementDecrementContainer">
									<span
										className="incrementorBtns"
										onClick={() =>
											localEventsOnchange(
												ind,
												index,
												'decrementQuantity',
												1,
												lt,
											)
										}
									>
										-
									</span>
									<input
										type="number"
										className="incrementDecrementinput"
										value={x?.categories?.[0]?.quantity}
										onChange={(e) =>
											localEventsOnchange(
												ind,
												index,
												'serviceTypeQuantity',
												e.target.value,
												lt,
											)
										}
										readOnly={!editable}
									/>
									<span
										className="incrementorBtns"
										onClick={() =>
											localEventsOnchange(
												ind,
												index,
												'incrementQuantity',
												1,
												lt,
											)
										}
									>
										+
									</span>
								</div>
							</div>
						))}

						{/* //add role btn */}
						<div
							className="addMoreRoleBtn"
							onClick={() => localEventsOnchange(ind, index, 'addRole')}
						>
							+ Add Role
						</div>
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
