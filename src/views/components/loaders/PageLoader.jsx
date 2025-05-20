import React from 'react';
import '../../../assets/scss/pageLoader.scss';
import Logo from '../../../assets/svg/windmill.svg?react';
const InitialPageLoader = () => {
	return (
		<div className="mainBody">
			<div className="mainDiv">
				<div className="logoParent">
					<Logo className="logoDiv" />
				</div>
				<div className="text">Home of AI Workers</div>
			</div>
		</div>
	);
};

export default InitialPageLoader;
