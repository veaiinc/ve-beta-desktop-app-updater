import { useState, memo, useCallback } from 'react';
import { Modal } from 'antd';
import CloseIcon from '../../../assets/svg/close.svg?react';
import '../../../assets/scss/forms/formPreview.scss';
import CustomHeader from './CustomHeader';
const FormPreview = ({ file, onClose }) => {
	const [isModalVisible, setIsModalVisible] = useState(true);
	const { name, fileURL, type } = file || {};

	const handleClose = () => {
		setIsModalVisible(false);
		onClose?.();
	};

	const handleDownload = useCallback(async () => {
		if (!fileURL) return;

		try {
			const response = await fetch(fileURL);
			const blob = await response?.blob();
			const blobUrl = window?.URL?.createObjectURL(blob);

			const link = document?.createElement('a');
			link.href = blobUrl;
			link.download = name || 'download';

			document?.body?.appendChild(link);
			link.click();

			document?.body?.removeChild(link);
			window?.URL?.revokeObjectURL(blobUrl);
		} catch (error) {
			console.error('Error downloading file:', error);

			const link = document?.createElement('a');
			link.href = fileURL;
			link.download = name || 'download';
			link.target = '_blank';
			document?.body?.appendChild(link);
			link.click();
			document?.body?.removeChild(link);
		}
	}, [fileURL, name]);

	const isImage = type?.startsWith('image/') || type === 'image';

	return (
		<Modal
			open={isModalVisible}
			onCancel={handleClose}
			footer={null}
			width={800}
			className="form-preview-modal"
			closeIcon={<CloseIcon />}
			centered
			title={<CustomHeader name={name} handleDownload={handleDownload} />}
		>
			<div className="preview-container">
				{isImage ? (
					<img src={fileURL} alt={name} className="preview-image" />
				) : (
					<div className="preview-document">
						<iframe src={fileURL} title={name} className="preview-iframe" />
					</div>
				)}
			</div>
		</Modal>
	);
};
export default memo(FormPreview);
