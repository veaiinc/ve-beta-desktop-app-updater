import React, { memo, useRef, useState } from 'react';

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
				value: 'interiorDesigning',
			},
		],
	},
	enterprise: {
		id: 2,
		professions: [
			{
				id: 1,
				name: 'Information Technology',
				value: 'informationTechnology',
			},
			{
				id: 2,
				name: 'Healthcare',
				value: 'healthcare',
			},
		],
	},
};

const Profession = ({ workspaceType, setProfession, animateStep5AndStage4Exit }) => {
	const professionRef = useRef(null);
	const [info, setInfo] = useState({
		optionSelected: false,
	});

	const handleSelectProfession = (profession) => {
		if (info?.optionSelected) return;
		setInfo((prev) => ({ ...prev, optionSelected: true }));
		setProfession(profession);
		animateStep5AndStage4Exit();
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
