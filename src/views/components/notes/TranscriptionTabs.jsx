import { memo } from 'react';
import { ReactComponent as VeAiLogo } from '../../../assets/svg/ve.svg';

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
}) => {
	return (
		<div className="notes-tabs-container">
			<div className="notes-tabs-header">
				{history && (
					<button
						className={activeTab === 'summary' ? 'notes-tab active' : 'notes-tab'}
						style={{
							background: 'none',
							border: 'none',
							outline: 'none',
							color: 'inherit',
							fontWeight: 500,
							fontSize: 16,
							padding: '8px 0',
							borderBottom:
								activeTab === 'summary'
									? '2px solid var(--primary-button, #cfff48)'
									: '2px solid transparent',
							cursor: 'pointer',
							transition: 'color 0.2s',
						}}
						onClick={() => setActiveTab('summary')}
					>
						Summary
					</button>
				)}

				{(history || type === 'desktop') && (
					<button
						className={activeTab === 'transcript' ? 'notes-tab active' : 'notes-tab'}
						style={{
							background: 'none',
							border: 'none',
							outline: 'none',
							color: 'inherit',
							fontWeight: 500,
							fontSize: 16,
							padding: '8px 0',
							borderBottom:
								activeTab === 'transcript'
									? '2px solid var(--primary-button, #cfff48)'
									: '2px solid transparent',
							cursor: 'pointer',
							transition: 'color 0.2s',
						}}
						onClick={() => setActiveTab('transcript')}
					>
						Transcript
					</button>
				)}

				{history && (
					<button
						className={activeTab === 'all' ? 'notes-tab active' : 'notes-tab'}
						style={{
							background: 'none',
							border: 'none',
							outline: 'none',
							color: 'inherit',
							fontWeight: 500,
							fontSize: 16,
							padding: '8px 0',
							borderBottom:
								activeTab === 'all'
									? '2px solid var(--primary-button, #cfff48)'
									: '2px solid transparent',
							cursor: 'pointer',
							transition: 'color 0.2s',
						}}
						onClick={() => setActiveTab('all')}
					>
						Meeting Intelligence
					</button>
				)}

				{history && hasAudioRecording && (
					<button
						className={activeTab === 'audio' ? 'notes-tab active' : 'notes-tab'}
						style={{
							background: 'none',
							border: 'none',
							outline: 'none',
							color: 'inherit',
							fontWeight: 500,
							fontSize: 16,
							padding: '8px 0',
							borderBottom:
								activeTab === 'audio'
									? '2px solid var(--primary-button, #cfff48)'
									: '2px solid transparent',
							cursor: 'pointer',
							transition: 'color 0.2s',
						}}
						onClick={() => setActiveTab('audio')}
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
						history && hasAudioRecording,
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
						className={activeTab === 'all' ? 'notes-tab active' : 'notes-tab'}
						style={{
							background: 'none',
							border: 'none',
							outline: 'none',
							color: 'inherit',
							fontWeight: 500,
							fontSize: 16,
							padding: '8px 0',
							borderBottom:
								activeTab === 'all'
									? '2px solid var(--primary-button, #cfff48)'
									: '2px solid transparent',
							cursor: 'pointer',
							transition: 'color 0.2s',
						}}
						onClick={() => setActiveTab('all')}
					>
						All
					</button>
				)}
				{userQuestions?.length > 0 && (
					<button
						className={activeTab === 'userQuestions' ? 'notes-tab active' : 'notes-tab'}
						style={{
							background: 'none',
							border: 'none',
							outline: 'none',
							color: 'inherit',
							fontWeight: 500,
							fontSize: 16,
							padding: '8px 0',
							borderBottom:
								activeTab === 'userQuestions'
									? '2px solid var(--primary-button, #cfff48)'
									: '2px solid transparent',
							cursor: 'pointer',
							transition: 'color 0.2s',
						}}
						onClick={() => setActiveTab('userQuestions')}
					>
						Ask User
					</button>
				)}

				{aiQuestions?.length > 0 && (
					<button
						className={activeTab === 'aiQuestions' ? 'notes-tab active' : 'notes-tab'}
						style={{
							background: 'none',
							border: 'none',
							outline: 'none',
							color: 'inherit',
							fontWeight: 500,
							fontSize: 16,
							padding: '8px 0',
							borderBottom:
								activeTab === 'aiQuestions'
									? '2px solid var(--primary-button, #cfff48)'
									: '2px solid transparent',
							cursor: 'pointer',
							transition: 'color 0.2s',
						}}
						onClick={() => setActiveTab('aiQuestions')}
					>
						Ask <VeAiLogo width={20} height={20} />
					</button>
				)}

				{actions?.length > 0 && (
					<button
						className={activeTab === 'actions' ? 'notes-tab active' : 'notes-tab'}
						style={{
							background: 'none',
							border: 'none',
							outline: 'none',
							color: 'inherit',
							fontWeight: 500,
							fontSize: 16,
							padding: '8px 0',
							borderBottom:
								activeTab === 'actions'
									? '2px solid var(--primary-button, #cfff48)'
									: '2px solid transparent',
							cursor: 'pointer',
							transition: 'color 0.2s',
						}}
						onClick={() => setActiveTab('actions')}
					>
						Actions
					</button>
				)}

				{files?.length > 0 && (
					<button
						className={activeTab === 'files' ? 'notes-tab active' : 'notes-tab'}
						style={{
							background: 'none',
							border: 'none',
							outline: 'none',
							color: 'inherit',
							fontWeight: 500,
							fontSize: 16,
							padding: '8px 0',
							borderBottom:
								activeTab === 'files'
									? '2px solid var(--primary-button, #cfff48)'
									: '2px solid transparent',
							cursor: 'pointer',
							transition: 'color 0.2s',
						}}
						onClick={() => setActiveTab('files')}
					>
						Files
					</button>
				)}
			</div>
		</div>
	);
};

export default memo(TranscriptionTabs);
