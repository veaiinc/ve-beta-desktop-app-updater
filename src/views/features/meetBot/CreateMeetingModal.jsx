import React, { useState, useContext } from 'react';
import { Switch } from 'antd';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import { ReactComponent as ChevronDown } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as MicorPhoneIcon } from './micorPhoneIcon.svg';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/loaders/Spinner';
import ReactModal from '../../components/modalsV2';
import './createMeetingModal.scss';
import { ReactComponent as GoogleIcon } from './google.svg';
import { ReactComponent as ZoomIcon } from './zoom.svg';
import { ReactComponent as SlackIcon } from './slack.svg';
import { ReactComponent as MeetIcon } from './micromeet.svg';
import { ReactComponent as CameraIcon } from './cameraIcon.svg';
import GuideMePopup from './guideMePopup';
import CreateModalPreferences from './CreateModalPreferences';
import { message } from '../../components/globalComponents/CustomToast';

const meetingModeOptions = [
	{ value: 'sales', label: 'Sales Mode' },
	{ value: 'support', label: 'Support' },
	{ value: 'interview', label: 'Interview' },
	{ value: 'ideas', label: 'Ideas' },
];

function isValidUrl(url) {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

const CreateMeetingModal = ({ isOpen, onClose }) => {
	const {
		notes: { createMeetBot },
	} = useContext(Context);
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		selectedMode: 'meeting_bot',
		meetingUrl: '',
		creating: false,
		isAiIntelligenceEnabled: true,
		meetingMode: '',
		agenda: '',
		title: '',
	});

	const [guideMeOpen, setGuideMeOpen] = useState(false);

	const handleCreateMeet = async () => {
		// Generate default title with current date and time
		const now = new Date();
		const day = now.getDate().toString().padStart(2, '0');
		const month = now.toLocaleString('en-US', { month: 'short' });
		const year = now.getFullYear();
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const defaultTitle = `${day} ${month} ${year} ${hours}:${minutes}`;

		let input = {
			title: formData.title.trim() || defaultTitle,
			transcriptionSource: formData.selectedMode,
			isAiIntelligenceEnabled: formData.isAiIntelligenceEnabled,
			meetingMode: formData.meetingMode || 'meeting',
			agenda: formData.agenda,
		};

		if (formData.selectedMode === 'meeting_bot') {
			if (!isValidUrl(formData.meetingUrl)) {
				message.error('Invalid meeting link');
				return;
			}
			input.meetingLink = formData.meetingUrl;
		}

		setFormData((prev) => ({ ...prev, creating: true }));

		try {
			const response = await createMeetBot({ input });

			const isSuccess = response?.[0];
			if (!isSuccess) {
				message.error('Invalid meeting link');
				return; // Do not close modal
			}

			const meetingId = response?.[1]?.data?.startMeeting?._id;
			const type = response?.[1]?.data?.startMeeting?.transcriptionSource;

			if (meetingId && type) {
				navigate(
					`/meet/${meetingId}?type=${type}&isAiIntelligenceEnabled=${formData.isAiIntelligenceEnabled}`,
				);
				handleClose();
				return;
			}

			message.error('Invalid meeting link');
		} finally {
			setFormData((prev) => ({ ...prev, creating: false }));
		}
	};

	const handleClose = () => {
		setFormData({
			selectedMode: 'meeting_bot',
			meetingUrl: '',
			creating: false,
			isAiIntelligenceEnabled: true,
			meetingMode: '',
			agenda: '',
			title: '',
		});
		setGuideMeOpen(false);
		onClose();
	};

	const handleGuideMeClick = () => {
		setGuideMeOpen(true);
	};

	const handleInputKeyDown = (e) => {
		if (
			formData.selectedMode === 'meeting_bot' &&
			e.key === 'Enter' &&
			isValidUrl(formData.meetingUrl) &&
			!formData.creating
		) {
			handleCreateMeet();
		}
		if (formData.selectedMode === 'desktop' && e.key === 'Enter' && !formData.creating) {
			handleCreateMeet();
		}
	};

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={handleClose}
			modalType={'center'}
			customStyles={{
				overlay: { zIndex: 1001 },
				content: {
					borderRadius: '15px',
					zIndex: 1002,
					overflow: 'hidden',
					background: 'var(--background-color)',
				},
			}}
		>
			<div className="create-meeting-modal">
				{/* <SidebarClosingSvg className="close-icon" onClick={handleClose} /> */}
				<div className="modal-header">
					<div className="modal-title">Create meeting</div>
					{/* <div className="modal-description">
						Conduct meetings virtually with real-time AI support, including live
						transcription, speaker tracking, and smart follow-ups—accessible from
						anywhere.
					</div> */}
					<div className="iconsContainer">
						<div className="icon-wrapper">
							<GoogleIcon />
						</div>
						<div className="icon-wrapper">
							<MeetIcon />
						</div>
						<div className="icon-wrapper">
							<ZoomIcon />
						</div>
						<div className="icon-wrapper">
							<SlackIcon />
						</div>
					</div>
				</div>
				<div className="tabs">
					<button
						className={`tab ${
							formData.selectedMode === 'meeting_bot' ? ' active' : ''
						}`}
						onClick={() =>
							setFormData((prev) => ({
								...prev,
								selectedMode: 'meeting_bot',
							}))
						}
					>
						Online Meeting
					</button>
					<button
						className={`tab ${formData.selectedMode === 'desktop' ? ' active' : ''}`}
						onClick={() =>
							setFormData((prev) => ({ ...prev, selectedMode: 'desktop' }))
						}
					>
						In-Person Meeting
					</button>
				</div>

				<div className="modal-content">
					<div className="content-container">
						{/* Ambient Assistance */}
						<div className="ambient-assistance">
							<div className="assistance-container">
								<div className="assistance-content">
									<div className="assistance-title">
										Ambient assistance
										<span
											className={`assistance-title-sub ${
												formData.meetingMode ? '' : 'disabled'
											}`}
										>
											{formData?.meetingMode
												? meetingModeOptions.find(
														(option) =>
															option.value === formData.meetingMode,
												  )?.label
												: 'Meeting mode'}
										</span>
									</div>
									<div className="assistance-description">
										Your AI actively captures key points, summarizes
										conversations, and highlights actions in real-time.
									</div>
								</div>
								<Switch
									checked={formData.isAiIntelligenceEnabled}
									onChange={(checked) =>
										setFormData((prev) => ({
											...prev,
											isAiIntelligenceEnabled: checked,
										}))
									}
									className="ambient-toggler"
								/>
							</div>
							{/* <button className="guide-btn" onClick={handleGuideMeClick}>
								Guide me
							</button> */}

							{formData.isAiIntelligenceEnabled && (
								<div className="ambient-assistance-settings">
									<CreateModalPreferences />
								</div>
							)}
						</div>

						{/* <div className="section-header">
							<div className="label">
								{formData.selectedMode === 'meeting_bot'
									? 'Record a live meeting'
									: 'Record a private note'}
							</div>
							<div className="description">
								{formData.selectedMode === 'meeting_bot'
									? 'Works with Zoom, Google meet, or Microsoft Teams'
									: `Only you know you're recording—no visible participants join your meeting.`}
							</div>
						</div> */}

						{/* Title Input Field */}
						{/* <div className="input-wrapper-title">
							<div className="input-label-title">Title</div>
							<input
								className="input-field-title"
								placeholder="Enter meeting title..."
								value={formData.title}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										title: e.target.value,
									}))
								}
								disabled={formData.creating}
							/>
						</div> */}

						{/* Agenda Text Field */}

						{/* Meeting Mode Selection */}
						{formData?.isAiIntelligenceEnabled && (
							<div className="input-wrapper">
								<div className="input-label">Meeting Mode</div>
								<div className="select-container">
									<select
										className="select-field"
										value={formData.meetingMode}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												meetingMode: e.target.value,
											}))
										}
										disabled={formData.creating}
									>
										<option value="">Select meeting mode...</option>
										{meetingModeOptions.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
									<div className="select-arrow">
										<ChevronDown />
									</div>
								</div>
							</div>
						)}

						{formData.selectedMode === 'meeting_bot' &&
							formData?.isAiIntelligenceEnabled && (
								<div className="input-wrapper">
									<div className="input-label">Agenda</div>
									<textarea
										className="textarea-field"
										placeholder="Enter meeting agenda..."
										value={formData.agenda}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												agenda: e.target.value,
											}))
										}
										disabled={formData.creating}
										rows={3}
									/>
								</div>
							)}

						{/* Meeting URL Input (Online Mode) */}
						{formData.selectedMode === 'meeting_bot' && (
							<div className="meeting-link-wrapper">
								<div className="meeting-link-header">
									<div className="input-label">Record a live meeting</div>
									<div className="input-sub-label">
										Works with Zoom, Google meet, Microsoft Teams, Webex, Slack
									</div>
								</div>
								<div className="input-container">
									<CameraIcon />

									<input
										className="input-field-title"
										placeholder="Paste meeting URL"
										value={formData.meetingUrl}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												meetingUrl: e.target.value,
											}))
										}
										onKeyDown={handleInputKeyDown}
										disabled={formData.creating}
									/>
									{!formData.creating && (
										<button
											className={`create-button`}
											onClick={handleCreateMeet}
											disabled={!isValidUrl(formData.meetingUrl)}
										>
											Create
										</button>
									)}
									{formData.creating && (
										<span className="create-meeting-loader">
											<Spinner
												width="16px"
												height="16px"
												color="var(--primary-button)"
												borderTopColor="var(--popup)"
												borderWidth={1}
											/>
										</span>
									)}
								</div>
							</div>
						)}
						{/* Record Button (Offline Mode) */}
						{formData.selectedMode === 'desktop' && (
							<div className="record-button-wrapper">
								<button
									disabled={formData.creating}
									onClick={handleCreateMeet}
									className={`record-button`}
								>
									{/* <MicorPhoneIcon /> */}
									{formData.creating ? 'Starting...' : 'Record meeting'}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			<GuideMePopup isOpen={guideMeOpen} onClose={() => setGuideMeOpen(false)} />
		</ReactModal>
	);
};

export default CreateMeetingModal;
