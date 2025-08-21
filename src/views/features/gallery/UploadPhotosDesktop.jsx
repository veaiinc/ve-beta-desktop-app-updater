// ... imports unchanged ...
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
import { uploadImage } from '../../../helpers/uploadImage';
import ObjectID from 'bson-objectid';

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
			getUploadImagePolicy,
			uploadDesktopImages,
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
		initialUpload: false,
		startedUploading: false,
		uploadImages: {},
		uploadSize: 0,
		uploadLimit: Math.min(navigator.hardwareConcurrency, 8),
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
		isProcessingDuplicates: false,
	});

	const intervalRef = useRef(null);
	const lightGallery = !tenantAlbums?.storeOriginals ? 'true' : 'false';
	const aiFacesLogic =
		lightGallery === 'true' &&
		info.isAiEnabled &&
		(validateExpiryData?.liteImageLimitWithAiFace === 0 ||
			validateExpiryData?.liteImageLimitWithAiFace <= validateExpiryData?.liteImageUsed);

	// --- Effects (unchanged) ---
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

	// --- Process Image with Sharp ---
	const processSingleImage = async (originalFile) => {
		try {
			const imageBuffer = await originalFile.arrayBuffer();
			const uint8Array = new Uint8Array(imageBuffer);

			const { metadata, width, height, format, originalDateTime } =
				await window.electronApi.extractImageMetadata({
					imageBuffer: Array.from(uint8Array),
				});

			if (!width || !height) {
				throw new Error('Unable to extract image dimensions');
			}

			let processedFile = originalFile;
			let thumbnailFile = null;
			let processedBuffer = null;
			let thumbnailBuffer = null;

			const watermarkUrl = getWatermarkUrl();

			// --- Process Optimized (WITH watermark) ---
			const resultOptimized = await window.electronApi.processImageWithSharp({
				imageBuffer: Array.from(uint8Array),
				watermarkUrl: info.isWaterMarkApply ? watermarkUrl : null,
				watermarkPosition: info.watermarkPosition,
				scale: info.scaleWatermark,
				opacity: info.watermarkOpacity,
				isWaterMarkApply: info.isWaterMarkApply,
				resizeOptions: { width: 1200 },
				quality: 85,
				forceJpeg: true,
			});

			if (!resultOptimized.success) throw new Error(resultOptimized.error);

			processedBuffer = Uint8Array.from(atob(resultOptimized.processedImage), (c) =>
				c.charCodeAt(0),
			);
			processedFile = new File([processedBuffer], originalFile.name, { type: 'image/jpeg' });

			// --- Process Thumbnail 300w (NO watermark) ---
			const resultThumbnail = await window.electronApi.processImageWithSharp({
				imageBuffer: Array.from(uint8Array),
				watermarkUrl: null,
				watermarkPosition: info.watermarkPosition,
				scale: 0.15,
				opacity: 1,
				isWaterMarkApply: false,
				resizeOptions: { width: 300 },
				quality: 70,
				forceJpeg: true,
			});

			if (!resultThumbnail.success) throw new Error(resultThumbnail.error);

			thumbnailBuffer = Uint8Array.from(atob(resultThumbnail.processedImage), (c) =>
				c.charCodeAt(0),
			);
			thumbnailFile = new File(
				[thumbnailBuffer],
				`thumb_${originalFile.name.split('.')[0]}.jpg`,
				{ type: 'image/jpeg' },
			);

			setInfo((prev) => ({
				...prev,
				processedCount: prev.processedCount + 1,
				processingProgress: Math.round(((prev.processedCount + 1) / prev.totalCount) * 100),
			}));

			return {
				success: true,
				processedFile,
				thumbnailFile,
				width,
				height,
				format,
				originalDateTime,
				originalSize: originalFile.size,
				processedSize: processedBuffer.length,
				thumbnailSize: thumbnailBuffer.length,
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
		let duplicatesFound = info.duplciatesFound || 0;

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
			duplciatesFound: duplicatesFound,
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

		const policyResponse = await getUploadImagePolicy(galleryId);
		const policyData = policyResponse?.[1];

		setInfo((prev) => ({
			...prev,
			startedUploading: true,
			isProcessing: true,
			processedCount: 0,
			totalCount: nonDuplicates.length,
			processingProgress: 0,
			completedUploads: 0,
			overAllProgress: 0,
		}));

		const processingQueue = [...nonDuplicates];

		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = setInterval(async () => {
			const response = await getImageUploadStatus(galleryId, albumId, info.uploadBatchID);
			if (response[0]) {
				const { uploadedCount } = response[1];
				setInfo((prev) => ({
					...prev,
					overAllProgress: Math.min((uploadedCount / nonDuplicates.length) * 100, 100),
				}));
			}
		}, 6000);

		const processAndUploadOne = async () => {
			while (processingQueue.length > 0) {
				const key = processingQueue.shift();
				const image = info.uploadImages[key];
				if (!image) continue;

				try {
					let imageId;
					if (image.isDuplicate && !info.isSkipDuplicates) {
						const existingId = image.originalImage?._id;
						if (!existingId) {
							console.error('No original _id found for duplicate:', key);
							continue;
						}
						imageId = ObjectID(existingId);
					} else {
						imageId = ObjectID();
					}

					const result = await processSingleImage(image.file);
					if (!result.success) {
						setInfo((prev) => ({
							...prev,
							uploadImages: {
								...prev.uploadImages,
								[key]: { ...image, isFailed: true },
							},
						}));
						continue;
					}

					const processedImage = { ...image, processedFile: result.processedFile };
					setInfo((prev) => ({
						...prev,
						uploadImages: { ...prev.uploadImages, [key]: processedImage },
					}));

					// --- Create modified policy for thumbnail ---
					const optimizedPolicy = policyData.optimized;
					if (!optimizedPolicy) {
						console.error('Missing optimized policy');
						setInfo((prev) => ({
							...prev,
							uploadImages: {
								...prev.uploadImages,
								[key]: { ...image, isFailed: true },
							},
						}));
						continue;
					}

					const thumbnailKeyPrefix = optimizedPolicy.keyPrefix.replace(
						/optimized\/?$/,
						'thumbnails-300w/',
					);

					const thumbnailPolicy = {
						...optimizedPolicy,
						keyPrefix: thumbnailKeyPrefix,
					};

					// Inject modified policy into fakePolicyData
					const fakePolicyDataForThumbnail = {
						...policyData,
						thumbnails_300w: thumbnailPolicy,
					};

					let uploaded = false;
					let attempts = 0;
					const versionId = Date.now();

					while (attempts < 3 && !uploaded) {
						attempts++;
						try {
							const [
								uploadResultOriginal,
								uploadResultOptimized,
								uploadResultThumbnail,
							] = await Promise.all([
								// Upload original
								uploadImage(
									image.file,
									'originals',
									null,
									policyData,
									imageId,
									(percent) => {
										setInfo((prev) => ({
											...prev,
											uploadImages: {
												...prev.uploadImages,
												[key]: {
													...prev.uploadImages[key],
													uploadedPerct: percent,
												},
											},
										}));
									},
									galleryId,
									versionId,
									tenantAlbums?.tenant_id,
									info?.uploadBatchID,
								),
								// Upload optimized
								uploadImage(
									result.processedFile,
									'optimized',
									null,
									policyData,
									imageId,
									null,
									galleryId,
									versionId,
									tenantAlbums?.tenant_id,
									info?.uploadBatchID,
								),
								// Upload thumbnail with modified policy
								uploadImage(
									result.thumbnailFile,
									'thumbnails_300w',
									null,
									fakePolicyDataForThumbnail, // ✅ Critical: use modified policy
									imageId,
									null,
									galleryId,
									versionId,
									tenantAlbums?.tenant_id,
									info?.uploadBatchID,
								),
							]);

							if (
								!uploadResultOriginal.success ||
								!uploadResultOptimized.success ||
								!uploadResultThumbnail.success
							) {
								throw new Error('Upload failed');
							}

							const payload = generateUploadPayload(
								image,
								result.processedFile,
								imageId,
								policyData,
								uploadResultOriginal,
								uploadResultOptimized,
								uploadResultThumbnail,
								{
									width: result.width,
									height: result.height,
									format: result.format,
									originalDateTime: result.originalDateTime,
								},
								versionId,
							);

							const [success, response] = await uploadDesktopImages(
								galleryId,
								albumId,
								payload,
							);
							if (success) {
								uploaded = true;
							} else {
								console.error('Failed to register image:', response);
							}
						} catch (e) {
							console.error(`Upload error (attempt ${attempts}):`, e);
							if (attempts < 3) {
								await new Promise((r) => setTimeout(r, 1000 * attempts));
							}
						}
					}

					if (!uploaded) {
						setInfo((prev) => ({
							...prev,
							uploadImages: {
								...prev.uploadImages,
								[key]: { ...image, isFailed: true },
							},
						}));
					}
				} catch (error) {
					console.error('Processing/upload failed:', error);
					setInfo((prev) => ({
						...prev,
						uploadImages: {
							...prev.uploadImages,
							[key]: { ...image, isFailed: true },
						},
					}));
				}
			}
		};

		const workers = Array.from({ length: info.uploadLimit }, () => processAndUploadOne());
		await Promise.all(workers);

		if (intervalRef.current) clearInterval(intervalRef.current);
		setInfo((prev) => ({ ...prev, isPopupOpen: true, overAllProgress: 100 }));
		updateStateValues({ reFetchSubscription: true, reFetchGallery: true });
	};

	// --- Generate Payload ---
	const generateUploadPayload = (
		image,
		processedFile,
		imageId,
		policyData,
		uploadResultOriginal,
		uploadResultOptimized,
		uploadResultThumbnail,
		extractedMetadata,
		versionId,
	) => {
		const givenFileName = uploadResultOriginal.fileKey.split('/').pop();
		const updatedVersionId = versionId.toString();

		const {
			width: originalWidth,
			height: originalHeight,
			format: originalFormat,
			originalDateTime,
		} = extractedMetadata;

		return {
			tag_ids: info.selectedGalleryTags.map((tag) => tag._id || ''),
			image_id: imageId.toHexString(),
			activeVersion: {
				versionId: updatedVersionId,
				uploadBatchId: info.uploadBatchID,
				isAIFacesEnabled:
					lightGallery === 'true'
						? info.isAiEnabled && validateExpiryData?.liteImageLimitWithAiFace > 0
						: true,
				originalFileName: image.file.name,
				givenFileName,
				s3_original: {
					key: uploadResultOriginal.fileKey,
					size: image.file.size,
				},
				s3_optimized: {
					key: uploadResultOptimized.fileKey,
					size: processedFile.size,
				},
				s3_thumbnail_300w: {
					key: uploadResultThumbnail.fileKey, // ✅ Now has correct path
				},
				watermark: {
					applied: info.isWaterMarkApply,
					profile: info.watermarkProfileId ?? null,
					position: info.watermarkPosition.name,
				},
				originalWidth,
				originalHeight,
				originalFormat,
				originalDateTime,
			},
		};
	};

	const onSaveClick = () => {
		message.success('Watermark settings saved locally');
	};

	return (
		<div className="upload-gallery-container">
			<div
				onClick={() =>
					navigate(`/galleries/${galleryId}?albumId=${albumId}&activeTab=Albums`)
				}
				className="backHeader"
			>
				<BackIcon /> <p>{info.title}</p>
				<p className="beta-notice">
					Desktop uploads are currently in beta, you may experience some issues.
				</p>
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
				setinfo={setInfo}
				getImageDuplicatesList={getImageDuplicatesList}
			/>
		</div>
	);
};

export default memo(UploadPhotosDesktop);
