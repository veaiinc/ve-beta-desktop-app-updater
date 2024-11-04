import React, { memo } from 'react';

const businessTypes = ['personal', 'professional', 'enterprise'];

const WorkspaceType = ({ setOnboardingInfo }) => {
	const handleSelectType = (type) => {
		setOnboardingInfo((prev) => ({
			...prev,
			workspaceType: type,
			step: prev?.step + 1,
			stage: prev?.stage + 1,
		}));
	};

	return (
		<div className="workspace-type-container">
			{businessTypes.map((type) => (
				<div onClick={() => handleSelectType(type)} className="workspace-type-option">
					<h1>{type}</h1>
				</div>
			))}
		</div>
	);
};

export default memo(WorkspaceType);
