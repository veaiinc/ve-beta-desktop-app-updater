import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/notes/notesWrapper.scss';
import RecentChat from '../chat/RecentChat';
import ObjectID from 'bson-objectid';
import Notes from './Notes';
import AiTranscriptionSuggestions from '../../components/chat/AiTranscriptionSuggestions';
import Context from '../../../context/context';
import useTranscriptionSuggestions from '../../hooks/useTranscriptionSuggestions';

const NotesWrapper = () => {
	const { createWebSocketConnection, socketRef } = useTranscriptionSuggestions();
	const {
		templates: { aiTranscriptionSuggestions, updateStateValues },
	} = useContext(Context);
	const [info, setInfo] = useState({
		modalIsOpen: false,
		handledOnce: false,
		createSocketConnection: false,
		sessionId: null,
	});

	useEffect(() => {
		updateStateValues({
			leftSidebarState: 'close',
		});
	}, []);

	useEffect(() => {
		if (info?.createSocketConnection) {
			createWebSocketConnection(onMessageFunc);
			setInfo({
				createSocketConnection: false,
			});
		}
	}, [info?.createSocketConnection]);

	useEffect(() => {
		if (aiTranscriptionSuggestions && !info?.handledOnce) {
			setInfo({
				modalIsOpen: true,
				handledOnce: true,
			});
		}
	}, [aiTranscriptionSuggestions]);

	const handleCloseModal = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			modalIsOpen: false,
		}));
	}, []);

	const handleCustomChatBoxClick = useCallback(() => {
		if (!info?.sessionId) {
			const sessionId = ObjectID()?.toString();
			setInfo((prev) => ({
				...prev,
				sessionId,
			}));
		}
	}, [info?.sessionId]);

	const handleCreateSocketConnection = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			createSocketConnection: true,
		}));
	}, []);

	const closeSocketConnection = useCallback(() => {
		if (socketRef?.current) {
			socketRef.current?.close();
		}
	}, []);

	const onMessageFunc = useCallback((event) => {
		console.log(event);
	}, []);

	return (
		<div
			className={'notes-parent-wrapper'}
			style={{
				width: info?.modalIsOpen ? 'calc(100% - 400px)' : '100%',
			}}
		>
			<div className="leftWrapper">
				<div className="chat-wrapper">
					<RecentChat
						isPreview={true}
						showDeleteChat={false}
						customChatBoxClick={handleCustomChatBoxClick}
						{...(info?.sessionId && { sId: info?.sessionId })}
					/>
				</div>
				<div className="notesContainerWrapper">
					<Notes
						createSocketConnection={handleCreateSocketConnection}
						closeSocketConnection={closeSocketConnection}
					/>
				</div>
			</div>
			<AiTranscriptionSuggestions
				data={[]}
				modalIsOpen={info?.modalIsOpen}
				closeModal={handleCloseModal}
			/>
		</div>
	);
};

export default memo(NotesWrapper);
