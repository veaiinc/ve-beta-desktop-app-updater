import React from 'react';
import ReactModal from '../../modalsV2';
import randomize from 'randomatic';

const UploadCompletedPopup = ({ info, setinfo }) => {
	const reUploadFunction = () => {
		setinfo((prev) => ({
			...prev,
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
			currentUpload: 1,
			recentImageInitiated: null,
			isSkipDuplicates: false,
			uploadBatchID: randomize('Aa0', 10),
			duplciatesFound: 0,
			uploadStatus: { processedCount: 0, uploadedCount: 0 },
			overAllProgress: 0,
			isPopupOpen: false,
		}));
	};
	return (
		<ReactModal isOpen={info.isPopupOpen} closeModal={() => {}}>
			<div className="upload-completed-popup">
				<h1>Upload Completed</h1>

				<div className="options_div">
					<button className="back-to-gallery-button">Back to Gallery</button>
					<button onClick={reUploadFunction}>Re-Upload</button>
				</div>
			</div>
		</ReactModal>
	);
};

export default UploadCompletedPopup;
