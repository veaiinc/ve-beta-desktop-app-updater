import { useState, useContext } from 'react';
import { ReactComponent as Dustbin } from '../../../../assets/svg/tasks/dustBin.svg';
import Context from '../../../../context/context';
import { colors } from '../../../../helpers/databaseHelpers';
import s from '../../../../assets/scss/notes/databaseComponents/optionsEdit.module.scss';

const OptionsEdit = ({ field, pageId, databaseId }) => {
	const {
		notes: { updateDatabaseField },
	} = useContext(Context);
	const [info, setInfo] = useState({
		editingOption: null,
		newOption: '',
		showColorPicker: null,
		editedValue: '',
		loading: false,
	});

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const getRandomColor = () => {
		return Math.floor(Math.random() * 7) + 1;
	};

	const handleAddOption = async () => {
		if (!info.newOption?.trim()) {
			message('Please enter a valid option name');
			return;
		}

		const newOptions = [
			...field?.config?.options,
			{ label: info.newOption.trim(), color: getRandomColor().toString() },
		];

		handleInfoChange({ loading: true });
		await updateDatabaseField({
			pageId: pageId,
			databaseId: databaseId,
			fieldId: field?._id,
			input: {
				type: field?.type,
				config: { options: newOptions },
			},
		});
		handleInfoChange({ loading: false, newOption: '' });
	};

	const handleUpdateOption = async (index, newLabel) => {
		if (!newLabel?.trim()) {
			message('Option name cannot be empty');
			return;
		}

		const newOptions = [...field?.config?.options];
		newOptions[index] = { ...newOptions[index], label: newLabel.trim() };

		handleInfoChange({ loading: true });
		await updateDatabaseField({
			pageId: pageId,
			databaseId: databaseId,
			fieldId: field?._id,
			input: {
				type: field?.type,
				config: { options: newOptions },
			},
		});
		handleInfoChange({
			loading: false,
			editingOption: null,
			showColorPicker: null,
			editedValue: '',
		});
	};

	const handleDeleteOption = async (index) => {
		const newOptions = field?.config?.options.filter((_, i) => i !== index);

		handleInfoChange({ loading: true });
		await updateDatabaseField({
			pageId: pageId,
			databaseId: databaseId,
			fieldId: field?._id,
			input: {
				type: field?.type,
				config: { options: newOptions },
			},
		});
		handleInfoChange({ loading: false });
	};

	const handleColorSelect = async (index, colorNumber) => {
		const newOptions = [...field?.config?.options];
		newOptions[index] = { ...newOptions[index], color: colorNumber.toString() };

		handleInfoChange({ loading: true });
		await updateDatabaseField({
			pageId: pageId,
			databaseId: databaseId,
			fieldId: field?._id,
			input: {
				type: field?.type,
				config: { options: newOptions },
			},
		});
		handleInfoChange({ loading: false, showColorPicker: null });
	};

	const colorOptions = Object.entries(colors).map(([number, color]) => ({
		number,
		...color,
	}));

	return (
		<div className={s.optionsEditContainer}>
			<div className={s.optionsArea}>
				<div className={s.newOptionInput}>
					<input
						type="text"
						value={info.newOption}
						onChange={(e) => handleInfoChange({ newOption: e.target.value })}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								handleAddOption();
							}
						}}
						placeholder="Add new option"
					/>
					<button onClick={handleAddOption} disabled={info.loading}>
						Add
					</button>
				</div>
				{field?.config?.options?.map((option, index) => (
					<div key={index} className={s.optionItem}>
						<div className={s.optionItemWrapper}>
							<div className={s.selectListItemTagWrapper}>
								<div className={s.selectOptionItem}>
									<div
										className={s.selectListItemColor}
										style={{
											backgroundColor: colors[option.color]?.color,
										}}
										onClick={() =>
											handleInfoChange({
												showColorPicker:
													info.showColorPicker === index ? null : index,
											})
										}
									/>
									{info.editingOption === index ? (
										<input
											type="text"
											className={s.selectOptionInput}
											value={info.editedValue}
											onChange={(e) =>
												handleInfoChange({
													editedValue: e.target.value,
												})
											}
											onBlur={() =>
												handleUpdateOption(index, info.editedValue)
											}
											onKeyDown={(e) => {
												if (e.key === 'Enter' && !e.shiftKey) {
													e.preventDefault();
													handleUpdateOption(index, info.editedValue);
												}
											}}
											autoFocus
										/>
									) : (
										<div
											className={s.selectOptionItemWrapper}
											onClick={() =>
												handleInfoChange({
													editingOption: index,
													editedValue: option.label,
												})
											}
										>
											<div className={s.selectOptionLabelWrapper}>
												<div className={s.selectListItemLabel}>
													{option.label}
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
							<div className={s.optionActions}>
								<button
									className={s.deleteOption}
									onClick={() => handleDeleteOption(index)}
									disabled={info.loading}
								>
									<Dustbin />
								</button>
							</div>
						</div>
						{info.showColorPicker === index && (
							<div className={s.colorPicker}>
								<div className={s.colorsTitle}>Colors</div>
								<div className={s.colorsList}>
									{colorOptions.map((color) => (
										<div
											key={color.number}
											className={`${s.colorItem} ${
												option.color === color.number ? s.selected : ''
											}`}
											onClick={() => handleColorSelect(index, color.number)}
											style={{
												backgroundColor: color.color,
											}}
										/>
									))}
								</div>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default OptionsEdit;
