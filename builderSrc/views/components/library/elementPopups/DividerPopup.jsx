import React, { Component } from 'react';
import './elementPopup.scss';
import ColorPicker from '../../properties/colorpicker';
// svgs
import { ReactComponent as TopAlign } from '../svgs/alignment/TopAlign.svg';
import { ReactComponent as CenterAlign } from '../svgs/alignment/CenterAlign.svg';
import { ReactComponent as BottomAlign } from '../svgs/alignment/BottomAlign.svg';
import { ReactComponent as Arrow } from '../svgs/arrow.svg';

// !anime popups
import LoopPopup from '../../animePopups/LoopPopup';
import HoverPopup from '../../animePopups/HoverPopup';
import ScrollPopup from '../../animePopups/ScrollPopup';

// * animations adjustments popups
import HoverPressAdj from '../../animePopups/HoverPressAdj';
import LoopAdj from '../../animePopups/LoopAdj';
import ScrollAdj from '../../animePopups/ScrollAdj';
import AnimeLoader from '../svgs/adjustmentSvgs/AnimeLoader';
export default class DividerPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: 'd',
			activeComponent: props.activeComponent,
			borderStyle: props?.activeComponent?.borderStyle || '',
			activeAnimeType: props?.activeComponent?.animations?.animeType || '',
			activeAnimeName: props?.activeComponent?.animations?.animeName || '',
			isAdjustment: false,
			showAnimeLoader: false,
			highlightIndex: -1,
			highlightLength: 2,
			message: 'Initializing',

			isHorizontal: props?.activeComponent?.isHorizontal,
		};
		this.fileInputRef = React.createRef();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeComponent !== this.state.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
				activeAnimeType: nextProps.activeComponent?.animations?.animeType || '',
				activeAnimeName: nextProps.activeComponent?.animations?.animeName || '',
				borderStyle: nextProps.activeComponent?.borderStyle || '',
				isHorizontal: nextProps?.activeComponent?.isHorizontal,
			});
		}
		if (nextProps?.activeModuleId !== this.state?.activeModuleId) {
			this.setState({
				activeModuleId: nextProps?.activeModuleId,
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
	// embed styles function

	handleDividerProps = (type, value, transform = '') => {
		const outerAdjustmentsTypes = [
			'animeDelay',
			'animeDuration',
			'position',
			'animeDistance',
			'direction',
			'animeIntensity',
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
		if (type == 'animeType' || type == 'animeName' || type == 'animePreview') {
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
				borderStyle: type == 'borderStyle' ? value : this.state?.borderStyle,
			},
			() => {
				this.props?.setActivePopupComponent(newComponent);
				if (type == 'animePreview') {
					const timeout = newComponent?.animations?.adjust
						? this.state?.activeAnimeType == 'scroll'
							? this.state?.activeAnimeName == 'arc'
								? 6
								: 4
							: parseFloat(
									newComponent?.animations?.adjustments?.animeDuration || 2,
							  ) + parseFloat(newComponent?.animations?.adjustments?.animeDelay || 1)
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
			},
		);
	};

	render() {
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
												adjustAnimation={this.handleDividerProps}
											/>
										</>
									) : this.state?.activeAnimeType === 'loop' ? (
										<>
											<LoopAdj
												activeComponent={this.state?.activeComponent}
												adjustAnimation={this.handleDividerProps}
											/>
										</>
									) : this.state?.activeAnimeType === 'scroll' ? (
										<>
											<ScrollAdj
												activeComponent={this.state?.activeComponent}
												adjustAnimation={this.handleDividerProps}
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
														this.handleDividerProps(
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
						{' '}
						<div className="elementPopupHeader">
							<p
								className={this.state.active === 'd' ? 'active' : ''}
								onClick={() => this.handleActive('d')}
							>
								Divider
							</p>
							<p
								className={this.state.active === 'a' ? 'active' : ''}
								onClick={() => this.handleActive('a')}
							>
								Animation
							</p>
						</div>
						<div className="element_image_container_main element-shapes-container">
							{this.state?.active === 'd' ? (
								<>
									<div className="element_image">
										<div className="element_pasteURL" style={{ gap: '15px' }}>
											<>
												<p className="heading">Style</p>
												<div className="card-tab-wrapper">
													<div
														className="bg-types-container"
														style={{ justifyContent: 'space-evenly' }}
													>
														<span
															className={
																`bg-item ` +
																(this.state.isHorizontal
																	? ' active-bg-type'
																	: '')
															}
															onClick={() =>
																this.setState(
																	{ isHorizontal: true },
																	() => {
																		this.handleDividerProps(
																			'isHorizontal',
																			true,
																		);
																	},
																)
															}
															style={{
																textAlign: 'center',
																width: '50%',
															}}
														>
															Horizontal
														</span>
														<span
															className={
																`bg-item` +
																(!this.state.isHorizontal
																	? ' active-bg-type'
																	: '')
															}
															onClick={() =>
																this.setState(
																	{ isHorizontal: false },
																	() => {
																		this.handleDividerProps(
																			'isHorizontal',
																			false,
																		);
																	},
																)
															}
															style={{
																textAlign: 'center',
																width: '50%',
															}}
														>
															Vertical
														</span>
													</div>
												</div>
												<div className="divider-boxes">
													<div
														className={`divider-box ${
															this.state?.borderStyle == 'solid'
																? 'active-divider-box'
																: ''
														}`}
														onClick={() =>
															this.handleDividerProps(
																'borderStyle',
																'solid',
															)
														}
														style={{
															alignItems: !this.state.isHorizontal
																? 'center'
																: 'flex-start',
														}}
													>
														<div
															className="divider-box-content"
															style={{
																height: !this.state.isHorizontal
																	? '35px'
																	: '0px',
																width: !this.state.isHorizontal
																	? '1px'
																	: '100%',
															}}
														></div>
													</div>
													<div
														className={`divider-box ${
															this.state?.borderStyle == 'double'
																? 'active-divider-box'
																: ''
														}`}
														onClick={() =>
															this.handleDividerProps(
																'borderStyle',
																'double',
															)
														}
														style={{
															alignItems: !this.state.isHorizontal
																? 'center'
																: 'flex-start',
															flexDirection: !this.state.isHorizontal
																? 'row'
																: 'column',
														}}
													>
														<div
															className="divider-box-content"
															style={{
																height: !this.state.isHorizontal
																	? '35px'
																	: '0px',
																width: !this.state.isHorizontal
																	? '1px'
																	: '100%',
															}}
														></div>
														<div
															className="divider-box-content"
															style={{
																height: !this.state.isHorizontal
																	? '35px'
																	: '0px',
																width: !this.state.isHorizontal
																	? '1px'
																	: '100%',
															}}
														></div>
													</div>
													<div
														className={`divider-box ${
															this.state?.borderStyle == 'dashed'
																? 'active-divider-box'
																: ''
														}`}
														onClick={() =>
															this.handleDividerProps(
																'borderStyle',
																'dashed',
															)
														}
														style={{
															alignItems: !this.state.isHorizontal
																? 'center'
																: 'flex-start',
														}}
													>
														<div
															className="divider-box-content"
															style={{
																height: !this.state.isHorizontal
																	? '35px'
																	: '0px',
																width: !this.state.isHorizontal
																	? '1px'
																	: '100%',
																borderStyle: 'dashed',
															}}
														></div>
													</div>
													<div
														className={`divider-box ${
															this.state?.borderStyle == 'arrow'
																? 'active-divider-box'
																: ''
														}`}
														style={{
															flexDirection: !this.state?.isHorizontal
																? 'column'
																: 'row',
															alignItems: 'center',
															justifyContent: 'center',
															gap: '0px',
														}}
														onClick={() =>
															this.handleDividerProps(
																'borderStyle',
																'arrow',
															)
														}
													>
														<div
															className="s-diamond-box"
															style={{
																// left: '0px',
																rotate: !this.state?.isHorizontal
																	? '50deg'
																	: '45deg',
															}}
														></div>
														<div
															className="divider-box-content"
															style={{
																height: !this.state.isHorizontal
																	? '35px'
																	: '0px',
																width: !this.state.isHorizontal
																	? '1px'
																	: '100%',
															}}
														></div>

														<div
															className="s-diamond-box"
															style={{
																// right: '0px',
																rotate: !this.state?.isHorizontal
																	? '50deg'
																	: '45deg',
															}}
														></div>
													</div>
												</div>
											</>
											<>
												<div
													className="block_styles pad-color-p-imp"
													style={{ padding: '12px 0px' }}
												>
													<ColorPicker
														title={'Color'}
														color={
															this.state?.activeComponent?.borderColor
														}
														handleColor={(e) =>
															this.handleDividerProps(
																'borderColor',
																e,
															)
														}
														brandColors={this.props?.brandColors}
														zoom={0.8}
														isDarkBg={true}
													/>
												</div>
											</>
											{this.state?.activeComponent?.borderStyle !==
												'arrow' && (
												<>
													<>
														<div className="popup-shapes-range-wrapper">
															<b>Size</b>
															<div className="popup-stroke-styles">
																<span
																	className={
																		this.state?.activeComponent
																			?.borderWidth == 1
																			? 'active-divider-stroke'
																			: ''
																	}
																	onClick={(e) => {
																		this.handleDividerProps(
																			'borderWidth',
																			1,
																		);
																	}}
																>
																	S
																</span>

																<span
																	className={
																		this.state?.activeComponent
																			?.borderWidth == 2
																			? 'active-divider-stroke'
																			: ''
																	}
																	onClick={(e) => {
																		this.handleDividerProps(
																			'borderWidth',
																			2,
																		);
																	}}
																>
																	M
																</span>
																<span
																	className={
																		this.state?.activeComponent
																			?.borderWidth == 4
																			? 'active-divider-stroke'
																			: ''
																	}
																	onClick={(e) => {
																		this.handleDividerProps(
																			'borderWidth',
																			4,
																		);
																	}}
																>
																	L
																</span>
															</div>
														</div>
													</>

													<>
														<div className="popup-shapes-range-wrapper">
															<b>Align</b>
															<div className="popup-stroke-styles">
																<span
																	className={
																		this.state?.activeComponent
																			?.align == 'start'
																			? 'active-divider-stroke'
																			: ''
																	}
																	onClick={(e) => {
																		this.handleDividerProps(
																			'align',
																			'start',
																		);
																	}}
																>
																	<TopAlign />
																</span>

																<span
																	className={
																		this.state?.activeComponent
																			?.align == 'center'
																			? 'active-divider-stroke'
																			: ''
																	}
																	onClick={(e) => {
																		this.handleDividerProps(
																			'align',
																			'center',
																		);
																	}}
																>
																	<CenterAlign />
																</span>
																<span
																	className={
																		this.state?.activeComponent
																			?.align == 'end'
																			? 'active-divider-stroke'
																			: ''
																	}
																	onClick={(e) => {
																		this.handleDividerProps(
																			'align',
																			'end',
																		);
																	}}
																>
																	<BottomAlign />
																</span>
															</div>
														</div>
													</>
												</>
											)}
										</div>
									</div>
								</>
							) : (
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
															this.handleDividerProps(
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
															this.handleDividerProps(
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
															this.handleDividerProps(
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
													`bg-item` +
													(this.state.activeAnimeType === 'scroll'
														? ' active-bg-type'
														: '')
												}
												onClick={() =>
													this.setState(
														{ activeAnimeType: 'scroll' },
														() => {
															this.handleDividerProps(
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
														this.handleDividerProps('animeName', e)
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
														this.handleDividerProps('animeName', e)
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
														this.handleDividerProps('animeName', e)
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
							)}
						</div>
					</>
				)}
			</div>
		);
	}
}
