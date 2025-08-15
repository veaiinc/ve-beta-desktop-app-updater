import React, { memo, useState, useCallback, useMemo, useContext, useEffect, useRef } from 'react';
import '../../../../assets/scss/theme-settings/font-section.scss';
import Context from '../../../../context/context';
import { Select, Slider } from 'antd/lib';
import { getNumberFromPx } from '../../../../helper';
import _ from 'lodash';
import { ReactComponent as MobileIcon } from '../../../../assets/svg/mobile.svg';
import { ReactComponent as DesktopIcon } from '../../../../assets/svg/desktop.svg';
import { responsiveFontSize } from '../themeconstants';
// import { ReactComponent as LinkIcon } from '../../../../assets/svg/themeSettings/link.svg';
// import { ReactComponent as UnlinkIcon } from '../../../../assets/svg/themeSettings/unlink.svg';

const textTransformOptions = [
	{
		id: 1,
		label: 'None',
		value: 'none',
	},
	{
		id: 2,
		label: 'Uppercase',
		value: 'uppercase',
	},
	{
		id: 3,
		label: 'Lowercase',
		value: 'lowercase',
	},
	{
		id: 4,
		label: 'Capitalize',
		value: 'capitalize',
	},
];

const useClickOutside = (handler) => {
	const ref = useRef();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (ref.current instanceof HTMLElement && !ref.current.contains(event.target)) {
				handler();
			}
		};

		document.addEventListener('click', handleClickOutside, true);

		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	}, [handler]);

	return ref;
};

