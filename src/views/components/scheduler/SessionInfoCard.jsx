import React, { memo, useState, useEffect } from 'react';
import { ReactComponent as Dot } from '../../../assets/svg/gallery/threeDots.svg';
import { ReactComponent as QuestionMark } from '../../../assets/svg/ai_assistant/question.svg';
import { ReactComponent as Down } from '../../../assets/svg/calendar/down.svg';
// import ToggleSwitch from '../input/slider';
// import { Tooltip } from 'antd';
import '../../../assets/scss/scheduler/editScheduler.scss';
import Spinner from '../loaders/Spinner';

const SessionInfoCard = ({ sessionData, onUpdate, isUpdating }) => {
	const [info, setInfo] = useState({
		isDetailsOpen: false,
		detailsOptions: ['Details', 'Conference', 'Shoot', 'Interview'],
		isDataEnrichment: false,
		sessionCategory: 'Details',
		isEditingName: false,
		editedName: sessionData?.sessionName || '',
	});

	// Update editedName when sessionData changes
	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			editedName: sessionData?.sessionName || '',
		}));
	}, [sessionData?.sessionName]);

	const handleDetailsChange = (option) => {
		setInfo((prev) => ({
			...prev,
			isDetailsOpen: !prev.isDetailsOpen,
			sessionCategory: option,
		}));
	};

	const handleNameEdit = () => {
		if (isUpdating) return; // Don't allow editing while updating
		setInfo((prev) => ({
			...prev,
			isEditingName: true,
			editedName: sessionData?.sessionName || '',
		}));
	};

	const handleNameChange = (e) => {
		setInfo((prev) => ({
			...prev,
			editedName: e.target.value,
		}));
	};

	const handleNameSave = () => {
		const newName = info.editedName.trim();
		if (newName && newName !== sessionData?.sessionName) {
			console.log('Saving new session name:', newName);
			if (typeof onUpdate === 'function') {
				onUpdate({
					sessionName: newName,
				});
			}
		}
		setInfo((prev) => ({
			...prev,
			isEditingName: false,
		}));
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleNameSave();
		} else if (e.key === 'Escape') {
			setInfo((prev) => ({
				...prev,
				isEditingName: false,
				editedName: sessionData?.sessionName || '',
			}));
		}
	};

	const handleUpdateClick = () => {
		if (typeof onUpdate === 'function' && !isUpdating) {
			onUpdate({});
		}
	};

	return (
		<div className="sessionInfoContainer">
			<div className="sessionInfoDetails">
				<div className="sessionTitle">
					<div className="sessionTitleLeft">
						<span className="editSession">Edit Session</span>
						<span className="scheduler">Scheduler</span>
					</div>
					{/* <div className="sessionTitleRight">
						<div
							className={`updateButton ${isUpdating ? 'updating' : ''}`}
							onClick={handleUpdateClick}
						>
							{isUpdating ? (
								<>
									<Spinner width="16px" height="16px" />
									Updating...
								</>
							) : (
								'Update and publish'
							)}
						</div>
					</div> */}
				</div>

				<div className="sessionInfoSetting">
					<div className="settingRow">
						<span className="sessionTitleLabel">Session Title</span>
						{info.isEditingName ? (
							<input
								type="text"
								value={info.editedName}
								onChange={handleNameChange}
								onKeyDown={handleKeyPress}
								onBlur={handleNameSave}
								className="sessionTitleInput"
								autoFocus
								disabled={isUpdating}
							/>
						) : (
							<span
								className="sessionTitle"
								onClick={handleNameEdit}
								style={{ cursor: isUpdating ? 'not-allowed' : 'pointer' }}
							>
								{sessionData?.sessionName || 'Unnamed Session'}
							</span>
						)}
						<div className="divider-line"></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(SessionInfoCard);
