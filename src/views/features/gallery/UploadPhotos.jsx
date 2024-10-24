import React, { useState } from 'react';
import '../../../assets/scss/gallery/uploadGallery.scss';
import AddLables from '../../components/gallery/addGallery/AddLablesComponent';
import UploadInputComponent from '../../components/gallery/addGallery/UploadInputComponent';
import { ReactComponent as BackIcon } from '../../../assets/svg/gallery/back-gray.svg';
import WaterMarkComponent from '../../components/gallery/addGallery/WaterMarkComponent';
import UploadStatusComponent from '../../components/gallery/addGallery/UploadStatusComponent';
import randomize from 'randomatic';

const UploadPhotos = () => {
	const [info, setinfo] = useState({
		applyWaterMark: false,
		initialUpload: false,
		startedUploading: false,
		uploadImages: {},
		uploadSize: 0,
		uploadLimit: 5,
		recentImageInitiated: null,
		isSkipDuplicates: false,
		uploadBatchID: randomize('Aa0', 10),
		selectedGalleryTags: [],
	});

	// drop function
	const onDropFunction = async (files) => {
		let updateInfo = { ...info };

		if (updateInfo?.initialUpload) {
			updateInfo.initialUpload = true;
		}

		files?.map((file) => {
			let uploadedImages = { ...updateInfo?.uploadImages };

			let findDuplicateImage = info?.checkDuplicateImages?.find(
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
				updateInfo.uploadSize = (updateInfo.uploadSize + file.size) / 1024; // Convert to KB

				// if (galleryImages.some((image) => image.displayName === file.name)) {
				// 	setDuplciatesFound((prevCount) => prevCount + 1);
				// }
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

		setinfo(updateInfo);
	};

	// const triggerUploadImages = async () => {
	// 	const imageKeysArray = Object.keys(info?.uploadImages);

	// 	const imageKeyIndex =
	// 		info?.recentImageInitiated !== null
	// 			? imageKeysArray[imageKeysArray.indexOf(info?.recentImageInitiated) + 1]
	// 			: imageKeysArray[0];
	// 	const image = info?.uploadImages[imageKeyIndex];

	// 	const imageName = image.file.name;

	// 	// const tags = info.selectedGalleryTags.map(tag => tag != null ? tag._id : '').filter(Boolean);

	// 	const json = {
	// 		originalFileName: imageName,
	// 		originalDateTime: moment(image['originalDate']).unix(),
	// 		uploadBatchId: info.uploadBatchID,
	// 		tag_ids: tags,
	// 		isAIFacesEnabled: info.isFaceIdEnabled,
	// 	};

	// 	if (image.isDuplicate === true && info.isSkipDuplicates === false) {
	// 		json = {
	// 			...json,
	// 			image_id: image.originalImage._id,
	// 		};
	// 	}

	// 	if (info.isWaterMarkApply) {
	// 		json = {
	// 			...json,
	// 			watermarkPosition: info.watermarkPosition,
	// 			watermarkProfileId: info.isWaterMarkApply ? info.watermarkProfileId : null,
	// 		};
	// 	}

	// 	setInfo(
	// 		{
	// 			...info,
	// 			recentImageInitiated: imageName,
	// 			currentUpload:
	// 				(info.isSkipDuplicates === true && image.isDuplicate === false) ||
	// 				info.isSkipDuplicates === false
	// 					? info.currentUpload + 1
	// 					: info.currentUpload,
	// 		},
	// 		async () => {
	// 			if (
	// 				info.currentUpload <= info.uploadLimit &&
	// 				imageKeysArray.indexOf(info.recentImageInitiated) + 1 !==
	// 					Object.keys(info.uploadedImages).length
	// 			) {
	// 				triggerUploadImages();
	// 			}

	// 			if (
	// 				(info.isSkipDuplicates === true && image.isDuplicate === false) ||
	// 				info.isSkipDuplicates === false
	// 			) {
	// 				await uploaderActions(json, imageName);
	// 			}
	// 		},
	// 	);
	// };

	return (
		<div className="upload-gallery-container">
			<div className="backHeader">
				<BackIcon /> <p>Swarthika + Akhil - Wedding shoot</p>
			</div>

			<div className="options_upload_container">
				<AddLables info={info} setinfo={setinfo} />
				<UploadInputComponent onDropFunction={onDropFunction} />
			</div>

			<div className="watermark_progress_container">
				<WaterMarkComponent />
				<UploadStatusComponent
					info={info}
					setinfo={setinfo}
					triggerUploadImages={() => {
						return;
					}}
				/>
			</div>
		</div>
	);
};

export default UploadPhotos;
