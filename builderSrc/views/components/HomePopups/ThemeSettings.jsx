import React, { memo, useMemo, useState, useCallback, useEffect, useContext, useRef } from 'react';
import { Drawer } from 'antd';
import '../../../assets/scss/ThemeSettings.scss';
import { ReactComponent as DoubleArrow } from '../../../assets/svg/smartFile/doubleArrow.svg';
import { ReactComponent as LeftArrow } from '../../../assets/svg/themeSettings/left_arrow.svg';
import Context from '../../../context/context';
import ThemeActiveComponent from '../themeSettings/themeComponents/ThemeactiveComponent';
import ColorActiveComponent from '../themeSettings/colorsComponents/ColorActiveComponent';
import ButtonActiveComponent from '../themeSettings/buttonComponents/ButtonActiveComponent';
import FontActiveComponent from '../themeSettings/fontsComponents/FontActiveComponent';
import ThemesListComponent from '../themeSettings/themeComponents/ThemesListComponent';
import ColorsListComponent from '../themeSettings/colorsComponents/ColorsListComponent';
import FontsListComponent from '../themeSettings/fontsComponents/FontsListComponent';
import FontLibraryComponent from '../themeSettings/fontsComponents/FontLibraryComponent';
import HeadingComponent from '../themeSettings/fontsComponents/HeadingComponent';
import ParagraphComponent from '../themeSettings/fontsComponents/ParagraphComponent';
import EventComponent from '../themeSettings/fontsComponents/EventComponent';
import ButtonListComponent from '../themeSettings/buttonComponents/ButtonListComponent';
import ButtonsLibrary from '../themeSettings/buttonComponents/ButtonsLibrary';
import _ from 'lodash';
import ColorPropertiesList from '../themeSettings/colorsComponents/ColorPropertiesList';
import { message } from 'antd';

const MainSectionComponent = memo(({ handleSwitchSection }) => {
	const {
		themeSettings: { newTheme },
	} = useContext(Context);

	return (
		<div className="themeBodyContainer">
			<div className="settingCommonSection" style={{ marginTop: '24px' }}>
				<div
					className="headingContainer"
					onClick={() => handleSwitchSection('themes_list_component', 'Themes')}
				>
					<h1 className="headingText">Theme</h1>
					<LeftArrow />
				</div>

				<ThemeActiveComponent
					colorObject={newTheme?.colors}
					buttonObject={{
						buttons: newTheme?.buttons,
						colors: newTheme?.colors?.buttons,
						fonts: newTheme?.fonts?.buttons,
					}}
					fontStyles={newTheme?.fonts?.p}
				/>
			</div>

			<div className="settingCommonSection">
				<div
					className="headingContainer"
					onClick={() => handleSwitchSection('colors_list_component', 'Colors')}
				>
					<h1 className="headingText">Colors</h1>
					<LeftArrow />
				</div>

				<ColorActiveComponent
					primaryColor={newTheme?.colors?.background}
					secondaryColor={newTheme?.colors?.text?.p?.color}
					tertiaryColor={newTheme?.colors?.buttons?.primary?.normal?.background}
					quaternaryColor={newTheme?.colors?.buttons?.primary?.normal?.color}
					quinaryColor={newTheme?.colors?.buttons?.primary?.normal?.borderColor}
				/>
			</div>

			{/* <div className="settingCommonSection">
				<div
					className="headingContainer"
					onClick={() => handleSwitchSection('button_list_component', 'Buttons')}
				>
					<h1 className="headingText">Buttons</h1>
					<LeftArrow />
				</div>

				<ButtonActiveComponent
					buttons={newTheme?.buttons}
					colors={newTheme?.colors?.buttons}
					fonts={newTheme?.fonts?.buttons}
				/>
			</div> */}

			<div className="settingCommonSection">
				<div
					className="headingContainer"
					onClick={() => handleSwitchSection('fonts_list_component', 'Fonts')}
				>
					<h1 className="headingText">Fonts</h1>
					<LeftArrow />
				</div>

				<FontActiveComponent />
			</div>
		</div>
	);
});

const switchSectionComponents = {
	main_section_component: MainSectionComponent,
	themes_list_component: ThemesListComponent,
	colors_list_component: ColorsListComponent,
	color_properties_component: ColorPropertiesList,
	fonts_list_component: FontsListComponent,
	font_library_component: FontLibraryComponent,
	heading1_component: HeadingComponent,
	heading2_component: HeadingComponent,
	heading3_component: HeadingComponent,
	heading4_component: HeadingComponent,
	heading5_component: HeadingComponent,
	heading6_component: HeadingComponent,
	paragraph_component: ParagraphComponent,
	event_component: EventComponent,
	button_list_component: ButtonListComponent,
	buttons_library_component: ButtonsLibrary,
};

