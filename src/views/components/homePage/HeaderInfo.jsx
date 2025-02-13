import React, { memo } from 'react';
import '../../../assets/scss/home_page/homepage.scss';

const HeaderInfo = ({ title, subTitle }) => {
	return (
		<div className="home-page-welcome-container-left-text">
			<div className="home-page-hey-there-text">All your Prompts</div>
			<div className="home-page-help-text">you need to ask me</div>
		</div>
	);
};

export default memo(HeaderInfo);
