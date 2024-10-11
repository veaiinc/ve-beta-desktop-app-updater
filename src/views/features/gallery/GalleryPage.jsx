import React, { useState, useEffect, useRef } from 'react';
import share from '../../../assets/svg/gallery/share.svg';
import sixDots from '../../../assets/svg/gallery/sixdots.svg';
import threeDots from '../../../assets/svg/gallery/threeDots.svg';
import { ReactComponent as SearchIcon } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as FilterIcon } from '../../../assets/svg/chat/filter.svg';
import { ReactComponent as ExpandIcon } from '../../../assets/svg/gallery/expand.svg';
import { ReactComponent as ForwardIcon } from '../../../assets/svg/gallery/forward.svg';
import { ReactComponent as PinIcon } from '../../../assets/svg/gallery/pin.svg';
import { ReactComponent as OptionsIcon } from '../../../assets/svg/gallery/dotsThree.svg';
import { ReactComponent as GridStyleVertical } from '../../../assets/svg/gallery/gridStyleVertical.svg';
import { ReactComponent as ThumbnailV } from '../../../assets/svg/gallery/thumbnailV.svg';
import { ReactComponent as GridStyleHorizontal } from '../../../assets/svg/gallery/gridStyleH.svg';
import { ReactComponent as ThumbnailH } from '../../../assets/svg/gallery/thumbnailH.svg';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ReactComponent as UpArrow } from '../../../assets/svg/workflow/downArrow.svg';
import ToggleSlider from '../../../views/components/input/slider';
import AlbumSettings from './AlbumSettings';
import ShareModal from '../../../views/components/modalsV2/gallery/ShareModal';
import { useNavigate } from 'react-router-dom';

const imageURL =
	'https://d1dcrj0f0bqbp5.cloudfront.net/bhogesh/6639fae6efe501000817b87e/thumbnails-300w/6639fbe5dd579c0007adbfa8_1715076069253.JPG?Key-Pair-Id=APKAIK2HFU7T3M5YKO2Q&Signature=TqcvPUOwydpP0QnsCpCUS7EKP6rz48Xmn9ohTVNqmZM6uoA22ZXkxuLDF7QY25LKbQEJyMubyehKFHCoremiLibX-IjZnKdDwddk1iFCKhqblMoOqQvMJxpASj~UpX7-~MxDUOMEGokzUtuVda~yaE4zXmsSBocd0ZXUj9dv~OMYOPpuDvGexuu0UbCDF6SSo-3Hg~U5YMYixUr8PksRv6ZsXj2ICtq23uHCVO72r~rB8nmPm-VBV0ZvYodAgijhYp5ant4Z5fO9QIqfAZV7I4Qc-GuFqmbUTCdeyrnQtAcIIOR8dDvr~ZWsWrlkJn8N8sMHT3YHBsGyNBvECJbWZw__&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMWRjcmowZjBicWJwNS5jbG91ZGZyb250Lm5ldC9iaG9nZXNoLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3Mjg1NzMzNTV9fX1dfQ__';
const image1 =
	'https://d1dcrj0f0bqbp5.cloudfront.net/bhogesh/6639fae6efe501000817b87e/thumbnails-300w/6639fd4d94f73f00082452bf_1715076429960.JPG?Key-Pair-Id=APKAIK2HFU7T3M5YKO2Q&Signature=fVQ7cmNBWOmEFhdcvk2Db5eutPWyrBbCHjs0Fi67aBf-LqSUfYMhWA4hJXlbzX0zlspN7UU4DevE6S16vBacl5EES2sPOPZYfNNbR3yK0blrwz7qBwzOxTYEM2hrfS5CEKXJvDE5-885fGebhShk4Vr8I4vhaWw0P~T5w1Bg~1Kwhx8Q9fWOCSlGuw89u9iwxkouTMzvrjpab~2mbdA7v0lOMWVO-90SsuqsC3MzHHuJHsebXACFF6W3sVeLju7AV-l7a5Ha-rPBZ7psAWrg4fYip2Qjo30qG4y8NL9gdnQeM7RRSyWLMdZlBH-tqNYGg5TuXhrlHko5PDpD4gU5Kw__&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMWRjcmowZjBicWJwNS5jbG91ZGZyb250Lm5ldC9iaG9nZXNoLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3Mjg2MTI3MjR9fX1dfQ__';
