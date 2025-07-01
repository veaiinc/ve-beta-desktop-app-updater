import React, { memo, useEffect, useState } from 'react';
import s from '../../../../assets/scss/notes/databaseComponents/numberComponent.module.scss';
import { message } from '../../globalComponents/CustomToast';

const NumberComponent = ({ value, onChange, title }) => {
	const [info, setInfo] = useState({
		isEditing: false,
		value: value,
	});

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			value: value,
		}));
	}, [value]);

	const handleEdit = () => {
		setInfo({ ...info, isEditing: true });
	};

	const handleSave = () => {
		if (Number(info?.value) !== Number(value) && onChange) {
			if (info?.value && !/^-?\d+$/.test(info?.value?.trim())) {
				message.error('Please enter a valid number');
				return;
			}
			onChange(Number(info?.value?.trim()) || null, onSuccess);
		}
		setInfo({ ...info, isEditing: false });
	};

	const handleCancel = () => {
		setInfo({ ...info, isEditing: false, value: value });
	};

	const handleChange = (e) => {
		const newValue = e.target.value;
		if (newValue === '' || /^-?\d+$/.test(newValue)) {
			setInfo({ ...info, value: newValue });
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSave();
		} else if (e.key === 'Escape') {
			handleCancel();
		}
	};

	const onSuccess = (success) => {
		if (!success) {
			setInfo({ ...info, value: value });
		}
	};

	return (
		<div
			className={s.numberComponent}
			onClick={(e) => {
				e?.stopPropagation();
				handleEdit();
			}}
		>
			{info?.isEditing || !value ? (
				<input
					type="number"
					className={s.numberInput}
					value={info?.value}
					onChange={handleChange}
					onBlur={handleSave}
					onKeyDown={handleKeyDown}
					placeholder="Enter a number"
				/>
			) : (
				<div className={s.numberValue}>{info.value}</div>
			)}
		</div>
	);
};

export default memo(NumberComponent);
