import React, { useContext, useState } from 'react';
import ReactModal from '../index';
import s from '../../../../assets/scss/notes/modals/databaseAddFieldModal.module.scss';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';

const DatabaseAddFieldModal = ({ isOpen, onClose, databaseId, pageId }) => {
	const {
		notes: { addDatabaseField },
	} = useContext(Context);

	const [fieldInfo, setFieldInfo] = useState({
		name: '',
		type: 'text',
	});

	const [info, setInfo] = useState({
		loading: false,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFieldInfo((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleAddField = async () => {
		if (!fieldInfo.name?.trim()) {
			message('Please enter a valid field name');
			return;
		}
		setInfo((prev) => ({ ...prev, loading: true }));

		await addDatabaseField({
			pageId: pageId,
			databaseId: databaseId,
			input: fieldInfo,
		});
		setInfo((prev) => ({ ...prev, loading: false }));
		onClose();
	};

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
							<option value="text">Text</option>
							<option value="number">Number</option>
						</select>
					</div>
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
