import { memo } from 'react';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/ve.svg';
import s from './transcriptionTabs.module.scss';
import { ReactComponent as WaveIcon } from './wave.svg';
import { ReactComponent as AiSparkleIcon } from './aiSparkle.svg';
import { ReactComponent as UserIcon } from '../../../assets/svg/transcription/userIcon.svg';
import { ReactComponent as NeedHelpIcon } from '../../../assets/svg/transcription/neddhelp.svg';
import { ReactComponent as ActionIcon } from '../../../assets/svg/transcription/action.svg';

const TranscriptionTabs = ({
	activeTab,
	setActiveTab,
	userQuestions,
	aiQuestions,
	actions,
	files,
	history,
	allSuggestions,
	type = null,
	hasAudioRecording = false,
	hasSummaryError = false,
}) => {
	// Show Summary tab even when there's an error - it will display "No Summary" content

	return (
		<div className={s.meetingTabContainer}>
			<div className={s.meetingTabLeft}>
				{history && (
					<button
						className={
							s.meetingTabButton + ' ' + (activeTab === 'summary' ? s.activeTab : '')
						}
						onClick={() => setActiveTab('summary')}
					>
						Summary
					</button>
				)}
				{history && !hasSummaryError && (
					<button
						className={
							s.meetingTabButton +
							' ' +
							(activeTab === 'analytics' ? s.activeTab : '')
						}
						onClick={() => setActiveTab('analytics')}
					>
						Analytics
					</button>
				)}

				{/* {(history || type === 'desktop') && (
					<button
						className={
							s.meetingTabButton +
							' ' +
							(activeTab === 'transcript' ? s.activeTab : '')
						}
						onClick={() => setActiveTab('transcript')}
					>
						Transcript
					</button>
				)} */}

				{history && !hasSummaryError && (
					<button
						className={
							s.meetingTabButton + ' ' + (activeTab === 'all' ? s.activeTab : '')
						}
						onClick={() => setActiveTab('all')}
					>
						Meeting Intelligence
					</button>
				)}

				{history && (
					<button
						className={
							s.meetingTabButton + ' ' + (activeTab === 'audio' ? s.activeTab : '')
						}
						onClick={() => setActiveTab('audio')}
						style={{
							display: 'none',
						}}
					>
						Play Audio
					</button>
				)}
				{/* Debug info */}
				{(() => {
					console.log(
						'TranscriptionTabs - history:',
						history,
						'hasAudioRecording:',
						hasAudioRecording,
						'shouldShowAudioTab:',
						history,
						'activeTab:',
						activeTab,
					);
					return null;
				})()}
				{/* {history && (
					<button
						className={activeTab === 'notes' ? 'notes-tab active' : 'notes-tab'}
						style={{
							background: 'none',
							border: 'none',
							outline: 'none',
							color: 'inherit',
							fontWeight: 500,
							fontSize: 16,
							padding: '8px 0',
							borderBottom:
								activeTab === 'notes'
									? '2px solid var(--primary-button, #cfff48)'
									: '2px solid transparent',
							cursor: 'pointer',
							transition: 'color 0.2s',
						}}
						onClick={() => setActiveTab('notes')}
					>
						Notes
					</button>
				)} */}

				{!history && (
					<button
						className={
							s.meetingTabButton + ' ' + (activeTab === 'all' ? s.activeTab : '')
						}
						onClick={() => setActiveTab('all')}
					>
						All Threads
					</button>
				)}
				{userQuestions?.length > 0 && (
					<button
						className={
							s.meetingTabButton +
							' ' +
							(activeTab === 'userQuestions' ? s.activeTab : '')
						}
						onClick={() => setActiveTab('userQuestions')}
					>
						<UserIcon />
						{/* Ask user
						 */}
						Ask Speaker
						<div className={s.tabButtonCount}>{userQuestions?.length}</div>
					</button>
				)}

				{aiQuestions?.length > 0 && (
					<button
						className={
							s.meetingTabButton +
							' ' +
							(activeTab === 'aiQuestions' ? s.activeTab : '')
						}
						onClick={() => setActiveTab('aiQuestions')}
					>
						<NeedHelpIcon />
						Ask AI
						<div className={s.tabButtonCount}>{aiQuestions?.length}</div>
					</button>
				)}

				{actions?.length > 0 && (
					<button
						className={
							s.meetingTabButton + ' ' + (activeTab === 'actions' ? s.activeTab : '')
						}
						onClick={() => setActiveTab('actions')}
					>
						<ActionIcon />
						Actions
						<div className={s.tabButtonCount}>{actions?.length}</div>
					</button>
				)}

				{files?.length > 0 && (
					<button
						className={
							s.meetingTabButton + ' ' + (activeTab === 'files' ? s.activeTab : '')
						}
						onClick={() => setActiveTab('files')}
					>
						Files
						<div className={s.tabButtonCount}>{files?.length}</div>
					</button>
				)}

				<button
					className={
						s.meetingTabButton + ' ' + (activeTab === 'transcript' ? s.activeTab : '')
					}
					onClick={() => setActiveTab('transcript')}
				>
					Transcription
				</button>
			</div>
			{/* <div
				className={s.meetingTabRight}
				onClick={() => setActiveTab(activeTab === 'transcript' ? 'all' : 'transcript')}
			>
				<div className={s.toggleButton}>
					{activeTab === 'transcript' ? 'View Live Intelligence' : 'View Transcription'}
				</div>
				<div className={s.waveIcon}>
					{activeTab === 'transcript' ? <AiSparkleIcon /> : <WaveIcon />}
				</div>
			</div> */}
		</div>
	);
};

export default memo(TranscriptionTabs);
