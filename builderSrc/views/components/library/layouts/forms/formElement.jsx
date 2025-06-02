import React, { Component } from 'react';
import './forms.scss';
import Text from '../../elements/text/index';
import Down from '../actions/down.jsx';
import Up from '../actions/up.jsx';
import Delete from '../actions/delete.jsx';
import DatePicker from 'react-datepicker';
import CreatableSelect from 'react-select/creatable';
import Modal from '../../modals/index.jsx';
import 'react-datepicker/dist/react-datepicker.css';
import Input from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import moment from 'moment';
import RemoveIcon from '../actions/delete.jsx';
import CloseButton from '../../svgs/addEventModal/Close.jsx';
import CalendarSvg from '../../svgs/addEventModal/Calendersvg.jsx';
import { Helmet } from 'react-helmet';
import BottomModal from '../../modals/BottomModal.jsx';
import Edit from '../actions/edit.jsx';
import Deleted from '../actions/delete.jsx';
import Pencil from '../../svgs/pencil.svg';
import SingleInputTypes from './SingleInputTypes.jsx';
import MultiOptionInputs from './MultiOptionInputs.jsx';
import UniqueQTypes from './UniqueQTypes.jsx';
import _ from 'lodash';
const timeJSON = ['Early Morning', 'Morning', 'Afternoon', 'Evening', 'Night'];
const restrictedQuestions = [
	'619f75683f381fd66dac4b65',
	'6311ee8f8e7c108259cf96e6',
	'6311efc4911e0f82be7e2b2d',
];
class FormElement extends Component {
	constructor(props) {
		super();
		this.state = {
			showModal: false,
			preview: props.preview,
			previewType: props.previewType,
			showBlockOptions: false,
			question: props.question,
			actionType: props.actionType,
			actionValue: props.actionValue,
			emptyOption: '',
			showAddOption: false,
			isRequired: props.isRequired,
			events: [],
			setActiveTheme: props?.setActiveTheme,
			answer: props.answer ? props.answer : props.type === 'multipleChoice' ? [] : '',
			eventsJSON: [
				{
					value: 0,
					label: 'Wedding',
				},
				{
					value: 1,
					label: 'Engagement',
				},
				{
					value: 2,
					label: 'Reception',
				},
				{
					value: 3,
					label: 'Pellikoduku',
				},
				{
					value: 4,
					label: 'Mehendi',
				},
				{
					value: 5,
					label: 'Mehendi - Bride',
				},
				{
					value: 6,
					label: 'Mehendi - Groom',
				},
				{
					value: 7,
					label: 'Sangeeth',
				},
				{
					value: 8,
					label: 'Haldi',
				},
				{
					value: 9,
					label: 'Haldi - Bride',
				},
				{
					value: 10,
					label: 'Haldi - Groom',
				},
				{
					value: 11,
					label: 'Vratham',
				},
				{
					value: 12,
					label: 'Vratham - Bride',
				},
				{
					value: 13,
					label: 'Vratham - Groom',
				},
				{
					value: 14,
					label: 'Couple Shoot',
				},
				{
					value: 15,
					label: 'Bride Ceremony',
				},
				{
					value: 16,
					label: 'Groom Ceremony ',
				},
				{
					value: 17,
					label: 'Cocktail Party',
				},
				{
					value: 18,
					label: 'Mangalasnanam',
				},
				{
					value: 19,
					label: 'Pooja',
				},
				{
					value: 20,
					label: 'Pooja - Bride',
				},
				{
					value: 21,
					label: 'Pooja - Groom',
				},
				{
					value: 22,
					label: 'Pradhanam',
				},
				{
					value: 23,
					label: 'Lagnapatrika',
				},
				{
					value: 24,
					label: 'Pasupu',
				},
				{
					value: 25,
					label: 'Nalugu',
				},
				{
					value: 26,
					label: 'Nalugu - Bride',
				},
				{
					value: 27,
					label: 'Nalugu - Groom',
				},
				{
					value: 28,
					label: 'Upanayanam',
				},
				{
					value: 29,
					label: 'Bridal Shower',
				},
				{
					value: 30,
					label: 'Varapooja',
				},
				{
					value: 31,
					label: 'Shagun',
				},
				{
					value: 32,
					label: 'Baraath',
				},
				{
					value: 33,
					label: 'Edhurukollu',
				},
				{
					value: 34,
					label: 'Beegara Oota',
				},
				{
					value: 35,
					label: 'Pellikuthuru',
				},
				{
					value: 36,
					label: 'Reception Bride',
				},
				{
					value: 37,
					label: 'Reception Groom',
				},
				{
					value: 38,
					label: 'Muhurtham',
				},
				{ value: 39, label: 'Muhurat' },
			],
			isTheme: props?.isTheme,
			calenderStartdate: new Date(),
			date: '',
			options: props.options,
			editOption: false,
			editOptionKey: null,
			editEventData: null,
			triggerFont: props.triggerFont,
			client: props?.client,
		};
		this.blockRef = React.createRef();
		this.datePickerRef = React.createRef();
		this.labelRefs = [];
	}
	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside);
	};

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.question !== nextProps.question) {
			this.setState({
				question: nextProps.question,
			});
		}
		if (this.state.setActiveTheme !== nextProps.setActiveTheme) {
			this.setState({
				setActiveTheme: nextProps.setActiveTheme,
			});
		}
		if (this.state.isTheme !== nextProps.isTheme) {
			this.setState({
				isTheme: nextProps.isTheme,
			});
		}
		if (this.state.options !== nextProps.options) {
			this.setState({
				options: nextProps.options,
				editOption: false,
				editOption: null,
			});
		}
		if (this.state.actionType !== nextProps.actionType) {
			this.setState({
				actionType: nextProps.actionType,
			});
		}

		if (this.state.actionValue !== nextProps.actionValue) {
			this.setState({
				actionValue: nextProps.actionValue,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.isRequired !== nextProps.isRequired) {
			this.setState({
				isRequired: nextProps.isRequired,
			});
		}
		if (this.state.triggerFont !== nextProps.triggerFont) {
			this.setState({
				triggerFont: nextProps.triggerFont,
			});
		}
		if (this.state.client !== nextProps.client) {
			this.setState({
				client: nextProps.client,
			});
		}
	};
	handleClickOutside = (event) => {
		if (this.blockRef.current && !this.blockRef.current.contains(event.target)) {
			this.setState({
				showBlockActions: false,
			});
		}
		this.labelRefs.forEach((ref, index) => {
			if (ref && !ref.contains(event.target)) {
				this.setState({
					editOption: false,
					editOptionKey: null,
				});
			}
		});
	};
	handleDeleteSection = (e) => {
		this.props.deleteSection(this.props._id);
	};
	toggleSideBar = (e) => {
		this.setState(
			{
				showBlockActions: true,
			},
			() => {
				this.props.handleFSideBar(e);
			},
		);
	};
	setOpt = (e) => {
		this.setState(
			{
				showAddOption: false,
				emptyOption: '',
			},
			() => {
				this.props.addOptionForForm(e);
			},
		);
	};
	onChangeInput = (e, type = null) => {
		let value;
		if (this.props.type === 'date' || this.props.type === 'phoneNumber') {
			value = e;
		} else {
			value = e.target.value;
		}

		this.setState(
			{
				answer:
					type == null
						? this.props.type === 'email'
							? value?.toLowerCase()
							: value
						: moment(e).format('DD MMM YYYY') === 'Invalid date'
						? ''
						: moment(e).format('DD MMM YYYY'),
				isSlideError: false,
			},
			() => {
				this.props.setAnswer(
					type === null
						? this.props.type === 'email'
							? value?.toLowerCase()
							: value
						: moment(e).format('DD MMM YYYY') === 'Invalid date'
						? ''
						: moment(e).format('DD MMM YYYY'),
				);
			},
		);
	};
	setHandleAnswer = (e, k) => {
		let answerState;
		if (this.props.isMultiple) {
			answerState = this.state.answer;
			if (this.state.answer.includes(`${k}`)) {
				var index = this.state.answer.indexOf(`${k}`);
				if (index !== -1) {
					this.state.answer.splice(index, 1);
				}
			} else {
				answerState.push(`${k}`);
			}
		} else {
			answerState = [`${k}`];
		}
		this.setState(
			{
				answer: answerState,
				isSlideError: false,
				isErrorMessage: '',
			},
			() => {
				this.props.setAnswer(answerState);
			},
		);
	};
	toggleShowModal = (e) => {
		this.setState({
			showModal: true,
			isMobileModal: window.innerWidth < 768 ? true : false,
		});
	};

	onInputChange = (e, type, name) => {
		if (this.state.editEventData) {
			// Handle edit mode
			this.setState((prevState) => ({
				editEventData: {
					...prevState.editEventData,
					[name]:
						name === 'date'
							? moment(e).format('DD MMM YYYY') === 'Invalid date'
								? ''
								: moment(e).format('DD MMM YYYY')
							: name === 'nameReactSelect' || name === 'name'
							? e
							: e.target.value,
				},
			}));
		} else {
			if (type === false) {
				this.setState({
					//answer: name === 'date' ? e : e.target.value,
					isSlideError: false,
					[name]:
						name !== 'date'
							? name !== 'name' &&
							  name !== 'nameReactSelect' &&
							  name !== 'crew' &&
							  name !== 'crewReactSelect'
								? e.target.value
								: e
							: moment(e).format('DD MMM YYYY') === 'Invalid date'
							? ''
							: moment(e).format('DD MMM YYYY'),
				});
				if (name === 'name' || name === 'nameReactSelect') {
					this.setState({
						addEventError: false,
						addEventArrMessage: '',
					});
				}
				if (name === 'crew' || name === 'crewReactSelect') {
					this.setState({
						addFeedbackError: false,
						addFeedbackArrMessage: '',
					});
				}
			} else {
				let events = [...this.state.events];
				let key = this.state.activeEvent;

				events[key][name] =
					name !== 'date'
						? name !== 'name' && name !== 'nameReactSelect'
							? e.target.value
							: e
						: moment(e).format('DD MMM YYYY') === 'Invalid date'
						? ''
						: moment(e).format('DD MMM YYYY');

				this.setState({
					events,
				});

				let feedbacks = [...this.state.feedbacks];
				let fey = this.state.activeEvent;

				feedbacks[fey][name] =
					name !== 'crew' && name !== 'crewReactSelect' ? e.target.value : e;

				this.setState({
					feedbacks,
				});
			}
		}
	};
	handleRemove = (name, isActive) => {
		if (isActive == false) {
			this.setState({
				[name]: '',
			});
		} else {
			let events = [...this.state.events];
			let key = this.state.activeEvent;

			events[key][name] = '';

			this.setState({
				events,
			});
		}
	};
	handleChangeEvent = (e) => {
		if (e == null) {
			this.handleRemove('name', this.state.activeEvent == null ? false : true);
			this.handleRemove('nameReactSelect', this.state.activeEvent == null ? false : true);
		} else {
			if (e.__isNew) {
				this.state.eventsJSON.push({
					value: _.size(this.state.eventsJSON),
					label: e.label,
					isAdded: true,
					eventNameFocused: true,
				});
			}

			this.onInputChange(e.label, this.state.activeEvent == null ? false : true, 'name');
			this.onInputChange(e, this.state.activeEvent == null ? false : true, 'nameReactSelect');
		}
	};
	handleAddEvent = (e) => {
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

		const events = [...(this.state.events || [])];

		const isDuplicate = events.some((event, index) => {
			// Case-insensitive comparison for duplicates
			// When editing, we want to check against all events except the one being edited
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
			// Update existing event
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
					editEventData: null,
					addEventError: false,
					addEventArrMessage: '',
				},
				() => {
					this.props.setAnswer(updatedEvents);
					this.closeModal();
				},
			);
		} else {
			// Add new event
			let addEventArr = {
				name: this.state.name,
				nameReactSelect: this.state.nameReactSelect,
				date: this.state.date,
				time: this.state.time,
				location: this.state.location,
				noOfGuests: this.state.noOfGuests,
			};

			events.push(addEventArr);
			this.setState(
				{
					events,
					addEventError: false,
					addEventArrMessage: '',
				},
				() => {
					this.props.setAnswer(events);
					this.closeModal();
				},
			);
		}
	};

	closeModal = () => {
		if (this.state.date) {
			this.setState({ calenderStartdate: this.state.date });
		}
		this.setState({
			showModal: false,
			isSlideError: false,
			isErrorMessage: '',
			addEventArrMessage: '',
			addEventError: false,
			name: '',
			date: '',
			location: '',
			time: '',
			noOfGuests: '',
			showAddEvent: false,
			isMobileModal: false,
			dateFocused: false,
			eventNameFocused: false,
			isEventsSlideError: false,
			activeEvent: null,
			nameReactSelect: { value: null, label: null },
			editEventData: null,
		});
	};
	handleRemoveEvent = (e, key, type) => {
		let arr = [];
		_.map(this.state.events, (val, k) => {
			if (k !== key) {
				let obj = { ...val };
				delete obj?.['nameReactSelect'];
				arr.push(obj);
			}
		});
		this.setState(
			{
				showModal: false,
				activeEvent: null,
			},
			() => {
				this.setState(
					{
						events: arr,
					},
					() => {
						this.props.setAnswer(arr);
					},
				);
			},
		);
	};
	handleDeleteOption = (e, k) => {
		e.stopPropagation();
		let options = [...this.state.options];
		let arr = [];
		_.map(options, (opt, key) => {
			if (key !== k) {
				arr.push(opt);
			}
		});
		this.setState(
			{
				options: arr,
			},
			() => {
				this.props.setOptions(arr);
			},
		);
	};
	handleEditOption = (e, k) => {
		this.setState({
			editOption: true,
			editOptionKey: k,
		});
	};
	editOption = (e, k) => {
		e.stopPropagation();
		let options = [...this.state.options];
		let arr = [];
		_.map(options, (opt, key) => {
			if (key == k) {
				opt = e.target.value;
			}
			arr.push(opt);
		});
		this.setState(
			{
				options: arr,
			},
			() => {
				this.props.setOptions(arr, true);
			},
		);
	};
	render() {
		return (
			<>
				<Helmet>
					<style type="text/css">{`
        .form-group input::placeholder{
			color:${this?.state?.setActiveTheme?.placeHolder} !important
		}
		.form-group input{
			color : ${this?.state?.setActiveTheme?.text} !important;
		}
		.answer input{
			border: 1px solid ${this?.state?.setActiveTheme?.fieldBorder} !important;
			background: ${this?.state?.setActiveTheme?.fieldFill} !important
		}
    `}</style>
				</Helmet>
				<div
					// ${this.state.showBlockOptions ? 'borderedBlock' : ''}
					className={`form-group
						${this.props?.activeFormQuestion === this.props?.id ? 'borderedBlock' : ''}
						 `}
					onClick={(e) => {
						if (this.state.preview !== true) {
							this.toggleSideBar(e);
						}
					}}
					onMouseEnter={() => {
						if (this.state.preview !== true) {
							this.setState({ showBlockOptions: true });
						}
					}}
					onMouseLeave={() => {
						this.setState({ showBlockOptions: false });
					}}
					ref={this.blockRef}
				>
					{this.state.showBlockActions ? (
						<div className="block-action-bar" style={{ right: -124 }}>
							{/* <span>
<Edit />
</span>
<span>
<Copy />
</span> */}
							<span
								onClick={() => {
									if (!(this.props.index === this.props.itemsLength)) {
										this.props.moveItem(this.props.index, this.props.index + 1);
									}
								}}
								disabled={this.props.index === this.props.itemsLength}
								style={{
									cursor:
										this.props.index === this.props.itemsLength
											? 'not-allowed'
											: 'pointer',
								}}
							>
								<Down />
							</span>
							<span
								onClick={() => {
									if (!(this.props.index === 1)) {
										this.props.moveItem(this.props.index, this.props.index - 1);
									}
								}}
								disabled={this.props.index === 1}
								style={{
									cursor: this.props.index === 1 ? 'not-allowed' : 'pointer',
								}}
							>
								<Up />
							</span>
							{!restrictedQuestions.includes(this.props.variableId) ? (
								<span onClick={(e) => this.props.deleteQuestion(e)}>
									<Delete />
								</span>
							) : (
								''
							)}
						</div>
					) : (
						''
					)}
					{this.state.showBlockOptions ? (
						<a
							className="add-block"
							onClick={(e) => this.props.addQuestion(e)}
							style={{ top: 'auto', bottom: -17, width: 128 }}
						>
							Add Question
						</a>
					) : (
						''
					)}
					<div
						className="question"
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 5,
							marginBottom: 5,
						}}
					>
						{this.state.preview ? (
							<>
								<div
									dangerouslySetInnerHTML={{
										__html: this.props.question,
									}}
									style={{
										width: 'fit-content',
										color: this.state.client && 'red',
									}}
									id={this.props.id}
								/>
								{this.props.isRequired ? '*' : ''}
							</>
						) : (
							<Text
								isWorkflow={this.props.isWorkflow}
								text={`${this.props.question}`}
								setContent={(e) => this.props.handleSetContent(e)}
								setTab={(e) => this.props.handleSetFTab(e)}
								handleSelection={(e, activeTextBlock) =>
									this.props.handleFBSelection('f', activeTextBlock)
								}
								refID={this.props.id}
								actionType={this.state.actionType}
								actionValue={this.state.actionValue}
								activeSubBlockId={this.props.id}
								changeTextSelection={(val) => this.setState({ textSelection: val })}
								subBlockID={this.props.id}
								reference={'formQuestion' + this.props.id}
								clearStyling={() => this.props.clearStyle()}
								triggerFont={this.state.triggerFont}
								setTriggerFont={(e) => this.props.setTriggerFont(e)}
							/>
						)}
					</div>
					<div className="answer">
						{this.props.type !== 'multipleChoice' ? (
							this.props.type === 'singleChoice' || this.props.type === 'dropdown' ? (
								<MultiOptionInputs
									isTheme={this.state?.isTheme}
									setActiveTheme={this.state?.setActiveTheme}
									preview={this.state?.preview}
									previewType={this.state?.previewType}
									answer={this.state?.answer}
									setAnswer={(e) => this.props?.setAnswer(e)}
									type={this.props?.type}
									options={this.state?.options}
									addOptionForForm={(e) => this.props?.addOptionForForm(e)}
									isMultiple={this.props?.isMultiple}
									setOptions={(e, isEdit) => this.props?.setOptions(e, isEdit)}
								/>
							) : this.props?.type === 'email' ||
							  this.props?.type === 'link' ||
							  this.props?.type === 'number' ? (
								<SingleInputTypes
									isTheme={this.state?.isTheme}
									setActiveTheme={this.state?.setActiveTheme}
									preview={this.state?.preview}
									previewType={this.state?.previewType}
									answer={this.state.answer}
									setAnswer={(e) => this.props.setAnswer(e)}
									type={this.props?.type}
								/>
							) : this.props?.type === 'time' ||
							  this.props?.type === 'signature' ||
							  this.props?.type === 'fileUpload' ||
							  this.props?.type === 'rating' ? (
								<UniqueQTypes
									isTheme={this.state?.isTheme}
									setActiveTheme={this.state?.setActiveTheme}
									preview={this.state?.preview}
									previewType={this.state?.previewType}
									answer={this.state.answer}
									setAnswer={(e) => this.props?.setAnswer(e)}
									type={this.props?.type}
								/>
							) : this.props.type === 'longText' ? (
								<textarea
									placeholder={'Type your answer here'}
									type={'text'}
									value={this.state.answer}
									onChange={(e) => this.onChangeInput(e)}
									row={5}
									id={'textarea'}
									disabled={!this.state?.preview}
									className={'answerInput'}
									style={{
										backgroundColor: this.state.isTheme
											? this?.state?.setActiveTheme?.fieldFill
											: '#fff',
										border: this.state.isTheme
											? ` 1px solid ${this?.state?.setActiveTheme?.fieldBorder}`
											: '#fff',
										resize: 'none',

										paddingTop: '10px',
										marginTop: '15px',
										minHeight: '100px',
									}}
								/>
							) : this.props.type === 'date' ? (
								<DatePicker
									value={this.state.answer}
									selected={this.state.calenderStartdate}
									onChange={(e) => this.onChangeInput(e, 'date')}
									placeholderText={'Select date here'}
									dateFormat={'dd MMM yyyy'}
									className={'answerInput'}
									id="date-jumper"
									onKeyDown={(e) => {
										e.preventDefault();
									}}
									withPortal
									portalId={'portalId'}
									onChangeRaw={(e) => {
										e.preventDefault();
									}}
									disabledKeyboardNavigation
									disabled={!this.state?.preview}
									onFocus={(e) => e.target.blur()}
								/>
							) : this.props.type === 'phoneNumber' ? (
								<Input
									placeholder="Enter phone number"
									value={
										this.state?.answer && this.state?.answer.length > 0
											? this.state.answer
											: ''
									}
									onChange={(e) => this.onChangeInput(e)}
									defaultCountry={'IN'}
									international
									countryCallingCodeEditable={false}
									country={'US' / 'IN'}
									error={this.state.phoneNumberError}
									disabled={!this.state?.preview}
								/>
							) : this.props.type === 'events' ? (
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										gap: 10,
									}}
								>
									{_.size(this.state.events) > 0 && this.props.client == true ? (
										<table
											style={{
												width: '100%',
												margin: this.props.textAlign === 'left' ? 0 : '',
												borderCollapse: 'collapse',
											}}
											className={`eventsTable`}
											id={'eventsTable'}
										>
											<thead style={{ padding: '10px 0px' }}>
												<tr>
													<th
														style={{
															color: this.props.answersColor,
														}}
													>
														Event Name
													</th>
													<th
														style={{
															color: this.props.answersColor,
														}}
													>
														Date
													</th>
													<th
														style={{
															color: this.props.answersColor,
														}}
													>
														Time
													</th>
													<th
														style={{
															color: this.props.answersColor,
														}}
													>
														Location
													</th>
													<th
														style={{
															color: this.props.answersColor,
														}}
													>
														No of Guests
													</th>
													<th></th>
												</tr>
											</thead>
											<tbody>
												{_.map(this.state.events, (event, key) => {
													return (
														<>
															<tr
																style={{
																	border: `1px solid ${this.props.answersColor}`,
																}}
															>
																<td
																	style={{
																		color: this.props
																			.answersColor,
																	}}
																>
																	{event.name}
																</td>
																<td
																	style={{
																		color: this.props
																			.answersColor,
																	}}
																>
																	{event.date === ''
																		? ''
																		: event.date}
																</td>
																<td
																	style={{
																		color: this.props
																			.answersColor,
																	}}
																>
																	{event.time}
																</td>
																<td
																	style={{
																		color: this.props
																			.answersColor,
																	}}
																>
																	{event.location}
																</td>
																<td
																	style={{
																		color: this.props
																			.answersColor,
																	}}
																>
																	{event.noOfGuests}
																</td>
																<td
																	onClick={() =>
																		this.setState({
																			editEventData: {
																				...event,
																				originalName:
																					event.name, // Store original name for matching
																			},
																			showModal: true,
																			isMobileModal:
																				window.innerWidth <
																				768
																					? true
																					: false,
																		})
																	}
																>
																	<Pencil />
																</td>
																<td
																	onClick={(e) =>
																		this.handleRemoveEvent(
																			e,
																			key,
																			false,
																		)
																	}
																	ref={this[`${event.name}Ref`]}
																>
																	<b>
																		<RemoveIcon />
																	</b>
																</td>
															</tr>
															<tr
																style={{
																	height: '1px',
																}}
															></tr>
														</>
													);
												})}
											</tbody>
										</table>
									) : (
										''
									)}
									<a
										style={{
											borderRadius: '16px',
											backgroundColor: this.state?.isTheme
												? this.state?.setActiveTheme?.button
												: '#333',
											color: this.state?.isTheme
												? this.state?.setActiveTheme?.buttonText
												: '#fff',
											marginTop: 10,
											padding: '9px 15px',
											height: 44,
											width: 'fit-content',
											display: 'flex',
											alignItems: 'center',
											fontSize: 14,
										}}
										onClick={(e) =>
											this.props.client ? this.toggleShowModal(e) : ''
										}
									>
										Add Event
									</a>
								</div>
							) : (
								<input
									defaultValue={this.state.answer}
									placeholder={'Type your answer here'}
									type={this.props.type}
									pattern={this.props.type === 'date' ? 'd{4}-d{2}-d{2}' : null}
									onChange={(e) => this.onChangeInput(e)}
									className={`answerInput ${this.state?.fieldTypeStyle}`}
									enterkeyhint="done"
									style={{
										backgroundColor: this.state.isTheme
											? this?.state?.setActiveTheme?.fieldFill
											: '#fff',
										border: this.state.isTheme
											? ` 1px solid ${this?.state?.setActiveTheme?.fieldBorder}`
											: '#fff',
									}}
									disabled={!this.state?.preview}
								/>
							)
						) : (
							<>
								<div className="label">
									Choose one {this.props.isMultiple ? 'or more options' : ''}
								</div>
								<div className="options">
									{_.map(this.state.options, (option, k) => {
										return (
											<label
												style={{
													color: this.state.isTheme
														? this.state.setActiveTheme?.option
														: '#000',
												}}
												class="check-container"
												key={k}
												ref={(el) => (this.labelRefs[k] = el)}
											>
												{this.state.editOption == true &&
												this.state.editOptionKey == k ? (
													<div className="add-opt" style={{ height: 35 }}>
														<input
															value={option}
															onChange={(e) => this.editOption(e, k)}
															style={{ opacity: 1 }}
														/>
													</div>
												) : (
													option
												)}

												<input
													type="checkbox"
													checked={
														_.size(this.state.answer) > 0 &&
														this.state.answer.includes(`${option}`)
													}
													disabled={!this.state.preview}
													onChange={(e) =>
														this.setHandleAnswer(e, option)
													}
												/>
												<span class="checkmark"></span>
												{this.state.preview === false ? (
													<div className="edit-delete">
														<span>
															<a
																onClick={(e) =>
																	this.handleEditOption(e, k)
																}
															>
																<Edit />
															</a>
															<a
																onClick={(e) =>
																	this.handleDeleteOption(e, k)
																}
															>
																<Deleted />
															</a>
														</span>
													</div>
												) : (
													''
												)}
											</label>
										);
									})}
								</div>

								{this.state.preview === false ? (
									<a
										className="add-option"
										onClick={() =>
											this.setState({
												showAddOption: true,
											})
										}
									>
										+ Add Option
									</a>
								) : (
									''
								)}
								{this.state.showAddOption ? (
									<div className="add-opt">
										<input
											onChange={(e) =>
												this.setState({
													emptyOption: e.target.value,
												})
											}
											value={this.state.emptyOption}
										/>
										<span
											onClick={(e) =>
												this.state.emptyOption !== ''
													? this.setOpt(this.state.emptyOption)
													: ''
											}
										>
											Save
										</span>
									</div>
								) : (
									''
								)}
							</>
						)}
					</div>

					{this.props.type === 'events' &&
						(!this.state.isMobileModal ? (
							<Modal
								show={this.state.showModal}
								handleClose={this.closeModal}
								slide={this.state.slide}
								isEventModal={true}
							>
								<div className={'eventsModalContainer'}>
									<div className={'addEventParentWrapper'}>
										<div
											className={'closebutton'}
											onClick={() => this.closeModal()}
											style={{
												cursor: 'pointer',
											}}
										>
											<CloseButton />
										</div>

										<div className={'addEventWrapper'}>
											<div className={'addEventText'}>
												{' '}
												{this.state?.editEventData ? 'Edit' : 'Add'} Event
											</div>

											<div className={'eventFrameParent'}>
												<div className={'eventField'}>
													{/* select field  */}

													<div
														class={`floating-label ${
															this.state.addEventError
																? 'error-label'
																: ''
														}`}
													>
														<CreatableSelect
															className="floating-select floating-select-no-padding"
															classNamePrefix="select"
															value={
																this.state.editEventData
																	? this.state.editEventData
																			?.nameReactSelect
																	: this.state.activeEvent == null
																	? this.state.nameReactSelect
																	: this.state.events[
																			this.state.activeEvent
																	  ].nameReactSelect
															}
															onChange={(e) =>
																this.handleChangeEvent(e)
															}
															isClearable={
																this.state.activeEvent == null
																	? true
																	: false
															}
															name="color"
															options={this.state.eventsJSON}
															placeholder="Event Name"
															onFocus={(e) =>
																this.setState({
																	eventNameFocused: true,
																})
															}
														/>

														<span class="highlight"></span>
														<label
															className={
																this.state.eventNameFocused ||
																this.state?.editEventData?.name
																	? 'label'
																	: ''
															}
														>
															{this.state.addEventError === false
																? 'Event Name*'
																: this.state.addEventArrMessage}
														</label>
													</div>

													{/* date field  */}

													<div class="floating-label">
														{this.state.activeEvent == null ? (
															this.state.date !== 'Invalid date' &&
															this.state.date !== '' ? (
																<span
																	onClick={(e) =>
																		this.setState({
																			date: '',
																			dateFocused: false,
																		})
																	}
																	className="clearDate"
																>
																	{/* Remove */}
																	<RemoveIcon />
																</span>
															) : (
																''
															)
														) : this.state.events[
																this.state.activeEvent
														  ].date !== 'Invalid date' &&
														  this.state.events[this.state.activeEvent]
																.date !== '' ? (
															<span
																className="clearDate"
																onClick={(e) => {
																	this.onInputChange(
																		'',
																		true,
																		'date',
																	);
																}}
															>
																{/* Remove */}
																<RemoveIcon />
															</span>
														) : (
															''
														)}

														<DatePicker
															value={
																this.state?.editEventData
																	? this.state?.editEventData
																			?.date
																	: this.state.date
															}
															ref={this.datePickerRef}
															selected={
																this.state?.editEventData
																	? this.state?.editEventData
																			?.date
																	: this.state.calenderStartdate
															}
															onSelect={(e) => {
																this.onInputChange(
																	e,
																	this.state.activeEvent == null
																		? false
																		: true,
																	'date',
																);
																this.setState({
																	calenderStartdate: new Date(
																		moment(e).format(
																			'DD MMM YYYY',
																		),
																	),
																});
															}}
															dateFormat={'dd MMM yyyy'}
															onFocus={(e) =>
																this.setState({
																	dateFocused: true,
																})
															}
															onBlur={(e) =>
																this.setState({
																	dateFocused: false,
																})
															}
															className={'floating-select'}
															popperClassName={'popperclassname'}
															onKeyDown={(e) => {
																e.preventDefault();
															}}
														/>
														<span className="calendarsvgIcon">
															<CalendarSvg
																onClick={() => {
																	if (
																		this.datePickerRef.current
																	) {
																		this.datePickerRef.current.setOpen(
																			true,
																		);
																	}
																}}
															/>
														</span>
														<span class="highlight"></span>
														<label
															className={
																this.state?.editEventData?.date ||
																this.state.dateFocused ||
																this.state.date
																	? 'label'
																	: ''
															}
														>
															Date
														</label>
													</div>

													<div class="floating-label">
														<select
															class="floating-select select-one"
															value={
																this.state?.editEventData
																	? this.state?.editEventData
																			?.time
																	: this.state.activeEvent == null
																	? this.state.time
																	: this.state.events[
																			this.state.activeEvent
																	  ].time
															}
															onChange={(e) =>
																this.onInputChange(
																	e,
																	this.state.activeEvent == null
																		? false
																		: true,
																	'time',
																)
															}
															attr={
																this.state?.editEventData
																	? this.state?.editEventData
																			?.time
																	: this.state.activeEvent == null
																	? this.state.time
																	: this.state.events[
																			this.state.activeEvent
																	  ].time
															}
														>
															<option value="" disabled>
																{' '}
															</option>
															{_.map(timeJSON, (time, key) => {
																return (
																	<option value={time} key={key}>
																		{time}
																	</option>
																);
															})}
														</select>
														<span class="highlight"></span>
														<label>Time</label>
														{this.state.activeEvent == null ? (
															this.state.time !== '' ? (
																<b
																	style={{
																		position: 'absolute',
																		right: '-29px',
																		top: '6px',
																	}}
																	onClick={() =>
																		this.handleRemove(
																			'time',
																			false,
																		)
																	}
																>
																	<RemoveIcon />
																</b>
															) : (
																''
															)
														) : this.state.events[
																this.state.activeEvent
														  ].time !== '' ? (
															<b
																style={{
																	position: 'absolute',
																	right: '-29px',
																	top: '6px',
																}}
																onClick={() =>
																	this.handleRemove('time', true)
																}
															>
																<RemoveIcon />
															</b>
														) : (
															''
														)}
													</div>

													<div class="floating-label">
														<input
															class="floating-input"
															type="text"
															value={
																this.state?.editEventData
																	? this.state?.editEventData
																			?.location
																	: this.state.activeEvent == null
																	? this.state.location
																	: this.state.events[
																			this.state.activeEvent
																	  ].location
															}
															placeholder={''}
															onChange={(e) =>
																this.onInputChange(
																	e,
																	this.state.activeEvent == null
																		? false
																		: true,
																	'location',
																)
															}
														/>
														<span class="highlight"></span>
														<label>Location</label>
													</div>

													<div class="floating-label">
														<input
															class="floating-input"
															type="text"
															value={
																this.state?.editEventData
																	? this.state?.editEventData
																			?.noOfGuests
																	: this.state.activeEvent == null
																	? this.state.noOfGuests
																	: this.state.events[
																			this.state.activeEvent
																	  ].noOfGuests
															}
															placeholder={' '}
															onChange={(e) =>
																this.onInputChange(
																	e,
																	this.state.activeEvent == null
																		? false
																		: true,
																	'noOfGuests',
																)
															}
														/>
														<span class="highlight"></span>
														<label>Number of guests</label>
													</div>
												</div>

												{/* component 850 */}
												<div
													className={'eventButton'}
													onClick={(e) => this.handleAddEvent(e)}
												>
													{this.state?.editEventData
														? 'Update'
														: this.state.activeEvent == null
														? 'Add '
														: 'Delete'}
												</div>
											</div>
										</div>
									</div>
									{/* <div
									style={{
										display: 'flex',
										width: '100%',
										justifyContent: 'center',
										flexDirection: 'column',
									}}
								>
									<div
										style={{
											display: 'flex',

											justifyContent:
												this.props.textAlign === 'left'
													? 'flex-start'
													: 'center',
										}}
									></div>
									<a
										className={'addEventBtn'}
										onClick={(e) => this.handleAddEvent(e)}
										style={{
											borderRadius: '12px',
											backgroundColor: '#333',
											color: '#fff',
											width: '100%',
											padding: '7px 12px',
											height: 44,
											display: 'flex',
											alignItems: 'center',
											fontSize: 14,
											width: 'fit-content',
										}}
									>
										{this.state.activeEvent == null
											? 'Add Event'
											: 'Delete Event'}
									</a>
								</div> */}
								</div>
							</Modal>
						) : (
							<BottomModal show={this.state.showModal} onHide={this.closeModal}>
								<div className={'eventsModalContainer'} style={{ width: '100%' }}>
									<div
										className={'addEventParentWrapper'}
										style={{ width: '100%' }}
									>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
												width: '100%',
												marginBottom: '15px',
											}}
										>
											<div
												className={'addEventText'}
												style={{
													width: '100%',
													fontFamily: 'Inter',
												}}
											>
												{this.state?.editEventData ? 'Edit' : 'Add'} Event
											</div>
											<div
												className={'closebutton'}
												onClick={() => this.closeModal()}
												style={{
													cursor: 'pointer',
												}}
											>
												<CloseButton />
											</div>
										</div>

										<div className={'addEventWrapper'}>
											<div className={'eventFrameParent'}>
												<div className={'eventField'}>
													{/* select field  */}

													<div
														class={`floating-label ${
															this.state.addEventError
																? 'error-label'
																: ''
														}`}
													>
														<CreatableSelect
															className="floating-select floating-select-no-padding"
															classNamePrefix="select"
															value={
																this.state.editEventData
																	? this.state.editEventData
																			?.nameReactSelect
																	: this.state.activeEvent == null
																	? this.state.nameReactSelect
																	: this.state.events[
																			this.state.activeEvent
																	  ].nameReactSelect
															}
															onChange={(e) =>
																this.handleChangeEvent(e)
															}
															isClearable={
																this.state.activeEvent == null
																	? true
																	: false
															}
															name="color"
															options={this.state.eventsJSON}
															placeholder="Event Name"
															onFocus={(e) =>
																this.setState({
																	eventNameFocused: true,
																})
															}
														/>

														<span class="highlight"></span>
														<label
															className={
																this.state.eventNameFocused ||
																this.state?.editEventData?.name
																	? 'label'
																	: ''
															}
														>
															{this.state.addEventError === false
																? 'Event Name*'
																: this.state.addEventArrMessage}
														</label>
													</div>

													{/* date field  */}

													<div
														style={{
															display: 'flex',
															gap: '10px',
															alignSelf: 'stretch',
															alignItems: 'center',
														}}
													>
														<div class="floating-label">
															<DatePicker
																value={
																	this.state?.editEventData
																		? this.state?.editEventData
																				?.date
																		: this.state.date
																}
																ref={this.datePickerRef}
																selected={
																	this.state?.editEventData
																		? this.state?.editEventData
																				?.date
																		: this.state
																				.calenderStartdate
																}
																onSelect={(e) => {
																	this.onInputChange(
																		e,
																		this.state.activeEvent ==
																			null
																			? false
																			: true,
																		'date',
																	);
																	this.setState({
																		calenderStartdate: new Date(
																			moment(e).format(
																				'DD MMM YYYY',
																			),
																		),
																	});
																}}
																dateFormat={'dd MMM yyyy'}
																onFocus={(e) =>
																	this.setState({
																		dateFocused: true,
																	})
																}
																onBlur={(e) =>
																	this.setState({
																		dateFocused: false,
																	})
																}
																className={'floating-select'}
																popperClassName={'popperclassname'}
																onKeyDown={(e) => {
																	e.preventDefault();
																}}
															/>
															<span className="calendarsvgIcon">
																<CalendarSvg
																	onClick={() => {
																		if (
																			this.datePickerRef
																				.current
																		) {
																			this.datePickerRef.current.setOpen(
																				true,
																			);
																		}
																	}}
																/>
															</span>
															<span class="highlight"></span>
															<label
																className={
																	this.state.dateFocused ||
																	this.state?.editEventData
																		?.date ||
																	this.state.date
																		? 'label'
																		: ''
																}
															>
																Date
															</label>
														</div>
														{this.state.activeEvent == null ? (
															this.state.date !== 'Invalid date' &&
															this.state.date !== '' ? (
																<span
																	onClick={(e) =>
																		this.setState({
																			date: '',
																			dateFocused: false,
																		})
																	}
																	className="clearDate"
																>
																	{/* Remove */}
																	<RemoveIcon />
																</span>
															) : (
																''
															)
														) : this.state.events[
																this.state.activeEvent
														  ].date !== 'Invalid date' &&
														  this.state.events[this.state.activeEvent]
																.date !== '' ? (
															<span
																className="clearDate"
																onClick={(e) => {
																	this.onInputChange(
																		'',
																		true,
																		'date',
																	);
																}}
															>
																{/* Remove */}
																<RemoveIcon />
															</span>
														) : (
															''
														)}
													</div>

													<div
														class="floating-label"
														style={{ width: '93%' }}
													>
														<select
															class="floating-select select-one"
															value={
																this.state?.editEventData
																	? this.state?.editEventData
																			?.time
																	: this.state.activeEvent == null
																	? this.state.time
																	: this.state.events[
																			this.state.activeEvent
																	  ].time
															}
															onChange={(e) =>
																this.onInputChange(
																	e,
																	this.state.activeEvent == null
																		? false
																		: true,
																	'time',
																)
															}
															attr={
																this.state?.editEventData
																	? this.state?.editEventData
																			?.time
																	: this.state.activeEvent == null
																	? this.state.time
																	: this.state.events[
																			this.state.activeEvent
																	  ].time
															}
														>
															<option value="" disabled>
																{' '}
															</option>
															{_.map(timeJSON, (time, key) => {
																return (
																	<option value={time}>
																		{time}
																	</option>
																);
															})}
														</select>
														<span class="highlight"></span>
														<label>Time</label>
														{this.state.activeEvent == null ? (
															this.state.time !== '' ? (
																<b
																	style={{
																		position: 'absolute',
																		right: '-29px',
																		top: '6px',
																	}}
																	onClick={() =>
																		this.handleRemove(
																			'time',
																			false,
																		)
																	}
																>
																	<RemoveIcon />
																</b>
															) : (
																''
															)
														) : this.state.events[
																this.state.activeEvent
														  ].time !== '' ? (
															<b
																style={{
																	position: 'absolute',
																	right: '-29px',
																	top: '6px',
																}}
																onClick={() =>
																	this.handleRemove('time', true)
																}
															>
																<RemoveIcon />
															</b>
														) : (
															''
														)}
													</div>

													<div class="floating-label">
														<input
															class="floating-input"
															type="text"
															value={
																this.state?.editEventData
																	? this.state?.editEventData
																			?.location
																	: this.state.activeEvent == null
																	? this.state.location
																	: this.state.events[
																			this.state.activeEvent
																	  ].location
															}
															placeholder={''}
															onChange={(e) =>
																this.onInputChange(
																	e,
																	this.state.activeEvent == null
																		? false
																		: true,
																	'location',
																)
															}
														/>
														<span class="highlight"></span>
														<label>Location</label>
													</div>

													<div class="floating-label">
														<input
															class="floating-input"
															type="text"
															value={
																this.state?.editEventData
																	? this.state?.editEventData
																			?.noOfGuests
																	: this.state.activeEvent == null
																	? this.state.noOfGuests
																	: this.state.events[
																			this.state.activeEvent
																	  ].noOfGuests
															}
															placeholder={' '}
															onChange={(e) =>
																this.onInputChange(
																	e,
																	this.state.activeEvent == null
																		? false
																		: true,
																	'noOfGuests',
																)
															}
														/>
														<span class="highlight"></span>
														<label>Number of guests</label>
													</div>
												</div>

												{/* component 850 */}
												<div
													className={'eventButton'}
													style={{
														marginBottom: '25px',
													}}
													onClick={(e) => this.handleAddEvent(e)}
												>
													{this.state?.editEventData
														? 'Update'
														: this.state.activeEvent == null
														? 'Add '
														: 'Delete'}
												</div>
											</div>
										</div>
									</div>
									{/* <div
									style={{
										display: 'flex',
										width: '100%',
										justifyContent: 'center',
										flexDirection: 'column',
									}}
								>
									<div
										style={{
											display: 'flex',

											justifyContent:
												this.props.textAlign === 'left'
													? 'flex-start'
													: 'center',
										}}
									></div>
									<a
										className={'addEventBtn'}
										onClick={(e) => this.handleAddEvent(e)}
										style={{
											borderRadius: '12px',
											backgroundColor: '#333',
											color: '#fff',
											width: '100%',
											padding: '7px 12px',
											height: 44,
											display: 'flex',
											alignItems: 'center',
											fontSize: 14,
											width: 'fit-content',
										}}
									>
										{this.state.activeEvent == null
											? 'Add Event'
											: 'Delete Event'}
									</a>
								</div> */}
								</div>
							</BottomModal>
						))}
				</div>
			</>
		);
	}
}

export default FormElement;
