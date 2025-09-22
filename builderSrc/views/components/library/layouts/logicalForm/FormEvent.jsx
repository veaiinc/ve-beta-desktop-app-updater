import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import CreatableSelect from 'react-select/creatable';
import Modal from '../../modals/index.jsx';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import CloseButton from '../../svgs/addEventModal/Close.jsx';
import CalendarSvg from '../../svgs/addEventModal/Calendersvg.jsx';
import RemoveIcon from '../actions/delete.jsx';
import Pencil from '../../svgs/pencil.svg';

const timeJSON = ['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Night'];

class FormEvent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			client: props.client,
			showModal: false,
			events: props.blocks?.find((block) => block.type === 'events')?.events || [],
			name: '',
			nameReactSelect: null,
			date: '',
			time: '',
			location: '',
			noOfGuests: '',
			addEventError: false,
			addEventArrMessage: '',
			eventNameFocused: false,
			dateFocused: false,
			calenderStartdate: new Date(),
			editEventData: null,
			eventsJSON: [
				{
					value: 0,
					label: 'PreWedding',
				},
				{
					value: 1,
					label: 'Wedding',
				},
				{
					value: 2,
					label: 'Engagement',
				},
				{
					value: 3,
					label: 'Reception',
				},
				{
					value: 4,
					label: 'Pellikoduku',
				},
				{
					value: 5,
					label: 'Mehendi',
				},
				{
					value: 6,
					label: 'Mehendi - Bride',
				},
				{
					value: 7,
					label: 'Mehendi - Groom',
				},
				{
					value: 8,
					label: 'Sangeeth',
				},
				{
					value: 9,
					label: 'Haldi',
				},
				{
					value: 10,
					label: 'Haldi - Bride',
				},
				{
					value: 11,
					label: 'Haldi - Groom',
				},
				{
					value: 12,
					label: 'Vratham',
				},
				{
					value: 13,
					label: 'Vratham - Bride',
				},
				{
					value: 14,
					label: 'Vratham - Groom',
				},
				{
					value: 15,
					label: 'Couple Shoot',
				},
				{
					value: 16,
					label: 'Bride Ceremony',
				},
				{
					value: 17,
					label: 'Groom Ceremony ',
				},
				{
					value: 18,
					label: 'Cocktail Party',
				},
				{
					value: 19,
					label: 'Mangalasnanam',
				},
				{
					value: 20,
					label: 'Pooja',
				},
				{
					value: 21,
					label: 'Pooja - Bride',
				},
				{
					value: 22,
					label: 'Pooja - Groom',
				},
				{
					value: 23,
					label: 'Pradhanam',
				},
				{
					value: 24,
					label: 'Lagnapatrika',
				},
				{
					value: 25,
					label: 'Pasupu',
				},
				{
					value: 26,
					label: 'Nalugu',
				},
				{
					value: 27,
					label: 'Nalugu - Bride',
				},
				{
					value: 28,
					label: 'Nalugu - Groom',
				},
				{
					value: 29,
					label: 'Upanayanam',
				},
				{
					value: 30,
					label: 'Bridal Shower',
				},
				{
					value: 31,
					label: 'Varapooja',
				},
				{
					value: 32,
					label: 'Shagun',
				},
				{
					value: 33,
					label: 'Baraath',
				},
				{
					value: 34,
					label: 'Edhurukollu',
				},
				{
					value: 35,
					label: 'Beegara Oota',
				},
				{
					value: 36,
					label: 'Pellikuthuru',
				},
				{
					value: 37,
					label: 'Reception Bride',
				},
				{
					value: 38,
					label: 'Reception Groom',
				},
				{
					value: 39,
					label: 'Muhurtham',
				},
				{ value: 40, label: 'Muhurat' },
			],
		};
		this.datePickerRef = React.createRef();
	}

	toggleShowModal = () => {
		if (this.state.client) {
			this.setState({ showModal: true });
		}
	};

	closeModal = () => {
		this.setState({
			showModal: false,
			name: '',
			nameReactSelect: null,
			date: '',
			time: '',
			location: '',
			noOfGuests: '',
			addEventError: false,
			addEventArrMessage: '',
			eventNameFocused: false,
			dateFocused: false,
			editEventData: null,
		});
	};

	onInputChange = (e, name) => {
		const value =
			name === 'date'
				? moment(e).format('YYYYMMDD') === 'Invalid date'
					? ''
					: moment(e).format('YYYYMMDD')
				: name === 'nameReactSelect'
				? e
				: e.target.value;

		if (this.state.editEventData) {
			this.setState((prevState) => ({
				editEventData: {
					...prevState.editEventData,
					[name]: value,
				},
				addEventError: false,
				addEventArrMessage: '',
			}));
		} else {
			this.setState({
				[name]: value,
				addEventError: false,
				addEventArrMessage: '',
			});
		}
	};

	handleChangeEvent = (e) => {
		if (e == null) {
			if (this.state.editEventData) {
				this.setState((prevState) => ({
					editEventData: { ...prevState.editEventData, name: '', nameReactSelect: null },
				}));
			} else {
				this.setState({ name: '', nameReactSelect: null });
			}
		} else {
			if (e.__isNew__) {
				this.setState((prevState) => ({
					eventsJSON: [
						...prevState.eventsJSON,
						{ value: prevState.eventsJSON.length, label: e.label, isAdded: true },
					],
				}));
			}
			if (this.state.editEventData) {
				this.setState((prevState) => ({
					editEventData: {
						...prevState.editEventData,
						name: e.label,
						nameReactSelect: e,
					},
					addEventError: false,
					addEventArrMessage: '',
				}));
			} else {
				this.setState({
					name: e.label,
					nameReactSelect: e,
					addEventError: false,
					addEventArrMessage: '',
				});
			}
		}
	};

	handleAddEvent = () => {
		const { events } = this.state;
		const nameToCheck = this.state.editEventData
			? this.state.editEventData.name
			: this.state.name;

		if (!nameToCheck?.length) {
			this.setState({
				addEventError: true,
				addEventArrMessage: 'Event Name required',
				eventNameFocused: true,
			});
			return;
		}

		const isDuplicate = events.some((event) => {
			if (this.state.editEventData && event.name === this.state.editEventData.originalName) {
				return false;
			}
			return event.name?.toLowerCase() === nameToCheck?.toLowerCase();
		});

		if (isDuplicate) {
			this.setState({
				addEventError: true,
				addEventArrMessage: 'Event already exists',
				eventNameFocused: true,
			});
			return;
		}

		if (this.state.editEventData) {
			const updatedEvents = events.map((event) => {
				if (event.name === this.state.editEventData.originalName) {
					return {
						name: this.state.editEventData.name,
						nameReactSelect: this.state.editEventData.nameReactSelect,
						date: this.state.editEventData.date,
						time: this.state.editEventData.time,
						location: this.state.editEventData.location,
						noOfGuests: this.state.editEventData.noOfGuests,
					};
				}
				return event;
			});

			this.setState(
				{
					events: updatedEvents,
					showModal: false,
					editEventData: null,
					name: '',
					nameReactSelect: null,
					date: '',
					time: '',
					location: '',
					noOfGuests: '',
				},
				() => {
					this.props.onAnswerChange(updatedEvents);
				},
			);
		} else {
			const newEvent = {
				name: this.state.name,
				nameReactSelect: this.state.nameReactSelect,
				date: this.state.date,
				time: this.state.time,
				location: this.state.location,
				noOfGuests: this.state.noOfGuests,
			};

			const newEvents = [...events, newEvent];
			this.setState(
				{
					events: newEvents,
					showModal: false,
					name: '',
					nameReactSelect: null,
					date: '',
					time: '',
					location: '',
					noOfGuests: '',
				},
				() => {
					this.props.onAnswerChange(newEvents);
				},
			);
		}
	};

	handleEditEvent = (index) => {
		const eventToEdit = this.state.events[index];
		this.setState({
			showModal: true,
			editEventData: { ...eventToEdit, originalName: eventToEdit.name },
		});
	};

	handleDeleteEvent = (index) => {
		const updatedEvents = this.state.events.filter((_, i) => i !== index);

		this.setState({ events: updatedEvents }, () => {
			this.props.onAnswerChange(updatedEvents);
		});
	};
	render() {
		const buttonBackground = this.props.buttonProps?.btStyles?.background || '#8b75ba';
		const submitTextColor =
			this.props.buttonProps?.content?.match(/color:\s*(.*?)[;\"]/)?.[1] || '#1A1A1A';

		// Extract color from this.props.question, fallback to #1A1A1A
		const eventTextColor = this.props.question?.match(/color:\s*(.*?)[;\"]/)?.[1] || '#1A1A1A';

		return (
			<>
				<button
					className="add-events-button"
					onClick={this.toggleShowModal}
					style={{
						position: 'absolute',
						padding: '12px 24px',
						fontSize:
							this.props.buttonProps?.content?.match(/font-size:\s*(.*?)[;"]/)?.[1] ||
							'16px',
						fontWeight:
							this.props.buttonProps?.content?.match(
								/font-weight:\s*(.*?)[;"]/,
							)?.[1] || '400',
						color: submitTextColor,
						backgroundColor: buttonBackground,
						border: 'none',
						borderRadius: '100px',
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						margin: '10px 0',
						marginTop: '-85px',
						fontFamily:
							this.props.buttonProps?.content
								?.match(/font-family:\s*([^;}"]*)/)?.[1]
								?.replace(/['"]/g, '') || 'Arial',
						minWidth: '156px',
						height: '48px',
						justifyContent: 'center',
						transition: 'background-color 0.4s ease-in-out',
					}}
					// onMouseOver={(e) => {
					// 	e.currentTarget.style.backgroundColor = '#6f5a9a';
					// }}
					// onMouseOut={(e) => {
					// 	e.currentTarget.style.backgroundColor = buttonBackground;
					// }}
				>
					<span>+</span>
					Add Events
				</button>

				{this.state.events.length > 0 && (
					<table
						style={{
							width: '100%',
							marginTop: '20px',
							borderCollapse: 'collapse',
						}}
						className="eventsTable"
					>
						<thead>
							<tr>
								<th style={{ color: '#333' }}>Event Name</th>
								<th style={{ color: '#333' }}>Date</th>
								<th style={{ color: '#333' }}>Time</th>
								<th style={{ color: '#333' }}>Location</th>
								<th style={{ color: '#333' }}>No of Guests</th>
								<th style={{ color: '#333' }}>Actions</th>
							</tr>
						</thead>
						<tbody>
							{this.state.events.map((event, index) => (
								<tr key={index} style={{ border: '1px solid #ccc' }}>
									<td style={{ color: eventTextColor, padding: '8px' }}>
										{event.name}
									</td>
									<td style={{ color: eventTextColor, padding: '8px' }}>
										{event.date
											? moment(event.date, 'YYYYMMDD').format('DD/MM/YYYY')
											: ''}
									</td>
									<td style={{ color: eventTextColor, padding: '8px' }}>
										{event.time || ''}
									</td>
									<td style={{ color: eventTextColor, padding: '8px' }}>
										{event.location || ''}
									</td>
									<td style={{ color: eventTextColor, padding: '8px' }}>
										{event.noOfGuests || ''}
									</td>
									<td
										style={{
											display: 'flex',
											gap: '10px',
											padding: '8px',
										}}
									>
										{/* <img
											src={Pencil}
											alt="Edit"
											style={{
												cursor: 'pointer',
												width: '20px',
												height: '20px',
											}}
											onClick={() => this.handleEditEvent(index)}
										/> */}
										<div
											onClick={() => this.handleEditEvent(index)}
											style={{ cursor: 'pointer', display: 'inline-flex' }}
										>
											<Pencil width="20" height="20" />
										</div>

										<div
											onClick={() => this.handleDeleteEvent(index)}
											style={{ cursor: 'pointer', display: 'inline-flex' }}
										>
											<RemoveIcon width="20" height="20" />
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}

				<Modal
					show={this.state.showModal}
					handleClose={this.closeModal}
					isEventModal={true}
				>
					<div className="eventsModalContainer">
						<div className="addEventParentWrapper">
							<div
								className="closebutton"
								onClick={this.closeModal}
								style={{ cursor: 'pointer' }}
							>
								<CloseButton />
							</div>

							<div className="addEventWrapper">
								<div className="addEventText">
									{this.state.editEventData ? 'Edit Event' : 'Add Event'}
								</div>

								<div className="eventFrameParent">
									<div className="eventField">
										<div
											className={`floating-label ${
												this.state.addEventError ? 'error-label' : ''
											}`}
										>
											<CreatableSelect
												className="floating-select floating-select-no-padding"
												classNamePrefix="select"
												value={
													this.state.editEventData
														? this.state.editEventData.nameReactSelect
														: this.state.nameReactSelect
												}
												onChange={this.handleChangeEvent}
												isClearable={true}
												options={this.state.eventsJSON}
												placeholder=""
												onFocus={() =>
													this.setState({ eventNameFocused: true })
												}
											/>
											<span className="highlight"></span>
											<label
												className={
													this.state.eventNameFocused ||
													(this.state.editEventData &&
														this.state.editEventData.name) ||
													this.state.name
														? 'label'
														: ''
												}
											>
												{this.state.addEventError === false
													? 'Event Name*'
													: this.state.addEventArrMessage}
											</label>
										</div>

										<div className="floating-label">
											{(this.state.editEventData?.date ||
												this.state.date) && (
												<span
													onClick={() =>
														this.state.editEventData
															? this.setState({
																	editEventData: {
																		...this.state.editEventData,
																		date: '',
																	},
																	dateFocused: false,
															  })
															: this.setState({
																	date: '',
																	dateFocused: false,
															  })
													}
													className="clearDate"
												>
													<RemoveIcon />
												</span>
											)}
											<DatePicker
												value={
													this.state.editEventData?.date
														? moment(
																this.state.editEventData.date,
																'YYYYMMDD',
														  ).format('DD/MM/YYYY')
														: this.state.date
														? moment(
																this.state.date,
																'YYYYMMDD',
														  ).format('DD/MM/YYYY')
														: ''
												}
												ref={this.datePickerRef}
												selected={this.state.calenderStartdate}
												onSelect={(e) => {
													this.onInputChange(e, 'date');
													this.setState({
														calenderStartdate: new Date(e),
													});
												}}
												dateFormat="dd/MM/yyyy"
												onFocus={() => {
													this.setState({ dateFocused: true });
													this.datePickerRef.current?.setOpen(true);
												}}
												onBlur={() => this.setState({ dateFocused: false })}
												className="floating-select"
												onKeyDown={(e) => e.preventDefault()}
												showPopperArrow={false}
												popperPlacement="bottom"
												customInput={
													<input
														type="button"
														style={{
															textAlign: 'left',
															paddingLeft: '12px',
															width: '100%',
														}}
													/>
												}
												popperModifiers={{
													preventOverflow: {
														enabled: true,
														escapeWithReference: false,
														boundariesElement: 'viewport',
													},
												}}
											/>
											<span className="calendarsvgIcon">
												<CalendarSvg
													onClick={() =>
														this.datePickerRef.current?.setOpen(true)
													}
												/>
											</span>
											<span className="highlight"></span>
											<label
												className={
													this.state.dateFocused ||
													(this.state.editEventData &&
														this.state.editEventData.date) ||
													this.state.date
														? 'label'
														: ''
												}
											>
												Date
											</label>
										</div>

										<div className="floating-label">
											<select
												className="floating-select select-one"
												value={
													this.state.editEventData
														? this.state.editEventData.time
														: this.state.time
												}
												onChange={(e) => this.onInputChange(e, 'time')}
											>
												<option value="" disabled></option>
												{timeJSON.map((time, key) => (
													<option value={time} key={key}>
														{time}
													</option>
												))}
											</select>
											<span className="highlight"></span>
											<label>Time</label>
											{(this.state.editEventData?.time ||
												this.state.time) && (
												<b
													style={{
														position: 'absolute',
														right: '-29px',
														top: '6px',
													}}
													onClick={() =>
														this.state.editEventData
															? this.setState({
																	editEventData: {
																		...this.state.editEventData,
																		time: '',
																	},
															  })
															: this.setState({ time: '' })
													}
												>
													<RemoveIcon />
												</b>
											)}
										</div>

										<div className="floating-label">
											<input
												className="floating-input"
												type="text"
												value={
													this.state.editEventData
														? this.state.editEventData.location
														: this.state.location
												}
												placeholder=""
												onChange={(e) => this.onInputChange(e, 'location')}
											/>
											<span className="highlight"></span>
											<label>Location</label>
										</div>

										<div className="floating-label">
											<input
												className="floating-input"
												type="text"
												value={
													this.state.editEventData
														? this.state.editEventData.noOfGuests
														: this.state.noOfGuests
												}
												placeholder=""
												onChange={(e) =>
													this.onInputChange(e, 'noOfGuests')
												}
											/>
											<span className="highlight"></span>
											<label>Number of guests</label>
										</div>
									</div>

									<div
										className="eventButton"
										onClick={this.handleAddEvent}
										style={{ color: submitTextColor }}
									>
										{this.state.editEventData ? 'Update' : 'Add'}
									</div>
								</div>
							</div>
						</div>
					</div>
				</Modal>
			</>
		);
	}
}

export default FormEvent;
