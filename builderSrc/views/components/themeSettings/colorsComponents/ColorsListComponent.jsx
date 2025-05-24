import React, { memo, useContext, useCallback, useState, useEffect } from 'react';
import ColorActiveComponent from './ColorActiveComponent';
import '../../../../assets/scss/theme-settings/color-section.scss';
import Context from '../../../../context/context';
import { ReactComponent as RightArrow } from '../../../../assets/svg/themeSettings/arrow_right.svg';
import { ColorsListJson } from '../themeconstants';
import _ from 'lodash';

const newDefaultColors = _.cloneDeep(ColorsListJson);

const ColorsListComponent = () => {
	const {
		themeSettings: {
			updateStateValues,
			newTheme,
			sections,
			updateHomeStateFunction,
			replaceThemeBackgroundColor,
			replaceThemeStylesInContent,
			replaceThemeShapeColor,
			activeSection,
		},
	} = useContext(Context);

	// Add state to store original theme and sections
	const [previousState, setPreviousState] = useState({
		theme: null,
		sections: null,
	});

	// Store original state when component mounts
	useEffect(() => {
		setPreviousState({
			theme: _.cloneDeep(newTheme),
			sections: _.cloneDeep(sections),
		});
	}, []);

	// const handleDiscard = useCallback(() => {
	// 	if (previousState.theme && previousState.sections) {
	// 		updateStateValues({
	// 			newTheme: previousState.theme,
	// 			sections: previousState.sections,
	// 		});

	// 		updateHomeStateFunction({
	// 			sections: previousState.sections,
	// 			themes: previousState.theme,
	// 		});
	// 	}
	// }, [previousState]);

	const handleColorClick = useCallback(
		(colorTheme) => {
			let updateTheme = _.cloneDeep(newTheme);
			let updatedSections = _.cloneDeep(sections);

			updateTheme.colors = colorTheme;

			updatedSections.forEach((section, index) => {
				// for background color
				replaceThemeBackgroundColor(
					section.style,
					index % 2 === 0
						? updateTheme.colors.background
						: updateTheme.colors.background2,
				);

				// iterate blocks
				section?.blocks?.forEach((block) => {
					// iterate subBlocks
					block?.subBlocks?.forEach((subBlock) => {
						// for button
						// if (subBlock.type === 'button') {
						// 	replaceButtonColor(subBlock, updateTheme.button);
						// }
						if (subBlock.type === 'sticker') {
							replaceThemeShapeColor(subBlock, updateTheme.colors.shape.color);
						} else {
							replaceThemeStylesInContent(
								subBlock,
								subBlock.content,
								updateTheme,
								subBlock.type,
							);
						}
					});
				});
			});

			updateStateValues({
				newTheme: { ...updateTheme },
				sections: updatedSections,
			});

			updateHomeStateFunction({
				sections: updatedSections,
				themes: { ...updateTheme },
			});
		},
		[newTheme?.colors],
	);

	const handleAllPropertiesButtonHandler = useCallback(
		(e, fontsProperties = null) => {
			e.preventDefault();
			e.stopPropagation();

			let updatedActiveSection = _.cloneDeep(activeSection);
			updatedActiveSection.currentSectionComponent = 'color_properties_component';
			updatedActiveSection.currentSectionTitle = 'Color Properties';
			updatedActiveSection.history = [
				...activeSection?.history,
				{
					backClickSectionTitle: 'Colors',
					backButtonClickSection: 'colors_list_component',
				},
			];

			updateStateValues({
				activeSection: updatedActiveSection,
				activeThemeColorsList: fontsProperties ? fontsProperties : newTheme?.colors,
			});
		},
		[activeSection?.currentSectionComponent],
	);

	return (
		<div className="colorsListContainer">
			<ColorActiveComponent
				primaryColor={newTheme?.colors?.background}
				secondaryColor={newTheme?.colors?.text?.p?.color}
				tertiaryColor={newTheme?.colors?.buttons?.primary?.normal?.background}
				quaternaryColor={newTheme?.colors?.buttons?.primary?.normal?.color}
				quinaryColor={newTheme?.colors?.buttons?.primary?.normal?.borderColor}
				handleColorClick={handleAllPropertiesButtonHandler}
			/>

			{/* <div className="colorPalletsList">
				{defaultColors
					?.filter((color) => color.id !== themeSettings?.colors?.id)
					.map((color) => (
						<div
							key={color.id}
							className="color-palletDiv"
							onClick={() => handleColorClick(color)}
						>
							{color?.pallets?.map((pallet) => (
								<div
									key={pallet.id}
									className={pallet.id}
									style={{ background: pallet.color }}
								></div>
							))}
						</div>
					))}
			</div> */}

			<div className="newColorsThemeList">
				{newDefaultColors.map((color) => (
					<div
						key={color.id}
						className="newColorsThemeItem"
						style={{ background: color?.background }}
						onClick={() => handleColorClick(color)}
					>
						<p className="fontName">A</p>
						<p className="fontThemeName">{color.name}</p>
						<RightArrow onClick={(e) => handleAllPropertiesButtonHandler(e, color)} />
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(ColorsListComponent);
