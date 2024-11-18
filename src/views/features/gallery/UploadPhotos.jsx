import React, { useState, useContext, useEffect, useRef } from 'react';
import '../../../assets/scss/gallery/uploadGallery.scss';
import AddLables from '../../components/gallery/addGallery/AddLablesComponent';
import UploadInputComponent from '../../components/gallery/addGallery/UploadInputComponent';
import { ReactComponent as BackIcon } from '../../../assets/svg/gallery/back-gray.svg';
import WaterMarkComponent from '../../components/gallery/addGallery/WaterMarkComponent';
import UploadStatusComponent from '../../components/gallery/addGallery/UploadStatusComponent';
import randomize from 'randomatic';
import moment from 'moment';
import Context from '../../../context/context';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import UploadCompletedPopup from '../../components/gallery/addGallery/UploadCompletedPopup';
import RefreshPopup from '../../components/gallery/addGallery/RefreshPopup';

const UploadPhotos = () => {
	const { galleryId, albumId } = useParams();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const {
		galleryInfo: {
			getUploadImageSignUrl,
			getImageUploadStatus,
			imageDuplicatesList,
			getWaterMarks,
			waterMarks,
			tenantAlbums,
			getAlbums,
			getImageDuplicatesList,
		},
	} = useContext(Context);

	const [info, setinfo] = useState({
		isWaterMarkApply: true,
		watermarkProfileId: null,
		watermarkPosition: {
			bpos: 10,
			lpos: 'auto',
			name: 'southeast',
			rpos: 10,
			tpos: 'auto',
		},
		initialUpload: false,
		startedUploading: false,
		uploadImages: {},
		uploadSize: 0, // kb
		uploadLimit: 5,
		currentUpload: 1,
		recentImageInitiated: null,
		isSkipDuplicates: false,
		uploadBatchID: randomize('Aa0', 10),
		selectedGalleryTags: [],
		duplciatesFound: 0,
		uploadStatus: { processedCount: 0, uploadedCount: 0 },
		overAllProgress: 0,
		isPopupOpen: false,
		title: '',
		isRefreshPopupOpen: false,
	});
	const recentImageInitiatedRef = useRef(info.recentImageInitiated);

	useEffect(() => {
		if (!waterMarks) {
			getWaterMarks();
		} else if (waterMarks && waterMarks?.length > 0) {
			setinfo((prev) => ({ ...prev, watermarkProfileId: waterMarks[0].profileId }));
		}
	}, [waterMarks]);

	useEffect(() => {
		if (tenantAlbums) {
			setinfo((prev) => ({
				...prev,
				title:
					tenantAlbums?.albums?.find((album) => album._id === albumId)?.title || 'Back',
			}));
		} else {
			getAlbums(galleryId).then((response) => {
				if (response?.[0] === 404 && response?.[1]?.message === 'gallery not found') {
					navigate('/galleries');
				}
			});
		}
	}, [tenantAlbums]);

	// useEffect(() => {
	// 	window.addEventListener('beforeunload', (e) => {
	// 		e.preventDefault();
	// 		const message = 'Are you sure you want to leave? All provided data will be lost.';
	// 		return message;
	// 	});
	// }, []);

	// drop function
	const onDropFunction = async (files) => {
		let updateInfo = { ...info };

		if (updateInfo?.initialUpload) {
			updateInfo.initialUpload = true;
		}
		let totalSize = 0;

		files?.map((file) => {
			let uploadedImages = { ...updateInfo?.uploadImages };

			let findDuplicateImage = imageDuplicatesList?.list?.find(
				(image) => image?.displayName === file?.name,
			);

			if (
				!updateInfo?.uploadImages?.[file?.name] &&
				(file?.type === 'image/jpeg' || file?.type === 'image/png')
			) {
				uploadedImages[file.name] = {
					file: file,
					isUploaded: null,
					uploadedPerct: 0,
					isDuplicate: findDuplicateImage ? true : false,
					originalImage: findDuplicateImage,
					originalDate: 0,
				};

				updateInfo.uploadImages = uploadedImages;
				totalSize += file.size;

				if (imageDuplicatesList?.list?.some((image) => image.displayName === file.name)) {
					updateInfo.duplciatesFound = updateInfo?.duplciatesFound + 1;
				}
			} else {
				uploadedImages[file.name] = {
					file: file,
					isUploaded: false,
					uploadedPerct: 0,
					isDuplicate: !!findDuplicateImage,
					originalImage: findDuplicateImage,
				};
			}
		});

		updateInfo.uploadSize = updateInfo.uploadSize + totalSize / 1024;

		setinfo(updateInfo);
	};

	const getJsonFunction = (currentImage) => {
		const imageKeysArray = Object.keys(info?.uploadImages || {});
		console.log(imageKeysArray, 'imageKeysArray');

		const imageKeyIndex =
			recentImageInitiatedRef.current !== null
				? imageKeysArray[imageKeysArray.indexOf(currentImage)]
				: imageKeysArray[0];
		const image = info?.uploadImages[imageKeyIndex];

		console.log(currentImage, imageKeyIndex, image, 'image');

		if (image && image?.isUploaded) return null;

		const imageName = image?.file?.name || '';

		const tags = info?.selectedGalleryTags?.map((tag) => (tag != null ? tag._id : '')) || [];

		let json = {
			originalFileName: imageName,
			originalDateTime: moment(image?.['originalDate']).unix() || 0,
			uploadBatchId: info?.uploadBatchID,
			tag_ids: tags,
			isAIFacesEnabled: true,
		};

		// for duplicates
		if (image?.isDuplicate === true && info?.isSkipDuplicates === false) {
			json = {
				...json,
				image_id: image?.originalImage?._id,
			};
		}

		// if there is a watermark
		if (info.isWaterMarkApply) {
			json = {
				...json,
				watermarkPosition: info?.watermarkPosition?.name,
				watermarkProfileId: info?.isWaterMarkApply ? info?.watermarkProfileId : null,
			};
		}

		recentImageInitiatedRef.current = currentImage;
		setinfo((prev) => ({
			...prev,
			// recentImageInitiated: currentImage,
			currentUpload:
				(prev?.isSkipDuplicates === true && image?.isDuplicate === false) ||
				prev?.isSkipDuplicates === false
					? prev.currentUpload + 1
					: prev.currentUpload,
		}));

		return json;
	};

	const uploadOnS3Function = async (image, key, signUrl) => {
		try {
			let options = {
				onUploadProgress: (progressEvent) => {
					const { loaded, total } = progressEvent;

					let percent = Math.floor((loaded * 100) / total);

					if (percent <= 100) {
						setinfo((prev) => {
							const uploadImages = { ...prev.uploadImages };
							uploadImages[key]['uploadedPerct'] = parseInt(percent);
							return { ...prev, uploadImages };
						});
					}
				},
				headers: {
					'Content-Type': image.file.type,
				},
			};
			const response = await axios.put(signUrl, image.file, options);

			if (response.status === 200) {
				setinfo((prev) => {
					let uploadImages = { ...prev.uploadImages };
					uploadImages[key]['isUploaded'] = true;
					uploadImages[key]['uploadedPerct'] = 100;
					const size = uploadImages[key]['file'].size;
					delete uploadImages[key]['file'];
					uploadImages[key]['file'] = { size, name: key };
					return { ...prev, uploadImages };
				});

				return true;
			} else {
				return false;
			}
		} catch (error) {
			console.log('something error occured');
		}
	};

	const uploadFilesConcurrently = async () => {
		const queue = Object.keys(info.uploadImages);
		const activeUploads = [];
		let totalImages = Object.keys(info.uploadImages || {}).length;

		setinfo((prev) => ({
			...prev,
			startedUploading: true,
		}));

		const interval = setInterval(async () => {
			const response = await getImageUploadStatus(galleryId, albumId, info?.uploadBatchID);
			const { processedCount, uploadedCount } = response[1];

			let result = 0,
				uploaded75Percent = 0,
				processed25Percent = 0,
				shouldClearInterval = false;

			if (info?.isSkipDuplicates && totalImages === info?.duplciatesFound) {
				result = 100;
				shouldClearInterval = true;
			} else if (info?.isSkipDuplicates && totalImages !== info?.duplciatesFound) {
				let totalImagesWithoutDuplicates = totalImages - info?.duplciatesFound;
				processed25Percent =
					processedCount > 0
						? parseInt((processedCount / totalImagesWithoutDuplicates) * 25)
						: 0;
				uploaded75Percent =
					uploadedCount > 0
						? parseInt((uploadedCount / totalImagesWithoutDuplicates) * 75)
						: 0;
				result = uploaded75Percent + processed25Percent;
			} else {
				processed25Percent =
					processedCount > 0 ? parseInt((processedCount / totalImages) * 25) : 0;
				uploaded75Percent =
					uploadedCount > 0 ? parseInt((uploadedCount / totalImages) * 75) : 0;
				result = uploaded75Percent + processed25Percent;
			}

			if (result === 100) {
				shouldClearInterval = true;
			}

			setinfo((prev) => ({ ...prev, uploadStatus: response[1], overAllProgress: result }));

			if (response[1].processedCount === response[1].uploadedCount && shouldClearInterval) {
				clearInterval(interval);
				setinfo((prev) => ({ ...prev, isPopupOpen: true }));
			}
		}, 3000);

		const nextUploadFunc = async () => {
			if (queue.length === 0) return;

			const currentFile = queue.shift();
			const json = getJsonFunction(currentFile);

			if (info.isSkipDuplicates && info.uploadImages[currentFile]?.isDuplicate) {
				setinfo((prev) => {
					let uploadImages = { ...prev.uploadImages };
					uploadImages[currentFile]['isUploaded'] = true;
					uploadImages[currentFile]['uploadedPerct'] = 100;
					const size = uploadImages[currentFile]['file'].size;
					delete uploadImages[currentFile]['file'];
					uploadImages[currentFile]['file'] = { size, name: currentFile };
					return { ...prev, uploadImages };
				});
				nextUploadFunc();
				return;
			}

			let attempts = 0;
			let isSuccessUpload = false;
			while (attempts < 3) {
				const signedURLUpload = await getUploadImageSignUrl(galleryId, albumId, json);
				if (signedURLUpload[0] === true) {
					const uploadPromise = uploadOnS3Function(
						info.uploadImages[currentFile],
						currentFile,
						signedURLUpload[1]['signedUrl'],
					);
					activeUploads.push(uploadPromise);

					isSuccessUpload = await uploadPromise;

					if (isSuccessUpload) {
						activeUploads.splice(activeUploads.indexOf(uploadPromise), 1);
						break;
					}
				}
				attempts++;
			}
			if (isSuccessUpload) {
				nextUploadFunc();
			}
		};

		for (let i = 0; i < info.uploadLimit && queue.length > 0; i++) {
			nextUploadFunc();
		}

		await Promise.allSettled(activeUploads);
	};

	return (
		<div className="upload-gallery-container">
			<div onClick={() => navigate(-1)} className="backHeader">
				<BackIcon /> <p>{info?.title}</p>
			</div>

			<div className="options_upload_container">
				<AddLables info={info} setinfo={setinfo} searchParams={searchParams} />
				<UploadInputComponent onDropFunction={onDropFunction} />
			</div>

			<div className="watermark_progress_container">
				<WaterMarkComponent info={info} setinfo={setinfo} waterMarks={waterMarks} />
				<UploadStatusComponent
					info={info}
					setinfo={setinfo}
					uploadFilesConcurrently={uploadFilesConcurrently}
				/>
			</div>

			<UploadCompletedPopup
				info={info}
				setinfo={setinfo}
				getImageDuplicatesList={getImageDuplicatesList}
			/>
			{/* <RefreshPopup info={info} setinfo={setinfo} /> */}
		</div>
	);
};

export default UploadPhotos;
