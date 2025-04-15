import '../../../assets/scss/files/index.scss';
import '../../../assets/scss/files/files.scss';
import { ReactComponent as Plus } from '../../../assets/svg/files/Plus.svg';
import Spinner from '../../components/loaders/Spinner';
import { ReactComponent as Folder } from '../../../assets/svg/files/Folder.svg';
import { memo, useContext, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import InfiniteScroll from '../globalComponents/InfiniteScroll';
import gsap from 'gsap';
const GalleryGrid = ({ handleCreateNewGallery, handleNavigateGallery, selectedOption }) => {
	const navigate = useNavigate();

	const {
		galleryInfo: { getGalleries, tenantGalleries },
	} = useContext(Context);

	const [info, setInfo] = useState({
		galleries: [],
		hasNextPage: false,
		currentPage: 1,
		loading: true,
	});

	useEffect(() => {
		handleStateUpdate({ loading: true, currentPage: 1, hasNextPage: false });
		const options = {
			page: 1,
			limit: 20,
			storeOriginals: selectedOption === 'Classic Gallery',
		};
		fetchGalleries(1, null, true, options);
	}, [selectedOption]);

	useEffect(() => {
		if (tenantGalleries) {
			const { currentPage = 1, hasNextPage = false, galleries = [] } = tenantGalleries || {};
			const newGalleries =
				currentPage === 1 ? [...galleries] : [...info?.galleries, ...(galleries || [])];

			handleStateUpdate({
				galleries: newGalleries,
				currentPage,
				hasNextPage,
				loading: false,
			});
		}
	}, [tenantGalleries]);
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
	}, [info?.galleries?.length]);

	const fetchGalleries = async ({ page = 1, limit = 20, storeOriginals }) => {
		try {
			getGalleries(
				{
					page,
					limit,
					storeOriginals: storeOriginals || selectedOption === 'Classic Gallery',
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
			storeOriginals: selectedOption === 'Classic Gallery',
		};
		fetchGalleries(options);
	};

	const handleStateUpdate = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	return info?.loading ? (
		<div className="spinner-container">
			<Spinner />
		</div>
	) : (
		<InfiniteScroll
			dataLength={info?.docs?.length}
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
				{info?.galleries.map((item, index) => (
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
						<span className="gallery-item-title">{item?.title}</span>
					</div>
				))}
			</div>
		</InfiniteScroll>
	);
};

export default memo(GalleryGrid);
