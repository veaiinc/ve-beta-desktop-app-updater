import { memo } from 'react';
import '../../../assets/scss/onboarding/WorkspaceTypeOptions.scss';

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
		label: 'Healthcare',
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

const WorkspaceTypeOptions = ({ width, handleSetWorkspaceType, searchTerm }) => {
	const filteredOptions =
		dropdownOptions?.filter((option) =>
			option?.label?.toLowerCase()?.includes((searchTerm ?? '').toLowerCase()),
		) || [];

	return (
		<div
			className="workspaceTypeOptions"
			style={{ display: filteredOptions?.length > 0 ? 'block' : 'none', width }}
		>
			{filteredOptions?.length > 0 &&
				filteredOptions?.map((option) => (
					<div
						key={option?.id}
						className="option"
						onClick={() => handleSetWorkspaceType(null, option)}
					>
						<h1 className="optionLabel">{option?.label}</h1>
					</div>
				))}
		</div>
	);
};

export default memo(WorkspaceTypeOptions);
