import React, { Component } from 'react';
import './elementPopup.scss';

// svgs
import { ReactComponent as DropDown } from '../../../../assets/svg/dropDown.svg';
import { ReactComponent as Pages } from '../svgs/Pages.svg';
import { ReactComponent as Close } from '../svgs/popupSvgs/Close.svg';
import ColorPicker from '../../properties/colorpicker';
import { ReactComponent as Arrow } from '../svgs/arrow.svg';

// ?anime popups
import LoopPopup from '../../animePopups/LoopPopup';
import HoverPopup from '../../animePopups/HoverPopup';
import ScrollPopup from '../../animePopups/ScrollPopup';

// * animations adjustments popups
import HoverPressAdj from '../../animePopups/HoverPressAdj';
import LoopAdj from '../../animePopups/LoopAdj';
import ScrollAdj from '../../animePopups/ScrollAdj';
import AnimeLoader from '../svgs/adjustmentSvgs/AnimeLoader';
import _ from 'lodash';

export default class ButtonPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			image: props.image,
			active: this.props?.isLogicalFormText ? 'd' : 'b',
			stylesState: '',
			activeShape: 1,
			overlayEffect: false,
			showShapes: false,
			activeComponent: props.activeComponent,
			pageDropdown: false,
			sectionDropdown: false,
			sectionLinkDropdown: false,
			debounceStateForButton: null,

			activeAnimeType: props?.activeComponent?.animations?.animeType || '',
			activeAnimeName: props?.activeComponent?.animations?.animeName || '',
			isAdjustment: false,
			showAnimeLoader: false,
			highlightIndex: -1,
			highlightLength: 2,
			message: 'Initializing',
		};
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState?.showAnimeLoader !== this.state?.showAnimeLoader) {
			this.showLoaderAnimation();
		}
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
	componentWillUnmount = () => {
		if (this.intervalRef) clearInterval(this.intervalRef);
	};
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
	handleActive = (type) => {
		this.setState({
			active: type,
		});
	};
	handlePopupClick = (e) => {
		if (this.state.pageDropdown) {
			this.setState({ pageDropdown: false });
		}
	};

	// button styles function

	handleActiveButtonStyles = (type, value, transform = '') => {
		let newComponent = { ...this.state.activeComponent };
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
		if (type == 'remove') {
			newComponent = {
				...newComponent,
				linkUrl: '',
				linkType: '',
				linkModuleId: '',
				linkModuleType: '',
				linkModuleName: '',
				sectionId: '',
			};
		} else if (type == 'page' || type == 'link' || type == 'section') {
			if (type == 'link') {
				newComponent = {
					...newComponent,
					linkUrl: value,
					linkType: 'url',
				};
				this.setState({ pageDropdown: false, sectionDropdown: false }, () => {});
			} else if (type == 'page') {
				newComponent = {
					...newComponent,
					linkModuleId: value?._id,
					linkModuleType: value?.module,
					linkModuleName: value?.label,
					linkType: 'section',
				};
				this.setState({ pageDropdown: false, sectionDropdown: true }, () => {
					this.props?.getModuleSections(value);
				});
			} else {
				newComponent = {
					...newComponent,
					sectionId: value,
					linkType: 'section',
				};
				this.setState({
					sectionLinkDropdown: false,
					sectionDropdown: false,
				});
			}
		} else if (type == 'background' || type == 'borderColor' || type == 'stroke') {
			newComponent = {
				...newComponent,
				btStyles: {
					...newComponent.btStyles,
					[type]: type == 'borderWidth' ? parseInt(value) : value,
				},
			};
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
				this.props?.setActivePopupComponent(newComponent);
				if (type == 'animePreview') {
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

	handleDebounceProps = (type, e) => {
		const { name, value } = e.target;
		let newComponent = { ...this.state.activeComponent };
		if (type == 'borderWidth') {
			newComponent = {
				...newComponent,
				btStyles: {
					...newComponent.btStyles,
					[name]: parseInt(value),
				},
			};
		} else {
			newComponent = {
				...newComponent,
				linkUrl: value,
				linkType: 'url',
			};
			this.setState({ pageDropdown: false, sectionDropdown: false });
		}
		this.setState({ activeComponent: newComponent }, () => {
			this.debounceFuncForButton(() => {
				this.props?.setActivePopupComponent(newComponent);
			}, 1000);
		});
	};
	debounceFuncForButton = (func, delay = 800) => {
		if (this.state?.debounceStateForButton) {
			clearTimeout(this.state?.debounceStateForButton);
		}
		const debounceFunc = setTimeout(() => {
			func();
		}, delay);
		this.setState({ debounceStateForButton: debounceFunc });
	};
	render() {
		const buttonShape = [
			{
				name: 'rt',
				styles: {
					height: '38px',
					width: '66px',
					background: '#202123',
				},
			},
			{
				name: 'rt-border',
				styles: {
					height: '38px',
					width: '66px',
					borderRadius: '4px',
					background: '#202123',
				},
			},
			{
				name: 'rt-semi-border',
				styles: {
					height: '38px',
					width: '66px',
					borderRadius: '12px',
					background: '#202123',
				},
			},
			{
				name: 'rt-rounded-border',
				styles: {
					height: '38px',
					width: '66px',
					borderRadius: '100px',
					background: '#202123',
				},
			},
			{
				name: 'bt-border',
				styles: {
					height: '38px',
					width: '66px',
					background: '#202123',
					border: '1px solid #e4e5e629',
				},
			},
			{
				name: 'border-lt',
				styles: {
					height: '38px',
					width: '66px',
					borderRadius: '4px',
					background: '#202123',
					border: '1px solid #e4e5e629',
				},
			},
			{
				name: 'border-semi',
				styles: {
					height: '38px',
					width: '66px',
					borderRadius: '12px',
					background: '#202123',
					border: '1px solid #e4e5e629',
				},
			},
			{
				name: 'border-rounded',
				styles: {
					height: '38px',
					width: '66px',
					background: '#202123',
					borderRadius: '100px',
					border: '1px solid #e4e5e629',
				},
			},
		];
		return (
			<div className="elementPopupContainer" onClick={this.handlePopupClick}>
				{this.state.isAdjustment ? (
					<>
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
													adjustAnimation={this.handleActiveButtonStyles}
												/>
											</>
										) : this.state?.activeAnimeType === 'loop' ? (
											<>
												<LoopAdj
													activeComponent={this.state?.activeComponent}
													adjustAnimation={this.handleActiveButtonStyles}
												/>
											</>
										) : this.state?.activeAnimeType === 'scroll' ? (
											<>
												<ScrollAdj
													activeComponent={this.state?.activeComponent}
													adjustAnimation={this.handleActiveButtonStyles}
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
															this.handleActiveButtonStyles(
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
					</>
				) : (
					<>
						<div className="elementPopupHeader">
							{!this.props?.isLogicalFormText && (
								<p
									className={this.state.active === 'b' ? 'active' : ''}
									onClick={() => this.handleActive('b')}
								>
									Button
								</p>
							)}
							<p
								className={this.state.active === 'd' ? 'active' : ''}
								onClick={() => this.handleActive('d')}
							>
								Design
							</p>
							{!this.props?.isLogicalFormText && (
								<p
									className={this.state.active === 'a' ? 'active' : ''}
									onClick={() => this.handleActive('a')}
								>
									Animation
								</p>
							)}
						</div>
						<div className="element_image_container_main element-shapes-container">
							{this.state?.active == 'a' ? (
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
															this.handleActiveButtonStyles(
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
															this.handleActiveButtonStyles(
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
															this.handleActiveButtonStyles(
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
															this.handleActiveButtonStyles(
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
															this.handleActiveButtonStyles(
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
															this.handleActiveButtonStyles(
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
															this.handleActiveButtonStyles(
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
													// 	onClick={() =>
													// 		this.handleActiveTextProps('animePreview', true)
													// 	}
													// >
													// 	Preview Animation
													onClick={() =>
														// this.handleActiveImageStyles(
														// 	'animePreview',
														// 	true,
														// )
														this.setState({
															isAdjustment: true,
														})
													}
												>
													{/* Preview Animation */}
													Adjust Animation
												</div>
											</div>
										) : (
											''
										)}
									</div>
								</>
							) : this.state.active === 'b' ? (
								<div className="element_image">
									<div className="element_pasteURL" style={{ height: '325px' }}>
										<p className="heading">Link Pages</p>
										{this.state?.activeComponent?.linkType == 'section' ? (
											<>
												<div
													className="element_input"
													style={{
														flexDirection: 'row',
														alignItems: 'center',
													}}
												>
													<input
														type="text"
														name="link"
														placeholder="Link to Page or URL"
														value={
															'/' +
															this.state.activeComponent
																.linkModuleName
														}
														// onChange={(e) => this.handleActiveButtonStyles('linkUrl',e.target.value)}

														// disabled={this.state?.pageDropdown ? true : false}
													/>
													<Close
														style={{ cursor: 'pointer' }}
														onClick={() =>
															this.handleActiveButtonStyles(
																'remove',
																'link',
															)
														}
													/>
												</div>
											</>
										) : (
											<>
												<div
													className="element_input"
													style={{ cursor: 'pointer' }}
													onClick={() => {
														this.setState({
															pageDropdown: true,
														});
													}}
												>
													<input
														type="text"
														name="link"
														placeholder="Link to Page or URL"
														value={this.state.activeComponent.linkUrl}
														onChange={(e) =>
															this.handleDebounceProps('link', e)
														}

														// disabled={this.state?.pageDropdown ? true : false}
													/>
												</div>
											</>
										)}

										{this.state?.pageDropdown && (
											<>
												<div
													className="i-link-pages-container"
													onClick={(e) => e.stopPropagation()}
													// style={{ top: '153px' }}
												>
													<div className="i-link-pages-title">Pages</div>
													<div className="i-link-pages-list">
														{this.props?.modules?.map((module) => (
															<div
																className="i-link-pages-modules"
																onClick={() =>
																	this.handleActiveButtonStyles(
																		'page',
																		module,
																	)
																}
															>
																<Pages /> /{module?.label}
															</div>
														))}
													</div>
												</div>
											</>
										)}
										{this.state.sectionDropdown && (
											<>
												<div className="link-pages">
													<div className="heading">Scroll to</div>
													<div
														className="link-pages-input"
														onClick={() =>
															this.setState({
																sectionLinkDropdown:
																	!this.state.sectionLinkDropdown,
															})
														}
													>
														<div>scroll to Section</div>
														<DropDown
															style={{
																height: '15px',
																width: '15px',
																cursor: 'pointer',
																transform: this.state
																	.sectionLinkDropdown
																	? 'rotate(180deg)'
																	: 'rotate(0deg)',
															}}
														/>
													</div>
												</div>
												{this.state.sectionLinkDropdown && (
													<div className="link-sections-list">
														{this.props?.activeModuleSections?.map(
															(section, index) => (
																<div
																	className="link-pages-modules"
																	onClick={() =>
																		this.handleActiveButtonStyles(
																			'section',
																			section?._id,
																		)
																	}
																>{`Section - ${index + 1}`}</div>
															),
														)}
													</div>
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
												Open Link in New Tab
											</b>

											<label
												className="switch"
												onClick={() => {
													this.handleActiveButtonStyles(
														'openInNewTab',
														!this.state?.activeComponent?.openInNewTab,
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
														this.state?.activeComponent?.openInNewTab ??
														false
													}
												/>
												<span className="slider-round round"></span>
											</label>
										</div>
									</div>
								</div>
							) : (
								<div className="element_image">
									<div className="element_image">
										<div className="element_pasteURL">
											<p className="heading">Field Style</p>
											<div
												className="bt-shape-container"
												style={
													{
														// display: 'flex',
														// gap: '12px',
														// flexWrap: 'wrap',
														// padding: '8px',
													}
												}
											>
												{_.map(buttonShape, (shape) => (
													<div
														key={shape.name}
														style={shape.styles}
														className={
															shape.name ===
															this.state.activeComponent?.shape
																? 'activeButtonShape'
																: ''
														}
														onClick={() =>
															this.handleActiveButtonStyles(
																'shape',
																shape.name,
															)
														}
													></div>
												))}
											</div>
											<div className="line"></div>
											<div
												className="block_styles pad-color-p-imp"
												style={{ padding: '12px 0px' }}
											>
												<ColorPicker
													title={'Fill Color'}
													color={
														this.state?.activeImageSubBlock?.btStyles
															?.background
													}
													handleColor={(e) =>
														this.handleActiveButtonStyles(
															'background',
															e,
														)
													}
													brandColors={this.props?.brandColors}
													zoom={0.8}
													isDarkBg={true}
												/>
											</div>
											<div className="line"></div>
											<div
												className=" bs-item bs-item-row animated-item"
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													margin: '20px 0px',
												}}
											>
												<b style={{ textTransform: 'capitalize' }}>
													Stroke
												</b>

												<label
													className="switch"
													onClick={() => {
														this.handleActiveButtonStyles(
															'stroke',
															!this.state?.activeComponent?.btStyles
																?.stroke,
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
															this.state?.activeComponent?.btStyles
																?.stroke ?? false
														}
													/>
													<span className="slider-round round"></span>
												</label>
											</div>
											{this.state?.activeComponent?.btStyles?.stroke && (
												<>
													<div
														className="block_styles pad-color-p-imp"
														style={{ padding: '12px 0px' }}
													>
														<ColorPicker
															title={'Border Color'}
															color={
																this.state?.activeImageSubBlock
																	?.btStyles?.borderColor
															}
															handleColor={(e) =>
																this.handleActiveButtonStyles(
																	'borderColor',
																	e,
																)
															}
															brandColors={this.props?.brandColors}
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
																	max={100}
																	step={2}
																	value={
																		this.state?.activeComponent
																			?.btStyles?.borderWidth
																	}
																	name="borderWidth"
																	onChange={(e) =>
																		this.handleDebounceProps(
																			'borderWidth',
																			e,
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
																		?.btStyles?.borderWidth
																}
																px
															</p>
														</div>
													</div>
												</>
											)}
											<div className="line"></div>
											<b style={{ textTransform: 'capitalize' }}>
												Paste Your Link Here
											</b>
											{this.props?.isLogicalFormText && (
												<>
													<div
														className="element_input"
														style={{ cursor: 'pointer' }}
													>
														<input
															type="text"
															name="link"
															placeholder="Link to URL"
															value={
																this.state.activeComponent.linkUrl
															}
															onChange={(e) =>
																this.handleDebounceProps('link', e)
															}
														/>
													</div>
												</>
											)}
										</div>
									</div>
								</div>
							)}
						</div>
					</>
				)}
			</div>
		);
	}
}
