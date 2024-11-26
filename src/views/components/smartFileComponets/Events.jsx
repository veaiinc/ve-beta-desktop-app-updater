/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import '../../../assets/scss/sales/smartFileComponets.scss';
import { ReactComponent as Dustbin } from '../../../assets/svg/worflow_builder/dustbin.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as EventsPridiction } from '../../../assets/svg/sales/smartFile/eventsPrediction.svg';
import { DatePicker, Tooltip } from 'antd';
import { ReactComponent as QuestionMark } from '../../../assets/svg/workflow/questionMark.svg';
import ToolTipContainer from '../popover/ToolTipContainer';
import dayjs from 'dayjs';
import _ from 'lodash';
import EventsPresetsPopOverComponent from '../modalsV2/proposalModals/EventsPresetPopUp';

const Events = ({
	eventsData,
	eventsDataChange,
	editable,
	getEventsPresetsData,
	openAiGenerateModal,
	gotUnacceptedAiGeneratedValue,
	refetchAiPredictions,
}) => {
	const [info, setInfo] = useState({
		data: [],
		calenderStartDate: '',
		presetPopUp: {},
	});

	const [arrow, setArrow] = useState('Show');
	const mergedArrow = useMemo(() => {
		if (arrow === 'Hide') {
			return false;
		}
		if (arrow === 'Show') {
			return true;
		}
		return {
			pointAtCenter: true,
		};
	}, [arrow]);

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
			if (gotUnacceptedAiGeneratedValue) {
				openAiGenerateModal();
				return;
			}
			let updatedData = [...(info?.data || [])];
			let selectedEventsTable = updatedData?.[outerIndex];
			let valueTobeChanged = selectedEventsTable?.values?.[innerIndex];
			let calenderStartDate = info?.calenderStartDate;

			if (type === 'name') {
				valueTobeChanged = { ...valueTobeChanged, name: val };
			}
			if (type === 'location') {
				valueTobeChanged = { ...valueTobeChanged, location: val };
			}
			if (type === 'description') {
				valueTobeChanged = { ...valueTobeChanged, description: val };
			}
			if (type === 'date') {
				valueTobeChanged = { ...valueTobeChanged, date: val };
				calenderStartDate = val;
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
				roleArray?.push({ type: '', categories: [{ category: 'candid', quantity: 0 }] });
				valueTobeChanged = { ...valueTobeChanged, roles: roleArray };
			}
			if (type === 'removeRole') {
				let roleArray = [...(valueTobeChanged?.roles || [])];
				roleArray?.splice(roleIndex, 1);
				valueTobeChanged = { ...valueTobeChanged, roles: roleArray };
			}
			selectedEventsTable?.values?.splice(innerIndex, 1, valueTobeChanged);
			updatedData?.splice(outerIndex, 1, selectedEventsTable);
			setInfo((prev) => ({ ...prev, data: updatedData, calenderStartDate }));
			eventsDataChange(selectedEventsTable);
		},
		[
			info?.data,
			editable,
			info?.calenderStartDate,
			eventsDataChange,
			gotUnacceptedAiGeneratedValue,
		],
	);

	const addMoreEventsValues = useCallback(
		async (outerIndex) => {
			if (!editable) {
				return;
			}
			if (gotUnacceptedAiGeneratedValue) {
				openAiGenerateModal();
				return;
			}
			let updatedData = [...(info?.data || [])];
			let selectedEventsArray = updatedData?.[outerIndex];

			const newDummyObj = {
				name: '',
				description: '',
				date: '',
				location: '',
				addlServices: [],
				blockId: selectedEventsArray?._id,
				subBlockId: _.size(selectedEventsArray.values),
				// roles: [
				// 	{
				// 		type: 'cinematographer',
				// 		categories: [
				// 			{
				// 				category: 'candid',
				// 				quantity: 0,
				// 			},
				// 			{
				// 				category: 'traditional',
				// 				quantity: 0,
				// 			},
				// 		],
				// 	},
				// 	{
				// 		type: 'photographer',
				// 		categories: [
				// 			{
				// 				category: 'candid',
				// 				quantity: 0,
				// 			},
				// 			{
				// 				category: 'traditional',
				// 				quantity: 0,
				// 			},
				// 		],
				// 	},
				// 	{
				// 		type: 'support',
				// 		categories: [
				// 			{
				// 				category: 'candid',
				// 				quantity: 0,
				// 			},
				// 			{
				// 				category: 'traditional',
				// 				quantity: 0,
				// 			},
				// 		],
				// 	},
				// ],
			};

			selectedEventsArray?.values?.push(newDummyObj);
			updatedData?.splice(outerIndex, 1, selectedEventsArray);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			eventsDataChange(selectedEventsArray);
			refetchAiPredictions();
		},
		[info?.data, editable, gotUnacceptedAiGeneratedValue],
	);

	const deletEventsValues = useCallback(
		async (innerIndex, outerIndex) => {
			if (!editable) {
				return;
			}
			if (gotUnacceptedAiGeneratedValue) {
				openAiGenerateModal();
				return;
			}
			let updatedData = [...(info?.data || [])];
			let selectedEventsArray = updatedData?.[outerIndex];
			selectedEventsArray?.values?.splice(innerIndex, 1);
			updatedData?.splice(outerIndex, 1, selectedEventsArray);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			eventsDataChange(selectedEventsArray);
			refetchAiPredictions();
		},
		[info?.data, editable, gotUnacceptedAiGeneratedValue],
	);

	const closePresetPopUp = useCallback((outerIndex, innerIndex) => {
		setInfo((prev) => ({
			...prev,
			presetPopUp: { ...prev.presetPopUp, [`events${outerIndex}${innerIndex}`]: false },
		}));
	}, []);

	const openEventPreset = useCallback(
		(outerIndex, innerIndex) => {
			if (!editable) {
				return;
			}
			if (gotUnacceptedAiGeneratedValue) {
				openAiGenerateModal();
				return;
			}
			setInfo((prev) => ({
				...prev,
				presetPopUp: { ...prev.presetPopUp, [`events${outerIndex}${innerIndex}`]: true },
			}));
		},
		[editable, gotUnacceptedAiGeneratedValue],
	);

	const addServiceDataInEvents = useCallback(
		(data, outerIndex, innerIndex) => {
			const { eventTableValues } = data || {};
			let updatedData = [...(info?.data || [])];
			let selectedEventsTable = updatedData?.[outerIndex];
			let valueTobeChanged = selectedEventsTable?.values?.[innerIndex];
			let roleArray = [...(eventTableValues || [])];
			valueTobeChanged = { ...valueTobeChanged, roles: roleArray };
			selectedEventsTable?.values?.splice(innerIndex, 1, valueTobeChanged);
			updatedData?.splice(outerIndex, 1, selectedEventsTable);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			closePresetPopUp(outerIndex, innerIndex);
			eventsDataChange(selectedEventsTable);
		},
		[info?.data],
	);

	const refetchEventspresetData = useCallback(() => {
		getEventsPresetsData();
	}, [getEventsPresetsData]);

	return info?.data?.map((ele, index) => (
		<div className="eventsParentContainer" key={index}>
			<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
				<span className="eventsTitle">Events {ele?.values?.length || 0}</span>
				<span className="svgHolder">
					<Tooltip
						placement="bottomLeft"
						title={
							<ToolTipContainer
								title={'Events'}
								content={
									'This table outlines the different events that will be covered by the business, including dates, locations, and descriptions.'
								}
							/>
						}
						arrow={mergedArrow}
						color={'#202020'}
					>
						<QuestionMark />
					</Tooltip>
				</span>
			</div>

			{/* //use map here */}

			{ele?.values?.map((item, ind) => (
				<div className="eventsCard" key={ind}>
					{editable ? (
						<div
							className="deleteEventsContainer"
							onClick={() => deletEventsValues(ind, index)}
						>
							<Dustbin />
							Delete
						</div>
					) : (
						''
					)}
					<div className="eventsDetailsContainer">
						<div className="inputWithLabelContainer">
							<span className="labelName">Event Name</span>
							<input
								className={`custominputContainer ${editable ? 'edit' : ''}`}
								value={item?.name}
								onChange={(e) =>
									localEventsOnchange(ind, index, 'name', e.target.value)
								}
								readOnly={!editable}
							/>
						</div>
						<div className="inputWithLabelContainer">
							<span className="labelName">Date</span>

							<DatePicker
								onChange={(date, dateString) => {
									localEventsOnchange(ind, index, 'date', dateString);
								}}
								format={['YYYY-MM-DD', 'DD-MM-YYYY']}
								value={
									item?.date ? dayjs(`${item?.date}`, 'YYYY-MM-DD') : item?.date
								}
								className={`custominputContainer ${editable ? 'edit' : ''}`}
								style={{ height: '50px' }}
								disabled={!editable}
								defaultPickerValue={
									info?.calenderStartDate
										? dayjs(`${info?.calenderStartDate}`, 'YYYY-MM-DD')
										: ''
								}
							/>
						</div>
						<div className="inputWithLabelContainer">
							<span className="labelName">Location</span>
							<input
								className={`custominputContainer ${editable ? 'edit' : ''}`}
								value={item?.location}
								onChange={(e) =>
									localEventsOnchange(ind, index, 'location', e.target.value)
								}
								readOnly={!editable}
							/>
						</div>
					</div>

					{/* //descrioption */}
					<div style={{ width: '100%' }}>
						<div className="inputWithLabelContainer">
							<span className="labelName">Description</span>
							<textarea
								className={`custominputContainer ${editable ? 'edit' : ''}`}
								value={item?.description}
								onChange={(e) =>
									localEventsOnchange(ind, index, 'description', e.target.value)
								}
								readOnly={!editable}
								style={{ resize: 'none' }}
							/>
						</div>
					</div>

					<div className="servicesContainer">
						<Tooltip
							placement="bottomLeft"
							title={
								editable ? (
									<EventsPresetsPopOverComponent
										closePresetPopUp={() => closePresetPopUp(index, ind)}
										addServiceDataInEvents={addServiceDataInEvents}
										outerIndex={index}
										innerIndex={ind}
										refetchEventspresetData={refetchEventspresetData}
									/>
								) : (
									''
								)
							}
							color={'#202020'}
							arrow={false}
							trigger="click"
							overlayClassName="toolTipContainer"
							open={info?.presetPopUp?.[`events${index}${ind}`]}
							onOpenChange={(open) => {
								if (!open) {
									closePresetPopUp(index, ind);
								}
							}}
						>
							<div
								className="serviceContainerTitle"
								onClick={() => openEventPreset(index, ind)}
							>
								<span className="serviceContainerTitleStyling">
									Services Provided
								</span>

								<div className="eventsPresetsContainer">
									<EventsPridiction />
									<span className="eventsPresetsStyling">Add from preset</span>
								</div>
							</div>
						</Tooltip>

						{item?.roles?.map((x, lt) => (
							<div className="serviceRoleContainer" key={lt}>
								<input
									className={
										ele?.ai_generated
											? `customInputWithoutLabel ai_generated ${
													editable ? 'edit' : ''
											  }`
											: `customInputWithoutLabel ${editable ? 'edit' : ''}`
									}
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
								<div
									className={`incrementDecrementContainer ${
										ele?.ai_generated ? 'ai_generated' : ''
									}`}
								>
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
								{editable ? (
									<span
										className="removeRoleContainer"
										onClick={() =>
											localEventsOnchange(ind, index, 'removeRole', null, lt)
										}
									>
										<Close />
									</span>
								) : (
									''
								)}
							</div>
						))}

						{/* //add role btn */}
						{editable ? (
							<div
								className="addMoreRoleBtn"
								onClick={() => localEventsOnchange(ind, index, 'addRole')}
							>
								+ Add Role
							</div>
						) : (
							''
						)}
					</div>
				</div>
			))}
			{editable ? (
				<div className="addEventBtn" onClick={() => addMoreEventsValues(index)}>
					+ Add Event
				</div>
			) : (
				''
			)}
		</div>
	));
};

export default memo(Events);
