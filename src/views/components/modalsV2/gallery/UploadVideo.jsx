import { memo } from 'react';
import '../../../../assets/scss/gallery/modals/uploadVideo.scss';
import ReactModal from '../index';

const customStyles = {
	content: { zIndex: 999 },
	overlay: { zIndex: 998 },
};
const VideoUploadPopup = () => {
	return (
		<ReactModal isOpen={true} closeModal={closeModal} customStyles={customStyles}></ReactModal>
	);
};

export default memo(VideoUploadPopup);
