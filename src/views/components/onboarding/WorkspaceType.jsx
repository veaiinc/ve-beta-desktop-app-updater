import React, { memo, useRef, useEffect, useState } from 'react';
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

const WorkspaceType = ({ setWorkspaceType, incrementStep }) => {
	const businessTypeRef = useRef(null);
	const [info, setInfo] = useState({
		optionSelected: false,
	});

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
		if (info?.optionSelected) return;
		setInfo((prev) => ({ ...prev, optionSelected: true }));
		gsap.to(businessTypeRef.current, {
			opacity: 0,
			duration: 1,
			ease: 'power2.inOut',
		});
		setWorkspaceType(type.value);
		incrementStep();
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
