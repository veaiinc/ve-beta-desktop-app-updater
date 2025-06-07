import React, { Component } from 'react';
import './elementPopup.scss';
import ColorPicker from '../../properties/colorpicker';

// svgs
import { ReactComponent as SearchIcon } from '../svgs/smartFieldsvg/Search.svg';
import { ReactComponent as Close } from '../svgs/popupSvgs/Close.svg';
import { ReactComponent as Pages } from '../svgs/Pages.svg';
import { ReactComponent as DropDown } from '../../../../assets/svg/dropDown.svg';
import { ReactComponent as Arrow } from '../svgs/arrow.svg';
import { ReactComponent as Right } from '../../../../assets/svg/right.svg';
import { ReactComponent as Left } from '../../../../assets/svg/left.svg';
import { ReactComponent as Center } from '../../../../assets/svg/center.svg';

//! journey icons
import { journeyIcons } from '../elements/jicon/journeyIcons';

// !anime popups
import LoopPopup from '../../animePopups/LoopPopup';
import HoverPopup from '../../animePopups/HoverPopup';
import ScrollPopup from '../../animePopups/ScrollPopup';

// * animations adjustments popups
import HoverPressAdj from '../../animePopups/HoverPressAdj';
import LoopAdj from '../../animePopups/LoopAdj';
import ScrollAdj from '../../animePopups/ScrollAdj';
import AnimeLoader from '../svgs/adjustmentSvgs/AnimeLoader';
import _ from 'lodash';

