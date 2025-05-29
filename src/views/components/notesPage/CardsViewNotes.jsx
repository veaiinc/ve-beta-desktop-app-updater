import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/notesPage/notesPage.scss';
import moment from 'moment';
//components
import { FetchMoreLoaderComp } from '../../../helpers';
import CreateNewNote from './CreateNewNote';
import InfiniteScroll from '../globalComponents/InfiniteScroll';

// icons
import { ReactComponent as NoteIcon } from '../../../assets/svg/notesPage/note-icon.svg';
import { ReactComponent as LockIcon } from '../../../assets/svg/notesPage/lock-icon.svg';
import { ReactComponent as StarSvg } from '../../../assets/svg/notesPage/star.svg';

//constants
const infiniteScrollHeight = 'calc(100vh - 142px)';

const CardsViewNotes = ({ notes, fetchMoreNotes }) => {
	const navigate = useNavigate();
	const notesList = notes?.data ?? [];
	const hasNextPage = notes?.hasNextPage ?? false;
	const currentPage = notes?.currentPage ?? 1;
	const nextPage = currentPage + 1;
	const dataLength = notesList.length;

	return (
		<InfiniteScroll
			next={() => fetchMoreNotes({ page: nextPage, append: true })}
			hasMore={hasNextPage}
			dataLength={dataLength}
			loader={<FetchMoreLoaderComp />}
			height={infiniteScrollHeight}
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				gap: '18px',
				marginBottom: '18px',
				justifyContent: 'flex-start',
				alignItems: 'flex-start',
			}}
		>
			<CreateNewNote viewMode="cards" />
			{notesList.map((note) => {
				const { updatedAt, title, iconImage, coverImage, _id, permissions, isFavourite } =
					note;
				let parsedIconImage;
				try {
					parsedIconImage = JSON.parse(JSON.parse(iconImage))?.native;
				} catch {
					parsedIconImage = null;
				}
				const isLocked = permissions?.private;

				return (
					<div key={_id} onClick={() => navigate(`/note/${_id}`)} className="noteCard">
						<div className="coverImageContainer">
							{coverImage && <img src={coverImage} alt={title} />}
						</div>
						<div className="iconImageContainer">
							{parsedIconImage ? parsedIconImage : <NoteIcon />}
						</div>
						<header className="noteCardHeader">
							<h3 className="noteCardTitle">{title}</h3>
						</header>
						<footer className="noteCardFooter">
							<span className="updatedAt">{moment.unix(updatedAt).fromNow()}</span>

							<div className="footer-right">
								{isFavourite && (
									<div className="icon">
										<StarSvg className="favourite-icon" />
									</div>
								)}
								{isLocked && (
									<div className="icon">
										<LockIcon className="lock-icon" />
									</div>
								)}
							</div>
						</footer>
					</div>
				);
			})}
		</InfiniteScroll>
	);
};

export default memo(CardsViewNotes);
