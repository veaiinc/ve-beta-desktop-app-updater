import { memo } from 'react';

const CheckMobileView = ({ updatePreviewOption }) => {
	return (
		<div className="updateClientPopup">
			<div className="checkMobileViewWrapper">
				<div className="checkMobileViewWrapperTitle">
					Are you sure you don't want to check mobile view
				</div>
				<div className="checkMobileViewWrapperContent">
					<span
						onClick={(e) => {
							e.stopPropagation();
							updatePreviewOption('yes');
						}}
					>
						Check later
					</span>
					<span
						onClick={(e) => {
							e.stopPropagation();
							updatePreviewOption('no');
						}}
					>
						Check now
					</span>
				</div>
			</div>
		</div>
	);
};

export default memo(CheckMobileView);
