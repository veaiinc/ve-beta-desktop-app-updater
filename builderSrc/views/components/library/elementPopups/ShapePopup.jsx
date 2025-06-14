import React, { Component } from 'react';

import ColorPicker from '../../properties/colorpicker';
import './elementPopup.scss';

//fluidLShapes
import { ReactComponent as Circles } from '../svgs/stickers/circle.svg';
import Shape2 from '../svgs/fluidShapes/shape2';
import Shape3 from '../svgs/fluidShapes/shape3';
import Shape4 from '../svgs/fluidShapes/shape4';
import Shape5 from '../svgs/fluidShapes/shape5';
import Shape6 from '../svgs/fluidShapes/shape6';
import Shape7 from '../svgs/fluidShapes/shape7';
import Shape8 from '../svgs/fluidShapes/shape8';
import Shape9 from '../svgs/fluidShapes/shape9';
import Shape10 from '../svgs/fluidShapes/shape10';
import Shape11 from '../svgs/fluidShapes/shape11';
import Shape12 from '../svgs/fluidShapes/shape12';
import Shape13 from '../svgs/fluidShapes/shape13';
import Shape14 from '../svgs/fluidShapes/shape14';
import Shape15 from '../svgs/fluidShapes/shape15';
import Shape16 from '../svgs/fluidShapes/shape16';
import Shape17 from '../svgs/fluidShapes/shape17';
import Shape18 from '../svgs/fluidShapes/shape18';
import Shape19 from '../svgs/fluidShapes/shape19';

// *anime popups
import LoopPopup from '../../animePopups/LoopPopup';
import HoverPopup from '../../animePopups/HoverPopup';
import ScrollPopup from '../../animePopups/ScrollPopup';

// * animations adjustments popups
import HoverPressAdj from '../../animePopups/HoverPressAdj';
import LoopAdj from '../../animePopups/LoopAdj';
import ScrollAdj from '../../animePopups/ScrollAdj';
import AnimeLoader from '../svgs/adjustmentSvgs/AnimeLoader';

