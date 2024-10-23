import React from 'react';
import { ReactComponent as UploadButtonSvg } from '../../../../assets/svg/gallery/upload_gray.svg';

const UploadStatusComponent = () => {
	return (
		<div className="upload_status_container">
			<div className="header_upload_div">
				<div className="text_div">
					<h1>0 Images added - 0 MB </h1>
					<p>Max amount 10,000 photos</p>
				</div>

				<button className="upload_button">
					<UploadButtonSvg />
					<p>Start upload</p>
				</button>
			</div>
		</div>
	);
};

export default UploadStatusComponent;
