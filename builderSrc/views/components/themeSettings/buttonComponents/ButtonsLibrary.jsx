import React, { memo, useContext, useCallback } from 'react';
import '../../../../assets/scss/theme-settings/button-section.scss';
import Context from '../../../../context/context';
import _ from 'lodash';
const defaultButtonLibrary = [
	{
		id: 1,
		name: 'Button 1',
		styles: {
			color: '#FFFFFF',
			borderRadius: '12px',
			border: '1px solid #EBF6F9',
			background: 'transparent',
		},
	},
	{
		id: 2,
		name: 'Button 2',
		styles: {
			color: '#202123',
			borderRadius: '0px 12px',
			border: '1px solid #EBF6F9',
			background: '#F2F2F3',
		},
	},
	{
		id: 3,
		name: 'Button 3',
		styles: {
			color: '#202123',
			borderRadius: '0',
			border: '1px solid #EBF6F9',
			background: '#F2F2F3',
		},
	},
	{
		id: 4,
		name: 'Button 4',
		styles: {
			color: '#FFFFFF',
			borderRadius: '0px',
			border: '1px solid #EBF6F9',
			background: 'transparent',
		},
	},
	{
		id: 5,
		name: 'Button 5',
		styles: {
			color: '#FFFFFF',
			borderRadius: '0px',
			border: 'none',
			borderBottom: '1px solid #EBF6F9',
			background: 'transparent',
		},
	},
	{
		id: 6,
		name: 'Button 6',
		styles: {
			color: '#FFFFFF',
			borderRadius: '8px',
			border: 'none',
			background: 'transparent',
		},
	},
];

const ButtonsLibrary = () => {
	const {
		themeSettings: { updateStateValues, updateHomeStateFunction, themeSettings, sections },
	} = useContext(Context);

	const replaceButtonColor = (button, themeStyles) => {
		button.isTheme = true;
		button.ThemeStylings = themeStyles;
	};

	const handleButtonClick = useCallback((button) => {
		let updatedSections = _.cloneDeep(sections);
		updatedSections.forEach((section) => {
			// iterate blocks
			section?.blocks?.forEach((block) => {
				// iterate subBlocks
				block?.subBlocks?.forEach((subBlock) => {
					// for button
					if (subBlock.type === 'button') {
						replaceButtonColor(subBlock, button.styles);
					}
				});
			});
		});

		updateStateValues({
			sections: updatedSections,
		});

		updateHomeStateFunction({
			sections: updatedSections,
		});
	}, []);

	return (
		<div className="buttonLibraryContainer">
			<br />

			{defaultButtonLibrary.map((button) => (
				<div className="buttonLibraryButton" key={button.id}>
					<button style={button.styles} onClick={() => handleButtonClick(button)}>
						{button.name}
					</button>
				</div>
			))}
		</div>
	);
};

export default memo(ButtonsLibrary);