// svgs
import { ReactComponent as CornersBox } from '../svgs/CornersBox.svg';
import { ReactComponent as SingleCorner } from '../svgs/SingleCorner.svg';
import { ReactComponent as Arrow } from '../svgs/arrow.svg';
export default class ShapePopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: 'shape',
			stylesState: 'shape',
			showShapes: false,
			activeComponent: props.activeComponent || {},
			fluidShapes: [
				{ name: 'circle', element: <Circles /> },
				{ name: 'shape2', element: <Shape2 /> },
				{ name: 'shape3', element: <Shape3 /> },
				{ name: 'shape4', element: <Shape4 /> },
				{ name: 'shape5', element: <Shape5 /> },
				{ name: 'shape6', element: <Shape6 /> },
				{ name: 'shape7', element: <Shape7 /> },
				{ name: 'shape8', element: <Shape8 /> },
				{ name: 'shape9', element: <Shape9 /> },
				{ name: 'shape10', element: <Shape10 /> },
				{ name: 'shape11', element: <Shape11 /> },
				{ name: 'shape12', element: <Shape12 /> },
				{ name: 'shape13', element: <Shape13 /> },
				{ name: 'shape14', element: <Shape14 /> },
				{ name: 'shape15', element: <Shape15 /> },
				{ name: 'shape16', element: <Shape16 /> },
				{ name: 'shape17', element: <Shape17 /> },
				{ name: 'shape18', element: <Shape18 /> },
				{ name: 'shape19', element: <Shape19 /> },
			],
			heightForPopup: false,

			activeAnimeType: props?.activeComponent?.animations?.animeType || '',
			activeAnimeName: props?.activeComponent?.animations?.animeName || '',
			activeAnimeName: props?.activeComponent?.animations?.animeName || '',
			isAdjustment: false,
			showAnimeLoader: false,
			highlightIndex: -1,
			highlightLength: 2,
			message: 'Initializing',
		};
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeComponent !== this.state.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
				activeAnimeType: nextProps.activeComponent?.animations?.animeType || '',
				activeAnimeName: nextProps.activeComponent?.animations?.animeName || '',
			});
		}
	}
	intervalRef = null;
	componentDidUpdate(prevProps, prevState) {
		if (prevState?.showAnimeLoader !== this.state?.showAnimeLoader) {
			this.showLoaderAnimation();
		}
	}
	componentWillUnmount() {
		if (this.intervalRef) clearInterval(this.intervalRef);
	}
	showLoaderAnimation = () => {
		const speed = this.state?.message?.length > 15 ? 70 : 100;

		if (this.intervalRef) clearInterval(this.intervalRef); // Clear previous interval

		this.intervalRef = setInterval(() => {
			this.setState((prevState) => {
				let nextIndex =
					prevState.highlightIndex < prevState.message.length
						? prevState.highlightIndex + 1
						: -prevState.highlightLength;

				return {
					highlightIndex: nextIndex,
				};
			});
		}, speed);
	};
	handleActive = (type) => {
		this.setState({
			active: type,
		});
	};

	handleStylesState = (type) => {
		this.setState({
			stylesState: type,
		});
	};
	handleActiveShape = (type) => {
		this.setState({
			activeShape: type,
		});
	};

	handleActiveStickerStyles = (type, value, transform = '') => {
		const debounceTypes = [
			'strokeWidth',
			'opacity',
			'cornerRadius',
			'blur',
			'spread',
			'shadowX',
			'shadowY',
		];
		const outerAdjustmentsTypes = [
			'animeDelay',
			'animeDuration',
			'position',
			'animeDistance',
			'direction',
			'animeIntensity',
			'animeArea',
			'triggerPoint',
		];
		const innerAdjustmentsTypes = [
			'scale',
			'translate',
			'translateX',
			'translateY',
			'skewY',
			'skewX',
			'skew',
			'angle',
			'opacity',
			'opacityDelay',
			'rotate',
			'mDirection',
			'spin',
			'speed',
			'orientation',
			'parts',
			'stagger',
			'blur',
		];
		let newComponent = { ...this.state.activeComponent };

		const regex = /^\d*$/;
		if (
			type == 'topLeft' ||
			type == 'topRight' ||
			type == 'bottomLeft' ||
			type == 'bottomRight'
		) {
			if (regex.test(value) && value.length <= 3 && value <= 200 && value >= 0) {
			} else {
				return;
			}
		}
		if (type == 'stroke' || type == 'strokeWidth' || type == 'strokeStyle') {
			newComponent = {
				...newComponent,
				strokeStyles: { ...newComponent?.strokeStyles, [type]: value },
			};
		} else if (
			type == 'shadow' ||
			type == 'shadowColor' ||
			type == 'blur' ||
			type == 'spread' ||
			type == 'shadowX' ||
			type == 'shadowY'
		) {
			newComponent = {
				...newComponent,
				shadowStyles: { ...newComponent?.shadowStyles, [type]: value },
			};
		} else if (
			type == 'topLeft' ||
			type == 'topRight' ||
			type == 'bottomLeft' ||
			type == 'bottomRight'
		) {
			const regex = /^\d*$/;
			if (regex.test(value) && value.length <= 3 && value <= 200 && value >= 0) {
				newComponent = {
					...newComponent,
					corners: { ...newComponent?.corners, [type]: value },
				};
			}
		} else if (type == 'animeType' || type == 'animeName' || type == 'animePreview') {
			newComponent = {
				...newComponent,
				animations: { ...(newComponent?.animations || {}), [type]: value },
			};
		} else if (
			outerAdjustmentsTypes.includes(type) ||
			innerAdjustmentsTypes.includes(type)
			// ||
			// type == 'animationArea' ||
			// type == 'animationPosition'
		) {
			if (
				innerAdjustmentsTypes.includes(type)
				// ||
				// type == 'animationArea' ||
				// type == 'animationPosition'
			) {
				newComponent = {
					...newComponent,
					animations: {
						...(newComponent?.animations || {}),
						adjust: true,
						adjustments: {
							...(newComponent?.animations?.adjustments || {}),
							[type]: value,
							transform: transform,
							// direction: direction,
						},
					},
				};
			} else {
				newComponent = {
					...newComponent,
					animations: {
						...(newComponent?.animations || {}),
						adjust: true,
						adjustments: {
							...(newComponent?.animations?.adjustments || {}),
							[type]: value,
						},
					},
				};
			}
		} else {
			newComponent = { ...newComponent, [type]: value };
		}
		this.setState(
			{
				activeComponent: newComponent,
				activeAnimeName: type == 'animeName' ? value : this.state?.activeAnimeName,
				showAnimeLoader: type == 'animePreview' ? true : this.state?.showAnimeLoader,
			},
			() => {
				if (debounceTypes.includes(type)) {
					this.props?.handleElementDebounceSave(newComponent);
				} else {
					this.props?.setActivePopupComponent(newComponent);
					if (type == 'animePreview') {
						const timeout = newComponent?.animations?.adjust
							? this.state?.activeAnimeType == 'scroll'
								? this.state?.activeAnimeName == 'arc'
									? 6
									: 4
								: parseFloat(
										newComponent?.animations?.adjustments?.animeDuration || 2,
								  ) +
								  parseFloat(newComponent?.animations?.adjustments?.animeDelay || 1)
							: 4;
						setTimeout(() => {
							newComponent = {
								...newComponent,
								animations: { ...newComponent?.animations, animePreview: false },
							};
							this.setState({ showAnimeLoader: false }, () => {
								this.props?.setActivePopupComponent(newComponent);
							});
						}, timeout * 1000);
					}
				}
			},
		);
	};
	render() {
		const strokeShapes = [
			'circle',
			'shape2',
			'shape3',
			'shape4',
			'shape5',
			'shape6',
			'shape14',
		];
		const RadiusShapes = ['shape3'];
		return (
			<div className="elementPopupContainer">
				{this.state.isAdjustment ? (
					<>
						<div className="element_image_container_main element-shapes-container">
							<div className="element_image">
								<div className="anime-adjustment-header">
									<Arrow
										style={{ rotate: '180deg', cursor: 'pointer' }}
										onClick={() => this.setState({ isAdjustment: false })}
									/>
									<div className="heading">Adjust Animation</div>
								</div>
								<div
									style={{
										opacity: this.state?.showAnimeLoader ? 0.4 : 1,
										pointerEvents: this.state?.showAnimeLoader
											? 'none'
											: 'auto',
									}}
								>
									{this.state?.activeAnimeType === 'hover' ||
									this.state?.activeAnimeType == 'press' ? (
										<>
											<HoverPressAdj
												activeComponent={this.state?.activeComponent}
												adjustAnimation={this.handleActiveStickerStyles}
											/>
										</>
									) : this.state?.activeAnimeType === 'loop' ? (
										<>
											<LoopAdj
												activeComponent={this.state?.activeComponent}
												adjustAnimation={this.handleActiveStickerStyles}
											/>
										</>
									) : this.state?.activeAnimeType === 'scroll' ? (
										<>
											<ScrollAdj
												activeComponent={this.state?.activeComponent}
												adjustAnimation={this.handleActiveStickerStyles}
											/>
										</>
									) : (
										''
									)}
								</div>

								<div className="card-tab-wrapper">
									{this.state?.activeComponent?.animations?.animeType ? (
										<div className="anime-preview-container">
											{this.state?.showAnimeLoader ? (
												<div
													style={{
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														gap: '10px',
													}}
												>
													<AnimeLoader />

													<span className="heading">
														{this.state?.message
															.split('')
															.map((char, index) => (
																<span
																	key={index}
																	className="subheading"
																	style={{
																		color:
																			index >=
																				this.state
																					.highlightIndex &&
																			index <
																				this.state
																					.highlightIndex +
																					this.state
																						.highlightLength
																				? '#f1f1f1'
																				: '#7c7c84',
																	}}
																>
																	{char}
																</span>
															))}
													</span>
												</div>
											) : (
												<div
													className="heading"
													style={{ cursor: 'pointer' }}
													onClick={() =>
														this.handleActiveStickerStyles(
															'animePreview',
															true,
														)
													}
												>
													Preview
												</div>
											)}
										</div>
									) : (
										''
									)}
								</div>
							</div>
						</div>
					</>
				) : (
					<>
						<div className="elementPopupHeader">
							<p
								className={this.state.active === 'shape' ? 'active' : ''}
								onClick={() => this.handleActive('shape')}
							>
								Shape
							</p>
							<p
								className={this.state.active === 'styles' ? 'active' : ''}
								onClick={() => this.handleActive('styles')}
							>
								Styles
							</p>
							<p
								className={this.state.active === 'anime' ? 'active' : ''}
								onClick={() => this.handleActive('anime')}
							>
								Animation
							</p>
						</div>
						<div className="element_image_container_main">
							{this.state.active === 'anime' ? (
								<>
									<div className="card-tab-wrapper">
										<div className="bg-types-container">
											<span
												className={
													`bg-item ` +
													(this.state.activeAnimeType === 'hover'
														? ' active-bg-type'
														: '')
												}
												onClick={() =>
													this.setState(
														{ activeAnimeType: 'hover' },
														() => {
															this.handleActiveStickerStyles(
																'animeType',
																'hover',
															);
														},
													)
												}
											>
												Hover
											</span>
											<span
												className={
													`bg-item` +
													(this.state.activeAnimeType === 'loop'
														? ' active-bg-type'
														: '')
												}
												onClick={() =>
													this.setState(
														{ activeAnimeType: 'loop' },
														() => {
															this.handleActiveStickerStyles(
																'animeType',
																'loop',
															);
														},
													)
												}
											>
												Loop
											</span>
											<span
												className={
													`bg-item` +
													(this.state.activeAnimeType === 'press'
														? ' active-bg-type'
														: '')
												}
												onClick={() =>
													this.setState(
														{ activeAnimeType: 'press' },
														() => {
															this.handleActiveStickerStyles(
																'animeType',
																'press',
															);
														},
													)
												}
											>
												Press
											</span>
											<span
												className={
													`bg-item ` +
													(this.state.activeAnimeType === 'scroll'
														? ' active-bg-type'
														: '')
												}
												onClick={() =>
													this.setState(
														{ activeAnimeType: 'scroll' },
														() => {
															this.handleActiveStickerStyles(
																'animeType',
																'scroll',
															);
														},
													)
												}
											>
												Scroll
											</span>
										</div>
										<div className="anime-hw-popup-content">
											{this.state?.activeAnimeType == 'loop' ? (
												<LoopPopup
													activeElementAnimeName={
														this.state?.activeAnimeName
													}
													handleElementAnimationsValue={(e) =>
														this.handleActiveStickerStyles(
															'animeName',
															e,
														)
													}
													activeElementAnimeType={
														this.state?.activeAnimeType
													}
												/>
											) : this.state?.activeAnimeType == 'scroll' ? (
												<ScrollPopup
													activeElementAnimeName={
														this.state?.activeAnimeName
													}
													handleElementAnimationsValue={(e) =>
														this.handleActiveStickerStyles(
															'animeName',
															e,
														)
													}
													activeElementAnimeType={
														this.state?.activeAnimeType
													}
												/>
											) : (
												<HoverPopup
													activeElementAnimeName={
														this.state?.activeAnimeName
													}
													handleElementAnimationsValue={(e) =>
														this.handleActiveStickerStyles(
															'animeName',
															e,
														)
													}
													activeElementAnimeType={
														this.state?.activeAnimeType
													}
												/>
											)}
										</div>
										{this.state?.activeComponent?.animations?.animeType ? (
											<div className="anime-preview-container">
												<div
													className="heading"
													style={{ cursor: 'pointer' }}
													onClick={() =>
														this.setState({
															isAdjustment: true,
														})
													}
												>
													Adjust Animation
												</div>
											</div>
										) : (
											''
										)}
									</div>
								</>
							) : (
								<>
									<div
										className="  element-shapes-container"
										style={{
											// padding: this.state.active === 'styles' ? '0px' : '10px',
											padding: '10px',
											gap: '10px',
										}}
									>
										{this.state.active === 'styles' ? (
											<>
												<div
													className="block_styles pad-color-p-imp"
													style={{
														height: this.state?.heightForPopup
															? '425px'
															: 'auto',
													}}
												>
													<ColorPicker
														title={' Color'}
														color={
															this.state?.activeComponent?.stickerFill
														}
														handleColor={(e) =>
															this.handleActiveStickerStyles(
																'stickerFill',
																e,
															)
														}
														brandColors={this.props?.brandColors}
														zoom={0.8}
														setHeightForPopup={(e) => {
															this.setState({
																heightForPopup: e,
															});
														}}
														shapePopup={true}
														isDarkBg={true}
													/>
												</div>
												{RadiusShapes.includes(
													this.state?.activeComponent?.isSticker,
												) && (
													<>
														<div className="popup-shapes-range-wrapper">
															<b>Corner Radius</b>

															<div className="popup-stroke-styles">
																<span
																	className={
																		this.state?.activeComponent
																			?.isDiffCorners ===
																		false
																			? 'active-corner-style'
																			: ''
																	}
																	onClick={() => {
																		this.handleActiveStickerStyles(
																			'isDiffCorners',
																			false,
																		);
																	}}
																>
																	<div
																		style={{
																			width: '15px',
																			height: '15px',
																			backgroundColor:
																				'transparent',
																			border: `1px solid #7A7E85`,
																			borderRadius: '4px',
																		}}
																	></div>
																</span>

																<span
																	className={
																		this.state?.activeComponent
																			?.isDiffCorners === true
																			? 'active-corner-style'
																			: ''
																	}
																	onClick={() => {
																		this.handleActiveStickerStyles(
																			'isDiffCorners',
																			true,
																		);
																	}}
																>
																	<CornersBox />
																</span>
															</div>
															{this.state?.activeComponent
																?.isDiffCorners ? (
																<div className="popup-stroke-styles">
																	<span className="corner-box-span">
																		<input
																			type="number"
																			maxLength={3}
																			placeholder="0"
																			value={
																				this.state
																					?.activeComponent
																					?.corners
																					?.topLeft
																			}
																			onChange={(e) => {
																				this.handleActiveStickerStyles(
																					'topLeft',
																					e.target.value,
																				);
																			}}
																		/>
																		<div
																			className="single-corner-svg"
																			style={{
																				top: '0px',
																				left: '5px',
																			}}
																		>
																			<SingleCorner />
																		</div>
																	</span>
																	<span className="corner-box-span">
																		<input
																			type="number"
																			maxLength={3}
																			placeholder="0"
																			value={
																				this.state
																					?.activeComponent
																					?.corners
																					?.topRight
																			}
																			onChange={(e) => {
																				this.handleActiveStickerStyles(
																					'topRight',
																					e.target.value,
																				);
																			}}
																		/>
																		<div
																			className="single-corner-svg"
																			style={{
																				top: '3px',
																				right: '2px',
																				rotate: '90deg',
																			}}
																		>
																			<SingleCorner />
																		</div>
																	</span>
																	<span className="corner-box-span">
																		<input
																			type="number"
																			maxLength={3}
																			placeholder="0"
																			value={
																				this.state
																					?.activeComponent
																					?.corners
																					?.bottomLeft
																			}
																			onChange={(e) => {
																				this.handleActiveStickerStyles(
																					'bottomLeft',
																					e.target.value,
																				);
																			}}
																		/>
																		<div
																			className="single-corner-svg"
																			style={{
																				bottom: '0px',
																				right: '5px',
																				rotate: '180deg',
																			}}
																		>
																			<SingleCorner />
																		</div>
																	</span>
																	<span
																		className=" corner-box-span
																
																	"
																	>
																		<input
																			type="number"
																			maxLength={3}
																			placeholder="0"
																			value={
																				this.state
																					?.activeComponent
																					?.corners
																					?.bottomRight
																			}
																			onChange={(e) => {
																				this.handleActiveStickerStyles(
																					'bottomRight',
																					e.target.value,
																				);
																			}}
																		/>
																		<div
																			className="single-corner-svg"
																			style={{
																				bottom: '3px',
																				left: '2px',
																				rotate: '270deg',
																			}}
																		>
																			<SingleCorner />
																		</div>
																	</span>
																</div>
															) : (
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
																			max={150}
																			step={1}
																			value={
																				this.state
																					?.activeComponent
																					?.cornerRadius
																			}
																			onChange={(e) =>
																				this.handleActiveStickerStyles(
																					'cornerRadius',
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
																			this.state
																				?.activeComponent
																				?.cornerRadius
																		}
																		px
																	</p>
																</div>
															)}
														</div>
														<div className="line"></div>
													</>
												)}

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
																max={1}
																step={0.1}
																value={
																	this.state?.activeComponent
																		?.shapeOpacity || 0
																}
																onChange={(e) =>
																	this.handleActiveStickerStyles(
																		'shapeOpacity',
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
															{this.state?.activeComponent
																?.shapeOpacity * 100}
															%
														</p>
													</div>
												</div>

												{strokeShapes.includes(
													this.state?.activeComponent?.isSticker,
												) && (
													<>
														{/* <div className="divider"></div> */}
														<div
															className=" bs-item bs-item-row animated-item"
															style={{
																display: 'flex',
																justifyContent: 'space-between',
															}}
														>
															<b
																style={{
																	textTransform: 'capitalize',
																}}
															>
																Drop Shadow
															</b>
															<label
																className="switch"
																onClick={() => {
																	this.handleActiveStickerStyles(
																		'shadow',
																		!this.state?.activeComponent
																			?.shadowStyles?.shadow,
																	);
																}}
															>
																<input
																	type="checkbox"
																	// onChange={(e) =>
																	// 	this.handleActiveStickerStyles(
																	// 		'stroke',
																	// 		e.target.checked,
																	// 	)
																	// }
																	checked={
																		this.state?.activeComponent
																			?.shadowStyles?.shadow
																	}
																/>
																<span className="slider-round round"></span>
															</label>
														</div>

														{this.state?.activeComponent?.shadowStyles
															?.shadow && (
															<>
																<div className="block_styles pad-color-p-imp">
																	<ColorPicker
																		title={'Shadow Color'}
																		color={
																			this.state
																				?.activeComponent
																				?.shadowStyles
																				?.shadowColor
																		}
																		handleColor={(e) =>
																			this.handleActiveStickerStyles(
																				'shadowColor',
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
																	<b>X-offset</b>
																	<div className="popup-range-div">
																		<div
																			style={{
																				display: 'flex',
																				maxWidth: 170,
																			}}
																		>
																			<input
																				type="range"
																				min={-50}
																				max={50}
																				step={1}
																				value={
																					this.state
																						?.activeComponent
																						?.shadowStyles
																						?.shadowX
																				}
																				onChange={(e) =>
																					this.handleActiveStickerStyles(
																						'shadowX',
																						e.target
																							.value,
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
																				this.state
																					?.activeComponent
																					?.shadowStyles
																					?.shadowX
																			}
																			px
																		</p>
																	</div>
																</div>
																<div className="popup-shapes-range-wrapper">
																	<b>Y-offset</b>
																	<div className="popup-range-div">
																		<div
																			style={{
																				display: 'flex',
																				maxWidth: 170,
																			}}
																		>
																			<input
																				type="range"
																				min={-50}
																				max={50}
																				step={1}
																				value={
																					this.state
																						?.activeComponent
																						?.shadowStyles
																						?.shadowY
																				}
																				onChange={(e) =>
																					this.handleActiveStickerStyles(
																						'shadowY',
																						e.target
																							.value,
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
																				this.state
																					?.activeComponent
																					?.shadowStyles
																					?.shadowY
																			}
																			px
																		</p>
																	</div>
																</div>
																<div className="popup-shapes-range-wrapper">
																	<b>Blur</b>
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
																					this.state
																						?.activeComponent
																						?.shadowStyles
																						?.blur
																				}
																				onChange={(e) =>
																					this.handleActiveStickerStyles(
																						'blur',
																						e.target
																							.value,
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
																				this.state
																					?.activeComponent
																					?.shadowStyles
																					?.blur
																			}
																			px
																		</p>
																	</div>
																</div>
																<div className="popup-shapes-range-wrapper">
																	<b>Spread</b>
																	<div className="popup-range-div">
																		<div
																			style={{
																				display: 'flex',
																				maxWidth: 170,
																			}}
																		>
																			<input
																				type="range"
																				min={-50}
																				max={50}
																				step={1}
																				value={
																					this.state
																						?.activeComponent
																						?.shadowStyles
																						?.spread
																				}
																				onChange={(e) =>
																					this.handleActiveStickerStyles(
																						'spread',
																						e.target
																							.value,
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
																				this.state
																					?.activeComponent
																					?.shadowStyles
																					?.spread
																			}
																			px
																		</p>
																	</div>
																</div>
															</>
														)}
													</>
												)}
												{strokeShapes.includes(
													this.state?.activeComponent?.isSticker,
												) && (
													<>
														<div className="divider"></div>
														<div
															className=" bs-item bs-item-row animated-item"
															style={{
																display: 'flex',
																justifyContent: 'space-between',
															}}
														>
															<b
																style={{
																	textTransform: 'capitalize',
																}}
															>
																Stroke
															</b>
															<label
																className="switch"
																onClick={() => {
																	this.handleActiveStickerStyles(
																		'stroke',
																		!this.state?.activeComponent
																			?.strokeStyles?.stroke,
																	);
																}}
															>
																<input
																	type="checkbox"
																	// onChange={(e) =>
																	// 	this.handleActiveStickerStyles(
																	// 		'stroke',
																	// 		e.target.checked,
																	// 	)
																	// }
																	checked={
																		this.state?.activeComponent
																			?.strokeStyles?.stroke
																	}
																/>
																<span className="slider-round round"></span>
															</label>
														</div>

														{this.state?.activeComponent?.strokeStyles
															?.stroke && (
															<>
																<div className="block_styles pad-color-p-imp">
																	<ColorPicker
																		title={'Stroke Color'}
																		color={
																			this.state
																				?.activeComponent
																				?.stickerStroke
																		}
																		handleColor={(e) =>
																			this.handleActiveStickerStyles(
																				'stickerStroke',
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
																	<b>Thickness</b>
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
																				max={40}
																				step={0.5}
																				value={
																					this.state
																						?.activeComponent
																						?.strokeStyles
																						?.strokeWidth
																				}
																				onChange={(e) =>
																					this.handleActiveStickerStyles(
																						'strokeWidth',
																						e.target
																							.value,
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
																				this.state
																					?.activeComponent
																					?.strokeStyles
																					?.strokeWidth
																			}
																			px
																		</p>
																	</div>
																</div>
																<div className="popup-shapes-range-wrapper">
																	<b> Style</b>
																	<div className="popup-stroke-styles">
																		<span
																			className={
																				this.state
																					?.activeComponent
																					?.strokeStyles
																					?.strokeStyle ===
																				'solid'
																					? 'active-stroke-style'
																					: ''
																			}
																			onClick={() => {
																				this.handleActiveStickerStyles(
																					'strokeStyle',
																					'solid',
																				);
																			}}
																			style={{
																				transform:
																					'rotate(90deg)',
																			}}
																		>
																			|
																		</span>

																		<span
																			className={
																				this.state
																					?.activeComponent
																					?.strokeStyles
																					?.strokeStyle ===
																				'dashed'
																					? 'active-stroke-style'
																					: ''
																			}
																			onClick={() => {
																				this.handleActiveStickerStyles(
																					'strokeStyle',
																					'dashed',
																				);
																			}}
																		>
																			...
																		</span>
																	</div>
																</div>
															</>
														)}
													</>
												)}
											</>
										) : (
											<>
												<div
													className=" bs-item bs-item-row animated-item"
													style={{
														display: 'flex',
														justifyContent: 'space-between',
													}}
												>
													<b style={{ textTransform: 'capitalize' }}>
														Stretch
													</b>

													<label
														className="switch"
														onClick={() => {
															this.handleActiveStickerStyles(
																'stretch',
																!this.state.activeComponent
																	?.stretch,
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
																this.state.activeComponent
																	?.stretch ?? false
															}
														/>
														<span className="slider-round round"></span>
													</label>
												</div>
												<div className="divider"></div>
												<div className="popup-shapes-container">
													<b>Shapes</b>
													<div className="popup-shapes-icons">
														{this.state.fluidShapes?.map((sticker) => {
															const isActive =
																this.state.activeComponent
																	?.isSticker == sticker.name;
															return (
																<span
																	key={sticker.name}
																	className={
																		isActive
																			? 'activeShape'
																			: ''
																	}
																	onClick={() => {
																		this.handleActiveStickerStyles(
																			'isSticker',
																			sticker.name,
																		);
																	}}
																>
																	{sticker.element}
																</span>
															);
														})}
													</div>
												</div>
											</>
										)}
									</div>
								</>
							)}
						</div>
					</>
				)}
			</div>
		);
	}
}
