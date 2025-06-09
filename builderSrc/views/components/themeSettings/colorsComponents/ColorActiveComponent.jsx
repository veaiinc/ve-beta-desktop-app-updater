import React, { memo, useCallback } from 'react';
import '../../../../assets/scss/theme-settings/color-section.scss';

const ColorActiveComponent = ({
	primaryColor = '',
	secondaryColor = '',
	tertiaryColor = '',
	quaternaryColor = '',
	quinaryColor = '',
	handleColorClick = null,
}) => {
	const onClickColorFunction = useCallback(
		(e) => {
			if (handleColorClick) {
				handleColorClick(e);
			}
		},
		[handleColorClick],
	);

	return (
		<div
			className="commonColorParentContainer activeFontsSection"
			onClick={onClickColorFunction}
		>
			<div className="color-palletDiv">
				<div className="primary-color" style={{ background: primaryColor }}></div>
				<div className="secondary-color" style={{ background: secondaryColor }}></div>
				<div className="tertiary-color" style={{ background: tertiaryColor }}></div>
				<div className="quaternary-color" style={{ background: quaternaryColor }}></div>
				<div className="quinary-color" style={{ background: quinaryColor }}></div>
			</div>
		</div>
	);
};

export default memo(ColorActiveComponent);
