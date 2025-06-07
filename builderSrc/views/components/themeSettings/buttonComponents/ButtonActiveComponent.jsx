import React, { memo, useMemo } from 'react';
import '../../../../assets/scss/theme-settings/button-section.scss';

const ButtonActiveComponent = ({ buttons, colors, fonts }) => {
	const styles = useMemo(() => {
		const activeButton = buttons?.buttonType;
		let buttonStyles = buttons[activeButton]?.normal;
		let buttonColors = colors[activeButton]?.normal;
		let buttonFonts = fonts[activeButton];

		return {
			...buttonStyles,
			...buttonColors,
			...buttonFonts,
		};
	}, [colors, buttons, fonts]);

	return (
		<div className="sectionViewContainer">
			<div className="buttonActiveComponentContainer" style={styles}>
				<div className="buttonTitle">Button Title</div>
			</div>
		</div>
	);
};

export default memo(ButtonActiveComponent);
