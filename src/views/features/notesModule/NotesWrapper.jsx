import { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/notes/notesWrapper.scss';
import RecentChat from '../chat/RecentChat';
import ObjectID from 'bson-objectid';
import Notes from './Notes';
import AiTranscriptionSuggestions from '../../components/chat/AiTranscriptionSuggestions';
import Context from '../../../context/context';
import DatabaseWithNote from './DatabaseWithNote';
import ToggleSlider from '../../components/input/slider';

const NotesWrapper = () => {
	const {
		templates: { aiTranscriptionSuggestions, updateStateValues },
	} = useContext(Context);
	const [info, setInfo] = useState({
		modalIsOpen: false,
		sessionId: ObjectID()?.toString(),
		showAmbientAssistance: true,
	});

	useEffect(() => {
		updateStateValues({
			leftSidebarState: 'close',
		});
	}, []);

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
			modalIsOpen: false,
		}));
	}, []);

	// const handleCustomChatBoxClick = useCallback(() => {
	// 	if (!info?.sessionId) {
	// 		const sessionId = ObjectID()?.toString();
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			sessionId,
	// 		}));
	// 	}
	// }, [info?.sessionId]);

	// const handleCreateSocketConnection = useCallback(() => {
	// 	setInfo((prev) => ({
	// 		...prev,
	// 		createSocketConnection: true,
	// 	}));
	// }, []);

	return (
		<div
			className={'notes-parent-wrapper'}
			// style={{
			// 	width: info?.modalIsOpen ? 'calc(100% - 400px)' : '100%',
			// }}
		>
			<div className="leftWrapper">
				<div className="chat-wrapper">
					<RecentChat
						isPreview={true}
						showDeleteChat={false}
						showCitationsButton={false}
						// customChatBoxClick={handleCustomChatBoxClick}
						sId={info?.sessionId}
					/>
				</div>
				<div className="notesContainerWrapper">
					{/* <Notes /> */}
					<DatabaseWithNote
						showTranscriptTabs={true}
						showAmbientAssistance={info?.showAmbientAssistance}
					/>
				</div>
			</div>
			<div
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
			</div>
			{info?.showAmbientAssistance && (
				<AiTranscriptionSuggestions
					data={aiTranscriptionSuggestions || []}
					modalIsOpen={info?.modalIsOpen}
					closeModal={handleCloseModal}
					showAmbientAssistance={info?.showAmbientAssistance}
				/>
			)}
		</div>
	);
};

export default memo(NotesWrapper);
