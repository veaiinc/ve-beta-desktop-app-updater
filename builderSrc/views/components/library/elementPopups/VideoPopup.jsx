import React, { Component } from 'react';
import './elementPopup.scss';

// !anime popups
import LoopPopup from '../../animePopups/LoopPopup';
import HoverPopup from '../../animePopups/HoverPopup';
import ScrollPopup from '../../animePopups/ScrollPopup';

// * animations adjustments popups
import HoverPressAdj from '../../animePopups/HoverPressAdj';
import LoopAdj from '../../animePopups/LoopAdj';
import ScrollAdj from '../../animePopups/ScrollAdj';
import AnimeLoader from '../svgs/adjustmentSvgs/AnimeLoader';

// svgs
import { ReactComponent as Arrow } from '../svgs/arrow.svg';
export default class VideoPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			image: props.image,
			active: 'v',
			stylesState: '',
			activeShape: 1,
			overlayEffect: false,
			showShapes: false,
			activeComponent: props.activeComponent,
			debounceStateForVideo: null,

			activeAnimeType: props?.activeComponent?.animations?.animeType || '',
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
	handleActiveVideoProps = (type, value, transform = '') => {
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

	handleDebounceProps = (type, value) => {
		let newComponent = { ...this.state.activeComponent };

		newComponent = {
			...newComponent,
			[type]: value,
		};

		this.setState({ activeComponent: newComponent }, () => {
			this.debounceFuncForVideo(() => {
				this.props?.setActivePopupComponent(newComponent);
			}, 1000);
		});
	};
	debounceFuncForVideo = (func, delay = 800) => {
		if (this.state?.debounceStateForVideo) {
			clearTimeout(this.state?.debounceStateForVideo);
		}
		const debounceFunc = setTimeout(() => {
			func();
		}, delay);
		this.setState({ debounceStateForVideo: debounceFunc });
	};
	render() {
		return (
			<div className="elementPopupContainer">
				{this.state?.isAdjustment ? (
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
												adjustAnimation={this.handleActiveVideoProps}
											/>
										</>
									) : this.state?.activeAnimeType === 'loop' ? (
										<>
											<LoopAdj
												activeComponent={this.state?.activeComponent}
												adjustAnimation={this.handleActiveVideoProps}
											/>
										</>
									) : this.state?.activeAnimeType === 'scroll' ? (
										<>
											<ScrollAdj
												activeComponent={this.state?.activeComponent}
												adjustAnimation={this.handleActiveVideoProps}
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
														this.handleActiveVideoProps(
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
								className={this.state.active === 'v' ? 'active' : ''}
								onClick={() => this.handleActive('v')}
							>
								Video
							</p>
							<p
								className={this.state.active === 'a' ? 'active' : ''}
								onClick={() => this.handleActive('a')}
							>
								Animation
							</p>
						</div>
						<div className="element_image_container_main element-shapes-container">
							{this.state?.active === 'a' ? (
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
															this.handleActiveVideoProps(
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
															this.handleActiveVideoProps(
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
															this.handleActiveVideoProps(
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
															this.handleActiveVideoProps(
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
											{
												this.state?.activeAnimeType == 'loop' ? (
													<LoopPopup
														activeElementAnimeName={
															this.state?.activeAnimeName
														}
														handleElementAnimationsValue={(e) =>
															this.handleActiveVideoProps(
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
															this.handleActiveVideoProps(
																'animeName',
																e,
															)
														}
														activeElementAnimeType={
															this.state?.activeAnimeType
														}
													/>
												) : (
													// this.state?.activeAnimeType == 'hover' ||
													//   this.state?.activeAnimeType == 'press' ?
													<HoverPopup
														activeElementAnimeName={
															this.state?.activeAnimeName
														}
														handleElementAnimationsValue={(e) =>
															this.handleActiveVideoProps(
																'animeName',
																e,
															)
														}
														activeElementAnimeType={
															this.state?.activeAnimeType
														}
													/>
												)
												// : (
												// 	''
												// )
											}
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
									<div className="element_image">
										<div className="element_pasteURL" style={{ gap: '15px' }}>
											<p className="heading">Video URL</p>
											<p className="subheading">
												Paste the URL link of your YouTube or Vimeo hosted
												video.
											</p>

											<div
												className="element_input"
												style={{
													flexDirection: 'row',
													alignItems: 'center',
												}}
											>
												<input
													type="text"
													name="videoURL"
													placeholder="https://..."
													value={this.state?.activeComponent?.videoURL}
													onChange={(e) =>
														this.handleDebounceProps(
															'videoURL',
															e.target.value,
														)
													}
												/>
											</div>
											{!this.props?.isvalidActiveVideoURL &&
												this.state?.activeComponent?.videoURL && (
													<div
														className="subheading"
														style={{
															fontSize: '10px',
															color: 'red',
														}}
													>
														invalid video URL
													</div>
												)}

											{/* //! not present in current builder  */}
											{/* <div className="element_or">
								<div className="ortext">Or</div>
								<div className="line"></div>
							</div>
							<div
								className="element_button"
								onClick={() =>
									this.setState({ showImageModal: true }, () => {
										this.props?.setModalRef(this.state.showImageModal);
									})
								}
								style={{ cursor: 'pointer' }}
							>
								<span className="subheading"> Select a Video from Library</span>
							</div> */}

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
													Auto play
												</b>

												<label
													className="switch"
													onClick={() => {
														this.handleActiveVideoProps(
															'autoplay',
															!this.state?.activeComponent?.autoplay,
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
															this.state?.activeComponent?.autoplay ??
															false
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
													Mute video
												</b>

												<label
													className="switch"
													onClick={() => {
														this.handleActiveVideoProps(
															'muteVideo',
															!this.state?.activeComponent?.muteVideo,
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
															this.state?.activeComponent
																?.muteVideo ?? false
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
														this.handleActiveVideoProps(
															'loop',
															!this.state?.activeComponent?.loop,
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
															this.state?.activeComponent?.loop ??
															false
														}
													/>
													<span className="slider-round round"></span>
												</label>
											</div>
											{/* <div
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
										this.handleActiveVideoProps(
											'showAltText',
											!this.state?.activeComponent?.showAltText,
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
										checked={this.state?.activeComponent?.showAltText ?? false}
									/>
									<span className="slider-round round"></span>
								</label>
							</div> */}
											<div
												className="line"
												style={{
													border: '1px solid #333334',
													margin: '10px 0px',
												}}
											></div>
											<p className="heading">Video Alt Text</p>
											<div className="element_input">
												<input
													type="text"
													name="videoAltText"
													placeholder=""
													value={
														this.state?.activeComponent?.videoAltText
													}
													onChange={(e) =>
														this.handleDebounceProps(
															'videoAltText',
															e.target.value,
														)
													}
													maxLength={150}
												/>
											</div>
											<p className="subheading">
												Enhance SEO and accessibility by describing your
												video.
											</p>
										</div>
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
