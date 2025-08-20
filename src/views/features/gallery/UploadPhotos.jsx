import React, { useState, useContext, useEffect, useRef, memo } from 'react';
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
import { message } from '../../components/globalComponents/CustomToast';

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
			updateWaterMarkVisibility,
		},
		subscriptionInfo: {
			validateExpiryData,
			updateSubscriptionState,
			updateStateValues,
			currentPlan,
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
			transformOrigin: 'bottom right',
		},
		initialUpload: false,
		startedUploading: false,
		uploadImages: {},
		uploadSize: 0, // kb
		uploadLimit: navigator.hardwareConcurrency || 5, // Dynamic upload limit based on CPU cores
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
		isAiEnabled: false,
		isUploadComplete: false,
		scaleWatermark: 0.15,
		watermarkOpacity: 1,
		isProcessingDuplicates: false, // New state for duplicate processing feedback
	});

	const recentImageInitiatedRef = useRef(info.recentImageInitiated);
	const params = new URLSearchParams(window.location.search);
	const lightGallery = !tenantAlbums?.storeOriginals ? 'true' : 'false';

	const aiFacesLogic =
		lightGallery === 'true' &&
		info?.isAiEnabled &&
		(validateExpiryData?.liteImageLimitWithAiFace === 0 ||
			validateExpiryData?.liteImageLimitWithAiFace <= validateExpiryData?.liteImageUsed);

	useEffect(() => {
		if (
			lightGallery === 'true' &&
			info?.isAiEnabled &&
			validateExpiryData?.liteImageLimitWithAiFace === 0
		) {
			setinfo((prev) => ({
				...prev,
				isAiEnabled: false,
			}));
			updateSubscriptionState({
				expiredSubscriptionModal: true,
				expiredSubscriptionType: 'Lite-Gallery',
			});
			return;
		}
		const updatedUploadImages = info?.uploadImages || {};
		if (Object.keys(updatedUploadImages)?.length > 0) {
			Object.keys(updatedUploadImages)?.forEach((key) => {
				updatedUploadImages[key].isAIFacesEnabled =
					lightGallery === 'true'
						? info?.isAiEnabled && validateExpiryData?.liteImageLimitWithAiFace > 0
						: true;
			});
			setinfo((prev) => ({
				...prev,
				uploadImages: updatedUploadImages,
			}));
		}
	}, [aiFacesLogic, info?.isAiEnabled]);

	useEffect(() => {
		if (!waterMarks) {
			getWaterMarks();
		} else if (waterMarks && waterMarks?.length > 0) {
			setinfo((prev) => ({ ...prev, watermarkProfileId: waterMarks?.[0]?.profileId }));
		}
	}, [waterMarks]);

	useEffect(() => {
		if (tenantAlbums) {
			setinfo((prev) => ({
				...prev,
				title:
					tenantAlbums?.albums?.find((album) => album?._id === albumId)?.title || 'Back',
			}));
		} else {
			getAlbums(galleryId).then((response) => {
				if (response?.[0] === 404 && response?.[1]?.message === 'gallery not found') {
					navigate('/galleries');
				}
			});
		}
	}, [tenantAlbums]);

	// Optimized duplicate detection with a hash set
	const getDuplicateSet = () => {
		const duplicateSet = new Set();
		imageDuplicatesList?.list?.forEach((image) => {
			duplicateSet.add(image?.displayName);
		});
		return duplicateSet;
	};

	// Optimized onDropFunction with batched state updates
	const onDropFunction = async (files) => {
		// ✅ Step 1: Convert FileList to array and remove hidden files (starting with '.')
		const filteredFiles = Array.from(files).filter((file) => {
			return file.name && !file.name.startsWith('.');
		});

		// ✅ Optional: Notify user if only hidden files were dropped
		if (filteredFiles.length === 0) {
			console.log('No valid files: Only hidden/system files (e.g. .DS_Store) were dropped.');
			return; // 🔥 Exit early — no files to process
		}

		// 🔒 Subscription checks
		if (
			lightGallery === 'true' &&
			validateExpiryData &&
			validateExpiryData?.restrictGalleries &&
			(validateExpiryData?.liteImageLimit < validateExpiryData?.liteImageUsed ||
				aiFacesLogic) &&
			!validateExpiryData?.imagesAllowed
		) {
			return updateSubscriptionState({
				expiredSubscriptionModal: true,
				expiredSubscriptionType: 'Lite-Gallery',
			});
		}

		if (
			lightGallery === 'false' &&
			validateExpiryData &&
			validateExpiryData?.restrictGalleries &&
			(!validateExpiryData?.uploadAllowed ||
				!validateExpiryData?.uploadAllowedForClassicGallery)
		) {
			return updateSubscriptionState({
				expiredSubscriptionModal: true,
				expiredSubscriptionType: 'Classic-Gallery-Upload',
			});
		}

		// Show processing indicator
		setinfo((prev) => ({ ...prev, isProcessingDuplicates: true }));

		const duplicateSet = getDuplicateSet();
		let totalSize = 0;
		const imagesLimit = validateExpiryData?.liteImageLimit - validateExpiryData?.liteImageUsed;
		let uploadImagesLength = Object.keys(info?.uploadImages).length;
		let duplicatesFound = info.duplicatesFound || 0; // 🔴 Fixed typo: "duplciatesFound"
		const updatedUploadImages = { ...info.uploadImages };

		// ✅ Step 2: Filter only valid image types from the already-cleaned `filteredFiles`
		const validFiles = filteredFiles.filter(
			(file) => file.type === 'image/jpeg' || file.type === 'image/png',
		);

		// If no valid image files remain
		if (validFiles.length === 0) {
			setinfo((prev) => ({ ...prev, isProcessingDuplicates: false }));
			return;
		}

		// ✅ Check image limit *after* filtering
		if (uploadImagesLength + validFiles.length > imagesLimit && lightGallery === 'true') {
			setinfo((prev) => ({ ...prev, isProcessingDuplicates: false }));
			return updateSubscriptionState({
				expiredSubscriptionModal: true,
				expiredSubscriptionType: 'Lite-Gallery',
			});
		}

		// ✅ Process only clean, valid files
		validFiles.forEach((file) => {
			if (!updatedUploadImages[file.name]) {
				const isDuplicate = duplicateSet.has(file.name);
				updatedUploadImages[file.name] = {
					file,
					isUploaded: null,
					uploadedPerct: 0,
					isDuplicate,
					originalImage: isDuplicate
						? imageDuplicatesList?.list?.find(
								(image) => image?.displayName === file?.name,
						  )
						: null,
					originalDate: 0,
					isFailed: false,
				};
				totalSize += file.size;
				if (isDuplicate) {
					duplicatesFound += 1;
				}
			} else {
				// Handle re-upload of same file
				updatedUploadImages[file.name] = {
					...updatedUploadImages[file.name],
					file,
					isUploaded: false,
					uploadedPerct: 0,
					isFailed: false,
				};
			}
		});

		// ✅ Final state update with only valid, visible, supported image files
		setinfo((prev) => ({
			...prev,
			uploadImages: updatedUploadImages,
			uploadSize: prev.uploadSize + totalSize / 1024,
			duplicatesFound,
			isProcessingDuplicates: false,
		}));
	};

	const getJsonFunction = (currentImage) => {
		const imageKeysArray = Object.keys(info?.uploadImages || {});
		const imageKeyIndex =
			recentImageInitiatedRef.current !== null
				? imageKeysArray[imageKeysArray.indexOf(currentImage)]
				: imageKeysArray[0];
		const image = info?.uploadImages[imageKeyIndex];

		if (image && image?.isUploaded) return null;

		const imageName = image?.file?.name || '';
		const tags = info?.selectedGalleryTags?.map((tag) => (tag != null ? tag._id : '')) || [];

		let json = {
			originalFileName: imageName,
			originalDateTime: moment(image?.['originalDate']).unix() || 0,
			uploadBatchId: info?.uploadBatchID,
			tag_ids: tags,
			isAIFacesEnabled:
				lightGallery === 'true'
					? info?.isAiEnabled && validateExpiryData?.liteImageLimitWithAiFace > 0
					: currentPlan?.isAIFacesEnabled,
		};

		if (image?.isDuplicate === true && info?.isSkipDuplicates === false) {
			json = {
				...json,
				image_id: image?.originalImage?._id,
			};
		}

		if (info.isWaterMarkApply) {
			json = {
				...json,
				watermarkPosition: info?.watermarkPosition?.name,
				watermarkProfileId: info?.isWaterMarkApply ? info?.watermarkProfileId : null,
				watermarkScale: info?.scaleWatermark,
				watermarkOpacity: info?.watermarkOpacity,
			};
		}

		recentImageInitiatedRef.current = currentImage;
		setinfo((prev) => ({
			...prev,
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
					uploadImages[key]['isFailed'] = false;
					const size = uploadImages[key]['file'].size;
					delete uploadImages[key]['file'];
					uploadImages[key]['file'] = { size, name: key };
					return { ...prev, uploadImages };
				});
				return true;
			} else if (response.status === 402) {
				updateSubscriptionState({
					expiredSubscriptionModal: true,
					expiredSubscriptionType: 'Classic-Gallery',
				});
				return false;
			}
			return false;
		} catch (error) {
			console.error('Upload error:', error);
			return false;
		}
	};

	const uploadFilesConcurrently = async () => {
		const queue = Object.keys(info.uploadImages);
		const activeUploads = [];
		let totalImages = queue.length;

		setinfo((prev) => ({ ...prev, isProcessingDuplicates: true }));

		// Batch process duplicates upfront
		const duplicates = [];
		const nonDuplicates = [];
		queue.forEach((file) => {
			if (info.isSkipDuplicates && info.uploadImages[file]?.isDuplicate) {
				duplicates.push(file);
			} else {
				nonDuplicates.push(file);
			}
		});

		// Update state for all duplicates in one go
		if (duplicates.length > 0) {
			setinfo((prev) => {
				let uploadImages = { ...prev.uploadImages };
				duplicates.forEach((file) => {
					uploadImages[file] = {
						...uploadImages[file],
						isUploaded: true,
						uploadedPerct: 100,
						file: { size: uploadImages[file].file.size, name: file },
					};
				});
				return {
					...prev,
					uploadImages,
					startedUploading: true,
					isProcessingDuplicates: false,
				};
			});
		} else {
			setinfo((prev) => ({ ...prev, startedUploading: true, isProcessingDuplicates: false }));
		}

		// Early exit if all images are duplicates
		if (info.isSkipDuplicates && duplicates.length === totalImages) {
			setinfo((prev) => ({
				...prev,
				overAllProgress: 100,
				isPopupOpen: true,
			}));
			updateStateValues({ reFetchSubscription: true });
			return;
		}

		// Monitor upload progress
		const interval = setInterval(async () => {
			const response = await getImageUploadStatus(galleryId, albumId, info?.uploadBatchID);
			if (response[0] === false) {
				return;
			}
			const { processedCount, uploadedCount } = response[1];

			let result = 0,
				uploaded75Percent = 0,
				processed25Percent = 0,
				shouldClearInterval = false;

			if (info.isSkipDuplicates && totalImages === info?.duplciatesFound) {
				result = 100;
				shouldClearInterval = true;
			} else {
				const totalImagesWithoutDuplicates = totalImages - (info?.duplciatesFound || 0);
				processed25Percent =
					processedCount > 0 ? (processedCount / totalImagesWithoutDuplicates) * 25 : 0;
				uploaded75Percent =
					uploadedCount > 0 ? (uploadedCount / totalImagesWithoutDuplicates) * 75 : 0;
				result = Math.min(uploaded75Percent + processed25Percent, 100);
			}

			setinfo((prev) => ({
				...prev,
				uploadStatus: response[1],
				overAllProgress: Number(result.toFixed(2)),
			}));
			if (response[1].processedCount === response[1].uploadedCount || shouldClearInterval) {
				clearInterval(interval);
				updateStateValues({ reFetchSubscription: true });
				setinfo((prev) => ({ ...prev, isPopupOpen: true }));
			}
		}, 3000);

		// Upload non-duplicate images
		const nextUploadFunc = async () => {
			if (nonDuplicates.length === 0) return;

			const currentFile = nonDuplicates.shift();
			const json = getJsonFunction(currentFile);

			let attempts = 0;
			let isSuccessUpload = false;
			while (attempts < 3) {
				const signedURLUpload = await getUploadImageSignUrl(galleryId, albumId, json);
				if (signedURLUpload[0] === true) {
					const uploadPromise = uploadOnS3Function(
						info.uploadImages[currentFile],
						currentFile,
						signedURLUpload[1].signedUrl,
					);
					activeUploads.push(uploadPromise);

					isSuccessUpload = await uploadPromise;

					if (isSuccessUpload) {
						activeUploads.splice(activeUploads.indexOf(uploadPromise), 1);
						break;
					}
				}

				if (attempts !== 0) {
					setinfo((prev) => ({
						...prev,
						uploadImages: {
							...prev.uploadImages,
							[currentFile]: { ...prev.uploadImages[currentFile], isFailed: true },
						},
					}));
					let waitTime = 2000 * attempts;
					await new Promise((resolve) => {
						setTimeout(() => resolve(), waitTime);
					});
				}
				attempts++;
			}
			if (isSuccessUpload) {
				nextUploadFunc();
			}
		};

		// Start uploads for non-duplicates with dynamic limit
		for (let i = 0; i < info.uploadLimit && nonDuplicates.length > 0; i++) {
			nextUploadFunc();
		}

		await Promise.allSettled(activeUploads);
	};

	const onSaveClick = async () => {
		const payload = {
			profileId: info?.watermarkProfileId,
			scale: info?.scaleWatermark,
			opacity: info?.watermarkOpacity,
		};
		const response = await updateWaterMarkVisibility(payload);
		if (response?.[0]) {
			message.success('Watermark successfully updated');
		} else {
			message.error('Failed to update the watermark');
		}
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
				<WaterMarkComponent
					setinfo={setinfo}
					waterMarks={waterMarks}
					onSaveClick={onSaveClick}
					waterMarkApply={info?.isWaterMarkApply}
					startedUploading={info?.startedUploading}
					isPopupOpen={info?.isPopupOpen}
					watermarkPosition={info?.watermarkPosition}
					watermarkProfileId={info?.watermarkProfileId}
					watermarkOpacity={info?.watermarkOpacity}
					scaleWatermark={info?.scaleWatermark}
				/>
				<UploadStatusComponent
					info={info}
					setinfo={setinfo}
					uploadFilesConcurrently={uploadFilesConcurrently}
					galleryId={galleryId}
					aiFacesLogic={aiFacesLogic}
					lightGallery={lightGallery}
				/>
			</div>

			<UploadCompletedPopup
				info={info}
				setinfo={setinfo}
				getImageDuplicatesList={getImageDuplicatesList}
			/>
		</div>
	);
};

export default memo(UploadPhotos);
