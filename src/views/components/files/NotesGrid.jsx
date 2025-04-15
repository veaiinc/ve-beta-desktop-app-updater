import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import { useNavigate } from 'react-router-dom';
const NotesGrid = ({ notes, handleNewNotes }) => {
	const navigate = useNavigate();
	return (
		<div className={`card-container`}>
			<div className="card-item">
				<div className="card-item-style card-item-style-btn">
					<button className="card-btn" onClick={handleNewNotes}>
						<Plus />
						Create Note
					</button>
				</div>
			</div>
			{notes?.data?.slice(0, 12).map((note, index) => (
				<div
					className="card-item"
					key={index}
					onClick={() => navigate(`/note/${note?._id}`)}
				>
					<div className="card-item-style content-wrapper">
						{/* <span
							className={`status-badge ${
								note?.status === 'published' ? 'live' : 'draft'
							}`}
						>
							{note?.status === 'published' ? 'Live' : 'Draft'}
						</span> */}
						<span className="item-title">
							{note?.title?.slice(0, 20) || 'Untitled Note'}
						</span>
					</div>
				</div>
			))}
		</div>
	);
};

export default NotesGrid;
