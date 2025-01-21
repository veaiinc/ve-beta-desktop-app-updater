import React from 'react';

const HeaderInfo = ({ title, subTitle }) => {
	return (
		<>
			<div className="home-page-header-title-text">{title}</div>
			<div className="home-page-header-sub-title-text">{subTitle}</div>
		</>
	);
};

export default HeaderInfo;
