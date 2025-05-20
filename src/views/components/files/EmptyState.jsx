import { memo } from 'react';
import '../../../assets/scss/files/emptyState.scss';
import UploadSvg from '../../../assets/svg/files/uploadSvg.svg?react';
const EmptyState = ({ title, subtitle, buttonText, buttonOnClick, showUpload = false }) => {
	return (
		<div className="file-empty-satate">
			<div className="file-empty-satate-title">{title}</div>
			<div className="file-empty-satate-sub-title">{subtitle}</div>
			{/* <button onClick={buttonOnClick} className="file-empty-satate-button">
				{showUpload ? <UploadSvg /> : null}
				{buttonText}
			</button> */}
		</div>
	);
};

export default memo(EmptyState);
