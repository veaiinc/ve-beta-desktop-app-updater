import React, { memo } from 'react';
import '../../../../assets/scss/theme-settings/font-section.scss';

const FontActiveComponent = () => {
	return (
		<div className="sectionViewContainer ">
			<div className="fontActiveContainer">
				<h1 className="primary-font">Primary Font</h1>
				<h2 className="secondary-font">Secondary Font</h2>
			</div>
		</div>
	);
};

export default memo(FontActiveComponent);
