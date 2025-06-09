import React, { memo, useState, useContext, useEffect, useCallback } from 'react';
import '../../../../assets/scss/theme-settings/font-section.scss';
import Context from '../../../../context/context';
import _ from 'lodash';
import { FontsListJson } from '../themeconstants';

export const newFontsList = _.cloneDeep(FontsListJson);

const INITIAL_STATE = {
	fontsArray: [],
};
const FontLibraryComponent = () => {
	const {
		themeSettings: {
			fonts,
			newTheme,
			updateStateValues,
			sections,
			replaceThemeStylesInContent,
			updateHomeStateFunction,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({ ...INITIAL_STATE });

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

	const selectFontsCollectionHandler = useCallback(
		(fontsCollection) => {
			let updateTheme = _.cloneDeep(newTheme);
			let updatedSections = _.cloneDeep(sections);

			updateTheme.fonts = _.cloneDeep(fontsCollection);

			updateSectionsContentFunction(updatedSections, updateTheme);
		},
		[newTheme?.fonts],
	);

	useEffect(() => {
		let fontsArray = Object.values(fonts).flat();
		setInfo((prev) => ({
			...prev,
			fontsArray,
		}));
	}, [fonts]);

	return (
		<div className="fontLibraryContainer">
			<div className="headingTitle">Fonts</div>

			{newFontsList.map((font, index) => {
				let primaryFont = info?.fontsArray?.find(
					(item) => item._id === font?.h1?.activeFontID,
				);
				let secondaryFont = info?.fontsArray?.find(
					(item) => item._id === font?.p?.activeFontID,
				);

				return (
					<div
						className="singleFontListContainer"
						key={index}
						onClick={() => selectFontsCollectionHandler(font)}
					>
						<h1 className="primary-font" style={{ fontFamily: font?.h1?.fontFamily }}>
							{primaryFont?.fontName}
						</h1>
						<h2 className="secondary-font" style={{ fontFamily: font?.p?.fontFamily }}>
							{secondaryFont?.fontName}
						</h2>
					</div>
				);
			})}
		</div>
	);
};

export default memo(FontLibraryComponent);
