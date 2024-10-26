import React, { useState, useContext, useEffect } from 'react';
import '../../../assets/scss/gallery/uploadGallery.scss';
import AddLables from '../../components/gallery/addGallery/AddLablesComponent';
import UploadInputComponent from '../../components/gallery/addGallery/UploadInputComponent';
import { ReactComponent as BackIcon } from '../../../assets/svg/gallery/back-gray.svg';
import WaterMarkComponent from '../../components/gallery/addGallery/WaterMarkComponent';
import UploadStatusComponent from '../../components/gallery/addGallery/UploadStatusComponent';
import randomize from 'randomatic';
import moment from 'moment';
import Context from '../../../context/context';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UploadPhotos = () => {
	const { galleryId, albumId } = useParams();

	const {
		galleryInfo: {
			getUploadImageSignUrl,
			getImageUploadStatus,
			imageDuplicatesList,
			getWaterMarks,
			waterMarks,
		},
	} = useContext(Context);

	const [info, setinfo] = useState({
		isWaterMarkApply: false,
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
		uploadLimit: 2,
		currentUpload: 1,
		recentImageInitiated: null,
		isSkipDuplicates: false,
		uploadBatchID: randomize('Aa0', 10),
		selectedGalleryTags: [],
		duplciatesFound: 0,
	});

	useEffect(() => {
		if (!waterMarks) {
			getWaterMarks();
		} else if (waterMarks && waterMarks?.length > 0) {
			setinfo((prev) => ({ ...prev, watermarkProfileId: waterMarks[0].profileId }));
		}
	}, [waterMarks]);

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

	const getJsonFunction = (currentImagge) => {
		const imageKeysArray = Object.keys(info?.uploadImages);

		const imageKeyIndex =
			info?.recentImageInitiated !== null
				? imageKeysArray[imageKeysArray.indexOf(currentImagge) + 1]
				: imageKeysArray[0];
		const image = info?.uploadImages[imageKeyIndex];
		if (image && image.isUploaded) return null;

		const imageName = image?.file?.name || '';

		const tags = info?.selectedGalleryTags?.map((tag) => (tag != null ? tag._id : ''));

		let json = {
			originalFileName: imageName,
			originalDateTime: moment(image['originalDate']).unix(),
			uploadBatchId: info.uploadBatchID,
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

		setinfo((prev) => ({
			...prev,
			recentImageInitiated: imageName,
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
					console.log(percent, key);

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
		setinfo((prev) => ({
			...prev,
			startedUploading: true,
		}));

		setInterval(async () => {
			const response = await getImageUploadStatus(galleryId, albumId, info?.uploadBatchID);
			console.log(response);
		}, 3000);

		const queue = Object.keys(info.uploadImages);
		const activeUploads = [];

		const nextUploadFunc = async () => {
			if (queue.length === 0) return;

			const currentFile = queue.shift();
			const json = getJsonFunction(currentFile);
			const signedURLUpload = await getUploadImageSignUrl(galleryId, albumId, json);
			if (signedURLUpload[0] === true) {
				// Push the upload promise to activeUploads
				const uploadPromise = uploadOnS3Function(
					info.uploadImages[currentFile],
					currentFile,
					signedURLUpload[1]['signedUrl'],
				);
				activeUploads.push(uploadPromise); // Add this line

				// Wait for the upload to complete and get the result
				const isSuccessUpload = await uploadPromise;

				if (isSuccessUpload) {
					// Remove the promise from activeUploads if successful
					activeUploads.splice(activeUploads.indexOf(uploadPromise), 1);
				}
				nextUploadFunc(); // Call nextUploadFunc regardless of success
			}
		};

		for (let i = 0; i < 2 && queue.length > 0; i++) {
			nextUploadFunc();
		}

		await Promise.allSettled(activeUploads);
	};

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
				<WaterMarkComponent info={info} setinfo={setinfo} waterMarks={waterMarks} />
				<UploadStatusComponent
					info={info}
					setinfo={setinfo}
					// triggerUploadImages={triggerUploadImages}
					uploadFilesConcurrently={uploadFilesConcurrently}
				/>
			</div>
		</div>
	);
};

export default UploadPhotos;
