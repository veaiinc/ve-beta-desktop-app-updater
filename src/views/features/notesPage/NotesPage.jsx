import { memo, useContext, useEffect, useState } from 'react';
import s from '../../../assets/scss/notesPage/notesPage.module.scss';
import QuickActions from '../../components/globalComponents/QuickActions';

// Components
import ViewModeSortFilter from '../../components/notesPage/ViewModeSortFilter';
import CardsViewNotes from '../../components/notesPage/CardsViewNotes';
import ListViewNotes from '../../components/notesPage/ListViewNotes';
import Context from '../../../context/context';

// Constants
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

const NotesPage = () => {
	const {
		notes: { getNotesList, notes },
	} = useContext(Context);

	const [info, setInfo] = useState({
		viewMode: 'cards', // cards, list
		selectedFilter: { label: 'All', value: 'all' },
		selectedSort: { label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
	});

	useEffect(() => {
		fetchNotes({ page: 1 });
	}, [info?.selectedFilter?.value, info?.selectedSort]);

	const fetchNotes = async ({ page = 1, limit = 20, append = false }) => {
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
			await getNotesList(payload, append);
		} catch (error) {
			console.error('Error fetching notes:', error);
		}
	};

	return (
		<div className={s.notesPageContainer}>
			<ViewModeSortFilter
				viewMode={info.viewMode}
				setViewMode={(viewMode) => setInfo((prev) => ({ ...prev, viewMode }))}
			/>
			<div
				className={`${s.notesContainer} ${
					info.viewMode === 'cards'
						? s.cardsView
						: info.viewMode === 'list'
						? s.listView
						: ''
				}`}
			>
				{info.viewMode === 'cards' ? (
					<CardsViewNotes notes={notes} fetchMoreNotes={fetchNotes} />
				) : info.viewMode === 'list' ? (
					<ListViewNotes notes={notes} fetchMoreNotes={fetchNotes} />
				) : null}
			</div>
			<QuickActions />
		</div>
	);
};

export default memo(NotesPage);
