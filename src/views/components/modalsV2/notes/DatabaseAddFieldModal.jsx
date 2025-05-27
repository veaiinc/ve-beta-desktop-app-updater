import React, { useContext, useState } from 'react';
import ReactModal from '../index';
import s from '../../../../assets/scss/notes/modals/databaseAddFieldModal.module.scss';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';

const fieldTypes = [
	{
		label: 'Text',
		value: 'text',
	},
	{
		label: 'Number',
		value: 'number',
	},
	{
		label: 'Select',
		value: 'select',
		hasOptions: true,
	},
	{
		label: 'Multi Select',
		value: 'multi_select',
		hasOptions: true,
	},
];

const DatabaseAddFieldModal = ({ isOpen, onClose, databaseId, pageId }) => {
	const {
		notes: { addDatabaseField },
	} = useContext(Context);

	const [fieldInfo, setFieldInfo] = useState({
		name: '',
		type: 'text',
		options: [],
	});

	const [info, setInfo] = useState({
		loading: false,
		optionName: '',
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFieldInfo((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleOptionChange = (e) => {
		const { name, value } = e.target;
		setInfo((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const getRandomColor = () => {
		return Math.floor(Math.random() * 7) + 1;
	};

	const handleAddOption = () => {
		if (!info.optionName?.trim()) {
			message('Please enter a valid option name');
			return;
		}

		setFieldInfo((prev) => ({
			...prev,
			options: [...prev.options, { label: info.optionName, color: getRandomColor() }],
		}));

		setInfo((prev) => ({
			...prev,
			optionName: '',
		}));
	};

	const handleRemoveOption = (index) => {
		setFieldInfo((prev) => ({
			...prev,
			options: prev.options.filter((_, i) => i !== index),
		}));
	};

	const handleAddField = async () => {
		if (!fieldInfo.name?.trim()) {
			message('Please enter a valid field name');
			return;
		}

		const selectedType = fieldTypes.find((type) => type.value === fieldInfo.type);
		if (selectedType?.hasOptions && fieldInfo.options.length === 0) {
			message('Please add at least one option');
			return;
		}

		setInfo((prev) => ({ ...prev, loading: true }));

		const payload = {
			pageId: pageId,
			databaseId: databaseId,
			input: {
				name: fieldInfo.name,
				type: fieldInfo.type,
				...(selectedType?.hasOptions && {
					config: {
						options: fieldInfo.options.map((option) => ({
							label: option.label,
							color: option.color.toString(),
						})),
					},
				}),
			},
		};

		await addDatabaseField(payload);
		setInfo((prev) => ({ ...prev, loading: false }));
		onClose();
	};

	const selectedType = fieldTypes.find((type) => type.value === fieldInfo.type);

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={info.loading ? null : onClose}
			modalType={'center'}
			customStyles={{
				content: {
					zIndex: 50002,
				},
				overlay: {
					zIndex: 50000,
				},
			}}
		>
			<div className={s.databaseAddFieldModalContainer}>
				<div className={s.databaseAddFieldModalBody}>
					<div className={s.fieldRow}>
						<label htmlFor="name">Field Name</label>
						<input
							type="text"
							id="name"
							name="name"
							value={fieldInfo.name}
							onChange={handleChange}
							placeholder="Enter field name"
						/>
					</div>
					<div className={s.fieldRow}>
						<label htmlFor="type">Field Type</label>
						<select
							id="type"
							name="type"
							value={fieldInfo.type}
							onChange={handleChange}
						>
							{fieldTypes?.map((fieldType) => (
								<option key={fieldType.value} value={fieldType.value}>
									{fieldType.label}
								</option>
							))}
						</select>
					</div>
					{selectedType?.hasOptions && (
						<>
							<div className={s.fieldRow}>
								<label>Options</label>
								<div className={s.optionsInputContainer}>
									<input
										type="text"
										name="optionName"
										value={info.optionName}
										onChange={handleOptionChange}
										placeholder="Enter option name"
									/>
									<button onClick={handleAddOption}>Add Option</button>
								</div>
							</div>
							{fieldInfo.options.length > 0 && (
								<div className={s.optionsList}>
									{fieldInfo.options.map((option, index) => (
										<div key={index} className={s.optionItem}>
											<span className={s.optionName}>{option.label}</span>
											<span className={s.optionColor}>
												Color {option.color}
											</span>
											<button
												className={s.removeOptionButton}
												onClick={() => handleRemoveOption(index)}
											>
												Remove
											</button>
										</div>
									))}
								</div>
							)}
						</>
					)}
				</div>
				<div className={s.databaseAddFieldModalFooter}>
					<button onClick={handleAddField} disabled={info.loading}>
						{info.loading ? 'Adding...' : 'Add Field'}
					</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default DatabaseAddFieldModal;
