import React, { memo, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const professions = {
	professional: {
		id: 1,
		professions: [
			{
				id: 1,
				name: 'Photography',
				value: 'photography',
			},
			{
				id: 2,
				name: 'Agency',
				value: 'agency',
			},
			{
				id: 3,
				name: 'Interior Designing',
				value: 'interior_designing',
			},
		],
	},
	enterprise: {
		id: 2,
		professions: [
			{
				id: 1,
				name: 'Information Technology',
				value: 'information_technology',
			},
			{
				id: 2,
				name: 'Healthcare',
				value: 'healthcare',
			},
		],
	},
};

const Profession = ({ workspaceType, setProfession, incrementStep }) => {
	const professionRef = useRef(null);
	const [info, setInfo] = useState({
		optionSelected: false,
	});

	useEffect(() => {
		gsap.fromTo(
			professionRef.current,
			{ opacity: 0 },
			{ opacity: 1, duration: 1, delay: 0.5, ease: 'power2.inOut' },
		);
	}, []);

	const handleSelectProfession = (profession) => {
		if (info?.optionSelected) return;
		setInfo((prev) => ({ ...prev, optionSelected: true }));
		gsap.fromTo(
			professionRef.current,
			{
				opacity: 1,
			},
			{
				opacity: 0,
				duration: 1,
				ease: 'power2.inOut',
				onComplete: () => {
					setProfession(profession);
					incrementStep();
				},
			},
		);
	};

	return (
		<div ref={professionRef} className="profession-grid-container">
			<div className="profession-grid">
				{professions[workspaceType]?.professions?.map((profession) => (
					<div
						key={profession?.id}
						onClick={() => handleSelectProfession(profession?.value)}
						className="profession-option"
					>
						<h1>{profession?.name}</h1>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(Profession);
