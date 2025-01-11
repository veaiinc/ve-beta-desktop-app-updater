import React from 'react';
import { ReactComponent as Logo } from '../../../assets/svg/loader/loaderLogo.svg';
import '../../../assets/scss/loaders/updatedPageLoader.scss';

const UpdatedPageLoader = () => {
	return (
		<div className="mainBodyNormal" style={{ width: '100%', height: '100%' }}>
			<div className="mainDivNormal">
				<div className="logoParentNormal">
					<Logo className="logoDivNormal" />
				</div>
				<div className="textNormal">Home of AI Workers</div>
			</div>
		</div>
	);
};

export default UpdatedPageLoader;
