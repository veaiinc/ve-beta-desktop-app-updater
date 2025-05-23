import React from 'react';
import { ReactComponent as CloudFileUploadSvg } from '../../../../assets/svg/Settings/CloudUpload.svg';
import Dropzone from 'react-dropzone';

const UploadInputComponent = ({ onDropFunction }) => {
	const acceptedFileTypes = {
		'image/png': ['.png'],
		'image/jpeg': ['.jpg', '.jpeg'],
	};

	return (
		<Dropzone
			onDrop={onDropFunction}
			accept={acceptedFileTypes}
			multiple={true}
			// disabled={!isAdmin}
		>
			{({ getRootProps, getInputProps }) => (
				<div
					className="upload-photos-container"
					{...getRootProps()}
					// style={{ cursor: !isAdmin ? 'not-allowed' : '' }}
				>
					<input {...getInputProps()} />
					<div className="upload-brand-placeholder">
						<input
							type="file"
							style={{
								opacity: 0,
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								cursor: 'pointer',
							}}
							accept={['image/png', 'image/jpeg']}
							{...getInputProps()}
						/>
						<div className="icon_name_div">
							<CloudFileUploadSvg />
							<p>
								Click to Upload file or Drag your files Only *.jpeg and *.png images
								will be accepted
							</p>
						</div>
					</div>
				</div>
			)}
		</Dropzone>
	);
};

export default UploadInputComponent;
