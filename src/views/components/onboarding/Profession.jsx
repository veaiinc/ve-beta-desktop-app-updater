import React, { memo, useEffect, useRef } from 'react';
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

const Profession = ({ onboardingInfo, setOnboardingInfo, step6Ref }) => {
	const professionRef = useRef(null);

	useEffect(() => {
		gsap.fromTo(
			professionRef.current,
			{ opacity: 0 },
			{ opacity: 1, duration: 1, delay: 0.5, ease: 'power2.inOut' },
		);
	}, []);

	const handleSelectProfession = (profession) => {
		// gsap.to(step6Ref?.current, {
		// 	opacity: 0,
		// 	duration: 1,
		// 	ease: 'power2.out',
		// });
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
					setOnboardingInfo((prev) => ({
						...prev,
						profession: profession,
						step: prev?.step + 1,
					}));
				},
			},
		);
	};

	return (
		<div ref={professionRef} className="profession-grid-container">
			<div className="profession-grid">
				{professions[onboardingInfo?.workspaceType]?.professions?.map((profession) => (
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
