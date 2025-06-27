import { memo, useContext, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/notes/notesWrapper.scss';
import RecentChat from '../chat/RecentChat';
import ObjectID from 'bson-objectid';
import Notes from './Notes';
import AiTranscriptionSuggestions from '../../components/chat/AiTranscriptionSuggestions';
import Context from '../../../context/context';
import useTranscriptionSuggestions from '../../hooks/useTranscriptionSuggestions';

const NotesWrapper = () => {
	const { createWebSocketConnection } = useTranscriptionSuggestions();
	const {
		templates: { aiTranscriptionSuggestions, updateStateValues },
	} = useContext(Context);
	const [info, setInfo] = useState({
		modalIsOpen: true,
		handledOnce: false,
		createSocketConnection: false,
	});
	const sessionIdRef = useRef(null);

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

	const handleCloseModal = () => {
		setInfo({
			modalIsOpen: false,
		});
	};
	const onMessageFunc = (event) => {
		console.log(event);
	};

	const handleCreateSocketTranscriptionConnection = () => {
		setInfo({
			createSocketConnection: true,
		});
	};
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
						sId={sessionIdRef?.current}
						showDeleteChat={false}
					/>
				</div>
				<div className="notesContainerWrapper">
					<Notes handleSocketConnection={handleCreateSocketTranscriptionConnection} />
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
