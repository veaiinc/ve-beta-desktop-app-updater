import { memo, useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/notes/notesWrapper.scss';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosingPrimary.svg';
import RecentChat from '../chat/RecentChat';
import ObjectID from 'bson-objectid';
import { useSearchParams } from 'react-router-dom';
import TranscriptionSidebar from './TranscriptionSidebar';
import DatabaseWithNote from './DatabaseWithNote';

const NotesWrapper = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const isAiIntelligenceEnabled = searchParams.get('isAiIntelligenceEnabled');
	const [info, setInfo] = useState({
		modalIsOpen: true,
		showAmbientAssistance: isAiIntelligenceEnabled === 'true',
		sidebarOpen: false,
		chatActive: false,
		transcriptionActive: false,
	});
	const sessionId = searchParams.get('sId') || ObjectID()?.toString();

	useEffect(() => {
		if (sessionId && sessionId !== searchParams.get('sId')) {
			const newParams = new URLSearchParams(searchParams);
			newParams.set('sId', sessionId);
			setSearchParams(newParams, { replace: true });
		}
	}, [sessionId]);

	useEffect(() => {
		const chat = searchParams.get('chat');
		const transcription = searchParams.get('transcription');

		setInfo((prev) => ({
			...prev,
			chatActive: chat === 'true' || false,
			transcriptionActive: transcription === 'true' || false,
			sidebarOpen: chat === 'true' || transcription === 'true' || false,
		}));
	}, [searchParams]);

	const handleCloseSidebar = useCallback(() => {
		const newParams = new URLSearchParams(searchParams);
		newParams.delete('transcription');
		newParams.delete('chat');
		setSearchParams(newParams, { replace: true });
	}, [searchParams]);

	return (
		<div className={'notes-parent-wrapper'}>
			<div className="leftWrapper">
				<div className="notesContainerWrapper">
					<DatabaseWithNote
						showTranscriptTabs={true}
						showAmbientAssistance={info?.showAmbientAssistance}
					/>
				</div>
				<div
					className="noteChatWrapper"
					style={{
						width: info?.sidebarOpen ? '400px' : '0px',
						borderLeft: info?.sidebarOpen ? '1px solid var(--stroke)' : 'none',
					}}
				>
					<div className="note-sidebar-header">
						<div className="sidebar-close-icon" onClick={handleCloseSidebar}>
							<SidebarClosingSvg />
						</div>
						<div className="sidebar-title">
							{info?.chatActive && 'Chat'}
							{info?.transcriptionActive && 'Transcription'}
						</div>
					</div>
					<div className="note-sidebar-content">
						<div className={`${info?.chatActive ? 'active' : ''} chat-wrapper`}>
							<RecentChat
								isPreview={true}
								showCitationsButton={false}
								// customChatBoxClick={handleCustomChatBoxClick}
								sId={sessionId}
								animateChatBox={true}
							/>
						</div>
						<div
							className={`${
								info?.transcriptionActive ? 'active' : ''
							} transcription-wrapper`}
						>
							<TranscriptionSidebar />
						</div>
					</div>
				</div>
			</div>
			{/* <div
				className={`switchContainer ${
					info?.showAmbientAssistance ? 'SuggestionSidebarActive' : ''
				}`}
			>
				<ToggleSlider
					value={info?.showAmbientAssistance}
					onChange={(checked) => {
						setInfo((prev) => ({
							...prev,
							showAmbientAssistance: checked,
						}));
					}}
				/>
			</div> */}
			{/* {info?.showAmbientAssistance && (
				<AiTranscriptionSuggestions
					data={aiTranscriptionSuggestions || []}
					modalIsOpen={info?.modalIsOpen}
					closeModal={handleCloseModal}
					showAmbientAssistance={info?.showAmbientAssistance}
				/>
			)} */}
		</div>
	);
};

export default memo(NotesWrapper);
