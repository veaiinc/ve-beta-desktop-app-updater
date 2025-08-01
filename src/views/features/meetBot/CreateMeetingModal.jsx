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
import GuideMePopup from './guideMePopup';

const meetingModeOptions = [
	{ value: 'meeting', label: 'Meeting' },
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
		isAiIntelligenceEnabled: false,
		meetingMode: 'meeting',
		agenda: '',
		title: '',
	});

	const [guideMeOpen, setGuideMeOpen] = useState(false);

	const handleCreateMeet = async () => {
		if (!formData.title.trim()) {
			return;
		}

		let input = {
			title: formData.title.trim(),
			transcriptionSource: formData.selectedMode,
			isAiIntelligenceEnabled: formData.isAiIntelligenceEnabled,
			meetingMode: formData.meetingMode,
			agenda: formData.agenda,
		};

		if (formData.selectedMode === 'meeting_bot') {
			if (!isValidUrl(formData.meetingUrl)) return;
			input.meetingLink = formData.meetingUrl;
		}

		setFormData((prev) => ({ ...prev, creating: true }));

		try {
			const response = await createMeetBot({ input });
			const meetingId = response?.[1]?.data?.startMeeting?._id;
			const type = response?.[1]?.data?.startMeeting?.transcriptionSource;

			if (meetingId && type) {
				navigate(
					`/meet/${meetingId}?type=${type}&isAiIntelligenceEnabled=${formData.isAiIntelligenceEnabled}`,
				);
			}

			handleClose();
		} finally {
			setFormData((prev) => ({ ...prev, creating: false }));
		}
	};

	const handleClose = () => {
		setFormData({
			selectedMode: 'meeting_bot',
			meetingUrl: '',
			creating: false,
			isAiIntelligenceEnabled: false,
			meetingMode: 'meeting',
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
			formData.title.trim() &&
			!formData.creating
		) {
			handleCreateMeet();
		}
		if (
			formData.selectedMode === 'desktop' &&
			e.key === 'Enter' &&
			formData.title.trim() &&
			!formData.creating
		) {
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
					width: '780px',
					overflow: 'hidden',
					background: 'var(--background-color)',
				},
			}}
		>
			<div className="create-meeting-modal">
				{/* <SidebarClosingSvg className="close-icon" onClick={handleClose} /> */}
				<div className="modal-header">
					<div className="modal-title">Create meeting</div>
					<div className="modal-description">
						Conduct meetings virtually with real-time AI support, including live
						transcription, speaker tracking, and smart follow-ups—accessible from
						anywhere.
					</div>
				</div>
				<div className="tabs">
					<button
						className={`tab${formData.selectedMode === 'meeting_bot' ? ' active' : ''}`}
						onClick={() =>
							setFormData((prev) => ({
								...prev,
								selectedMode: 'meeting_bot',
							}))
						}
					>
						Online
						<GoogleIcon />
						<ZoomIcon />
						<SlackIcon />
						<MeetIcon />
					</button>
					<button
						className={`tab${formData.selectedMode === 'desktop' ? ' active' : ''}`}
						onClick={() =>
							setFormData((prev) => ({ ...prev, selectedMode: 'desktop' }))
						}
					>
						Offline
					</button>

					<span
						className="tab-indicator"
						style={{
							left: formData.selectedMode === 'meeting_bot' ? '0%' : '60%',
						}}
					/>
				</div>

				<div className="modal-content">
					<div className="content-container">
						{/* Ambient Assistance */}
						<div className="ambient-assistance">
							<div className="assistance-container">
								<div className="assistance-content">
									<div className="assistance-title">
										Live Meeting Intelligence
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
								/>
							</div>
							<button className="guide-btn" onClick={handleGuideMeClick}>
								Guide me
							</button>
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
						<div className="input-wrapper-title">
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
						</div>

						{/* Meeting Mode Selection */}
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
												{/* Agenda Text Field */}
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

						{/* Meeting URL Input (Online Mode) */}
						{formData.selectedMode === 'meeting_bot' && (
							<div className="input-wrapper">
								<div className="input-container">
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
											className={`create-button${
												!isValidUrl(formData.meetingUrl) ||
												!formData.title.trim()
													? ' disabled'
													: ''
											}`}
											onClick={handleCreateMeet}
											disabled={
												!isValidUrl(formData.meetingUrl) ||
												!formData.title.trim()
											}
										>
											Create
										</button>
									)}
									{formData.creating && (
										<span className="loader">
											<Spinner
												width="16px"
												height="16px"
												color="var(--primary-button)"
												borderTopColor="var(--background-color)"
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
									disabled={formData.creating || !formData.title.trim()}
									onClick={handleCreateMeet}
									className={`record-button${
										formData.creating || !formData.title.trim()
											? ' disabled'
											: ''
									}`}
								>
									<MicorPhoneIcon />
									{formData.creating ? 'Starting...' : 'Record'}
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
