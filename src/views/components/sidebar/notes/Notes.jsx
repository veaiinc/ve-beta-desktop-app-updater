import { Drawer, Tooltip } from 'antd';
import React, { useContext, useEffect, useState, useCallback, memo } from 'react';
import '../../../../assets/scss/notes/sidebarNotes.scss';
import { ReactComponent as Back } from '../../../../assets/svg/sidebar/notes/back.svg';
import { ReactComponent as Search } from '../../../../assets/svg/sidebar/notes/search.svg';
import { ReactComponent as Filter } from '../../../../assets/svg/sidebar/notes/filter.svg';
import { ReactComponent as Menu } from '../../../../assets/svg/sidebar/notes/menu.svg';
import { ReactComponent as NoteIcon } from '../../../../assets/svg/sidebar/notes/note.svg';
import { ReactComponent as PlusIcon } from '../../../../assets/svg/sidebar/notes/Plus.svg';
import LoaderModal from '../../modalsV2/automationBuilder/AutomationLoaderModal';
import Context from '../../../../context/context';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Check } from '../../../../assets/svg/tasks/checkmark.svg';
const initialState = {
	loading: true,
	notesData: [],
	currentPage: 1,
	hasNextPage: false,
	creatingNoteLoader: false,
	pageType: 'all',
	menuDropdownOpen: false,
	dropDownType: '',
};

const ctaMapper = [
	{
		id: 1,
		icon: <Back />,
		action: 'back',
	},
	{
		id: 2,
		icon: <Search />,
		action: 'search',
	},
	{
		id: 3,
		icon: <Filter />,
		action: 'filter',
	},
	{
		id: 5,
		icon: <PlusIcon />,
		action: 'plus',
	},
];

const filterOptions = [
	{
		id: 'all',
		label: 'All',
	},
	{
		id: 'favorite',
		label: 'Favorite',
	},
	{
		id: 'private',
		label: 'Private',
	},
	{
		id: 'shared',
		label: 'Shared',
	},
];

const infiniteScrollHeight = 'calc(100vh - 72px)';

