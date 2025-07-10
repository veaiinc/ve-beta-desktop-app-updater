import { memo } from 'react';
import '../../../../assets/scss/notes/noteComponent.scss';
import { StarSvg } from '../../../../assets/svg/notes/Star';
import { ReactComponent as BackArrowSvg } from '../../../../assets/svg/workflow/backarrow.svg';
import { ReactComponent as DangerSvg } from '../../../../assets/svg/notes/danger.svg';
import { ReactComponent as RestoreIcon } from '../../../../assets/svg/notes/restore.svg';
import { ReactComponent as DustBinIcon } from '../../../../assets/svg/tasks/dustBin.svg';
import ShareComponent from '../../../components/notes/ShareComponent';
import MoreOptions from '../../../components/notes/MoreOptions';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const NotesHeader = ({
	isDeleted,
	title,
	isFavorite,
	noteId,
	notesConfigs,
	myAccess,
	lastUpdated,
	updatedAt,
	handleFavorite,
	handleMoreOptionsChange,
	handleDeletePage,
	handleDuplicatePage,
	restorePage,
}) => {
	const navigate = useNavigate();

	return !isDeleted ? (
		<div className="notes-nav-menu">
			<div className="notes-nav-left">
				<div className="backBtnContainer">
					<span
						className="backBtn"
						onClick={() => navigate(-1)}
						aria-label="Go back to previous page"
					>
						<BackArrowSvg aria-hidden="true" />
						<span>Notes</span>
						<div className="divider"></div>
					</span>
				</div>
				<div className="notes-nav-title">{title}</div>
			</div>

			<div className="notes-nav-right">
				<button className="notes-nav-button" onClick={() => handleFavorite(!isFavorite)}>
					<StarSvg fill={isFavorite} width={18} height={18} className="cursor-pointer" />
				</button>

				{myAccess === 'full' && <ShareComponent pageId={noteId} makeApiCall={false} />}

				<MoreOptions
					notesConfigs={notesConfigs}
					onChange={handleMoreOptionsChange}
					onDelete={handleDeletePage}
					onDuplicate={handleDuplicatePage}
				/>
			</div>
		</div>
	) : (
		<div className="deleted-badge">
			<div className="badge-text-wrapper">
				<DangerSvg />
				<p className="delete-badge-message">
					{lastUpdated
						? `${lastUpdated?.firstName} ${
								lastUpdated?.lastName ? lastUpdated?.lastName : ''
						  } `
						: 'Someone '}
					moved this page to trash {updatedAt ? moment?.unix(updatedAt).fromNow() : ''}.
				</p>
			</div>

			<div className="badge-button-wrapper">
				<button className="delete-badge-restore-btn" onClick={restorePage}>
					<RestoreIcon />
					Restore
				</button>
				<button
					className="delete-badge-permanent-delete-btn"
					onClick={() => handleDeletePage(true)}
				>
					<DustBinIcon /> Permanently delete
				</button>
			</div>
		</div>
	);
};

export default memo(NotesHeader);
