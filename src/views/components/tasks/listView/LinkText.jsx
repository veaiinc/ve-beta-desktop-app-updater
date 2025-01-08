import { Tooltip } from 'antd';
import React, { memo, useState } from 'react';
import '../../../../assets/scss/tasks/linkText.scss';
import CustomTextArea from '../../globalComponents/CustomTextArea';

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
}) => {
	const [info, setInfo] = useState({
		isEditing: false,
		value: value,
	});

	const handleEdit = () => {
		setInfo({ ...info, isEditing: true });
	};

	const handleSave = () => {
		setInfo({ ...info, isEditing: false });
	};

	const handleCancel = () => {
		setInfo({ ...info, isEditing: false });
	};

	const handleChange = (e) => {
		setInfo({ ...info, value: e.target.value });
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
						resize={true}
						style={{
							minHeight: '32px',
							height: '100%',
							borderRadius: '8px',
						}}
					/>
				) : (
					<a className="linkText-value" href={`${typeMapper[linkType]}${value}`}>
						{value}
					</a>
				)}
			</Tooltip>
		</div>
	);
};

export default memo(LinkText);
