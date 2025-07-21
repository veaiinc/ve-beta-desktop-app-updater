import { memo } from 'react';

const TranscriptionTabs = ({ activeTab, setActiveTab }) => {
	return (
		<div className="notes-tabs-container">
			<div
				className="notes-tabs-header"
				style={{
					display: 'flex',
					gap: 24,
					borderBottom: '1px solid var(--stroke, #2c2d2e)',
					marginBottom: 12,
				}}
			>
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
			</div>
		</div>
	);
};

export default memo(TranscriptionTabs);
