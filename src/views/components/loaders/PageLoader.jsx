import React from 'react';
import '../../../assets/scss/pageLoader.scss';
import { ReactComponent as Logo } from '../../../assets/svg/loader/loaderLogo.svg';
import { ReactComponent as Stick } from '../../../assets/svg/loader/stick.svg';
const InitialPageLoader = () => {
	return (
		<div className="mainBody">
			<div className="mainDiv">
				<div className="logoParent">
					<Logo className="logoDiv" />
					<Stick className="stickDiv" />
				</div>
				<div className="text">Home of AI Workers</div>
			</div>
		</div>
	);
};

export default InitialPageLoader;
