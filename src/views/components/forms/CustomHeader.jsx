import { memo } from 'react';
import { ReactComponent as DownloadIcon } from '../../../assets/svg/download.svg';
const CustomHeader = ({ name, handleDownload }) => {
	const handleDownloadClick = () => {
		handleDownload();
	};
	return (
		<div className="modal-actions">
			<h3 className="file-name">{name}</h3>
			<div
				className="download-button"
				onClick={handleDownloadClick}
				style={{ cursor: 'pointer' }}
			>
				<DownloadIcon />
				<span>Download</span>
			</div>
		</div>
	);
};
export default memo(CustomHeader);