const image2 =
	'https://d1dcrj0f0bqbp5.cloudfront.net/bhogesh/6639fae6efe501000817b87e/thumbnails-300w/6639fc3ecb086800084dd15c_1715076158872.JPG?Key-Pair-Id=APKAIK2HFU7T3M5YKO2Q&Signature=BpQUQg3rdZbSKftPmUM6ccPMmZ~d7qsIgVsmtSmGkzyUH4shlCudNDbSNVoYi8rvnct0-yotEWhWwA5Y4dtbIPzsZMDpvG2Qy0eW9Kl-V7oYb47O-Hlm5RmKkGVD-X9AasJlx7PtoHhA8g00NG20wJVDyOK2tiUwMf~-WtOJkuOrdvWwjDkUzBXlvDmby2RGjqWBWdDpSa4uPuPxmfP6AdFIPS~BYfK4kLwmzmg4sW~3R5-3QztzcmYgjcDsaLccEXljClr2zWTmEGr~ES96N40OMvh6X43-u1maBDs6Vq77eOQ5f0SYkWTKwDgxlfDxB1dR-tMyODm583Y-bmLkjQ__&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMWRjcmowZjBicWJwNS5jbG91ZGZyb250Lm5ldC9iaG9nZXNoLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3Mjg2MTE4NDR9fX1dfQ__';
const image3 =
	'https://d1dcrj0f0bqbp5.cloudfront.net/bhogesh/6639fae6efe501000817b87e/thumbnails-300w/6639fbfad8dc510008b4b9bf_1715076090981.JPG?Key-Pair-Id=APKAIK2HFU7T3M5YKO2Q&Signature=D01icL5-IcJpUpYMPpXWMlH9B-2l6M7O75XtQ~Dsfc4d6RyELqeMpQQ8glwfwF4V5qeR3eE7W0qvmnWZImJZfwZKgSOsjBzkeZIx5MwJziAca8xBZO10BrhebhsrWMhQv9sVi8e2MUZC0lC5Y1HlQg3EOHE~gfHrqtDl9j3pHjuVzZchrIuYgBjU3kkrE1Dk8JkLOPc-gErdbKEkWGoMiKaW-mT714ZnEbw-HxyYHSFcOVslfNIvvzQMV8rCko1q8zIxgE0-unsrryPoEPKfdeL84GTjN-u52Aymtz1KOY6uBLOCbUwzTlrznwKzkgT1LroLOVv7al-ohS86Ebl~dA__&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMWRjcmowZjBicWJwNS5jbG91ZGZyb250Lm5ldC9iaG9nZXNoLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3Mjg2MTE4MTh9fX1dfQ__';
const image4 =
	'https://d1dcrj0f0bqbp5.cloudfront.net/bhogesh/6639fae6efe501000817b87e/optimized/6639fd05d8dc510008b4be15_1715076357942.JPG?Key-Pair-Id=APKAIK2HFU7T3M5YKO2Q&Signature=anu4Unzc1pYM2BryxliuCRvTP8U50HhuxPvT2uC2ViAnHl6sAL5fhq7ABj8~fngjUVVE5J50MXrT7IItCpECnGPiuDC2mFTwNFrqqkG4m69pWvNU4i-JH9aIioFF30Hm1dJF7BIiiN5ZzPMKaqRsj3caf7Fjvd~Z60oi4~is4AhFACiG59iaAF~Nii-dMNE2pSaiDHh836KirlxQ0lbqjwl3VIN05faGawiX8POS83JEEGxCYJVbvl07r5rDmu6bCBOJ8B-8LFD1kRf0AcbcaP7njDdNrNXPgq7OtV6WKqdhc~xHu5VjPVaIFVEqE6zjdq2muDE3IYPrR~vrnewUkA__&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9kMWRjcmowZjBicWJwNS5jbG91ZGZyb250Lm5ldC9iaG9nZXNoLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3Mjg2MTIwMTd9fX1dfQ__';
