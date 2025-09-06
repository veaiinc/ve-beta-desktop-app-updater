import { memo, useContext, useEffect, useState, useCallback, lazy, Suspense } from 'react';
import '../../../assets/scss/notesPage/notesPage.scss';
// import QuickActions from '../../components/globalComponents/QuickActions';
import jwtDecode from 'jwt-decode';
// Components
import ViewModeSortFilter from '../../components/notesPage/ViewModeSortFilter';
const CardsViewNotes = lazy(() => import('../../components/notesPage/CardsViewNotes'));
const ListViewNotes = lazy(() => import('../../components/notesPage/ListViewNotes'));
import Context from '../../../context/context';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../../components/loaders/Spinner';
import { filterOptions, sortOptions } from '../../components/notesPage/SortAndFilterTooltip';

const getFilterAndSort = (type = 'sort', value, sortType) => {
	if (type === 'sort') {
		return (
			sortOptions?.find(
				(item) => item?.value === value && item?.sortType === Number(sortType),
			) || { label: 'Recently Updated', value: 'updatedAt', sortType: -1 }
		);
	} else {
		return (
			filterOptions?.find((item) => item?.value === value) || { label: 'All', value: 'all' }
		);
	}
};

const NotesPage = ({ isDatabase = false }) => {
	const {
		notes: { getNotesList, notes },
	} = useContext(Context);
	const [searchParams, setSearchParams] = useSearchParams();

	const [info, setInfo] = useState({
		viewMode: searchParams?.get('viewMode') || 'list', // cards, list
		selectedFilter: getFilterAndSort('filter', searchParams?.get('filter')),
		selectedSort: getFilterAndSort(
			'sort',
			searchParams?.get('sort'),
			searchParams?.get('sortType'),
		),
		userId: null,
		searchQuery: '',
		loading: false,
		initialLoader: true,
	});

	useEffect(() => {
		setInfo((prevInfo) => ({ ...prevInfo, initialLoader: true }));
		fetchNotes({ page: 1 });
	}, [info?.selectedFilter?.value, info?.selectedSort, info?.searchQuery, isDatabase]);

	useEffect(() => {
		setSearchParams({
			viewMode: info?.viewMode,
			filter: info?.selectedFilter?.value,
			sort: info?.selectedSort?.value,
			sortType: info?.selectedSort?.sortType,
		});
	}, [
		info?.viewMode,
		info?.selectedFilter?.value,
		info?.selectedSort?.value,
		info?.selectedSort?.sortType,
	]);

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
			const { value: sortBy, sortType: sortOrder } = info?.selectedSort || {};
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
			await getNotesList(payload, append, isDatabase);
		} catch (error) {
			console.error('Error fetching notes:', error);
		} finally {
			setLoading(false);
			setInfo((prevInfo) => ({ ...prevInfo, initialLoader: false }));
		}
	};

	const setSelectedFilter = useCallback((filter) => {
		setInfo((prev) => ({ ...prev, selectedFilter: filter }));
	}, []);

	const setSelectedSort = useCallback((sort) => {
		setInfo((prev) => ({ ...prev, selectedSort: sort }));
	}, []);

	const setLoading = useCallback((loading) => {
		setInfo((prev) => ({ ...prev, loading }));
	}, []);

	const setSearchQuery = useCallback(
		(searchQuery) => setInfo((prev) => ({ ...prev, searchQuery })),
		[],
	);

	return (
		<div className="notesPageContainer">
			<Suspense fallback={<SuspenseFallback />}>
				<ViewModeSortFilter
					viewMode={info.viewMode}
					setViewMode={(viewMode) => setInfo((prev) => ({ ...prev, viewMode }))}
					setSelectedFilter={setSelectedFilter}
					setSelectedSort={setSelectedSort}
					setSearchQuery={setSearchQuery}
					setLoading={setLoading}
					loading={info?.loading}
					selectedFilter={info?.selectedFilter}
					selectedSort={info?.selectedSort}
					isDatabase={isDatabase}
				/>
				{info?.initialLoader ? (
					<div className="notes-list-loader-container">
						<Spinner
							width="18px"
							height="18px"
							color="var(--primary-button)"
							borderWidth={1.5}
						/>
					</div>
				) : notes?.data?.length == 0 ? (
					<div className="notes-list-loader-container">No notes found</div>
				) : (
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
								isDatabase={isDatabase}
							/>
						) : info.viewMode === 'list' ? (
							<ListViewNotes
								notes={notes}
								fetchMoreNotes={fetchNotes}
								setSelectedFilter={setSelectedFilter}
								setSelectedSort={setSelectedSort}
								userId={info?.userId}
								isDatabase={isDatabase}
							/>
						) : null}
					</div>
				)}
			</Suspense>
			{/* <QuickActions /> */}
		</div>
	);
};

export default memo(NotesPage);
