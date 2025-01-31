import React, { memo, useContext } from 'react';
import { ReactComponent as UploadButtonSvg } from '../../../../assets/svg/gallery/upload_gray.svg';
import { ReactComponent as CancelUploadSvg } from '../../../../assets/svg/gallery/cancel-bold-gray.svg';
import { Progress } from 'antd';
import DuplicateComponent from './DuplicateComponent';
import Context from '../../../../context/context';
import { getImageSizeFormat } from '../../../../helpers';

const UploadStatusComponent = ({ info, setinfo, uploadFilesConcurrently, galleryId }) => {
	const {
		galleryInfo: { setUpImageUpload },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);
	// func for removing the image
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
			validateExpiryData &&
			validateExpiryData?.restrictGalleries &&
			(validateExpiryData?.isExpired || !validateExpiryData?.uploadAllowed)
		) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		}
		e.preventDefault();
		let imageCount = Object.keys(info?.uploadImages || {}).length;
		if (imageCount <= 0) return;

		const payload = {
			expectedImages: imageCount,
			uploadBatchId: info?.uploadBatchID,
		};

		setUpImageUpload(galleryId, payload);

		uploadFilesConcurrently();
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px' }}>
			<DuplicateComponent info={info} setinfo={setinfo} />

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
						<p>Max amount 10,000 photos</p>
					</div>

					{info?.startedUploading ? (
						<div className="overall_percentage">
							<div className="progress">
								<Progress percent={info?.overAllProgress} showInfo={false} />
							</div>

							<div className="text_value">{info?.overAllProgress}%</div>
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
