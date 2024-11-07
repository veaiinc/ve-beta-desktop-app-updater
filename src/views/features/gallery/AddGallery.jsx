import React, { useState, useEffect, useContext, useCallback } from 'react';
import '../../../assets/scss/gallery/index.scss';
import Search from '../../../assets/svg/seach-magnifier.svg';
import { useNavigate } from 'react-router-dom';
import testImage from '../../../assets/svg/gallery/testing.png';
import CreateGallery from '../../components/modalsV2/gallery/CreateGallery';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from 'react-loading-skeleton';

const noImage =
	'https://png.pngtree.com/png-clipart/20230917/original/pngtree-no-image-available-icon-flatvector-illustration-thumbnail-graphic-illustration-vector-png-image_12323920.png';

const AddGallery = () => {
	const {
		galleryInfo: { getGalleries, tenantGalleries, getGalleryCredentials, galleryCredentials },
	} = useContext(Context);
	const [info, setInfo] = useState({
		createNewGalleryModal: false,
		galleries: [],
		search: '',
		loading: true,
		error: null,
		sort: '-createdAt',
		page: 1,
		limit: 15,
		timeout: null,
	});
	const navigate = useNavigate();
	useEffect(() => {
		if (!tenantGalleries) {
			fetchGalleries(info.page);
		}
	}, []);

	const fetchGalleries = async (page, title = null, reset = false) => {
		try {
			const options = {
				sort: info.sort,
				page,
				limit: info.limit,
			};
			if (title) {
				options.title = title;
			}
			getGalleries(options, reset);
		} catch (err) {
			setInfo((prevState) => ({
				...prevState,
				error: err.message || 'Failed to fetch galleries',
			}));
		}
	};

	const handleNavigateGallery = (galleryId) => {
		const selectedGallery = tenantGalleries?.galleries.find(
			(gallery) => gallery._id === galleryId,
		);
		getGalleryCredentials(galleryId);
		navigate(`/gallery-page/${galleryId}`, { state: { galleryData: selectedGallery } });
	};

	const handleNavigateSettings = (galleryId) => {
		const selectedGallery = tenantGalleries?.galleries.find(
			(gallery) => gallery._id === galleryId,
		);
		getGalleryCredentials(galleryId);
		navigate(`/gallery-page/${galleryId}`, {
			state: { galleryData: selectedGallery, openSettings: 'Settings' },
		});
	};

	const handleCreateNewGallery = () => {
		setInfo({
			...info,
			createNewGalleryModal: true,
		});
	};
	const handleCloseModal = () => {
		setInfo({
			...info,
			createNewGalleryModal: false,
		});
		fetchGalleries(1);
	};

	const fetchMoreGalleries = () => {
		const nextPage = info.page + 1;
		fetchGalleries(nextPage);
		setInfo((prev) => ({
			...prev,
			page: nextPage,
		}));
	};

	const handleDebounceSearch = useCallback(
		(search) => {
			clearInterval(info?.timeout);
			const timeout = setTimeout(() => {
				fetchGalleries(1, search, true);
			}, 800);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.timeout],
	);

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e.target.value }));
		if (e.target.value === '' || e.target.value === null) {
			fetchGalleries(1);
		} else {
			handleDebounceSearch(e.target.value);
		}
	};

	return (
		<div className="gallery-main-container">
			<div className="seachbar-container">
				<div className="gallery-filter">
					<img src={Search} alt="searchh" />
					<input
						type="text"
						placeholder="Search by title"
						value={info?.search}
						onChange={handleSearch}
					/>
				</div>
				<div className="create-btn" onClick={handleCreateNewGallery}>
					Create +
				</div>
			</div>
			<div className="add-gallery-container">
				<div className="add-gallery-header">
					<p></p>

					<div className="all-gallery" id="galleryListScrollTarget">
						<InfiniteScroll
							dataLength={tenantGalleries?.galleries?.length || 0}
							next={fetchMoreGalleries}
							hasMore={tenantGalleries?.hasNextPage || false}
							// loader={[...Array(10)].map((_, index) => (
							// 	<Skeleton key={index} height={100} />
							// ))}
							scrollableTarget="galleryListScrollTarget"
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								gap: '16px',
							}}
						>
							<div className="add-gallery" onClick={handleCreateNewGallery}>
								+ Create a Gallery
							</div>
							{tenantGalleries
								? tenantGalleries?.galleries.map((items, index) => (
										<div
											className="add-gallery-image"
											onClick={() => handleNavigateGallery(items._id)}
											key={items._id}
										>
											<img
												src={items?.coverImage?.thumbnailUrl || testImage}
												onError={(e) => {
													e.target.src = testImage;
												}}
												alt={items?.title}
											/>
											<div
												className="album-side-options"
												onClick={(e) => e.stopPropagation()}
											>
												<li
													onClick={() => handleNavigateGallery(items._id)}
												>
													View
												</li>
												<li>Client view</li>
												<li>Share</li>
												<li
													onClick={() =>
														handleNavigateSettings(items._id)
													}
												>
													settings
												</li>
											</div>
											<div className="album-full-details">
												<div className="album-details">
													<p className="album-count">{`${
														items.album_count ? items.album_count : '0'
													} Albums`}</p>
													<p className="dot"></p>
													<p className="album-count">{`${
														items.photoCount ? items.photoCount : '0'
													} Photos`}</p>
												</div>
												<p className="album-title">{items.title}</p>
											</div>
										</div>
								  ))
								: [...Array(10)].map((_, index) => (
										<div className="add-gallery-image" key={index}>
											<Skeleton width="280px" height="196px" />
											<div className="album-full-details">
												<div className="album-details">
													<p className="album-count">
														<Skeleton width="55px" height="14px" />
													</p>
													<p className="dot"></p>
													<p className="album-count">
														<Skeleton width="55px" height="14px" />
													</p>
												</div>
												<p className="album-title">
													<Skeleton width="100%" height="26px" />
												</p>
											</div>
										</div>
								  ))}
						</InfiniteScroll>
					</div>
				</div>
			</div>
			<div>
				<CreateGallery open={info.createNewGalleryModal} closeModal={handleCloseModal} />
			</div>
		</div>
	);
};

export default AddGallery;
