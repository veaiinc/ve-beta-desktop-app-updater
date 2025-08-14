import React, { Component } from 'react';
import ImageItem from '../../elements/image';
import Text from '../../elements/text';
// import Down from '../actions/down.jsx';
// import Up from '../actions/up.jsx';
import Delete from '../actions/delete.jsx';
import Down from '../actions/down.jsx';
import Up from '../actions/up.jsx';

import Edit from '../actions/edit.jsx';
import Copy from '../actions/copy.jsx';
import { message } from 'antd/lib';
import _ from 'lodash';
class ServiceItem extends Component {
	constructor(props) {
		super(props);
		this.state = {
			preview: props.preview,
			previewType: props.previewType,
			client: props.client,
			style: props.style,
			showSubBlockOptions: false,
			showSubBlockBorder: false,
			block: props.block,
			sectionID: props.sectionID,
			textSelection: false,
			actionType: props.actionType,
			actionValue: props.actionValue,
			index: props.index,
			restrictServiceSelection: props?.restrictServiceSelection,
			activeVariableID: props.activeVariableID,
			activeVariableName: props.activeVariableName,
			variables: props.variables,
			triggerFont: props.triggerFont,
			socialMediaLinks: props.socialMediaLinks,
		};
		this.blocksRef = React.createRef();
		this.imgRef = React.createRef();
	}
	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside);
	};
	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.state.block !== nextProps.block) {
			this.setState({
				block: nextProps.block,
			});
		}
		if (this.state.preview !== nextProps.preview) {
			this.setState({
				preview: nextProps.preview,
			});
		}
		if (JSON.stringify(this.state.block) !== JSON.stringify(nextProps.block)) {
			this.setState({
				block: nextProps.block,
			});
		}
		if (this.state.socialMediaLinks !== nextProps.socialMediaLinks) {
			this.setState({
				socialMediaLinks: nextProps.socialMediaLinks,
			});
		}
		if (this.state.triggerFont !== nextProps.triggerFont) {
			this.setState({
				triggerFont: nextProps.triggerFont,
			});
		}
		if (this.state.previewType !== nextProps.previewType) {
			this.setState({
				previewType: nextProps.previewType,
			});
		}
		if (this.state.client !== nextProps.client) {
			this.setState({
				client: nextProps.client,
			});
		}
		if (this.state.style !== nextProps.style) {
			this.setState({
				style: nextProps.style,
			});
		}
		if (
			this.state.block?.subBlocks?.[0]?.quantity !== nextProps.block?.subBlocks?.[0]?.quantity
		) {
			this.setState({
				block: nextProps.block,
			});
		}
		if (this.state.sectionID !== nextProps.sectionID) {
			this.setState({
				sectionID: nextProps.sectionID,
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
		if (this.state.index !== nextProps.index) {
			this.setState({
				index: nextProps.index,
			});
		}
		if (this.state.restrictServiceSelection !== nextProps.restrictServiceSelection) {
			this.setState({
				restrictServiceSelection: nextProps.restrictServiceSelection,
			});
		}

		if (this.state.activeVariableID !== nextProps.activeVariableID) {
			this.setState({
				activeVariableID: nextProps.activeVariableID,
			});
		}
		if (this.state.activeVariableName !== nextProps.activeVariableName) {
			this.setState({
				activeVariableName: nextProps.activeVariableName,
			});
		}
		if (this.state.variables !== nextProps.variables) {
			this.setState({
				variables: nextProps.variables,
			});
		}
	};
	handleClickOutside = (event) => {
		// this.props.setPreviewType('b');
		if (this.blocksRef.current && !this.blocksRef.current.contains(event.target)) {
			this.setState({
				showSubBlockOptions: false,
				showSubBlockBorder: false,
			});
			if (document.activeElement instanceof HTMLElement) {
				document.activeElement.blur();
			}
			const selection = window.getSelection();
			if (selection) {
				selection.removeAllRanges();
			}
		}
	};
	replaceWithServiceTag = (text) => {
		const hasTag = /<[^>]+>/.test(text);

		if (hasTag) {
			return text.replace(/<[^>]+>([^<]*)<\/[^>]+>/, '<service>$1</service>');
		} else {
			return `<service>${text}</service>`;
		}
	};
	renderTitle = () => {
		return (
			<Text
				isWorkflow={this.props.isWorkflow}
				text={this.replaceWithServiceTag(
					this.props.getRowValue('title', this.state.block._id, this.props.client),
				)}
				setTriggerFont={(e) => this.props.setTriggerFont(e)}
				triggerFont={this.state.triggerFont}
				setContent={(e) =>
					this.props.setRowValue(
						{
							target: {
								value: e,
							},
						},
						'title',
						this.state.block._id,
					)
				}
				setTab={(e) => this.props.handleSetTab(e)}
				handleSelection={(e, activeTextBlock) =>
					this.props.handleBSelection(e, activeTextBlock)
				}
				refID={this.state.block.subBlocks[0]._id}
				actionType={this.state.actionType}
				actionValue={this.state.actionValue}
				activeSubBlockId={this.state.block.subBlocks[0]._id}
				changeTextSelection={(val) => this.setState({ textSelection: val })}
				subBlockID={this.state.block.subBlocks[0]._id}
				reference={'servicesTitle' + this.state.index}
				isServiceItem={true}
				clearStyling={() => this.props.clearStyle()}
				activeVariableID={this.state.activeVariableID}
				activeVariableName={this.state.activeVariableName}
				variables={this.props.variables}
				currencySymbol={this.props.currencySymbol}
				clientGrandTotal={this.props.clientGrandTotal}
				module={'proposal'}
				preview={this.state.preview}
				client={this.state.client}
				theme={this.props?.themes}
			/>
		);
	};
	applyFontThemeStyles = (stylesObject) => {
		if (!stylesObject) return {};

		return Object.entries(stylesObject)
			.filter(([key]) => key !== 'activeFontID' && key !== 'lineHeight')
			.reduce((acc, [key, value]) => {
				// Convert camelCase to proper CSS property
				const cssKey = key
					.replace(/[A-Z]/g, (match) => `-${match?.toLowerCase()}`)
					.replace(/^-/, '');

				// Handle different value types
				let cssValue = value;
				if (typeof value === 'string') {
					if (key === 'fontFamily') {
						cssValue = value
							.split(',')
							.map((font) => {
								font = font.trim();
								return font.includes(' ') ? `"${font}"` : font;
							})
							.join(',');
					} else if (key === 'color' || cssKey.includes('color')) {
						cssValue = value.replace(/['"]/g, '').trim();
					} else {
						cssValue = value.replace(/['"]/g, '').trim();
					}
				}

				acc[cssKey] = cssValue;
				return acc;
			}, {});
	};
	render() {
		const getUpdatedSvg = (color) => {
			let svg = ` <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
			<g clip-path="url(#clip0_10312_92550)">
				<path opacity="0.2"
					d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
					fill="white" />
				<path d="M5.5 8.5L7 10L10.5 6.5" stroke="white" stroke-linecap="round"
					stroke-linejoin="round" />
				<path
					d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z"
					stroke="white" stroke-linecap="round" stroke-linejoin="round" />
			</g>
			<defs>
				<clipPath id="clip0_10312_92550">
					<rect width="16" height="16" fill="white" />
				</clipPath>
			</defs>
		</svg>`;

			const hasFill = /fill="[^"]*"/.test(svg);
			const hasStroke = /stroke="[^"]*"/.test(svg);
			if (hasFill) {
				svg = svg.replace(/fill="[^"]*"/g, (match) =>
					match.includes('none') ? match : `fill="${color}"`,
				);
			}
			if (hasStroke) {
				svg = svg.replace(/stroke="[^"]*"/g, (match) =>
					match.includes('none') ? match : `stroke="${color}"`,
				);
			}
			return svg;
		};

		return (
			<div
				key={this.state.index}
				className={`st-row ${
					// this.state.previewType === 'm' && this.state.client == true
					// 	? 'flex-direction-column-imp'
					// 	:
					_.has(this.state.style, 'services_style')
						? this.state.style.services_style !== 0
							? 'flex-direction-column-imp'
							: ''
						: ''
				} ${this.state.showSubBlockBorder ? 'borderedSubBlock' : ''}`}
				// onMouseEnter={() => {
				// 	if (this.state.preview !== true) {
				// 		this.setState({
				// 			showSubBlockBorder: true,
				// 		});
				// 	}
				// }}
				// onMouseLeave={() => {
				// 	this.setState({
				// 		showSubBlockBorder: false,
				// 	});
				// }}
				ref={this.blocksRef}
				onClick={(e) => {
					this.setState(
						{
							showSubBlockOptions: true,
							showSubBlockBorder: true,
						},
						() => {
							// ! commented for making it active on every clixk
							if (
								// 	!this.state.textSelection &&
								// 	this.state.client == false &&
								// 	this.imgRef.current &&
								// 	!this.imgRef.current.contains(event.target)
								!this.props?.client
							) {
								this.props.serviceTableSubBlock(this.state.block._id);
							}
						},
					);
				}}
			>
				<div
					className="image"
					style={{
						width: _.has(this.state.style, 'services_style')
							? this.state.style.services_style !== 0 ||
							  (this.state.previewType === 'm' && this.state.client == true)
								? '100%'
								: 136
							: 136,
						height: 136,
						display: this.props.returnDisplayItemSub('image', this.state.block._id),
					}}
					ref={this.imgRef}
				>
					<ImageItem
						style={{
							width: _.has(this.state.style, 'services_style')
								? this.state.style.services_style !== 0 ||
								  (this.state.previewType === 'm' && this.state.client == true)
									? '100%'
									: 136
								: 136,
							height: 136,
							...(this.props?.customisedImageStylesForPresentation || ''),
						}}
						crop={this.state.crop}
						zoom={this.state.zoom}
						preview={this.state.preview}
						previewType={this.state.previewType}
						imageUrl={
							this.state.block.subBlocks[0].imageURL
								? this.state.block.subBlocks[0].imageURL
								: null
						}
						imageSettings={this.state.block.subBlocks[0].image_settings}
						setActiveImage={(e) =>
							this.props.activeImage(
								this.state.sectionID,
								this.state.block._id,
								this.state.block.subBlocks[0]._id,
								this.state.block.subBlocks[0].imageURL,
								e,
							)
						}
						settingData={(e) =>
							this.props.imgSettingData(this.state.block.subBlocks[0].image_settings)
						}
						activeSubBlockId={this.state.activeSubBlockId}
						refID={
							this.state.block.subBlocks[0]._id
								? this.state.block.subBlocks[0]._id
								: null
						}
					/>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						height: '100%',
						justifyContent: 'space-between',
					}}
				>
					<div
						className="title-desc"
						style={{
							height:
								this.props.returnDisplayItemSub('image', this.state.block._id) ===
								'none'
									? 'fit-content'
									: _.has(this.state.style, 'services_style')
									? this.state.style.services_style !== 0 ||
									  (this.state.previewType === 'm' && this.state.client == true)
										? 'fit-content'
										: 'fit-content'
									: 'fit-content',
							width: this.state.style.services_style !== 0 ? '100%' : '',
						}}
					>
						<a
							className="title"
							style={{
								display: this.props.returnDisplayItemSub(
									'title',
									this.state.block._id,
								),
								...this.applyFontThemeStyles({
									...this.props?.themes?.fonts?.event?.eventTitle,
									...this.props?.themes?.colors?.event?.eventTitle,
								}),
								...(this.state.previewType === 'm'
									? {
											...this.applyFontThemeStyles({
												...this.props?.themes?.mobileFonts?.event
													?.eventTitle,
											}),
									  }
									: {}),
							}}
						>
							{this.state.preview && this.props.client
								? this.props.getRowValue('title', this.state.block._id, true) !== ''
									? this.renderTitle()
									: ''
								: this.renderTitle()}
						</a>

						<span
							className="description"
							style={{
								display: this.props.returnDisplayItemSub(
									'paragraph',
									this.state.block._id,
								),
								marginBottom: 10,
								...this.applyFontThemeStyles({
									...this.props?.themes?.fonts?.p,
									...this.props?.themes?.colors?.text?.p,
								}),
								...(this.state.previewType === 'm'
									? {
											...this.applyFontThemeStyles({
												...this.props?.themes?.mobileFonts?.p,
											}),
									  }
									: {}),
							}}
						>
							<Text
								isWorkflow={this.props.isWorkflow}
								text={
									this.state.preview && this.props.client
										? this.props.getRowValue(
												'description',
												this.state.block._id,
												true,
										  )
										: `${
												this.props.getRowValue(
													'description',
													this.state.block._id,
												) || '<p>description</p>'
										  }`
								}
								setTriggerFont={(e) => this.props.setTriggerFont(e)}
								triggerFont={this.state.triggerFont}
								setContent={(e) => {
									this.props.setRowValue(
										{
											target: {
												value: e,
											},
										},
										'description',
										this.state.block._id,
									);
								}}
								setTab={(e) => this.props.handleSetTab(e)}
								handleSelection={(e, activeTextBlock) =>
									this.props.handleBSelection(e, activeTextBlock)
								}
								actionType={this.state.actionType}
								actionValue={this.state.actionValue}
								activeSubBlockId={this.state.block.subBlocks[0]._id}
								refID={this.state.block._id + 'desc'}
								subBlockID={this.state.block._id + 'desc'}
								reference={'servicesDesc' + this.props.index}
								isServiceItem={true}
								clearStyling={() => this.props.clearStyle()}
								activeVariableID={this.state.activeVariableID}
								activeVariableName={this.state.activeVariableName}
								variables={this.props.variables}
								currencySymbol={this.props.currencySymbol}
								clientGrandTotal={this.props.clientGrandTotal}
								module={'proposal'}
								preview={this.state.preview}
								client={this.state.client}
								theme={this.props?.themes}
							/>
						</span>
					</div>
					<div
						className="quantity-cost-select"
						style={{
							height:
								this.props.returnDisplayItemSub('image', this.state.block._id) ===
								'none'
									? 'fit-content'
									: _.has(this.state.style, 'services_style')
									? this.state.style.services_style !== 0 ||
									  (this.state.previewType === 'm' && this.state.client == true)
										? 'fit-content'
										: 'fit-content'
									: 'fit-content',
							width: _.has(this.state.style, 'services_style')
								? this.state.style.services_style !== 0 ||
								  (this.state.previewType === 'm' && this.state.client == true)
									? '100%'
									: 'fit-content'
								: 'fit-content',
							marginTop: 'auto',
						}}
					>
						<div className="qc">
							{this.state.client || this.props.isWorkflow ? (
								<>
									<div
										className="quantity"
										style={{
											color: this.state.block?.pricingFontColor,
										}}
									>
										{(this.state.preview && this.props.client) ||
										this.props.isWorkflow ? (
											<a
												style={{
													background: `${
														this.state.block?.pricingFontColor
													}${Math.round(0.12 * 255).toString(16)}`,
													border: `1px solid ${this.state.block?.pricingFontColor}`,
													display: this.props.returnDisplayItemSub(
														'quantity',
														this.state.block._id,
													),
												}}
											>
												{this.state.block.canClientCustomiseQuantity &&
												this.state.block.canClientCustomiseQuantity ==
													true ? (
													<span
														onClick={() => {
															if (
																this.props.preview ||
																this.props.isWorkflow
															) {
																this.props.handleServiceSelect(
																	this.state.block._id,
																	'quantity',
																	'decrease',
																);
															}
														}}
													>
														-
													</span>
												) : (
													''
												)}
												{window?.location?.pathname?.includes('/workflow')
													? this.state.block.subBlocks[0].quantity
													: this.props.getRowValue(
															'quantity',
															this.state.block._id,
													  )}
												{this.state.block.canClientCustomiseQuantity &&
												this.state.block.canClientCustomiseQuantity ==
													true ? (
													<span
														onClick={() => {
															if (
																this.props.preview ||
																this.props.isWorkflow
															) {
																this.props.handleServiceSelect(
																	this.state.block._id,
																	'quantity',
																	'increase',
																);
															}
														}}
													>
														+
													</span>
												) : (
													''
												)}
											</a>
										) : (
											1
										)}
										<span
											style={{
												display: this.props.returnDisplayItemSub(
													'quantity',
													this.state.block._id,
												),
											}}
										>
											{!this.state.block.subBlocks[0]?.unit ||
											this.state.block.subBlocks[0]?.unit === 'none'
												? `Quantity: ${
														window?.location?.pathname?.includes(
															'/workflow',
														)
															? this.state.block.subBlocks[0].quantity
															: this.props.getRowValue(
																	'quantity',
																	this.state.block._id,
															  )
												  }`
												: this.state.block.subBlocks[0].unit + '(s),'}
										</span>
										{/* {this.props.showUnitPrice
											? ', ' +
											  (this.state.block.subBlocks[0]?.amount || '') +
											  (this.state.block.subBlocks[0].unit ? '/' : '') +
											  (this.state.block.subBlocks[0]?.unit || '')
											: ''} */}
										{this.props.showUnitPrice &&
										this.state.block.subBlocks[0].unit !== 'none'
											? (this.state.block.subBlocks[0]?.amount || '0') +
											  (this.state.block.subBlocks[0].unit ? '/' : '') +
											  (this.state.block.subBlocks[0]?.unit || '')
											: ''}
									</div>

									<div
										className="cost"
										style={{
											display: this.props.returnDisplayItemSub(
												'price',
												this.state.block._id,
											),
											color: this.state.block?.pricingFontColor,
										}}
									>
										{this.props?.client ? (
											<span
												style={{
													...this.applyFontThemeStyles({
														...this.props?.themes?.fonts?.p,
														...this.props?.themes?.colors?.text?.p,
													}),
												}}
											>
												<span style={{ marginRight: 2 }}>
													{this.props.currencySymbol}
												</span>
												{Number(
													this.state.block.subBlocks[0]?.amount || 0,
												) *
													Number(
														this.props.getRowValue(
															'quantity',
															this.state.block._id,
														) || 1,
													)}
											</span>
										) : (
											<span
												style={{
													...this.applyFontThemeStyles({
														...this.props?.themes?.fonts?.p,
														...this.props?.themes?.colors?.text?.p,
													}),
												}}
											>
												<span style={{ marginRight: 2 }}>
													{this.props.builderCurrencySymbol}
												</span>
												{Number(this.state.block.subBlocks[0].amount || 0) *
													Number(
														this.state.block.subBlocks[0].quantity || 1,
													)}
											</span>
										)}
									</div>
								</>
							) : (
								<>
									{this.state.block.subBlocks[0].unit &&
									this.state.block.subBlocks[0].unit !== '' ? (
										<div
											className="quantity"
											style={{
												color: this.state.block?.pricingFontColor,
												...this.applyFontThemeStyles({
													...this.props?.themes?.fonts?.p,
													...this.props?.themes?.colors?.text?.p,
												}),
												...(this.state.previewType === 'm'
													? {
															...this.applyFontThemeStyles({
																...this.props?.themes?.mobileFonts
																	?.p,
															}),
													  }
													: {}),
											}}
										>
											<span
												style={{
													display: this.props.returnDisplayItemSub(
														'quantity',
														this.state.block._id,
													),
												}}
											>
												{this.state.block.subBlocks[0]?.unit === 'none' ? (
													`Quantity: ${this.state.block.subBlocks[0]?.quantity}`
												) : (
													<>
														{this.state.block.subBlocks[0]?.quantity +
															' '}
														{this.state.block.subBlocks[0]?.unit}
														{this.props.showUnitPrice
															? ', ' +
															  (this.state.block.subBlocks[0]
																	?.amount || '') +
															  (this.state.block.subBlocks[0].unit
																	? '/'
																	: '') +
															  (this.state.block.subBlocks[0]
																	?.unit || '')
															: ''}
													</>
												)}
											</span>
										</div>
									) : (
										<div
											className="quantity"
											style={{
												display: this.props.returnDisplayItemSub(
													'quantity',
													this.state.block._id,
												),
												color: this.state.block?.pricingFontColor,
											}}
										>
											Quantity: {this.state.block.subBlocks[0]?.quantity}
										</div>
									)}

									<div
										className="cost"
										style={{
											display: this.props.returnDisplayItemSub(
												'price',
												this.state.block._id,
											),
											color: this.state.block?.pricingFontColor,
											...this.applyFontThemeStyles({
												...this.props?.themes?.fonts?.p,
												...this.props?.themes?.colors?.text?.p,
											}),
											...(this.state.previewType === 'm'
												? {
														...this.applyFontThemeStyles({
															...this.props?.themes?.mobileFonts?.p,
														}),
												  }
												: {}),
										}}
									>
										<>
											{this.state.socialMediaLinks?.currency === 'USD'
												? '$'
												: '₹'}

											{parseInt(this.state.block.subBlocks[0].amount) *
												parseInt(
													this.state.block.subBlocks[0].quantity || 1,
												)}
										</>
									</div>
								</>
							)}
						</div>
						{this.state.style.services_selection !== 2 &&
						!this.state?.block?.hideButton ? (
							<div
								className={`button ${
									this.props.getRowValue('isSelected', this.state.block._id)
										? 'selected'
										: ''
								}`}
								style={{
									width: _.has(this.state.style, 'services_style')
										? this.state.style.services_style !== 0 ||
										  (this.state.previewType === 'm' &&
												(this.state.client == true ||
													this.props.isWorkflow))
											? '100%'
											: ''
										: '',
									cursor:
										this.props.client || this.props.isWorkflow ? 'pointer' : '',
									backgroundColor: this.state.block?.buttonBackgroundColor,
									color: this.state.block?.buttonFontColor,
								}}
								onClick={() => {
									if (navigator?.vibrate) {
										navigator?.vibrate(200);
									}
									if (this.props.preview || this.props.isWorkflow) {
										if (this.state?.restrictServiceSelection) {
											return message.error(
												`This file is not  any more editable,as current status is ${this.props.status}`,
											);
										}
										this.props.handleServiceSelect(
											this.state.block._id,
											'isSelected',
											null,
										);
									}
								}}
							>
								{this.props.getRowValue('isSelected', this.state.block._id) ==
								true ? (
									<span>
										{' '}
										Selected
										<div
											className="selected-svg"
											style={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
											}}
											dangerouslySetInnerHTML={{
												__html: getUpdatedSvg(
													this.state.block?.buttonFontColor || 'white',
												),
											}}
										></div>
									</span>
								) : (
									<span> Select </span>
								)}
							</div>
						) : (
							''
						)}
					</div>
				</div>

				{this.state.showSubBlockOptions &&
				(this.state.preview == false || this.props.isWorkflow) ? (
					<div
						className="block-action-bar"
						style={{
							right: this.props.activeModule?.showAsA4 == true ? '0px' : '-85px',
							left: this.props.activeModule?.showAsA4 == true && '0px',
							top: this.props.activeModule?.showAsA4 == true && '-45px',
						}}
					>
						<span
							className="tooltip"
							onClick={(e) =>
								this.state.client
									? ''
									: this.props.serviceTableSubBlock(this.state.block._id)
							}
						>
							<Edit />
							<label className="tooltip-text">Block&nbsp;Settings</label>
						</span>
						<span
							className="tooltip"
							onClick={(e) => this.props.handleDuplicateServiceBlock(e)}
						>
							<Copy />
							<label className="tooltip-text">Duplicate</label>
						</span>
						{this.props.index > 0 && (
							<span
								className="tooltip"
								onClick={(e) => this.props.handleMoveServiceBlock('up')}
							>
								<Up />
								<label className="tooltip-text">Up</label>
							</span>
						)}
						{this.props.index < this.props.itemsLength - 1 && (
							<span
								className="tooltip"
								onClick={(e) => this.props.handleMoveServiceBlock('down')}
							>
								<Down />
								<label className="tooltip-text">Down</label>
							</span>
						)}
						<span
							className="tooltip"
							onClick={(e) =>
								this.props.handleDeleteServiceBlock(
									this.state.block._id,
									this.state.sectionID,
								)
							}
						>
							<Delete />
							<label className="tooltip-text">Delete</label>
						</span>
					</div>
				) : (
					''
				)}
			</div>
		);
	}
}

export default ServiceItem;
