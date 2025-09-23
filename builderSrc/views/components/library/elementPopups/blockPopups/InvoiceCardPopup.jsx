import React from 'react';
import { ReactComponent as UploadFile } from '../../svgs/uploadFile.svg';

import { ReactComponent as GridGap } from '../../svgs/gridGap.svg';
import { ReactComponent as GridNoGap } from '../../svgs/gridNoGap.svg';
import { ReactComponent as RowGap } from '../../svgs/rowHeight.svg';
import { ReactComponent as ColumnGap } from '../../svgs/coloumGap.svg';
import { ReactComponent as Positive } from '../../svgs/positive.svg';
import { ReactComponent as Negative } from '../../svgs/negative.svg';

import { ReactComponent as RightArrow } from '../../svgs/dropDown.svg';
import ColorPicker from '../../../properties/colorpicker';
import '../elementPopup.scss';

// Image for Api

import Images from '../../../../../controllers/images';
import randomize from 'randomatic';

// modal for library

import Modal from '../../modals/index';
import ImageLibrary from '../../../imageLibrary';

// cropper for image
import Cropper from 'react-easy-crop';
import { ReactComponent as Delete } from '../../svgs/delete.svg';
import ObjectID from 'bson-objectid';
import _ from 'lodash';
export default class InvoiceCardPopup extends Images {
	constructor(props) {
		super(props);
		this.state = {
			active: 'b',
			overlayEffect: false,
			activeComponent: props?.activeComponent || {},
			showImageProgressBar: false,
			uploadBatchID: randomize('Aa0', 10),
			interval: null,
			progressCount: 0,
			uploadedImageURL: null,
			showImageModal: false,
			debounceCropperValues: null,
			activeModuleId: props?.activeModuleId,
			isCustomGrid: false, // Add this new state

			activeBgtype: props?.activeComponent?.style?.backgroundType || 'background',
			showTaxes: true,
			showDiscounts: false,
			debounceStateForInputs: null,
		};

		this.fileInputRef = React.createRef();
		this.cropperRef = React.createRef();
		// this.handleFileChange = this.handleFileChange.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeComponent !== this.state.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
				activeBgtype: nextProps?.activeComponent?.style?.backgroundType,
			});
		}
		if (nextProps?.activeModuleId !== this.state?.activeModuleId) {
			this.setState({
				activeModuleId: nextProps?.activeModuleId,
			});
		}
	}
	handleActive = (type) => {
		// this.setState({
		// 	active: type,
		// });
		this.setState(
			{
				active: type,
				activeBgtype: type === 'b' ? 'background' : this.state.activeBgtype,
			},
			() => {
				if (type === 'b') {
					this.handleActiveCardStyles('backgroundType', 'background');
				}
			},
		);
	};

	//! file/image upload functions
	handleDivClick = (e) => {
		if (this.fileInputRef.current) {
			this.fileInputRef.current.click();
		}
	};
	handleCustomGrid = () => {
		this.setState({ isCustomGrid: true }, () => {
			this.handleGridGapCustom(0, 'rowGap');
			this.handleGridGapCustom(0, 'columnGap');
		});
	};

	handleFileChange = async (event, uploadAIImage = false) => {
		let file;
		if (uploadAIImage) {
			this.setState({
				activeImageURL: null,
			});
			try {
				// Handle both full data URL and raw base64 string
				const base64Data = event.includes('data:') ? event.split(';base64,').pop() : event;

				// Validate base64 string
				if (!base64Data || !/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
					throw new Error('Invalid base64 string');
				}

				const byteCharacters = atob(base64Data);
				const byteArrays = [];

				for (let offset = 0; offset < byteCharacters.length; offset += 512) {
					const slice = byteCharacters.slice(offset, offset + 512);
					const byteNumbers = new Array(slice.length);

					for (let i = 0; i < slice.length; i++) {
						byteNumbers[i] = slice.charCodeAt(i);
					}

					const byteArray = new Uint8Array(byteNumbers);
					byteArrays.push(byteArray);
				}

				const blob = new Blob(byteArrays, { type: 'image/jpeg' });
				file = new File([blob], 'ai-generated-image.jpg', { type: 'image/jpeg' });
			} catch (error) {
				return;
			}
		} else {
			file = event.target.files[0];
		}

		if (file) {
			this.setState({ showImageProgressBar: true }, () => {
				this.startCounting();
			});

			let json = {
				uploadBatchId: this.state.uploadBatchID,
				originalFileName: uploadAIImage ? 'ai-generated-image.jpg' : file?.name,
				originalDateTime: uploadAIImage ? moment().unix() : file?.lastModified,
			};

			let res = null;

			if (this.props?.isWorkflow) {
				res = await this.uploadImageWorkflow(json, file, {
					module: this.props.module,
					activeWorkflowModuleId: this.props.activeWorkflowModuleId,
				});
			} else {
				res = await this.uploadImage(json, file);
			}

			this.setState({
				uploadedImageURL: res[1],
			});

			let interval = setInterval(() => this.getUploadStatus(res[0]), 3000);
			this.setState({
				interval: interval,
			});
		}
	};
	getUploadStatus = async (imageID) => {
		let res = await this.getImageUploadStatus(this.state.uploadBatchID);
		if (res.processedCount === 1 && res.uploadedCount === 1) {
			clearInterval(this.state.interval);
			//this.props.getImages();
			//this.props.saveImage(imageID, this.state.originalHeight, this.state.originalWidth);
			this.setState(
				{
					interval: null,
					progressCount: 0,
					showImageProgressBar: false,
					activeImageURL: this.state.uploadedImageURL,
					uploadBatchID: randomize('Aa0', 10),
				},
				() => {
					// this.props.setImage(this.state.uploadedImageURL);
					this.handleActiveCardStyles('backgroundImageURL', this.state.uploadedImageURL);
				},
			);
		}
	};
	startCounting = () => {
		const duration = 2000; // 2 seconds
		const targetCount = 99;
		const interval = 10; // milliseconds
		const increment = targetCount / (duration / interval);

		this.intervalId = setInterval(() => {
			this.setState((prevState) => {
				const newCount = prevState.progressCount + increment;
				if (newCount >= targetCount) {
					clearInterval(this.intervalId);
					return { progressCount: targetCount };
				}
				return { progressCount: newCount };
			});
		}, interval);
	};

	//! grid layout related functions
	handleRowResizing = (value) => {
		let activeSection = { ...this.state.activeComponent };
		let lastGridValue = 0;
		if (activeSection?.blocks?.[0]?.subBlocks?.length > 0) {
			activeSection.blocks.forEach((block) => {
				block.subBlocks.forEach((subBlock) => {
					if (subBlock.divStyles?.gridArea) {
						const gridRowValue = parseInt(subBlock.divStyles.gridArea.split('/')[2]);
						lastGridValue = Math.max(lastGridValue, gridRowValue);
					}
				});
			});
		}
		if (this.props?.previewType == 'm') {
			if (
				lastGridValue - 1 <=
				this.state?.activeComponent?.blocks?.[0]?.divStyles?.mGridRows + value
			) {
				activeSection.blocks[0].divStyles.mGridRows =
					this.state?.activeComponent?.blocks?.[0]?.divStyles?.mGridRows + value;
			}
			if (
				lastGridValue - 1 <=
				this.state?.activeComponent?.blocks?.[0]?.divStyles?.mGridRows + value
			) {
				this.setState({ activeComponent: activeSection }, () => {
					this.props.handleCardPopupProps(this.state.activeComponent, true);
				});
				// this.props.fluidShowGrid('s');
			}
		} else {
			if (
				lastGridValue - 1 <=
				this.state?.activeComponent?.blocks?.[0]?.divStyles?.gridRows + value
			) {
				activeSection.blocks[0].divStyles.gridRows =
					this.state?.activeComponent?.blocks?.[0]?.divStyles?.gridRows + value;
			}
			if (
				lastGridValue - 1 <=
				this.state?.activeComponent?.blocks?.[0]?.divStyles?.gridRows + value
			) {
				this.setState({ activeComponent: activeSection }, () => {
					this.props.handleCardPopupProps(this.state.activeComponent, true);
				});
				// this.props.fluidShowGrid('s');
			}
		}
	};
	handleGridGap = (value) => {
		let activeSection = { ...this.state.activeComponent };
		activeSection.blocks[0].divStyles = {
			...activeSection.blocks[0].divStyles,
			rowGap: value,
			columnGap: value,
		};
		this.setState({ activeComponent: activeSection }, () => {
			this.props.handleCardPopupProps(this.state.activeComponent, true);
		});
	};

	handleGridGapCustom = (value, type) => {
		let activeSection = { ...this.state.activeComponent };
		activeSection.blocks[0].divStyles = {
			...activeSection.blocks[0].divStyles,
			[type]: value,
		};
		this.setState({ activeComponent: activeSection }, () => {
			this.props.handleCardPopupProps(this.state.activeComponent, true);
		});
	};

	// ! background related functions
	handleActiveCardStyles = (type, value, taxId = '') => {
		let newComponent = { ...this.state.activeComponent };
		const discountsProps = ['discount', 'showDiscount', 'isDiscountInPerc'];
		const taxesProps = ['tax', 'isTaxInPercentage', 'label', 'deleteTax'];
		const debounceTypes = ['discount', 'tax', 'label'];
		if (
			type == 'sectionBackgroundColor' ||
			type == 'backgroundImageURL' ||
			type == 'backgroundVideoURL' ||
			type == 'backgroundType' ||
			type == 'showDescription' ||
			type == 'showImage' ||
			type == 'showQuantity' ||
			type == 'showUnit' ||
			type == 'showUnitPrice'
		) {
			if (type == 'sectionBackgroundColor') {
				newComponent = {
					...newComponent,
					style: {
						...newComponent?.style,
						sectionBackgroundColor: value,
					},
				};
			} else if (type == 'backgroundImageURL') {
				newComponent = {
					...newComponent,
					style: {
						...newComponent?.style,
						backgroundImageURL: value,
						backgroundType: 'image',
					},
				};
			} else if (type == 'backgroundVideoURL') {
				newComponent = {
					...newComponent,
					style: {
						...newComponent?.style,
						backgroundVideoURL: value,
						backgroundType: 'video',
					},
				};
			} else if (
				type == 'showDescription' ||
				type == 'showImage' ||
				type == 'showQuantity' ||
				type == 'showUnit' ||
				type == 'showUnitPrice'
			) {
				newComponent = {
					...newComponent,
					style: {
						...newComponent?.style,
						labels: {
							...newComponent?.style?.labels,
							[type]: value,
						},
					},
				};
			} else {
				newComponent = {
					...newComponent,
					style: {
						...newComponent?.style,
						backgroundType: value,
						sectionBackgroundColor: newComponent?.style?.sectionBackgroundColor || '',
					},
				};
			}
		} else if (type == 'addTax') {
			let newTax = {
				label: `TAX${newComponent?.style?.taxes?.length + 1 || 1}`,
				taxValue: '',
				isTaxInPercentage: true,
				tax: '10',
				taxType: `tax${newComponent?.style?.taxes?.length + 1 || 1}`,
				_id: ObjectID().toHexString(),
			};
			newComponent = {
				...newComponent,
				style: {
					...newComponent?.style,
					taxes: [
						...(newComponent?.style?.taxes || []),
						// { taxType: 'TAX', tax: '10', taxInPerc: true },
						newTax,
					],
				},
			};
		} else if (discountsProps.includes(type) || taxesProps.includes(type)) {
			if (taxesProps.includes(type)) {
				let newTaxes = [...(newComponent?.style?.taxes || [])];
				if (type == 'deleteTax') {
					newTaxes = newTaxes.filter((tax, i) => i !== taxId);
				} else {
					newTaxes[taxId] = { ...newTaxes[taxId], [type]: value };
				}
				newComponent = {
					...newComponent,
					style: {
						...newComponent?.style,
						taxes: newTaxes,
					},
				};
			} else {
				newComponent = {
					...newComponent,
					style: {
						...newComponent?.style,
						discounts: {
							...newComponent?.style?.discounts,
							[type]: value,
						},
					},
				};
			}
		} else {
			newComponent = {
				...newComponent,
				style: {
					...newComponent?.style,

					[type]: value,
				},
			};
		}

		this.setState(
			{ activeComponent: newComponent, activeBgtype: newComponent?.style?.backgroundType },
			() => {
				if (debounceTypes.includes(type)) {
					this.debounceFuncForInputs(() => {
						this.props?.handleCardPopupProps(newComponent, true, false);
					}, 700);
				} else {
					this.props?.handleCardPopupProps(
						newComponent,
						type == 'bgOverlayOpacity' ||
							type == 'verticalPadding' ||
							type == 'backgroundVideoURL'
							? true
							: false,
						type == 'verticalPadding' ? true : false,
					);
				}
			},
		);
	};
	handleGlobalShowLabel = (type, value) => {
		let newComponent = { ...this.state.activeComponent };
		newComponent = {
			...newComponent,
			style: {
				...newComponent?.style,
				labels: { ...newComponent?.style?.labels, [type]: value },
			},
		};

		this.setState({ activeComponent: newComponent }, () => {
			this.props?.handleCardPopupProps(newComponent);
		});
	};

	// ! bgvideo related functions
	handleVideoProps = (type, value) => {
		let newComponent = { ...this.state.activeComponent };

		newComponent = {
			...newComponent,
			style: {
				...newComponent?.style,
				videoProps: {
					...newComponent?.style?.videoProps,
					[type]: value,
				},
			},
		};

		this.setState({ activeComponent: newComponent }, () => {
			this.props?.handleCardPopupProps(newComponent, true, false);
		});
	};

	// debouncing function for inputs
	debounceFuncForInputs = (func, delay = 800) => {
		if (this.state?.debounceStateForInputs) {
			clearTimeout(this.state?.debounceStateForInputs);
		}
		const debounceFunc = setTimeout(() => {
			func();
		}, delay);
		this.setState({ debounceStateForInputs: debounceFunc });
	};

	handleInvoiceCardStyles = (type, value) => {
		let newComponent = { ...this.state.activeComponent };
		newComponent = {
			...newComponent,
			style: {
				...newComponent?.style,
				[type]: value,
			},
		};
		this.setState({ activeComponent: newComponent }, () => {
			this.props?.handleCardPopupProps(newComponent);
		});
	};
	render() {
		return (
			<div
				className="elementPopupContainer"
				style={{
					height: '425px',
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						padding: '12px 0px',
					}}
					className="elementPopupHeader"
				>
					{/* <p
						className={this.state.active === 'c' ? 'active' : ''}
						onClick={() => this.handleActive('c')}
					>
						Card
					</p>*/}
					<p
						style={{ fontSize: '12px' }}
						className={this.state.active === 'b' ? 'active' : ''}
						onClick={() => this.handleActive('b')}
					>
						Background
					</p>
					<p
						style={{ fontSize: '12px' }}
						className={this.state.active === 'i' ? 'active' : ''}
						onClick={() => this.handleActive('i')}
					>
						Tax & Payment
					</p>
					<p
						style={{ fontSize: '12px' }}
						className={this.state.active === 'd' ? 'active' : ''}
						onClick={() => this.handleActive('d')}
					>
						Design
					</p>
				</div>
				<div className="element_image_container_main element-shapes-container">
					{this.state?.active == 'c' ? (
						<div className="card-tab-wrapper">
							<div className="card-tab-container">
								<div className="heading">Row Count</div>
								<div className="row-increament">
									<div
										className="row-resizeButtons"
										onClick={() => this.handleRowResizing(-1)}
									>
										<Negative />
									</div>
									<div
										className="row-number"
										style={{
											cursor: 'not-allowed',
											userSelect: 'none',
											WebkitUserSelect: 'none',
											msUserSelect: 'none',
											MozUserSelect: 'none',
										}}
									>
										{this.props?.previewType == 'm'
											? this.state?.activeComponent?.blocks?.[0]?.divStyles
													?.mGridRows
											: this.state?.activeComponent?.blocks?.[0]?.divStyles
													?.gridRows}
									</div>
									<div
										className="row-resizeButtons"
										onClick={() => this.handleRowResizing(1)}
									>
										<Positive />
									</div>
								</div>
							</div>
							<div
								className="card-tab-container card-tab-column-container"
								style={{ marginTop: '10px' }}
							>
								<b className="heading">Grid Spacing</b>
								<div className="grid-spacing-settings">
									<p
										className={`grid-settings-item ${
											!this.state.isCustomGrid &&
											this.state.activeComponent?.blocks?.[0]?.divStyles
												?.rowGap === 10 &&
											this.state.activeComponent?.blocks?.[0]?.divStyles
												?.columnGap === 10
												? 'active'
												: ''
										}`}
									>
										<GridGap
											onClick={() => {
												this.setState({ isCustomGrid: false });
												this.handleGridGap(10);
											}}
										/>
									</p>
									<p
										className={`grid-settings-item ${
											!this.state.isCustomGrid &&
											this.state.activeComponent?.blocks?.[0]?.divStyles
												?.rowGap === 0 &&
											this.state.activeComponent?.blocks?.[0]?.divStyles
												?.columnGap === 0
												? 'active'
												: ''
										}`}
									>
										<GridNoGap
											onClick={() => {
												this.setState({ isCustomGrid: false });
												this.handleGridGap(0);
											}}
										/>
									</p>
									<p
										className={`grid-Custom ${
											this.state.isCustomGrid ? 'active' : ''
										}`}
										onClick={this.handleCustomGrid}
									>
										Custom
									</p>
								</div>
							</div>

							{this.state.isCustomGrid && (
								<>
									<div className="card-tab-container">
										<div
											className="popup-shapes-range-wrapper"
											style={{ width: '100%', marginTop: '10px' }}
										>
											<div
												className="popup-range-div"
												style={{ width: '100%' }}
											>
												<div className="row-gap-icon">
													<RowGap />
												</div>
												<div style={{ display: 'flex', maxWidth: 170 }}>
													<input
														type="range"
														min={0}
														max={50}
														step={1}
														value={
															this.state.activeComponent?.blocks?.[0]
																?.divStyles?.rowGap
														}
														onChange={(e) =>
															this.handleGridGapCustom(
																e.target.value,
																'rowGap',
															)
														}
													/>
												</div>
												<p style={{ textAlign: 'center' }}>
													{
														this.state?.activeComponent?.blocks?.[0]
															?.divStyles?.rowGap
													}
													px
												</p>
											</div>
										</div>
									</div>
									<div className="card-tab-container">
										<div
											className="popup-shapes-range-wrapper"
											style={{ width: '100%', marginTop: '10px' }}
										>
											<div
												className="popup-range-div"
												style={{ width: '100%' }}
											>
												<div className="row-gap-icon">
													<ColumnGap />
												</div>
												<div style={{ display: 'flex', maxWidth: 170 }}>
													<input
														type="range"
														min={0}
														max={50}
														step={1}
														value={
															this.state.activeComponent?.blocks?.[0]
																?.divStyles?.columnGap
														}
														onChange={(e) =>
															this.handleGridGapCustom(
																e.target.value,
																'columnGap',
															)
														}
													/>
												</div>
												<p style={{ textAlign: 'center' }}>
													{
														this.state?.activeComponent?.blocks?.[0]
															?.divStyles?.columnGap
													}
													px
												</p>
											</div>
										</div>
									</div>
								</>
							)}

							<div className="line"></div>
							<div className="popup-shapes-range-wrapper">
								<b>Vertical Padding</b>
								<div className="popup-range-div">
									<div
										style={{
											display: 'flex',
											maxWidth: 170,
										}}
									>
										<input
											type="range"
											min={0}
											max={100}
											step={1}
											value={
												this.state?.activeComponent?.style?.verticalPadding
											}
											onChange={(e) =>
												this.handleActiveCardStyles(
													'verticalPadding',
													parseInt(e.target.value),
												)
											}
										/>
									</div>
									<p
										style={{
											textAlign: 'center',
										}}
									>
										{this.state?.activeComponent?.style?.verticalPadding}px
									</p>
								</div>
							</div>
						</div>
					) : this.state.active == 'i' ? (
						<div className="card-tab-wrapper">
							<div className="element_image">
								<div className="element_pasteURL" style={{ gap: '15px' }}>
									<div
										className="overlayEffectContainer"
										style={{ marginTop: '10px' }}
									>
										<div
											className="overlayEffectHeading"
											onClick={() =>
												this.setState({
													showTaxes: !this.state.showTaxes,
												})
											}
										>
											<p className="heading">Tax</p>
											<RightArrow
												style={{
													transform: this.state.showTaxes
														? 'rotate(180deg)'
														: 'rotate(0deg)',
												}}
											/>
										</div>
									</div>

									{this.state.showTaxes && (
										<>
											{_.map(
												this.state?.activeComponent?.style?.taxes?.length >
													0 && this.state?.activeComponent?.style?.taxes,
												(taxItem, index) => {
													return (
														<>
															{index != 0 && (
																<div className="line"></div>
															)}
															<div
																className="input-icon-div"
																key={index}
															>
																<div
																	className="element_input"
																	style={{
																		flexDirection: 'row',
																		alignItems: 'center',
																		width: '100%',
																	}}
																>
																	<input
																		type="text"
																		placeholder="Enter Tax Type"
																		value={taxItem?.label}
																		onChange={(e) => {
																			this.handleActiveCardStyles(
																				'label',
																				e.target.value,
																				index,
																			);
																		}}
																		style={{
																			textTransform:
																				'uppercase',
																		}}
																	/>
																</div>
																<span
																	onClick={(e) => {
																		e.stopPropagation();
																		this.handleActiveCardStyles(
																			'deleteTax',
																			'delete',
																			index,
																		);
																	}}
																	className="delete-icon-span"
																>
																	<Delete />
																</span>
															</div>
															<div className="input-icon-div">
																<div
																	className="element_input"
																	style={{
																		flexDirection: 'row',
																		alignItems: 'center',
																		width: '100%',
																	}}
																>
																	<input
																		type="text"
																		placeholder="enter tax value"
																		value={taxItem?.tax}
																		onChange={(e) => {
																			const value =
																				e.target.value;
																			if (
																				value === '' ||
																				/^[0-9]*\.?[0-9]*$/.test(
																					value,
																				)
																			) {
																				if (
																					taxItem?.isTaxInPercentage &&
																					value > 100
																				) {
																					return;
																				} else {
																					this.handleActiveCardStyles(
																						'tax',
																						value,
																						index,
																					);
																				}
																			}
																		}}
																		maxLength={10}
																	/>
																</div>
																<div className="direct-perc-amount-span">
																	<span
																		className={
																			!taxItem?.isTaxInPercentage
																				? 'direct-perc-amount-span-active'
																				: ''
																		}
																		onClick={(e) => {
																			e.stopPropagation();
																			this.handleActiveCardStyles(
																				'isTaxInPercentage',
																				false,
																				index,
																			);
																		}}
																	>
																		{this.props
																			?.currencySymbol || '$'}
																	</span>
																	|{' '}
																	<span
																		className={
																			taxItem?.isTaxInPercentage
																				? 'direct-perc-amount-span-active'
																				: ''
																		}
																		onClick={(e) => {
																			e.stopPropagation();
																			this.handleActiveCardStyles(
																				'isTaxInPercentage',
																				true,
																				index,
																			);
																		}}
																	>
																		%
																	</span>
																</div>
															</div>
														</>
													);
												},
											)}
											{this.state?.activeComponent?.style?.taxes?.length !==
												3 && (
												<span
													style={{
														color: '#f1f1f1',
														cursor: 'pointer',
														fontSize: '14px',
														// fontWeight: 'bold',
														margin: '10px 0px',
													}}
													onClick={(e) => {
														e.stopPropagation();
														this.handleActiveCardStyles(
															'addTax',
															'add',
														);
													}}
												>
													+ Add Tax
												</span>
											)}
										</>
									)}
									<div
										className=" bs-item bs-item-row animated-item"
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											// margin: '20px 0px',
										}}
									>
										<b
										// style={{ textTransform: 'capitalize' }}
										>
											Discount
										</b>

										<label
											className="switch"
											onClick={() => {
												this.handleActiveCardStyles(
													'showDiscount',
													!this.state?.activeComponent?.style?.discounts
														?.showDiscount,
												);
											}}
										>
											<input
												type="checkbox"
												// onChange={(e) => {
												// 	e.preventDefault();
												// 	this.handleActiveStickerStyles(
												// 		'stretch',
												// 		e.target.checked,
												// 	);
												// }}
												checked={
													this.state?.activeComponent?.style?.discounts
														?.showDiscount ?? false
												}
											/>
											<span className="slider-round round"></span>
										</label>
									</div>
									{this.state?.activeComponent?.style?.discounts
										?.showDiscount && (
										<>
											<div className="input-icon-div">
												<div
													className="element_input"
													style={{
														flexDirection: 'row',
														alignItems: 'center',
														width: '100%',
													}}
												>
													<input
														type="text"
														inputMode="numeric"
														pattern="[0-9]*"
														placeholder="discount value"
														value={
															this.state?.activeComponent?.style
																?.discounts?.discount
														}
														onChange={(e) => {
															const value = e.target.value;
															if (
																value === '' ||
																/^[0-9]*\.?[0-9]*$/.test(value)
															) {
																if (
																	this.state?.activeComponent
																		?.style?.discounts
																		?.isDiscountInPerc &&
																	value > 100
																) {
																	return;
																} else {
																	this.handleActiveCardStyles(
																		'discount',
																		value,
																	);
																}
															}
														}}
														maxLength={10}
													/>
												</div>
												<div className="direct-perc-amount-span">
													<span
														className={
															!this.state?.activeComponent?.style
																?.discounts?.isDiscountInPerc
																? 'direct-perc-amount-span-active'
																: ''
														}
														onClick={(e) => {
															e.stopPropagation();
															this.handleActiveCardStyles(
																'isDiscountInPerc',
																false,
															);
														}}
													>
														{this.props?.currencySymbol || '$'}
													</span>
													|{' '}
													<span
														className={
															this.state?.activeComponent?.style
																?.discounts?.isDiscountInPerc
																? 'direct-perc-amount-span-active'
																: ''
														}
														onClick={(e) => {
															e.stopPropagation();
															this.handleActiveCardStyles(
																'isDiscountInPerc',
																true,
															);
														}}
													>
														%
													</span>
												</div>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					) : this.state?.active === 'd' ? (
						<div className="card-tab-wrapper">
							<div style={{ color: '#e8e8e8', fontSize: '14px', fontWeight: 'bold' }}>
								Labels
							</div>
							<div
								className=" bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									// margin: '20px 0px',
								}}
							>
								<b
								// style={{ textTransform: 'capitalize' }}
								>
									Description
								</b>

								<label
									className="switch"
									onClick={() => {
										this.handleGlobalShowLabel(
											'showDescription',
											this.state?.activeComponent?.style?.labels
												?.showDescription == undefined
												? false
												: !this.state?.activeComponent?.style?.labels
														?.showDescription,
										);
									}}
								>
									<input
										type="checkbox"
										// onChange={(e) => {
										// 	e.preventDefault();
										// 	this.handleActiveStickerStyles(
										// 		'stretch',
										// 		e.target.checked,
										// 	);
										// }}
										checked={
											this.state?.activeComponent?.style?.labels
												?.showDescription ?? true
										}
									/>
									<span className="slider-round round"></span>
								</label>
							</div>
							<div
								className=" bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									// margin: '20px 0px',
								}}
							>
								<b
								// style={{ textTransform: 'capitalize' }}
								>
									Image
								</b>

								<label
									className="switch"
									onClick={() => {
										this.handleGlobalShowLabel(
											'showImage',
											this.state?.activeComponent?.style?.labels?.showImage ==
												undefined
												? false
												: !this.state?.activeComponent?.style?.labels
														?.showImage,
										);
									}}
								>
									<input
										type="checkbox"
										// onChange={(e) => {
										// 	e.preventDefault();
										// 	this.handleActiveStickerStyles(
										// 		'stretch',
										// 		e.target.checked,
										// 	);
										// }}
										checked={
											this.state?.activeComponent?.style?.labels?.showImage ??
											true
										}
									/>
									<span className="slider-round round"></span>
								</label>
							</div>
							<div
								className=" bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									// margin: '20px 0px',
								}}
							>
								<b
								// style={{ textTransform: 'capitalize' }}
								>
									Quantity
								</b>

								<label
									className="switch"
									onClick={() => {
										this.handleGlobalShowLabel(
											'showQuantity',
											this.state?.activeComponent?.style?.labels
												?.showQuantity == undefined
												? false
												: !this.state?.activeComponent?.style?.labels
														?.showQuantity,
										);
									}}
								>
									<input
										type="checkbox"
										// onChange={(e) => {
										// 	e.preventDefault();
										// 	this.handleActiveStickerStyles(
										// 		'stretch',
										// 		e.target.checked,
										// 	);
										// }}
										checked={
											this.state?.activeComponent?.style?.labels
												?.showQuantity ?? true
										}
									/>
									<span className="slider-round round"></span>
								</label>
							</div>
							<div
								className=" bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									// margin: '20px 0px',
								}}
							>
								<b
								// style={{ textTransform: 'capitalize' }}
								>
									Unit
								</b>

								<label
									className="switch"
									onClick={() => {
										this.handleGlobalShowLabel(
											'showUnit',
											this.state?.activeComponent?.style?.labels?.showUnit ==
												undefined
												? false
												: !this.state?.activeComponent?.style?.labels
														?.showUnit,
										);
									}}
								>
									<input
										type="checkbox"
										// onChange={(e) => {
										// 	e.preventDefault();
										// 	this.handleActiveStickerStyles(
										// 		'stretch',
										// 		e.target.checked,
										// 	);
										// }}
										checked={
											this.state?.activeComponent?.style?.labels?.showUnit ??
											true
										}
									/>
									<span className="slider-round round"></span>
								</label>
							</div>
							<div
								className=" bs-item bs-item-row animated-item"
								style={{
									display: 'flex',
									justifyContent: 'space-between',
									// margin: '20px 0px',
								}}
							>
								<b
								// style={{ textTransform: 'capitalize' }}
								>
									Unit Price
								</b>

								<label
									className="switch"
									onClick={() => {
										this.handleGlobalShowLabel(
											'showUnitPrice',
											this.state?.activeComponent?.style?.labels
												?.showUnitPrice == undefined
												? false
												: !this.state?.activeComponent?.style?.labels
														?.showUnitPrice,
										);
									}}
								>
									<input
										type="checkbox"
										// onChange={(e) => {
										// 	e.preventDefault();
										// 	this.handleActiveStickerStyles(
										// 		'stretch',
										// 		e.target.checked,
										// 	);
										// }}
										checked={
											this.state?.activeComponent?.style?.labels
												?.showUnitPrice ?? true
										}
									/>
									<span className="slider-round round"></span>
								</label>
							</div>

							<div className="element_image">
								<div className="element_pasteURL" style={{ gap: '15px' }}>
									<div className="block_styles pad-color-p-imp">
										<ColorPicker
											title={'box 1 Background Color'}
											color={this.props?.activeComponent?.style?.Card1Color}
											handleColor={(e) =>
												this.handleInvoiceCardStyles('Card1Color', e)
											}
											brandColors={this.props?.brandColors}
											zoom={0.8}
											isDarkBg={true}
										/>
									</div>
								</div>
							</div>
							<div className="element_image">
								<div className="element_pasteURL" style={{ gap: '15px' }}>
									<div className="block_styles pad-color-p-imp">
										<ColorPicker
											title={'box 2 Background Color'}
											color={this.props?.activeComponent?.style?.Card2Color}
											handleColor={(e) =>
												this.handleInvoiceCardStyles('Card2Color', e)
											}
											brandColors={this.props?.brandColors}
											zoom={0.8}
											isDarkBg={true}
										/>
									</div>
								</div>
							</div>
							<div className="element_image">
								<div className="element_pasteURL" style={{ gap: '15px' }}>
									<div className="block_styles pad-color-p-imp">
										<ColorPicker
											title={'Primary Text Color'}
											color={this.props?.activeComponent?.style?.titleColor}
											handleColor={(e) =>
												this.handleInvoiceCardStyles('titleColor', e)
											}
											brandColors={this.props?.brandColors}
											zoom={0.8}
											isDarkBg={true}
										/>
									</div>
								</div>
							</div>
							<div className="element_image">
								<div className="element_pasteURL" style={{ gap: '15px' }}>
									<div className="block_styles pad-color-p-imp">
										<ColorPicker
											title={'Secondary Text Color'}
											color={this.props?.activeComponent?.style?.valueColor}
											handleColor={(e) =>
												this.handleInvoiceCardStyles('valueColor', e)
											}
											brandColors={this.props?.brandColors}
											zoom={0.8}
											isDarkBg={true}
										/>
									</div>
								</div>
							</div>
							<div className="padding-options-wrapper">
								<div className="padding-options-header">Vertical Padding</div>
								<div className="padding-options-item">
									<div
										className={`padding-one ${
											!_.has(this.props?.activeComponent?.style, 'padding') ||
											this.props?.activeComponent?.style?.padding === 0
												? 'active'
												: ''
										}`}
										onClick={() => this.handleInvoiceCardStyles('padding', 0)}
									>
										null
									</div>
									<div
										className={`padding-one ${
											this.props?.activeComponent?.style?.padding == 1
												? 'active'
												: ''
										}`}
										onClick={() => this.handleInvoiceCardStyles('padding', 1)}
									>
										S
									</div>
									<div
										className={`padding-one ${
											this.props?.activeComponent?.style?.padding == 2
												? 'active'
												: ''
										}`}
										onClick={() => this.handleInvoiceCardStyles('padding', 2)}
									>
										M
									</div>
									<div
										className={`padding-one ${
											this.props?.activeComponent?.style?.padding == 3
												? 'active'
												: ''
										}`}
										onClick={() => this.handleInvoiceCardStyles('padding', 3)}
									>
										L
									</div>
									<div
										className={`padding-one ${
											this.props?.activeComponent?.style?.padding == 4
												? 'active'
												: ''
										}`}
										onClick={() => this.handleInvoiceCardStyles('padding', 4)}
									>
										XL
									</div>
								</div>
							</div>
							<div className="padding-options-wrapper">
								<div className="padding-options-header">Horizontal Padding</div>
								<div className="padding-options-item">
									<div
										className={`padding-one ${
											!_.has(
												this.props?.activeComponent?.style,
												'paddingHorizontal',
											) ||
											this.props?.activeComponent?.style
												?.paddingHorizontal === 0
												? 'active'
												: ''
										}`}
										onClick={() =>
											this.handleInvoiceCardStyles('paddingHorizontal', 0)
										}
									>
										null
									</div>
									<div
										className={`padding-one ${
											this.props?.activeComponent?.style?.paddingHorizontal ==
											1
												? 'active'
												: ''
										}`}
										onClick={() =>
											this.handleInvoiceCardStyles('paddingHorizontal', 1)
										}
									>
										S
									</div>
									<div
										className={`padding-one ${
											this.props?.activeComponent?.style?.paddingHorizontal ==
											2
												? 'active'
												: ''
										}`}
										onClick={() =>
											this.handleInvoiceCardStyles('paddingHorizontal', 2)
										}
									>
										M
									</div>
									<div
										className={`padding-one ${
											this.props?.activeComponent?.style?.paddingHorizontal ==
											3
												? 'active'
												: ''
										}`}
										onClick={() =>
											this.handleInvoiceCardStyles('paddingHorizontal', 3)
										}
									>
										L
									</div>
									<div
										className={`padding-one ${
											this.props?.activeComponent?.style?.paddingHorizontal ==
											4
												? 'active'
												: ''
										}`}
										onClick={() =>
											this.handleInvoiceCardStyles('paddingHorizontal', 4)
										}
									>
										XL
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="card-tab-wrapper">
							{/* <div
								className="block_styles pad-color-p-imp"
								style={{ padding: '12px 0px' }}
							>
								<ColorPicker
									title={'Background Color'}
									color={
										this.state?.activeComponent?.style?.sectionBackgroundColor
									}
									handleColor={(e) =>
										this.handleActiveCardStyles('sectionBackgroundColor', e)
									}
									brandColors={this.props?.brandColors}
									zoom={0.8}
									isDarkBg={true}
								/>
							</div> */}
							<div className="line"></div>
							<div
								className="bg-types-container"
								style={{ justifyContent: 'space-evenly' }}
							>
								<span
									className={
										`bg-item ` +
										(this.state.activeBgtype === 'background'
											? ' active-bg-type'
											: '')
									}
									onClick={() =>
										this.setState({ activeBgtype: 'background' }, () => {
											this.handleActiveCardStyles(
												'backgroundType',
												'background',
											);
										})
									}
								>
									Color
								</span>
								<span
									className={
										`bg-item ` +
										(this.state.activeBgtype === 'image'
											? ' active-bg-type'
											: '')
									}
									onClick={() =>
										this.setState({ activeBgtype: 'image' }, () => {
											this.handleActiveCardStyles('backgroundType', 'image');
										})
									}
								>
									Image
								</span>
								<span
									className={
										`bg-item` +
										(this.state.activeBgtype === 'video'
											? ' active-bg-type'
											: '')
									}
									onClick={() =>
										this.setState({ activeBgtype: 'video' }, () => {
											this.handleActiveCardStyles('backgroundType', 'video');
										})
									}
								>
									Video
								</span>
							</div>
							{this.state?.activeBgtype == 'background' ? (
								<div className="element_image">
									<div className="element_pasteURL" style={{ gap: '15px' }}>
										<div
											className="block_styles pad-color-p-imp"
											style={{ padding: '12px 0px' }}
										>
											<ColorPicker
												title={'Background Color'}
												color={
													this.state?.activeComponent?.style
														?.sectionBackgroundColor
												}
												handleColor={(e) =>
													this.handleActiveCardStyles(
														'sectionBackgroundColor',
														e,
													)
												}
												brandColors={this.props?.brandColors}
												zoom={0.8}
												isDarkBg={true}
											/>
										</div>
									</div>
								</div>
							) : this.state?.activeBgtype == 'image' ? (
								<>
									{this.state?.activeComponent?.style?.backgroundImageURL ? (
										<div
											className="element_image"
											style={{ marginTop: '10px' }}
										>
											<div className="popup-cropper-container">
												<div className="crop-wrapper">
													<Cropper
														image={
															this.state?.activeComponent?.style
																?.backgroundImageURL
														}
														crop={{ x: 0, y: 0 }}
														zoom={2}
														aspect={3 / 2}
														onCropChange={(e) => ''}
														onCropComplete={(e) => ''}
														onZoomChange={(e) => ''}
														onCropAreaChange={(e) => ''}
														restrictPosition={true}
														ref={this.cropperRef}
													/>
													<span
														onClick={(e) =>
															this.handleActiveCardStyles(
																'backgroundImageURL',
																'',
															)
														}
													>
														<Delete />
													</span>
												</div>
											</div>
										</div>
									) : (
										<div
											className="element_image"
											style={{
												display: 'flex',
												flexDirection: 'column',
												gap: '10px',
											}}
										>
											<div className="element_block">
												<div
													className="image_input"
													style={{ display: 'none' }}
												>
													<input
														type="file"
														ref={this.fileInputRef}
														onChange={(e) => this.handleFileChange(e)}
														accept=".png, .jpg, .jpeg"
														id="fileInput"
														onClick={(e) => {
															e.stopPropagation();
														}}
													/>
												</div>

												<div
													className=""
													onClick={(e) => this.handleDivClick(e)}
												>
													{this.state.showImageProgressBar ? (
														<div className="image_progress_bar">
															<div
																className="count"
																style={{
																	color: '#7c7c84',
																}}
															>
																{parseInt(this.state.progressCount)}
																%
															</div>
															<div className="progress">
																<span
																	className="progress-b"
																	style={{
																		width: `${parseInt(
																			this.state
																				.progressCount,
																		)}%`,
																	}}
																></span>
																<span></span>
															</div>
														</div>
													) : (
														<div
															className="upload_image_block"
															style={{ gap: '10px' }}
														>
															<div className="">
																<UploadFile />
															</div>
															<div className="title">
																{' '}
																Upload Image
															</div>
															<div className="title">
																{' '}
																(Recommended 2000 x 2000 px)
															</div>
														</div>
													)}
												</div>
											</div>
										</div>
									)}
									<div className="element_image">
										<div className="element_or">
											<div className="ortext">Or</div>
											<div className="line"></div>
										</div>
										<div
											className="element_button"
											onClick={() =>
												this.setState({ showImageModal: true }, () => {
													this.props?.setModalRef(
														this.state.showImageModal,
													);
												})
											}
											style={{ cursor: 'pointer' }}
										>
											<span className="subheading"> Select from Library</span>
										</div>
									</div>
								</>
							) : this.state?.activeBgtype == 'video' ? (
								<div className="element_image">
									<div className="element_pasteURL" style={{ gap: '15px' }}>
										<p className="heading">Video URL</p>
										<p className="subheading">
											Paste the URL link of your YouTube or Vimeo hosted
											video.
										</p>

										<div
											className="element_input"
											style={{ flexDirection: 'row', alignItems: 'center' }}
										>
											<input
												type="text"
												name="videoURL"
												placeholder="https://..."
												value={
													this.state?.activeComponent?.style
														?.backgroundVideoURL
												}
												onChange={(e) =>
													this.handleActiveCardStyles(
														'backgroundVideoURL',
														e.target.value,
													)
												}
											/>
										</div>
										<div
											className="line"
											style={{
												border: '1px solid #333334',
												margin: '10px 0px',
											}}
										></div>
										<div
											className=" bs-item bs-item-row animated-item"
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												// margin: '20px 0px',
											}}
										>
											<b
											// style={{ textTransform: 'capitalize' }}
											>
												Mute video
											</b>

											<label
												className="switch"
												onClick={() => {
													this.handleVideoProps(
														'muteVideo',
														!this.state?.activeComponent?.style
															?.videoProps?.muteVideo,
													);
												}}
											>
												<input
													type="checkbox"
													// onChange={(e) => {
													// 	e.preventDefault();
													// 	this.handleActiveStickerStyles(
													// 		'stretch',
													// 		e.target.checked,
													// 	);
													// }}
													checked={
														this.state?.activeComponent?.style
															?.videoProps?.muteVideo ?? false
													}
												/>
												<span className="slider-round round"></span>
											</label>
										</div>
										<div
											className=" bs-item bs-item-row animated-item"
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												// margin: '20px 0px',
											}}
										>
											<b
											// style={{ textTransform: 'capitalize' }}
											>
												Video loop
											</b>

											<label
												className="switch"
												onClick={() => {
													this.handleVideoProps(
														'loop',
														!this.state?.activeComponent?.style
															?.videoProps?.loop,
													);
												}}
											>
												<input
													type="checkbox"
													// onChange={(e) => {
													// 	e.preventDefault();
													// 	this.handleActiveStickerStyles(
													// 		'stretch',
													// 		e.target.checked,
													// 	);
													// }}
													checked={
														this.state?.activeComponent?.style
															?.videoProps?.loop ?? false
													}
												/>
												<span className="slider-round round"></span>
											</label>
										</div>
									</div>
								</div>
							) : (
								<></>
							)}
							{this.state?.activeBgtype == 'video' ||
							this.state?.activeBgtype == 'image' ? (
								<>
									<div className="element_image">
										<div className="element_pasteURL" style={{ gap: '15px' }}>
											<div
												className="overlayEffectContainer"
												style={{ marginTop: '10px' }}
											>
												<div
													className="overlayEffectHeading"
													onClick={() =>
														this.setState({
															overlayEffect:
																!this.state.overlayEffect,
														})
													}
												>
													<p className="heading">Overlay effect</p>
													<RightArrow
														style={{
															transform: this.state.overlayEffect
																? 'rotate(180deg)'
																: 'rotate(0deg)',
														}}
													/>
												</div>
												{this.state.overlayEffect && (
													<div
														className="overlayEffectContent"
														style={{ marginTop: '10px' }}
													>
														<div
															className="block_styles pad-color-p-imp"
															style={{ padding: '12px 0px' }}
														>
															<ColorPicker
																title={' Color'}
																color={
																	this.state?.activeComponent
																		?.style?.bgOverlayColor
																}
																handleColor={(e) =>
																	this.handleActiveCardStyles(
																		'bgOverlayColor',
																		e,
																	)
																}
																brandColors={
																	this.props?.brandColors
																}
																zoom={0.8}
																isDarkBg={true}
															/>
														</div>

														<div className="popup-shapes-range-wrapper">
															<b>Opacity</b>
															<div className="popup-range-div">
																<div
																	style={{
																		display: 'flex',
																		maxWidth: 170,
																	}}
																>
																	<input
																		type="range"
																		min={0}
																		max={100}
																		step={5}
																		value={
																			this.state
																				?.activeComponent
																				?.style
																				?.bgOverlayOpacity
																		}
																		onChange={(e) =>
																			this.handleActiveCardStyles(
																				'bgOverlayOpacity',
																				e.target.value,
																			)
																		}
																	/>
																</div>
																<p
																	style={{
																		textAlign: 'center',
																	}}
																>
																	{
																		this.state?.activeComponent
																			?.style
																			?.bgOverlayOpacity
																	}
																	%
																</p>
															</div>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>
								</>
							) : (
								''
							)}
						</div>
					)}
				</div>
				<Modal
					show={this.state.showImageModal}
					handleClose={(e) => {
						this.setState({ showImageModal: false }, () => {
							this.props?.setModalRef(this.state.showImageModal);
						});
					}}
					modalType={'center'}
				>
					<ImageLibrary
						close={(e) => {
							this.setState({ showImageModal: false }, () => {
								this.props?.setModalRef(this.state.showImageModal);
							});
						}}
						setLibraryImage={(e) => {
							this.handleActiveCardStyles('backgroundImageURL', e);
						}}
					/>
				</Modal>
			</div>
		);
	}
}
