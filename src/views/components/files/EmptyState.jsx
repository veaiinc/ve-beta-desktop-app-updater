import { memo } from 'react';
import '../../../assets/scss/files/emptyState.scss';
import { ReactComponent as UploadSvg } from '../../../assets/svg/files/uploadSvg.svg';

const EmptyState = ({ title, subtitle, buttonOnClick, buttonText, showUpload = false }) => {
	return (
		<div className="file-empty-satate">
			<div className="file-empty-satate-title">{title}</div>
			<div className="file-empty-satate-sub-title">{subtitle}</div>
			<button onClick={buttonOnClick} className="file-empty-satate-button">
				{showUpload ? <UploadSvg /> : null}
				{buttonText}
			</button>
		</div>
	);
};

export default memo(EmptyState);
