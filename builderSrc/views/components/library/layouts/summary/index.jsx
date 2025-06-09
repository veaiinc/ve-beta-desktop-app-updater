import React, { Component, PureComponent } from 'react';
import './summary.scss';

import _ from 'lodash';
export default class Summary extends PureComponent {
	constructor(props) {
		super();
		this.state = {
			preview: props.preview,
			previewType: props.previewType,
			summaryBg: props.summaryBg,
			summaryFont: props.summaryFont,
			summaryFontColor: props.summaryFontColor,
			summaryFontSize: props?.summaryFontSize,
			eventsLabel: props?.eventsLabel,
			paymentsLabel: props?.paymentsLabel,
			// tables: props?.tables,
			// sections: props?.sections,
			summaryBlock: props?.summaryBlock,
			globalSummaryData: props?.globalSummaryData,
			sections: props?.sections,
			tables: props?.tables,
			style: props?.style,
		};
	}
	componentWillReceiveProps = (nextProps) => {
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
		if (this.state.summaryBg !== nextProps.summaryBg) {
			this.setState({
				summaryBg: nextProps.summaryBg,
			});
		}

		if (this.state.summaryFont !== nextProps.summaryFont && nextProps.summaryFont) {
			this.setState({
				summaryFont: nextProps.summaryFont,
			});
		}
		if (this.state.summaryFontSize !== nextProps.summaryFontSize && nextProps.summaryFontSize) {
			this.setState({
				summaryFontSize: nextProps.summaryFontSize,
			});
		}
		if (
			this.state.summaryFontColor !== nextProps.summaryFontColor &&
			nextProps.summaryFontColor
		) {
			this.setState({
				summaryFontColor: nextProps.summaryFontColor,
			});
		}
		if (this.state.eventsLabel !== nextProps.eventsLabel && nextProps.eventsLabel) {
			this.setState({
				eventsLabel: nextProps.eventsLabel,
			});
		}
		if (this.state.paymentsLabel !== nextProps.paymentsLabel && nextProps.paymentsLabel) {
			this.setState({
				paymentsLabel: nextProps.paymentsLabel,
			});
		}
		if (this.state.summaryBlock !== nextProps.summaryBlock && nextProps.summaryBlock) {
			this.setState({
				summaryBlock: nextProps.summaryBlock,
			});
		}
		if (
			this.state.globalSummaryData !== nextProps.globalSummaryData &&
			nextProps.globalSummaryData
		) {
			this.setState({
				globalSummaryData: nextProps.globalSummaryData,
			});
		}
		if (this.state.sections !== nextProps.sections && nextProps.sections) {
			this.setState({
				sections: nextProps.sections,
			});
		}
		if (this.state.tables !== nextProps.tables && nextProps.tables) {
			this.setState({
				tables: nextProps.tables,
			});
		}
		if (this.state.style !== nextProps.style && nextProps.style) {
			this.setState({
				style: nextProps.style,
			});
		}
	};
	componentDidUpdate(prevProps, prevState) {
		if (
			prevProps.eventsLabel !== this.props.eventsLabel &&
			this.props.eventsLabel !== undefined
		) {
			// Update state when the eventsLabel prop changes
			this.setState({
				eventsLabel: this.props.eventsLabel,
			});
		}
		if (
			prevProps.paymentsLabel !== this.props.paymentsLabel &&
			this.props.paymentsLabel !== undefined
		) {
			// Update state when the eventsLabel prop changes
			this.setState({
				paymentsLabel: this.props.paymentsLabel,
			});
		}
	}

	handleOnClick = (e) => {
		this.state.preview == true;

		// this.props.handleSideBar(e, null), this.props.setTab('b');
	};
	cleanString(str) {
		if (typeof str !== 'string') {
			return ''; // Return an empty string for invalid inputs
		}

		return str
			.replace(/<[^>]*>/g, '') // Remove HTML tags
			.replace(/\s*style=["'][^"']*["']/g, '') // Remove inline styles
			.replace(/&nbsp;/g, '  '); // Replace non-breaking spaces
	}

