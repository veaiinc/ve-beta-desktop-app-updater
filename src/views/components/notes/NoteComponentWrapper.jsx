import { Tooltip } from 'antd';
import { useCallback, useState, memo } from 'react';
import '../../../assets/scss/notes/noteComponentModal.scss';
import NoteComponent from './NoteComponent';
import { ReactComponent as CloseSvg } from '../../../assets/svg/close.svg';
import { StarSvg } from '../../../assets/svg/notes/Star';
import { useContext } from 'react';
import Context from '../../../context/context';
import ShareComponent from './ShareComponent';
import MoreOptions from './MoreOptions';

const outerContainerStyleFullWidth = {
	width: '100%',
	height: '100%',
	maxWidth: '100%',
};

const outerContainerStyle = {
	width: '100%',
	height: '100%',
	maxWidth: '775px',
};

const NoteComponentWrapper = ({ closeModal, sessionId, chatToNoteLoopOn = false }) => {
	const {
		templates: { globalChatMessages },
		documentPreview: { noteContent },
		notes: { addToFavorite, removeFromFavorite, deletePage, duplicatePage },
	} = useContext(Context);

	const [info, setInfo] = useState({
		noteId: null,
		isFavorite: false,
		notesConfigs: {
			smallText: false,
			fullWidth: false,
		},
	});

	const handleClose = useCallback(() => {
		closeModal?.({ open: false, activeRightBar: null });
	}, [closeModal]);

	const handleFavorite = useCallback(
		(value) => {
			setInfo((prev) => ({ ...prev, isFavorite: value }));
			const payload = { pageId: info?.noteId };
			if (value) {
				addToFavorite(payload);
			} else {
				removeFromFavorite(payload);
			}
		},
		[info?.noteId],
	);

	const handleMoreOptionsChange = useCallback((key, value) => {
		setInfo((prev) => ({
			...prev,
			notesConfigs: { ...prev?.notesConfigs, [key]: value },
		}));
	}, []);

	const handleDeletePage = useCallback(async () => {
		const [success] = await deletePage({ pageId: info?.noteId });
		if (success) {
			handleClose();
		}
	}, [info?.noteId]);

	const handleDuplicatePage = useCallback(async () => {
		const [success] = await duplicatePage({ pageId: info?.noteId });
		if (success) {
			// Handle success case if needed
		}
	}, [info?.noteId]);

	return (
		<div className="notes-modal-container">
			<div className="notes-modal-wrapper">
				<div className="note-component">
					<div className="header">
						<div className="left">
							<div className="close-icon" onClick={handleClose}>
								<Tooltip title="Close Notes" placement="bottom">
									<CloseSvg />
								</Tooltip>
							</div>
							<div className="title"></div>
						</div>
						<div className="right">
							<div className="notes-nav-menu">
								<ShareComponent pageId={info?.noteId} />
								<StarSvg
									fill={info?.isFavorite}
									width={18}
									height={18}
									onClick={() => handleFavorite(!info?.isFavorite)}
									className="cursor-pointer"
								/>
								<MoreOptions
									notesConfigs={info?.notesConfigs}
									onChange={handleMoreOptionsChange}
									onDelete={handleDeletePage}
									onDuplicate={handleDuplicatePage}
								/>
							</div>
						</div>
					</div>
					<div className="note-component-container">
						<NoteComponent
							outerContainerStyle={
								info?.notesConfigs?.fullWidth
									? outerContainerStyleFullWidth
									: outerContainerStyle
							}
							initialContent={
								chatToNoteLoopOn
									? globalChatMessages?.[sessionId]?.messages
									: noteContent
							}
							loopOn={chatToNoteLoopOn}
							noteId={info?.noteId}
							setNoteId={(newNoteId) =>
								setInfo((prev) => ({ ...prev, noteId: newNoteId }))
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(NoteComponentWrapper);
