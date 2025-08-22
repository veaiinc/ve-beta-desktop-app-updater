import { memo } from 'react';

const CheckMobileView = ({ updatePreviewOption, isAutoSaving }) => {
	return (
		<div className="updateClientPopup">
			<div className="checkMobileViewWrapper">
				<div className="checkMobileViewWrapperTitle">
					Are you sure you don't want to check mobile view
				</div>
				<div className="checkMobileViewWrapperContent">
					<button
						onClick={(e) => {
							e.stopPropagation();
							updatePreviewOption('yes');
						}}
						style={{
							opacity: isAutoSaving ? 0.5 : 1,
							cursor: isAutoSaving ? 'not-allowed' : 'pointer',
						}}
						disabled={isAutoSaving}
					>
						Check later
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							updatePreviewOption('no');
						}}
						style={{
							opacity: isAutoSaving ? 0.5 : 1,
							cursor: isAutoSaving ? 'not-allowed' : 'pointer',
						}}
						disabled={isAutoSaving}
					>
						Check now
					</button>
				</div>
			</div>
		</div>
	);
};

export default memo(CheckMobileView);
