import React from 'react';
import '../../../assets/scss/home_page/homepage.scss';

const HeaderInfo = ({ title, subTitle }) => {
	return (
		<div className="home-page-welcome-container-left-text">
			<div className="home-page-hey-there-text">{title}</div>
			<div className="home-page-help-text">{subTitle}</div>
		</div>
	);
};

export default HeaderInfo;
