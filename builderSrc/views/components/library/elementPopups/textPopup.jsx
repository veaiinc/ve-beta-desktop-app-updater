import React, { Component } from 'react';
// import ColorPicker from '../../properties/colorpicker/index';
// import { SliderPicker } from 'react-color';

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
import { ReactComponent as SearchIcon } from '../svgs/smartFieldsvg/Search.svg';
import { ReactComponent as DropDown } from '../../../../assets/svg/dropDown.svg';
import { ReactComponent as ActiveTick } from '../svgs/tick.svg';
import { ReactComponent as Right } from '../../../../assets/svg/center.svg';
import { ReactComponent as Left } from '../../../../assets/svg/right.svg';
import { ReactComponent as Center } from '../../../../assets/svg/left.svg';
import { ReactComponent as Justify } from '../../../../assets/svg/justify.svg';
import { ReactComponent as Top } from '../svgs/alignment/TopAlign.svg';
import { ReactComponent as Bottom } from '../svgs/alignment/BottomAlign.svg';
import { ReactComponent as Middle } from '../svgs/alignment/CenterAlign.svg';
import { ReactComponent as Arrow } from '../svgs/arrow.svg';

import ColorPicker from '../../properties/colorpicker';
import _ from 'lodash';
export default class TextPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			colors: [
				{
					0: [
						'#EACEC5',
						'#FEB99A',
						'#FA3E31',
						'#E5573F',
						'#A8616A',
						'#BC6352',
						'#F7D755',
						'#FFF700',
						'#B78300',
					],
				},
				{
					1: [
						'#E0B1A9',
						'#ECC5C3',
						'#FD6E60',
						'#7C3D2B',
						'#DFAAAB',
						'#CCA96E',
						'#D19B80',
						'#F0B216',
						'#F7DE00',
						'#91776C',
					],
				},
				{
					2: [
						'#FBEFEB',
						'#DED2C3',
						'#CD393A',
						'#B8793E',
						'#D35C85',
						'#D897A0',
						'#F39983',
						'#EBCFB8',
						'#FFF886',
					],
				},
				{
					3: [
						'#D46E6C',
						'#FFD0AE',
						'#FF4275',
						'#A81902',
						'#F1AC7E',
						'#E8CA70',
						'#FF9110',
						'#FF9110',
						'#EECE7C',
						'#F4EBDD',
						'#677659',
					],
				},
				{
					4: [
						'#FBDFD9',
						'#EFB5A1',
						'#F6642B',
						'#FF9247',
						'#D9855E',
						'#F1B314',
						'#EAD226',
						'#E3DAC0',
						'#F7E3C3',
					],
				},
				{
					5: [
						'#DFDAC2',
						'#BAD1C1',
						'#43A42E',
						'#55AEA3',
						'#78B8AD',
						'#70BAD1',
						'#A0FBFE',
						'#73BDF8',
						'#B7C0DC',
						'#FF5FAD',
					],
				},
				{
					6: [
						'#ABA77C',
						'#2DD29B',
						'#A3DABC',
						'#B3CCAD',
						'#2B63D2',
						'#008BD2',
						'#9FC1DB',
						'#CCBAC7',
						'#DB829D',
					],
				},
				{
					7: [
						'#B1BBAF',
						'#9CC4C8',
						'#48A77E',
						'#DCFFE1',
						'#96ACA7',
						'#A4E9EE',
						'#8599C5',
						'#465FEB',
						'#DACFEE',
						'#B984AA',
					],
				},
				{
					8: [
						'#ADAFAC',
						'#B4C97C',
						'#55B794',
						'#01584E',
						'#2DA0D2',
						'#9DB8FF',
						'#C4D5FF',
						'#C8B4E6',
						'#FB99B9',
					],
				},
				{
					9: [
						'#CCE3FF',
						'#D0D5D2',
						'#76AAB0',
						'#33887E',
						'#2A2F8D',
						'#6A95BB',
						'#9EACE8',
						'#79A7DB',
						'#BE96D9',
						'#F4E0FF',
					],
				},
				{
					10: [
						'#000000',
						'#383838',
						'#797979',
						'#999999',
						'#B8B8B8',
						'#D7D7D7',
						'#ECECEC',
						'#FFFFFF',
						'',
					],
				},
			],
			color: '#000000',
			inputColor: '#000000',
			// color: props?.elementFontColor,
			// inputColor: props?.elementFontColor,
			active: props?.textTab || 'f',

			showFontsDropDown: false,
			showFontsVariantDropDown: false,
			searchFont: '',

			activeFont: props?.fontFamily,
			fontSize: props.activeComponent?.fontSize || props.fontSize || 16,
			lineHeight: props?.lineHeight,
			letterSpacing: props?.letterSpacing,

			activeFontVariant: '',
			activeFontWeight: '',
			activeFontStyle: '',

			justifyleft: props.justifyleft,
			justifycenter: props.justifycenter,
			justifyright: props.justifyright,
			justifyfull: props.justifyfull,

			showSpacing: false,
			debounceStateForFontProps: null,

			activeAnimeType: props?.activeComponent?.animations?.animeType || '',
			activeAnimeName: props?.activeComponent?.animations?.animeName || '',
			isAdjustment: false,
			showAnimeLoader: false,
			highlightIndex: -1,
			highlightLength: 2,
			message: 'Initializing',
			verticalAlign: 'flex-start',
		};

		this.dropdownref = React.createRef();
		this.dropdownfontref = React.createRef();
		this.fontSizeInputRef = React.createRef();
		this.searchFontInputRef = React.createRef(); // Add new ref
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeComponent !== this.state.activeComponent) {
			this.setState({
				activeComponent: nextProps.activeComponent,
				activeAnimeType: nextProps.activeComponent?.animations?.animeType || 'hover	',
				activeAnimeName: nextProps.activeComponent?.animations?.animeName || '',
			});
		}
		if (nextProps.fontFamily !== this.state.activeFont) {
			this.setState({
				activeFont: nextProps.fontFamily,
			});
		}
		if (
			nextProps.fontSize !== this.state.fontSize ||
			nextProps.activeComponent?.fontSize !== this.state.fontSize
		) {
			this.setState({
				fontSize:
					nextProps.activeComponent?.fontSize ||
					nextProps.fontSize ||
					this.state.fontSize,
			});
		}
		if (nextProps.lineHeight !== this.state.lineHeight) {
			this.setState({
				lineHeight: nextProps.lineHeight,
			});
		}
		if (nextProps.letterSpacing !== this.state.letterSpacing) {
			this.setState({
				letterSpacing: nextProps.letterSpacing,
			});
		}

		// if (nextProps.elementFontColor !== this.state.color) {
		// 	this.setState({
		// 		color: nextProps.elementFontColor,
		// 		inputColor: nextProps.elementFontColor,
		// 	});
		// }
		if (nextProps.justifyleft !== this.state.justifyleft) {
			this.setState({
				justifyleft: nextProps.justifyleft,
			});
		}
		if (nextProps.justifycenter !== this.state.justifycenter) {
			this.setState({
				justifycenter: nextProps.justifycenter,
			});
		}
		if (nextProps.justifyright !== this.state.justifyright) {
			this.setState({
				justifyright: nextProps.justifyright,
			});
		}
		if (nextProps.justifyfull !== this.state.justifyfull) {
			this.setState({
				justifyfull: nextProps.justifyfull,
			});
		}
	}

	componentDidMount = () => {
		if (this.state.active === 'f') {
			this.focusFontSizeInput();
		}
		this.focusInterval = setInterval(() => {
			if (this.state.showFontsDropDown && this.searchFontInputRef.current) {
				this.searchFontInputRef.current.focus();
			} else if (this.fontSizeInputRef.current) {
				this.fontSizeInputRef.current.focus();
			}
		}, 100);
		document.addEventListener('mousedown', this.handleClickOutside);
	};
	componentDidUpdate(prevProps, prevState) {
		if (prevState?.showAnimeLoader !== this.state?.showAnimeLoader) {
			this.showLoaderAnimation();
		}
	}
	componentWillUnmount = () => {
		if (this.focusInterval) {
			clearInterval(this.focusInterval);
		}
		if (this.intervalRef) clearInterval(this.intervalRef);
		document.removeEventListener('mousedown', this.handleClickOutside);
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

	handleClickOutside = (event) => {
		if (this.dropdownref.current && !this.dropdownref.current.contains(event.target)) {
			this.setState({
				showFontsDropDown: false,
			});
		}
		if (this.dropdownfontref.current && !this.dropdownfontref.current.contains(event.target)) {
			this.setState({
				showFontsVariantDropDown: false,
			});
		}
	};
	focusFontSizeInput = () => {
		if (this.fontSizeInputRef.current) {
			this.fontSizeInputRef.current.focus();
		}
	};
	handleActive = (type) => {
		this.setState(
			{
				active: type,
				activeAnimeType: type === 'a' ? 'hover' : this.state.activeAnimeType,
			},
			() => {
				if (type === 'f') {
					this.focusFontSizeInput();
				}
			},
		);
	};

	// ! Fonts functions
	toggleFontsDropDown = (e) => {
		e.stopPropagation();

		this.setState({
			showFontsVariantDropDown: false,
			showFontsDropDown: !this.state.showFontsDropDown,
		});
	};

	toggleFontsVariantDropDown = (e) => {
		e.stopPropagation();
		this.setState({
			showFontsDropDown: false,
			showFontsVariantDropDown: !this.state.showFontsVariantDropDown,
		});
	};

	handleFontFamily = (e = null, type, font) => {
		e.stopPropagation();
		if (type === 'fontName') {
			this.setState(
				{
					activeFont: font,
					searchFont: '',
				},
				() => {
					this.props.changeFontColor('fontName', font);
				},
			);
		} else if (type == 'fontWeight') {
			this.setState(
				{
					activeFontVariant: font.variant,
					activeFontWeight: font.weight,
					activeFontStyle: font.style,
				},
				() => {
					this.props.changeFontColor('fontWeight', this.state.activeFontWeight);
					setTimeout(() => {
						this.props.changeFontColor('fontStyle', this.state.activeFontStyle);
					}, 1000);
				},
			);
		} else if (type == 'fontSize') {
			this.setState(
				{
					fontSize: font,
				},
				() => {
					// if (type == true) {
					// this.debounceFuncForFontProps(() => {
					this.props.changeFontColor('fontSize', font?.toString());
					// }, 1000);
					// }
				},
			);
		} else if (type == 'lineHeight') {
			this.setState(
				{
					lineHeight: font,
				},
				() => {
					this.debounceFuncForFontProps(() => {
						this.props.changeFontColor('lineHeight', font);
					}, 1000);
				},
			);
		} else if (type == 'letterSpacing') {
			this.setState(
				{
					letterSpacing: font,
				},
				() => {
					this.debounceFuncForFontProps(() => {
						this.props.changeFontColor('letterSpacing', font);
					}, 1000);
				},
			);
		} else if (type == 'align') {
			this.setState(
				{
					align: font,
					[font]: true,
				},
				() => {
					if (this.props?.previewType == 'm') {
						this.props.changeFontColor(font, null);
					} else {
						this.props.changeFontColor('align', font, e);
					}
				},
			);
		} else if (type == 'justify') {
			this.setState(
				{
					verticalAlign: font,
				},
				() => {
					this.props.handleVerticleAlign('verticalAlign', font);
				},
			);
		}
	};

	// ! debounce for font props
	debounceFuncForFontProps = (func, delay = 600) => {
		if (this.state.debounceStateForFontProps) {
			clearTimeout(this.state.debounceStateForFontProps);
		}
		const TimeoutFunc = setTimeout(() => {
			func();
		}, delay);
		this.setState({
			debounceStateForFontProps: TimeoutFunc,
		});
	};

	handleSetColorFromPicks = (e, v) => {
		// e.stopPropagation();
		this.setState(
			{
				color: v,
				inputColor: v,
			},
			() => {
				if (this.props?.previewType == 'm') {
					this.props.changeFontColor('foreColor', v);
				} else {
					this.state?.activeComponent?.type == 'button'
						? this.props.changeFontColor('foreColor', v)
						: this.props.handleColor(v, 'foreColor');
				}
			},
		);
	};

	// ! for updating component
	handleActiveTextProps = (type, value, transform = '') => {
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

	render() {
		let fonts = [...(this.props?.fonts || [])];
		return (
			<>
				<div className="elementPopupContainer">
					{this.state.isAdjustment ? (
						<>
							<>
								<div className="element_image_container_main element-shapes-container">
									<div className="element_image">
										<div className="anime-adjustment-header">
											<Arrow
												style={{ rotate: '180deg', cursor: 'pointer' }}
												onClick={() =>
													this.setState({ isAdjustment: false })
												}
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
														activeComponent={
															this.state?.activeComponent
														}
														adjustAnimation={this.handleActiveTextProps}
													/>
												</>
											) : this.state?.activeAnimeType === 'loop' ? (
												<>
													<LoopAdj
														activeComponent={
															this.state?.activeComponent
														}
														adjustAnimation={this.handleActiveTextProps}
													/>
												</>
											) : this.state?.activeAnimeType === 'scroll' ? (
												<>
													<ScrollAdj
														activeComponent={
															this.state?.activeComponent
														}
														adjustAnimation={this.handleActiveTextProps}
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
																							this
																								.state
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
																this.handleActiveTextProps(
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
								<p
									className={this.state.active === 'f' ? 'active' : ''}
									onClick={() => this.handleActive('f')}
								>
									Font
								</p>
								<p
									className={this.state.active === 'c' ? 'active' : ''}
									onClick={() => this.handleActive('c')}
								>
									Color
								</p>
								{this.state?.activeComponent?.type == 'button' ||
								this.props?.isLogicalFormText ? (
									''
								) : (
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
																this.handleActiveTextProps(
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
																this.handleActiveTextProps(
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
																this.handleActiveTextProps(
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
																this.handleActiveTextProps(
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
												{/* scroll component */}
												{this.state?.activeAnimeType == 'loop' ? (
													<LoopPopup
														activeElementAnimeName={
															this.state?.activeAnimeName
														}
														handleElementAnimationsValue={(e) =>
															this.handleActiveTextProps(
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
															this.handleActiveTextProps(
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
															this.handleActiveTextProps(
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
								) : this.state?.active == 'f' ? (
									<>
										<div className="element_image">
											<div className="element_pasteURL">
												<>
													<p className="heading">Font</p>
													<div
														className="element_input"
														style={{
															flexDirection: 'row',
															alignItems: 'center',
															cursor: 'pointer',
														}}
														onClick={(e) => {
															this.toggleFontsDropDown(e);
														}}
													>
														<span
															style={{
																fontSize: '13px',
																color: '#f1f1f1',
																cursor: 'pointer',
																width: '100%',
																height: '100%',
															}}
														>
															{this.state.activeFont
																? this.state.activeFont
																: 'Font Family'}
														</span>

														<DropDown
															style={{
																cursor: 'pointer',
																rotate: !this.state
																	.showFontsDropDown
																	? '0deg'
																	: '180deg',
															}}
														/>
													</div>
													{this.state.showFontsDropDown ? (
														<>
															<div
																className="fonts-dropdown"
																ref={this.dropdownref}
															>
																<div
																	style={{
																		width: '100%',
																		position: 'sticky',
																		top: '0px',
																		background: '#171717',
																		zIndex: 10,
																	}}
																	className="font-search-container"
																>
																	<SearchIcon />
																	<input
																		ref={
																			this.searchFontInputRef
																		}
																		className="font-search"
																		value={
																			this.state.searchFont
																		}
																		onChange={(e) =>
																			this.setState({
																				searchFont:
																					e.target.value,
																			})
																		}
																		placeholder={'Search Font'}
																	/>
																</div>

																{(() => {
																	const searchFiltered =
																		fonts.filter(
																			(font) =>
																				this.state
																					.searchFont ===
																					'' ||
																				font.fontName
																					?.toLowerCase()
																					?.includes(
																						this.state.searchFont?.toLowerCase(),
																					),
																		);

																	// Group fonts by their 'group' property
																	let groupedFonts = _.groupBy(
																		searchFiltered,
																		'group',
																	);

																	return Object.entries(
																		groupedFonts,
																	).map(
																		([
																			groupName,
																			groupFonts,
																		]) => (
																			<div
																				key={groupName}
																				className="font-group"
																			>
																				<div className="group-title">
																					{groupName}
																				</div>
																				<div className="group-fonts">
																					{_.orderBy(
																						_.uniqBy(
																							groupFonts,
																							(
																								font,
																							) =>
																								font.fontName?.toLowerCase(),
																						),
																						[
																							(
																								font,
																							) =>
																								font.fontName?.toLowerCase(),
																						],
																						['asc'],
																					).map(
																						(
																							font,
																							k,
																						) => (
																							<div
																								className="font-item"
																								style={{
																									display:
																										'flex',
																									alignItems:
																										'center',
																									justifyContent:
																										'space-between',
																								}}
																							>
																								<p
																									key={
																										k
																									}
																									onClick={(
																										e,
																									) =>
																										this.handleFontFamily(
																											e,
																											'fontName',
																											font.value,
																										)
																									}
																									style={{
																										fontFamily:
																											font?.value,
																									}}
																									// className={`font-item ${this.state.selectedFont === font.value ? 'active' : ''}`}
																								>
																									{
																										font.fontName
																									}
																								</p>
																								{this
																									.state
																									.activeFont ==
																									font?.value && (
																									<ActiveTick />
																								)}
																							</div>
																						),
																					)}
																				</div>
																			</div>
																		),
																	);
																})()}
															</div>
														</>
													) : (
														''
													)}
												</>
												<>
													<p className="heading">Styles</p>
													<div
														className="element_input"
														style={{
															flexDirection: 'row',
															alignItems: 'center',
															cursor: 'pointer',
														}}
														onClick={(e) => {
															this.toggleFontsVariantDropDown(e);
														}}
													>
														<span
															style={{
																fontSize: '13px',
																color: '#f1f1f1',
																cursor: 'pointer',
																width: '100%',
																height: '100%',
															}}
														>
															{this.state.activeFontVariant
																? this.state.activeFontVariant
																: 'Weights'}
														</span>
														<DropDown
															style={{
																cursor: 'pointer',
																rotate:
																	this.state
																		.showFontsVariantDropDown ===
																	false
																		? '0deg'
																		: '180deg',
															}}
														/>
													</div>
													{this.state.showFontsVariantDropDown ? (
														<div
															className="fonts-dropdown font-variant-dropdown"
															style={{
																alignItems: 'center',
																maxHeight: '200px',
																top: '115px',
															}}
															ref={this.dropdownfontref}
														>
															{this.props?.fonts?.map((font, key) => {
																if (
																	this.state?.activeFont
																		?.toLowerCase()
																		?.includes(
																			font?.value?.toLowerCase(),
																		) ||
																	this.state?.activeFont
																		?.toLowerCase()
																		?.includes(
																			font?.fontName?.toLowerCase(),
																		)
																) {
																	return (
																		<>
																			{font?.variants
																				?.length >= 1 ? (
																				_.map(
																					font?.variants,
																					(
																						variant,
																						k,
																					) => {
																						return (
																							<p
																								className="font-variant-item"
																								key={
																									k
																								}
																								onClick={(
																									e,
																								) =>
																									this.handleFontFamily(
																										e,
																										'fontWeight',
																										variant,
																									)
																								}
																							>
																								{variant?.variant ||
																									'Regular'}
																							</p>
																						);
																					},
																				)
																			) : (
																				<p>No weights</p>
																			)}
																		</>
																	);
																}
																// Corrected else case
																return null; // Return null for non-matching fonts
															})}

															{/* Show "No Weights" once after the map if no matching font was found */}
															{!this.props?.fonts?.some(
																(font) =>
																	font?.value?.toLowerCase() ===
																		this.state.activeFont?.toLowerCase() ||
																	font?.fontName?.toLowerCase() ===
																		this.state.activeFont?.toLowerCase(),
															) && (
																<div>
																	<p className="font-variant-item">
																		No Weights
																	</p>
																</div>
															)}
														</div>
													) : (
														''
													)}
												</>
												<div className="line"></div>
												<>
													<div className="popup-shapes-range-wrapper">
														<b>Size</b>
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
																	max={200}
																	step={1}
																	value={
																		this.state?.fontSize ||
																		this.props
																			?.activeFontSize ||
																		'16'
																	}
																	onChange={(e) =>
																		this.handleFontFamily(
																			e,
																			'fontSize',
																			e.target.value,
																		)
																	}
																/>
															</div>
															<p
																style={{
																	textAlign: 'center',
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'center',
																	gap: '4px',
																}}
															>
																<input
																	ref={this.fontSizeInputRef}
																	type="number"
																	value={
																		this.state.fontSize ||
																		this.props?.activeFontSize
																	}
																	onChange={(e) => {
																		const value =
																			e.target.value;
																		// this.setState(
																		// 	{ fontSize: value },
																		// 	() => {
																		// 		this.debounceFuncForFontProps(
																		// 			() => {
																		// 				this.handleFontFamily(
																		// 					e,
																		// 					'fontSize',
																		// 					value,
																		// 				);
																		// 			},
																		// 			100,
																		// 		);
																		// 	},
																		// );
																		const finalValue =
																			!isNaN(value) &&
																			value >= 8
																				? value
																				: 8;
																		this.setState(
																			{ fontSize: value },
																			() => {
																				this.debounceFuncForFontProps(
																					() => {
																						this.handleFontFamily(
																							e,
																							'fontSize',
																							finalValue,
																						);
																					},
																					1000,
																				);
																			},
																		);
																	}}
																	style={{
																		width: '50px',
																		background: 'transparent',
																		border: '1px solid #444',
																		borderRadius: '4px',
																		color: '#fff',
																		padding: '2px 4px',
																	}}
																/>
																px
															</p>
														</div>
													</div>
												</>
												<>
													<div className="popup-shapes-range-wrapper">
														<b>Align Horizontal</b>
														<div className="popup-stroke-styles">
															<span
																className={
																	this.state?.justifyleft
																		? 'active-stroke-align'
																		: ''
																}
																onClick={(e) => {
																	this.handleFontFamily(
																		e,
																		'align',
																		'justifyleft',
																	);
																}}
															>
																<Left />
															</span>

															<span
																className={
																	this.state?.justifycenter
																		? 'active-stroke-align'
																		: ''
																}
																onClick={(e) => {
																	this.handleFontFamily(
																		e,
																		'align',
																		'justifycenter',
																	);
																}}
															>
																<Center />
															</span>
															<span
																className={
																	this.state?.justifyright
																		? 'active-stroke-align'
																		: ''
																}
																onClick={(e) => {
																	this.handleFontFamily(
																		e,
																		'align',
																		'justifyright',
																	);
																}}
															>
																<Right />
															</span>
															<span
																className={
																	this.state?.justifyfull
																		? 'active-stroke-align'
																		: ''
																}
																onClick={(e) => {
																	this.handleFontFamily(
																		e,
																		'align',
																		'justifyfull',
																	);
																}}
															>
																<Justify />
															</span>
														</div>
													</div>
												</>
												<>
													{this.state?.activeComponent?.type == 'text' &&
														this.props?.previewType != 'm' && (
															<div className="popup-shapes-range-wrapper">
																<b>Align Vertical</b>
																<div className="popup-stroke-styles">
																	<span
																		className={
																			this.state
																				?.verticalAlign ===
																			'flex-start'
																				? 'active-stroke-align'
																				: ''
																		}
																		onClick={(e) => {
																			this.handleFontFamily(
																				e,
																				'justify',
																				'flex-start',
																			);
																		}}
																	>
																		<Top />
																	</span>

																	<span
																		className={
																			this.state
																				?.verticalAlign ===
																			'center'
																				? 'active-stroke-align'
																				: ''
																		}
																		onClick={(e) => {
																			this.handleFontFamily(
																				e,
																				'justify',
																				'center',
																			);
																		}}
																	>
																		<Middle />
																	</span>
																	<span
																		className={
																			this.state
																				?.verticalAlign ===
																			'flex-end'
																				? 'active-stroke-align'
																				: ''
																		}
																		onClick={(e) => {
																			this.handleFontFamily(
																				e,
																				'justify',
																				'flex-end',
																			);
																		}}
																	>
																		<Bottom />
																	</span>
																</div>
															</div>
														)}
												</>
												<>
													<div
														className="spacing-div"
														onClick={(e) => {
															this.setState({
																showSpacing:
																	!this.state.showSpacing,
															});
														}}
													>
														<b>Spacing</b>
														<DropDown
															style={{
																cursor: 'pointer',
																rotate:
																	this.state.showSpacing === false
																		? '0deg'
																		: '180deg',
																zoom: 1.2,
															}}
														/>
													</div>
												</>
												{this.state?.showSpacing && (
													<>
														<>
															<div className="popup-shapes-range-wrapper">
																<b>Line Height</b>
																<div className="popup-range-div">
																	<div
																		style={{
																			display: 'flex',
																			maxWidth: 170,
																		}}
																	>
																		<input
																			type="range"
																			min={1}
																			max={5}
																			step={0.1}
																			defaultValue={
																				this.state
																					.lineHeight ||
																				1.0
																			}
																			value={
																				this.state
																					?.lineHeight
																			}
																			onChange={(e) =>
																				this.handleFontFamily(
																					e,
																					'lineHeight',
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
																		{this.state?.lineHeight}
																	</p>
																</div>
															</div>
														</>
														<>
															<div className="popup-shapes-range-wrapper">
																<b>Letter Spacing</b>
																<div className="popup-range-div">
																	<div
																		style={{
																			display: 'flex',
																			maxWidth: 170,
																		}}
																	>
																		<input
																			type="range"
																			min={0.1}
																			max={10}
																			step={0.1}
																			defaultValue={
																				this.state
																					.letterSpacing ||
																				0
																			}
																			value={
																				this.state
																					?.letterSpacing
																			}
																			onChange={(e) =>
																				this.handleFontFamily(
																					e,
																					'letterSpacing',
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
																		{this.state?.letterSpacing}
																	</p>
																</div>
															</div>
														</>
													</>
												)}
											</div>
										</div>
									</>
								) : (
									<div className="element_image">
										<div className="element_image">
											<div className="element_pasteURL">
												<div
													className="block_styles pad-color-p-imp"
													style={{ height: '270px' }}
												>
													<ColorPicker
														title={'Fill Color'}
														color={
															this.state?.color ||
															this.props?.activeColor
														}
														handleColor={(e) =>
															this.handleSetColorFromPicks(e, e)
														}
														brandColors={this.props?.brandColors}
														zoom={0.8}
														isDarkBg={true}
													/>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</>
					)}
				</div>
			</>
		);
	}
}

// comment

{
	/* <> */
}
{
	/* <div
										className="color-popup-modal"
										ref={this.dropdownref}
										style={
											{
												// backgroundColor: '#000000',
											}
										}
									> */
}
{
	/* <div className="colors">
											{_.map(this.state.colors, (value, key) => {
												return (
													<div
														className="color-column"
														style={{
															marginTop: key % 2 === 0 ? '0' : '-10px',
														}}
													>
														{_.map(value, (val, k) => {
															return _.map(val, (v, i) => {
																return (
																	<span
																		style={{
																			backgroundColor: v,
																			position: 'relative',
																			display: 'flex',
																			alignItems: 'center',
																			justifyContent: 'center',
																		}}
																		className={
																			this.state.color == v
																				? 'active'
																				: ''
																		}
																		onClick={(e) =>
																			this.handleSetColorFromPicks(
																				e,
																				v,
																			)
																		}
																	>
																		{v === '' ? (
																			<b className="no-color"></b>
																		) : (
																			''
																		)}
																	</span>
																);
															});
														})}
													</div>
												);
											})}
										</div> */
}
{
	/* {this.state?.brandColors?.length > 0 ? (
									<div className="color-item-main-container">
										<div className="color-item-main-title">Brand Colors</div>

										<div className="color-item-main">
											{this.state?.brandColors?.map((ele, k) => (
												<>
													<span
														onClick={(e) =>
															this.handleSetColorFromPicks(
																e,
																ele?.value,
															)
														}
														style={{ backgroundColor: ele?.value }}
														className="color-item"
													></span>
												</>
											))}
											{this.state.brandColors.length <= 9 && (
												<span
													// onClick={(e) => this.handleAddBrandColors(e)}
													className="color-add-item"
												>
													<Plus />
												</span>
											)}
										</div>
									</div>
								) : (
									''
									// onClick={(e) => this.handleAddBrandColors(e)}
									// <div className="add-brand-colors">
									// 	Add your brand colours
									// </div>
								)} */
}
{
	/* <div className="brands-colors">
						<SliderPicker
							color={this.state.color}
							onChange={(e) =>
								this.setState(
									{
										color: e.hex,
										inputColor: e.hex,
									},
									() => {
										this.props.handleColor(e.hex);
									},
								)
							}
						/>
					</div>

					<div
						className="brand-colors"
						style={{
							position: 'relative',
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<input
							onClick={(e) => e.stopPropagation()}
							className="color-input"
							value={this.state.inputColor}
							onChange={(e) => this.changeColorInput(e)}
							placeholder={this.state.inputColor === '' ? 'No Color' : ''}
						/>
						<legend className="color-input-circle" style={{ border: 'none' }}>
							<input
								onClick={(e) => e.stopPropagation()}
								type="color"
								onChange={(e) => this.props.handleColor(e.target.value)}
								value={this.state.color}
								style={{
									border: 'none',
									outline: 'none',
									borderRadius: '50%',
									width: 20,
									height: 20,
									padding: 0,
								}}
							/>
						</legend>
					</div> */
}
{
	/* </div> */
}

{
	/* </> */
}
