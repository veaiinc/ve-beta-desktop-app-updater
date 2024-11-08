import React, { memo } from 'react';

const businessTypes = [
	{
		id: 1,
		name: 'Professional',
		value: 'professional',
	},
	{
		id: 2,
		name: 'Enterprise',
		value: 'enterprise',
	},
];

const WorkspaceType = ({ setOnboardingInfo }) => {
	const handleSelectType = (type) => {
		setOnboardingInfo((prev) => ({
			...prev,
			workspaceType: type.value,
			step: prev?.step + 1,
			stage: prev?.stage + 1,
		}));
	};

	return (
		<div className="workspace-type-container">
			{businessTypes.map((type) => (
				<div
					key={type.id}
					onClick={() => handleSelectType(type)}
					className="workspace-type-option"
				>
					<h1>{type.name}</h1>
				</div>
			))}
		</div>
	);
};

export default memo(WorkspaceType);