const Notes = ({ showNotesDrawer, setShowNotesDrawer }) => {
	let {
		notes: { getNotesList, notes, moreNotes, createNotesList },
	} = useContext(Context);

	const [info, setInfo] = useState({ ...initialState });

	const navigate = useNavigate();

	useEffect(() => {
		if (showNotesDrawer) {
			getNotesData(1);
		}
	}, [showNotesDrawer, info?.pageType]);

	useEffect(() => {
		if (notes) {
			handleNotesData(notes);
		}
	}, [notes]);

	useEffect(() => {
		if (moreNotes) {
			handleNotesData(moreNotes, true);
		}
	}, [moreNotes]);

	const handleInfoChange = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	const handleNotesData = useCallback(
		(incomingData, fetchMore = false) => {
			const { currentPage, data, hasNextPage } = incomingData;
			let notesData = data;
			if (fetchMore) {
				notesData = [...info?.notesData, ...data];
			}

			setInfo((prev) => ({
				...prev,
				loading: false,
				notesData: notesData,
				hasNextPage,
				currentPage,
			}));
		},
		[info],
	);

	const handleNotesClick = (notesId) => {
		handleCloseDrawer();
		navigate(`/note/${notesId}`);
	};

	const getNotesData = useCallback(
		(page, fetchMore = false) => {
			const payload = {
				input: {
					limit: 30,
					page: page,
					pageType: info?.pageType,
				},
			};

			getNotesList(payload, fetchMore);
		},
		[info?.hasNextPage, info?.loading, info?.pageType],
	);

	const fetchMoreNotes = useCallback(() => {
		if (info?.hasNextPage) {
			getNotesData(info?.currentPage + 1, true);
		}
	}, [info?.currentPage, info?.hasNextPage]);

	const formatTimestamp = (timestamp) => {
		return moment.unix(timestamp).fromNow();
	};

	const handleCloseDrawer = () => {
		setShowNotesDrawer(false);
		setInfo({ ...initialState });
	};

	const handleNewNotes = async () => {
		const payload = {
			input: {
				title: 'New Note',
			},
		};
		setInfo((prev) => ({ ...prev, creatingNoteLoader: true }));
		const response = await createNotesList(payload);
		setInfo((prev) => ({ ...prev, creatingNoteLoader: false }));
		handleCloseDrawer();
		navigate(`/note/${response[1]?._id}`);
	};

	const handleCtaClick = (action) => {
		const handleDropDown = (type) => {
			if (info?.dropDownType === type && info?.menuDropdownOpen) {
				setInfo((prev) => ({
					...prev,
					menuDropdownOpen: false,
					dropDownType: '',
				}));
			} else {
				setInfo((prev) => ({
					...prev,
					menuDropdownOpen: true,
					dropDownType: type,
				}));
			}
		};
		const actionMapper = {
			back: handleCloseDrawer,
			plus: handleNewNotes,
			filter: () => handleDropDown('filter'),
			search: () => null,
		};
		actionMapper[action]();
	};

	const drawerWidth = showNotesDrawer ? 346 : 0;

	return (
		<Drawer
			title={null}
			open={showNotesDrawer}
			onClose={handleCloseDrawer}
			placement="left"
			width={drawerWidth}
			rootClassName="sidebar-notifications-drawer"
			closeIcon={null}
		>
			<div className="notifications-drawer-container">
				<div className="header">
					<h1 className="title">Notes</h1>
					<Tooltip
						title={
							<MenuItemDropDown
								title={'Filter'}
								type={info?.dropDownType}
								selected={info?.pageType}
								onChange={handleInfoChange}
							/>
						}
						trigger={'click'}
						arrow={false}
						color="transparent"
						placement="bottomRight"
						style={{ body: { minWidth: 'fit-content' } }}
						open={info?.menuDropdownOpen}
						onOpenChange={(open) => {
							if (!open) {
								setInfo((prev) => ({
									...prev,
									dropDownType: '',
									menuDropdownOpen: false,
								}));
							}
						}}
					>
						<div className="cta-container">
							{ctaMapper?.map((cta) => (
								<div
									onClick={(e) => {
										e.stopPropagation();
										handleCtaClick(cta?.action);
									}}
									key={cta?.id}
								>
									{cta?.icon}
								</div>
							))}
						</div>
					</Tooltip>
				</div>
				<div className="body">
					{info?.loading ? (
						<div className="loading-state">
							<p className="message">Loading notes...</p>
						</div>
					) : info?.notesData?.length === 0 ? (
						<div className="empty-state">
							<p className="¸¸ˀ">No notes yet!</p>
						</div>
					) : (
						<InfiniteScroll
							dataLength={info?.notesData?.length || 0}
							next={fetchMoreNotes}
							hasMore={info?.hasNextPage}
							loader={<FetchMoreLoaderComp wrapperStyle={{ width: '100%' }} />}
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								gap: '8px',
								flex: '1 0 0',
								alignSelf: 'stretch',
							}}
							height={infiniteScrollHeight}
						>
							{info?.notesData?.map((notes) => (
								<div
									key={notes?._id}
									className="notes-list"
									onClick={() => {
										handleNotesClick(notes?._id);
									}}
								>
									<div className="notes-list-content">
										<NoteIcon className="notes-icon" />
										{notes?.title || ''}
									</div>
									<p className="time">
										{notes?.updatedAt ? formatTimestamp(notes?.updatedAt) : ''}
									</p>
								</div>
							))}
						</InfiniteScroll>
					)}
				</div>
			</div>
			<LoaderModal loading={info?.creatingNoteLoader} message="Creating note..." />
		</Drawer>
	);
};

export default memo(Notes);

const MenuItemDropDown = memo(({ type, selected, onChange }) => {
	return (
		<div className="notes-sidebar-menu-item-dropdown">
			<div className="notes-sidebar-menu-item-dropdown-title">
				{type === 'filter' ? 'Filter' : 'Search'}
			</div>
			<div className="notes-sidebar-menu-item-dropdown-body">
				{filterOptions?.map((option) => (
					<div
						className="notes-sidebar-menu-item-dropdown-body-item"
						key={option?.id}
						onClick={() => {
							onChange({
								pageType: option?.id,
								notesData: [],
								currentPage: 1,
								menuDropdownOpen: false,
								dropDownType: '',
								loading: true,
							});
						}}
					>
						<p>{option?.label}</p>
						{selected === option?.id && <Check />}
					</div>
				))}
			</div>
		</div>
	);
});
