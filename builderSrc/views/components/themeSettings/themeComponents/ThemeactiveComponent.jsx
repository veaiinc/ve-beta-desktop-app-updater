import React, { memo, useMemo } from 'react';
import '../../../../assets/scss/theme-settings/theme-section.scss';

const ThemeActiveComponent = (props) => {
	const { parentClassName = '', buttonObject = {}, colorObject = {}, fontStyles = {} } = props;

	const btnStyles = useMemo(() => {
		const { buttons, colors, fonts } = buttonObject;
		const activeButton = buttons?.buttonType;
		let buttonStyles = buttons?.[activeButton]?.normal;
		let buttonColors = colors?.[activeButton]?.normal;
		let buttonFonts = fonts?.[activeButton];

		return {
			...buttonStyles,
			...buttonColors,
			...buttonFonts,
		};
	}, [buttonObject]);
	return (
		<div className={`commonButtonParentContainer activeThemeSection ${parentClassName}`}>
			<p className="theme-font" style={{ ...fontStyles, fontSize: '36px' }}>
				A
			</p>
			<div className="theme-colorPalletDiv">
				<div
					className="primary-color"
					style={{ backgroundColor: colorObject?.background }}
				></div>
				<div
					className="secondary-color"
					style={{ backgroundColor: colorObject?.text?.p?.color }}
				></div>
				<div
					className="tertiary-color"
					style={{ backgroundColor: colorObject?.buttons?.primary?.normal?.background }}
				></div>
			</div>
			<div className="theme-button" style={btnStyles}>
				Buttons
			</div>
		</div>
	);
};

export default memo(ThemeActiveComponent);
