import { memo, useState, useContext, useEffect, useRef } from 'react';
import '../../../assets/scss/notes/imageUploadPopup.scss';
import Context from '../../../context/context';
import { message } from '../globalComponents/CustomToast';
import { FetchMoreLoaderComp, isURL } from '../../../helpers';
import { ReactComponent as UploadIcon } from '../../../assets/svg/notes/upload.svg';
import { ReactComponent as LinkIcon } from '../../../assets/svg/notes/link.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/notes/search.svg';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';
import Skeleton from 'react-loading-skeleton';
import Spinner from '../loaders/Spinner';

const initialState = {
	selectedUploadCategory: 'upload',
	link: '',
	isLinkValid: false,
	workspaceImagesLoading: false,
	unsplashSearchQuery: 'fall',
	spinnerLoading: false,
	uploadLoading: false,
};

const page = 1;
const limit = 16;
const append = true;

const skeletonLoaders = Array.from({ length: 16 }, (_, index) => index + 1);

const uploadCategoryOptions = [
	{
		id: 1,
		label: 'Upload',
		value: 'upload',
	},
	{
		id: 2,
		label: 'Library',
		value: 'images',
	},
	{
		id: 3,
		label: 'Link',
		value: 'link',
	},
	{
		id: 4,
		label: 'Unsplash',
		value: 'unsplash',
	},
];

