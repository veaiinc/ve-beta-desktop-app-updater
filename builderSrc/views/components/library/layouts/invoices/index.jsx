import React, { Component } from 'react';
import ImageItem from '../../elements/image';
import Text from '../../elements/text/index';
import { Dropdown, UpDown, DeleteSVG, BlockSidebar } from '../../../builder_client_common';

import moment from 'moment';
import _ from 'lodash';
const paymentData = [
	{
		amountPercentage: 40,
		dueDate: '2024-01-01',
		paymentDate: '2024-01-01',
		paymentId: '1234567890',
		status: 'paid',
	},
	{
		amountPercentage: 60,
		dueDate: '2024-07-01',
		paymentDate: null,
		paymentId: null,
		status: 'pending',
	},
];

class Invoice extends Component {
	constructor(props) {
		super();
		this.state = {
			preview: props.preview,
			previewType: props.previewType,
			invoiceDetails: props.invoiceDetails,
			tables: props.tables,
			client: props?.client,
			activePayment: 'percentage',
			showSchedule: props.showSchedule,
			showDateInput: true,
			showDateOptions: false,
			activeId: 0,
			dateInputIndex: null,
			paymentSchedule: props.paymentSchedule || paymentData,
			percentageError: false,
			showDelete: false,
			showAnimation: false,
			invoiceClientVariables: props.invoiceClientVariables,
			invoiceNumber: props.invoiceNumber,
			isValidNo: true,
			isEditing: false,
			inValidErrorMsg: 'Please enter min 3 and max 7 letters',
			invoiceTables: props.invoiceTables,

			scheduleContainerRef: React.createRef(),

			blocks: props?.blocks || [],
			style: props?.style || {},
			section: props?.section || {},
			showServiceTables: false,
			totalCost: 0,
			sections: props.sections,
			debounceInterval: null,

			debounceTimeoutForInputs: null,
			showUnitTypes: null,
			isManual: false,
			currentBlockId: '',
			showAddUnit: false,
			newUnitValue: '',

			// for popup
			elementEndPosition: { x: 450, y: '45%' },
			activeType: 'invoice',
			showCardPopup: props?.showCardPopup ?? false,
			grandTotal: 0,
			discountedValue: 0,
			discountValue: 0,
			customUnits: [],
		};
		this.updatePaymentStatuses = this.updatePaymentStatuses.bind(this);
		this.UnitTypesRef = React.createRef();
		this.showAddUnitRef = React.createRef();
		this.blockSidebarRef = React.createRef();
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (this.state.invoiceTables !== nextProps.invoiceTables) {
			this.setState(
				{
					invoiceTables: nextProps.invoiceTables,
				},
				() => {
					this.returnStateForTables();
				},
			);
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
		if (this.state.invoiceDetails !== nextProps.invoiceDetails) {
			this.setState({
				invoiceDetails: nextProps.invoiceDetails,
			});
		}
		if (this.state.tables !== nextProps.tables) {
			this.setState(
				{
					tables: nextProps.tables,
				},
				() => {
					this.returnStateForTables();
				},
			);
		}
		if (this.state.showSchedule !== nextProps.showSchedule) {
			this.setState({
				showSchedule: nextProps.showSchedule,
			});
		}
		if (this.state.blocks !== nextProps.blocks) {
			this.setState({
				blocks: nextProps.blocks,
			});
		}
		if (this.state.style !== nextProps.style) {
			this.setState({
				style: nextProps.style,
			});
		}
		if (this.state.section !== nextProps.section) {
			this.setState(
				{
					section: nextProps.section,
				},
				() => {
					this.updateTaxesValues();
				},
			);
		}
		if (this.state?.invoiceTables !== nextProps?.invoiceTables) {
			this.setState({
				invoiceTables: nextProps.invoiceTables,
			});
		}
		if (this.state.sections !== nextProps.sections) {
			this.setState(
				{
					sections: nextProps.sections,
				},
				() => {
					this.returnStateForTables();
				},
			);
		}
		if (this.state.showCardPopup !== nextProps.showCardPopup) {
			this.setState({
				showCardPopup: nextProps.showCardPopup ?? false,
			});
		}
	};

	// componentDidUpdate(prevProps, prevState) {
	// 	if (prevState.showSchedule !== this.state.showSchedule) {
	// 	  this.animateScheduleContainer();
	// 	}
	//   }

	// animateScheduleContainer = () => {
	// 	if (this.state.scheduleContainerRef.current) {
	// 	  const tl = gsap.timeline();
	// 	  if (this.state.showSchedule) {
	// 		// Show animation
	// 		tl.fromTo(
	// 		  '.schedule-container-anim-active',
	// 		  { opacity: 0, height: 0 },
	// 		  { opacity: 1, height: 'auto', duration: 0.6, ease: 'power2.out', delay: 0.2 }
	// 		);
	// 	  } else {
	// 		// Hide animation
	// 		tl.to('.schedule-container-anim-active', {
	// 		  opacity: 0,
	// 		  height: 0,
	// 		  duration: 0.5,
	// 		  ease: 'power2.inOut',
	// 		});
	// 		// Delay hiding the container until after the animation is complete
	// 		tl.call(() => {
	// 		  this.setState({ showSchedule: false });
	// 		}, [], '+=0.6');
	// 	  }
	// 	}
	//   };

	//   toggleScheduleContainer = () => {
	// 	this.setState({
	// 	  showSchedule: !this.state.showSchedule,
	// 	});
	//   };
	componentDidMount() {
		if (!this.state?.style) {
			this.updatePaymentStatuses();
		}

		this.returnStateForTables();
		setTimeout(() => {
			this.calculateDiscountValue();
		}, 500);
		// this.updateTaxesValues();
		document.addEventListener('mousedown', this.handleClickOutside);
		const localCustomUnits = localStorage.getItem('invoiceCustomUnits');
		if (localCustomUnits) {
			this.setState({ customUnits: JSON.parse(localCustomUnits) });
		}
	}
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}
	returnStateForTables = () => {
		const sections = [...(this.state?.sections || [])];
		const serviceMapper = {};
		const showQuantityMapper = {};
		for (let k = 0; k < sections.length; k++) {
			if (sections[k]?.type === 'services') {
				serviceMapper[sections[k]._id] = sections[k];

				const { blocks } = sections[k];
				for (let i = 0; i < blocks.length; i++) {
					const { labels, _id } = blocks?.[i];
					for (let j = 0; j < labels.length; j++) {
						const key = Object.keys(labels?.[j]);

						if (key?.[0] === 'quantity') {
							showQuantityMapper[_id] = labels?.[j][key?.[0]];
						}
					}
				}
			}
		}
		let tables;
		if (this.props.isWorkflow && this.props.module != '*') {
			tables = _.uniqBy(_.filter(this.state.invoiceTables, { type: 'services' }), '_id');
		} else {
			tables = this.props.tables;
		}
		_.forEach(tables, (table, index) => {
			if (table?.type == 'services') {
				if (serviceMapper[table._id]?.style?.services_selection == 2) {
					table.values?.map((value) => {
						value.isSelected = true;
					});
				}
			}
		});

		tables?.map((table, index) => {
			if (table?.type === 'services') {
				if (table?.styles?.services_selection == 2) {
					this.setState(
						{
							showServiceTables: true,
						},
						() => {},
					);
				} else {
					table?.values?.find((value, index) => {
						if (value?.isSelected && value?.show) {
							this.setState(
								{
									showServiceTables: true,
								},
								() => {},
							);
						}
					});
				}
			}
		});
		return;
		let serviceTables = _.filter(tables, { type: 'services' });
		let subTotalValues = {};
		_.map(serviceTables, (table, key) => {
			let tableValue = 0;

			_.map(table.values, (value, k) => {
				if (value?.isSelected) {
					tableValue = parseInt(tableValue) + parseInt(value.amount);
				}
			});

			subTotalValues = { ...subTotalValues, [table._id]: tableValue };
		});
		this.setState({ subTotalValues });
	};
	renderCurrencyValue = (value) => {
		const newcost = (value || 0)?.toLocaleString('en-IN', {
			currency: 'INR',
			minimumFractionDigits: 2,
		});
		return newcost;
	};
	cleanHtmlString = (htmlString) => {
		if (!htmlString || typeof htmlString !== 'string') {
			return '';
		}

		if (htmlString.includes('class="variable"')) {
			return this.getVariableValue(htmlString);
		}

		const newString = htmlString
			?.replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
			?.replace(/<br\s*\/?>/gi, '\n') // Convert <br> to newlines
			?.replace(/<[^>]+>/g, '') // Remove all HTML tags
			?.replace(/&[^;]+;/g, '') // Remove HTML entities
			?.replace(/\s+/g, ' ') // Replace multiple spaces with single space
			?.trim(); // Remove leading/trailing spaces
		return newString;
	};
	getVariableValue(text) {
		if (!text || !this.props.variables) return '';

		const parts = text.split(/<input[^>]*>/);
		const beforeText = parts[0]
			.replace(/<[^>]*>/g, '')
			.replace(/&nbsp;/g, ' ')
			.trim();

		const match = text.match(/data-id="([^"]+)"/);
		const variableId = match ? match[1] : null;

		if (!variableId) return text;

		const variable = this.props.variables.find((v) => v._id === variableId);
		const variableValue = variable?.defaultValue || '';

