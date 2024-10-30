import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import '../../../assets/scss/gallery/albumSettings.scss';
import ToggleSlider from '../../../views/components/input/slider';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ReactComponent as CopyLogo } from '../../../assets/svg/gallery/copy.svg';
import { ReactComponent as SaveLogo } from '../../../assets/svg/gallery/save.svg';
import { ReactComponent as GalleryLogo } from '../../../assets/svg/gallery/gallery.svg';
import { ReactComponent as DeleteLogo } from '../../../assets/svg/gallery/delete.svg';
import { ReactComponent as LaptopLogo } from '../../../assets/svg/gallery/laptop.svg';
import mobile from '../../../assets/svg/gallery/mobile.png';
import Context from '../../../context/context';
import { ReactComponent as DownArrow } from '../../../assets/svg/workflow/downArrow.svg';
import { message } from 'antd';
import Cropper from 'react-easy-crop';
import moment from 'moment';
import randomize from 'randomatic';
import axios from 'axios';

const AlbumSettings = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { sectionId, activeAlbumId } = location.state || {};
	const { galleryId } = useParams();
	const fileInputRef = useRef();
	const {
		galleryInfo: {
			editAlbum,
			editLockAlbum,
			tenantAlbums,
			getAlbums,
			checkSlugIsAvalible,
			getLightroomCopyList,
			lightroomCopyList,
			getGalleryTagsList,
			getImageDetail,
			imageDetail,
			getImageUploadStatus,
			getUploadImageSignUrl,
			galleryCredentials,
			getGalleryCredentials,
			updateAlbumCoverImage,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		activeSetting: 'album-overview,',
		activeAlbumName: '',
		activeAlbumId: activeAlbumId,
		isPublished: false,
		timeout: null,
		albumUpdateError: '',
		loading: false,
		isEnabled: false,
		coverPhoto: false,
		lightroomList: false,
		crop: {
			x: 0,
			y: 0,
		},
		zoom: 1,
		uploadImageId: null,
		imageURL: '',
		coverImageDetails: null,
		// activeAlbum: activeAlbum,
	});

	useEffect(() => {
		setInfo((prev) => ({ ...prev, activeSetting: sectionId }));
		scrollToSection(sectionId);
	}, [sectionId]);
	useEffect(() => {
		getLightroomCopyList(galleryId, activeAlbumId);
	}, [activeAlbumId]);

	useEffect(() => {
		if (!tenantAlbums) {
			getAlbums(galleryId);
		}
		if (tenantAlbums) {
			const activeAlbum = tenantAlbums?.albums?.find((album) => album?._id === activeAlbumId);
			setInfo((prev) => ({
				...prev,
				activeAlbumName: activeAlbum?.title,
				isPublished: activeAlbum?.isPublished,
				isEnabled: activeAlbum?.guestAccess?.isEnabled,
				coverImageDetails: activeAlbum?.coverImage,
			}));
		}
	}, [tenantAlbums]);

	useEffect(() => {
		if (
			(!galleryCredentials && info?.uploadImageId) ||
			(!galleryCredentials && info?.coverImageDetails?._id)
		) {
			getGalleryCredentials(galleryId);
		}

		if (imageDetail?._id === info?.uploadImageId && galleryCredentials) {
			const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
			const src = `${galleryCredentials?.baseURL}/${imageDetail?.image?.s3_optimized?.key}?${params}`;
			setInfo((prev) => ({
				...prev,
				imageURL: src,
			}));
		}

		if (info?.coverImageDetails?._id && galleryCredentials) {
			console.log(info?.coverImageDetails, 'coverImageDetails');
			const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
			const src = `${galleryCredentials?.baseURL}/${tenantAlbums?.tenant_id}/${galleryId}/optimized/${info?.coverImageDetails?.givenFileName}?${params}`;
			setInfo((prev) => ({
				...prev,
				imageURL: src,
				coverPhoto: true,
				crop: {
					x: info?.coverImageDetails?.xPosition,
					y: info?.coverImageDetails?.yPosition,
				},
			}));
		}
	}, [galleryCredentials, imageDetail, info?.uploadImageId, info?.coverImageDetails?._id]);

	const scrollToSection = (sectionId) => {
		setInfo((prev) => ({ ...prev, activeSetting: sectionId }));
		const section = document.getElementById(sectionId);
		if (section) {
			section.scrollIntoView({ behavior: 'smooth' });
		}
	};
	const handleGoBack = () => {
		navigate(`/gallery-page/${galleryId}`);
	};

	const handleHideAlbum = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			isPublished: !prev?.isPublished,
		}));
		const payload = {
			isPublished: !info?.isPublished,
		};

		editAlbum(payload, galleryId, info?.activeAlbumId);
	}, [info?.isPublished]);

	const handleAlbumChange = useCallback(
		(e) => {
			const value = e.target.value;
			setInfo((prev) => ({
				...prev,
				activeAlbumName: value,
			}));
			handleDebouceFunctionCall(albumChanges, value);
		},
		[info?.activeAlbumName],
	);

	const albumChanges = useCallback(async (value) => {
		const payload = {
			title: value,
		};

		const availability = await checkSlugIsAvalible(galleryId, payload?.title);
		if (availability?.[1]?.isAvailable) {
			const response = await editAlbum(payload, galleryId, activeAlbumId);
		}
	}, []);
	const handleDebouceFunctionCall = useCallback(
		(func, args) => {
			clearTimeout(info?.timeout);
			const timeout = setTimeout(() => {
				func(args);
				setInfo((prev) => ({
					...prev,
					loading: true,
				}));
			}, 800);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.timeout],
	);
	const handleIsEnable = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			isEnabled: !prev?.isEnabled,
		}));
		const payload = {
			isEnabled: !info?.isEnabled,
		};
		editLockAlbum(payload, galleryId, info?.activeAlbumId);
	}, [info?.isEnabled]);

	const handleCopyList = () => {
		if (lightroomCopyList?.length) {
			const textToCopy = lightroomCopyList.join(',');
			navigator.clipboard
				.writeText(textToCopy)
				.then(() => {
					message.success('Lightroom list copied successfully!');
				})
				.catch(() => {
					message.error('Failed to copy list');
				});
		} else {
			message.warning('No items to copy');
		}
	};

	const getImageDetails = async (imageId, batchId) => {
		const clearinterval = setInterval(async () => {
			const imageStatus = await getImageUploadStatus(galleryId, activeAlbumId, batchId);
			if (
				imageStatus?.[0] === true &&
				imageStatus?.[1]?.processedCount === 1 &&
				imageStatus?.[1]?.uploadedCount === 1
			) {
				clearInterval(clearinterval);
				getImageDetail(imageId);
				message.destroy();
			}
		}, 2000);
	};

	const uploadAlbumCoverChangeHandler = async (e) => {
		message.open({
			type: 'loading',
			content: 'Uploading album cover image..',
			duration: 0,
		});
		const image = e.target.files[0];
		const batchId = randomize('Aa0', 10);

		const responseGalleryTags = await getGalleryTagsList(galleryId);
		if (responseGalleryTags?.[0] === true) {
			const allTagId = responseGalleryTags?.[1]?.find((item) => item.displayName === 'All');
			let json = {
				originalFileName: image?.name,
				originalDateTime: moment(image?.['originalDate']).unix() || 0,
				uploadBatchId: batchId,
				tag_ids: [allTagId?._id],
				isAIFacesEnabled: true,
			};

			const signedURLUpload = await getUploadImageSignUrl(galleryId, activeAlbumId, json);
			if (signedURLUpload?.[0] === true) {
				const uploadResponse = await axios.put(signedURLUpload[1]['signedUrl'], image, {
					headers: {
						'Content-Type': image?.type,
					},
				});
				setInfo((prev) => ({
					...prev,
					uploadImageId: signedURLUpload?.[1]?._id,
				}));

				if (uploadResponse.status === 200) {
					getImageDetails(signedURLUpload?.[1]?._id, batchId);
				}
			} else {
				message.destroy();
				message.error('Something went wrong, please try again later');
			}
		} else {
			message.destroy();
			message.error('Something went wrong, please try again later');
		}
	};

	const handleSetCoverPosition = async () => {
		const json = {
			image_id: info?.uploadImageId || info?.coverImageDetails?._id,
			xPosition: info?.crop?.x,
			yPosition: info?.crop?.y,
			givenFileName:
				imageDetail?.image?.givenFileName || info?.coverImageDetails?.givenFileName,
			width: 100,
			height: 100,
			// zoom: info?.zoom,
		};
		const respone = await updateAlbumCoverImage(json, galleryId, info?.activeAlbumId);
		if (respone?.[0] === true) {
			message.success('Cover position set successfully!');
		} else {
			message.error('Something went wrong, please try again later');
		}
	};

	console.log(info.crop, 'notfound');

	return (
		<div className="mainAlbumSettings">
			<div className="exit-option-container">
				<p onClick={handleGoBack} style={{ cursor: 'pointer' }}>
					X
				</p>
				<p>More</p>
			</div>
			<div className="albumSettingsContainerMain">
				<div className="albumSettingsContainer">
					<div id="album-overview" className="settings-container">
						<div className="renameAlbum">
							<p className="title">Rename album</p>
							<p className="subtitle">
								When renaming a gallery, it affects the associated link or URL.
							</p>
							<div className="inputContainer">
								<input
									placeholder="Wedding"
									value={info?.activeAlbumName}
									onChange={handleAlbumChange}
								/>
							</div>
						</div>
						<div className="hideAlbum">
							<p className="title">Hide Album</p>
							<div className="hideOption">
								{/* onChange={toggleEnable} value={userDetails?.is2FAEnabled}  */}
								<ToggleSlider
									value={info?.isPublished}
									onChange={handleHideAlbum}
								/>
								<p className="subtitle">
									Your Album will be inaccessible in Links.{' '}
								</p>
							</div>
						</div>
						<div className="albumLink">
							<p className="title">Album link</p>
							<div className="inputContainer">
								<input placeholder="Wedding" />
								<CopyLogo className="copy-logo" />
							</div>
						</div>
						<div className="lockAlbum">
							<p className="title">Lock Album</p>
							<div className="lockOption">
								{/* onChange={toggleEnable} value={userDetails?.is2FAEnabled}  */}
								<ToggleSlider value={info?.isEnabled} onChange={handleIsEnable} />
								<p className="subtitle">
									Lock the album to make it inaccessible to the Guests, only
									client can access.{' '}
								</p>
							</div>
						</div>
					</div>
					<div id="download-album" className="settings-container">
						<p className="title">Download Album</p>
						<div className="save-settings">
							<div style={{ padding: '4px' }}>
								<SaveLogo />
							</div>
							<div className="select-labels">
								<p className="title">Select labels to download</p>
								<div className="labels-container">
									<p className="subtitle">
										All <span> X </span>
									</p>
									<p className="subtitle">
										Portraits <span> X </span>
									</p>
									<p className="subtitle">
										Documents <span> X </span>
									</p>
								</div>
							</div>
						</div>
						<div className="select-images">
							<div style={{ padding: '4px' }}>
								<GalleryLogo />
							</div>
							<div className="image-type">
								<p className="title">Select labels to download</p>
								<div className="image-type-container">
									<div className="image-type-container-item">
										<ToggleSlider /> <p>Original images</p>
									</div>
									<div className="image-type-container-item">
										<ToggleSlider /> <p>Webview images</p>
									</div>
								</div>
							</div>
						</div>
						<div className="download-button">
							<p>Download</p>
						</div>
					</div>
					<div id="lightroom-copy-list" className="settings-container">
						<div className="lightroom-container">
							<div>
								<p className="title">Light Room Copy List</p>
								<p className="subtitle">
									This list allows you to quickly find the favorite images in your
									Lightroom library. Copy the list of filenames below and paste it
									into the Lightroom Library search field
								</p>
							</div>
							<DownArrow
								className={`down-arrow ${info.lightroomList ? 'rotated' : ''}`}
								onClick={() =>
									setInfo((prev) => ({
										...prev,
										lightroomList: !prev.lightroomList,
									}))
								}
							/>
						</div>
						{info?.lightroomList && (
							<div className="lightroom-list-container">
								{lightroomCopyList?.map((item, index) => (
									<p key={index}>
										{item}
										{index !== lightroomCopyList.length - 1 ? ',' : ''}
									</p>
								))}
							</div>
						)}
						<div className="copy-button" onClick={handleCopyList}>
							<div className="button">
								<div className="copy-logo">
									<CopyLogo />
								</div>
								<p>Copy List</p>
							</div>
						</div>
					</div>
					<div id="album-cover" className="settings-container">
						<p className="title">Album Cover</p>
						{info?.coverPhoto && (
							<div className="album-cover-container">
								<div className="album-preview">
									<div className="laptop-preview">
										<div className="screen">
											{/* <img src={imageURL} alt="image" /> */}
											<div
												style={{
													width: '100%',
													height: '100%',
													backgroundImage: `url(${info?.imageURL})`,
													backgroundPosition: info?.crop?.x
														? `${info?.crop?.x}% ${info?.crop?.y}%`
														: 'center',
													backgroundSize: 'cover',
													backgroundRepeat: 'no-repeat',
												}}
											></div>
										</div>
										<LaptopLogo />
									</div>
									<div className="mobile-preview">
										<div
											className="mobile-preview-container"
											style={{
												backgroundImage: `url(${info?.imageURL})`,
												backgroundPosition: info?.crop?.x
													? `${info?.crop?.x}% ${info?.crop?.y}%`
													: 'center',
												backgroundSize: 'cover',
												backgroundRepeat: 'no-repeat',
											}}
										>
											{/* <img src={imageURL} alt="mobile" /> */}
										</div>
										<img src={mobile} alt="mobile" className="mobile-logo" />
									</div>
								</div>
								<div className="album-cover-image">
									<Cropper
										image={info?.imageURL}
										crop={info?.crop}
										zoom={info?.zoom}
										aspect={228 / 370}
										onCropChange={(cropValue) =>
											setInfo((prev) => ({
												...prev,
												crop: cropValue,
											}))
										}
										onCropComplete={(croppedArea, croppedAreaPixels) => {
											// You can store croppedAreaPixels if you need the final crop dimensions
											// console.log('Cropped area:', croppedAreaPixels);
										}}
										onZoomChange={(zoomValue) =>
											setInfo((prev) => ({
												...prev,
												zoom: zoomValue,
											}))
										}
										showGrid={false}
										cropSize={{ width: 233.8432, height: 402.667 }}
									/>
								</div>
							</div>
						)}
						<div className="upload-cover-photo">
							<p
								className="bt"
								onClick={() => {
									if (info?.coverPhoto) {
										fileInputRef.current.click();
									} else {
										setInfo((prev) => ({
											...prev,
											coverPhoto: true,
										}));
									}
								}}
							>
								Upload cover photo
							</p>

							<input
								ref={fileInputRef}
								type="file"
								hidden
								onChange={uploadAlbumCoverChangeHandler}
							/>

							{info?.coverPhoto && (
								<p className="bt" onClick={handleSetCoverPosition}>
									Set cover position
								</p>
							)}
						</div>
					</div>
					<div id="delete-album" className="settings-container">
						<div className="delete-container">
							<div style={{ padding: '4px' }}>
								<DeleteLogo />
							</div>
							<div className="delete-content">
								<p className="title">Delete Album</p>
								<p className="subtitle">
									You cannot undo this. All your albums and information will be
									lost.
								</p>
								<div className="delete">
									<p>Delete permanently</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="albumSettingsNavbar">
					<li
						onClick={() => scrollToSection('album-overview')}
						className={info.activeSetting === 'album-overview' ? 'activeLink' : ''}
					>
						Album overview
					</li>
					<li
						onClick={() => scrollToSection('download-album')}
						className={info.activeSetting === 'download-album' ? 'activeLink' : ''}
					>
						Download album
					</li>
					<li
						onClick={() => scrollToSection('lightroom-copy-list')}
						className={info.activeSetting === 'lightroom-copy-list' ? 'activeLink' : ''}
					>
						Light Room Copy List
					</li>
					<li
						onClick={() => scrollToSection('album-cover')}
						className={info.activeSetting === 'album-cover' ? 'activeLink' : ''}
					>
						Album Cover
					</li>
					<li
						onClick={() => scrollToSection('delete-album')}
						className={info.activeSetting === 'delete-album' ? 'activeLink' : ''}
					>
						Delete album
					</li>
				</div>
			</div>
		</div>
	);
};

export default AlbumSettings;
