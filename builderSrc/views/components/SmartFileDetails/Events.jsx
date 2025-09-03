import React, { memo, useState, useEffect, useCallback, useContext, useRef } from 'react';
import '../../../assets/scss/smart-file-components/events.scss';
import '../../../assets/scss/smart-file-components/eventsPresetsParentContainer.scss';
import { ReactComponent as Dustbin } from '../../../assets/svg/smartFile/dustbin.svg';
import { DatePicker, Tooltip, message } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { ReactComponent as Ai } from '../../../assets/svg/smartFile/ai.svg';
import { ReactComponent as Close } from '../../../assets/svg/smartFile/close.svg';
import { ReactComponent as ActionArrow } from '../library/svgs/LeftBar/NewDown.svg';
import EventsPresetsPopOverComponent from './EventsPresetPopup';
import Context from '../../../context/context';

const stripHtml = (html) => {
	if (!html) return '';
	return html
		.replace(/<[^>]*>/g, '') // remove all tags
		.replace(/&nbsp;/g, ' ') // replace non-breaking spaces with regular spaces
		.replace(/&amp;/g, ''); // remove any “&amp;” entities
};

const Events = ({
	eventsData,
	editable = true,
	eventsDataChange,
	scrollAndHighlightElement,
	formResponses = [],
	eventsOrderChange,
}) => {
	const {
		templates: { getEventsPresets },
	} = useContext(Context);
	const [info, setInfo] = useState({
		data: [],
		calenderStartDate: '',
		presetPopUp: {},
		showTooltip: {}, // for tooltip open/close per event input
	});
	const [popoverIndex, setPopoverIndex] = useState(null);
	const popoverRef = useRef(null);

	// Popover state for Connect with Form
	const [showConnectPopover, setShowConnectPopover] = useState(false);
	const [eventsOptions, setEventsOptions] = useState([]);
	const connectPopoverRef = useRef(null);

	//useEffects
	useEffect(() => {
		if (eventsData) {
			setInfo((prev) => ({ ...prev, data: [...(eventsData || [])] }));
		}
	}, [eventsData]);

	// Flatten all events from all tables
	const allEvents = info.data.flatMap((table, tableIdx) =>
		(table.values || []).map((event, eventIdx) => ({
			...event,
			__tableIdx: tableIdx,
			__eventIdx: eventIdx,
			__blockId: table._id,
		})),
	);

	const localEventsOnchange = useCallback(
		(innerIndex, type, val, roleIndex) => {
			// Find the event in allEvents
			const eventObj = allEvents[innerIndex];
			if (!eventObj) return;
			const { __tableIdx, __eventIdx } = eventObj;
			let updatedData = [...(info?.data || [])];
			let selectedEventsTable = updatedData?.[__tableIdx];
			let valueTobeChanged = selectedEventsTable?.values?.[__eventIdx];
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
				valueTobeChanged = { ...valueTobeChanged, date: val === null ? null : val };
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
				let currentQuantity = Number(categoriesArray?.[0]?.quantity || 0);
				let categoryTobeChanged = {
					...categoriesArray?.[0],
					quantity: currentQuantity + 1,
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

			selectedEventsTable?.values?.splice(__eventIdx, 1, valueTobeChanged);
			updatedData?.splice(__tableIdx, 1, selectedEventsTable);
			setInfo((prev) => ({ ...prev, data: updatedData, calenderStartDate }));

			if (
				(type === 'incrementQuantity' || type === 'decrementQuantity') &&
				valueTobeChanged.subBlockId
			) {
				if (typeof scrollAndHighlightElement === 'function') {
					scrollAndHighlightElement(valueTobeChanged.subBlockId);
				} else {
					console.error(
						'localEventsOnchange: scrollAndHighlightElement is not a function',
					);
				}
			}

			eventsDataChange(selectedEventsTable, valueTobeChanged.subBlockId);
			if (type === 'name') setPopoverIndex(null); // close popover on select
		},
		[
			info?.data,
			editable,
			info?.calenderStartDate,
			eventsDataChange,
			scrollAndHighlightElement,
			allEvents,
		],
	);

	const deletEventsValues = useCallback(
		(innerIndex) => {
			const eventObj = allEvents[innerIndex];
			if (!eventObj) return;
			const { __tableIdx, __eventIdx } = eventObj;
			let updatedData = [...(info?.data || [])];
			let selectedEventsArray = updatedData?.[__tableIdx];
			selectedEventsArray?.values?.splice(__eventIdx, 1);
			updatedData?.splice(__tableIdx, 1, selectedEventsArray);
			setInfo((prev) => ({ ...prev, data: updatedData }));
			eventsDataChange(selectedEventsArray);
		},
		[info?.data, eventsDataChange, allEvents],
	);

	// Helper to generate a valid 24-char hex string (MongoDB ObjectId)
	function generateObjectId() {
		return (
			Math.floor(Date.now() / 1000).toString(16) +
			'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
				return ((Math.random() * 16) | 0).toString(16);
			})
		).slice(0, 24);
	}

	const addMoreEventsValues = useCallback(() => {
		if (!editable || !info.data.length) return;
		let updatedData = [...info.data];
		let selectedEventsArray = updatedData[0];
		const newDummyObj = {
			name: '',
			description: '',
			date: '',
			location: '',
			addlServices: [],
			// blockId: selectedEventsArray?._id,
			blockId: generateObjectId(),
			subBlockId: generateObjectId(),
		};
		selectedEventsArray.values.push(newDummyObj);
		updatedData[0] = selectedEventsArray;
		setInfo((prev) => ({ ...prev, data: updatedData }));
		eventsDataChange(selectedEventsArray, newDummyObj.subBlockId);
	}, [info.data, editable, eventsDataChange]);

	// Filter suggestions: only type 'events'
	const eventSuggestions = formResponses.filter((resp) => resp.type === 'events');

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
			eventsDataChange(selectedEventsTable, valueTobeChanged.subBlockId);
		},
		[info?.data, eventsDataChange],
	);

	const closePresetPopUp = useCallback((outerIndex, innerIndex) => {
		setInfo((prev) => ({
			...prev,
			presetPopUp: { ...prev.presetPopUp, [`events${outerIndex}${innerIndex}`]: false },
		}));
	}, []);

	const getEventsPresetsData = useCallback(async () => {
		const params = {
			page: 1,
			limit: 50,
			sortBy: 'createdAt',
			sortType: -1,
			subType: 'event_table',
		};
		getEventsPresets(params);
	}, []);

	const openEventPreset = useCallback(
		(outerIndex, innerIndex) => {
			if (!editable) {
				return;
			}
			setInfo((prev) => ({
				...prev,
				presetPopUp: { ...prev.presetPopUp, [`events${outerIndex}${innerIndex}`]: true },
			}));
		},
		[editable],
	);

	// Handle outside click to close popover
	useEffect(() => {
		function handleClickOutside(event) {
			if (popoverRef.current && !popoverRef.current.contains(event.target)) {
				setPopoverIndex(null);
			}
		}
		if (popoverIndex !== null) {
			document.addEventListener('mousedown', handleClickOutside);
			return () => document.removeEventListener('mousedown', handleClickOutside);
		}
	}, [popoverIndex]);

	// Close Connect with Form popover on outside click
	useEffect(() => {
		if (!showConnectPopover) return;
		function handleClickOutside(event) {
			if (connectPopoverRef.current && !connectPopoverRef.current.contains(event.target)) {
				setShowConnectPopover(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showConnectPopover]);

	// Logic to connect events from a given answer array
	const connectEventsFromAnswer = useCallback(
		(answerArray) => {
			let updatedData = [...(info?.data || [])];
			if (updatedData.length === 0) return;
			const eventTable = updatedData[0];
			const eventTableId = eventTable._id;
			const newEventBlocks = (answerArray || []).map((item) => {
				const subBlockId = generateObjectId();
				return {
					name: item.name || '',
					description: item.noOfGuests ? `Guests: ${item.noOfGuests}` : '',
					date: item.date || '',
					location: item.location || '',
					addlServices: [],
					blockId: eventTableId,
					subBlockId,
					roles: [],
				};
			});
			updatedData[0].values = newEventBlocks;
			setInfo((prev) => ({ ...prev, data: updatedData }));
			if (updatedData[0]) {
				eventsDataChange(updatedData[0]);
			}
		},
		[info?.data, eventsDataChange],
	);

	// Show popover with all events-type options
	const handleConnectWithForm = useCallback(() => {
		const allEventsItems = (formResponses || []).filter((resp) => resp.type === 'events');
		if (!allEventsItems.length) {
			message.info('No form response with events found.');
			return;
		}
		setEventsOptions(allEventsItems);
		setShowConnectPopover(true);
	}, [formResponses]);

	// Handle selection from popover
	const handleSelectEventsOption = (selectedItem) => {
		connectEventsFromAnswer(selectedItem.answer);
		setShowConnectPopover(false);
	};

	return (
		<div className="eventsParentContainer">
			<div className="eventsHeaderRow">
				<span className="eventsBlockTitle">Events {allEvents.length}</span>
				{editable && formResponses && formResponses.length > 0 && (
					<div className="connectWithFormBtn" onClick={handleConnectWithForm}>
						Connect with Form
						{showConnectPopover && (
							<div
								className="eventsPresetsParentContainer connectPopoverDropdown"
								ref={connectPopoverRef}
							>
								<div className="definedPresetContainer">
									{eventsOptions.map((item, idx) => (
										<div
											className="presetCards"
											key={item._id}
											onClick={() => handleSelectEventsOption(item)}
										>
											<div className="presetCardContentContainer">
												<span className="presetTitle">
													{stripHtml(item.question) ||
														`Events ${idx + 1}`}
												</span>
												<span className="presetSubTitle">
													{Array.isArray(item.answer)
														? `${item.answer.length} events`
														: ''}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
			{allEvents.length > 0 &&
				allEvents.map((item, ind) => (
					<div className="eventsBlockContainer" key={item.subBlockId || ind}>
						<div className="eventsBlockTitle" style={{ marginBottom: '8px' }}>
							Event {ind + 1}
						</div>
						{allEvents?.length > 1 && (
							<div className="eventsActionsContainer">
								{ind > 0 && (
									<div
										className="eventUpDownArrow"
										title="move Up"
										onClick={() => {
											eventsOrderChange(item?.__blockId, item?.blockId, 'up');
										}}
									>
										<ActionArrow
											style={{
												transform: 'rotate(180deg)',
											}}
										/>
									</div>
								)}
								{ind != allEvents.length - 1 && (
									<div
										className="eventUpDownArrow"
										title="move Down"
										onClick={() => {
											eventsOrderChange(
												item?.__blockId,
												item?.blockId,
												'down',
											);
										}}
									>
										<ActionArrow />
									</div>
								)}
								<div
									className="deleteEventsContainer"
									onClick={() => deletEventsValues(ind)}
								>
									<Dustbin />
									Delete
								</div>
							</div>
						)}
						<div className="eventsDetailsContainer">
							<div
								className="inputWithLabelContainer"
								style={{ position: 'relative' }}
							>
								<span className="labelName">Event Name</span>
								<div style={{ position: 'relative', width: '100%' }}>
									<input
										className={`custominputContainer ${editable ? 'edit' : ''}`}
										value={item?.name === 'Name' ? '' : item?.name}
										onChange={(e) =>
											localEventsOnchange(ind, 'name', e.target.value)
										}
										readOnly={!editable}
										style={{ paddingRight: 32 }}
										placeholder="Enter Event Title"
									/>
									<span
										style={{
											position: 'absolute',
											top: '50%',
											right: 8,
											zIndex: 2,
											cursor: 'pointer',
											transform: 'translateY(-50%)',
										}}
										onClick={() =>
											setPopoverIndex(`${item.__tableIdx}-${item.__eventIdx}`)
										}
									></span>
									{popoverIndex === `${item.__tableIdx}-${item.__eventIdx}` && (
										<div
											className="eventsPresetsParentContainer"
											style={{
												position: 'absolute',
												top: '110%',
												zIndex: 1000,
												width: 350,
											}}
											ref={popoverRef}
										>
											<div className="definedPresetContainer">
												{eventSuggestions.length === 0 ? (
													<div style={{ color: '#888', padding: 16 }}>
														No suggestions
													</div>
												) : (
													eventSuggestions.map((sug, sugIdx) => (
														<div
															key={sug._id || sugIdx}
															className="presetCards"
															style={{
																padding: 12,
																cursor: 'pointer',
															}}
															onClick={() =>
																localEventsOnchange(
																	ind,
																	'name',
																	sug.answer,
																)
															}
														>
															<span className="presetTitle">
																{(sug.question || '').replace(
																	/<[^>]+>/g,
																	'',
																)}
															</span>
															<span className="presetSubTitle">
																{sug.answer}
															</span>
														</div>
													))
												)}
											</div>
										</div>
									)}
								</div>
							</div>
							<div className="inputWithLabelContainer">
								<span className="labelName">Date</span>
								<DatePicker
									onChange={(date, dateString) => {
										// If date is null (cleared), set to null, else use dateString
										localEventsOnchange(ind, 'date', date ? dateString : null);
									}}
									format={['YYYY-MM-DD', 'DD-MM-YYYY']}
									value={
										item?.date
											? dayjs(
													`${moment(item?.date)?.format('YYYY-MM-DD')}`,
													'YYYY-MM-DD',
											  )
											: null // set to null if no date
									}
									className={`custominputContainer ${editable ? 'edit' : ''}`}
									style={{ height: '50px' }}
									disabled={!editable}
									defaultPickerValue={
										info?.calenderStartDate
											? dayjs(`${info?.calenderStartDate}`, 'YYYY-MM-DD')
											: ''
									}
									allowClear={true}
								/>
							</div>
							<div className="inputWithLabelContainer">
								<span className="labelName">Location</span>
								<input
									className={`custominputContainer ${editable ? 'edit' : ''}`}
									value={item?.location === 'Location' ? '' : item?.location}
									placeholder="Location"
									onChange={(e) =>
										localEventsOnchange(ind, 'location', e.target.value)
									}
									readOnly={!editable}
								/>
							</div>
						</div>
						<div style={{ width: '100%' }}>
							<div className="inputWithLabelContainer">
								<span className="labelName">Description</span>
								<textarea
									className={`custominputContainer ${editable ? 'edit' : ''}`}
									value={
										item?.description === 'Description' ? '' : item?.description
									}
									placeholder="Description"
									onChange={(e) =>
										localEventsOnchange(ind, 'description', e.target.value)
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
											closePresetPopUp={() =>
												closePresetPopUp(item.__tableIdx, item.__eventIdx)
											}
											addServiceDataInEvents={addServiceDataInEvents}
											outerIndex={item.__tableIdx}
											innerIndex={item.__eventIdx}
											refetchEventspresetData={getEventsPresetsData}
										/>
									) : (
										''
									)
								}
								color={'#202020'}
								arrow={false}
								trigger="click"
								overlayClassName="toolTipContainer"
								open={
									info?.presetPopUp?.[
										`events${item.__tableIdx}${item.__eventIdx}`
									]
								}
								onOpenChange={(open) => {
									if (!open) {
										closePresetPopUp(item.__tableIdx, item.__eventIdx);
									}
								}}
							>
								<div
									className="serviceContainerTitle"
									onClick={() =>
										openEventPreset(item.__tableIdx, item.__eventIdx)
									}
								>
									<span className="serviceContainerTitleStyling">
										Services Provided{' '}
										<span className="addFromPreset">Add from preset</span>
									</span>
								</div>
							</Tooltip>
							{item?.roles?.map((x, lt) => (
								<div className="serviceRoleContainer" key={lt}>
									<input
										className={
											item?.ai_generated
												? `customInputWithoutLabel ai_generated ${
														editable ? 'edit' : ''
												  }`
												: `customInputWithoutLabel ${
														editable ? 'edit' : ''
												  }`
										}
										value={x?.type}
										onChange={(e) =>
											localEventsOnchange(
												ind,
												'serviecType',
												e.target.value,
												lt,
											)
										}
										readOnly={!editable}
									/>
									<div
										className={`incrementDecrementContainer ${
											item?.ai_generated ? 'ai_generated' : ''
										}`}
									>
										<span
											className="incrementorBtns"
											onClick={() =>
												localEventsOnchange(ind, 'decrementQuantity', 1, lt)
											}
										>
											−
										</span>
										<input
											type="number"
											className="incrementDecrementinput"
											value={x?.categories?.[0]?.quantity}
											onChange={(e) =>
												localEventsOnchange(
													ind,
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
												localEventsOnchange(ind, 'incrementQuantity', 1, lt)
											}
										>
											+
										</span>
									</div>
									{editable ? (
										<span
											className="removeRoleContainer"
											onClick={() =>
												localEventsOnchange(ind, 'removeRole', null, lt)
											}
										>
											<Close />
										</span>
									) : (
										''
									)}
								</div>
							))}
							{editable ? (
								<div
									className="addMoreRoleBtn"
									onClick={() => localEventsOnchange(ind, 'addRole')}
								>
									+ Add Role
								</div>
							) : (
								''
							)}
						</div>
					</div>
				))}
			{editable && (
				<div className="addEventBtn" onClick={addMoreEventsValues}>
					+ Add Event
				</div>
			)}
		</div>
	);
};

export default memo(Events);