		return `${beforeText} ${variableValue}`.trim();
	}
	// client side table for services
	returnServiceTables = () => {
		// return;
		const sections = [...(this.props?.sections || [])];
		const serviceMapper = {};
		const showQuantityMapper = {};
		for (let k = 0; k < sections?.length; k++) {
			if (sections[k]?.type === 'services') {
				serviceMapper[sections[k]._id] = sections[k];

				const { blocks } = sections[k];
				for (let i = 0; i < blocks?.length; i++) {
					const { labels, _id } = blocks?.[i];
					for (let j = 0; j < labels?.length; j++) {
						const key = Object.keys(labels?.[j]);

						if (key?.[0] === 'quantity') {
							showQuantityMapper[_id] = labels?.[j][key?.[0]];
						}
					}
				}
			}
		}

		let tables;
		if (this.props.isWorkflow && this.props.module != '*') {
			tables = _.uniqBy(_.filter(this.state.invoiceTables, { type: 'services' }), '_id');
		} else {
			tables = this.state.tables;
		}
		_.forEach(tables, (table) => {
			if (table?.type == 'services') {
				if (serviceMapper[table._id]?.style?.services_selection == 2) {
					table.values?.map((value) => {
						// value.isSelected = true;
					});
					// table.styles = serviceMapper[table._id]?.style;
				}
			}
			// console.log(table?.styles, 'table in foreach section', serviceMapper);
		});

		let totalCost = 0;
		// ! when view inly services coming counting 2 times need different logic for it...
		tables?.forEach((table) => {
			if (table?.styles?.services_selection == 2) {
				// totalCost += parseInt(this.cleanHtmlString(table?.styles?.subTotalValue));
				const subTotal = table?.styles?.subTotalValue || 0;
				totalCost += parseInt(
					typeof subTotal == 'number' ? subTotal : this.cleanHtmlString(subTotal),
				);
			} else {
				totalCost += table?.values?.reduce((sum, value) => {
					if (value?.isSelected && value?.show) {
						return sum + (value?.amount * value?.quantity || 0);
					}
					return sum;
				}, 0);
			}
		});

		// tables?.forEach((table) => {
		// 	if (table?.styles?.services_selection == 2) {
		// 		// totalCost += parseInt(this.cleanHtmlString(table?.styles?.subTotalValue));
		// 		const subTotal = table?.styles?.subTotalValue || 0;
		// 		totalCost += parseInt(
		// 			typeof subTotal == 'number' ? subTotal : this.cleanHtmlString(subTotal),
		// 		);
		// 	}
		// });

		if (totalCost !== this.state.totalCost) {
			this.setState({ totalCost });
		}

		let serviceTables = _.filter(tables, { type: 'services' });
		if (_.size(serviceTables) > 0) {
			return _.map(serviceTables, (table, k) => {
				let subTotalValue = 0;
				let noSelected = true;
				for (let m = 0; m < (table?.values || [])?.length; m++) {
					if (table?.values?.[m]?.isSelected === true && table?.values?.[m]?.show) {
						let amount = parseFloat(table?.values?.[m]?.amount) || 0;
						let quantity = parseFloat(table?.values?.[m]?.quantity) || 0;
						let price = quantity * amount;
						subTotalValue += price;
						noSelected = false;
					}
				}
				if (noSelected) {
					return null;
				}
				const incomingSubTotalValue =
					+(serviceMapper[table._id]?.style?.subTotalValue + '')
						?.replace(/&nbsp;/g, ' ')
						?.replace(/<\/?[^>]+(>|$)/g, '')
						?.replace(/"/g, '') || 0;

				const incomingServiceSelection =
					parseInt(serviceMapper[table._id]?.style?.services_selection, 10) || 0;
				subTotalValue =
					incomingServiceSelection === 2 && subTotalValue === 0
						? incomingSubTotalValue
						: subTotalValue;

				// totalCost += table?.values?.reduce((sum, value) => {
				// 	if (value?.isSelected && value?.show) {
				// 	  return sum + (value?.amount * value?.quantity || 0);
				// 	}
				// 	return sum;
				//   }, 0);

				return (
					<>
						<div
							className="invoice-wrapper"
							style={{
								gap: '24px',
								boxShadow: `0px 4px 8px 0px rgba(0, 0, 0, 0.08)`,
								marginBottom: '12px',
								width: this.state?.previewType === 'm' ? '100%' : 'auto',
								borderRadius: '5px',
							}}
						>
							<div className="invoice-table-header">
								<div
									className="invoice-table-title"
									style={{
										width: this.state?.previewType === 'm' ? '30%' : 'auto',
										color: this.state?.style?.valueColor,
									}}
								>
									{/* {this.cleanHtmlString(table?.styles?.subTotalTitle) ||
									table?.style?.services_selection == 2
										? 'Package cost'
										: 'Services'} */}
									{this.cleanHtmlString(table?.styles?.subTotalTitle)
										? this.cleanHtmlString(table?.styles?.subTotalTitle)
										: table?.styles?.services_selection == 2
										? 'Package cost'
										: 'Services'}
								</div>
								<div
									className="invoice-table-cost"
									style={{ color: this.state?.style?.valueColor }}
								>
									{this.props?.currencySymbol}
									{
										// table?.styles?.services_selection == 2
										// 	? table?.styles?.style?.subTotalValue
										// 			?.replace(/&nbsp;/g, ' ')
										// 			?.replace(/<\/?[^>]+(>|$)/g, '')
										// 			?.replace(/"/g, '')
										// 	:

										// subTotalValue == 0
										// 	? this.renderCurrencyValue(
										// 			parseInt(table?.styles?.subTotalValue),
										// 	  )
										// 	: this.renderCurrencyValue(subTotalValue)

										// ! sandeep sir logic

										// this.renderCurrencyValue(
										// 	parseInt(this.state.subTotalValues[table._id]),
										// )

										subTotalValue == 0
											? this.renderCurrencyValue(
													parseInt(
														this.cleanHtmlString(
															table?.styles?.subTotalValue,
														),
													),
											  )
											: this.renderCurrencyValue(subTotalValue)
									}
								</div>
							</div>
							{/* <span className="thin-hr-line
							">
								</span> */}

							{table?.values?.map((value, key) => {
								if (value?.isSelected && value?.show) {
									// 	const unit = value?.quantity == '1' ? value.unit && value?.unit !== 0 ? value?.unit?.slice(
									// 		0,
									// 		-1,
									//   ) : '' : value?.unit;
									const unit =
										value?.unit == 'none' || value?.unit == 0 || !value?.unit
											? ''
											: value?.unit?.slice(0, -1);
									const isTotalFixed = table?.styles?.services_selection == 2;
									return (
										<div className="invoice-wrapper" key={key}>
											<div
												className="iw-a"
												style={{
													boxShadow: 'none',
													padding: '10px 0px',
													backgroundColor:
														this.state?.style &&
														this.state?.style?.invoiceLayout
															? this.state?.style?.Card2Color
															: '',
												}}
											>
												<div
													className="serv-card"
													style={{
														flexDirection:
															this.state?.previewType === 'm'
																? 'column'
																: 'row',
													}}
												>
													<div className="serv-details">
														{_.has(this.state?.style, 'labels') &&
														!this.state?.style?.labels?.showImage
															? ''
															: value?.imageURL && (
																	<div
																		className="serv-image"
																		style={{
																			width:
																				this.state
																					.previewType ===
																				'm'
																					? '48px'
																					: '72px',
																			height:
																				this.state
																					.previewType ===
																				'm'
																					? '48px'
																					: '72px',
																		}}
																	>
																		{
																			// (this.state?.client ||
																			// 	this.props?.isWorkflow) &&
																			value?.imageURL ? (
																				<img
																					src={
																						value?.imageURL
																					}
																					alt="service image"
																				/>
																			) : null
																		}
																	</div>
															  )}
														<div
															className="serv-content"
															style={{
																width:
																	// this.state?.previewType === 'm'
																	// 	? '250px'
																	// 	:
																	'300px',
															}}
														>
															<span
																className="serv-content-title"
																style={{
																	color: this.state?.style
																		?.valueColor,
																}}
															>
																{value?.title
																	? this.cleanHtmlString(
																			value?.title,
																	  )
																	: 'title'}
															</span>
															{_.has(this.state?.style, 'labels') &&
															!this.state?.style?.labels
																?.showDescription ? (
																''
															) : (
																<span
																	className="serv-content-desc"
																	style={{
																		color: this.state?.style
																			?.titleColor,
																	}}
																>
																	{value?.description
																		? this.cleanHtmlString(
																				value?.description,
																		  )
																		: 'description'}
																</span>
															)}
														</div>
													</div>
													{this.state?.previewType === 'm' ? (
														<>
															<div
																className="serv-amt"
																style={{
																	alignSelf: 'end',
																	justifyContent: 'flex-end',
																	width: '100%',
																}}
															>
																{value?.quantity && (
																	<span
																		style={{
																			width: 'auto',
																			textAlign: 'center',
																			color:
																				this.state?.style
																					?.valueColor ||
																				'#000',
																			fontSize: '12px',
																			fontWeight: '400',
																		}}
																	>
																		{this.state?.style?.labels
																			?.showQuantity &&
																			`${value?.quantity}`}
																		{this.state?.style?.labels
																			?.showUnit &&
																			`${
																				value?.quantity >
																					1 && unit
																					? `${unit}s`
																					: unit
																			}`}
																	</span>
																)}
																{value?.unitPrice
																	? value?.unitPrice != '0' && (
																			<span
																				style={{
																					width: 'auto',
																					color:
																						this.state
																							?.style
																							?.valueColor ||
																						'#000',
																					fontSize:
																						'12px',
																					fontWeight:
																						'400',
																				}}
																			>
																				{(value?.currency ===
																				'INR'
																					? '₹'
																					: '$') +
																					value?.unitPrice}
																				{/* {value?.currency === 'INR' ? '₹' : '$'}
													{value?.unitPrice} */}
																			</span>
																	  )
																	: ''}
																{value?.amount != '0' &&
																	this.state?.style?.labels
																		?.showUnitPrice && (
																		<span
																			style={{
																				width: 'auto',
																				color:
																					this.state
																						?.style
																						?.valueColor ||
																					'#000',
																				fontSize: '12px',
																				fontWeight: '400',
																			}}
																		>
																			{value?.amount == '0'
																				? ''
																				: (this.props
																						?.currencySymbol ||
																						'') +
																				  value?.amount}
																		</span>
																	)}
																{/* {value?.quantity * value?.amount !=
																	'0' && (
																	<span
																		style={{
																			width: 'auto',
																			textAlign: 'center',
																			color:
																				this.state?.style
																					?.valueColor ||
																				'#000',
																			fontSize: '12px',
																			fontWeight: '400',
																		}}
																	>
																		{value?.quantity *
																			value?.amount ==
																		0
																			? ''
																			: `${
																					this.props
																						?.currencySymbol
																						? this.props
																								?.currencySymbol
																						: this.props
																								?.currencySymbol2
																			  }${
																					value?.quantity *
																					value?.amount
																			  }`}
																	</span>
																)} */}
															</div>
															<div
																className="serv-amt"
																style={{
																	alignSelf: 'end',
																	justifyContent: 'flex-end',
																	width: '100%',
																}}
															>
																{value?.quantity * value?.amount !=
																	'0' && (
																	<span
																		style={{
																			width: 'auto',
																			textAlign: 'center',
																			color:
																				this.state?.style
																					?.valueColor ||
																				'#000',
																			fontSize: '20px',
																			fontWeight: '500',
																		}}
																	>
																		{value?.quantity *
																			value?.amount ==
																		0
																			? ''
																			: `${
																					this.props
																						?.currencySymbol
																			  }${
																					value?.quantity *
																					value?.amount
																			  }`}
																	</span>
																)}
															</div>
														</>
													) : (
														<div
															className="serv-amt"
															style={{
																width:
																	this.state?.section?.style
																		?.taxes?.length > 0
																		? 'auto'
																		: '400px',
																justifyContent: 'flex-end',
																marginRight:
																	window.innerWidth < 1100
																		? '0px'
																		: '34px',
																gap:
																	this.state?.section?.style
																		?.taxes?.length > 0 &&
																	'18px',
															}}
														>
															{this.state?.style?.labels
																?.showQuantity && (
																<span
																	style={{
																		// width: '30px',
																		width: `${
																			value?.quantity
																				?.length * 10 || 40
																		}px`,
																		minWidth: '30px',
																		textAlign: 'center',
																		color: this.state?.style
																			?.valueColor,
																	}}
																>
																	{value?.quantity}
																</span>
															)}
															{this.state?.style?.labels
																?.showUnit && (
																<span
																	style={{
																		width: this.props?.client
																			? '65px'
																			: '80px',
																		color: this.state?.style
																			?.valueColor,
																	}}
																>
																	{value?.unit ? value?.unit : ''}
																</span>
															)}
															{this.state?.style?.labels
																?.showUnitPrice && (
																<span
																	style={{
																		width:
																			value?.amount?.length >
																			5
																				? parseFloat(
																						value
																							?.amount
																							?.length *
																							10 +
																							15,
																				  )
																				: value?.amount >
																				  999
																				? '70px'
																				: '60px',
																		color: this.state?.style
																			?.valueColor,
																	}}
																>
																	{value?.amount == '0'
																		? ''
																		: (this.props
																				?.currencySymbol ||
																				'') + value?.amount}
																</span>
															)}
															{this.state?.section?.style?.taxes
																?.length > 0 && (
																<>
																	{Array(
																		this.state?.section?.style
																			?.taxes?.length,
																	)
																		.fill()
																		.map((_, index) => (
																			<input
																				type="checkbox"
																				key={index}
																				checked={
																					isTotalFixed ||
																					value?.[
																						`tax${
																							index +
																							1
																						}`
																					]
																				}
																				onChange={(e) => {
																					this.props
																						?.client ||
																					isTotalFixed
																						? ''
																						: this.handleTaxChecked(
																								`tax${
																									index +
																									1
																								}`,
																								e
																									.target
																									.checked,
																								value?.blockId,
																						  );
																				}}
																				style={{
																					minWidth:
																						'40px',
																					cursor: this
																						.props
																						?.client
																						? 'not-allowed'
																						: 'pointer',
																				}}
																			/>
																		))}
																</>
															)}

															<span
																style={{
																	width:
																		value?.quantity *
																			value?.amount >
																		999
																			? '75px'
																			: '60px',
																	textAlign: 'center',
																	color: this.state?.style
																		?.valueColor,
																}}
															>
																{value?.quantity * value?.amount ==
																0
																	? ''
																	: `${
																			this.props
																				?.currencySymbol
																	  }${
																			value?.quantity *
																			value?.amount
																	  }`}
															</span>
														</div>
													)}
												</div>
											</div>
										</div>
									);
								}
							})}
						</div>
					</>
				);
			});
		} else {
			return null;
		}
	};

	// CRUD of payment functions
	handlePayment = (payment) => {
		this.setState({
			activePayment: payment,
		});
	};

	addPayment = () => {
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
			}),
			this.SavePaymentSchedule,
		);
	};

	deletePayment = (index) => {
		this.setState(
			(prevState) => ({
				paymentSchedule: prevState.paymentSchedule.filter((_, i) => i !== index),
			}),
			() => {
				this.calculateAndUpdateEqualValue();
			},
		);
	};

	// percentage functions
	checkTotalPercentage = () => {
		const totalPercentage = this.state.paymentSchedule.reduce((sum, payment) => {
			return sum + parseFloat(payment.amountPercentage || 0);
		}, 0);

		this.setState({
			percentageError: totalPercentage > 100,
		});
	};
	getPercentage = () => {
		const totalPayments = this.state.paymentSchedule?.length;
		return totalPayments > 0 ? (100 / totalPayments).toFixed(2) : 0;
	};

	// !previous logic
	// handlePercentageChange = (e, index) => {
	// 	const { value } = e.target;
	// 	if (/^\d*$/.test(value)) {
	// 		this.setState(
	// 			(prevState) => {
	// 				const updatedPayments = [...prevState.paymentSchedule];
	// 			updatedPayments[index].amountPercentage = value;
	// 			return { paymentSchedule: updatedPayments };
	// 		},
	// 		() => {
	// 			this.checkTotalPercentage();
	// 			setTimeout(() => {
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
					const updatedPayments = [...prevState.paymentSchedule];
					updatedPayments[index].amountPercentage = value;
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
	// due date functions and elements
	renderDateInput(data, index) {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		if (this.state.showDateInput && this.state.dateInputIndex === index) {
			return (
				<input
					type="date"
					onChange={(e) => this.handleCustomDateInput(e, index)}
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
			console.error('Invalid date:', data.dueDate);
			return <p>Invalid date</p>; // Or any fallback UI
		}
		return (
			<>
				<p>
					{data.type === 'custom Date'
						? dueDate.toLocaleDateString('en-US', options)
						: data.dueDate}
				</p>
				{!this.props?.client && this.state?.previewType !== 'm' && (
					<UpDown
						onClick={() => {
							if (data.status !== 'paid') {
								if (this.state.activeId !== index) {
									this.setState({
										showDateOptions: true,
										activeId: index,
									});
								} else {
									this.setState({
										showDateOptions: !this.state.showDateOptions,
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
			this.setState((prevState) => {
				const updatedPaymentData = [...prevState.paymentSchedule];
				updatedPaymentData[index] = {
					...updatedPaymentData[index],
					dueDate: e,
					type: 'smart file sent',
					status: updatedPaymentData[index].status === 'paid' ? 'paid' : 'upcoming',
				};
				return {
					paymentSchedule: updatedPaymentData,
					showDateOptions: false,
					showDateInput: false,
					dateInputIndex: null,
				};
			}, this.SavePaymentSchedule);
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

	handleCustomDateInput = (e, index) => {
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
				const updatedPaymentData = [...prevState.paymentSchedule];
				updatedPaymentData[index] = {
					...updatedPaymentData[index],
					dueDate: inputDate,
					type: 'custom Date',
					status: updatedPaymentData[index].status === 'paid' ? 'paid' : newStatus,
				};
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
	calculateAndUpdateEqualValue = () => {
		const totalPayments = this.state.paymentSchedule?.length;
		const newEqualValue = totalPayments > 0 ? (100 / totalPayments).toFixed(2) : 0;

		this.setState(
			(prevState) => ({
				paymentSchedule: prevState.paymentSchedule.map((data) => ({
					...data,
					equalValue: newEqualValue,
				})),
			}),
			() => {
				this.props?.setPaymentSchedule(this.state.paymentSchedule);
			},
		);
	};
	updatePaymentStatuses() {
		const today = moment().startOf('day');

		this.setState(
			(prevState) => ({
				paymentSchedule: prevState.paymentSchedule.map((payment) => {
					// Skip updating status if payment is already paid
					if (payment.status === 'paid') return payment;

					const dueDate = moment(payment.dueDate).startOf('day');

					let newStatus;
					if (dueDate.isSame(today)) {
						newStatus = 'due today';
					} else if (dueDate.isBefore(today)) {
						newStatus = 'overdue';
					} else {
						newStatus = 'upcoming';
					}

					return {
						...payment,
						status: newStatus,
					};
				}),
			}),
			() => {
				// After updating statuses, save to parent component if needed
				if (this.props?.setPaymentSchedule) {
					this.props?.setPaymentSchedule(this.state.paymentSchedule);
				}
			},
		);
	}

	SavePaymentSchedule = () => {
		const totalPayments = this.state.paymentSchedule?.length;
		const newEqualValue = totalPayments > 0 ? (100 / totalPayments).toFixed(2) : 0;

		const updatedPaymentSchedule = this.state.paymentSchedule.map((data, index) => ({
			...data,
			equalValue: newEqualValue,
		}));

		this.setState({ paymentSchedule: updatedPaymentSchedule }, () => {
			setTimeout(() => {
				this.props?.setPaymentSchedule(this.state.paymentSchedule);
			}, 500);
		});
	};

	setInvoiceNumber = (e) => {
		const originalValue = e;
		const lettersOnly = e.replace(/[^A-Za-z]/g, '').toUpperCase();

		// this.setState({
		// 	invoiceNumber: {
		// 		...this.state.invoiceNumber,
		// 		prefix: lettersOnly
		// 	},
		// 	isValidNo: false,
		// });

		const hasNonLetters = /[^A-Za-z]/.test(originalValue);

		this.setState(
			{
				invoiceNumber: {
					...this.state.invoiceNumber,
					prefix: lettersOnly,
				},
				isValidNo: false,
				inValidErrorMsg: hasNonLetters
					? 'Only letters are allowed'
					: lettersOnly?.length > 0 &&
					  (lettersOnly?.length < 3 || lettersOnly?.length > 7)
					? 'Please enter min 3 and max 7 letters'
					: '',
			},
			() => {
				// hitting the api
				// if(this.state?.invoiceNumber?.prefix?.length >= 3 && this.state?.invoiceNumber?.prefix?.length <= 7){

				if (lettersOnly?.length >= 3 && lettersOnly?.length <= 7) {
					// !previouxsw logic
					// setTimeout(() => {
					// 	this.props.setInvoiceNumber([this.state.invoiceNumber]);
					// }, 500);
					this.handleDebounceFuntion(async () => {
						this.props.setInvoiceNumber([this.state.invoiceNumber]);
					}, 800);
				}
			},
		);
	};
	handleInvClick = (e) => {
		this.props.handleSideBar(e, null), this.props.setTab('b');
	};

	handleServiceValueChange = (type, value, blockId) => {
		const numberRegex = /^[0-9]*$/;
		let activeSection = { ...this.state.section };
		let newBlocks = [...activeSection?.blocks];
		const debounceTypes = ['title', 'description', 'quantity', 'amount'];
		if (type === 'title' || type === 'description' || type == 'unit') {
			if (type === 'unit' && value === this.state?.newUnitValue) {
				const newUnits = [...this.state?.customUnits, value];
				this.setState({ customUnits: newUnits });
				localStorage.setItem('invoiceCustomUnits', JSON.stringify(newUnits));
			}
			newBlocks = activeSection?.blocks?.map((block) => {
				if (block?._id === blockId) {
					return {
						...block,
						subBlocks: [
							{
								...block?.subBlocks[0],
								[type]: value,
							},
						],
					};
				}
				return block;
			});
			activeSection = {
				...activeSection,
				blocks: newBlocks,
			};
		} else {
			if (numberRegex.test(value)) {
				newBlocks = activeSection?.blocks?.map((block) => {
					if (block?._id === blockId) {
						return {
							...block,
							subBlocks: [
								{
									...block?.subBlocks[0],
									[type]: value,
								},
							],
						};
					}
					return block;
				});
				activeSection = {
					...activeSection,
					blocks: newBlocks,
				};
			}
		}

		this.setState({ section: activeSection, blocks: newBlocks }, () => {
			this.debounceFuncForInputs(
				() => {
					this.props.setActiveSection(activeSection);
				},
				debounceTypes?.includes(type) ? 2000 : 200,
			);
		});
	};
	debounceFuncForInputs = (func, timeOut = 800) => {
		if (this.state?.debounceTimeoutForInputs) {
			clearTimeout(this.state?.debounceTimeoutForInputs);
		}
		const timeout = setTimeout(() => {
			func();
		}, timeOut);
		this.setState({ debounceTimeoutForInputs: timeout });
	};
	setInvoiceTitle = (e) => {
		let newSection = {
			...this.state?.section,
			style: {
				...this.state?.section?.style,
				invoiceTitle: {
					...this.state?.style?.invoiceTitle,
					content: e,
				},
			},
		};
		this.setState({ section: newSection }, () => {
			this.props.setActiveSection(newSection);
		});
	};

	returnManualServices = () => {
		if (!this.state?.isManual) {
			this.setState({
				isManual: true,
			});
		}
		const unitTypes = [
			'items',
			'hours',
			'days',
			'weeks',
			'months',
			'none',
			...(this.state?.customUnits || []),
		];
		let totalCost = 0;
		// ! when view inly services coming counting 2 times need different logic for it...
		totalCost += this.state?.blocks?.reduce((sum, block) => {
			const value = block?.subBlocks[0];
			if (value?.amount * value?.quantity) {
				return sum + (value?.amount * value?.quantity || 0);
			}
			return sum;
		}, 0);
		if (totalCost !== this.state.totalCost) {
			this.setState({ totalCost });
		}
		return (
			<>
				<div
					className="invoice-wrapper manual-invoice-blocks-container"
					style={{
						gap: '24px',
						boxShadow: `0px 4px 8px 0px rgba(0, 0, 0, 0.08)`,
						marginBottom: '12px',
						width: this.state?.previewType === 'm' ? '100%' : 'auto',
						borderRadius: '5px',
					}}
				>
					{/* <div className="invoice-table-header">
			<div
				className="invoice-table-title"
				style={{
					width: this.state?.previewType === 'm' ? '30%' : 'auto',
					color: this.state?.style?.valueColor,
				}}
			></div>
			<div
				className="invoice-table-cost"
				style={{ color: this.state?.style?.valueColor }}
			></div>
		</div> */}
					{this.state?.blocks?.map((block, key) => {
						const value = block?.subBlocks[0];
						const unit =
							value?.unit == 'none' || value?.unit == 0 || !value?.unit
								? ''
								: value?.unit?.slice(0, -1);
						return (
							<div className="invoice-wrapper">
								<div
									className="iw-a"
									style={{
										boxShadow: 'none',
										padding: '10px 0px',
										backgroundColor:
											this.state?.style && this.state?.style?.invoiceLayout
												? this.state?.style?.Card2Color
												: '',
									}}
								>
									<div
										className="serv-card"
										style={{
											flexDirection:
												this.state?.previewType === 'm' ? 'column' : 'row',
											position: 'relative',
										}}
									>
										{!this.props?.client && (
											<div
												className="delete-serv-item-div"
												// title="Delete"
												onClick={(e) => {
													e?.stopPropagation();
													this.deleteServiceItem(block?._id);
												}}
											>
												<DeleteSVG />
											</div>
										)}
										<div
											className="serv-details"
											style={{
												minWidth:
													this.props?.client &&
													!value?.imageURL &&
													'396px',
											}}
										>
											{/* {value?.imageURL && ( */}
											{(this.state?.style?.labels?.showImage ?? true) && (
												<>
													{!this.props?.client ? (
														<div
															className="serv-image"
															style={{
																width:
																	this.state.previewType === 'm'
																		? '48px'
																		: '72px',
																height:
																	this.state.previewType === 'm'
																		? '48px'
																		: '72px',
															}}
														>
															<ImageItem
																style={{
																	width: '100%',
																	height:
																		this.state.previewType ===
																		'm'
																			? '48px'
																			: '72px',
																}}
																crop={value?.image_settings?.crop}
																zoom={value?.image_settings?.zoom}
																preview={this.state.preview}
																previewType={this.state.previewType}
																imageUrl={value?.imageURL || null}
																imageSettings={
																	value?.image_settings || {}
																}
																setActiveImage={(e) =>
																	this.props.activeImage(
																		this.props?.sectionID,
																		block._id,
																		value?._id,
																		value?.imageURL,
																		e,
																	)
																}
																settingData={(e) =>
																	this.props.imgSettingData(
																		value?.image_settings,
																	)
																}
																activeSubBlockId={
																	this.props?.activeSubBlockId
																}
																refID={
																	value?._id ? value?._id : null
																}
															/>
														</div>
													) : (
														value?.imageURL && (
															<div
																className="serv-image"
																style={{
																	width:
																		this.state.previewType ===
																		'm'
																			? '48px'
																			: '72px',
																	height:
																		this.state.previewType ===
																		'm'
																			? '48px'
																			: '72px',
																}}
															>
																<img
																	src={value?.imageURL}
																	alt="service image"
																/>
															</div>
														)
													)}
												</>
											)}
											<div
												className="serv-content"
												style={{
													width:
														// this.state?.previewType === 'm'
														// 	? '250px'
														// 	:
														'300px',
												}}
											>
												<span
													className="serv-content-title"
													style={{
														color: this.state?.style?.valueColor,
													}}
												>
													<textarea
														ref={(ref) => {
															if (ref) {
																// Always resize on mount and updates
																ref.style.height = 'auto';
																ref.style.height =
																	Math.max(ref.scrollHeight, 30) +
																	'px';
															}
														}}
														style={{
															width: '100%',
															color: this.state?.style?.valueColor,
															resize: 'none', // Disables manual resizing
															minHeight: '30px',
															overflow: 'hidden', // Prevent scrollbars
														}}
														value={value?.title}
														placeholder="enter Title here"
														onChange={(e) => {
															this.handleServiceValueChange(
																'title',
																e.target.value,
																block?._id,
															);
															// Auto-resize while typing
															const target = e.target;
															target.style.height = 'auto';
															target.style.height =
																Math.max(target.scrollHeight, 30) +
																'px';
														}}
														onInput={(e) => {
															// Additional resize on input to ensure content fits
															const target = e.target;
															target.style.height = 'auto';
															target.style.height =
																Math.max(target.scrollHeight, 30) +
																'px';
														}}
														disabled={this.props?.client}
													/>
												</span>
												{(this.state?.style?.labels?.showDescription ??
													true) && (
													<span
														className="serv-content-desc"
														style={{
															color: this.state?.style?.titleColor,
														}}
													>
														<textarea
															ref={(ref) => {
																if (ref) {
																	// Always resize on mount and updates
																	ref.style.height = 'auto';
																	ref.style.height =
																		Math.max(
																			ref.scrollHeight,
																			30,
																		) + 'px';
																}
															}}
															style={{
																width: '100%',
																color: this.state?.style
																	?.valueColor,
																resize: 'none',
																minHeight: '30px',
																overflow: 'hidden',
															}}
															value={value?.description}
															placeholder="enter description here"
															onChange={(e) => {
																this.handleServiceValueChange(
																	'description',
																	e.target.value,
																	block?._id,
																);
																// Resize on user input
																const target = e.target;
																target.style.height = 'auto';
																target.style.height =
																	Math.max(
																		target.scrollHeight,
																		30,
																	) + 'px';
															}}
															onInput={(e) => {
																// Additional resize on input to ensure content fits
																const target = e.target;
																target.style.height = 'auto';
																target.style.height =
																	Math.max(
																		target.scrollHeight,
																		30,
																	) + 'px';
															}}
															disabled={this.props?.client}
														/>
													</span>
												)}
											</div>
										</div>
										{this.state?.previewType === 'm' ? (
											<div
												className="serv-amt"
												style={{
													alignSelf: 'end',
													justifyContent: 'flex-end',
													width: '100%',
												}}
											>
												{value?.quantity && (
													<span
														style={{
															width: 'auto',
															textAlign: 'center',
															color: this.state?.style?.valueColor,
														}}
													>
														{`${value?.quantity} ${
															value?.quantity > 1 && unit
																? `${unit}s`
																: unit
														}`}
													</span>
												)}
												{value?.amount
													? value?.amount != '0' && (
															<span
																style={{
																	width: 'auto',
																	color: this.state?.style
																		?.valueColor,
																}}
															>
																{`${
																	this.props?.currencySymbol || ''
																}${value?.amount}`}
															</span>
													  )
													: ''}
												{value?.quantity * value?.amount != '0' && (
													<span
														style={{
															width: 'auto',
															textAlign: 'center',
															color: this.state?.style?.valueColor,
														}}
													>
														{`${this.props?.currencySymbol || ''}${
															value?.amount * value?.quantity
														}`}
													</span>
												)}
											</div>
										) : (
											<div
												className="serv-amt"
												style={{
													width:
														this.state?.section?.style?.taxes?.length >
														0
															? 'auto'
															: '400px',
													justifyContent: 'flex-end',
													marginRight:
														window.innerWidth < 1100 ? '0px' : '34px',
													gap:
														this.state?.section?.style?.taxes?.length >
															0 && '18px',
												}}
											>
												{/* <span
										style={{
											width: '30px',
											textAlign: 'center',
											color: this.state?.style
												?.valueColor,
										}}
									>
										{value?.quantity}
									</span> */}
												{(this.state?.style?.labels?.showQuantity ??
													true) && (
													<input
														type="text"
														style={{
															width: `${
																value?.quantity?.length * 10 || 40
															}px`,
															minWidth: '30px',
															textAlign: 'center',
															color: this.state?.style?.valueColor,
														}}
														value={value?.quantity}
														onChange={(e) =>
															this.handleServiceValueChange(
																'quantity',
																e.target.value,
																block?._id,
															)
														}
														maxLength={7}
														disabled={this.props?.client}
														placeholder="0"
													/>
												)}
												{(this.state?.style?.labels?.showUnit ?? true) && (
													<span
														style={{
															width: this.props?.client
																? '65px'
																: '80px',
															position: 'relative',
															color: this.state?.style?.valueColor,
															display: 'flex',
															gap: '2px',
															alignItems: 'center',
															justifyContent: this.props?.client
																? 'center'
																: 'space-between',
															padding: this.props?.client
																? '10px'
																: '10px 0px',
														}}
													>
														{value?.unit ? value?.unit : 'none'}
														{!this.props?.client && (
															<Dropdown
																style={{
																	rotate:
																		this.state?.showUnitTypes ==
																		block?._id
																			? '180deg'
																			: '0deg',
																	cursor: 'pointer',
																}}
																onClick={(e) => {
																	e?.stopPropagation();
																	this.setState({
																		showUnitTypes:
																			this.state
																				?.showUnitTypes ==
																			block?._id
																				? null
																				: block?._id,
																	});
																}}
															/>
														)}
														{this.state?.showUnitTypes ==
															block?._id && (
															<div
																className="unit-types-div"
																ref={this.UnitTypesRef}
															>
																{unitTypes?.map((value, i) => {
																	return (
																		<span
																			key={i}
																			style={{
																				textTransform:
																					'capitalize',
																				color: 'black',
																			}}
																			onClick={(e) => {
																				e.stopPropagation();
																				this.setState(
																					{
																						showUnitTypes:
																							null,
																					},
																					() => {
																						this.handleServiceValueChange(
																							'unit',
																							value,
																							block?._id,
																						);
																					},
																				);
																			}}
																		>
																			{value}
																		</span>
																	);
																})}
																{/* <input
																	type="text"
																	placeholder="add Custom unit"
																	value={value?.unit}
																/> */}
																<span
																	style={{
																		textTransform: 'capitalize',
																		color: 'blue',
																		fontSize: '12px',
																	}}
																	onClick={(e) => {
																		e.stopPropagation();
																		this.setState({
																			showUnitTypes: null,
																			currentBlockId:
																				block?._id,
																			showAddUnit: true,
																		});
																	}}
																>
																	+ add unit
																</span>
															</div>
														)}
													</span>
												)}
												{(this.state?.style?.labels?.showUnitPrice ??
													true) && (
													<span
														style={{
															width:
																value?.amount?.length > 5
																	? parseFloat(
																			value?.amount?.length *
																				10 +
																				15,
																	  )
																	: value?.amount > 999
																	? '70px'
																	: '60px',
															color: this.state?.style?.valueColor,
															display: 'flex',
															alignItems: 'end',
														}}
													>
														{value?.amount == '0'
															? ''
															: this.props?.currencySymbol || ''}
														<input
															type="text"
															style={{
																width: `${
																	value?.amount?.length * 10 || 10
																}px`,
																minWidth: '30px',
																textAlign: 'left',
																color: this.state?.style
																	?.valueColor,
															}}
															value={value?.amount}
															onChange={(e) =>
																this.handleServiceValueChange(
																	'amount',
																	e.target.value,
																	block?._id,
																)
															}
															maxLength={10}
															disabled={this.props?.client}
															placeholder="0"
														/>
													</span>
												)}
												{this.state?.section?.style?.taxes?.length > 0 && (
													<>
														{Array(
															this.state?.section?.style?.taxes
																?.length,
														)
															.fill()
															.map((_, index) => (
																<input
																	type="checkbox"
																	key={index}
																	checked={
																		value?.[
																			`tax${index + 1}`
																		] ?? false
																	}
																	onChange={(e) => {
																		this.props?.client
																			? ''
																			: this.handleTaxChecked(
																					`tax${
																						index + 1
																					}`,
																					e.target
																						.checked,
																					block?._id,
																			  );
																	}}
																	style={{
																		minWidth: '40px',
																		cursor: this.props?.client
																			? 'not-allowed'
																			: 'pointer',
																	}}
																/>
															))}
													</>
												)}
												<span
													style={{
														width:
															value?.quantity * value?.amount > 999
																? '75px'
																: '60px',
														textAlign: 'center',
														color: this.state?.style?.valueColor,
													}}
												>
													{value?.quantity * value?.amount == 0
														? ''
														: `${this.props?.currencySymbol}${
																value?.quantity * value?.amount
														  }`}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
				{(!this.props?.client || !this.state?.preview) &&
					this.state?.previewType != 'm' && (
						<div className="manual-invoice-addbtn-container">
							<span
								onClick={() => this.props?.addManualInvoiceBlock()}
								// onClick={alert('hello')}
								style={{
									padding: '24px 0px',
									color: this.state?.style?.valueColor,
									cursor: 'pointer',
								}}
							>
								+ Add Item
							</span>
						</div>
					)}
			</>
		);
	};

	// ! deleting manual service item
	deleteServiceItem = (id) => {
		// const newBlocks
		let activeSection = { ...this.state.section };
		let newBlocks;
		newBlocks = activeSection?.blocks?.filter((block) => block?._id !== id);
		activeSection = {
			...activeSection,
			blocks: newBlocks,
		};
		this.setState({ section: activeSection, blocks: newBlocks }, () => {
			this.props.setActiveSection(activeSection);
		});
	};

	// ! handle click outside
	handleClickOutside = (e) => {
		e.stopPropagation();
		if (
			!this.props?.client &&
			this.UnitTypesRef.current &&
			!this.UnitTypesRef.current.contains(e.target)
		) {
			this.setState({ showUnitTypes: null });
		}
		if (
			!this.props?.client &&
			this.showAddUnitRef.current &&
			!this.showAddUnitRef.current.contains(e.target)
		) {
			this.setState({ showAddUnit: false });
		}
		if (
			this.blockSidebarRef.current &&
			this.blockSidebarRef.current.getSidebarNode && // check if method exists
			!this.blockSidebarRef.current.getSidebarNode().contains(e.target) &&
			!this.state.showImageModal
		) {
			this.setState(
				{
					showCardPopup: false,
				},
				() => {
					this.props?.setShowCardPopup(false);
				},
			);
		}
	};

	// ! render discount value
	// returnDiscountValue = () => {
	calculateDiscountValue = () => {
		const {
			discount = 0,
			isDiscountInPerc,
			showDiscount = false,
		} = this.state?.section?.style?.discounts || {};
		const totalCost = this.state?.totalCost;
		let discountValue = 0;
		let discountedValue = 0;
		if (showDiscount) {
			if (isDiscountInPerc) {
				discountValue = (totalCost * discount) / 100;
				discountedValue = totalCost - discountValue;
			} else {
				discountValue = discount;
				discountedValue = totalCost - discountValue;
			}
			if (
				totalCost != discountedValue &&
				this.state?.discountedValue !== discountedValue &&
				discountedValue != 0
			) {
				this.setState(
					{
						discountedValue,
						grandTotal: discountedValue,
						discountValue,
					},
					() => {
						this.updateTaxesValues();
					},
				);
			}
		} else {
			this.setState(
				{
					discountValue: 0,
					discountedValue: totalCost,
					grandTotal: totalCost,
				},
				() => {
					this.updateTaxesValues();
				},
			);
		}
	};

	updateTaxesValues = () => {
		// return;
		const { discountedValue } = this.state;
		const taxes = this.state?.section?.style?.taxes;
		let newSection = { ...this.state?.section };
		let totalTaxValue = discountedValue;
		let newTables = [...this.state?.tables];
		// Initialized tax values
		const taxValues = {
			tax1: 0,
			tax2: 0,
			tax3: 0,
		};
		const taxBlockCounts = {
			tax1: 0,
			tax2: 0,
			tax3: 0,
		};
		if (this.state?.showServiceTables) {
			newTables?.forEach((table) => {
				if (table?.type == 'services') {
					if (table?.styles?.services_selection == 2) {
						let total = parseFloat(this.cleanHtmlString(table?.styles?.subTotalValue));
						taxValues.tax1 += total;
						taxValues.tax2 += total;
						taxValues.tax3 += total;
						taxBlockCounts.tax1 += 1;
						taxBlockCounts.tax2 += 1;
						taxBlockCounts.tax3 += 1;
					}
					table?.values?.map((value) => {
						const serviceAmount =
							parseFloat(value?.amount || 0) * parseFloat(value?.quantity || 1);
						if (value?.tax1 === true) {
							taxValues.tax1 += serviceAmount;
							taxBlockCounts.tax1 += 1;
						}

						if (value?.tax2 === true) {
							taxValues.tax2 += serviceAmount;
							taxBlockCounts.tax2 += 1;
						}

						if (value?.tax3 === true) {
							taxValues.tax3 += serviceAmount;
							taxBlockCounts.tax3 += 1;
						}
					});
				}
			});
			const newTaxes = taxes?.map((taxItem) => {
				let newTaxValue = 0;

				if (taxItem?.taxType && taxValues[taxItem?.taxType] !== undefined) {
					if (taxItem?.isTaxInPercentage === true) {
						newTaxValue =
							(taxValues[taxItem.taxType] * parseFloat(taxItem.tax || 0)) / 100;
					} else {
						// Use fixed tax amount
						newTaxValue =
							parseFloat(taxItem.tax || 0) * taxBlockCounts[taxItem.taxType];
					}
				}
				// Add to total (ensure it's a number)
				totalTaxValue += parseFloat(newTaxValue || 0);
				return {
					...taxItem,
					taxValue: newTaxValue,
				};
			});
			if (totalTaxValue !== this.state?.grandTotal) {
				this.setState({ grandTotal: totalTaxValue });
			}
			if (JSON.stringify(newTaxes) !== JSON.stringify(taxes)) {
				newSection = {
					...newSection,
					style: {
						...newSection?.style,
						taxes: newTaxes,
					},
				};
				this.setState(
					{
						section: newSection,
					},
					() => {
						this.props?.setActiveSection(newSection);
					},
				);
			}
		} else {
			newSection?.blocks?.forEach((block) => {
				const value = block?.subBlocks[0] || {};

				const blockAmount =
					parseFloat(value?.amount || 0) * parseFloat(value?.quantity || 1);
				if (value?.tax1 === true) {
					taxValues.tax1 += blockAmount;
					taxBlockCounts.tax1 += 1;
				}

				if (value?.tax2 === true) {
					taxValues.tax2 += blockAmount;
					taxBlockCounts.tax2 += 1;
				}

				if (value?.tax3 === true) {
					taxValues.tax3 += blockAmount;
					taxBlockCounts.tax3 += 1;
				}
			});
			const newTaxes = taxes?.map((taxItem) => {
				let newTaxValue = 0;

				if (taxItem?.taxType && taxValues[taxItem?.taxType] !== undefined) {
					if (taxItem?.isTaxInPercentage === true) {
						newTaxValue =
							(taxValues[taxItem.taxType] * parseFloat(taxItem.tax || 0)) / 100;
					} else {
						// Use fixed tax amount
						newTaxValue =
							parseFloat(taxItem.tax || 0) * taxBlockCounts[taxItem.taxType];
					}
				}
				// Add to total (ensure it's a number)
				totalTaxValue += parseFloat(newTaxValue || 0);
				return {
					...taxItem,
					taxValue: newTaxValue,
				};
			});
			if (totalTaxValue !== this.state?.grandTotal) {
				this.setState({ grandTotal: totalTaxValue });
			}
			if (JSON.stringify(newTaxes) !== JSON.stringify(taxes)) {
				newSection = {
					...newSection,
					style: {
						...newSection?.style,
						taxes: newTaxes,
					},
				};
				this.setState(
					{
						section: newSection,
					},
					() => {
						this.props?.setActiveSection(newSection);
					},
				);
			}
		}
	};

	// handling tax checked for individual invoice item
	handleTaxChecked = (taxType, checked, blockId) => {
		if (this.state?.showServiceTables) {
			const newTables = this.state?.tables?.map((table) => {
				table.values = table?.values?.map((value) => {
					if (value?.blockId === blockId) {
						value[taxType] = checked;
					}
					return value;
				});
				return table;
			});
			this.setState({ tables: newTables }, () => {
				this.props?.updateTablesForTaxes(newTables);
			});
		} else {
			let newSection = { ...this.state?.section };
			let newBlocks = [...newSection?.blocks];
			newBlocks = newSection?.blocks?.map((block) => {
				if (block?._id === blockId) {
					return {
						...block,
						subBlocks: [
							{
								...block?.subBlocks[0],
								[taxType]: checked,
							},
						],
					};
				}
				return block;
			});
			if (JSON.stringify(newBlocks) !== JSON.stringify(newSection?.blocks)) {
				newSection = { ...newSection, blocks: newBlocks };
				this.setState({ section: newSection });
				this.props?.setActiveSection(newSection);
			}
		}
	};
	getVariableValue(text) {
		if (!text || !this.props.variables || !this.props?.smartFileVariables) return '';

		const parts = text.split(/<input[^>]*>/);
		const beforeText = parts[0]
			.replace(/<[^>]*>/g, '')
			.replace(/&nbsp;/g, ' ')
			.trim();

		const match = text.match(/data-id="([^"]+)"/);
		const variableId = match ? match[1] : null;

		if (!variableId) return text;
		let variable = null;
		variable = this.props.variables.find((v) => v._id === variableId);
		if (!variable) {
			const { module = [], workspace = [], custom = [] } = this.props?.smartFileVariables;
			variable =
				custom.find((v) => v._id === variableId) ||
				module.find((v) => v._id === variableId) ||
				workspace.find((v) => v._id === variableId);
		}
		const variableValue = variable?.defaultValue || '';

		return `${beforeText} ${variableValue}`.trim();
	}

	render() {
		const isiOS =
			this.props?.client && this.props?.previewType === 'm'
				? /iP(hone|ad|od)/.test(navigator.platform) ||
				  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
				: true;
		return (
			<div
				className="block"
				style={{
					padding:
						this.state.preview && this.state.previewType === 'm'
							? '0px 0px'
							: '0px 0px',
					// width: this.state?.previewType === 'm' && '400px',
					width: this.state?.previewType === 'm' && (isiOS ? '400px' : '375'),
				}}
				onClick={(e) => {
					// e.stopPropagation();
					// this.handleClickOutside(e);
				}}
			>
				<div className="layout" style={{ flexGrow: 1, width: '100%' }}>
					<div className="invoice-wrapper" style={{ width: '100%' }}>
						{this.state?.showAddUnit && !this.props?.client && (
							<>
								<div className="show-add-unit" ref={this.showAddUnitRef}>
									<div className="show-add-unit-header">
										<span style={{ fontWeight: 'bold' }}>Add Unit</span>
									</div>
									<div className="show-add-unit-input-div">
										<input
											type="text"
											placeholder="add custom unit (max 8 characters)"
											value={this.state?.newUnitValue}
											onChange={(e) =>
												this.setState({ newUnitValue: e.target.value })
											}
											maxLength={8}
										/>
									</div>
									<div className="show-add-unit-footer">
										<button
											className="cancel-btn"
											onClick={() =>
												this.setState({
													showAddUnit: false,
													newUnitValue: '',
												})
											}
										>
											Cancel
										</button>
										<button
											className="add-btn"
											onClick={async (e) => {
												e.stopPropagation();
												await this.handleServiceValueChange(
													'unit',
													this.state?.newUnitValue,
													this.state?.currentBlockId,
												);
												this.setState({
													showAddUnit: false,
													newUnitValue: '',
													currentBlockId: '',
												});
											}}
										>
											Add Unit
										</button>
									</div>
								</div>
							</>
						)}
						<div
							className="iw-a"
							style={{
								padding: this.state.previewType === 'm' && '10px',
								width: this.state?.previewType === 'm' && '400px',
								backgroundColor:
									this.state?.style && this.state?.style?.invoiceLayout
										? this.state?.style?.Card1Color
										: '',
								paddingBottom: '0px',
							}}
							onClick={() => this.handleInvClick()}
						>
							{/* <div className="logo-info">
								<div className="logo-div">
									<img src="" alt="logo" />
								</div>
								<div className="invo-info">
									<p>Loveco</p>
									<p>&#43; 919876543210 |  gmail@gmail.com</p>
								</div>
							</div> */}

							{this.state?.style && this.state?.style?.invoiceLayout ? (
								<div
									className="component"
									style={{
										...this.props?.blocks[0]?.subBlocks[0]?.divStyles,
										zoom: this.state?.previewType === 'm' ? 0.65 : 1,
									}}
								>
									<Text
										setTriggerFont={(e) => this.props.setTriggerFont(e)}
										triggerFont={this.props.triggerFont}
										triggeredFont={this.props.triggeredFont}
										text={this.state?.style?.invoiceTitle?.content || 'title'}
										style={this.state?.style?.invoiceTitle?.styles || {}}
										// divStyles={this.props?.blocks[0]?.subBlocks[0]?.divStyles}
										// className={this.props?.blocks[0]?.subBlocks[0]?.className}
										mclassName={this.state?.style?.invoiceTitle?.mclassName}
										activeFontColor={this.props?.activeFontColor}
										refID={'invoiceTitle' + this.props?.section?._id}
										subBlockID={'invoiceTitle' + this.props?.section?._id}
										reference={
											this.props?.section?._id +
											this.state?.style?.invoiceTitle?._id
										}
										actionType={this.props?.actionType}
										actionValue={this.props?.actionValue}
										handleSelection={(e, activeTextBlock) => {
											this.props.handleSelection(e, activeTextBlock);
										}}
										activeSectionID={this.props.activeSectionID}
										sectionID={this.props?.section?._id}
										activeTextBlock={this.props?.activeTextBlock}
										setContent={(e) =>
											// this.props.setContent(
											// 	e,
											// 	this.props?.section?._id,
											// 	this.props?.blocks[0]?._id,
											// 	this.props?.blocks[0]?.subBlocks[0]?._id,
											// )
											this.setInvoiceTitle(e)
										}
										preview={this.props.preview}
										setTab={(e) =>
											this.props?.setTab(
												e,
												this.state?.style?.invoiceTitle?._id,
												this.props?.blocks[0]?._id,
											)
										}
										activeVariableID={this.props.activeVariableID}
										activeVariableName={this.props.activeVariableName}
										variables={this.props.variables}
										client={this.props.client}
										module={this.props.module}
										activeVariable={(e) => this.props?.activeVariable(e)}
										activeSubBlockId={this.props?.activeSubBlockId}
										sectionType={this.state?.section?.type}
										header={''}
										clearStyling={() => this.props.clearStyling()}
										label={''}
										tables={this.props.tables}
										sections={this.props.sections}
										sectionBg={
											this.props?.style?.sectionBackgroundColor || 'blue'
										}
									/>
								</div>
							) : (
								<h2>Invoice</h2>
							)}

							{/* commented for now */}
							{/* <input
								className="invoice-input"
								value={this.state?.invoiceObj?.invoiceTitle}
								onChange={(e) =>
									this.setState({
										invoiceObj: {
											...this.state.invoiceObj,
											invoiceTitle: e.target.value,
										},
									})
								}
							/> */}
							<div
								className="bill-details"
								style={{
									justifyContent:
										this.state?.previewType === 'm'
											? 'flex-start'
											: 'space-between',
									justifyContent:
										this.state?.previewType === 'm'
											? 'flex-start'
											: 'space-between',
									width: this.state?.previewType === 'm' && '390px',
									paddingBottom: this.state?.previewType === 'm' && '16px',
								}}
							>
								<div className="bd-left">
									<span
										className="bill-to"
										style={{ color: this.state?.style?.valueColor }}
									>
										Bill To
									</span>
									<span style={{ color: this.state?.style?.titleColor }}>
										{this.props?.client == true || this.props.isWorkflow
											? this.state?.invoiceDetails?.clientDetailsName
											: 'Client Name'}
									</span>

									<span style={{ color: this.state?.style?.titleColor }}>
										{this.props?.client == true || this.props.isWorkflow
											? this.state?.invoiceDetails?.clientDetails
											: 'Client Email'}
									</span>

									{/* variables

									{/* {this.state.invoiceClientVariables?.length > 0 &&
										this.state.invoiceClientVariables.map((variable, i) => (
											<span key={i}>{variable.value}</span>
										))} */}
								</div>
								<div
									className="bd-right"
									style={{
										flexDirection: this.state?.previewType === 'm' && 'column',
									}}
								>
									<div className="bdr-item">
										<span style={{ color: this.state?.style?.valueColor }}>
											Invoice #
										</span>
										{/* <p>
											{this.props.client == true
												? this.state.invoiceDetails?.invoiceNo
												: 'Invoice No'}
										</p> */}
										<div className="invoice-do-div">
											{this.state.isEditing && (
												<input
													style={{
														// width: this.state.invoiceNumber?.prefix?.includes('W')  || this.state.invoiceNumber?.prefix?.includes('M')  ? '100px' : '70px',
														width: '100px',
														color: this.state?.style?.titleColor,
													}}
													value={this.state?.invoiceNumber?.prefix}
													onChange={(e) =>
														this.setInvoiceNumber(e.target.value)
													}
													placeholder="ABCD"
													maxLength={7}
													onBlur={() => {
														this.setState({ isEditing: false });
													}}
													autoFocus
												/>
											)}
											{!this.state.isEditing && (
												<span
													className="perc-input"
													onClick={() => {
														this.props?.client == true
															? ''
															: this.setState({
																	isEditing:
																		!this.state?.isEditing,
															  });
													}}
													style={{ color: this.state?.style?.titleColor }}
												>
													{' '}
													{!this.state.isEditing &&
														this.state?.invoiceNumber?.prefix}
													{this.state?.invoiceNumber?.slNo}
												</span>
											)}
										</div>
										{!this.state?.isValidNo && this.state.isEditing && (
											<span className="invalid-error-span">
												{this.state?.inValidErrorMsg}
											</span>
										)}
										<span
											style={{
												marginTop: '15px',
												color: this.state?.style?.valueColor,
											}}
										>
											Date issued{' '}
										</span>
										<p style={{ color: this.state?.style?.titleColor }}>
											{this.props.client == true || this.props.isWorkflow
												? moment
														.unix(this.state.invoiceDetails?.createdAt)
														.format('DD/MM/YYYY')
												: '------'}
										</p>
									</div>
									{/* <div className="bdr-item">
										<span>Purchase order #</span>
										<p>
											{this.props.client == true
											? this.state.invoiceDetails?.orderNo
											: 'enter Po#'}
											</p>
										<input
											maxLength={22}
											value={this.state?.invoiceObj?.orderNo}
											onChange={(e) =>
												this.setState({
													invoiceObj: {
														...this.state.invoiceObj,
														orderNo: e.target.value,
													},
												})
											}
										/>
										<span
										style={{ marginTop: '15px' }}
										>
											Next payment due{' '}
										</span>
										<p>
											{this.props.client == true
												? this.state.invoiceDetails?.nextDue
												: '------'}
										</p>
									</div> */}
								</div>
							</div>
							{this.state?.previewType === 'm' ? null : (
								<div
									className="service-header"
									style={{ zoom: this.state?.previewType === 'm' && 0.8 }}
								>
									<div
										className="sh-left"
										style={{ color: this.state?.style?.valueColor }}
									>
										service info
									</div>
									<div
										className="sh-right"
										style={{
											width:
												window.innerWidth < 1100 ||
												this.state?.section?.style?.taxes?.length > 0
													? 'auto'
													: '400px',
											justifyContent: 'flex-end',
											marginRight: window.innerWidth < 1100 ? '10px' : '40px',
										}}
									>
										{(this.state?.style?.labels?.showQuantity ?? true) && (
											<span style={{ color: this.state?.style?.titleColor }}>
												qty
											</span>
										)}
										{(this.state?.style?.labels?.showUnit ?? true) && (
											<span style={{ color: this.state?.style?.titleColor }}>
												unit
											</span>
										)}
										{(this.state?.style?.labels?.showUnitPrice ?? true) && (
											<span style={{ color: this.state?.style?.titleColor }}>
												unit price
											</span>
										)}
										{this.state?.section?.style?.taxes?.length > 0 && (
											<>
												{_.map(
													this.state?.section?.style?.taxes,
													(taxItem, index) => {
														return (
															<span
																key={index}
																style={{
																	color: this.state?.style
																		?.titleColor,
																}}
															>
																{taxItem?.label}
															</span>
														);
													},
												)}
											</>
										)}
										<span style={{ color: this.state?.style?.titleColor }}>
											total
										</span>
									</div>
								</div>
							)}
						</div>
						<div
							className="iw-a"
							style={{
								padding: this.state.previewType === 'm' && '10px',
								zoom:
									this.state?.previewType === 'm'
										? 0.78
										: window.innerWidth < 1100
										? 0.8
										: 1,
								backgroundColor:
									this.state?.style && this.state?.style?.invoiceLayout
										? this.state?.style?.Card2Color
										: '',
								// alignItems: this.state?.previewType === 'm' ? 'center' : '',
							}}
							onClick={() => this.handleInvClick()}
						>
							{this.state?.showServiceTables ? (
								<>{this.returnServiceTables()}</>
							) : this.props?.section || this.props?.sections ? (
								<>{this.returnManualServices()}</>
							) : (
								''
							)}

							<div
								className="service-total"
								style={
									{
										// justifyContent: this.state.previewType === 'm' && 'center',
									}
								}
							>
								<div
									className="st-right"
									style={{
										width: this.state?.previewType === 'm' ? '100%' : 'auto',
									}}
								>
									<div
										className="subtotal"
										style={{
											width: this.state?.previewType === 'm' && '100%',
										}}
									>
										<span
											style={{
												color: this.state?.style?.valueColor,
											}}
										>
											Subtotal
										</span>
										<span
											style={{
												color: this.state?.style?.valueColor,
											}}
										>
											{
												// this.props.client === true ||
												// this.props?.isWorkflow
												this.state?.showServiceTables
													? `${
															this.props?.currencySymbol
													  }${this.renderCurrencyValue(
															this.props?.clientGrandTotal
																? this.props?.clientGrandTotal
																: this.state?.invoiceDetails
																		?.totalAmount
																? this.state?.invoiceDetails
																		?.totalAmount
																: this.state?.totalCost,
													  )}`
													: this.state?.isManual
													? `${
															this.props?.currencySymbol
													  }${this.renderCurrencyValue(
															this.state?.totalCost,
													  )}`
													: 'TBD'
											}
										</span>
									</div>

									{/* <hr /> */}
									{!this.state?.section?.style?.discounts?.showDiscount &&
									this.props?.client ? (
										''
									) : (
										<>
											<div className="add-extras">
												<span
													// onClick={(e) => {
													// 	e.stopPropagation();
													// 	this.props?.client
													// 		? ''
													// 		: this.setState({
													// 			showCardPopup: true,
													// 		});
													// }}
													style={{
														color: this.state?.style?.valueColor,
													}}
												>
													{this.state?.section?.style?.discounts
														?.showDiscount
														? ' Discount'
														: '+ Add Discount'}
													{this.state?.section?.style?.discounts
														?.isDiscountInPerc
														? this.state?.section?.style?.discounts
																?.showDiscount && (
																<span
																	className="disc-perc-span"
																	style={{
																		backgroundColor:
																			'royalblue',
																	}}
																>
																	{
																		this.state?.section?.style
																			?.discounts?.discount
																	}
																	%
																</span>
														  )
														: ''}
												</span>
												<span
													style={{
														color: this.state?.style?.valueColor,
													}}
												>
													{this.state?.section?.style?.discounts
														?.showDiscount
														? `-${this.props?.currencySymbol}${this.state?.discountValue}`
														: '0.0'}
												</span>
											</div>
											{/* <hr /> */}
										</>
									)}
									{this.state?.section?.style?.taxes?.length > 0 && (
										<>
											{_.map(
												this.state?.section?.style?.taxes,
												(taxItem, i) => {
													return (
														<>
															<div className="add-extras" key={i}>
																<span
																	style={{
																		color: this.state?.style
																			?.valueColor,
																		textTransform: 'uppercase',
																	}}
																	// onClick={(e) => {
																	// 	e.stopPropagation();
																	// 	this.setState({
																	// 		showCardPopup: true,
																	// 	});
																	// }}
																>
																	{taxItem?.label ||
																		`Tax ${i + 1}`}
																	{taxItem?.isTaxInPercentage ? (
																		<span className="disc-perc-span">
																			{taxItem?.tax}%
																		</span>
																	) : (
																		''
																	)}
																</span>
																<span
																	style={{
																		color: this.state?.style
																			?.valueColor,
																	}}
																>
																	{taxItem?.tax
																		? `${this.props?.currencySymbol}${taxItem?.taxValue}`
																		: '0.0'}
																</span>
															</div>
															{/* {this.state?.section?.style?.taxes
																?.length != parseInt(i + 1) && (
																<hr />
															)} */}
														</>
													);
												},
											)}
										</>
									)}
									{!this.props?.client &&
										(this.state?.section?.style?.taxes?.length === 0 ||
											!_.has(this.state?.section?.style, 'taxes')) && (
											<div className="add-extras">
												<span
													// onClick={(e) => {
													// 	e.stopPropagation();
													// 	this.setState({
													// 		showCardPopup: true,
													// 	});
													// }}
													style={{
														color: this.state?.style?.valueColor,
													}}
												>
													&#43; Add Tax
												</span>
											</div>
										)}
									<div
									// style={{
									// 	backgroundColor: this.state?.style?.valueColor,
									// 	width: '100%',
									// 	height: '1px',
									// }}
									/>

									<div
										className="total"
										style={{
											width: this.state?.previewType === 'm' && '100%',
										}}
									>
										<span
											style={{
												color: this.state?.style?.valueColor,
											}}
										>
											Total Cost{' '}
										</span>
										<label
											style={{
												color: this.state?.style?.valueColor || '#101314',
												fontSize: '20px',
												fontWeight: '500',
											}}
										>
											{' '}
											{/* &#36; */}
											{/* {this.props?.currencySymbol
															? this.props?.currencySymbol
															: this.props?.currencySymbol2}
														{this.props.client == true
															? this.state.invoiceDetails?.totalAmount
															: 'TBD'} */}
											{
												// this.props.client === true ||
												// this.props?.isWorkflow
												this.state?.showServiceTables
													? `${
															this.props?.currencySymbol
													  }${this.renderCurrencyValue(
															// this.props?.clientGrandTotal
															// 	? this.props?.clientGrandTotal
															// 	: this.state?.invoiceDetails
															// 			?.totalAmount
															// 	? this.state?.invoiceDetails
															// 			?.totalAmount
															// 	: // : this.state?.totalCost,
															this.state?.grandTotal
																? this.state?.grandTotal
																: this.state?.totalCost,
													  )}`
													: this.state?.isManual
													? `${
															this.props?.currencySymbol
													  }${this.renderCurrencyValue(
															// this.state?.totalCost,
															this.state?.grandTotal
																? this.state?.grandTotal
																: this.state?.totalCost,
													  )}`
													: 'TBD'
											}
										</label>
									</div>
								</div>
							</div>
						</div>
						{this.state.showSchedule && !this.state?.style?.invoiceLayout && (
							<div
								className="iw-payment"
								style={{ gap: this.state?.previewType === 'm' && '8px' }}
								onClick={() => this.handleInvClick()}
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
									onClick={this?.toggleScheduleContainer}
								>
									<p className="heading">PAYMENT SCHEDULE</p>
									{/* <UpDown
									style={{
										rotate: !this.state.showSchedule && '180deg',
									}}
								/> */}
								</div>

								{this.state?.previewType !== 'm' && (
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
											onClick={() => this.handlePayment('percentage')}
										>
											Percentage
										</p>
										<p
											className={
												this.state.activePayment === 'equal'
													? 'activeEqual'
													: ''
											}
											onClick={() => this.handlePayment('equal')}
										>
											Equal
										</p>
									</div>
								)}
								{this.state?.activePayment === 'equal' && (
									<div
										className="payment-details-container schedule-container-anim-active"
										ref={this.state.scheduleContainerRef}
									>
										<p>
											Number of payments :{' '}
											{this.state?.paymentSchedule?.length}
										</p>
									</div>
								)}
								{this?.state?.previewType !== 'm' && (
									<div
										className="payment-schedule-container schedule-container-anim-active"
										style={{
											zoom: this?.state?.previewType === 'm' ? 0.7 : 1,
										}}
										ref={this?.state?.scheduleContainerRef}
									>
										<p style={{ width: '10.17%' }}>PERCENTAGE</p>
										<p style={{ width: '26.41%' }}>DUE DATE</p>
										<p style={{ width: '17.65%' }}>PAYMENT DATE</p>
										<p style={{ width: '17.65%' }}>PAYMENT ID</p>
										<p style={{ width: '13.53%' }}>STATUS</p>
									</div>
								)}
								<div className="line"></div>
								{this?.state?.paymentSchedule?.map((data, index) => (
									<>
										<div
											className="payment-details-container schedule-container-anim-active"
											key={index}
											style={{
												zoom: this?.state?.previewType === 'm' ? 0.9 : 1,
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
													width:
														this?.state?.previewType === 'm'
															? '61%'
															: '38%',
													gap: this?.state?.previewType === 'm' && '15px',
													flexDirection:
														this?.state?.previewType === 'm' &&
														'column',

													alignItems:
														this?.state?.previewType === 'm' &&
														'flex-start',
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
																	this.state?.style
																		?.paymentFontColor ||
																	'#000',
															}}
														>
															{this.state?.activePayment ===
															'percentage'
																? data?.amountPercentage
																: this?.getPercentage()}
														</p>
													</>
												) : (
													<>
														<input
															className={
																!this.state?.preview &&
																!this.props?.client
																	? 'perc-input'
																	: ''
															}
															style={{
																width:
																	this?.state?.previewType === 'm'
																		? ''
																		: '30%',
															}}
															value={`${
																this?.state?.activePayment ===
																'percentage'
																	? data?.amountPercentage
																	: this?.getPercentage()
															}`}
															pattern="\d*"
															title="Only numbers are allowed"
															maxLength={3}
															onChange={(e) =>
																this.handlePercentageChange(
																	e,
																	index,
																)
															}
															disabled={
																this.state.activePayment !==
																	'percentage' ||
																this.state?.preview ||
																this.state?.previewType?.includes(
																	'm',
																) ||
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
															this?.state?.previewType === 'm'
																? '80%'
																: '65%',
													}}
												>
													{this.renderDateInput(data, index)}
												</div>
											</div>

											{this.state.showDateOptions &&
												this?.state?.activeId === index &&
												!this?.state?.preview && (
													<div className="date-drop-down">
														<p
															onClick={() =>
																this.handleDueDateChange(
																	'Invoice Sent Date',
																	index,
																)
															}
														>
															Invoice Sent Date
														</p>
														{/* <p
																onClick={() =>
																	this.handleDueDateChange(
																		'custom Date',
																		index,
																	)
																}
															>
																Custom Date
															</p> */}
														{/* <p onClick={()=> this.handleDueDateChange('Smart Date',index)}>Smart Date</p> */}
													</div>
												)}
											{this?.state?.previewType !== 'm' && (
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
														this.state?.previewType === 'm'
															? '20%'
															: '13.53%',
													textAlign: 'center',
													color: this.getStatusColor(data?.status),
												}}
												className="payment-status"
											>
												{data?.status}
											</p>
											{!this.state?.preview &&
											!this.state?.previewType?.includes('m') &&
											!this.props?.client &&
											this?.state?.showDelete &&
											this?.state?.activeId === index ? (
												<div
													className="delete-payment"
													onClick={() => this.deletePayment(index)}
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
									</>
								))}

								{this?.state?.percentageError &&
									this?.state?.activePayment === 'percentage' && (
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
						)}
					</div>
				</div>
				{this.state.showCardPopup && !this.props?.client && (
					<>
						<BlockSidebar
							ref={this.blockSidebarRef}
							elementEndPosition={
								this.state.elementEndPosition || { x: 450, y: '65%' }
							}
							activeType={this.state.activeType || 'invoice'}
							section={this.state?.section}
							activePopupComponent={
								this?.state?.activePopupComponent || this?.state?.section
							}
							brandColors={this.props?.brandColors}
							modules={this.props?.modules}
							getModuleSections={(e) => this.props?.getModuleSections(e)}
							activeModuleSections={this.props?.activeModuleSections}
							isWorkflow={this.props.isWorkflow}
							previewType={this.props.previewType}
							handleCardPopupProps={(e) => {
								console.log('e in invoice jeevan', e);
								if (e?.shouldClose) {
									this.setState({ showPopup: false });
								} else {
									this.setState(
										{
											section: e,
											style: e?.style,
										},
										() => {
											this.props?.setActiveSection(e);
											this.calculateDiscountValue();
										},
									);
								}
							}}
							style={this.state?.section?.style}
							setActivePopupComponent={(e) => {
								this.handleSetActivePopupComponent(e);
							}}
							setModalRef={(e) => {
								this.setState({
									showImageModal: e,
								});
							}}
							setActiveImageSettings={this.setActiveImageSettings}
							activeWorkflowModuleId={this.props?.activeWorkflowModuleId}
							activeModuleId={this.props?.activeModuleId}
							activeSectionID={this.props.activeSectionID}
							module={this.props.module}
							handleIsValidBgVideoURL={this.props.handleIsValidBgVideoURL}
							currencySymbol={this.props?.currencySymbol}
							active={this.props.active}
						/>
					</>
				)}
			</div>
		);
	}
}

export default Invoice;