const data = [
	{ name: 'Albums', number: 14 },
	{ name: 'Videos', number: 2 },
	{ name: 'Slide Show', number: 1 },
	{ name: 'Client Selections', number: 6 },
	{ name: 'AI', number: '' },
];
const imageData = [
	{
		image: imageURL,
		name: 'Wedding Shoot',
		photos: 103,
	},
	{
		image: imageURL,
		name: 'Beach Party',
		photos: 87,
	},
	{
		image: imageURL,
		name: 'Corporate Event',
		photos: 152,
	},
	{
		image: imageURL,
		name: 'Family Reunion',
		photos: 94,
	},
	{
		image: imageURL,
		name: 'Graduation Ceremony',
		photos: 201,
	},
	{
		image: imageURL,
		name: 'Birthday Bash',
		photos: 76,
	},
	{
		image: imageURL,
		name: 'Fashion Show',
		photos: 183,
	},
	{
		image: imageURL,
		name: 'Music Festival',
		photos: 245,
	},
	{
		image: imageURL,
		name: 'Food Tasting',
		photos: 112,
	},
	{
		image: imageURL,
		name: 'Sports Tournament',
		photos: 167,
	},
	{
		image: imageURL,
		name: 'Art Exhibition',
		photos: 98,
	},
	{
		image: imageURL,
		name: 'Product Launch',
		photos: 134,
	},
	{
		image: imageURL,
		name: 'Charity Gala',
		photos: 89,
	},
];
const albumContains = [
	{ name: 'Portraits', number: 40 },
	{ name: 'Documents', number: 23 },
	{ name: 'Decor', number: 89 },
	{ name: 'All', number: 60 },
];
function createRandomImageArray() {
	const images = [image1, image2, image3, image4];
	const result = [];

	for (let i = 0; i < 40; i++) {
		const randomIndex = Math.floor(Math.random() * images.length);
		result.push(images[randomIndex]);
	}

	return result;
}

const randomizedImages = createRandomImageArray();

