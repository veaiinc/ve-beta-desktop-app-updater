import React, { memo, useRef, useState } from 'react';
import '../../../assets/scss/onboarding/index.scss';
import { ReactComponent as SmallBusinessIcon } from '../../../assets/svg/onboarding/small-business.svg';
import { ReactComponent as EnterpriseIcon } from '../../../assets/svg/onboarding/enterprise.svg';

const businessTypes = [
	{
		id: 1,
		name: 'Small Business',
		icon: <SmallBusinessIcon />,
		value: 'smallBusiness',
	},
	{
		id: 2,
		name: 'Enterprise',
		icon: <EnterpriseIcon />,
		value: 'enterprise',
	},
];

const WorkspaceType = ({ setWorkspaceType, animateStage3AndStep4Exit }) => {
	const businessTypeRef = useRef(null);
	const [info, setInfo] = useState({
		optionSelected: false,
	});

	const handleSelectType = (type) => {
		if (info?.optionSelected) return;
		setInfo((prev) => ({ ...prev, optionSelected: true }));
		setWorkspaceType(type.value);
		animateStage3AndStep4Exit();
	};

	return (
		<div ref={businessTypeRef} className="workspace-type-container stage3">
			{businessTypes.map((type) => (
				<div
					key={type.id}
					onClick={() => handleSelectType(type)}
					className="workspace-type-option"
				>
					{type.icon}
					<h1>{type.name}</h1>
				</div>
			))}
		</div>
	);
};

export default memo(WorkspaceType);
