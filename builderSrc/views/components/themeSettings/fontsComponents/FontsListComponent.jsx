import React, { memo, useState, useCallback, useContext, useEffect } from 'react';
import '../../../../assets/scss/theme-settings/font-section.scss';
import { ReactComponent as RightArrow } from '../../../../assets/svg/themeSettings/right_arrow.svg';
import Context from '../../../../context/context';
import { FontsListJson } from '../themeconstants';
import _ from 'lodash';

const top4Fonts = FontsListJson.slice(0, 4);
const INITIAL_STATE = {
	fontsArray: [],
};

const FontsListComponent = () => {
	const {
		themeSettings: {
			activeSection,
			newTheme,
			fonts,
			sections,
			updateStateValues,
			replaceThemeStylesInContent,
			updateHomeStateFunction,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		...INITIAL_STATE,
		previousTheme: null,
		previousSections: null,
	});

	useEffect(() => {
		let fontsArray = Object.values(fonts).flat();
		setInfo((prev) => ({
			...prev,
			fontsArray,
			previousTheme: _.cloneDeep(newTheme),
			previousSections: _.cloneDeep(sections),
			previousTheme: _.cloneDeep(newTheme),
			previousSections: _.cloneDeep(sections),
		}));
	}, [fonts]);

	// const handleDiscard = useCallback(() => {
	// 	if (info.previousTheme && info.previousSections) {
	// 		updateStateValues({
	// 			newTheme: info.previousTheme,
	// 			sections: info.previousSections,
	// 		});

	// 		updateHomeStateFunction({
	// 			sections: info.previousSections,
	// 			themes: info.previousTheme,
	// 		});
	// 	}
	// }, [info.previousTheme, info.previousSections]);

	const handleNextSection = useCallback(
		(sectionComponent, sectionTitle) => {
			updateStateValues({
				activeSection: {
					...activeSection,
					currentSectionComponent: sectionComponent,
					currentSectionTitle: sectionTitle,
					history: [
						...activeSection?.history,
						{
							backClickSectionTitle: 'Fonts',
							backButtonClickSection: 'fonts_list_component',
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

	return (
		<div className="fontsListContainer">
			<div className="fontListHeading">Fonts</div>
			<div className="top4FontsContainer">
				{top4Fonts.map((font, index) => {
					let primaryFont = info?.fontsArray?.find(
						(item) => item._id === font?.h1?.activeFontID,
					);
					let secondaryFont = info?.fontsArray?.find(
						(item) => item._id === font?.p?.activeFontID,
					);
					return (
						<div
							className="fontActiveContainer"
							key={'top4' + index}
							onClick={() => selectFontsCollectionHandler(font)}
						>
							<h1
								className="primary-font"
								style={{ fontFamily: font?.h1?.fontFamily }}
							>
								{primaryFont?.fontName}
							</h1>
							<h2
								className="secondary-font"
								style={{ fontFamily: font?.p?.fontFamily }}
							>
								{' '}
								{secondaryFont?.fontName}
							</h2>
						</div>
					);
				})}
			</div>

			<div className="otherOptionsDiv">
				<div
					className="option-item"
					onClick={() => handleNextSection('font_library_component', 'Fonts')}
				>
					<p>Font Library</p>
					<RightArrow />
				</div>
				<div
					className="option-item"
					onClick={() => handleNextSection('heading1_component', 'Heading 1')}
				>
					<p>Heading 1</p>
					<RightArrow />
				</div>
				<div
					className="option-item"
					onClick={() => handleNextSection('heading2_component', 'Heading 2')}
				>
					<p>Heading 2</p>
					<RightArrow />
				</div>
				<div
					className="option-item"
					onClick={() => handleNextSection('heading3_component', 'Heading 3')}
				>
					<p>Heading 3</p>
					<RightArrow />
				</div>
				<div
					className="option-item"
					onClick={() => handleNextSection('heading4_component', 'Heading 4')}
				>
					<p>Heading 4</p>
					<RightArrow />
				</div>
				<div
					className="option-item"
					onClick={() => handleNextSection('heading5_component', 'Heading 5')}
				>
					<p>Heading 5</p>
					<RightArrow />
				</div>
				<div
					className="option-item"
					onClick={() => handleNextSection('heading6_component', 'Heading 6')}
				>
					<p>Heading 6</p>
					<RightArrow />
				</div>
				<div
					className="option-item"
					onClick={() => handleNextSection('paragraph_component', 'Paragraph')}
				>
					<p>Paragraph</p>
					<RightArrow />
				</div>
				<div
					className="option-item"
					onClick={() => handleNextSection('event_component', 'Action Block')}
				>
					<p>Action Blocks</p>
					<RightArrow />
				</div>
			</div>
		</div>
	);
};

export default memo(FontsListComponent);