	render() {
		return (
			<div
				style={{
					backgroundColor: this.state?.style?.summaryLayout
						? this.state?.style?.summaryBackgroundColor
						: this.state?.summaryBg,
					fontFamily: this.state?.style?.summaryLayout
						? this.state?.style?.summaryPrimaryFontFamily
						: this.state?.summaryFont,
					fontSize: this.state?.style?.summaryLayout
						? parseInt(this.state?.style?.summaryPrimaryFontSize)
						: this.state?.summaryFontSize,
					color: this.state?.style?.summaryLayout
						? this.state?.style?.summaryPrimaryFontColor
						: this.state?.summaryFontColor,
					padding: this.state.previewType === 'm' && '24px 34px',
					margin: this.state.previewType === 'm' && 0,
					maxWidth: this.state.previewType === 'm' && '100%',
				}}
				onClick={(e) => this.handleOnClick(e)}
				className="summary-wrapper"
			>
				<div className="proposal-name">Proposal Summary</div>
				{/* {_.size(_.filter(this.state?.tables, { type: 'events' })) > 0 ? ( */}
				{/* <div
					style={{ display: this.state?.eventsLabel ? 'flex' : 'none' }}
					className="events-block"
				>
					<div className="event-name">Events</div>
					<div className="event-table">
						<div>
							<img
								className="summary-image"
								src={photo}
								height={'48px'}
								width={'48px'}
							/>
						</div>
						<div className="event-details">
							<div className="event-date">May 25, 2024, Hyd</div>
							<div className="event-type">Wedding</div>
							<div className="event-details">4 Candid Photographer</div>
							<div className="event-details">4 Traditional Photographer</div>
							<div className="event-details">Description about the event,</div>
						</div>
					</div>
					<div>
						<hr
							style={{ width: '100%', borderColor: this.state?.summaryFontColor }}
						></hr>
					</div>
				</div> */}

				{/* ) : (
					''
				)} */}

				{/* im commenting for chatgpt code */}
				<div>
					{_.map(
						_.filter(this.state.sections, { type: 'services' }),
						(section, index) => {
							let clientSubTotal = 0;
							if (this.props?.client) {
								clientSubTotal = _.find(this.state.tables, {
									_id: section._id,
								})?.values?.reduce((sum, value) => {
									let amountValue =
										value?.isSelected && value?.show
											? parseInt(value?.amount * value?.quantity)
											: 0;
									return sum + parseInt(amountValue) || 0;
								}, 0);
							}

							// if client subtotal is 0 and services_selection is 2 then we need to show the custom subTotalValue
							if (clientSubTotal === 0 && section?.style?.services_selection === 2) {
								let customSubTotalValue = section?.style?.subTotalValue;
								clientSubTotal =
									parseFloat(
										(customSubTotalValue + '')
											?.replace(/&nbsp;/g, ' ')
											.replace(/<\/?[^>]+(>|$)/g, '')
											.replace(/"/g, ''),
									) || 0;
							}

							return (
								<>
									<div className="service-div" key={section._id || index}>
										{/* Display subTotal and subTotalValue */}

										{section?.style?.labels?.[0]?.subTotal &&
											section?.blocks?.[0]?.subBlocks?.map(
												(subBlock) =>
													subBlock?.isSelected && subBlock?.show,
											) &&
											// section?.style?.services_selection == 2 &&
											section?.blocks?.[0]?.subBlocks?.some(
												(subBlock) => subBlock?.show == true,
											) && (
												<div
													className="sub-total"
													style={{ marginTop: index === 0 ? '' : '15px' }}
												>
													<div className="sub-total-title">
														{this.cleanString(
															section?.style?.subTotalTitle ||
																'Sub Total',
														)}{' '}
													</div>
													<div className="sub-total-value">
														{this.props?.client
															? clientSubTotal
															: section?.style?.subTotalValue
															? `${
																	parseInt(
																		section?.style
																			?.subTotalValue,
																	) || 0
															  }`
															: '0.00'}
													</div>
												</div>
											)}

										{/* Display the section block content */}
										<div className="section-div">
											{_.map(section.blocks, (block, blockIndex) => (
												<div
													key={block._id || blockIndex}
													className="block-div"
													style={{
														backgroundColor: block.backgroundColor,
													}}
												>
													{section?.style?.services_selection == 2 ? (
														<>
															{_.map(
																block.subBlocks,
																(subBlock, subBlockIndex) => {
																	let tableServiceSectionData =
																		_.filter(
																			_.filter(
																				this.state.tables,
																				{
																					_id: section._id,
																				},
																			)?.[0]?.values,
																			{
																				blockId: block._id,
																			},
																		)[0];
																	return (
																		<React.Fragment
																			key={
																				subBlock._id ||
																				subBlockIndex
																			}
																		>
																			{/* Only show subblock-div if isSelected is true */}
																			{tableServiceSectionData ? (
																				<div className="subblock-div">
																					<div>
																						{/* Render images */}
																						{block.labels?.map(
																							(
																								label,
																								labelIndex,
																							) =>
																								label.image ? (
																									<img
																										key={
																											labelIndex
																										}
																										className="image-div"
																										src={
																											block
																												.subBlocks[0]
																												.imageURL
																												? block
																														.subBlocks[0]
																														.imageURL
																												: 'https://cdn1.iconfinder.com/data/icons/image-manipulations/100/13-512.png'
																										}
																										height="46px"
																										width="46px"
																									/>
																								) : null,
																						)}
																					</div>

																					<div className="subblock-content">
																						{/* Render title */}
																						{block.labels?.map(
																							(
																								label,
																								labelIndex,
																							) =>
																								label.title ? (
																									<div
																										key={
																											labelIndex
																										}
																										className="subblock-title"
																									>
																										{this.cleanString(
																											block
																												.subBlocks[0]
																												.title ||
																												'Title',
																										)}
																									</div>
																								) : null,
																						)}

																						{/* Render paragraph/description */}
																						{block.labels?.map(
																							(
																								label,
																								labelIndex,
																							) =>
																								label.paragraph ? (
																									<div
																										key={
																											labelIndex
																										}
																										className="subblock-description"
																									>
																										{this.cleanString(
																											block
																												?.subBlocks?.[0]
																												?.description ||
																												'Description',
																										)}
																									</div>
																								) : null,
																						)}

																						{/* Render quantity */}
																						{block.labels?.map(
																							(
																								label,
																								labelIndex,
																							) =>
																								label.quantity ? (
																									<div
																										key={
																											labelIndex
																										}
																										className="subblock-quantity"
																									>
																										<div>
																											Quantity
																										</div>
																										<div className="quantity">
																											{tableServiceSectionData?.quantity ||
																												parseInt(
																													block
																														.subBlocks[0]
																														?.quantity,
																												)}
																										</div>
																										{subBlock.amount &&
																										subBlock.unit ? (
																											<div>
																												{this
																													.props
																													?.currencySymbol ||
																													this.cleanString(
																														block
																															.subBlocks[0]
																															.currency,
																													)}
																												&nbsp;
																												{
																													subBlock.amount
																												}

																												/
																												{
																													subBlock.unit
																												}
																											</div>
																										) : null}
																									</div>
																								) : null,
																						)}

																						{/* Render price */}
																						{block.labels?.map(
																							(
																								label,
																								labelIndex,
																							) =>
																								label.price ? (
																									<div
																										key={
																											labelIndex
																										}
																										className="subblock-price"
																									>
																										<div>
																											Price
																										</div>
																										<div className="currency-subblock">
																											{this.cleanString(
																												block
																													.subBlocks[0]
																													.currency,
																											)}
																											<span className="price-subblock">
																												&nbsp;
																												{parseInt(
																													block
																														.subBlocks[0]
																														.amount,
																												) *
																													parseInt(
																														block
																															.subBlocks[0]
																															.quantity,
																													)}
																											</span>
																										</div>
																									</div>
																								) : null,
																						)}
																						{/* Add hr for separation between blocks */}
																						{blockIndex +
																							1 !==
																						section
																							?.blocks
																							?.length ? (
																							<hr
																								style={{
																									opacity: 0.1,
																									width: '100%',
																								}}
																							/>
																						) : (
																							''
																						)}
																					</div>
																				</div>
																			) : (
																				<></>
																			)}
																		</React.Fragment>
																	);
																},
															)}
														</>
													) : (
														<>
															{_.map(
																block.subBlocks,
																(subBlock, subBlockIndex) => {
																	let tableServiceSectionData =
																		_.filter(
																			_.filter(
																				this.state.tables,
																				{
																					_id: section._id,
																				},
																			)?.[0]?.values,
																			{
																				blockId: block._id,
																			},
																		)[0];

																	return (
																		<React.Fragment
																			key={
																				subBlock._id ||
																				subBlockIndex
																			}
																		>
																			{/* Only show subblock-div if isSelected is true */}
																			{tableServiceSectionData?.isSelected ==
																				true &&
																			tableServiceSectionData?.show ==
																				true ? (
																				<div className="subblock-div">
																					<div>
																						{/* Render images */}
																						{block.labels?.map(
																							(
																								label,
																								labelIndex,
																							) =>
																								label.image ? (
																									<img
																										key={
																											labelIndex
																										}
																										className="image-div"
																										src={
																											block
																												.subBlocks[0]
																												.imageURL
																												? block
																														.subBlocks[0]
																														.imageURL
																												: 'https://cdn1.iconfinder.com/data/icons/image-manipulations/100/13-512.png'
																										}
																										height="46px"
																										width="46px"
																									/>
																								) : null,
																						)}
																					</div>

																					<div className="subblock-content">
																						{/* Render title */}
																						{block.labels?.map(
																							(
																								label,
																								labelIndex,
																							) =>
																								label.title ? (
																									<div
																										key={
																											labelIndex
																										}
																										className="subblock-title"
																									>
																										{this.cleanString(
																											block
																												.subBlocks[0]
																												.title ||
																												'Title',
																										)}
																									</div>
																								) : null,
																						)}

																						{/* Render paragraph/description */}
																						{block.labels?.map(
																							(
																								label,
																								labelIndex,
																							) =>
																								label.paragraph ? (
																									<div
																										key={
																											labelIndex
																										}
																										className="subblock-description"
																									>
																										{this.cleanString(
																											block
																												?.subBlocks?.[0]
																												?.description ||
																												'Description',
																										)}
																									</div>
																								) : null,
																						)}

																						{/* Render quantity */}
																						{block.labels?.map(
																							(
																								label,
																								labelIndex,
																							) =>
																								label.quantity ? (
																									<div
																										key={
																											labelIndex
																										}
																										className="subblock-quantity"
																									>
																										<div>
																											Quantity
																										</div>
																										<div className="quantity">
																											{tableServiceSectionData?.quantity ||
																												parseInt(
																													block
																														.subBlocks[0]
																														?.quantity,
																												)}
																										</div>
																										{subBlock.amount &&
																										subBlock.unit ? (
																											<div>
																												{this
																													.props
																													?.currencySymbol ||
																													this.cleanString(
																														block
																															.subBlocks[0]
																															.currency,
																													)}
																												&nbsp;
																												{
																													subBlock.amount
																												}

																												/
																												{
																													subBlock.unit
																												}
																											</div>
																										) : null}
																									</div>
																								) : null,
																						)}

																						{/* Render price */}
																						{block.labels?.map(
																							(
																								label,
																								labelIndex,
																							) =>
																								label.price ? (
																									<div
																										key={
																											labelIndex
																										}
																										className="subblock-price"
																									>
																										<div>
																											Price
																										</div>
																										<div className="currency-subblock">
																											{this
																												.props
																												?.currencySymbol ||
																												this.cleanString(
																													block
																														.subBlocks[0]
																														.currency,
																												)}
																											<span className="price-subblock">
																												&nbsp;
																												{parseInt(
																													block
																														.subBlocks[0]
																														.amount,
																												) *
																													parseInt(
																														block
																															.subBlocks[0]
																															.quantity,
																													)}
																											</span>
																										</div>
																									</div>
																								) : null,
																						)}
																						{/* Add hr for separation between blocks */}
																						{blockIndex +
																							1 !==
																						section
																							?.blocks
																							?.length ? (
																							<hr
																								style={{
																									opacity: 0.1,
																									width: '100%',
																								}}
																							/>
																						) : (
																							''
																						)}
																					</div>
																				</div>
																			) : (
																				<></>
																			)}
																		</React.Fragment>
																	);
																},
															)}
														</>
													)}
												</div>
											))}
										</div>
										{}
									</div>

									{index + 1 !==
										_.size(
											_.filter(this.state?.sections, { type: 'services' }),
										) &&
									section?.style?.services_selection == 2 &&
									section?.blocks?.[0]?.subBlocks?.some(
										(subBlock) => subBlock?.show == true,
									) ? (
										<hr style={{ opacity: 0.2, width: '100%' }}></hr>
									) : null}
								</>
							);
						},
					)}
					<div className="grand-total">
						<div>Grand Total</div>
						<div>
							{!this.props.client || this.props.isSummaryPreview
								? (() => {
										const total = _.filter(this.state.sections, {
											type: 'services',
										}).reduce((sum, section) => {
											const subtotal =
												parseInt(section?.style?.subTotalValue) || 0;
											return sum + subtotal;
										}, 0);

										return `${total}`;
								  })()
								: this?.props?.clientGrandTotal}
						</div>
					</div>
				</div>

				{/* <div
					style={{ display: this.state?.paymentsLabel ? 'flex' : 'none' }}
					className="payment-schedule"
				>
					<div>
						<hr
							style={{ borderColor: this.state.summaryFontColor, width: '100%' }}
						></hr>
					</div>
					<div className="payment-heading">Payment Schedule</div>
					<div className="payment-table">
						<div>
							<hr
								style={{ width: '100%', borderColor: this.state.summaryFontColor }}
							></hr>
						</div>
						<div className="table-heading">
							<div>Amount</div>
							<div>Due Date</div>
							<div>Payment Date</div>
							<div>Payment ID</div>
							<div>Status</div>
						</div>
						<div>
							<hr
								style={{ width: '100%', borderColor: this.state.summaryFontColor }}
							></hr>
						</div>
						<div className="table-due">
							<div>$500</div>
							<div>May10, 2024</div>
							<div></div>
							<div></div>
							<div>Due Today</div>
						</div>
						<div className="table-upcoming">
							<div>$650</div>
							<div>1 month after invoice (TBD)</div>
							<div></div>
							<div></div>
							<div>Upcoming</div>
						</div>
					</div>
				</div> */}
			</div>
		);
	}
}
