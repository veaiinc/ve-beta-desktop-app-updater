import React from 'react';
import { ReactComponent as UploadButtonSvg } from '../../../../assets/svg/gallery/upload_gray.svg';
import { ReactComponent as CancelUploadSvg } from '../../../../assets/svg/gallery/cancel-bold-gray.svg';
import { Progress } from 'antd';
import DuplicateComponent from './DuplicateComponent';

const UploadStatusComponent = ({ info, setinfo, triggerUploadImages }) => {
	// func for removing the image
	const deleteFromUploads = (fileName) => {
		const update = { ...info };
		delete update.uploadImages[fileName];
		setinfo(update);
	};

	// submit handler
	const uploadPhotosSubmitHandler = () => {
		let imageCount = Object.keys(info?.uploadImages || {}).length;
		setinfo({
			startedUploading: imageCount > 0 ? true : false,
		});

		if (imageCount > 0) triggerUploadImages();
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '50%', gap: '12px' }}>
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
							{info?.uploadSize.toFixed(2)} MB{' '}
						</h1>
						<p>Max amount 10,000 photos</p>
					</div>

					{info?.startedUploading ? (
						<div className="overall_percentage">
							<div className="progress">
								<Progress percent={50} showInfo={false} />
							</div>

							<div className="text_value">
								<p>40 MB</p>
							</div>
						</div>
					) : (
						<button
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

				<div className="body_upload_div">
					<div className="line_div"></div>

					{Object.entries(info?.uploadImages || {}).map(([key, singlePhoto]) => (
						<div className="single_file_detail" key={key}>
							<div className="fileName">{singlePhoto?.file?.name}</div>

							<div className="progress_div">
								<div className="text_value">
									<p>{(singlePhoto?.file?.size / 1024).toFixed(2)} KB</p>
								</div>

								{info?.startedUploading && (
									<div className="progress">
										<Progress percent={50} showInfo={false} />
									</div>
								)}

								<CancelUploadSvg onClick={() => deleteFromUploads(key)} />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default UploadStatusComponent;
