import React, { memo, useContext, useState, useRef } from 'react';
import ColorActiveComponent from './ColorActiveComponent';
import '../../../../assets/scss/theme-settings/color-section.scss';
import Context from '../../../../context/context';
import { ReactComponent as ColorPicker } from '../../../../assets/svg/themeSettings/color-picker.svg';
import _ from 'lodash';
import ColorPickerModal from '../../../../views/components/properties/colorpicker/ColorPickerModal';

const propertyNames = {
	h1: 'Heading 1',
	h2: 'Heading 2',
	h3: 'Heading 3',
	h4: 'Heading 4',
	h5: 'Heading 5',
	h6: 'Heading 6',
	p: 'Paragraph',
	span: 'Span',
	normal: 'Normal',
	inputQuestion: 'Input Question',
	inputDescription: 'Input Description',
	submitButton: 'Submit Button',
	inputAnswer: 'Input Answer',
	formHeading: 'Form Heading',
	formDescription: 'Form Description',
	eventTitle: 'Event Title',
};

const ColorCardComponent = ({
	sectionName,
	style,
	onClickFunction,
	inputValue,
	onChangeFunction,
}) => {
	const colorInputRef = useRef(null);
	return (
		<div className="propertyItem">
			<h3>{sectionName}</h3>

			<div className="colorContainer">
				<div className="colorBox" style={style} onClick={onClickFunction}></div>
				<div className="color-name-container">
					<div className="color-name-container-left" style={{ position: 'relative' }}>
						<input
							type="color"
							value={inputValue}
							onChange={onChangeFunction}
							ref={colorInputRef}
							style={{
								visibility: 'hidden',
								zIndex: -1,
								position: 'absolute',
								top: 0,
								left: 0,
							}}
						/>
						<ColorPicker onClick={() => colorInputRef.current.click()} />
					</div>
					<div className="color-name-input-container">
						<input
							type="text"
							placeholder="#ffffff"
							value={inputValue}
							onChange={onChangeFunction}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
const ColorPropertiesList = () => {
	const {
		themeSettings: {
			updateStateValues,
			newTheme,
			sections,
			updateHomeStateFunction,
			replaceThemeBackgroundColor,
			replaceThemeStylesInContent,
			activeThemeColorsList,
			replaceThemeShapeColor,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		colorPickerModal: false,
		selectedColorOptions: null,
	});

	const onChangeColorHandler = (e, propertyName, propertyType) => {
		let updated = {};
		let colorValue = e?.target?.value || e || '';

		if (colorValue === '' || !colorValue) {
			setInfo((prev) => ({ ...prev, colorChangedObject: {} }));
			return;
		}

		updated[propertyName] = colorValue;
		setInfo((prev) => ({ ...prev, colorChangedObject: updated }));

		// Check if color value is a valid hex color
		const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorValue);

		if (isValidHex) {
			let updatedTheme = _.cloneDeep(newTheme);
			let updatedSections = _.cloneDeep(sections);

			if (propertyType === 'sectionBackground') {
				updatedTheme.colors[propertyName] = colorValue;
				if (propertyName === 'background') {
					updatedTheme.colors.background2 = colorValue;
				}
			} else if (propertyType === 'shape') {
				updatedTheme.colors.shape.color = colorValue;
			} else if (propertyName === 'p' || propertyName === 'span') {
				updatedTheme.colors.text.p.color = colorValue;
				updatedTheme.colors.text.span.color = colorValue;
			} else if (propertyType === 'text') {
				updatedTheme.colors.text[propertyName].color = colorValue;
			} else if (propertyType === 'form') {
				let [formKey, formType, formProperty] = propertyName.split('-');
				updatedTheme.colors[formKey][formType][formProperty] = colorValue;
			} else if (propertyType === 'event') {
				let [eventKey, eventType, eventProperty] = propertyName.split('-');
				updatedTheme.colors[eventKey][eventType][eventProperty] = colorValue;
			}

			updatedSections.forEach((section, index) => {
				// for background color
				if (propertyType === 'sectionBackground') {
					replaceThemeBackgroundColor(
						section.style,
						index % 2 === 0
							? updatedTheme.colors.background
							: updatedTheme.colors.background2,
					);
				} else {
					// iterate blocks
					section?.blocks?.forEach((block) => {
						// iterate subBlocks
						block?.subBlocks?.forEach((subBlock) => {
							if (subBlock.type === 'sticker') {
								replaceThemeShapeColor(subBlock, updatedTheme.colors.shape.color);
							} else {
								replaceThemeStylesInContent(
									subBlock,
									subBlock.content,
									updatedTheme,
									subBlock.type,
								);
							}
						});
					});
				}
			});

			updateStateValues({
				newTheme: { ...updatedTheme },
				sections: updatedSections,
				activeThemeColorsList: { ...activeThemeColorsList, ...updatedTheme?.colors },
			});

			updateHomeStateFunction({
				themes: { ...updatedTheme },
				sections: updatedSections,
			});
		}
	};

	const onColorPickerModal = (selectedColorOptions = null, open = false) => {
		let options = {
			selectedColorOptions,
			colorPickerModal: open,
		};
		setInfo((prev) => ({ ...prev, ...options }));
	};

	return (
		<div className="colorPropertiesContainer">
			<ColorActiveComponent
				primaryColor={newTheme?.colors?.background}
				secondaryColor={newTheme?.colors?.text?.p?.color}
				tertiaryColor={newTheme?.colors?.buttons?.primary?.normal?.background}
				quaternaryColor={newTheme?.colors?.buttons?.primary?.normal?.color}
				quinaryColor={newTheme?.colors?.buttons?.primary?.normal?.borderColor}
			/>

			<h1>Section Colors</h1>

			<div className="propertiesListContainer">
				<ColorCardComponent
					sectionName="Section Background"
					style={{
						backgroundColor:
							info?.colorChangedObject?.['background'] ||
							activeThemeColorsList?.background,
					}}
					inputValue={
						info?.colorChangedObject?.['background'] ||
						activeThemeColorsList?.background
					}
					onChangeFunction={(e) =>
						onChangeColorHandler(e, 'background', 'sectionBackground')
					}
					onClickFunction={() =>
						onColorPickerModal(
							{
								color: activeThemeColorsList?.background,
								propertyName: 'background',
								propertyType: 'sectionBackground',
							},
							true,
						)
					}
				/>

				<ColorCardComponent
					sectionName="Section Background 2"
					style={{
						backgroundColor:
							info?.colorChangedObject?.['background2'] ||
							activeThemeColorsList?.background2,
					}}
					inputValue={
						info?.colorChangedObject?.['background2'] ||
						activeThemeColorsList?.background2
					}
					onChangeFunction={(e) =>
						onChangeColorHandler(e, 'background2', 'sectionBackground')
					}
					onClickFunction={() =>
						onColorPickerModal(
							{
								color: activeThemeColorsList?.background2,
								propertyName: 'background2',
								propertyType: 'sectionBackground',
							},
							true,
						)
					}
				/>
			</div>

			<h1>Text Colors</h1>

			<div className="propertiesListContainer">
				{activeThemeColorsList?.text &&
					_.keys(activeThemeColorsList?.text).map((key) => {
						let colorObject = activeThemeColorsList?.text[key];
						return (
							<ColorCardComponent
								sectionName={propertyNames[key]}
								style={{
									backgroundColor:
										info?.colorChangedObject?.[key] || colorObject?.color,
								}}
								inputValue={info?.colorChangedObject?.[key] || colorObject?.color}
								onChangeFunction={(e) => onChangeColorHandler(e, key, 'text')}
								onClickFunction={() =>
									onColorPickerModal(
										{
											color: colorObject?.color,
											propertyName: key,
											propertyType: 'text',
										},
										true,
									)
								}
								key={key}
							/>
						);
					})}
			</div>

			<h1>Shape Colors</h1>

			<div className="propertiesListContainer">
				<ColorCardComponent
					sectionName="Shape Color"
					style={{
						backgroundColor:
							info?.colorChangedObject?.['shape'] ||
							activeThemeColorsList?.shape?.color,
					}}
					inputValue={
						info?.colorChangedObject?.['shape'] || activeThemeColorsList?.shape?.color
					}
					onChangeFunction={(e) => onChangeColorHandler(e, 'shape', 'shape')}
					onClickFunction={() =>
						onColorPickerModal(
							{
								color: activeThemeColorsList?.shape?.color,
								propertyName: 'color',
								propertyType: 'shape',
							},
							true,
						)
					}
				/>
			</div>

			<h1>Event</h1>

			<div className="propertiesListContainer">
				{activeThemeColorsList?.event &&
					_.keys(activeThemeColorsList?.event).map((key) => {
						let colorObject = activeThemeColorsList?.event?.[key];
						return (
							<ColorCardComponent
								sectionName={propertyNames[key]}
								style={{
									backgroundColor:
										info?.colorChangedObject?.['event-' + key + '-color'] ||
										colorObject?.color,
								}}
								inputValue={
									info?.colorChangedObject?.['event-' + key + '-color'] ||
									colorObject?.color
								}
								onChangeFunction={(e) =>
									onChangeColorHandler(e, 'event-' + key + '-color', 'event')
								}
								onClickFunction={() =>
									onColorPickerModal(
										{
											color: colorObject?.color,
											propertyName: 'event-' + key + '-color',
											propertyType: 'event',
										},
										true,
									)
								}
								key={key}
							/>
						);
					})}
			</div>

			<h1>Form Text Colors</h1>

			<div className="propertiesListContainer">
				{activeThemeColorsList?.form &&
					_.keys(activeThemeColorsList?.form).map((key) => {
						let colorObject = activeThemeColorsList?.form?.[key];
						return (
							<ColorCardComponent
								sectionName={propertyNames[key]}
								style={{
									backgroundColor:
										info?.colorChangedObject?.['form-' + key + '-color'] ||
										colorObject?.color,
								}}
								inputValue={
									info?.colorChangedObject?.['form-' + key + '-color'] ||
									colorObject?.color
								}
								onChangeFunction={(e) =>
									onChangeColorHandler(e, 'form-' + key + '-color', 'form')
								}
								onClickFunction={() =>
									onColorPickerModal(
										{
											color: colorObject?.color,
											propertyName: 'form-' + key + '-color',
											propertyType: 'form',
										},
										true,
									)
								}
								key={key}
							/>
						);
					})}
			</div>

			<h1>Form Background Colors</h1>

			<div className="propertiesListContainer">
				{activeThemeColorsList?.form &&
					_.keys(activeThemeColorsList?.form).map((key) => {
						let colorObject = activeThemeColorsList?.form?.[key];
						return (
							<ColorCardComponent
								sectionName={propertyNames[key]}
								style={{
									backgroundColor:
										info?.colorChangedObject?.['form-' + key + '-background'] ||
										colorObject?.background,
								}}
								inputValue={
									info?.colorChangedObject?.['form-' + key + '-background'] ||
									colorObject?.background
								}
								onChangeFunction={(e) =>
									onChangeColorHandler(e, 'form-' + key + '-background', 'form')
								}
								onClickFunction={() =>
									onColorPickerModal(
										{
											color: colorObject?.background,
											propertyName: 'form-' + key + '-background',
											propertyType: 'form',
										},
										true,
									)
								}
								key={key}
							/>
						);
					})}
			</div>

			<ColorPickerModal
				closeModal={onColorPickerModal}
				isOpen={info?.colorPickerModal}
				colorValue={info?.selectedColorOptions?.color}
				getSelectedColorFunc={(e) => {
					onChangeColorHandler(
						e,
						info?.selectedColorOptions?.propertyName,
						info?.selectedColorOptions?.propertyType,
					);
				}}
			/>
		</div>
	);
};

export default memo(ColorPropertiesList);
