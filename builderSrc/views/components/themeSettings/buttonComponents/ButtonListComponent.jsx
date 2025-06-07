import React, { memo, useContext, useMemo, useCallback, useState } from 'react';
import { ReactComponent as RightArrow } from '../../../../assets/svg/themeSettings/right_arrow.svg';
import Context from '../../../../context/context';
import { Select, Slider } from 'antd/lib';
import { getNumberFromPx } from '../../../../helper';
import _ from 'lodash';

const buttonShapes = [
	{
		id: 1,
		label: 'Pill',
		value: 'pill',
		borderRadiusValue: '125px',
	},
	{
		id: 2,
		label: 'Square',
		value: 'square',
		borderRadiusValue: '0px',
	},
	{
		id: 3,
		label: 'Curved Corners',
		value: 'curve',
		borderRadiusValue: '12px',
	},
];

const ButtonListComponent = () => {
	const {
		themeSettings: { fonts, activeSection, updateStateValues, themeSettings, newTheme },
	} = useContext(Context);

	const buttonStyles = useMemo(() => {
		const activeButton = newTheme?.buttons?.buttonType;
		let buttonStyles = newTheme?.buttons[activeButton]?.normal;
		let buttonColors = newTheme?.colors?.buttons[activeButton]?.normal;
		let buttonFonts = newTheme?.fonts?.buttons[activeButton];
		let otherProperties = {
			_buttonType_: activeButton,
			_buttonShape_: newTheme?.buttons[activeButton]?.buttonShape,
		};

		return {
			...buttonStyles,
			...buttonColors,
			...buttonFonts,
			...otherProperties,
		};
	}, [newTheme?.buttons, newTheme?.colors?.buttons, newTheme?.fonts?.buttons]);

	const fontOptions = useMemo(() => {
		let fontGroupsNames = Object.keys(fonts);
		let fontOptions = fontGroupsNames.map((singleGroup) => {
			return {
				label: singleGroup,
				title: singleGroup,
				options: fonts[singleGroup].map((singleFonts, index) => {
					return {
						label: singleFonts.fontName,
						value: `${singleFonts?._id}/${singleFonts?.value}/${singleGroup}/${singleGroup}`,
					};
				}),
			};
		});
		return fontOptions || [];
	}, [fonts]);

	const buttonOptionsHandler = useCallback(
		(sectionComponent, sectionTitle) => {
			updateStateValues({
				activeSection: {
					...activeSection,
					currentSectionComponent: sectionComponent,
					currentSectionTitle: sectionTitle,
					history: [
						...activeSection?.history,
						{
							backClickSectionTitle: 'Buttons',
							backButtonClickSection: 'button_list_component',
						},
					],
				},
			});
		},
		[
			activeSection?.currentSectionComponent,
			activeSection?.currentSectionTitle,
			activeSection?.history,
		],
	);

	const handleButtonTypeClick = useCallback(
		(buttonType) => {
			if (buttonType === newTheme?.buttons?.buttonType) {
				return;
			}

			let updateTheme = _.cloneDeep(newTheme);
			updateTheme.buttons.buttonType = buttonType;

			updateStateValues({
				newTheme: updateTheme,
			});
		},
		[buttonStyles],
	);

	const handlePaddingButtonClick = useCallback(
		(buttonType = 'm') => {
			let paddingObject = {
				s: {
					paddingTop: '12px',
					paddingRight: '16px',
					paddingBottom: '12px',
					paddingLeft: '16px',
				},
				m: {
					paddingTop: '12px',
					paddingRight: '28px',
					paddingBottom: '12px',
					paddingLeft: '28px',
				},
				l: {
					paddingTop: '12px',
					paddingRight: '40px',
					paddingBottom: '12px',
					paddingLeft: '40px',
				},
			};

			let updateTheme = _.cloneDeep(newTheme);
			let currentButtonType = updateTheme?.buttons?.buttonType;
			updateTheme.buttons[currentButtonType].normal = {
				...updateTheme.buttons[currentButtonType].normal,
				...paddingObject[buttonType],
			};

			updateStateValues({
				newTheme: updateTheme,
			});
		},
		[newTheme?.buttons],
	);

	const changeSliderHandler = useCallback(
		(handleType, handleValue) => {
			let updateTheme = _.cloneDeep(newTheme);
			let currentButtonType = updateTheme?.buttons?.buttonType;
			if (handleType === 'horizontal') {
				updateTheme.buttons[currentButtonType].normal.paddingLeft = `${handleValue}px`;
				updateTheme.buttons[currentButtonType].normal.paddingRight = `${handleValue}px`;
			} else if (handleType === 'vertical') {
				updateTheme.buttons[currentButtonType].normal.paddingTop = `${handleValue}px`;
				updateTheme.buttons[currentButtonType].normal.paddingBottom = `${handleValue}px`;
			} else if (handleType === 'outline') {
				updateTheme.buttons[currentButtonType].normal.borderWidth = `${handleValue}px`;
			}
			updateStateValues({
				newTheme: updateTheme,
			});
		},
		[
			buttonStyles?.paddingLeft,
			buttonStyles?.paddingTop,
			buttonStyles?.borderWidth,
			newTheme?.buttons?.buttonType,
		],
	);

	const handleSelectHandler = useCallback(
		(selectType, value) => {
			let updateTheme = _.cloneDeep(newTheme);
			let currentButtonType = updateTheme?.buttons?.buttonType;
			if (selectType === 'font') {
				// let [fontId, fontFamily, fontName, fontGroup] = value.split('/');
				// updateButton = {
				// 	...updateButton,
				// 	fontId,
				// 	fontFamily,
				// 	fontName,
				// 	fontGroup,
				// };
			} else if (selectType === 'borderRadius') {
				let newValue = buttonShapes?.find((item) => item.value === value);
				updateTheme.buttons[currentButtonType].normal.borderRadius =
					newValue?.borderRadiusValue;
				updateTheme.buttons[currentButtonType].buttonShape = value;
			}
			updateStateValues({
				newTheme: updateTheme,
			});
		},
		[buttonStyles?._buttonShape_],
	);

	return (
		<div className="buttonListContainer">
			{/* button types */}
			<div className="buttonTypesContainer">
				<div className="buttonTypesHeading">
					<p
						className={`${
							newTheme?.buttons?.buttonType === 'primary' ? 'activeTypeHeading' : ''
						}`}
						onClick={() => handleButtonTypeClick('primary')}
					>
						Primary{' '}
					</p>
					<p
						className={`${
							newTheme?.buttons?.buttonType === 'secondary' ? 'activeTypeHeading' : ''
						}`}
						onClick={() => handleButtonTypeClick('secondary')}
					>
						Secondary{' '}
					</p>
					<p
						className={`${
							newTheme?.buttons?.buttonType === 'tertiary' ? 'activeTypeHeading' : ''
						}`}
						onClick={() => handleButtonTypeClick('tertiary')}
					>
						Tertiary{' '}
					</p>
				</div>

				<div className="buttonPreview">
					<button style={buttonStyles}>Button Title</button>
				</div>
			</div>

			{/* button library */}
			<div
				className="buttonLibraryDiv"
				onClick={() => buttonOptionsHandler('buttons_library_component', 'Buttons Library')}
			>
				<div className="buttonLibraryHeading">Button Library</div>
				<RightArrow />
			</div>

			{/* font && button shape */}
			<div
				className="gridBoxContainer  font_shape_container"
				style={{ gridTemplateColumns: '2.5fr 1fr' }}
			>
				<div className="gridBox">
					<div className="fontFamily_div">
						<p>Font</p>
					</div>

					<div style={{ width: '100%' }}>
						<Select
							style={{ width: '100%' }}
							placeholder="Select Font"
							options={fontOptions}
							// value={{
							// 	label: themeSettings?.button?.fontName,
							// 	value: `${themeSettings?.button?.fontId}/${themeSettings?.button?.fontFamily}/${themeSettings?.button?.fontName}/${themeSettings?.button?.fontGroup}`,
							// }}
							// value={`${themeSettings?.button?.fontId}/${themeSettings?.button?.fontFamily}/${themeSettings?.button?.fontName}/${themeSettings?.button?.fontGroup}`}
							onChange={(value) => handleSelectHandler('font', value)}
						/>
					</div>
				</div>

				<div className="gridBox ">
					<div className="fontFamily_div">
						<p>Style</p>
					</div>

					<div style={{ width: '100%' }}>
						<Select
							style={{ width: '100%' }}
							placeholder="Shape"
							options={buttonShapes}
							value={buttonStyles?._buttonShape_}
							onChange={(value) => handleSelectHandler('borderRadius', value)}
						/>
					</div>
				</div>
			</div>

			{/* outline */}
			<div
				className="gridBoxContainer font_shape_container"
				style={{ gridTemplateColumns: '1fr' }}
			>
				<div
					className="gridBox fontFamilyContainer outline_container"
					style={{ gap: '0px' }}
				>
					<div className="fontFamily_div">
						<p>Outline</p>
					</div>

					<div className="sliderContainer">
						<Slider
							min={0}
							max={40}
							value={getNumberFromPx(buttonStyles?.borderWidth)}
							onChange={(value) => changeSliderHandler('outline', value)}
						/>
						<span className="sliderValue">
							{getNumberFromPx(buttonStyles?.borderWidth)}
						</span>
					</div>
				</div>
			</div>

			<div
				className="divider"
				style={{ width: '90%', margin: '0 auto', marginTop: '-12px' }}
			></div>

			{/* default paddings */}
			<div className="paddingContainer">
				<p>Padding</p>

				<div className="paddingOptions">
					<button
						className={`${
							buttonStyles?.paddingLeft === '16px' &&
							buttonStyles?.paddingTop === '12px'
								? 'active-button'
								: ''
						}`}
						onClick={() => handlePaddingButtonClick('s')}
					>
						S
					</button>
					<button
						className={`${
							buttonStyles?.paddingLeft === '28px' &&
							buttonStyles?.paddingTop === '12px'
								? 'active-button'
								: ''
						}`}
						onClick={() => handlePaddingButtonClick('m')}
					>
						M
					</button>
					<button
						className={`${
							buttonStyles?.paddingLeft === '40px' &&
							buttonStyles?.paddingTop === '12px'
								? 'active-button'
								: ''
						}`}
						onClick={() => handlePaddingButtonClick('l')}
					>
						L
					</button>
				</div>
			</div>

			{/* horizontal padding slider */}
			<div
				className="gridBoxContainer font_shape_container"
				style={{ gridTemplateColumns: '1fr' }}
			>
				<div
					className="gridBox fontFamilyContainer outline_container"
					style={{ gap: '0px' }}
				>
					<div className="fontFamily_div">
						<p>Horizontal</p>
					</div>

					<div className="sliderContainer">
						<Slider
							min={2}
							max={40}
							value={getNumberFromPx(buttonStyles?.paddingLeft)}
							onChange={(value) => changeSliderHandler('horizontal', value)}
						/>
						<span className="sliderValue">
							{getNumberFromPx(buttonStyles?.paddingLeft)}
						</span>
					</div>
				</div>
			</div>

			{/* vertical padding slider */}
			<div
				className="gridBoxContainer font_shape_container"
				style={{ gridTemplateColumns: '1fr' }}
			>
				<div
					className="gridBox fontFamilyContainer outline_container"
					style={{ gap: '0px' }}
				>
					<div className="fontFamily_div">
						<p>Vertical</p>
					</div>

					<div className="sliderContainer">
						<Slider
							min={0}
							max={40}
							value={getNumberFromPx(buttonStyles?.paddingBottom)}
							onChange={(value) => changeSliderHandler('vertical', value)}
						/>
						<span className="sliderValue">
							{getNumberFromPx(buttonStyles?.paddingBottom)}
						</span>
					</div>
				</div>
			</div>

			{/* reset && apply */}
			<div className="reset_apply_container">
				<button className="reset_button"> Reset Properties</button>
				<button className="apply_button"> Apply to All</button>
			</div>
		</div>
	);
};

export default memo(ButtonListComponent);
