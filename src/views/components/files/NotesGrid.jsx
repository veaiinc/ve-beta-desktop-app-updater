import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import { useNavigate } from 'react-router-dom';
import { memo, useContext, useEffect, useState } from 'react';
import Context from '../../../context/context';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
const NotesGrid = ({ handleNewNotes }) => {
	const navigate = useNavigate();

	const {
		notes: { getNotesList, notes, createNotesList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		notes: [],
		loading: true,
		currentPage: 1,
		hasNextPage: false,
	});

	useEffect(() => {
		fetchNotes({ page: 1 });
	}, []);

	useEffect(() => {
		if (notes) {
			const { currentPage = 1, hasNextPage = false, data = [] } = notes;
			const newNotes = currentPage === 1 ? [...data] : [...info?.notes, ...(data || [])];
			handleStateUpdate({ notes: newNotes, currentPage, hasNextPage });
		}
	}, [notes]);

	const handleStateUpdate = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const fetchNotes = async ({ page = 1, limit = 20 }) => {
		try {
			const payload = {
				input: {
					limit,
					page,
					pageType: 'all',
				},
			};
			await getNotesList(payload, false);
		} catch (error) {
			console.error('Error fetching notes:', error);
		}
	};

	const fetchMoreNotes = () => {
		if (!info?.hasNextPage) return;
		fetchNotes({ page: info?.currentPage + 1 });
	};

	return (
		<InfiniteScroll
			dataLength={info?.notes?.length}
			next={fetchMoreNotes}
			hasMore={info?.hasNextPage}
			height={'100%'}
		>
			<div className="card-container">
				<div className="card-item" onClick={handleNewNotes}>
					<div className="card-item-style card-item-style-btn">
						<button className="card-btn">
							<Plus />
							Create Note
						</button>
					</div>
				</div>
				{info?.notes?.map((note, index) => (
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
							<span className="item-title">{note?.title || 'Untitled Note'}</span>
						</div>
					</div>
				))}
			</div>
		</InfiniteScroll>
	);
};

export default memo(NotesGrid);
