import { useState, memo, useContext, useEffect } from 'react';

import s from '../../../../../assets/scss/notes/dropdown/headerEditDropdown.module.scss';
import { ReactComponent as Dustbin } from '../../../../../assets/svg/tasks/dustBin.svg';
import { ReactComponent as Pencil } from '../../../../../assets/svg/tasks/pencilWithLine.svg';
import Context from '../../../../../context/context';

const HeaderEditDropdown = ({ field, pageId, databaseId }) => {
	const {
		notes: { updateDatabaseField },
	} = useContext(Context);
	const [info, setInfo] = useState({
		name: field?.name,
	});

	useEffect(() => {
		setInfo({
			name: field?.name,
		});
	}, [field]);

	const handleInfoChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
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
			<div className={s.headerEditDropdownItem}>
				<div className={s.headerEditDropdownItemIcon}>
					<Dustbin />
				</div>
				<div className={s.headerEditDropdownItemText}>Delete</div>
			</div>
		</div>
	);
};

export default memo(HeaderEditDropdown);
