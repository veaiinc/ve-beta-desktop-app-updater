import React, { Component } from 'react';
import moment from 'moment';
import { ReactComponent as UpDown } from '../../svgs/dropDown.svg';
import _ from 'lodash';
import '../invoices/inovice.scss';

// avtions

import ReactPlayer from 'react-player';

//new lefrbar
import { ReactComponent as NewDelete } from '../../svgs/LeftBar/NewDelete.svg';
import { ReactComponent as NewDown } from '../../svgs/LeftBar/NewDown.svg';
import { ReactComponent as NewEdit } from '../../svgs/LeftBar/NewEdit.svg';
import { ReactComponent as NewCopy } from '../../svgs/LeftBar/NewCopy.svg';
import { ReactComponent as NewUp } from '../../svgs/LeftBar/NewUp.svg';

const padding = ['0px', '20px', '40px', '60px', '80px'];
const paddingHorizontal = ['0px', '70px', '140px', '210px', '280px'];
class PaymentSchedule extends Component {
	constructor(props) {
		super();
		this.state = {
			showBlockActions: false,
			showBlockOptions: false,
			preview: props.preview,
			previewType: props.previewType,
			tables: props.tables,
			client: props?.client,
			activePayment: props?.style?.isEqualPercentage ? 'equal' : 'percentage',
			showSchedule: props.showSchedule,
			showDateInput: true,
			showDateOptions: false,
			activeId: 0,
			dateInputIndex: null,
			paymentSchedule: props.paymentSchedule || [],
			percentageError: false,
			showDelete: false,
			showAnimation: false,
			scheduleContainerRef: React.createRef(),
			isActiveSection: props.isActiveSection,

			style: props.style,

			backgroundType: props.backgroundType,
			backgroundImageURL: props?.backgroundImageURL,
			backgroundVideoURL: props.backgroundVideoURL,
			debounceInterval: null,
		};
		this.blockRef = React.createRef();
		this.updatePaymentStatuses = this.updatePaymentStatuses.bind(this);
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.paymentSchedule !== nextProps.paymentSchedule) {
			this.setState({
				paymentSchedule: nextProps.paymentSchedule,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.tables !== nextProps.tables) {
			this.setState({
				tables: nextProps.tables,
			});
		}
		if (this.state.client !== nextProps.client) {
			this.setState({
				client: nextProps.client,
			});
		}
		if (this.state.showSchedule !== nextProps.showSchedule) {
			this.setState({
				showSchedule: nextProps.showSchedule,
			});
		}
		if (this.state.isActiveSection !== nextProps.isActiveSection) {
			this.setState(
				{
					isActiveSection: nextProps.isActiveSection,
				},
				() => {
					this.setState({
						showBlockOptions: nextProps.isActiveSection,
					});
				},
			);
		}
		if (this.state.style !== nextProps.style) {
			this.setState({
				style: nextProps.style,
			});
		}
		if (this.state.backgroundType !== nextProps.backgroundType) {
			this.setState({
				backgroundType: nextProps.backgroundType,
			});
		}
		if (this.state.backgroundImageURL !== nextProps.backgroundImageURL) {
			this.setState({
				backgroundImageURL: nextProps.backgroundImageURL,
			});
		}
		if (this.state.backgroundVideoURL !== nextProps.backgroundVideoURL) {
			this.setState({
				backgroundVideoURL: nextProps.backgroundVideoURL,
			});
		}
	};
	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
		this.updatePaymentStatuses();
	}
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}
	handleInvClick = (e) => {
		this.props.handleSideBar(e, null), this.props.setTab('b');
	};

	handleClickOutside = (event) => {
		if (this.blockRef.current && !this.blockRef.current.contains(event.target)) {
			this.setState({
				showBlockActions: false,
			});
		}
	};

	toggleSideBar = (e) => {
		this.setState(
			{
				showBlockActions: true,
			},
			() => {
				this.props.handleSideBar(e, this.props._id);
			},
		);
	};
	hanldeAddBlock = (e) => {
		e.stopPropagation();
		this.props.showAddBlock(e);
	};
	handleBlock = (e) => {
		this.props.selectBlock('b');
	};

	handleDeleteSection = (e) => {
		this.props.deleteSection(this.props._id);
	};
	handleDuplicate = () => {
		this.props.duplicateBlock(this.props._id);
	};

	// CRUD of payment functions
	handlePayment = (payment) => {
		this.setState({
			activePayment: payment,
		});

		let paymentStyles = {
			...this.state?.style,
			isEqualPercentage: payment === 'equal' ? true : false,
		};
		this.calculateAndUpdateEqualValue(paymentStyles);
		// this.props.setPaymentSchedule(this.state.paymentSchedule, paymentStyles);
	};

	addPayment = () => {
		if (this.props?.module === 'invoice') {
			const today = moment().startOf('day');
			const newDueDate = moment().format('YYYY-MM-DD');
			const initialStatus = moment(newDueDate).startOf('day').isSame(today)
				? 'due today'
				: 'upcoming';
			const newPayment = {
				amount: 0,
				amountPercentage: 0,
				dueDate: newDueDate,
				paymentDate: null,
				paymentId: null,
				status: initialStatus,
				type: 'custom Date',
			};

			this.setState(
				(prevState) => ({
					paymentSchedule: [...prevState.paymentSchedule, newPayment],
					// paymentSchedule: [...prevState.paymentSchedule, { subBlocks: [newPayment] }],
				}),
				this.SavePaymentSchedule,
			);
		} else {
			this.props.addPaymentScheduleBlock(
				this.props?._id,
				this.state?.paymentSchedule?.length + 1,
			);
		}
	};

	deletePayment = (id, index) => {
		this.setState(
			(prevState) => ({
				paymentSchedule: prevState?.paymentSchedule?.filter(
					(block, i) => block?._id !== id,
				),
			}),
			() => {
				this.calculateAndUpdateEqualValue();
			},
		);
	};

	// percentage functions
	checkTotalPercentage = () => {
		const totalPercentage = this.state.paymentSchedule.reduce((sum, payment) => {
			return sum + parseFloat(payment?.subBlocks[0]?.amountPercentage || 0);
		}, 0);

		this.setState({
			percentageError: totalPercentage > 100,
		});
	};
	getPercentage = (equalValue = null) => {
		if (equalValue) {
			equalValue = Number(equalValue);
			equalValue = (equalValue / 100) * this.props?.clientGrandTotal;
			return equalValue.toFixed(2);
		} else {
			const totalPayments = this.state.paymentSchedule.length;
			return totalPayments > 0 ? (100 / totalPayments).toFixed(2) : 0;
		}
	};
	handleDebounceFuntion = (func, timeOut = 800) => {
		if (this.state.debounceInterval) {
			clearTimeout(this.state.debounceInterval);
		}
		const timeFunction = setTimeout(() => {
			func();
		}, timeOut);
		this.setState({
			debounceInterval: timeFunction,
		});
	};

	// !previouse logic
	// handlePercentageChange = (e, index) => {
	// 	const { value } = e.target;
	// 	if (/^\d*$/.test(value)) {
	// 		this.setState(
	// 			(prevState) => {
	// 				const updatedPayments = [...prevState?.paymentSchedule];
	// 				// updatedPayments[index].amountPercentage = value;
	// 				updatedPayments[index].subBlocks[0].amountPercentage = value;
	// 				return { paymentSchedule: updatedPayments };
	// 			},
	// 			() => {
	// 				this.checkTotalPercentage();
	// 				setTimeout(() => {
	// 					this.SavePaymentSchedule();
	// 				}, 500);
	// 			},
	// 		);
	// 	}
	// };

	handlePercentageChange = (e, index) => {
		const { value } = e.target;

		if (/^\d*$/.test(value)) {
			this.setState(
				(prevState) => {
					const updatedPayments = [...prevState?.paymentSchedule];
					updatedPayments[index].amountPercentage = value;
					updatedPayments[index].subBlocks[0].amountPercentage = value;
					return { paymentSchedule: updatedPayments };
				},
				() => {
					this.handleDebounceFuntion(async () => {
						await this.checkTotalPercentage();
						await this.SavePaymentSchedule();
					}, 1000);
				},
			);
		}
	};

	// due date functions and elements
	renderDateInput(data, index, id) {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		if (this.state.showDateInput && this.state.dateInputIndex === index) {
			return (
				<input
					type="date"
					onChange={(e) => this.handleCustomDateInput(e, index, id)}
					onBlur={this.handleDateInputBlur}
					defaultValue={data.dueDate}
					className="date-input-calendar"
					autoFocus
					min="1000-01-01" // Set minimum date
					max="9999-12-31" // Set maximum date
				/>
			);
		}
		const dueDate = new Date(data.type === 'custom Date' && data.dueDate);

		if (data.type === 'custom Date' && isNaN(dueDate.getTime())) {
			return <p>Invalid date</p>; // Or any fallback UI
		}
		return (
			<>
				<p style={{ color: this.state?.style?.paymentFontColor || '#000' }}>
					{data?.type === 'custom Date'
						? dueDate?.toLocaleDateString('en-US', options)
						: data?.dueDate}
				</p>
				{!this.props?.client && this.state?.previewType !== 'm' && (
					<UpDown
						onClick={() => {
							if (data?.status !== 'paid') {
								if (this.state?.activeId !== index) {
									this.setState({
										showDateOptions: true,
										activeId: index,
									});
								} else {
									this.setState({
										showDateOptions: !this.state?.showDateOptions,
									});
								}
							}
						}}
					/>
				)}
			</>
		);
	}
	handleDateInputBlur = (e) => {
		if (!e.relatedTarget || !e.relatedTarget.closest('.date-input-calendar')) {
			this.setState({
				showDateInput: false,
				dateInputIndex: null,
			});
		}
	};

	handleDueDateChange = (e, index) => {
		if (e === 'Invoice Sent Date') {
			this.setState(
				(prevState) => {
					const updatedPaymentData = prevState?.paymentSchedule?.map((payment, i) => {
						if (i === index) {
							return {
								...payment,
								subBlocks:
									payment?.subBlocks?.length > 0
										? [
												{
													...payment.subBlocks[0],
													dueDate: e,
													type: 'smart file sent',
													status:
														payment?.subBlocks[0]?.status || 'upcoming', // Fallback to 'upcoming' if status is undefined
												},
										  ]
										: [],
							};
						}

						return payment; // Leave other payments unchanged
					});
					// updatedPaymentData[index] = {
					// 	...updatedPaymentData[index],
					// 	dueDate: e,
					// 	type: 'smart file sent',
					// 	status: updatedPaymentData[index].status === 'paid' ? 'paid' : 'upcoming',
					// };
					return {
						paymentSchedule: updatedPaymentData,
						showDateOptions: false,
						showDateInput: false,
						dateInputIndex: null,
					};
				},
				() => {
					this.SavePaymentSchedule();
				},
			);
		} else if (e === 'custom Date') {
			this.setState({
				showDateInput: true,
				showDateOptions: false,
				dateInputIndex: index,
			});
		} else if (e === 'Smart Date') {
			this.setState({
				showDateOptions: false,
				showDateInput: false,
				dateInputIndex: null,
			});
		}
	};

	handleCustomDateInput = (e, index, id) => {
		const inputDate = e.target.value;

		// Validate the date input
		const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
		if (!dateRegex.test(inputDate)) {
			return; // Exit if date format is invalid
		}

		const today = moment().startOf('day');
		const newDueDate = moment(inputDate).startOf('day');

		if (!newDueDate.isValid()) {
			return; // Exit if date is invalid
		}

		let newStatus;
		if (newDueDate.isSame(today)) {
			newStatus = 'due today';
		} else if (newDueDate.isBefore(today)) {
			newStatus = 'overdue';
		} else {
			newStatus = 'upcoming';
		}

		this.setState(
			(prevState) => {
				const updatedPaymentData = prevState.paymentSchedule.map((payment, i) => {
					// Only update the specified index
					if (i === index) {
						const updatedSubBlocks = payment?.subBlocks?.map((subBlock) => {
							return {
								...subBlock,
								dueDate: inputDate, // Update due date
								type: 'custom Date', // Mark as custom date
								status: subBlock?.status === 'paid' ? 'paid' : newStatus, // Retain 'paid' if already paid
							};
						});

						return {
							...payment,
							subBlocks: updatedSubBlocks,
						};
					}
					return payment; // Leave other payments unchanged
				});
				// updatedPaymentData[index] = {
				// 	...updatedPaymentData[index],
				// 	dueDate: inputDate,
				// 	type: 'custom Date',
				// 	status: updatedPaymentData[index].status === 'paid' ? 'paid' : newStatus,
				// };
				return {
					paymentSchedule: updatedPaymentData,
					showDateInput: true, // Keep the input open until explicitly closed
					dateInputIndex: index,
				};
			},
			() => {
				setTimeout(() => {
					this.SavePaymentSchedule();
				}, 500);
			},
		);
	};

	// status color function
	getStatusColor = (status) => {
		switch (status?.toLowerCase()) {
			case 'paid':
				return '#4CAF50'; // green
			case 'overdue':
				return '#F44336'; // red
			case 'due today':
				return '#FFA726'; // orange
			case 'upcoming':
				return '#2196F3'; // blue
			default:
				return 'inherit';
		}
	};

	// saving the payment schedule data
	calculateAndUpdateEqualValue = (styles = null) => {
		const totalPayments = this.state.paymentSchedule.length;
		const newEqualValue = totalPayments > 0 ? (100 / totalPayments).toFixed(2) : 0;

		this.setState(
			(prevState) => ({
				paymentSchedule: prevState?.paymentSchedule?.map((data) => ({
					...data,
					subBlocks:
						data?.subBlocks?.length > 0
							? [
									// Check if subBlocks exists and has elements
									{
										...data.subBlocks[0],
										equalValue: newEqualValue,
									},
							  ]
							: [],
				})),
			}),
			() => {
				if (styles) {
					this.props?.setPaymentSchedule(this.state?.paymentSchedule, styles);
				} else {
					this.props?.setPaymentSchedule(this.state?.paymentSchedule);
				}
			},
		);
	};
	updatePaymentStatuses() {
		const today = moment().startOf('day');
		this.setState(
			(prevState) => ({
				previewType: prevState?.previewType,
				paymentSchedule: prevState?.paymentSchedule?.map((payment) => {
					// const payment= payment.subBlocks[0];
					// Skip updating status if payment is already paid
					if (payment?.subBlocks[0]?.status === 'paid') return payment;

					const dueDate = moment(payment?.subBlocks[0]?.dueDate).startOf('day');

					let newStatus;
					if (dueDate.isSame(today)) {
						newStatus = 'due today';
					} else if (dueDate.isBefore(today)) {
						newStatus = 'overdue';
					} else {
						newStatus = 'upcoming';
					}

					return {
						// ...payment,
						// status: newStatus,
						...payment,
						subBlocks: [
							{
								...payment?.subBlocks[0],
								status: newStatus,
							},
						],
					};
				}),
			}),
			() => {
				// After updating statuses, save to parent component if needed
				if (this.props?.setPaymentSchedule) {
					this.props?.setPaymentSchedule(this.state?.paymentSchedule);
				}
			},
		);
	}

	SavePaymentSchedule = () => {
		const totalPayments = this.state?.paymentSchedule?.length;
		const newEqualValue = totalPayments > 0 ? (100 / totalPayments).toFixed(2) : 0;

		const updatedPaymentSchedule = this.state?.paymentSchedule?.map((data, index) => ({
			// ...data,

			// equalValue: newEqualValue,
			...data,
			subBlocks:
				data?.subBlocks?.length > 0
					? [
							// Check if subBlocks exists and has elements
							{
								...data.subBlocks[0],
								equalValue: newEqualValue,
							},
					  ]
					: [],
		}));

		this.setState({ paymentSchedule: updatedPaymentSchedule }, () => {
			setTimeout(() => {
				this.props?.setPaymentSchedule(this.state?.paymentSchedule);
			}, 500);
		});
	};
	render() {
		return (
			<div
				style={{
					width: '100%',
					alignItems: 'center',
					position: 'relative',
					backgroundColor:
						this.props?.module === 'thankyou'
							? ''
							: this.state.style?.backgroundType !== 'video' &&
							  this.state.style?.backgroundType !== 'image'
							? this.state.style?.sectionBackgroundColor
							: '',
					backgroundImage:
						this.state?.style?.backgroundType == 'image' &&
						`url(${this.state?.style?.backgroundImageURL})`,
					// `url(https://cdn.pixabay.com/photo/2015/04/23/22/00/new-year-background-736885_1280.jpg)`,
					// backgroundSize: '100% 100%',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					// aspectRatio: 16/9,

					border: this.state?.preview ? 'none' : '',
					padding:
						this.props?.module === 'invoice'
							? '0px'
							: `${
									this.state?.style?.padding
										? padding[this.state?.style?.padding]
										: '0px'
							  } ${
									(this.state.previewType === 'm' ||
										this.state.previewType === 'ml') &&
									this.state.preview
										? this.state?.style?.noMPadding
											? '0px'
											: '14px'
										: this.state.style?.paddingHorizontal
										? paddingHorizontal[this.state.style.paddingHorizontal]
										: '0px'
							  }`,
					justifyContent: 'center',
				}}
				ref={this.blockRef}
				className={`block invoice-wrapper ${
					this.state?.showBlockOptions && this.props?.module !== 'invoice'
						? 'borderedBlock'
						: ''
				}`}
				onClick={(e) => {
					if (this.state?.preview !== true) {
						this.toggleSideBar(e);
					}
				}}
				onMouseEnter={() => {
					if (this.state?.preview !== true) {
						this.setState({ showBlockOptions: true });
					}
				}}
				onMouseLeave={() => {
					if (this.state?.isActiveSection == false) {
						this.setState({ showBlockOptions: false });
					}
				}}
			>
				{this.state?.style?.backgroundType == 'video' ||
					(this.state?.style?.backgroundType == 'image' &&
						this.props?.module !== 'invoice' && (
							<div
								className="bg-overlay"
								style={{
									backgroundColor: this.state?.style?.bgOverlayColor,
									opacity: this.state?.style?.bgOverlayOpacity / 100,
								}}
							></div>
						))}
				{this.state?.style?.backgroundType == 'video' &&
					this.state?.style?.backgroundVideoURL &&
					this.props?.module != 'invoice' && (
						<div className="bg-video-player">
							<ReactPlayer
								url={this.state?.style?.backgroundVideoURL}
								width="100%"
								height="100%"
								loop={true}
								onError={(e) => {
									this.props.handleIsValidBgVideoURL(false);
								}}
								onReady={(e) => this.props.handleIsValidBgVideoURL(true)}
								playing={true}
								muted
								controls={false}
							/>
						</div>
					)}
				{/* {this.state.showSchedule && ( */}
				{this.props?.module !== 'invoice' &&
				this.state?.showBlockActions &&
				this.state?.preview == false ? (
					<div className="block-action-bar">
						<span className="tooltip" onClick={(e) => this.handleBlock(e)}>
							<NewEdit />
							<label className="tooltip-text">Block&nbsp;Settings</label>
						</span>{' '}
						{!this.props?.activeModule?.showAsSlide && (
							<>
								<span className="tooltip" onClick={(e) => this.handleDuplicate(e)}>
									<NewCopy />
									<label className="tooltip-text">Duplicate</label>
								</span>{' '}
								<span
									className="tooltip"
									onClick={() => {
										if (!(this.props.index === this.props.itemsLength)) {
											this.props.moveItem(
												this.props.index,
												this.props.index + 1,
											);
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
									<NewDown />
									<label className="tooltip-text">Down</label>
								</span>
								<span
									className="tooltip"
									onClick={() => {
										if (!(this.props.index === 1)) {
											this.props.moveItem(
												this.props.index,
												this.props.index - 1,
											);
										}
									}}
									disabled={this.props.index === 1}
									style={{
										cursor: this.props.index === 1 ? 'not-allowed' : 'pointer',
									}}
								>
									<NewUp />
									<label className="tooltip-text">Up</label>
								</span>
							</>
						)}
						<span className="tooltip" onClick={(e) => this.handleDeleteSection(e)}>
							<NewDelete />
							<label className="tooltip-text">Delete</label>
						</span>
					</div>
				) : (
					''
				)}
				{this.props?.module !== 'invoice' &&
				!this.props?.activeModule?.showAsSlide &&
				this.state.showBlockOptions ? (
					<a className="add-block" onClick={(e) => this.hanldeAddBlock(e)}>
						Add Block
					</a>
				) : (
					''
				)}
				<div
					className="iw-payment"
					style={{
						gap: this.state?.previewType === 'm' && '8px',
						width: this.state?.previewType != 'm' ? '792px' : '100%',
						borderRadius: '5px',
						zIndex: 3,
						margin: this.props?.module === 'invoice' ? '0px' : '30px 0px',
						background: this.state?.style?.paymentCardColor || '#fff',
					}}
					// onClick={() => this.handleInvClick()}
				>
					<div
						className="payment-show"
						// onClick={() => {
						// 	this.setState({
						//         showAnimation:!this.state.showAnimation,
						//     });

						// 	setTimeout(() => {
						// 		this.setState({
						// 			showSchedule: !this.state.showSchedule,
						// 			showAnimation:!this.state?.showAnimation,
						// 		});
						// 	}, 1000)
						// }
						// }
						// onClick={this.toggleScheduleContainer}
					>
						<p
							className="heading"
							style={{ color: this.state?.style?.paymentFontColor || '#000' }}
						>
							PAYMENT SCHEDULE
						</p>
						{/* <UpDown
                        style={{
                            rotate: !this.state.showSchedule && '180deg',
                        }}
                    /> */}
					</div>

					{this.state.previewType !== 'm' && !this.props?.client && (
						<div
							className="percentage-container schedule-container-anim-active"
							ref={this.state.scheduleContainerRef}
						>
							<p
								className={
									this.state.activePayment === 'percentage'
										? 'activePercentage'
										: ''
								}
								style={{
									color: this.state?.style?.paymentFontColor || '#000',
									background: this.state?.style?.paymentCardColor || '#fff',
									cursor: 'pointer',
									// border: `1px solid ${this.state?.style?.paymentFontColor || '#000'}`,
								}}
								onClick={(e) => {
									e.stopPropagation();
									this.handlePayment('percentage');
								}}
							>
								Percentage
							</p>
							<p
								className={
									this.state.activePayment === 'equal' ? 'activeEqual' : ''
								}
								style={{
									color: this.state?.style?.paymentFontColor || '#000',
									background: this.state?.style?.paymentCardColor || '#fff',
									cursor: 'pointer',
									// border: `1px solid ${this.state?.style?.paymentFontColor || '#000'}`,
								}}
								onClick={(e) => {
									e.stopPropagation();
									this.handlePayment('equal');
								}}
							>
								Equal
							</p>
						</div>
					)}
					{this.state.activePayment === 'equal' && (
						<div
							className="payment-details-container schedule-container-anim-active"
							ref={this.state.scheduleContainerRef}
						>
							<p style={{ color: this.state?.style?.paymentFontColor || '#000' }}>
								Number of payments : {this.state?.paymentSchedule?.length}
							</p>
						</div>
					)}
					{this.state.previewType !== 'm' && (
						<div
							className="payment-schedule-container schedule-container-anim-active"
							style={{
								zoom: this.state.previewType === 'm' ? 0.7 : 1,
							}}
							ref={this.state.scheduleContainerRef}
						>
							<p
								style={{
									width: '11.17%',
									color: this.state?.style?.paymentFontColor || '',
								}}
							>
								{this.props?.client ? 'AMOUNT' : 'PERCENTAGE'}
							</p>
							<p
								style={{
									width: '25.41%',
									color: this.state?.style?.paymentFontColor || '',
								}}
							>
								DUE DATE
							</p>
							<p
								style={{
									width: '16.65%',
									color: this.state?.style?.paymentFontColor || '',
								}}
							>
								PAYMENT DATE
							</p>
							<p
								style={{
									width: '17.65%',
									color: this.state?.style?.paymentFontColor || '',
								}}
							>
								PAYMENT ID
							</p>
							<p
								style={{
									width: '15.53%',
									color: this.state?.style?.paymentFontColor || '',
								}}
							>
								STATUS
							</p>
						</div>
					)}
					<div className="line"></div>
					{this.state.paymentSchedule?.map((block, index) => {
						const data = block?.subBlocks?.length > 0 ? block?.subBlocks[0] : {};
						return (
							<React.Fragment key={index}>
								<div
									className="payment-details-container schedule-container-anim-active"
									key={index}
									style={{
										zoom: this.state.previewType === 'm' ? 0.9 : 1,
									}}
									onMouseEnter={() => {
										this.setState({
											activeId: index,
											showDelete: true,
										});
									}}
									onMouseLeave={() => {
										this.setState({
											activeId: null,
											showDelete: false,
										});
									}}
								>
									<div
										className="m-amount-date-div"
										style={{
											width: this.state.previewType === 'm' ? '61%' : '38%',
											gap: this.state.previewType === 'm' && '15px',
											flexDirection:
												this.state.previewType === 'm' && 'column',

											alignItems:
												this.state.previewType === 'm' && 'flex-start',
										}}
									>
										{this.props?.client ? (
											<>
												<p
													style={{
														width:
															this.state.previewType === 'm'
																? ''
																: '30%',
														color:
															this.state?.style?.paymentFontColor ||
															'#000',
													}}
												>
													{this.props?.style?.isEqualPercentage
														? this?.getPercentage(data?.equalValue)
														: (
																(data?.amountPercentage / 100) *
																this.props?.clientGrandTotal
														  ).toFixed(2)}
												</p>
											</>
										) : (
											<>
												<input
													className={
														!this.state?.preview && !this.props?.client
															? 'perc-input'
															: ''
													}
													style={{
														width:
															this.state.previewType === 'm'
																? ''
																: '30%',
														color:
															this.state?.style?.paymentFontColor ||
															'#000',
													}}
													value={`${
														this.state?.activePayment === 'percentage'
															? data?.amountPercentage
															: this.getPercentage()
													}`}
													// defaultValue={`${
													// 	this.state?.activePayment === 'percentage'
													// 		? data?.amountPercentage
													// 		: this.getPercentage()
													// }`}
													maxLength={3}
													pattern="\d*"
													title="Only numbers are allowed"
													onChange={(e) => {
														this.handlePercentageChange(e, index);
													}}
													disabled={
														this.state?.activePayment !==
															'percentage' ||
														this.state?.preview ||
														this.state?.previewType?.includes('m') ||
														this.props?.client
													}
													// type='number'
												/>
											</>
										)}

										<div
											className="due-date-div"
											style={{
												width:
													this.state?.previewType === 'm' ? '80%' : '65%',
											}}
										>
											{this.renderDateInput(data, index, block?._id)}
										</div>
									</div>

									{this.state.showDateOptions &&
										this.state.activeId === index &&
										!this.state?.preview && (
											<div className="date-drop-down">
												<p
													onClick={(e) => {
														e.stopPropagation();
														this.handleDueDateChange(
															'Invoice Sent Date',
															index,
														);
													}}
												>
													Invoice Sent Date
												</p>
												{this.props?.isWorkflow && (
													<p
														onClick={() =>
															this.handleDueDateChange(
																'custom Date',
																index,
															)
														}
													>
														Custom Date
													</p>
												)}
												{/* <p onClick={()=> this.handleDueDateChange('Smart Date',index)}>Smart Date</p> */}
											</div>
										)}
									{this.state.previewType !== 'm' && (
										<>
											<p
												style={{
													width: '17.65%',
													textAlign: 'center',
												}}
											>
												{data?.paymentDate}
											</p>
											<p
												style={{
													width: '17.65%',
													textAlign: 'center',
												}}
											>
												{data?.paymentId}
											</p>
										</>
									)}
									<p
										style={{
											width:
												this.state.previewType === 'm' ? '20%' : '13.53%',
											textAlign: 'center',
											color: this.getStatusColor(data?.status || 'upcoming'),
										}}
										className="payment-status"
									>
										{data?.status}
									</p>
									{!this.state?.preview &&
									!this.state?.previewType?.includes('m') &&
									!this.props?.client &&
									this.state.showDelete &&
									this.state.activeId === index ? (
										<div
											className="delete-payment"
											onClick={(e) => {
												e.stopPropagation();
												this.deletePayment(block?._id, index);
											}}
											style={{
												cursor: 'pointer',
												color: 'black',
											}}
											title="delete payment"
										>
											X
										</div>
									) : (
										<div style={{ color: 'transparent' }}> X </div>
									)}
								</div>
								<div className="line schedule-container-anim-active"></div>
							</React.Fragment>
						);
					})}

					{this.state.percentageError && this.state.activePayment === 'percentage' && (
						<div style={{ color: 'red' }}>
							Total percentage should not be greater than 100%
						</div>
					)}
					{!this.state?.previewType?.includes('m') && !this.props?.client && (
						<div
							onClick={(e) => {
								e.stopPropagation();
								this.addPayment();
							}}
							style={{ cursor: 'pointer', color: '#5C7FFF' }}
						>
							+ Add a payment
						</div>
					)}
				</div>
				{/* )} */}
			</div>
		);
	}
}

export default PaymentSchedule;