const GalleryPage = () => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		albumName: imageData[0].name,
		albumContains: albumContains[0].name,
		showOptions: false,
		showGalleryOptions: false,
		shareModal: false,
		showShearch: false,
		showFilter: false,
		selectedImages: [],

		activeLink: 'gallery-overview',
		showForward: false,
		showPin: false,
		showOptionsContainer: false,
		activeTab: 'Albums',
	});
	const optionsRef = useRef(null);
	const iconRef = useRef(null);
	const galleryOptionsRef = useRef(null);
	const galleryIconRef = useRef(null);
	const filtersRef = useRef(null);
	const filtersOptionsRef = useRef(null);
	const forwardOptionsRef = useRef(null);
	const forwardIconRef = useRef(null);
	const pinIconRef = useRef(null);
	const pinSearchRef = useRef(null);
	const optionsIconRef = useRef(null);
	const optionsContainerRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				optionsRef.current &&
				!optionsRef.current.contains(event.target) &&
				!iconRef.current.contains(event.target)
			) {
				setInfo((prevInfo) => ({ ...prevInfo, showOptions: false }));
			}
			if (
				galleryOptionsRef.current &&
				!galleryOptionsRef.current.contains(event.target) &&
				!galleryIconRef.current.contains(event.target)
			) {
				setInfo((prevInfo) => ({ ...prevInfo, showGalleryOptions: false }));
			}
			if (
				filtersOptionsRef.current &&
				!filtersOptionsRef.current.contains(event.target) &&
				!filtersRef.current.contains(event.target)
			) {
				setInfo((prevInfo) => ({ ...prevInfo, showFilter: false }));
			}
			if (
				forwardOptionsRef.current &&
				!forwardOptionsRef.current.contains(event.target) &&
				!forwardIconRef.current.contains(event.target)
			) {
				setInfo((prevInfo) => ({ ...prevInfo, showForward: false }));
			}
			if (
				pinSearchRef.current &&
				!pinSearchRef.current.contains(event.target) &&
				!pinIconRef.current.contains(event.target)
			) {
				setInfo((prevInfo) => ({ ...prevInfo, showPin: false }));
			}
			if (
				optionsContainerRef.current &&
				!optionsContainerRef.current.contains(event.target) &&
				!optionsIconRef.current.contains(event.target)
			) {
				setInfo((prevInfo) => ({ ...prevInfo, showOptionsContainer: false }));
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);
	const handleImageSelect = (index) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selectedImages: prevInfo.selectedImages.includes(index)
				? prevInfo.selectedImages.filter((i) => i !== index)
				: [...prevInfo.selectedImages, index],
		}));
	};

	const handleClickAlbum = (album, name) => {
		if (name === 'albumName') {
			setInfo((prevInfo) => ({ ...prevInfo, albumName: album }));
		} else if (name === 'containName') {
			setInfo((prevInfo) => ({ ...prevInfo, albumContains: album }));
		}
	};
	const handleAlbumSettings = (sectionId) => {
		navigate('/gallery/album-settings', { state: { sectionId } });
	};
	const openShareModal = () => {
		setInfo((prevInfo) => ({ ...prevInfo, shareModal: !prevInfo.shareModal }));
	};
	const handleClearSelectedImages = () => {
		setInfo((prevInfo) => ({ ...prevInfo, selectedImages: [] }));
	};
	const handleExpandClick = () => {
		const selectedImageIndexes = info.selectedImages;
		const selectedImages = selectedImageIndexes.map((index) => randomizedImages[index]);
		const activeIndex = selectedImageIndexes[0]; // Assuming the first selected image is the active one

		navigate('/gallery/gallery-viewer', {
			state: {
				images: randomizedImages,
				selectedImages: selectedImages,
				activeIndex: activeIndex,
			},
		});
	};
	const scrollToSection = (sectionId) => {
		setInfo((prevInfo) => ({ ...prevInfo, activeLink: sectionId }));
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};
	const handleForwardIcon = () => {
		setInfo((prevInfo) => ({ ...prevInfo, showForward: !prevInfo.showForward }));
	};
	const handlePinIcon = () => {
		setInfo((prevInfo) => ({ ...prevInfo, showPin: !prevInfo.showPin }));
	};
	const handleOptionsIcon = () => {
		setInfo((prevInfo) => ({
			...prevInfo,
			showOptionsContainer: !prevInfo.showOptionsContainer,
		}));
	};
	const handleClickContent = (name) => {
		setInfo((prevInfo) => ({ ...prevInfo, activeTab: name }));
	};
	return (
		<>
			<div className="galleryContainer">
				<div className="mainGalleryContainer">
					<div className="galleryPic">
						<div className="galleryPicSettings">
							<UpArrow />
							<p
								// onClick={() =>
								// 	setInfo((prevInfo) => ({
								// 		...prevInfo,
								// 		showSettings: !prevInfo.showSettings,
								// 	}))
								// }
								onClick={() => handleClickContent('Settings')}
								style={{ cursor: 'pointer' }}
							>
								Settings
							</p>
						</div>
						<img src={imageURL} />
					</div>
					<div className="albumsContianer">
						<div className="galleryContentContainer">
							<div className="content">
								{data.map((item, index) => (
									<div
										key={index}
										className={`galleryContent ${
											info.activeTab === item.name ? 'active' : ''
										}`}
										onClick={() => handleClickContent(item.name)}
									>
										<p className="galleryName">{item.name}</p>
										<p className="count">{item.number}</p>
									</div>
								))}
							</div>
							<div className="shareContainer">
								<div className="icon" onClick={openShareModal}>
									<img src={share} />
								</div>
								<div
									className="icon"
									ref={iconRef}
									onClick={() =>
										setInfo((prevInfo) => ({
											...prevInfo,
											showOptions: !prevInfo.showOptions,
										}))
									}
								>
									<img src={threeDots} />
									{info.showOptions && (
										<div
											className="optionsContainer"
											ref={optionsRef}
											onClick={(e) => e.stopPropagation()}
										>
											<li>Preview</li>
											<li>Copy link</li>
											<li>Share</li>
											<li>Unpublish</li>
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="albums">
							{imageData.map((album, index) => (
								<div
									key={index}
									className={`album ${
										info.albumName === album.name ? 'active' : ''
									}`}
								>
									<img src={album.image} />
									<div
										className="albumDetails"
										onClick={() => handleClickAlbum(album.name, 'albumName')}
									>
										<p>{album.name}</p>
										<p>{`${album.photos} photos`}</p>
									</div>
									<div
										className="overlay"
										onClick={() => handleClickAlbum(album.name, 'albumName')}
									></div>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="line"></div>
				{info.activeTab === 'Albums' && (
					<div className="galleryViewer">
						<div className="galleryNavbar">
							<div className="aboutAlbum">
								<div className="albumName">
									<p>{info.albumName}</p>
									<div
										style={{ position: 'relative' }}
										ref={galleryIconRef}
										onClick={() =>
											setInfo((prevInfo) => ({
												...prevInfo,
												showGalleryOptions: !prevInfo.showGalleryOptions,
											}))
										}
									>
										<img src={threeDots} />
										{info.showGalleryOptions && (
											<div
												className="galleryEditOptions"
												ref={galleryOptionsRef}
											>
												<li
													onClick={() =>
														handleAlbumSettings('album-overview')
													}
												>
													Album overview
												</li>
												<li
													onClick={() =>
														handleAlbumSettings('download-album')
													}
												>
													Download album
												</li>
												<li
													onClick={() =>
														handleAlbumSettings('lightroom-copy-list')
													}
												>
													Light Room Copy List
												</li>
												<li
													onClick={() =>
														handleAlbumSettings('album-cover')
													}
												>
													Album Cover
												</li>
												<li
													onClick={() =>
														handleAlbumSettings('delete-album')
													}
													style={{ color: '#A74A49' }}
												>
													Delete album
												</li>
											</div>
										)}
										<div></div>
									</div>
								</div>
								<div className="albumSearchCotainer">
									<p>Rearrange manually</p>
									<div
										onClick={() =>
											setInfo((prevInfo) => ({
												...prevInfo,
												showShearch: !prevInfo.showShearch,
											}))
										}
										className="iconsContainer"
									>
										<SearchIcon />
										{info.showShearch && (
											<input type="text" placeholder="Search" />
										)}
									</div>
									<div style={{ position: 'relative' }}>
										<div
											onClick={() =>
												setInfo((prevInfo) => ({
													...prevInfo,
													showFilter: !prevInfo.showFilter,
												}))
											}
											ref={filtersRef}
											className="iconsContainer"
										>
											<FilterIcon />
										</div>
										{info.showFilter && (
											<div
												ref={filtersOptionsRef}
												className="filterContianer"
											>
												<li>File name</li>
												<li>File name (reverse)</li>
												<li>Date Captured</li>
												<li>Date captured (reverse)</li>
												<li>upload time</li>
												<li>upload time (reverse)</li>
												<li>Random</li>
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="albumContains">
								{albumContains.map((contain, index) => (
									<div key={index} className="albumContain">
										<img src={sixDots} alt="sixDots" />
										<p
											className={
												info.albumContains === contain.name ? 'active' : ''
											}
											onClick={() =>
												handleClickAlbum(contain.name, 'containName')
											}
										>
											{contain.name}
										</p>
										<p className="count">{contain.number}</p>
									</div>
								))}
							</div>
							{/* <div className="galleryImagesContainer">
							<ResponsiveMasonry
								columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
							>
								<Masonry gutter="10px">
									{randomizedImages.map((image, index) => (
										<div className="imageContainer" key={index}>
											<img
												src={image}
												alt={`Gallery image ${index}`}
												style={{ width: '100%', display: 'block' }}
											/>
										</div>
									))}
								</Masonry>
							</ResponsiveMasonry>
						</div> */}

							<div className="galleryImagesContainer">
								<ResponsiveMasonry
									columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
								>
									<Masonry gutter="10px">
										{randomizedImages.map((image, index) => (
											<div
												key={index}
												className={`imageContainer ${
													info.selectedImages.includes(index)
														? 'selected'
														: ''
												}`}
												onClick={() => handleImageSelect(index)}
											>
												<img
													src={image}
													alt={`Gallery image ${index}`}
													style={{ width: '100%', display: 'block' }}
												/>
											</div>
										))}
									</Masonry>
								</ResponsiveMasonry>
								{info.selectedImages.length > 0 && (
									<div className="selectedImagesCotainer">
										<div className="selectedImagesCounter">
											<p
												onClick={() => handleClearSelectedImages()}
												style={{ cursor: 'pointer' }}
											>
												X
											</p>
											<p>{info.selectedImages.length} selected</p>
										</div>
										<div className="selectedImagesActions">
											<div onClick={handleExpandClick}>
												<ExpandIcon />
											</div>
											<div
												style={{ position: 'relative' }}
												ref={forwardIconRef}
											>
												<ForwardIcon onClick={handleForwardIcon} />

												{info.showForward && (
													<div
														className="forwardOptions"
														ref={forwardOptionsRef}
													>
														<li>Copy to client selection</li>
														<li>Move to Other Albums</li>
													</div>
												)}
											</div>
											<div style={{ position: 'relative' }} ref={pinIconRef}>
												<PinIcon onClick={handlePinIcon} />
												{info.showPin && (
													<div className="pinOptions" ref={pinSearchRef}>
														<div className="pinSearchContainer">
															<p>type to Search or create</p>
															<p
																style={{
																	cursor: 'pointer',
																	marginRight: '5px',
																}}
																onClick={handlePinIcon}
															>
																X
															</p>
														</div>
														<div className="pinOptionsList">
															<label className="checkboxLabel">
																<input type="checkbox" />
																<span className="checkboxText">
																	Portraits
																</span>
															</label>
															<label className="checkboxLabel">
																<input type="checkbox" />
																<span className="checkboxText">
																	Documentary
																</span>
															</label>
															<label className="checkboxLabel">
																<input type="checkbox" />
																<span className="checkboxText">
																	Decor
																</span>
															</label>
														</div>
													</div>
												)}
											</div>
											<div
												style={{ position: 'relative' }}
												ref={optionsIconRef}
											>
												<OptionsIcon onClick={handleOptionsIcon} />
												{info.showOptionsContainer && (
													<div
														className="optionsContainer"
														ref={optionsContainerRef}
													>
														<li>Download</li>
														<li>Set as cover</li>
														<li>Share</li>
														<li>Delete</li>
													</div>
												)}
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)}

				{info.activeTab === 'Settings' && (
					<div className="settingsMainContainer">
						<div className="settingsContianer">
							<div id="gallery-overview" className="settings-overview">
								<p className="heading">Gallery overview</p>
								<p className="subHeading">
									Gallery URL
									<span className="subTitle">- ankitttt.ve-s.../-my gallery</span>
								</p>
								<div className="renameGallery">
									<p className="subHeading">Rename Gallery </p>
									<p className="subTitle">
										Renaming affects the URL. Share the new link with clients
										each time.
									</p>
									<input placeholder="Hannef x Mahi" />
								</div>
								<div className="galleryDate">
									<p className="subHeading">Gallery Date </p>
									<p className="subTitle">
										Sort galleries by this date. Which is visible to the client
									</p>
									<div>
										<img />
										<input type="date" />
									</div>
								</div>
								<div className="callToAction">
									<p className="subHeading">Call to Action (CTA)</p>
									<div className="callToActionToggle">
										<ToggleSlider />
										<p className="subTitle">
											Enable to display CTA for the gallery.
										</p>
									</div>
									<input placeholder="https://Instagtagram/sam/9tbevccxggvcxg" />
								</div>
								<div className="clientSubscription">
									<p className="subHeading">Client Subscription</p>
									<div className="clientSubscriptionToggle">
										<ToggleSlider />
										<p className="subTitle">
											Allow clients to subscribe and take ownership after
											expiry.
										</p>
									</div>
								</div>
								<div className="collaborators">
									<div className="collaboratorsContainer">
										<div>
											<p className="subHeading">3 Collaborators</p>
											<p className="subTitle">
												Collaborators are your team members that you want to
												add to or remove from this gallery.
											</p>
										</div>
										<p className="subHeading manageButton">
											+ Manage Collaborators
										</p>
									</div>
									<div className="collaboratorsList">
										<div className="collaboratorsImage">image</div>
										<div className="collaboratorsImage">name</div>
										<div className="collaboratorsImage">email</div>
									</div>
								</div>
							</div>
							<div id="design" className="settings-overview">
								<div className="designaContainer">
									<p className="heading">Design</p>
									<div className="previewLayout">
										<p className="subTitle">Preview layout</p>
										<UpArrow />
									</div>
								</div>
								<div className="coverDesign">
									<p className="subHeading">Select gallery cover design</p>
									<div className="selectDesign">
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
										<div className="cover-images"></div>
									</div>
								</div>
								<div className="aiBackground">
									<p className="subHeading">AI Background</p>
									<div className="aiTogglebar">
										<ToggleSlider />
										<p className="subTitle">
											Automatically choose cover color based on photo
										</p>
									</div>
								</div>
								<div className="titleText">
									<p className="subHeading">Title text</p>
									<div className="textContainer">
										<input
											type="text"
											placeholder="FreightText Pro + Futura PT "
										/>
										<UpArrow />
									</div>
								</div>
								<div className="grid-style">
									<p className="subHeading">Grid Style</p>
									<div className="grid-types">
										<div className="box">
											<GridStyleVertical />
											<p className="subTitle">Vertical</p>
										</div>
										<div className="box">
											<GridStyleHorizontal />
											<p className="subTitle">Horizontal</p>
										</div>
									</div>
								</div>
								<div className="thumbnail-size">
									<p className="subHeading">Thumbnail Size</p>
									<div className="thumbnail-types">
										<div className="box">
											<ThumbnailV />
											<p className="subTitle">Vertical</p>
										</div>
										<div className="box">
											<ThumbnailH />
											<p className="subTitle">Horizontal</p>
										</div>
									</div>
								</div>
							</div>
							<div id="delete" className="settings-overview">
								<p className="heading">Delete Gallery </p>
								<p className="subTitle">
									You cannot undo this. All your albums and information will be
									lost.
								</p>
								<p className="deletePermanently">Delete permanently</p>
							</div>
						</div>
						<div className="settingsNavContianer">
							<li
								onClick={() => scrollToSection('gallery-overview')}
								className={info.activeLink === 'gallery-overview' ? 'active' : ''}
							>
								Gallery overview
							</li>
							<li
								onClick={() => scrollToSection('design')}
								className={info.activeLink === 'design' ? 'active' : ''}
							>
								Design
							</li>
							<li
								onClick={() => scrollToSection('delete')}
								className={info.activeLink === 'delete' ? 'active' : ''}
							>
								Delete
							</li>
						</div>
					</div>
				)}
			</div>

			<ShareModal open={info.shareModal} closeModal={openShareModal} />
		</>
	);
};

export default GalleryPage;
