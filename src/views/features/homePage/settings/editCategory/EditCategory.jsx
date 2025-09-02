import { memo, useState } from 'react';
import s from './editCategory.module.scss';
import CustomDropdown from '../../../../components/globalComponents/customDropdown/CustomDropdown';

const options = [
	{
		label: 'Proactively suggest',
		description: 'AI will actively suggest cards whenever they’re relevant.',
		value: 1,
	},
	{
		label: 'Suggest sparingly',
		description: 'AI suggests only important or high-value cards.',
		value: 2,
	},
	{
		label: 'Suggest on request',
		description: 'AI will wait until you explicitly ask for suggestions.',
		value: 3,
	},
	{
		label: 'Do not suggest',
		description: 'AI will never auto-suggest cards; you’ll manage manually.',
		value: 4,
	},
];

const frequency = [
	{
		value: 'high',
		label: 'High',
	},
	{
		value: 'medium',
		label: 'Medium',
	},
	{
		value: 'low',
		label: 'Low',
	},
];

const EditCategory = ({ handleClose }) => {
	const handleSubmit = () => {};
	const [info, setInfo] = useState({
		categoryName: '',
		customInstructions: '',
		selectedOption: 0,
	});
	return (
		<form className={s.editCategoryContainer} onSubmit={handleSubmit}>
			<div className={s.headerContainer}>
				<div className={s.categoryNameContainer}>
					<label>Category Name</label>
					<input
						type="text"
						value={info?.categoryName}
						onChange={(e) => setInfo({ ...info, categoryName: e.target.value })}
						placeholder="Enter category name"
					/>
				</div>
				<div className={s.customInstructionContainer}>
					<div className={s.top}>
						<label>Custom Instructions</label>
					</div>
					<div className={s.bottom}>
						<textarea
							value={info?.customInstructions}
							onChange={(e) =>
								setInfo({ ...info, customInstructions: e.target.value })
							}
							placeholder="Enter your Custom Instructions"
						></textarea>
					</div>
				</div>

				<div className={s.frequencyLevelContainer}>
					<div className={s.top}>
						<label>Frequency Level</label>
						<div className={s.description}>Set default urgency for this category.</div>
					</div>
					<div className={s.bottom}>
						<CustomDropdown options={frequency} placeholder="Select Level" />
					</div>
				</div>

				<div className={s.frequencyLevelContainer}>
					<div className={s.top}>
						<label>AI Behavior</label>
						<div className={s.description}>
							Refine how AI selects cards in this category.
						</div>
					</div>
					<div className={s.bottom}>
						<CustomDropdown options={options} placeholder="Select AI Behavior" />
					</div>
				</div>
			</div>
			<div className={s.footerContainer}>
				<button className={s.cancelButton} type="button" onClick={handleClose}>
					Cancel
				</button>
				<button className={s.submitButton} type="submit">
					Update
				</button>
			</div>
		</form>
	);
};

export default memo(EditCategory);
