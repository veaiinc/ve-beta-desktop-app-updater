import React from 'react';
import '../../../assets/scss/gallery/uploadGallery.scss';
import AddLables from '../../components/gallery/addGallery/AddLablesComponent';
import UploadInputComponent from '../../components/gallery/addGallery/UploadInputComponent';
import { ReactComponent as BackIcon } from '../../../assets/svg/gallery/back-gray.svg';
import WaterMarkComponent from '../../components/gallery/addGallery/WaterMarkComponent';
import UploadStatusComponent from '../../components/gallery/addGallery/UploadStatusComponent';

const UploadPhotos = () => {
	// const [info, setinfo] = useState({

	// })
	return (
		<div className="upload-gallery-container">
			<div className="backHeader">
				<BackIcon /> <p>Swarthika + Akhil - Wedding shoot</p>
			</div>

			<div className="options_upload_container">
				<AddLables />
				<UploadInputComponent />
			</div>

			<div className="watermark_progress_container">
				<WaterMarkComponent />
				<UploadStatusComponent />
			</div>
		</div>
	);
};

export default UploadPhotos;