const ImageUploadPopup = ({ closePopup, onImageSelect, noteId }) => {
	const unsplashSearchTimeout = useRef(null);
	const {
		workspaceAssets: {
			workspaceImagesData,
			getWorkspaceImages,
			unsplashImagesData,
			getUnsplashImages,
		},
	} = useContext(Context);
	const [info, setInfo] = useState(initialState);

	const workspaceImagesList = workspaceImagesData?.data;
	const workspaceImagesLoading = workspaceImagesList ? false : true;
	const workspaceImagesLength = workspaceImagesList?.length ?? 0;
	const workspaceImagesEmpty = workspaceImagesLength === 0 && !workspaceImagesLoading;
	const workspaceImagesHasNextPage = Boolean(workspaceImagesData?.hasNextPage);
	const workspaceImagesCurrentPage = Number(workspaceImagesData?.currentPage) || 1;

	const unsplashImagesList = unsplashImagesData?.data;
	const unsplashImagesLoading = unsplashImagesList ? false : true;
	const unsplashImagesLength = unsplashImagesList?.length ?? 0;
	const unsplashImagesEmpty = unsplashImagesLength === 0 && !unsplashImagesLoading;
	const unsplashImagesHasNextPage = Boolean(unsplashImagesData?.hasNextPage);
	const unsplashImagesCurrentPage = Number(unsplashImagesData?.currentPage) || 1;
	const unsplashQuery = info?.unsplashSearchQuery;

	useEffect(() => {
		if (!workspaceImagesData && info?.selectedUploadCategory === 'images') {
			getWorkspaceImages(page, limit);
		}
		if (!unsplashImagesData && info?.selectedUploadCategory === 'unsplash') {
			const page = 1;
			const limit = 16;
			getUnsplashImages(unsplashQuery, page, limit);
		}
	}, [info?.selectedUploadCategory]);

	// Reset loading state when component unmounts
	useEffect(() => {
		return () => {
			if (info.uploadLoading) {
				setInfo((prev) => ({ ...prev, uploadLoading: false }));
			}
		};
	}, [info.uploadLoading]);

	const fetchNextWorkspaceImages = async () => {
		if (workspaceImagesHasNextPage) {
			const page = workspaceImagesCurrentPage + 1;
			getWorkspaceImages(page, limit, append);
		}
	};

	const fetchNextUnsplashImages = async () => {
		if (unsplashImagesHasNextPage) {
			const page = unsplashImagesCurrentPage + 1;
			getUnsplashImages(unsplashQuery, page, limit, append);
		}
	};

	const handleLinkSubmit = async () => {
		if (info.isLinkValid) {
			onImageSelect(info.link, null);
			closePopup();
		} else {
			message.error('Please enter a valid image URL');
		}
	};

	const handleLinkChange = (e) => {
		const link = e.target.value;
		setInfo((prev) => ({ ...prev, link, isLinkValid: isURL(link) }));
	};

	const handleImageUpload = async (e) => {
		const imageFile = e.target.files[0];
		if (imageFile) {
			setInfo((prev) => ({ ...prev, uploadLoading: true }));
			try {
				const imageUrl = URL.createObjectURL(imageFile);
				onImageSelect(imageUrl, imageFile);
				closePopup();
			} catch (error) {
				console.error('Error uploading image:', error);
				setInfo((prev) => ({ ...prev, uploadLoading: false }));
			}
		}
	};

	const handleImageClick = (imageUrl) => {
		onImageSelect(imageUrl, null);
		closePopup();
	};

	const handleUnsplashImageSearch = (e) => {
		const search = e.target.value;
		setInfo((prev) => ({
			...prev,
			unsplashSearchQuery: search,
			spinnerLoading: true,
		}));

		clearTimeout(unsplashSearchTimeout.current);

		unsplashSearchTimeout.current = setTimeout(() => {
			if (search.length > 2) {
				getUnsplashImages(search, page, limit);
			}
			setInfo((prev) => ({ ...prev, spinnerLoading: false }));
		}, 1500);
	};

	const uploadCategoryOptionsUI = {
		images: (
			<div className="images">
				{workspaceImagesLoading ? (
					<div className="workspaceImagesLoading">
						{skeletonLoaders?.map((skeletonId) => (
							<Skeleton
								key={skeletonId}
								width="125.5px"
								height="82px"
								borderRadius="8px"
							/>
						))}
					</div>
				) : workspaceImagesEmpty ? (
					<div className="noImagesFound">
						<h1 className="emptyImagesMessage">
							Oops! No images found in your workspace!
						</h1>
					</div>
				) : (
					<InfiniteScroll
						dataLength={workspaceImagesLength}
						next={fetchNextWorkspaceImages}
						hasMore={workspaceImagesHasNextPage}
						loader={<FetchMoreLoaderComp />}
						height={'364px'}
					>
						<div className="imagesListContainer">
							{workspaceImagesList?.map((image) => (
								<img
									key={image.id}
									className="imageItem"
									onClick={() => handleImageClick(image.imageUrl)}
									src={image.imageUrl}
									alt={image.givenFileName}
								/>
							))}
						</div>
					</InfiniteScroll>
				)}
			</div>
		),
		upload: (
			<div className="upload">
				{info.uploadLoading ? (
					<div className="uploadLoading">
						<Spinner width="24px" height="24px" />
						<div className="uploadContent">
							<div className="uploadTitle">Uploading image...</div>
							<div className="uploadSubtitle">
								Please wait while we process your image
							</div>
						</div>
					</div>
				) : (
					<>
						<input
							type="file"
							className="uploadInput"
							accept="image/*"
							onChange={handleImageUpload}
						/>
						<UploadIcon />
						<div className="uploadContent">
							<div className="uploadTitle">Click to upload</div>
							<div className="uploadSubtitle">
								supported formats .jpg, .jpeg, .png
							</div>
						</div>
					</>
				)}
			</div>
		),
		link: (
			<div className="link">
				<div className="linkInputContainer">
					<LinkIcon />
					<input
						autoFocus
						type="text"
						className="linkInput"
						placeholder="Paste your image link here"
						value={info.link}
						onChange={handleLinkChange}
					/>
				</div>
				<div className="linkSubmitButtonContainer">
					<button
						disabled={!info.isLinkValid}
						onClick={handleLinkSubmit}
						className={`linkSubmitButton ${!info.isLinkValid ? 'disabled' : ''}`}
					>
						Submit
					</button>
				</div>
			</div>
		),
		unsplash: (
			<div className="unsplash">
				{unsplashImagesLoading ? (
					<div className="unsplashImagesLoading">
						{skeletonLoaders?.map((skeletonId) => (
							<Skeleton
								key={skeletonId}
								width="125.5px"
								height="82px"
								borderRadius="8px"
							/>
						))}
					</div>
				) : (
					<div className="unsplashImagesContainer">
						<div className="imagesSearchContainer">
							<SearchIcon />
							<input
								className="imagesSearchInput"
								autoFocus
								type="text"
								onChange={handleUnsplashImageSearch}
								placeholder="Search unsplash images"
							/>
							{info?.spinnerLoading && <Spinner width="16px" height="16px" />}
						</div>
						{unsplashImagesEmpty ? (
							<div className="noUnsplashImagesFound">
								<h1 className="emptyUnsplashImagesMessage">
									Oops! No Unsplash images found!
								</h1>
							</div>
						) : (
							<InfiniteScroll
								dataLength={unsplashImagesLength}
								next={fetchNextUnsplashImages}
								hasMore={unsplashImagesHasNextPage}
								loader={<FetchMoreLoaderComp />}
								height={'364px'}
							>
								<div className="unsplashImagesListContainer">
									{unsplashImagesList?.map((image) => (
										<img
											key={image.id}
											className="unsplashImage"
											onClick={() => handleImageClick(image.uploadImageUrl)}
											src={image.previewImageUrl}
											alt={
												image.alt_description ||
												image.description ||
												'Unsplash Image'
											}
										/>
									))}
								</div>
							</InfiniteScroll>
						)}
					</div>
				)}
			</div>
		),
	};

	return (
		<div className="imageUploadPopupContainer">
			<header className="imageUploadPopupHeader">
				{uploadCategoryOptions.map((uploadCategory) => (
					<div
						key={uploadCategory.id}
						onClick={() =>
							setInfo((prev) => ({
								...prev,
								selectedUploadCategory: uploadCategory.value,
							}))
						}
						className={`uploadCategoryLabel ${
							info.selectedUploadCategory === uploadCategory.value ? 'active' : ''
						}`}
					>
						{uploadCategory.label}
					</div>
				))}
			</header>
			<div className="imageUploadPopupBody">
				{uploadCategoryOptionsUI[info.selectedUploadCategory]}
			</div>
		</div>
	);
};

export default memo(ImageUploadPopup);
