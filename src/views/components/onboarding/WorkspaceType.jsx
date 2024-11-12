import React, { memo, useRef, useEffect } from 'react';
import gsap from 'gsap';

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
	const businessTypeRef = useRef(null);

	useEffect(() => {
		gsap.fromTo(
			businessTypeRef.current,
			{ opacity: 0 },
			{
				opacity: 1,
				duration: 1,
				ease: 'power2.inOut',
			},
		);
	}, []);

	const handleSelectType = (type) => {
		gsap.to(businessTypeRef.current, {
			opacity: 0,
			duration: 1,
			ease: 'power2.inOut',
		});
		setOnboardingInfo((prev) => ({
			...prev,
			workspaceType: type.value,
			step: prev?.step + 1,
		}));
	};

	return (
		<div ref={businessTypeRef} className="workspace-type-container">
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
