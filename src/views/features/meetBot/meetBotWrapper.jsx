import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ObjectID from 'bson-objectid';
import RecentChat from '../chat/RecentChat';
import TranscriptionSidebar from '../notesModule/TranscriptionSidebar';
import { ReactComponent as BackArrow } from './backArrow.svg';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosingPrimary.svg';
import '../../../assets/scss/notes/notesWrapper.scss';
import MeetBotContainer from './meetBotContainer';
import s from './meetBotWrapper.module.scss';

const MeetBotWrapper = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const isAiIntelligenceEnabled = searchParams.get('isAiIntelligenceEnabled');
	const [info, setInfo] = useState({
		modalIsOpen: true,
		showAmbientAssistance: isAiIntelligenceEnabled === 'true',
		sidebarOpen: false,
		chatActive: false,
		transcriptionActive: false,
	});
	const meetingId = useParams()?.meetingId;

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
		<div className={s.meetingContainer}>
			<div className={s.innerContainer}>
				<div className={s.headerArea}>
					<button className={s.backButton} onClick={() => navigate('/home')}>
						<BackArrow /> Back
					</button>
				</div>
				<div className={s.contentWrapper}>
					<MeetBotContainer
						showTranscriptTabs={true}
						showAmbientAssistance={info?.showAmbientAssistance}
					/>
				</div>
			</div>
			<div
				className="noteChatWrapper"
				style={{
					width: info?.sidebarOpen ? '400px' : '0px',
					borderLeft: info?.sidebarOpen ? '1px solid var(--stroke)' : 'none',
				}}
			>
				<div className={`note-sidebar-header`}>
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
							sId={meetingId}
							animateChatBox={true}
							showHeader={false}
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

export default MeetBotWrapper;
