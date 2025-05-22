import { memo } from 'react';
import s from '../../../assets/scss/notesPage/notesPage.module.scss';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../helpers';
import moment from 'moment';

// icons
import { ReactComponent as NoteIcon } from '../../../assets/svg/notesPage/note-icon.svg';
import { ReactComponent as LockIcon } from '../../../assets/svg/notesPage/lock-icon.svg';
import CreateNewNote from './CreateNewNote';
import { useNavigate } from 'react-router-dom';

//constants
const infiniteScrollHeight = 'calc(100vh - 114px)';

const CardsViewNotes = ({ notes, fetchMoreNotes }) => {
	const navigate = useNavigate();
	const notesList = notes?.data ?? [];
	const hasNextPage = notes?.hasNextPage ?? false;
	const currentPage = notes?.currentPage ?? 1;
	const dataLength = notesList.length;

	return (
		<InfiniteScroll
			next={() => fetchMoreNotes({ page: currentPage + 1, append: true })}
			hasMore={hasNextPage}
			dataLength={dataLength}
			loader={<FetchMoreLoaderComp />}
			height={infiniteScrollHeight}
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				gap: '18px',
				marginBottom: '18px',
			}}
		>
			<CreateNewNote viewMode="cards" />
			{notesList.map((note) => {
				const { updatedAt, title, iconImage, coverImage, _id } = note;
				const parsedIconImage = JSON.parse(JSON.parse(iconImage))?.native;
				return (
					<div key={_id} onClick={() => navigate(`/note/${_id}`)} className={s.noteCard}>
						{coverImage ? (
							<div className={s.coverImageContainer}>
								<img src={coverImage} alt={title} />
							</div>
						) : (
							<div className={s.coverImageContainer}></div>
						)}
						{iconImage ? (
							<div className={s.iconImageContainer}>
								{parsedIconImage ?? <NoteIcon />}
							</div>
						) : (
							<div className={s.iconImageContainer}>
								<NoteIcon />
							</div>
						)}
						<header className={s.noteCardHeader}>
							<h3 className={s.noteCardTitle}>{title}</h3>
						</header>
						<footer className={s.noteCardFooter}>
							<span className={s.updatedAt}>{moment.unix(updatedAt).fromNow()}</span>
							<LockIcon />
						</footer>
					</div>
				);
			})}
		</InfiniteScroll>
	);
};

export default memo(CardsViewNotes);
