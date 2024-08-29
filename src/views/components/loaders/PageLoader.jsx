import React from 'react';
import '../../../assets/scss/pageLoader.scss';
import { ReactComponent as Logo } from '../../../assets/svg/loaderLogo.svg';
const PageLoader = () => {
	return (
		<div className="mainBody">
			<div className="mainDiv">
				<div className="logoParent">
					<Logo className="logoDiv" />
				</div>
				<div className="text">Own Your Future</div>
			</div>
		</div>
	);
};

export default PageLoader;