const ThemeSettings = memo((props) => {
	const {
		showThemeSettings,
		homeFonts,
		closeThemeSettings,
		updateHomeStateFunction,
		Homesections,
		handleSaveSectionsHomeFunc,
		homeThemes,
		handleUpdateThemeSettingsHomeFunc,
		homeNavBar,
	} = props;

	const {
		themeSettings: { activeSection, updateStateValues, fonts, applyTheme, newTheme,navBar },
	} = useContext(Context);

	const [info, setInfo] = useState({
		previousTheme: null,
		previousSections: null,
	});

	const previousValues = useRef({ theme: null, sections: null });

	useEffect(() => {
		if (showThemeSettings) {
			previousValues.current = {
				theme: homeThemes,
				sections: Homesections,
			};
		}
		// ONLY depend on showThemeSettings!
	}, [showThemeSettings]);

	// useEffect(() => {
	// 	updateStateValues({
	// 		updateHomeStateFunction,
	// 	});
	// }, []);
	useEffect(() => {
		updateStateValues({
			updateHomeStateFunction,
		});
	}, []);

	useEffect(() => {
		if (homeFonts && !fonts) {
			let groupedFonts = _.groupBy(homeFonts, 'group');
			updateStateValues({
				fonts: groupedFonts,
			});
		}
		if (Homesections) {
			updateStateValues({
				sections: Homesections,
			});
		}
		if (homeNavBar) {
			updateStateValues({
				navBar: homeNavBar,
			});
		}
		if (homeThemes) {
			let isInitialState = true;

			let objectData = {
				newTheme: homeThemes,
			};
			updateStateValues(objectData, isInitialState);
		}
	}, [homeFonts, Homesections, fonts, homeThemes, newTheme?.activeTheme,homeNavBar]);
	// console.log("homeNavBar",navBar)

	// const CurrentSectionComponent = useMemo(() => {
	// 	return (
	// 		switchSectionComponents[activeSection?.currentSectionComponent] ??
	// 		switchSectionComponents['main_section_component']
	// 	);
	// }, [activeSection?.currentSectionComponent]);

	const handleSwitchSection = useCallback(
		(sectionComponent, sectionTitle) => {
			updateStateValues({
				activeSection: {
					...activeSection,
					currentSectionComponent: sectionComponent,
					currentSectionTitle: sectionTitle,
					history: [
						...activeSection?.history,
						{
							backClickSectionTitle: 'Settings',
							backButtonClickSection: 'main_section_component',
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

	const handleBackButtonClick = useCallback(() => {
		let updatedHistory = [...activeSection?.history];
		let prevHistory = updatedHistory.pop();

		updateStateValues({
			activeSection: {
				...activeSection,
				currentSectionComponent: prevHistory?.backButtonClickSection,
				currentSectionTitle: prevHistory?.backClickSectionTitle,
				history: [...updatedHistory],
			},
		});
	}, [
		activeSection?.currentSectionComponent,
		activeSection?.currentSectionTitle,
		activeSection?.history,
	]);

	const handleCloseThemeSettings = useCallback(() => {
		if (applyTheme) {
			message.info('please Apply the Theme settings');
			return;
		} else {
			closeThemeSettings();
		}
	}, [applyTheme]);

	const handleApplyThemeButtonHandler = () => {
		if (!applyTheme) return;

		updateStateValues({
			applyTheme: false,
			activeSection: {
				currentSectionTitle: 'Settings',
				currentSectionComponent: 'main_section_component',
				history: [],
			},
		});
		handleSaveSectionsHomeFunc();
		handleUpdateThemeSettingsHomeFunc(newTheme);
	};

	const handleCancel = () => {
		const { theme, sections } = previousValues.current;
		if (theme && sections) {
			updateStateValues({
				newTheme: theme,
				sections: sections,
			});
			updateHomeStateFunction({
				sections: sections,
				themes: theme,
			});
		}
		closeThemeSettings();
	};
	const CurrentSectionComponent =
		switchSectionComponents[activeSection?.currentSectionComponent] ??
		switchSectionComponents['main_section_component'];

	return (
		<Drawer
			onClose={() => {}}
			open={showThemeSettings}
			width={'360px'}
			style={{ padding: '0px', backgroundColor: 'transparent', padding: 0 }}
			styles={{
				body: { padding: 0 },
				header: { display: 'none' },
			}}
			rootClassName="settingsDrawerWrapper"
			mask={false}
		>
			<div className="themeSettingsParentContainer">
				<div className="themeSettingsHeader">
					<div
						className="title"
						onClick={
							activeSection?.currentSectionComponent === 'main_section_component'
								? handleCloseThemeSettings
								: handleBackButtonClick
						}
					>
						{activeSection?.currentSectionComponent === 'main_section_component' ? (
							<DoubleArrow />
						) : (
							<LeftArrow />
						)}
						{activeSection?.currentSectionTitle}
					</div>
					<div style={{ display: 'flex', gap: '10px' }}>
						<div style={{ display: 'flex', gap: '8px' }}>
							<button
								onClick={handleCancel}
								style={{
									background: applyTheme ? '#F2F2F3' : '',
									color: applyTheme ? '#0C0C0D' : '',
								}}
							>
								Cancel
							</button>
						</div>

						<div style={{ display: 'flex', gap: '8px' }}>
							<button
								onClick={handleApplyThemeButtonHandler}
								style={{
									background: applyTheme ? '#F2F2F3' : '',
									color: applyTheme ? '#0C0C0D' : '',
									cursor: applyTheme ? '' : 'not-allowed',
								}}
							>
								Apply
							</button>
						</div>
					</div>
				</div>

				{/* <main style={{ overflowY: 'auto' }}>
					<CurrentSectionComponent
						handleSwitchSection={handleSwitchSection}
						updateHomeStateFunction={updateHomeStateFunction}
					/>
				</main> */}
				<main style={{ overflowY: 'auto' }}>
					<CurrentSectionComponent
						handleSwitchSection={handleSwitchSection}
						updateHomeStateFunction={updateHomeStateFunction}
						info={info}
						setInfo={setInfo}
					/>
				</main>
			</div>
		</Drawer>
	);
});

export default ThemeSettings;
