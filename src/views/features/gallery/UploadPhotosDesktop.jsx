import React, { useState, useContext, useEffect, useRef, memo } from 'react';
import '../../../assets/scss/gallery/uploadGallery.scss';
import AddLables from '../../components/gallery/addGallery/AddLablesComponent';
import UploadInputComponent from '../../components/gallery/addGallery/UploadInputComponent';
import { ReactComponent as BackIcon } from '../../../assets/svg/gallery/back-gray.svg';
import WaterMarkComponent from '../../components/gallery/addGallery/WaterMarkComponent';
import UploadStatusComponent from '../../components/gallery/addGallery/UploadStatusComponent';
import randomize from 'randomatic';
import moment from 'moment';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import UploadCompletedPopup from '../../components/gallery/addGallery/UploadCompletedPopup';
import { message } from '../../components/globalComponents/CustomToast';
import Context from '../../../context/context';

const UploadPhotosDesktop = () => {
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
		subscriptionInfo: { validateExpiryData, updateSubscriptionState, updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState({
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
		startedUploading: false,
		uploadImages: {},
		uploadSize: 0, // KB
		uploadLimit: Math.min(
			navigator.hardwareConcurrency ? Math.max(2, navigator.hardwareConcurrency - 1) : 4,
			6,
		), // Cap at 8 to avoid overload
		uploadBatchID: randomize('Aa0', 10),
		selectedGalleryTags: [],
		duplicatesFound: 0, // Fixed typo
		overAllProgress: 0,
		isPopupOpen: false,
		title: '',
		isAiEnabled: false,
		scaleWatermark: 0.15,
		watermarkOpacity: 1,
		// Processing state
		isProcessing: false,
		processingProgress: 0,
		processedCount: 0,
		totalCount: 0,
	});

	const intervalRef = useRef(null);
	const recentImageInitiatedRef = useRef(null);
	const lightGallery = !tenantAlbums?.storeOriginals ? 'true' : 'false';
	const aiFacesLogic =
		lightGallery === 'true' &&
		info.isAiEnabled &&
		(validateExpiryData?.liteImageLimitWithAiFace === 0 ||
			validateExpiryData?.liteImageLimitWithAiFace <= validateExpiryData?.liteImageUsed);

	// --- Effects ---
	useEffect(() => {
		if (
			lightGallery === 'true' &&
			info.isAiEnabled &&
			validateExpiryData?.liteImageLimitWithAiFace === 0
		) {
			setInfo((prev) => ({ ...prev, isAiEnabled: false }));
			updateSubscriptionState({
				expiredSubscriptionModal: true,
				expiredSubscriptionType: 'Lite-Gallery',
			});
		}
		const updatedUploadImages = { ...info.uploadImages };
		Object.keys(updatedUploadImages).forEach((key) => {
			updatedUploadImages[key].isAIFacesEnabled =
				lightGallery === 'true'
					? info.isAiEnabled && validateExpiryData?.liteImageLimitWithAiFace > 0
					: true;
		});
		setInfo((prev) => ({ ...prev, uploadImages: updatedUploadImages }));
	}, [aiFacesLogic, info.isAiEnabled]);

	useEffect(() => {
		if (!waterMarks) {
			getWaterMarks();
		} else if (waterMarks?.length > 0 && !info.watermarkProfileId) {
			setInfo((prev) => ({ ...prev, watermarkProfileId: waterMarks[0]?.profileId }));
		}
	}, [waterMarks]);

	useEffect(() => {
		if (tenantAlbums) {
			const albumTitle = tenantAlbums.albums?.find((a) => a._id === albumId)?.title || 'Back';
			setInfo((prev) => ({ ...prev, title: albumTitle }));
		} else {
			getAlbums(galleryId).then((response) => {
				if (response?.[0] === 404 && response?.[1]?.message === 'gallery not found') {
					navigate('/galleries');
				}
			});
		}
	}, [tenantAlbums]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, []);

	// --- Helpers ---
	const getDuplicateSet = () => {
		const set = new Set();
		imageDuplicatesList?.list?.forEach((img) => set.add(img.displayName));
		return set;
	};

	const getWatermarkUrl = () => {
		if (!info.isWaterMarkApply || !info.watermarkProfileId) return null;
		const wm = waterMarks.find((w) => w.profileId === info.watermarkProfileId);
		return wm?.url || null;
	};

	// --- Concurrent Processing Helper ---
	const processImagesConcurrently = async (images, concurrencyLimit) => {
		const results = [];
		const executing = [];

		const processOne = async (image, index) => {
			const result = await processSingleImage(image.file, index);
			results.push({
				...image,
				...result,
				processedFile: result.processedFile || null,
			});
		};

		for (let i = 0; i < images.length; i++) {
			const p = processOne(images[i], i).then(() => {
				executing.splice(executing.indexOf(p), 1);
			});
			executing.push(p);

			if (executing.length >= concurrencyLimit) {
				await Promise.race(executing);
			}
		}

		await Promise.all(executing);
		return results;
	};

	// --- Process Image with Sharp ---
	const processSingleImage = async (originalFile, index) => {
		try {
			const imageBuffer = await originalFile.arrayBuffer();
			const watermarkUrl = getWatermarkUrl();
			const result = await window.electronApi.processImageWithSharp({
				imageBuffer: Array.from(new Uint8Array(imageBuffer)),
				watermarkUrl,
				watermarkPosition: info.watermarkPosition,
				scale: info.scaleWatermark,
				opacity: info.watermarkOpacity,
				isWaterMarkApply: info.isWaterMarkApply,
			});
			if (!result.success) throw new Error(result.error);
			const processedBuffer = Uint8Array.from(atob(result.processedImage), (c) =>
				c.charCodeAt(0),
			);
			const processedFile = new File([processedBuffer], originalFile.name, {
				type: 'image/jpeg',
			});

			setInfo((prev) => ({
				...prev,
				processedCount: prev.processedCount + 1,
				processingProgress: Math.round(((prev.processedCount + 1) / prev.totalCount) * 100),
			}));

			return {
				success: true,
				processedFile,
				originalSize: originalFile.size,
				processedSize: processedBuffer.length,
			};
		} catch (error) {
			console.error('Failed to process:', originalFile.name, error);
			setInfo((prev) => ({
				...prev,
				uploadImages: {
					...prev.uploadImages,
					[originalFile.name]: {
						...prev.uploadImages[originalFile.name],
						isFailed: true,
					},
				},
			}));
			return { success: false, error };
		}
	};

	// --- On Drop: Just Store Raw Files ---
	const onDropFunction = async (files) => {
		if (
			lightGallery === 'true' &&
			validateExpiryData?.restrictGalleries &&
			(validateExpiryData?.liteImageLimit <= validateExpiryData?.liteImageUsed ||
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
			validateExpiryData?.restrictGalleries &&
			(!validateExpiryData?.uploadAllowed ||
				!validateExpiryData?.uploadAllowedForClassicGallery)
		) {
			return updateSubscriptionState({
				expiredSubscriptionModal: true,
				expiredSubscriptionType: 'Classic-Gallery-Upload',
			});
		}

		const validFiles = Array.from(files).filter((f) => f.type.match(/image\/(jpeg|png)/));
		const duplicateSet = getDuplicateSet();
		const updatedUploadImages = { ...info.uploadImages };
		let totalSize = 0;
		let duplicatesFound = info.duplicatesFound;

		validFiles.forEach((file) => {
			const isDuplicate = duplicateSet.has(file.name);
			if (!updatedUploadImages[file.name]) {
				updatedUploadImages[file.name] = {
					file,
					originalSize: file.size,
					isUploaded: null,
					uploadedPerct: 0,
					isDuplicate,
					originalImage: isDuplicate
						? imageDuplicatesList?.list?.find((img) => img.displayName === file.name)
						: null,
					isFailed: false,
					isProcessed: false,
					processedFile: null,
				};
				totalSize += file.size;
				if (isDuplicate) duplicatesFound++;
			}
		});

		setInfo((prev) => ({
			...prev,
			uploadImages: updatedUploadImages,
			uploadSize: prev.uploadSize + totalSize / 1024,
			duplicatesFound,
		}));
	};

	// --- Upload with Concurrent Processing & Uploads ---
	const uploadFilesConcurrently = async () => {
		const nonDuplicates = Object.keys(info.uploadImages).filter(
			(key) => !(info.isSkipDuplicates && info.uploadImages[key].isDuplicate),
		);

		if (nonDuplicates.length === 0) {
			setInfo((prev) => ({ ...prev, isPopupOpen: true, overAllProgress: 100 }));
			updateStateValues({ reFetchSubscription: true });
			return;
		}

		// Reset state
		setInfo((prev) => ({
			...prev,
			startedUploading: true,
			isProcessing: true,
			processedCount: 0,
			totalCount: nonDuplicates.length,
			processingProgress: 0,
			overAllProgress: 0,
		}));

		const concurrency = info.uploadLimit;

		// Shared queue for processing → upload
		const processingQueue = [...nonDuplicates];
		let completedUploads = 0;

		// Function: Process one image and upload it immediately
		const processAndUploadOne = async () => {
			while (processingQueue.length > 0) {
				const key = processingQueue.shift(); // Safe: JS is single-threaded
				const image = info.uploadImages[key];

				try {
					// 1. Process the image
					const result = await processSingleImage(image.file);

					if (!result.success) continue;

					// 2. Update state with processed file
					setInfo((prev) => ({
						...prev,
						uploadImages: {
							...prev.uploadImages,
							[key]: {
								...prev.uploadImages[key],
								processedFile: result.processedFile,
								processedSize: result.processedSize,
							},
						},
					}));

					// 3. Upload immediately
					const json = getJsonFunction(key);
					let attempts = 0;
					while (attempts < 3) {
						const signedURL = await getUploadImageSignUrl(galleryId, albumId, json);
						if (signedURL[0] === true) {
							const success = await uploadOnS3Function(
								{ ...image, processedFile: result.processedFile },
								key,
								signedURL[1].signedUrl,
							);
							if (success) {
								completedUploads++;
								const progress = (completedUploads / nonDuplicates.length) * 100;
								setInfo((prev) => ({
									...prev,
									overAllProgress: Math.min(progress, 100),
								}));
								break;
							}
						}
						attempts++;
						if (attempts < 3) await new Promise((r) => setTimeout(r, 2000 * attempts));
					}
				} catch (error) {
					console.error('Failed to process/upload:', key, error);
				}
			}
		};

		// Start N concurrent workers (each can process + upload)
		const workers = Array.from({ length: concurrency }, () => processAndUploadOne());

		// Wait for all to finish
		await Promise.all(workers);

		// Finalize
		if (intervalRef.current) clearInterval(intervalRef.current);
		setInfo((prev) => ({ ...prev, isPopupOpen: true, overAllProgress: 100 }));
		updateStateValues({ reFetchSubscription: true, reFetchGallery: true });
	};

	// --- Generate Upload Metadata ---
	const getJsonFunction = (currentImage) => {
		const image = info.uploadImages[currentImage];
		if (!image || image.isUploaded) return null;
		return {
			originalFileName: image.file.name,
			originalDateTime: moment(image.originalDate).unix() || 0,
			uploadBatchId: info.uploadBatchID,
			tag_ids: info.selectedGalleryTags.map((tag) => tag._id || ''),
			isAIFacesEnabled:
				lightGallery === 'true'
					? info.isAiEnabled && validateExpiryData?.liteImageLimitWithAiFace > 0
					: true,
			...(image.isDuplicate && !info.isSkipDuplicates
				? { image_id: image.originalImage?._id }
				: {}),
		};
	};

	// --- Upload to S3/B2 ---
	const uploadOnS3Function = async (image, key, signUrl) => {
		const fileToUpload = image.processedFile || image.file;
		try {
			const options = {
				onUploadProgress: (e) => {
					const percent = Math.floor((e.loaded * 100) / e.total);
					setInfo((prev) => ({
						...prev,
						uploadImages: {
							...prev.uploadImages,
							[key]: { ...prev.uploadImages[key], uploadedPerct: percent },
						},
					}));
				},
				headers: { 'Content-Type': fileToUpload.type },
			};
			const response = await axios.put(signUrl, fileToUpload, options);
			if (response.status === 200) {
				setInfo((prev) => ({
					...prev,
					uploadImages: {
						...prev.uploadImages,
						[key]: {
							...prev.uploadImages[key],
							isUploaded: true,
							uploadedPerct: 100,
						},
					},
				}));
				return true;
			}
			return false;
		} catch (error) {
			console.error('Upload failed:', error);
			return false;
		}
	};

	const onSaveClick = () => {
		message.success('Watermark settings saved locally');
	};

	return (
		<div className="upload-gallery-container">
			<div onClick={() => navigate(-1)} className="backHeader">
				<BackIcon /> <p>{info.title}</p>
			</div>
			<div className="options_upload_container">
				<AddLables info={info} setinfo={setInfo} searchParams={searchParams} />
				<UploadInputComponent onDropFunction={onDropFunction} />
			</div>
			<div className="watermark_progress_container">
				<WaterMarkComponent
					setInfo={setInfo}
					waterMarks={waterMarks}
					onSaveClick={onSaveClick}
					waterMarkApply={info.isWaterMarkApply}
					startedUploading={info.startedUploading}
					isPopupOpen={info.isPopupOpen}
					watermarkPosition={info.watermarkPosition}
					watermarkProfileId={info.watermarkProfileId}
					watermarkOpacity={info.watermarkOpacity}
					scaleWatermark={info.scaleWatermark}
				/>
				<UploadStatusComponent
					info={info}
					setInfo={setInfo}
					uploadFilesConcurrently={uploadFilesConcurrently}
					galleryId={galleryId}
					aiFacesLogic={aiFacesLogic}
					lightGallery={lightGallery}
				/>
			</div>
			<UploadCompletedPopup
				info={info}
				setInfo={setInfo}
				getImageDuplicatesList={getImageDuplicatesList}
			/>
		</div>
	);
};

export default memo(UploadPhotosDesktop);
