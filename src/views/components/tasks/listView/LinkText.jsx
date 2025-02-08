import { message, Tooltip } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/linkText.scss';
import CustomTextArea from '../../globalComponents/CustomTextArea';
const validator = require('validator');

const typeMapper = {
	link: '',
	email: 'mailto:',
	phone: 'tel:',
};

const LinkText = ({
	value,
	linkType = 'link',
	showTitle = false,
	title = '',
	takeFullspace = false,
	onUpdate,
}) => {
	const [info, setInfo] = useState({
		isEditing: false,
		value: value,
	});

	// Keep local state in sync with prop value
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
		if (info?.value !== value && onUpdate) {
			if (linkType === 'email') {
				if (!validator.isEmail(info?.value?.trim())) {
					message.error('Invalid email');
					return;
				}
			}
			if (linkType === 'phone') {
				if (!validator.isMobilePhone(info?.value?.trim())) {
					message.error('Invalid phone number');
					return;
				}
			}
			if (linkType === 'link') {
				if (!validator.isURL(info?.value?.trim())) {
					message.error('Invalid link');
					return;
				}
			}
			onUpdate(info?.value?.trim(), onSuccess);
		}
		setInfo({ ...info, isEditing: false });
	};

	const handleCancel = () => {
		setInfo({ ...info, isEditing: false, value: value });
	};

	const handleChange = (e) => {
		setInfo({ ...info, value: e.target.value });
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
			className={`linkText-wrapper ${takeFullspace ? 'takeFullspace' : ''}`}
			onClick={(e) => {
				e?.stopPropagation();
				handleEdit();
			}}
		>
			<Tooltip
				title={showTitle ? <div className="tooltip-inner">{title}</div> : ''}
				placement="bottom"
				overlayClassName="tooltip-overlay-container"
				color="transparent"
			>
				{info?.isEditing ? (
					<CustomTextArea
						className="linkText-textarea"
						value={info?.value}
						onChange={handleChange}
						onBlur={handleSave}
						onKeyDown={handleKeyDown}
						resize={true}
					/>
				) : (
					<a className="linkText-value" href={`${typeMapper[linkType]}${value}`}>
						{info.value}
					</a>
				)}
			</Tooltip>
		</div>
	);
};

export default memo(LinkText);
