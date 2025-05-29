import { useState, memo, useContext, useEffect } from 'react';

import s from '../../../../../assets/scss/notes/dropdown/headerEditDropdown.module.scss';
import { ReactComponent as Dustbin } from '../../../../../assets/svg/tasks/dustBin.svg';
import { ReactComponent as Pencil } from '../../../../../assets/svg/tasks/pencilWithLine.svg';
import { ReactComponent as Tick } from '../../../../../assets/svg/tasks/tick.svg';
import Context from '../../../../../context/context';
import { colors } from '../../../../../helpers/databaseHelpers';
// import OptionsEdit from '../../notes/DatabseComponents/OptionsEdit';
import OptionsEdit from '../../../notes/DatabseComponents/OptionsEdit';
import StatusEdit from '../../../notes/DatabseComponents/StatusEdit';

const HeaderEditDropdown = ({ field, pageId, databaseId }) => {
	const {
		notes: { updateDatabaseField, deleteDatabaseField },
	} = useContext(Context);
	const [info, setInfo] = useState({
		name: field?.name,
		editingOption: null,
		newOption: '',
		showColorPicker: null,
		editedValue: '',
	});

	useEffect(() => {
		setInfo({
			name: field?.name,
			editingOption: null,
			newOption: '',
			showColorPicker: null,
			editedValue: '',
		});
	}, [field]);

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const getRandomColor = () => {
		return Math.floor(Math.random() * 7) + 1;
	};

	// {
	//     "pageId": "68303ca4d6bd82266428d1fa",
	//     "databaseId": "6831c6f517c387da626a4aac",
	//     "fieldId": "6831ccef5df390c90adb30bb",
	//     "input": {
	//       "type": "text",
	//       "name": null,
	//       "isUnique": null,
	//       "isRequired": null
	//     }
	//   }
	const handleUpdateField = async () => {
		if (info?.loading) {
			return;
		}
		if (info?.name?.trim() === field?.name?.trim()) {
			return;
		}
		if (info?.name?.trim() === '') {
			message('Field name cannot be empty');
			handleInfoChange({ name: field?.name });
			return;
		}
		handleInfoChange({ loading: true });
		await updateDatabaseField({
			pageId: pageId,
			databaseId: databaseId,
			fieldId: field?._id,
			input: { type: field?.type, name: info?.name?.trim() },
		});
		handleInfoChange({ loading: false });
	};

	const handleDeleteField = async () => {
		await deleteDatabaseField({
			pageId: pageId,
			databaseId: databaseId,
			fieldId: field?._id,
		});
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
		<div className={s.headerEditDropdownContainer}>
			<div className={s.headerEditDropdownItem}>
				<div className={s.headerEditDropdownItemIcon}>
					<Pencil />
				</div>
				<input
					type="text"
					className={s.headerEditDropdownItemInput}
					value={info?.name}
					onChange={(e) => handleInfoChange({ name: e.target.value })}
					onBlur={handleUpdateField}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							e.target.blur();
						} else if (e.key === 'Enter' && e.shiftKey) {
							e.preventDefault();
							e.target.blur();
						}
					}}
				/>
			</div>
			{['multi_select', 'select'].includes(field?.type) && (
				<div className={s.headerEditDropdownOptionsArea}>
					<div className={s.headerEditDropdownOptionsAreaItem}>
						<div className={s.headerEditDropdownOptionsAreaItemText}>Edit Options</div>
						<OptionsEdit field={field} pageId={pageId} databaseId={databaseId} />
					</div>
				</div>
			)}

			{field?.type === 'status' && (
				<div className={s.headerEditDropdownOptionsArea}>
					<div className={s.headerEditDropdownOptionsAreaItem}>
						<div className={s.headerEditDropdownOptionsAreaItemText}>Edit Options</div>
						<StatusEdit field={field} pageId={pageId} databaseId={databaseId} />
					</div>
				</div>
			)}

			<div
				className={`${s.headerEditDropdownItem} ${s.cursorPointer}`}
				onClick={handleDeleteField}
			>
				<div className={s.headerEditDropdownItemIcon}>
					<Dustbin />
				</div>
				<div className={s.headerEditDropdownItemText}>Delete</div>
			</div>
		</div>
	);
};

export default memo(HeaderEditDropdown);
