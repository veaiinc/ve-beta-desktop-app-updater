import React, { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'antd';
import { ReactComponent as Edit } from '../../../../assets/svg/edit.svg';
import '../../../../assets/scss/title.scss';
import { message } from 'antd';

const Title = ({ title: initialTitle, updatePublishedTemplate }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(initialTitle);
	const inputRef = useRef(null);
	const debounceTimeout = useRef(null);

	useEffect(() => {
		setTitle(initialTitle);
	}, [initialTitle]);

	// Add click outside functionality
	useEffect(() => {
		const handleClickOutside = (event) => {
			// Check if click is outside input AND not on the save button
			if (
				inputRef.current &&
				!inputRef.current.contains(event.target) &&
				!event.target.closest('.save-btn') &&
				!event.target.closest('.title-input')
			) {
				setIsEditing(false);
			}
		};

		if (isEditing) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isEditing]);

	const handleTitleChange = async (e) => {
		const value = e.target.value;
		setTitle(value);

		// if (debounceTimeout.current) {
		// 	clearTimeout(debounceTimeout.current);
		// }

		// debounceTimeout.current = setTimeout(async () => {
		// 	if (value || value !== '') {
		// 		const response = await updatePublishedTemplate(value);
		// 	} else {
		// 		message.error('Title cannot be empty');
		// 	}
		// }, 1000);
	};

	const handleTitleSave = async () => {
		if (title && title.trim() !== '') {
			const response = await updatePublishedTemplate(title);
			setIsEditing(false);
		} else {
			message.error('Title cannot be empty');
		}
	};

	return (
		<div className="title-container">
			{isEditing ? (
				<>
					<input
						className="title-input"
						type="text"
						value={title}
						onChange={handleTitleChange}
						autoFocus
						ref={inputRef}
					/>
					<span
						ref={inputRef}
						className="save-btn"
						style={{
							cursor: 'pointer',
							border: '1px solid #fff',
							padding: '0px 5px',
							borderRadius: '5px',
						}}
						onClick={handleTitleSave}
						tabIndex={0}
					>
						save
					</span>
				</>
			) : (
				<>
					<span className="title-value" onClick={() => setIsEditing((prev) => !prev)}>
						{title}
					</span>
					<span className="tooltip">
						<Tooltip title="Edit">
							<Edit
								className={`edit-icon  ${isEditing ? 'active-icon' : ''}`}
								onClick={() => setIsEditing((prev) => !prev)}
							/>
						</Tooltip>
					</span>
				</>
			)}
		</div>
	);
};
export default Title;
