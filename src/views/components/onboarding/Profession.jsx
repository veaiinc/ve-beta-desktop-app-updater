import React, { memo } from 'react';

const professions = [
	'student',
	'doctor',
	'photographer',
	'real estate',
	'technologist',
	'therapist',
	'chef',
	'boutique',
	'lawyer',
];

const Profession = ({ setOnboardingInfo }) => {
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
				{professions.map((profession) => (
					<div
						key={profession}
						onClick={() => handleSelectProfession(profession)}
						className="profession-option"
					>
						<h1>{profession}</h1>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(Profession);
