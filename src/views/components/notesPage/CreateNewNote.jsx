import { memo, useContext, useState } from 'react';
import s from '../../../assets/scss/notesPage/notesPage.module.scss';

// icons
import { ReactComponent as PlusIcon } from '../../../assets/svg/notesPage/plus-icon.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';

const CreateNewNote = ({ viewMode }) => {
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
		const response = await createNotesList(payload);
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
			className={s.createNewNoteContainer}
		>
			<div className={s.titleAndDescriptionContainer}>
				<h3 className={s.title}>Add a New Note</h3>
				<p className={s.description}>
					Just start typing and let your next big idea flow out!
				</p>
			</div>
			<footer className={s.footerContainer}>
				<div className={s.iconContainer}>
					<PlusIcon />
				</div>
			</footer>
		</button>
	) : viewMode === 'list' ? (
		<button
			disabled={info?.creatingNoteLoader}
			aria-label="Create New Note"
			onClick={handleNewNotes}
			className={s.createNewNoteContainer}
		></button>
	) : null;
};

export default memo(CreateNewNote);
