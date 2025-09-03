import React, { memo, useEffect, useState, useContext, useCallback } from 'react';
import ThemeActiveComponent from './ThemeactiveComponent';
import '../../../../assets/scss/theme-settings/theme-section.scss';
import Context from '../../../../context/context';
import _ from 'lodash';
import { ThemesListJson } from '../themeconstants';

const newDefaultThemes = _.cloneDeep(ThemesListJson);

const ThemesListComponent = () => {
	const {
		themeSettings: {
			updateStateValues,
			updateHomeStateFunction,
			sections,
			newTheme,
			replaceThemeBackgroundColor,
			replaceThemeStylesInContent,
			replaceThemeShapeColor,
			navBar,
		},
	} = useContext(Context);

	// const [info, setinfo] = useState({
	// 	uniqueCategories: [],
	// 	previousTheme: null,
	// 	previousSections: null,
	// });

	const [uniqueCategories, setUniqueCategories] = useState([]);
	// useEffect(() => {
	// 	let uniqueCategories = newDefaultThemes.map((theme) => theme.category);
	// 	setinfo({
	// 		...info,
	// 		uniqueCategories: [...new Set(uniqueCategories)],
	// 		previousTheme: newTheme,
	// 		previousSections: sections,
	// 	});
	// }, []);
	useEffect(() => {
		const categories = newDefaultThemes.map((theme) => theme.category);
		setUniqueCategories([...new Set(categories)]);
	}, []);

	const handleSelectTheme = useCallback(
		(theme, index) => {
			let updateTheme = _.cloneDeep(theme);
			updateTheme.activeTheme = theme?.id;
			let updatedSections = _.cloneDeep(sections);

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

			// 		updateStateValues({
			// 			newTheme: { ...updateTheme },
			// 			sections: updatedSections,
			// 		});

			// 		updateHomeStateFunction({
			// 			sections: updatedSections,
			// 			themes: { ...updateTheme },
			// 		});
			// 	},
			// 	[newTheme?.activeTheme],
			// );
			let newUpdateNavBar = _.cloneDeep(navBar);
			newUpdateNavBar.style.sectionBackgroundColor = updateTheme.colors.background;

			updateStateValues({
				newTheme: { ...updateTheme },
				sections: updatedSections,
				navBar: { ...newUpdateNavBar },
			});

			updateHomeStateFunction({
				sections: updatedSections,
				themes: { ...updateTheme },
				navBar: { ...newUpdateNavBar },
			});
		},
		[newTheme?.activeTheme, navBar],
	);

	return (
		<div className="themeListContainer">
			<ThemeActiveComponent
				colorObject={newTheme?.colors}
				buttonObject={{
					buttons: newTheme?.buttons,
					colors: newTheme?.colors?.buttons,
					fonts: newTheme?.fonts?.buttons,
				}}
				fontStyles={newTheme?.fonts?.p}
			/>

			<div className="themesListMainContainer">
				{uniqueCategories.map((category, index) => (
					<div className="mainContainerDiv" key={category + index}>
						<h1 className="categoryName">{category}</h1>

						{newDefaultThemes
							.filter((theme) => theme.category === category)
							.map((theme, index) => (
								<div
									className={`commonButtonParentContainer activeThemeSection`}
									key={'themepallets' + theme.id}
									onClick={() => handleSelectTheme(theme, index)}
								>
									<p
										className="theme-font"
										style={{
											color: theme?.colors?.text?.p,
											...theme?.fonts?.p,
											fontSize: '36px',
										}}
									>
										A
									</p>

									<div className="theme-colorPalletDiv">
										<div
											className="primary-color"
											style={{
												backgroundColor: theme?.colors?.background,
											}}
										></div>
										<div
											className="secondary-color"
											style={{
												backgroundColor: theme?.colors?.text?.p?.color,
											}}
										></div>
										<div
											className="tertiary-color"
											style={{
												backgroundColor:
													theme?.colors?.buttons?.primary?.normal
														?.background,
											}}
										></div>
									</div>

									<div
										className="theme-button"
										style={{
											...theme?.buttons?.primary?.normal,
											...theme?.colors?.buttons?.primary?.normal,
											...theme?.fonts?.buttons?.primary,
										}}
									>
										Buttons
									</div>
								</div>
							))}

						{index !== uniqueCategories.length - 1 && (
							<div className="bottom-line"></div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(ThemesListComponent);
