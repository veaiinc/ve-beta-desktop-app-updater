import { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/notesPage/notesPage.scss';
import QuickActions from '../../components/globalComponents/QuickActions';

// Components
import ViewModeSortFilter from '../../components/notesPage/ViewModeSortFilter';
import CardsViewNotes from '../../components/notesPage/CardsViewNotes';
import ListViewNotes from '../../components/notesPage/ListViewNotes';
import Context from '../../../context/context';

const NotesPage = () => {
	const {
		notes: { getNotesList, notes },
	} = useContext(Context);

	const [info, setInfo] = useState({
		viewMode: 'list', // cards, list
		selectedFilter: { label: 'All', value: 'all' },
		selectedSort: { label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
	});

	useEffect(() => {
		fetchNotes({ page: 1 });
	}, [info?.selectedFilter?.value, info?.selectedSort]);

	const fetchNotes = async ({ page = 1, limit = 30, append = false }) => {
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

	const setSelectedFilter = (filter) => {
		setInfo((prev) => ({ ...prev, selectedFilter: filter }));
	};

	const setSelectedSort = (sort) => {
		setInfo((prev) => ({ ...prev, selectedSort: sort }));
	};

	return (
		<div className="notesPageContainer">
			<ViewModeSortFilter
				viewMode={info.viewMode}
				setViewMode={(viewMode) => setInfo((prev) => ({ ...prev, viewMode }))}
				setSelectedFilter={setSelectedFilter}
				setSelectedSort={setSelectedSort}
			/>
			<div
				className={`notesContainer ${
					info.viewMode === 'cards'
						? 'cardsView'
						: info.viewMode === 'list'
						? 'listView'
						: ''
				}`}
			>
				{info.viewMode === 'cards' ? (
					<CardsViewNotes
						notes={notes}
						fetchMoreNotes={fetchNotes}
						setSelectedFilter={setSelectedFilter}
						setSelectedSort={setSelectedSort}
					/>
				) : info.viewMode === 'list' ? (
					<ListViewNotes
						notes={notes}
						fetchMoreNotes={fetchNotes}
						setSelectedFilter={setSelectedFilter}
						setSelectedSort={setSelectedSort}
					/>
				) : null}
			</div>
			<QuickActions />
		</div>
	);
};

export default memo(NotesPage);
