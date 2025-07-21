import { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/notes/notesWrapper.scss';
import RecentChat from '../chat/RecentChat';
import ObjectID from 'bson-objectid';
import Notes from './Notes';
import AiTranscriptionSuggestions from '../../components/chat/AiTranscriptionSuggestions';
import Context from '../../../context/context';
import DatabaseWithNote from './DatabaseWithNote';
import ToggleSlider from '../../components/input/slider';
import { useSearchParams } from 'react-router-dom';

const NotesWrapper = () => {
	const {
		templates: { aiTranscriptionSuggestions, updateStateValues }
	} = useContext(Context);
	const [searchParams] = useSearchParams();
	const isAiIntelligenceEnabled = searchParams.get('isAiIntelligenceEnabled');
	const [info, setInfo] = useState({
		modalIsOpen: false,
		sessionId: ObjectID()?.toString(),
		showAmbientAssistance: isAiIntelligenceEnabled === 'true',
		chatOpen: false
	});

	useEffect(() => {
		updateStateValues({
			leftSidebarState: 'close'
		});
	}, []);

	useEffect(() => {
		const chat = searchParams.get('chat');
		if (chat === 'false') {
			if (info?.chatOpen) {
				setInfo((prev) => ({
					...prev,
					chatOpen: false
				}));
			}
		} else if (chat === 'true') {
			if (!info?.chatOpen) {
				setInfo((prev) => ({
					...prev,
					chatOpen: true
				}));
			}
		}
	}, [searchParams]);

	// useEffect(() => {
	// 	if (aiTranscriptionSuggestions && !info?.handledOnce) {
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			modalIsOpen: true,
	// 			handledOnce: true,
	// 		}));
	// 	}
	// }, [aiTranscriptionSuggestions]);

	const handleCloseModal = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			modalIsOpen: false
		}));
	}, []);

	return (
		<div
			className={'notes-parent-wrapper'}
			// style={{
			// 	width: info?.modalIsOpen ? 'calc(100% - 400px)' : '100%',
			// }}
		>
			<div className="leftWrapper">
				<div
					className="noteChatWrapper"
					style={{
						width: info?.chatOpen ? '400px' : '0px'
					}}
				>
					<div
						className="chat-wrapper"
						style={{
							transform: info?.chatOpen ? 'translateX(0%)' : 'translateX(-100%)'
						}}
					>
						<RecentChat
							isPreview={true}
							showDeleteChat={false}
							showCitationsButton={false}
							// customChatBoxClick={handleCustomChatBoxClick}
							sId={info?.sessionId}
							animateChatBox={false}
						/>
					</div>
				</div>

				<div className="notesContainerWrapper">
					{/* <Notes /> */}
					<DatabaseWithNote
						showTranscriptTabs={true}
						showAmbientAssistance={info?.showAmbientAssistance}
					/>
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
