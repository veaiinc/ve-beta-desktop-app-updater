import React, { memo } from 'react';
import '../../../assets/scss/onboarding/index.scss';

const CreatingNewWorkspace = ({ profession }) => {
	return (
		<div className="creating-new-workspace-container">
			<h1>{profession}</h1>
		</div>
	);
};

export default memo(CreatingNewWorkspace);
