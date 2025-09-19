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
import ReactModal from '../../components/modalsV2';

const UploadPhotosDesktop = ({ open, closeModal, galleryId, albumId, tagId, onStartUpload }) => {
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
		uploadBatchID: randomize('Aa0', 10), // Will be regenerated per session
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

	// Reset state when modal opens
	useEffect(() => {
		if (open) {
			setInfo((prev) => ({
				...prev,
				uploadImages: {},
				uploadBatchID: randomize('Aa0', 10), // Fresh batch ID on open
				duplciatesFound: 0,
				startedUploading: false,
				isUploadComplete: false,
				overAllProgress: 0,
				processedCount: 0,
			}));
		}
	}, [open]);

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
			let thumbnail100hFile = null;
			let processedBuffer = null;
			let thumbnailBuffer = null;
			let thumbnail100hBuffer = null;

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

			// --- Process Thumbnail 100h (NO watermark, cropped to 100px height) ---
			const resultThumbnail100h = await window.electronApi.processImageWithSharp({
				imageBuffer: Array.from(uint8Array),
				watermarkUrl: null,
				watermarkPosition: info.watermarkPosition,
				scale: 0.15,
				opacity: 1,
				isWaterMarkApply: false,
				resizeOptions: { height: 100, fit: 'cover', position: 'center' },
				quality: 70,
				forceJpeg: true,
			});

			if (!resultThumbnail100h.success) throw new Error(resultThumbnail100h.error);

			thumbnail100hBuffer = Uint8Array.from(atob(resultThumbnail100h.processedImage), (c) =>
				c.charCodeAt(0),
			);
			thumbnail100hFile = new File(
				[thumbnail100hBuffer],
				`thumb100_${originalFile.name.split('.')[0]}.jpg`,
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
				thumbnail100hFile,
				width,
				height,
				format,
				originalDateTime,
				originalSize: originalFile.size,
				processedSize: processedBuffer.length,
				thumbnailSize: thumbnailBuffer.length,
				thumbnail100hSize: thumbnail100hBuffer.length,
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

	// ✅ CRITICAL: Start upload with unique session & batch ID
	const startUploadWithPopup = () => {
		const nonDuplicates = Object.keys(info.uploadImages).filter(
			(key) => !(info.isSkipDuplicates && info.uploadImages[key].isDuplicate),
		);

		if (nonDuplicates.length === 0) {
			message.error('No files to upload');
			return;
		}

		// ✅ Generate UNIQUE identifiers for this upload session
		const newUploadBatchID = randomize('Aa0', 10);
		const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

		// Get watermark URL
		const watermarkUrl = (() => {
			const wm = waterMarks?.find(
				(watermark) => watermark.profileId === info.watermarkProfileId,
			);
			return wm?.url || null;
		})();

		// Get album name from tenantAlbums
		const albumName =
			tenantAlbums?.albums?.find((album) => album._id === albumId)?.title || 'Unknown Album';

		// Prepare upload data for the persistent popup
		const uploadData = {
			id: sessionId, // ✅ Unique session ID — critical for UploadProgressPopup
			galleryId,
			albumId,
			albumName, // ✅ Include actual album name
			uploadBatchID: newUploadBatchID, // ✅ Unique batch ID per session
			tenantId: tenantAlbums?.tenant_id,
			files: nonDuplicates.map((key) => ({
				file: info.uploadImages[key].file,
				isDuplicate: info.uploadImages[key].isDuplicate,
				originalImage: info.uploadImages[key].originalImage,
				status: 'pending',
				progress: 0,
			})),
			settings: {
				isWaterMarkApply: info.isWaterMarkApply,
				watermarkProfileId: info.watermarkProfileId,
				watermarkUrl,
				watermarkPosition: info.watermarkPosition,
				scaleWatermark: info.scaleWatermark,
				watermarkOpacity: info.watermarkOpacity,
				selectedGalleryTags: info.selectedGalleryTags,
				isAiEnabled: info.isAiEnabled,
				isSkipDuplicates: info.isSkipDuplicates,
			},
		};

		// Close the modal
		closeModal();

		// Trigger global upload via context
		if (onStartUpload) {
			onStartUpload(uploadData);
		}

		// ✅ Reset local upload state for next session
		setInfo((prev) => ({
			...prev,
			uploadImages: {}, // Clear uploaded files
			uploadBatchID: randomize('Aa0', 10), // Prepare new batch ID for next time
			duplciatesFound: 0,
			startedUploading: false,
			isUploadComplete: false,
			overAllProgress: 0,
		}));
	};

	// --- Generate Payload (unchanged) ---
	const generateUploadPayload = (
		image,
		processedFile,
		imageId,
		policyData,
		uploadResultOriginal,
		uploadResultOptimized,
		uploadResultThumbnail300w,
		uploadResultThumbnail100h,
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
					key: uploadResultThumbnail300w.fileKey,
				},
				s3_thumbnail_100h: {
					key: uploadResultThumbnail100h.fileKey,
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
		<ReactModal isOpen={open} closeModal={closeModal}>
			<div
				className="upload-gallery-container"
				style={{
					width: '100vw',
					height: '100vh',
					backgroundColor: 'var(--background-color)',
				}}
			>
				<div onClick={() => closeModal()} className="backHeader">
					<BackIcon /> <p>{info.title}</p>
					<p className="beta-notice">
						Desktop uploads are currently in beta, you may experience some issues.
					</p>
				</div>
				<div className="options_upload_container">
					<AddLables
						info={info}
						setinfo={setInfo}
						searchParams={searchParams}
						albumId={albumId}
						galleryId={galleryId}
						tagId={tagId}
					/>
					<UploadInputComponent onDropFunction={onDropFunction} />
				</div>
				<div className="watermark_progress_container">
					<WaterMarkComponent
						setinfo={setInfo}
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
						setinfo={setInfo}
						uploadFilesConcurrently={startUploadWithPopup} // ✅ Now points to fixed function
						galleryId={galleryId}
						aiFacesLogic={aiFacesLogic}
						lightGallery={lightGallery}
					/>
				</div>
				<UploadCompletedPopup
					info={info}
					setinfo={setInfo}
					getImageDuplicatesList={getImageDuplicatesList}
					onClose={closeModal}
				/>
			</div>
		</ReactModal>
	);
};

export default memo(UploadPhotosDesktop);
