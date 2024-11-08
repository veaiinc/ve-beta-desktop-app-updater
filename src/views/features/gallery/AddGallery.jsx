import React, { useState, useEffect, useContext, useCallback } from 'react';
import '../../../assets/scss/gallery/index.scss';
import Search from '../../../assets/svg/seach-magnifier.svg';
import { useNavigate } from 'react-router-dom';
import testImage from '../../../assets/svg/gallery/testing.png';
import CreateGallery from '../../components/modalsV2/gallery/CreateGallery';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from 'react-loading-skeleton';
import { Result } from 'antd';
const noImage =
	'https://png.pngtree.com/png-clipart/20230917/original/pngtree-no-image-available-icon-flatvector-illustration-thumbnail-graphic-illustration-vector-png-image_12323920.png';

const LoadingSkeleton = () => {
	return [...Array(10)].map((_, index) => (
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
	));
};

const NoGallerySkeleton = () => {
	return (
		<div className="noAlbumContainer">
			<Result
				status="404"
				title="Galleries Not Found"
				subTitle="It's quiet for now... You haven't missed anything yet! Create your first gallery to start organizing your memories"
				// extra={
				// 	<button
				// 		className="create-album-button"
				// 		onClick={() =>
				// 			setInfo((prevData) => ({
				// 				...prevData,
				// 				showCreateAlbum: true,
				// 			}))
				// 		}
				// 	>
				// 		<p>Create </p>
				// 	</button>
				// }
			/>
		</div>
	);
};

const AddGallery = () => {
	const {
		galleryInfo: { getGalleries, tenantGalleries, getGalleryCredentials, galleryCredentials },
	} = useContext(Context);
	const [info, setInfo] = useState({
		createNewGalleryModal: false,
		galleries: [],
		search: '',
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
				options.limit = info.limit + 1;
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
	};

	const fetchMoreGalleries = () => {
		const nextPage = info.page + 1;
		info.search === '' ? fetchGalleries(nextPage) : fetchGalleries(nextPage, info.search);

		setInfo((prev) => ({
			...prev,
			page: nextPage,
		}));
	};

	const handleDebounceSearch = useCallback(
		(page = 1, search = null, reset = false) => {
			clearInterval(info?.timeout);
			const timeout = setTimeout(() => {
				fetchGalleries(page, search, reset);
			}, 800);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.timeout],
	);

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e.target.value, page: 1 }));

		if (e.target.value === '' || e.target.value === null) {
			// handleDebounceSearch(1, null, true);
			clearInterval(info?.timeout);
			fetchGalleries(1, null, true);
		} else {
			handleDebounceSearch(1, e.target.value, true);
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
							loader={
								<div style={{ textAlign: 'center', color: '#fff' }}>Loading...</div>
							}
							scrollableTarget="galleryListScrollTarget"
							style={{
								display: 'flex',
								flexWrap: 'wrap',
								gap: '16px',
								width: '100%',
								// border: '1px solid red',
							}}
						>
							{info?.search === '' && (
								<div className="add-gallery" onClick={handleCreateNewGallery}>
									+ Create a Gallery
								</div>
							)}

							{tenantGalleries ? (
								tenantGalleries?.galleries?.length > 0 ? (
									tenantGalleries?.galleries.map((items, index) => (
										<div
											className="add-gallery-image"
											onClick={() => handleNavigateGallery(items._id)}
											key={items._id}
										>
											{items?.coverImage?.thumbnailUrl ? (
												<img
													src={items?.coverImage?.thumbnailUrl}
													// onError={(e) => {
													// 	e.target.src = testImage;
													// }}
													alt={items?.title}
												/>
											) : (
												<div className="no-image"></div>
											)}
											<div
												className="album-side-options"
												onClick={(e) => e.stopPropagation()}
											>
												<li
													onClick={() => handleNavigateGallery(items._id)}
												>
													View
												</li>
												{/* <li>Client view</li>
												<li>Share</li> */}
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
														items.albumsCount ? items.albumsCount : 0
													} ${
														items.albumsCount > 1 ? 'Albums' : 'Album'
													}`}</p>
													{/* <p className="dot"></p>
													<p className="album-count">{`${
														items.photoCount ? items.photoCount : '0'
													} Photos`}</p> */}
												</div>
												<p className="album-title">{items.title}</p>
											</div>
										</div>
									))
								) : (
									<NoGallerySkeleton />
								)
							) : (
								<LoadingSkeleton />
							)}
						</InfiniteScroll>
					</div>
				</div>
			</div>
			<div>
				<CreateGallery
					open={info.createNewGalleryModal}
					closeModal={handleCloseModal}
					fetchGalleries={fetchGalleries}
				/>
			</div>
		</div>
	);
};

export default AddGallery;