export default class IconPopup extends Component {
	constructor(props) {
		super(props);
		this.iconRefs = []; // Array to hold refs for each icon
		this.iconsContainerRef = null;
		this.state = {
			activeComponent: props?.activeComponent || {},
			active: 'i',
			activeJIcon: this.props?.activeComponent?.icon || '',
			searchedIcon: '',
			hasScrolled: false,

			pageDropdown: false,
			sectionDropdown: false,
			sectionLinkDropdown: false,

			activeAnimeType: props?.activeComponent?.animations?.animeType || '',
			activeAnimeName: props?.activeComponent?.animations?.animeName || '',
			isAdjustment: false,
			showAnimeLoader: false,
			highlightIndex: -1,
			highlightLength: 2,
			message: 'Initializing',
		};
		this.fileInputRef = React.createRef();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.activeComponent !== this.state.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
				activeJIcon: nextProps.activeComponent?.icon || '',
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
	componentDidUpdate = (prevState) => {
		if (prevState.activeJIcon !== this.state.activeJIcon) {
			if (!this.state.hasScrolled) {
				this.scrollToActiveIcon();
			}
		}
		if (prevState?.showAnimeLoader !== this.state?.showAnimeLoader) {
			this.showLoaderAnimation();
		}
	};
	componentDidMount = () => {
		// setTimeout(() => {
		this.scrollToActiveIcon();
		// }, 500);
		if (this.intervalRef) clearInterval(this.intervalRef);
	};
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
	scrollToActiveIcon = () => {
		const filteredIcons = journeyIcons?.filter((icon) => {
			const searchTerm = this.state?.searchedIcon?.toLowerCase() || '';

			// Check if the search term is in the icon name
			const nameMatch = icon?.name?.toLowerCase()?.includes(searchTerm);

			// Check if the search term is in any of the tags
			const tagMatch = icon?.tags?.some((tag) => tag?.toLowerCase()?.includes(searchTerm));

			// Return true if either name or tags match the search term
			return nameMatch || tagMatch;
		});

		const activeIndex = filteredIcons?.findIndex(
			(icon) => icon?.name === this.state?.activeJIcon,
		);

		if (activeIndex !== -1 && this.iconRefs[activeIndex] && !this.state.hasScrolled) {
			this.iconRefs[activeIndex].scrollIntoView({
				behavior: 'smooth', // Smooth scrolling
				block: 'nearest', // Scroll just enough to make the item visible
				inline: 'nearest', // Align horizontally (if needed)
			});

			// Set the flag to true after scrolling
			this.setState({ hasScrolled: true });
		}
	};

	handleActive = (type) => {
		this.setState({
			active: type,
		});
	};

	// button styles function

	handleIconProps = (type, value, extra = false, transform = '') => {
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
		if (type == 'extraStyles') {
			newComponent = {
				...newComponent,
				extraStyles: {
					...newComponent.extraStyles,
					[extra]: value,
				},
			};
		} else if (type == 'remove') {
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
				if (
					(type === 'extraStyles' && extra == 'thickness') ||
					type == 'size' ||
					type == 'mSize' ||
					type == 'link'
				) {
					this.debounceFuncForIcon(() => {
						this.props?.setActivePopupComponent(newComponent);
					}, 1000);
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

	debounceFuncForIcon = (func, delay = 800) => {
		if (this.state?.debounceStateIcon) {
			clearTimeout(this.state?.debounceStateIcon);
		}
		const debounceFunc = setTimeout(() => {
			func();
		}, delay);
		this.setState({ debounceStateIcon: debounceFunc });
	};

	render() {
		// Filter icons based on search term
		const filteredIcons = journeyIcons?.filter((icon) => {
			const searchTerm = this.state?.searchedIcon?.toLowerCase() || '';

			// Check if the search term is in the icon name
			const nameMatch = icon?.name?.toLowerCase()?.includes(searchTerm);

			// Check if the search term is in any of the tags
			const tagMatch = icon?.tags?.some((tag) => tag?.toLowerCase()?.includes(searchTerm));

			// Return true if either name or tags match the search term
			return nameMatch || tagMatch;
		});

		const getUpdatedSvg = (svg, color) => {
			const hasFill = /fill="[^"]*"/.test(svg);
			const hasStroke = /stroke="[^"]*"/.test(svg);

			// Replace `fill` only if it's present and not "none"
			if (hasFill) {
				svg = svg.replace(/fill="[^"]*"/g, (match) =>
					match.includes('none') ? match : `fill="${color}"`,
				);
			}

			// Replace `stroke` only if it's present and not "none"
			if (hasStroke) {
				svg = svg.replace(/stroke="[^"]*"/g, (match) =>
					match.includes('none') ? match : `stroke="${color}"`,
				);
			}

			return svg;
		};

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
												adjustAnimation={(t, v, transform = '') =>
													this.handleIconProps(t, v, false, transform)
												}
											/>
										</>
									) : this.state?.activeAnimeType === 'loop' ? (
										<>
											<LoopAdj
												activeComponent={this.state?.activeComponent}
												adjustAnimation={(t, v, transform = '') =>
													this.handleIconProps(t, v, false, transform)
												}
											/>
										</>
									) : this.state?.activeAnimeType === 'scroll' ? (
										<>
											<ScrollAdj
												activeComponent={this.state?.activeComponent}
												adjustAnimation={(t, v, transform = '') =>
													this.handleIconProps(t, v, false, transform)
												}
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
														this.handleIconProps('animePreview', true)
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
								className={this.state.active === 'i' ? 'active' : ''}
								onClick={() => this.handleActive('i')}
							>
								Icons
							</p>
							<p
								className={this.state.active === 'a' ? 'active' : ''}
								onClick={() => this.handleActive('a')}
							>
								Animation
							</p>
						</div>
						<div className="element_image_container_main element-shapes-container">
							{this.state?.active == 'i' ? (
								<>
									<div
										className="element_image stylesMainContainer"
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: '15px',
										}}
									>
										<div
											className="j-icon-search-container"
											style={{ paddingTop: '0px' }}
										>
											<p className="heading">Search Icon</p>
											<div className="j-icon-search">
												<div className="j-icon-search-input">
													<SearchIcon />

													<input
														placeholder="search here"
														type="text"
														value={this.state?.searchedIcon}
														onChange={(e) => {
															this.setState({
																searchedIcon: e.target?.value,
															});
														}}
													/>
												</div>
											</div>
										</div>
										<div
											className="j-icons-lists"
											ref={(el) => (this.iconsContainerRef = el)}
										>
											{filteredIcons.length > 0 &&
												filteredIcons.map((icon, index) => (
													<div
														key={index}
														ref={(el) => (this.iconRefs[index] = el)}
														title={icon?.tooltip}
														className={
															this.state?.activeComponent?.icon ===
																icon?.name && 'active-jicon'
														}
														dangerouslySetInnerHTML={{
															__html: getUpdatedSvg(
																icon?.svg,
																'#9B9290',
															),
														}}
														onClick={() => {
															this.handleIconProps(
																'icon',
																icon?.name,
															);
														}}
													></div>
												))}
										</div>
										<div className="line"></div>
										<div className="popup-shapes-range-wrapper">
											<b> Style</b>
										</div>
										<div className="stylesContainer">
											<p
												className={
													this.state.activeComponent?.extraStyles
														?.bgStyle == 'none'
														? 'active'
														: ''
												}
												onClick={() =>
													this.handleIconProps(
														'extraStyles',
														'none',
														'bgStyle',
													)
												}
											>
												Default
											</p>
											<p
												className={
													this.state.activeComponent?.extraStyles
														?.bgStyle == 'solid'
														? 'active'
														: ''
												}
												onClick={() =>
													this.handleIconProps(
														'extraStyles',
														'solid',
														'bgStyle',
													)
												}
											>
												Solid
											</p>
											<p
												className={
													this.state.activeComponent?.extraStyles
														?.bgStyle == 'outline'
														? 'active'
														: ''
												}
												onClick={() =>
													this.handleIconProps(
														'extraStyles',
														'outline',
														'bgStyle',
													)
												}
											>
												Outline
											</p>
										</div>
										{(this.state.activeComponent?.extraStyles?.bgStyle ==
											'solid' ||
											this.state.activeComponent?.extraStyles?.bgStyle ==
												'outline') && (
											<>
												<div className="popup-shapes-range-wrapper">
													<div className="popup-stroke-styles">
														<span
															className={
																this.state?.activeComponent
																	?.extraStyles?.bgType ===
																'no-curve'
																	? 'active-stroke-style'
																	: ''
															}
															onClick={() => {
																this.handleIconProps(
																	'extraStyles',
																	'no-curve',
																	'bgType',
																);
															}}
														>
															<div
																className="square-style-iconbg"
																style={{
																	width: '14px',
																	height: '14px',
																	border: `1px solid ${
																		this.state?.activeComponent
																			?.extraStyles
																			?.bgType === 'no-curve'
																			? '#f1f1f1'
																			: '#7C7C84'
																	}`,
																	background:
																		this.state.activeComponent
																			?.extraStyles
																			?.bgStyle == 'solid'
																			? this.state
																					?.activeComponent
																					?.extraStyles
																					?.bgType ===
																			  'no-curve'
																				? '#f1f1f1'
																				: '#7C7C84'
																			: '',
																}}
															></div>
														</span>
														<span
															className={
																this.state?.activeComponent
																	?.extraStyles?.bgType ===
																'semi-curve'
																	? 'active-stroke-style'
																	: ''
															}
															onClick={() => {
																this.handleIconProps(
																	'extraStyles',
																	'semi-curve',
																	'bgType',
																);
															}}
														>
															<div
																className="square-style-iconbg"
																style={{
																	width: '14px',
																	height: '14px',
																	border: `1px solid ${
																		this.state?.activeComponent
																			?.extraStyles
																			?.bgType ===
																		'semi-curve'
																			? '#f1f1f1'
																			: '#7C7C84'
																	}`,
																	borderRadius: '4px',
																	background:
																		this.state.activeComponent
																			?.extraStyles
																			?.bgStyle == 'solid'
																			? this.state
																					?.activeComponent
																					?.extraStyles
																					?.bgType ===
																			  'semi-curve'
																				? '#f1f1f1'
																				: '#7C7C84'
																			: '',
																}}
															></div>
														</span>
														<span
															className={
																this.state?.activeComponent
																	?.extraStyles?.bgType ===
																'curved'
																	? 'active-stroke-style'
																	: ''
															}
															onClick={() => {
																this.handleIconProps(
																	'extraStyles',
																	'curved',
																	'bgType',
																);
															}}
														>
															<div
																className="square-style-iconbg"
																style={{
																	width: '14px',
																	height: '14px',
																	border: `1px solid ${
																		this.state?.activeComponent
																			?.extraStyles
																			?.bgType === 'curved'
																			? '#f1f1f1'
																			: '#7C7C84'
																	}`,
																	borderRadius: '50%',
																	background:
																		this.state.activeComponent
																			?.extraStyles
																			?.bgStyle == 'solid'
																			? this.state
																					?.activeComponent
																					?.extraStyles
																					?.bgType ===
																			  'curved'
																				? '#f1f1f1'
																				: '#7C7C84'
																			: '',
																}}
															></div>
														</span>
													</div>
												</div>
											</>
										)}
										{this.state.activeComponent?.extraStyles?.bgStyle ==
											'outline' && (
											<>
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
																max={50}
																step={0.5}
																value={
																	this.state?.activeComponent
																		?.extraStyles?.thickness
																}
																onChange={(e) =>
																	this.handleIconProps(
																		'extraStyles',
																		e.target.value,
																		'thickness',
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
																	?.extraStyles?.thickness
															}
															px
														</p>
													</div>
												</div>
											</>
										)}
										<div className="icon-align-div">
											<p className="heading">Align</p>
											<div className="icon-align-options">
												<div
													className={`icon-align-option ${
														this.state?.activeComponent?.extraStyles
															?.align == 'left'
															? 'active'
															: ''
													}`}
													onClick={() =>
														this.handleIconProps(
															'extraStyles',
															'left',
															'align',
														)
													}
												>
													<Right />
												</div>
												<div
													className={`icon-align-option ${
														this.state?.activeComponent?.extraStyles
															?.align == 'center' ||
														!_.has(
															this.state?.activeComponent
																?.extraStyles,
															'align',
														)
															? 'active'
															: ''
													}`}
													onClick={() =>
														this.handleIconProps(
															'extraStyles',
															'center',
															'align',
														)
													}
												>
													<Left />
												</div>
												<div
													className={`icon-align-option ${
														this.state?.activeComponent?.extraStyles
															?.align == 'right'
															? 'active'
															: ''
													}`}
													onClick={() =>
														this.handleIconProps(
															'extraStyles',
															'right',
															'align',
														)
													}
												>
													<Center />
												</div>
											</div>
										</div>
										<div className="element_pasteURL">
											<p className="heading">Connect to any Page or URL</p>
											{this.state?.activeComponent?.linkType == 'section' ? (
												<>
													<div
														className="element_input"
														style={{
															flexDirection: 'row',
															alignItems: 'center',
														}}
														onClick={(e) => e.stopPropagation()}
													>
														<input
															type="text"
															name="link"
															placeholder="Link to Page or URL"
															value={
																'/' +
																this.state?.activeComponent
																	?.linkModuleName
															}
															// onChange={(e) => this.handleActiveButtonStyles('linkUrl',e.target.value)}

															// disabled={this.state?.pageDropdown ? true : false}
														/>
														<Close
															style={{ cursor: 'pointer' }}
															onClick={() =>
																this.handleIconProps(
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
														onClick={(e) => {
															e.stopPropagation();
															this.setState({
																pageDropdown: true,
															});
														}}
													>
														<input
															type="text"
															name="link"
															placeholder="Link to Page or URL"
															value={
																this.state?.activeComponent?.linkUrl
															}
															onChange={(e) =>
																this.handleIconProps(
																	'link',
																	e.target.value,
																)
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
														<div className="i-link-pages-title">
															Pages
														</div>
														<div className="i-link-pages-list">
															{this.props?.modules?.map((module) => (
																<div
																	className="i-link-pages-modules"
																	onClick={() =>
																		this.handleIconProps(
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
																		!this.state
																			.sectionLinkDropdown,
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
																			this.handleIconProps(
																				'section',
																				section?._id,
																			)
																		}
																	>{`Section - ${
																		index + 1
																	}`}</div>
																),
															)}
														</div>
													)}
												</>
											)}
										</div>

										{/* ! commented for now as we don't have alignment for single icon */}
										{/* <div className="popup-shapes-range-wrapper">
							<b> Alignment</b>
							<div className="popup-stroke-styles">
								<span
									className={
										this.state?.activeComponent?.strokeStyles?.strokeStyle ===
										'dashed'
											? 'active-stroke-style'
											: ''
									}
									onClick={() => {
										this.handleActiveStickerStyles('strokeStyle', 'dashed');
									}}
								>
									<Left />
								</span>
								<span
									className={
										this.state?.activeComponent?.strokeStyles?.strokeStyle ===
										'dashed'
											? 'active-stroke-style'
											: ''
									}
									onClick={() => {
										this.handleActiveStickerStyles('strokeStyle', 'dashed');
									}}
								>
									<Center />
								</span>
								<span
									className={
										this.state?.activeComponent?.strokeStyles?.strokeStyle ===
										'dashed'
											? 'active-stroke-style'
											: ''
									}
									onClick={() => {
										this.handleActiveStickerStyles('strokeStyle', 'dashed');
									}}
								>
									<Right />
								</span>
							</div>
						</div> */}
										<div className="line"></div>
										<div
											className="block_styles pad-color-p-imp"
											style={{ padding: '12px 0px' }}
										>
											<ColorPicker
												title={' Icon Color'}
												color={this.state?.activeComponent?.color}
												handleColor={(e) =>
													this.handleIconProps('color', e)
												}
												brandColors={this.props?.brandColors}
												zoom={0.8}
												isDarkBg={true}
											/>
										</div>

										<div className="popup-shapes-range-wrapper">
											<b>Icon Size</b>
											<div className="popup-range-div">
												<div
													style={{
														display: 'flex',
														maxWidth: 170,
													}}
												>
													<input
														type="range"
														min={8}
														max={100}
														step={1}
														value={
															this.props?.previewType == 'm'
																? this.state?.activeComponent?.mSize
																: this.state?.activeComponent?.size
														}
														onChange={(e) =>
															this.handleIconProps(
																this.props?.previewType == 'm'
																	? 'mSize'
																	: 'size',
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
													{this.props?.previewType == 'm'
														? this.state?.activeComponent?.mSize
														: this.state?.activeComponent?.size}
													px
												</p>
											</div>
										</div>
										<div className="line"></div>
										{this.state.activeComponent?.extraStyles?.bgStyle !=
											'outline' && (
											<div
												className="block_styles pad-color-p-imp"
												style={{ padding: '12px 0px' }}
											>
												<ColorPicker
													title={' Card Color'}
													color={this.state?.activeComponent?.cardColor}
													handleColor={(e) =>
														this.handleIconProps('cardColor', e)
													}
													brandColors={this.props?.brandColors}
													zoom={0.8}
													isDarkBg={true}
												/>
											</div>
										)}
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
															this.handleIconProps(
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
															this.handleIconProps(
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
															this.handleIconProps(
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
															this.handleIconProps(
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
														this.handleIconProps('animeName', e)
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
														this.handleIconProps('animeName', e)
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
														this.handleIconProps('animeName', e)
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
