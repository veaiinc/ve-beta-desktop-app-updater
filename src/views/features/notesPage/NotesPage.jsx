import { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/notesPage/notesPage.scss';
// import QuickActions from '../../components/globalComponents/QuickActions';
import jwtDecode from 'jwt-decode';
// Components
import ViewModeSortFilter from '../../components/notesPage/ViewModeSortFilter';
import CardsViewNotes from '../../components/notesPage/CardsViewNotes';
import ListViewNotes from '../../components/notesPage/ListViewNotes';
import Context from '../../../context/context';
import { useSearchParams } from 'react-router-dom';

const NotesPage = () => {
	const {
		notes: { getNotesList, notes },
	} = useContext(Context);
	const [searchParams, setSearchParams] = useSearchParams();

	const [info, setInfo] = useState({
		viewMode: searchParams?.get('viewMode') || 'list', // cards, list
		selectedFilter: { label: 'All', value: 'all' },
		selectedSort: { label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
		userId: null,
		searchQuery: '',
		loading: false,
	});

	useEffect(() => {
		fetchNotes({ page: 1 });
	}, [info?.selectedFilter?.value, info?.selectedSort, info?.searchQuery]);

	useEffect(() => {
		setSearchParams({ viewMode: info?.viewMode });
	}, [info?.viewMode]);

	useEffect(() => {
		const token = localStorage.getItem('usertoken');
		if (token) {
			const { user_id } = jwtDecode(token);
			setInfo((prev) => ({ ...prev, userId: user_id }));
		}
	}, []);

	const fetchNotes = async ({ page = 1, limit = 30, append = false }) => {
		try {
			setLoading(true);
			const { value: sortBy, sortType: sortOrder } = info?.selectedSort;
			const payload = {
				input: {
					limit,
					page,
					pageType: info?.selectedFilter?.value,
					sortBy,
					sortOrder,
					search: info?.searchQuery,
				},
			};
			await getNotesList(payload, append);
		} catch (error) {
			console.error('Error fetching notes:', error);
		} finally {
			setLoading(false);
		}
	};

	const setSelectedFilter = (filter) => {
		setInfo((prev) => ({ ...prev, selectedFilter: filter }));
	};

	const setSelectedSort = (sort) => {
		setInfo((prev) => ({ ...prev, selectedSort: sort }));
	};

	const setLoading = (loading) => {
		setInfo((prev) => ({ ...prev, loading }));
	};

	return (
		<div className="notesPageContainer">
			<ViewModeSortFilter
				viewMode={info.viewMode}
				setViewMode={(viewMode) => setInfo((prev) => ({ ...prev, viewMode }))}
				setSelectedFilter={setSelectedFilter}
				setSelectedSort={setSelectedSort}
				setSearchQuery={(searchQuery) => setInfo((prev) => ({ ...prev, searchQuery }))}
				setLoading={setLoading}
				loading={info?.loading}
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
						userId={info?.userId}
					/>
				) : info.viewMode === 'list' ? (
					<ListViewNotes
						notes={notes}
						fetchMoreNotes={fetchNotes}
						setSelectedFilter={setSelectedFilter}
						setSelectedSort={setSelectedSort}
						userId={info?.userId}
					/>
				) : null}
			</div>
			{/* <QuickActions /> */}
		</div>
	);
};

export default memo(NotesPage);