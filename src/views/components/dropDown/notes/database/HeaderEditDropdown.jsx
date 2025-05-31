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
			prefix: field?.config?.prefix || null,
		});
	}, [field]);

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};
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

	const updateSerialNumberPrefix = async () => {
		await updateDatabaseField({
			pageId: pageId,
			databaseId: databaseId,
			fieldId: field?._id,
			input: { type: field?.type, config: { prefix: info?.prefix?.trim() || null } },
		});
	};
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

			{field?.type === 'serial_number' && (
				<div className={s.headerEditDropdownOptionsArea}>
					<div className={s.headerEditDropdownOptionsAreaItem}>
						<div className={s.headerEditDropdownOptionsAreaItemText}>Edit Prefix</div>
						<input
							type="text"
							className={s.prefixEditInput}
							value={info?.prefix}
							onChange={(e) => handleInfoChange({ prefix: e.target.value })}
							onBlur={updateSerialNumberPrefix}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									e.target.blur();
								}
							}}
						/>
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
