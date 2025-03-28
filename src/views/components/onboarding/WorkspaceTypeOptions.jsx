import { memo, useEffect } from 'react';
import '../../../assets/scss/onboarding/WorkspaceTypeOptions.scss';
import { animateFadeIn } from '../../features/onboarding/Onboarding';

const dropdownOptions = [
	{
		id: 1,
		label: 'Sales & Business development',
	},
	{
		id: 2,
		label: 'Technology & Engineering',
	},
	{
		id: 3,
		label: 'Marketing',
	},
	{
		id: 4,
		label: 'Product development',
	},
	{
		id: 5,
		label: 'Customer Service',
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
