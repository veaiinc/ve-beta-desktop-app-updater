import { memo, useContext, useState } from 'react';
import '../../../assets/scss/notesPage/notesPage.scss';

// icons
import { ReactComponent as PlusIcon } from '../../../assets/svg/notesPage/plus-icon.svg';
import { ReactComponent as NoteIcon } from '../../../assets/svg/notesPage/note-icon.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';

const CreateNewNote = ({ viewMode, isDatabase = false }) => {
	const navigate = useNavigate();

	const {
		notes: { createNotesList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		creatingNoteLoader: false,
	});

	const handleNewNotes = async () => {
		if (info?.creatingNoteLoader) return;
		const payload = {
			input: {
				title: 'New Note',
			},
		};
		setInfo((prev) => ({ ...prev, creatingNoteLoader: true }));
		const response = await createNotesList(payload, isDatabase);
		if (response?.[1]?._id) {
			const newNoteId = response[1]?._id;
			navigate(`/note/${newNoteId}`);
		}
	};

	return viewMode === 'cards' ? (
		<button
			disabled={info?.creatingNoteLoader}
			aria-label="Create New Note"
			onClick={handleNewNotes}
			className="createNewNoteContainer"
		>
			<div className="titleAndDescriptionContainer">
				<h3 className="title">Add a New Note</h3>
				<p className="description">
					Just start typing and let your next big idea flow out!
				</p>
			</div>
			<footer className="footerContainer">
				<div className="iconContainer">
					<PlusIcon />
				</div>
			</footer>
		</button>
	) : viewMode === 'list' ? (
		<button
			disabled={info?.creatingNoteLoader}
			aria-label="Create New Note"
			onClick={handleNewNotes}
			className="createNewNoteContainer"
		>
			<NoteIcon />
			<div className="titleAndDescriptionContainer">
				<h1 className="title">Add a New Note</h1>
				<p className="description">
					Just start typing and let your next big idea flow out!
				</p>
			</div>
			<footer className="footerContainer">
				<div className="iconContainer">
					<PlusIcon />
				</div>
			</footer>
		</button>
	) : null;
};

export default memo(CreateNewNote);
