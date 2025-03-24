import React, { memo, useRef, useState } from 'react';

const professions = {
	professional: {
		id: 1,
		professions: [
			{ id: 1, name: 'Photography', value: 'photographer' },
			{ id: 2, name: 'Agency', value: 'agency' },
			{ id: 3, name: 'Interior Designer', value: 'interiorDesigner' },
			{ id: 4, name: 'Consultant', value: 'consultant' },
			{ id: 5, name: 'Salon and Spa', value: 'salonAndSpa' },
			{ id: 6, name: 'Architecture', value: 'architecture' },
			{ id: 7, name: 'Fashion Designer', value: 'fashionDesigner' },
			{ id: 8, name: 'Event Management', value: 'eventManagement' },
			{ id: 9, name: 'Business Coach', value: 'businessCoach' },
			{ id: 10, name: 'Restaurateur', value: 'restaurateur' },
		],
	},
	enterprise: {
		id: 2,
		professions: [
			{ id: 1, name: 'Information Technology', value: 'informationTechnology' },
			{ id: 2, name: 'Healthcare', value: 'healthCare' },
		],
	},
};

const Profession = ({
	workspaceType,
	setProfession,
	animateStep5AndStage4Exit,
	createWorkspaceUsername,
	jumpToStep8AndHandleOnboarding,
}) => {
	const professionRef = useRef(null);
	const [info, setInfo] = useState({
		optionSelected: false,
	});

	const handleSelectProfession = (profession) => {
		if (info?.optionSelected) return;
		setInfo((prev) => ({ ...prev, optionSelected: true }));
		setProfession(profession);
		if (!createWorkspaceUsername) animateStep5AndStage4Exit();
		else jumpToStep8AndHandleOnboarding();
	};

	return (
		<div ref={professionRef} className="profession-grid-container stage4">
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
