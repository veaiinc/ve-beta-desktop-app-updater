import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/notesPage/notesPage.scss';
import moment from 'moment';

//icons
import { ReactComponent as NoteIcon } from '../../../assets/svg/notesPage/note-icon.svg';
import { ReactComponent as LockIcon } from '../../../assets/svg/notesPage/lock-icon.svg';

//components
import CreateNewNote from './CreateNewNote';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../helpers';

//constants
const infiniteScrollHeight = 'calc(100vh - 142px)';

const ListViewNotes = ({ notes, fetchMoreNotes }) => {
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
				alignContent: 'flex-start',
				alignItems: 'flex-start',
			}}
		>
			<CreateNewNote viewMode="list" />
			{notesList.map((note) => {
				const { updatedAt, title, iconImage, _id, permissions } = note;
				let parsedIconImage;
				try {
					parsedIconImage = JSON.parse(JSON.parse(iconImage))?.native;
				} catch {
					parsedIconImage = null;
				}
				const isLocked = permissions?.private;

				return (
					<div
						key={_id}
						onClick={() => navigate(`/note/${_id}`)}
						className="noteListItem"
					>
						<div className="iconImageContainer">
							{parsedIconImage ? parsedIconImage : <NoteIcon />}
						</div>
						<header className="noteCardHeader">
							{isLocked && <LockIcon />}
							<h3 className="noteCardTitle">{title}</h3>
						</header>
						<footer className="noteCardFooter">
							<span className="updatedAt">{moment.unix(updatedAt).fromNow()}</span>
						</footer>
					</div>
				);
			})}
		</InfiniteScroll>
	);
};

export default memo(ListViewNotes);
