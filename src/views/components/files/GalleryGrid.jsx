import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import Plus from '../../../assets/svg/files/Plus.svg?react';
import Spinner from '../../components/loaders/Spinner';
import Folder from '../../../assets/svg/files/Folder.svg?react';
import { memo, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import FilterDropdown from '../dropDown/file/FilterDropdown';
import gsap from 'gsap';
import EmptyState from './EmptyState';
import { Tooltip } from 'antd';

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
}) => {
	const navigate = useNavigate();

	const {
		galleryInfo: { getGalleries, tenantGalleries, setDefaultSort },
	} = useContext(Context);

	const [info, setInfo] = useState({
		galleries: [],
		hasNextPage: false,
		currentPage: 1,
		loading: true,
		selectedSort: { label: 'Recently Updated', value: 'updatedAt', sortType: -1 },
	});

	useEffect(() => {
		handleStateUpdate({ loading: true, currentPage: 1, hasNextPage: false });

		const options = {
			page: 1,
			limit: 20,
			storeOriginals: selectedOption === 'Gallery',
		};
		fetchGalleries(options);
	}, [selectedOption]);

	useEffect(() => {
		if (tenantGalleries) {
			const {
				currentPage = 1,
				hasNextPage = false,
				galleries = [],
				totalDocs = 0,
			} = tenantGalleries || {};
			const newGalleries =
				currentPage === 1 ? [...galleries] : [...info?.galleries, ...(galleries || [])];

			handleStateUpdate({
				galleries: newGalleries,
				currentPage,
				hasNextPage,
				loading: false,
			});
			handleTotalChange(totalDocs);
		}
	}, [tenantGalleries]);
	useEffect(() => {
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
	}, [info?.galleries?.length]);

	const fetchGalleries = async ({ page = 1, limit = 20, storeOriginals }) => {
		try {
			getGalleries(
				{
					page,
					limit,
					storeOriginals: storeOriginals || selectedOption === 'Gallery',
				},
				true,
			);
		} catch (err) {
			setInfo((prevState) => ({
				...prevState,
				error: err.message || 'Failed to fetch galleries',
			}));
		}
	};

	const fetchMore = () => {
		if (!info?.hasNextPage) return;
		const options = {
			page: info?.currentPage + 1,
			limit: info.limit,
			storeOriginals: selectedOption === 'Gallery',
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

		setDefaultSort({ sort: `${sortType === -1 ? `-` : ''}${value?.value}` });
	};

	return (
		<div className="card-sub-container-center">
			<div className="center-container-header">
				{/* <FilterDropdown
					options={filterOptions}
					selected={info?.selectedFilter}
					onOptionClick={(value) => handleStateUpdate({ selectedFilter: value })}
					width="120px"
				/> */}
				<FilterDropdown
					options={sortOptions}
					selected={info?.selectedSort}
					onOptionClick={handleSortClick}
					showSelectedEndArrow
					hideOnOptionClick={false}
					width="180px"
				/>
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
						<div className={`card-container`}>
							<div className="card-item" onClick={handleCreateNewGallery}>
								<div className="card-item-style card-item-style-btn">
									<button className="card-btn">
										<Plus />
										Create Gallery
									</button>
								</div>
							</div>
							{info?.galleries?.map((item, index) => (
								<div
									className="card-item"
									key={index}
									onClick={() => handleNavigateGallery(item)}
								>
									<div
										className="card-item-style content-wrapper"
										style={{
											backgroundImage: item?.coverImage?.thumbnailUrl
												? `url(${item.coverImage.thumbnailUrl})`
												: 'none',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											minHeight: '120px',
											marginBottom: '8px',
											backgroundSize: 'cover',
											backgroundPosition: 'center',
										}}
									>
										{!item?.coverImage?.thumbnailUrl && (
											<div className="folder-icon-wrapper">
												<Folder />
											</div>
										)}
										{/* <span
								className={`live-badge ${
									item?.status === 'active' ? 'badge-active' : 'badge-draft'
								}`}
							>
								<span className="live-badge-dot"></span>
								<span className="live-badge-text">
									{item?.status === 'published' ? 'Live' : 'Draft'}
								</span>
							</span> */}
									</div>
									<Tooltip
										title={item?.title || ''}
										placement="bottom"
										arrow={false}
										overlayInnerStyle={toolTipStyles}
									>
										<span className="gallery-item-title galleryTitleTooltip">
											{item?.title}
										</span>
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
							buttonText={'Upload Gallery'}
							showUpload={true}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(GalleryGrid);
