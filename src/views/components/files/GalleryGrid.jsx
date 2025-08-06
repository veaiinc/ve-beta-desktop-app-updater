import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import { ReactComponent as Add } from '../../../assets/svg/files/add2.svg';
import Spinner from '../../components/loaders/Spinner';
import { ReactComponent as Folder } from '../../../assets/svg/files/Folder.svg';
import { memo, useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import FilterDropdown from '../dropDown/file/FilterDropdown';
import gsap from 'gsap';
import EmptyState from './EmptyState';
import { Tooltip } from 'antd';
import { ReactComponent as Search } from '../../../assets/svg/search.svg';
import ListViewIcon from '../../../assets/svg/notesPage/ListViewIcon';
import CardsViewIcon from '../../../assets/svg/notesPage/CardsViewIcon';
import moment from 'moment';
import { ReactComponent as Gallery } from '../../../assets/svg/files/gallery.svg';

const filterOptions = [
	{ label: 'All', value: 'all' },
	{ label: 'Private', value: 'private' },
	{ label: 'Shared', value: 'shared' },
	{ label: 'Favorite', value: 'favorite' },
];

const sortOptions = [
	{ label: 'Recently Created', value: 'createdAt', sortType: -1 }, // descending
	{ label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
	{ label: 'A-Z', value: 'title', sortType: 1 }, // ascending
	{ label: 'Albums Count', value: 'albumsCount', sortType: -1 },
	{ label: 'Images Count', value: 'imagesCount', sortType: -1 },
];

const toolTipStyles = {
	display: 'inline-flex',
	padding: '10px',
	flexDirection: 'column',
	alignItems: 'flex-start',
	gap: '8px',
	borderRadius: '8px',
	border: '1px solid var(--stroke, #2c2d2e)',
	background: 'var(--popup, #202123)',
	boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.12)',
	color: 'var(--primary-font, #f2f2f3)',
	fontFamily: 'var(--primary-font-family)',
	fontSize: '11px',
	fontStyle: 'normal',
	fontWeight: '500',
	lineHeight: 'normal',
};
const GalleryGrid = ({
	handleCreateNewGallery,
	handleNavigateGallery,
	selectedOption,
	handleTotalChange,
	viewMode,
	setViewMode,
}) => {
	const navigate = useNavigate();
	const mountedRef = useRef(true);

	const {
		galleryInfo: { getGalleries, tenantGalleries, setDefaultSort },
	} = useContext(Context);

	const [info, setInfo] = useState({
		galleries: [],
		hasNextPage: false,
		currentPage: 1,
		loading: true,
		selectedSort: { label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
		searchQuery: '',
		searchLoading: false,
	});

	// Remove local viewMode state since it's now passed as prop

	const debounceTimeout = useRef();

	useEffect(() => {
		handleStateUpdate({ loading: true, currentPage: 1, hasNextPage: false });

		const options = {
			page: 1,
			limit: 20,
			storeOriginals: selectedOption === 'Gallery',
		};
		if (!tenantGalleries) {
			fetchGalleries(options);
		}
	}, []);

	useEffect(() => {
		if (!tenantGalleries) return;

		setInfo((prev) => {
			const {
				currentPage = 1,
				hasNextPage = false,
				galleries = [],
				totalDocs = 0,
				sort: serverSort = null,
			} = tenantGalleries;

			const newGalleries = currentPage === 1 ? galleries : [...prev.galleries, ...galleries];

			let parsedSort = prev.selectedSort;
			if (serverSort) {
				const isDescending = serverSort.startsWith('-');
				const field = isDescending ? serverSort.slice(1) : serverSort;

				const match = sortOptions.find((opt) => opt.value === field);
				if (match) {
					parsedSort = {
						label: match.label,
						value: match.value,
						sortType: isDescending ? -1 : 1,
					};
				}
			}

			return {
				...prev,
				galleries: newGalleries,
				currentPage,
				hasNextPage,
				loading: false,
				selectedSort: parsedSort,
			};
		});

		handleTotalChange(tenantGalleries.totalDocs || 0);
	}, [tenantGalleries]);

	useEffect(() => {
		// Skip animations when in list view
		if (viewMode === 'list') return;

		const delay =
			info.selectedView === 'Gallery' || info.selectedView === 'Lite Gallery' ? 100 : 0;

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
	}, [info?.galleries?.length, viewMode]);

	// Debounce search effect
	useEffect(() => {
		if (mountedRef.current) {
			mountedRef.current = false;
			return;
		}
		if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
		debounceTimeout.current = setTimeout(() => {
			handleStateUpdate({ loading: true, currentPage: 1, hasNextPage: false });
			const options = {
				page: 1,
				limit: 20,
				storeOriginals: selectedOption === 'Gallery',
				...(info?.searchQuery && { title: info?.searchQuery }),
			};
			fetchGalleries(options);
		}, 1000);
		return () => clearTimeout(debounceTimeout.current);
		// Only trigger when searchQuery or selectedOption changes
	}, [info.searchQuery, selectedOption]);

	const fetchGalleries = async ({ page = 1, limit = 20, storeOriginals }) => {
		try {
			await getGalleries(
				{
					page,
					limit,
					storeOriginals: storeOriginals || selectedOption === 'Gallery',
					...(info?.searchQuery && { title: info?.searchQuery }),
				},
				true,
			);
		} catch (err) {
			setInfo((prevState) => ({
				...prevState,
				error: err.message || 'Failed to fetch galleries',
				loading: false,
			}));
		}
	};

	const fetchMore = () => {
		if (!info?.hasNextPage) return;
		const options = {
			page: info?.currentPage + 1,
			limit: info.limit,
			storeOriginals: selectedOption === 'Gallery',
			...(info?.searchQuery && { title: info?.searchQuery }),
		};
		fetchGalleries(options);
	};

	const handleStateUpdate = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const handleSortClick = (value) => {
		let sortType = value?.sortType;

		if (value?.value === info?.selectedSort?.value) {
			sortType = info?.selectedSort?.sortType * -1;
		}

		setInfo((prev) => ({
			...prev,
			selectedSort: { ...value, sortType },
		}));

		const storeOriginals = selectedOption === 'Gallery';

		setDefaultSort({ sort: `${sortType === -1 ? '-' : ''}${value?.value}` }, storeOriginals);
	};

	return (
		<div className="card-sub-container-center">
			<div className="header-container">
				<div className="center-container-header">
					<FilterDropdown
						options={sortOptions}
						selected={info?.selectedSort}
						onOptionClick={handleSortClick}
						showSelectedEndArrow
						hideOnOptionClick={false}
						width="180px"
					/>
					<div className="filter-container-search">
						<Search width={16} height={16} />
						<input
							type="text"
							placeholder="Search"
							value={info.searchQuery}
							onChange={(e) => {
								setInfo({ ...info, searchQuery: e.target.value });
							}}
							className="search-input"
						/>
						{info.searchQuery.length > 0 && info.loading && (
							<div className="search-spinner">
								<Spinner
									size="small"
									width={16}
									height={16}
									borderWidth={1.5}
									color="var(--primary-button)"
								/>
							</div>
						)}
					</div>
				</div>
				<div className="view-mode">
					<div
						className={`view-mode-icon${viewMode === 'list' ? ' selected' : ''}`}
						onClick={() => setViewMode('list')}
					>
						<ListViewIcon />
					</div>
					<div
						className={`view-mode-icon${viewMode === 'card' ? ' selected' : ''}`}
						onClick={() => setViewMode('card')}
					>
						<CardsViewIcon />
					</div>
				</div>
			</div>
			<div className="center-container-content">
				{info?.loading ? (
					<div className="spinner-container">
						<Spinner />
					</div>
				) : info?.galleries?.length > 0 ? (
					<InfiniteScroll
						dataLength={info?.galleries?.length}
						next={fetchMore}
						hasMore={info?.hasNextPage}
						height={'100%'}
					>
						<div className={`card-container${viewMode === 'list' ? ' list-view' : ''}`}>
							{viewMode === 'list' && (
								<div className="card-item create">
									<div
										className="card-item__style card-item__style--btn gallery-list__create-row"
										onClick={handleCreateNewGallery}
									>
										<Gallery className="create-gallery-icon" />
										<div className="gallery-add-text">
											<span className="create-gallery-text">
												Create Gallery
											</span>
											<span className="create-gallery-subtext">
												Create a new gallery and organize your images and
												videos.
											</span>
										</div>
										<Add className="create-gallery-plus" />
									</div>
								</div>
							)}
							{viewMode === 'card' && (
								<div className="card-item create" onClick={handleCreateNewGallery}>
									<div className="card-item-style card-item-style-btn">
										<button className="card-btn">
											<Plus />
											Create Gallery
										</button>
									</div>
								</div>
							)}
							{info?.galleries?.map((item, index) => (
								<div
									className="card-item"
									key={index}
									onClick={() => handleNavigateGallery(item)}
								>
									<div
										className="card-item-style content-wrapper"
										data-title={item?.title || ''}
										style={{
											backgroundImage:
												viewMode === 'card' &&
												item?.coverImage?.thumbnailUrl
													? `url(${item.coverImage.thumbnailUrl})`
													: 'none',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											minHeight: viewMode === 'card' ? '120px' : 'auto',
											marginBottom: viewMode === 'card' ? '8px' : '0',
											backgroundSize: 'cover',
											backgroundPosition:
												viewMode === 'card'
													? `${item?.coverImage?.xPosition * 50 + 50}% ${
															50 - item?.coverImage?.yPosition * 50
													  }%`
													: 'center',
											position: 'relative',
											border: 'none',
										}}
									>
										{viewMode === 'card' && !item?.coverImage?.thumbnailUrl && (
											<div className="folder-icon-wrapper">
												<Folder />
											</div>
										)}
										{viewMode === 'card' && (
											<div className="gallery-card-overlay">
												<span className="gallery-overlay-title">
													{item?.title}
												</span>
												<div className="gallery-overlay-extra">
													<div className="gallery-overlay-info">
														<div className="info-item">
															<span className="info-count">
																{item?.albumsCount || 0}
															</span>
															<span className="info-label">
																Albums
															</span>
														</div>
														<div className="info-item">
															<span className="info-count">
																{item?.storageDetails.imagesCount ||
																	0}
															</span>
															<span className="info-label">
																Images
															</span>
														</div>
														<div className="info-item">
															<span className="info-count">
																{item?.embeddedVideosCount || 0}
															</span>
															<span className="info-label">
																Videos
															</span>
														</div>
													</div>
													<div className="gallery-overlay-created">
														<span className="created-date">
															{item?.createdAt
																? moment
																		.unix(item.createdAt)
																		.fromNow()
																: 'N/A'}
														</span>
													</div>
												</div>
											</div>
										)}
										{viewMode === 'list' && (
											<div className="gallery-list-content">
												<div className="gallery-list-image">
													{item?.coverImage?.thumbnailUrl ? (
														<img
															src={item.coverImage.thumbnailUrl}
															alt={item?.title}
															style={{
																width: '100%',
																height: '100%',
																objectFit: 'cover',
																borderRadius: '4px',
															}}
														/>
													) : (
														<Folder />
													)}
												</div>
												<div className="gallery-list-info">
													<div className="gallery-list-title">
														{item?.title}
													</div>
													<div className="gallery-list-created">
														{item?.createdAt
															? moment.unix(item.createdAt).fromNow()
															: 'N/A'}
													</div>
												</div>
												<div className="gallery-overlay-info">
													<div className="info-item">
														<span className="info-count">
															{item?.albumsCount || 0}
														</span>
														<span className="info-label">Albums</span>
													</div>
													<div className="info-item">
														<span className="info-count">
															{item?.storageDetails.imagesCount || 0}
														</span>
														<span className="info-label">Images</span>
													</div>
													<div className="info-item">
														<span className="info-count">
															{item?.embeddedVideosCount || 0}
														</span>
														<span className="info-label">Videos</span>
													</div>
												</div>
											</div>
										)}
									</div>
									<Tooltip
										title={item?.title || ''}
										placement="bottom"
										arrow={false}
										styles={toolTipStyles}
									>
										{/* <span className="gallery-item-title galleryTitleTooltip">
											{item?.title}
										</span> */}
									</Tooltip>
								</div>
							))}
						</div>
					</InfiniteScroll>
				) : (
					<div className="spinner-container">
						<EmptyState
							title={'Your gallery is empty'}
							subtitle={
								'Start by adding images, or videos to keep everything in one place.'
							}
							buttonOnClick={handleCreateNewGallery}
							buttonText={'Create Gallery'}
							showUpload={true}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(GalleryGrid);
