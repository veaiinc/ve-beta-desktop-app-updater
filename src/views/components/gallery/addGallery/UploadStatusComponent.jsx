import React, { memo, useContext, useEffect } from 'react';
import { ReactComponent as UploadButtonSvg } from '../../../../assets/svg/gallery/upload_gray.svg';
import { ReactComponent as CancelUploadSvg } from '../../../../assets/svg/gallery/cancel-bold-gray.svg';
import { Progress } from 'antd';
import DuplicateComponent from './DuplicateComponent';
import AiEnabledSwitch from './AiEnabledSwitch';
import Context from '../../../../context/context';
import { getImageSizeFormat } from '../../../../helpers';
import { message } from '../../globalComponents/CustomToast';
import { ReactComponent as WarningIcon } from '../../../../assets/svg/custom_toast/warning.svg';

const UploadStatusComponent = ({
	info,
	setinfo,
	uploadFilesConcurrently,
	galleryId,
	aiFacesLogic,
	lightGallery,
}) => {
	const {
		galleryInfo: { setUpImageUpload, tenantAlbums, imageDuplicatesList },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState, currentPlan },
	} = useContext(Context);
	// func for removing the image
	// const params = new URLSearchParams(window.location.search);
	// const lightGallery = params.get('light-gallery');

	// const aiFacesLogic = info?.isAiEnabled
	// 	? Object.keys(info?.uploadImages).length > validateExpiryData?.liteImageLimitWithAiFace
	// 	: false;

	const deleteFromUploads = (fileName) => {
		const update = { ...info };
		const image = update.uploadImages[fileName];
		if (image?.isDuplicate) {
			update.duplciatesFound -= 1;
		}
		update.uploadSize -= image.file.size / 1024;
		delete update.uploadImages[fileName];
		setinfo(update);
	};

	const uploadPhotosSubmitHandler = (e) => {
		if (
			lightGallery === 'true' &&
			validateExpiryData?.restrictGalleries &&
			(validateExpiryData?.liteImagesLimit <= validateExpiryData?.liteImageUsed ||
				(info?.isAiEnabled && validateExpiryData?.liteImageLimitWithAiFace === 0)) &&
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
			validateExpiryData?.totalStorageUsedInGB >= validateExpiryData?.storageLimitInGB &&
			!validateExpiryData?.uploadAllowed
		) {
			return updateSubscriptionState({
				expiredSubscriptionModal: true,
				expiredSubscriptionType: 'Classic-Gallery',
			});
		}
		e.preventDefault();
		let imageCount = Object.keys(info?.uploadImages || {}).length;
		if (imageCount <= 0) return;

		if (tenantAlbums?.storageDetails?.imagesCount + imageCount > 10000 && !lightGallery) {
			message.error('You are exceeding the maximum limit of 10,000 photos');
			return;
		}
		const payload = {
			expectedImages: imageCount,
			uploadBatchId: info?.uploadBatchID,
		};

		// setUpImageUpload(galleryId, payload);

		uploadFilesConcurrently();
	};
	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
			{lightGallery === 'true' && (
				<AiEnabledSwitch
					isAiEnabled={info?.isAiEnabled}
					isProcessing={info?.startedUploading}
					setinfo={setinfo}
				/>
			)}
			<DuplicateComponent
				info={info}
				setinfo={setinfo}
				imageDuplicatesList={imageDuplicatesList}
			/>
			{lightGallery === 'false' && currentPlan?.isAIFacesEnabled === false && (
				<div className="upload_status_aiface">
					<WarningIcon />
					Uploaded Images Will not be Processed by AI
				</div>
			)}
			<div className="upload_status_container">
				<div
					className="header_upload_div"
					style={{
						flexDirection: info?.startedUploading ? 'column' : 'row',
						alignItems: info?.startedUploading ? 'start' : 'center',
						gap: info?.startedUploading ? '16px' : '',
					}}
				>
					<div className="text_div">
						<h1>
							{Object.keys(info?.uploadImages || {}).length} Images added -{' '}
							{getImageSizeFormat(info?.uploadSize)}
						</h1>
						{!lightGallery && (
							<p>
								Max amount {10000 - tenantAlbums?.storageDetails?.imagesCount}{' '}
								photos
							</p>
						)}
					</div>

					{info?.startedUploading ? (
						<div className="overall_percentage">
							<div className="progress">
								<Progress percent={info?.overAllProgress} showInfo={false} />
							</div>

							<div className="text_value">{info?.overAllProgress.toFixed(2)}%</div>
						</div>
					) : (
						<button
							type="button"
							className={`upload_button ${
								Object.keys(info?.uploadImages || {}).length
									? 'activeButton'
									: 'inactiveButton'
							}`}
							onClick={uploadPhotosSubmitHandler}
						>
							<UploadButtonSvg />
							<p>Start upload</p>
						</button>
					)}
				</div>

				{Object.entries(info?.uploadImages || {}).length > 0 && (
					<>
						<div className="line_div"></div>
						<div className="body_upload_div">
							{Object.entries(info?.uploadImages || {}).map(([key, singlePhoto]) => (
								<div className="single_file_detail" key={key}>
									<div
										className="fileName"
										style={{ color: singlePhoto?.isFailed ? '#c84545' : '' }}
									>
										{singlePhoto?.file?.name}
									</div>

									<div className="progress_div">
										{singlePhoto?.isDuplicate && (
											<div className="text_value">
												<p>Duplicate || </p>
											</div>
										)}

										<div className="text_value">
											{/* <p>
												{singlePhoto?.file?.size > 1024 * 1024
													? (
															singlePhoto?.file?.size /
															(1024 * 1024)
													  ).toFixed(2) + ' MB'
													: (singlePhoto?.file?.size / 1024).toFixed(2) +
													  ' KB'}
											</p> */}
											<p
												style={{
													color: singlePhoto?.isFailed ? '#c84545' : '',
												}}
											>
												{getImageSizeFormat(singlePhoto?.file?.size / 1024)}
											</p>
										</div>

										{info?.startedUploading && (
											<div className="progress">
												<Progress
													percent={singlePhoto?.uploadedPerct}
													showInfo={false}
												/>
											</div>
										)}
										{(!singlePhoto?.isUploaded ||
											singlePhoto?.uploadedPerct === 0) && (
											<CancelUploadSvg
												onClick={() => deleteFromUploads(key)}
											/>
										)}
									</div>
								</div>
							))}
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default UploadStatusComponent;
