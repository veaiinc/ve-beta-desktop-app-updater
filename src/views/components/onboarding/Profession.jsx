import React, { memo, useEffect } from 'react';

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

const Profession = ({ onboardingInfo, setOnboardingInfo }) => {
	const handleSelectProfession = (profession) => {
		setOnboardingInfo((prev) => ({
			...prev,
			profession: profession,
			step: prev?.step + 1,
		}));
	};

	return (
		<div className="profession-grid-container">
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
