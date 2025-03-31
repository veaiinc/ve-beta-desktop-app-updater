import { memo, useEffect } from 'react';
import '../../../assets/scss/onboarding/WorkspaceTypeOptions.scss';
import { animateFadeIn } from '../../features/onboarding/Onboarding';

const dropdownOptions = [
	{
		id: 1,
		label: 'Make Up Artist',
		value: 'makeUpArtist',
	},
	{
		id: 2,
		label: 'Consultant',
		value: 'consultant',
	},
	{
		id: 3,
		label: 'Salon and Spa',
		value: 'salonAndSpa',
	},
	{
		id: 4,
		label: 'Fashion Designer',
		value: 'fashionDesigner',
	},
	{
		id: 5,
		label: 'Event Management',
		value: 'eventManagement',
	},
	{
		id: 6,
		label: 'Interior Designer',
		value: 'interiorDesigner',
	},
	{
		id: 7,
		label: 'Business Coach',
		value: 'businessCoach',
	},
	{
		id: 8,
		label: 'Restaurateur',
		value: 'restaurateur',
	},
	{
		id: 9,
		label: 'Information Technology',
		value: 'informationTechnology',
	},
	{
		id: 10,
		label: 'Health Care',
		value: 'healthCare',
	},
	{
		id: 11,
		label: 'Photographer',
		value: 'photographer',
	},
	{
		id: 12,
		label: 'Agency',
		value: 'agency',
	},
];

const WorkspaceTypeOptions = () => {
	useEffect(() => {
		const selector = '.workspaceTypeOptions';
		animateFadeIn(selector);
	}, []);

	return (
		<div className="workspaceTypeOptions">
			{dropdownOptions?.map((option) => (
				<div key={option?.id} className="option">
					<h1 className="optionLabel">{option?.label}</h1>
				</div>
			))}
		</div>
	);
};

export default memo(WorkspaceTypeOptions);