const ParagraphComponent = () => {
	const {
		themeSettings: {
			fonts,
			newTheme,
			updateStateValues,
			sections,
			replaceThemeStylesInContent,
			updateHomeStateFunction,
			activeSection,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		selectedFont: [],
	});

	const [selectStates, setSelectStates] = useState({
		fontFamily: false,
		transform: false,
		weight: false,
	});

	const fontFamilyRef = useClickOutside(() => {
		setSelectStates((prev) => ({ ...prev, fontFamily: false }));
	});

	const transformRef = useClickOutside(() => {
		setSelectStates((prev) => ({ ...prev, transform: false }));
	});

	const weightRef = useClickOutside(() => {
		setSelectStates((prev) => ({ ...prev, weight: false }));
	});

	useEffect(() => {
		let updateState = {};
		let fontsArray = Object.values(fonts).flat();

		let currentFont = _.find(fontsArray, { _id: newTheme?.fonts?.p?.activeFontID });
		updateState.selectedFont = currentFont;

		setInfo((prev) => ({
			...prev,
			...updateState,
		}));
	}, []);
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (fontFamilyRef.current && !fontFamilyRef.current.contains(event.target)) {
				setSelectStates((prev) => ({ ...prev, fontFamily: false }));
			}
			if (transformRef.current && !transformRef.current.contains(event.target)) {
				setSelectStates((prev) => ({ ...prev, transform: false }));
			}
			if (weightRef.current && !weightRef.current.contains(event.target)) {
				setSelectStates((prev) => ({ ...prev, weight: false }));
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const fontOptions = useMemo(() => {
		let fontGroupsNames = Object.keys(fonts);
		let fontOptions = fontGroupsNames.map((singleGroup) => {
			return {
				label: singleGroup,
				title: singleGroup,
				options: fonts[singleGroup].map((singleFonts, index) => {
					return {
						label: singleFonts?.fontName,
						value: singleFonts?._id,
					};
				}),
			};
		});
		return fontOptions || [];
	}, [fonts]);

	const fontWeightOptions = useMemo(() => {
		let options = info.selectedFont?.variants?.map((item, index) => ({
			label: item.variant,
			value: index,
		}));

		return options || [];
	}, [info?.selectedFont]);

	const fontStyles = useMemo(() => {
		return newTheme?.fonts;
	}, [newTheme?.fonts]);

	const mobileFontStyles = useMemo(() => {
		return newTheme?.mobileFonts;
	}, [newTheme?.mobileFonts]);

	const updateSectionsContentFunction = (
		updatedSection,
		updateTheme,
		updateStateValuesFlag = true,
		updateHomeStateFunctionFlag = true,
	) => {
		updatedSection.forEach((section) => {
			// iterate blocks
			section?.blocks?.forEach((block) => {
				// iterate subBlocks
				block?.subBlocks?.forEach((subBlock) => {
					replaceThemeStylesInContent(
						subBlock,
						subBlock.content,
						updateTheme,
						subBlock.type,
					);
				});
			});
		});

		if (updateStateValuesFlag) {
			updateStateValues({
				newTheme: updateTheme,
			});
		}

		if (updateHomeStateFunctionFlag) {
			updateHomeStateFunction({
				sections: updatedSection,
				themes: updateTheme,
			});
		}
	};

	const changeSliderHandler = useCallback(
		(handleType, handleValue, screenType) => {
			let updateTheme = _.cloneDeep(newTheme);
			let updatedSections = _.cloneDeep(sections);

			if (handleType === 'p') {
				if (newTheme?.isDesktopMobileFontLinked) {
					updateTheme.fonts.p.fontSize = `${handleValue}px`;
					updateTheme.mobileFonts.p.fontSize = `${responsiveFontSize[handleValue]}px`;
					updateTheme.fonts.span.fontSize = `${handleValue}px`;
					updateTheme.mobileFonts.span.fontSize = `${responsiveFontSize[handleValue]}px`;
				} else if (screenType === 'desktop') {
					updateTheme.fonts.p.fontSize = `${handleValue}px`;
					updateTheme.fonts.span.fontSize = `${handleValue}px`;
				} else if (screenType === 'mobile') {
					updateTheme.mobileFonts.p.fontSize = `${handleValue}px`;
					updateTheme.mobileFonts.span.fontSize = `${handleValue}px`;
				}
			} else if (handleType === 'letterSpacing') {
				updateTheme.fonts.p[handleType] = `${handleValue}px`;
				updateTheme.fonts.span[handleType] = `${handleValue}px`;
			} else if (handleType === 'lineHeight') {
				updateTheme.fonts.p[handleType] = handleValue;
				updateTheme.fonts.span[handleType] = handleValue;
			}

			updateSectionsContentFunction(updatedSections, updateTheme);
		},
		[fontStyles, sections],
	);

	const handleSelectHandler = (type, value) => {
		let fontsArray = Object.values(fonts).flat();
		let updateState = {};
		let updateTheme = _.cloneDeep(newTheme);
		let updatedSections = _.cloneDeep(sections);
		const { p, span } = updateTheme.fonts;

		if (type === 'fontFamily') {
			let currentFont = _.find(fontsArray, { _id: value });
			updateState.selectedFont = currentFont;

			updateTheme.fonts.p = {
				...p,
				[type]: currentFont?.value,
				activeFontID: value,
			};
			updateTheme.fonts.span = {
				...span,
				[type]: currentFont?.value,
				activeFontID: value,
			};

			// Close dropdown after selection
			// setSelectStates((prev) => ({ ...prev, fontFamily: false }));
		} else if (type === 'fontWeight') {
			let variant = info.selectedFont?.variants?.[value];

			updateTheme.fonts.p = {
				...p,
				[type]: variant?.weight,
				fontStyle: variant?.style,
				activeVariant: value,
			};
			updateTheme.fonts.span = {
				...span,
				[type]: variant?.weight,
				fontStyle: variant?.style,
				activeVariant: value,
			};

			// Close dropdown after selection
			// setSelectStates((prev) => ({ ...prev, weight: false }));
		} else if (type === 'textTransform') {
			updateTheme.fonts.p[type] = value;
			updateTheme.fonts.span[type] = value;

			// Close dropdown after selection
			// setSelectStates((prev) => ({ ...prev, transform: false }));
		}

		updateSectionsContentFunction(updatedSections, updateTheme);

		if (_.size(updateState) > 0) {
			setInfo((prev) => ({
				...prev,
				...updateState,
			}));
		}
	};

	const handleLinkUnlinkHandler = useCallback(() => {
		let updateTheme = _.cloneDeep(newTheme);
		updateTheme.isDesktopMobileFontLinked = !updateTheme.isDesktopMobileFontLinked;
		updateSectionsContentFunction(sections, updateTheme);
	}, [newTheme?.isDesktopMobileFontLinked, fontStyles, mobileFontStyles]);

	const handleMouseDown = useCallback((e) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDropdownVisibleChange = useCallback((open, type) => {
		if (!open) {
			return;
		}
		setSelectStates((prev) => ({ ...prev, [type]: open }));
	}, []);

	return (
		<div className="FontheadingContainer">
			<div
				className="gridBoxContainer"
				style={{ marginTop: '32px', gridTemplateColumns: '1fr' }}
			>
				<div className="gridBox fontFamilyContainer" ref={fontFamilyRef}>
					<div className="fontFamily_div">
						<p>Font</p>
					</div>
					<div className="fontFamilyOptionsContainer">
						<Select
							style={{ width: '100%' }}
							placeholder="Select Font"
							options={fontOptions}
							open={selectStates.fontFamily}
							onDropdownVisibleChange={(open) =>
								handleDropdownVisibleChange(open, 'fontFamily')
							}
							dropdownRender={(menu) => (
								<div
									onMouseDown={handleMouseDown}
									// onMouseUp={handleMouseDown}
									onClick={handleMouseDown}
								>
									{menu}
								</div>
							)}
							optionRender={(option, index) => {
								let allFonts = Object.values(fonts).flat();
								let fontStyle = _.find(allFonts, {
									_id: option.value,
								});
								return (
									<div style={{ fontFamily: fontStyle?.value }}>
										{option.label}
									</div>
								);
							}}
							value={newTheme?.fonts?.p?.activeFontID}
							onChange={(value) => {
								handleSelectHandler('fontFamily', value);
								setSelectStates((prev) => ({ ...prev, fontFamily: true }));
							}}
							showSearch
							filterOption={(input, option) =>
								(option?.label || '')?.toLowerCase().includes(input?.toLowerCase())
							}
							onBlur={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
						/>
					</div>
				</div>
			</div>

			<div className="gridBoxContainer">
				<div className="gridBox fontFamilyContainer" ref={transformRef}>
					<div className="fontFamily_div">
						<p>Transform</p>
					</div>

					<div className="fontFamilyOptionsContainer">
						<Select
							style={{ width: '100%' }}
							placeholder="Select Transform"
							options={textTransformOptions}
							open={selectStates.transform}
							onDropdownVisibleChange={(open) =>
								handleDropdownVisibleChange(open, 'transform')
							}
							dropdownRender={(menu) => (
								<div
									onMouseDown={handleMouseDown}
									// onMouseUp={handleMouseDown}
									onClick={handleMouseDown}
								>
									{menu}
								</div>
							)}
							value={newTheme?.fonts?.p?.textTransform || 'none'}
							onChange={(value) => {
								handleSelectHandler('textTransform', value);
								setSelectStates((prev) => ({ ...prev, transform: true }));
							}}
							onBlur={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
						/>
					</div>
				</div>

				<div className="gridBox fontWeightContainer" ref={weightRef}>
					<div className="fontFamily_div">
						<p>Weight</p>
					</div>

					<div className="fontFamilyOptionsContainer">
						<Select
							style={{ width: '100%' }}
							placeholder="Select Weight"
							options={fontWeightOptions}
							open={selectStates.weight}
							onDropdownVisibleChange={(open) =>
								handleDropdownVisibleChange(open, 'weight')
							}
							dropdownRender={(menu) => (
								<div
									onMouseDown={handleMouseDown}
									// onMouseUp={handleMouseDown}
									onClick={handleMouseDown}
								>
									{menu}
								</div>
							)}
							value={newTheme?.fonts?.p?.activeVariant}
							onChange={(value) => {
								handleSelectHandler('fontWeight', value);
								setSelectStates((prev) => ({ ...prev, weight: true }));
							}}
							onBlur={(e) => {
								e.preventDefault();
								e.stopPropagation();
							}}
						/>
					</div>
				</div>
			</div>

			<div className="gridBoxContainer" style={{ gridTemplateColumns: '1fr 1fr' }}>
				<div className="gridBox fontFamilyContainer">
					<div className="fontFamily_div">
						<p>Line Height</p>
					</div>

					<div className="sliderContainer">
						<Slider
							min={0}
							step={0.1}
							max={5}
							value={getNumberFromPx(fontStyles?.p?.lineHeight)}
							onChange={(value) => changeSliderHandler('lineHeight', value)}
						/>
						<span className="sliderValue">
							{getNumberFromPx(fontStyles?.p?.lineHeight)}
						</span>
					</div>
				</div>

				<div className="gridBox fontWeightContainer">
					<div className="fontFamily_div">
						<p>Line Spacing</p>
					</div>

					<div className="sliderContainer">
						<Slider
							min={0}
							max={5}
							value={getNumberFromPx(fontStyles?.p?.letterSpacing)}
							onChange={(value) => changeSliderHandler('letterSpacing', value)}
						/>
						<span className="sliderValue">
							{getNumberFromPx(fontStyles?.p?.letterSpacing)}
						</span>
					</div>
				</div>
			</div>

			<div className="divider"></div>

			<div className="sizeContainer">
				<div
					className={newTheme?.isDesktopMobileFontLinked ? 'activeSize' : ''}
					onClick={() => handleLinkUnlinkHandler(true)}
				>
					Default response size
				</div>

				<div
					className={newTheme?.isDesktopMobileFontLinked ? '' : 'activeSize'}
					onClick={() => handleLinkUnlinkHandler(false)}
				>
					Set custom screen size
				</div>
			</div>

			<div className="size_container_warning_div">
				{newTheme?.isDesktopMobileFontLinked
					? 'Text size is responsive — changes on desktop will automatically adjust for mobile.'
					: 'Text sizes are now separate. You can adjust desktop and mobile independently.'}
			</div>

			{newTheme?.isDesktopMobileFontLinked ? (
				<div className="gridBoxContainer" style={{ gridTemplateColumns: '1fr' }}>
					<div className="gridBox fontFamilyContainer">
						<div className="fontFamily_div">
							<p>Paragraph</p>
						</div>

						<div className="sliderContainer">
							<Slider
								min={0}
								max={100}
								value={getNumberFromPx(fontStyles?.p?.fontSize)}
								onChange={(value) => changeSliderHandler('p', value)}
							/>
							<span className="sliderValue">
								{getNumberFromPx(fontStyles?.p?.fontSize)}
							</span>
							<span className="sliderValue">
								{getNumberFromPx(mobileFontStyles?.p?.fontSize)}
							</span>
						</div>
					</div>
				</div>
			) : (
				<div
					className="gridBoxContainer customSizeContainer"
					style={{ gridTemplateColumns: '1fr' }}
				>
					<div className="gridBox">
						<div className="gridBox_title"> </div>
						<div className="gridBox_title customSizeContainer_title">
							<div className="icons">
								<DesktopIcon />
							</div>
							<div>Desktop</div>
						</div>
						<div className="gridBox_title customSizeContainer_title">
							<div className="icons">
								<MobileIcon />
							</div>
							<div>Mobile</div>
						</div>
					</div>

					<div className="gridBox">
						<div className="gridBox_title"> Paragraph</div>
						<div className="gridBox_input">
							<input
								type="number"
								value={getNumberFromPx(fontStyles?.p?.fontSize)}
								max={500}
								min={0}
								onChange={(e) =>
									changeSliderHandler('p', Number(e.target.value), 'desktop')
								}
							/>
						</div>
						<div className="gridBox_input">
							<input
								type="number"
								value={getNumberFromPx(mobileFontStyles?.p?.fontSize)}
								max={500}
								min={0}
								onChange={(e) =>
									changeSliderHandler('p', Number(e.target.value), 'mobile')
								}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default memo(ParagraphComponent);
