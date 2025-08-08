import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import { useNavigate } from 'react-router-dom';
import { memo, useContext, useEffect, useState } from 'react';
import Context from '../../../context/context';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import gsap from 'gsap';
import FilterDropdown from '../dropDown/file/FilterDropdown';
import Spinner from '../loaders/Spinner';
import moment from 'moment';
import EmptyState from './EmptyState';
import { Tooltip } from 'antd';
import { accessControlCheck } from '../../../helpers/accessControlCheck';

const filterOptions = [
	{ label: 'All', value: 'all' },
	{ label: 'Private', value: 'private' },
	{ label: 'Shared', value: 'shared' },
	{ label: 'Favorite', value: 'favorite' },
	{ label: 'Published', value: 'published' },
	{ label: 'Trashed', value: 'trashed' },
];

const sortOptions = [
	{ label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
	{ label: 'Recently Created', value: 'createdAt', sortType: -1 },
	{ label: 'A-Z', value: 'title', sortType: 1 },
];

const NotesGrid = ({ handleTotalChange, isDatabase = false }) => {
	const navigate = useNavigate();

	const {
		notes: { getNotesList, notes, createNotesList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		notes: [],
		loading: true,
		currentPage: 1,
		hasNextPage: false,
		selectedFilter: { label: 'All', value: 'all' },
		selectedSort: { label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
		notesCreateLoading: false,
	});

	useEffect(() => {
		setInfo((prevInfo) => ({ ...prevInfo, loading: true }));
		fetchNotes({ page: 1 });
	}, [info?.selectedFilter?.value, info?.selectedSort, isDatabase]);

	useEffect(() => {
		if (notes) {
			const { currentPage = 1, hasNextPage = false, data = [], totalDocs } = notes || {};
			const newNotes = currentPage === 1 ? [...data] : [...info?.notes, ...(data || [])];
			handleStateUpdate({ notes: newNotes, currentPage, hasNextPage, loading: false });
			handleTotalChange(totalDocs);
		}
	}, [notes]);

	useEffect(() => {
		const delay =
			info.selectedView === 'Classic Gallery' || info.selectedView === 'Lite Gallery'
				? 100
				: 0;

		const timeout = setTimeout(() => {
			const cards = document.querySelectorAll(
				'.card-container .card-item:not(.card-item-style-btn)',
			);
			if (!cards || cards.length === 0) return;

			const newCards = Array.from(cards).filter((card) => !card.dataset.animated);
			if (newCards.length === 0) return;

			const ctx = gsap.context(() => {
				newCards.forEach((card) => {
					const yOffset = 50 + Math.random() * 100;
					gsap.set(card, {
						y: yOffset,
						opacity: 0,
					});
				});

				const columnGroups = {
					oddColumns: newCards.filter((_, index) => index % 4 === 0 || index % 4 === 2),
					evenColumns: newCards.filter((_, index) => index % 4 === 1 || index % 4 === 3),
				};

				gsap.to(columnGroups.oddColumns, {
					y: 0,
					opacity: 1,
					duration: 0.4,
					stagger: {
						each: 0.05,
						ease: 'power1.out',
					},
					modifiers: {
						y: (y, target) => {
							const initialY = Math.abs(
								parseFloat(target.style.transform?.split('translateY(')[1]) || 0,
							);
							const duration = gsap.utils.mapRange(50, 150, 0.4, 0.2)(initialY);
							if (target._gsap) target._gsap.duration = duration;
							return y;
						},
					},
					onComplete: () => {
						columnGroups.oddColumns.forEach((card) => {
							card.dataset.animated = 'true';
						});
					},
				});

				gsap.to(columnGroups.evenColumns, {
					y: 0,
					opacity: 1,
					duration: 0.4,
					delay: 0.1,
					stagger: {
						each: 0.05,
						ease: 'power1.out',
					},
					modifiers: {
						y: (y, target) => {
							const initialY = Math.abs(
								parseFloat(target.style.transform?.split('translateY(')[1]) || 0,
							);
							const duration = gsap.utils.mapRange(50, 150, 0.4, 0.2)(initialY);
							if (target._gsap) target._gsap.duration = duration;
							return y;
						},
					},
					onComplete: () => {
						columnGroups.evenColumns.forEach((card) => {
							card.dataset.animated = 'true';
						});
					},
				});
			}, cards[0]);

			return () => ctx.revert();
		}, delay);

		return () => clearTimeout(timeout);
	}, [info?.notes?.length]);

	const handleStateUpdate = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const fetchNotes = async ({ page = 1, limit = 20 }) => {
		try {
			const { value: sortBy, sortType: sortOrder } = info?.selectedSort;
			const payload = {
				input: {
					limit,
					page,
					pageType: info?.selectedFilter?.value,
					sortBy,
					sortOrder,
				},
			};
			const append = false;
			await getNotesList(payload, append, isDatabase);
		} catch (error) {
			console.error('Error fetching notes:', error);
		} finally {
			setInfo((prevInfo) => ({ ...prevInfo, loading: false }));
		}
	};

	const fetchMoreNotes = () => {
		if (!info?.hasNextPage) return;
		fetchNotes({ page: info?.currentPage + 1 });
	};

	const handleSortClick = (value) => {
		let sortType = value?.sortType;
		if (value?.value === info?.selectedSort?.value) {
			sortType = info?.selectedSort?.sortType * -1;
		}
		handleStateUpdate({ selectedSort: { ...value, sortType } });
	};

	const handleCreateNoteOrDatabase = async () => {
		if (!accessControlCheck('note')) return;
		if (info?.notesCreateLoading) return;
		setInfo((prevInfo) => ({ ...prevInfo, notesCreateLoading: true }));
		const payload = {
			input: {
				title: 'New Note',
			},
		};
		const response = await createNotesList(payload, isDatabase);
		if (response?.[1]?._id) {
			const newNoteId = response[1]?._id;
			navigate(`/note/${newNoteId}`);
		}
		setInfo((prevInfo) => ({ ...prevInfo, notesCreateLoading: false }));
	};

	return (
		<div className="card-sub-container-center">
			<div className="center-container-header">
				<FilterDropdown
					options={filterOptions}
					selected={info?.selectedFilter}
					onOptionClick={(value) => handleStateUpdate({ selectedFilter: value })}
					width="120px"
				/>
				<FilterDropdown
					options={sortOptions}
					selected={info?.selectedSort}
					onOptionClick={handleSortClick}
					showSelectedEndArrow
					width="180px"
					hideOnOptionClick={false}
				/>
			</div>
			<div className="center-container-content">
				{info?.loading ? (
					<div className="spinner-container">
						<Spinner />
					</div>
				) : info?.notes?.length > 0 ? (
					<InfiniteScroll
						dataLength={info?.notes?.length}
						next={fetchMoreNotes}
						hasMore={info?.hasNextPage}
						height={'100%'}
					>
						<div className="card-container">
							<div className="card-item create">
								<div className="card-item-style card-item-style-btn">
									<button
										onClick={handleCreateNoteOrDatabase}
										className="card-btn"
										disabled={info?.notesCreateLoading}
									>
										{info?.notesCreateLoading ? (
											<Spinner />
										) : (
											<>
												<Plus />
											</>
										)}
										{info?.notesCreateLoading ? 'Creating...' : 'Create Note'}
									</button>
								</div>
							</div>
							{info?.notes?.map((note, index) => (
								<div
									className="card-item notes-grid-container tooltip"
									key={index}
									onClick={() => navigate(`/note/${note?._id}`)}
									data-tooltip={note?.title}
								>
									<div className="card-item-style content-wrapper note-card-content">
										<div className="title-container">
											{/* <NotesIcon /> */}
											<span></span>
											<span className="item-title">
												{note?.title || 'Untitled Note'}
											</span>
										</div>
										<div className="note-footer-container">
											<span className="note-sub-heading">
												{info?.selectedSort?.value === 'updatedAt' ? (
													<Tooltip title="Updated On">
														{moment.unix(note?.updatedAt).fromNow()}
													</Tooltip>
												) : (
													<Tooltip title="Created On">
														{moment.unix(note?.createdAt).fromNow()}
													</Tooltip>
												)}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</InfiniteScroll>
				) : (
					<div className="spinner-container">
						<EmptyState
							title={'No notes here'}
							subtitle={'Try creating some notes'}
							buttonOnClick={handleCreateNoteOrDatabase}
							buttonLoading={info?.notesCreateLoading}
							buttonText={'Create note'}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(NotesGrid);
