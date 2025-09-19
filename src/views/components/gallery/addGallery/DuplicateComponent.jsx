import React, { memo } from 'react';
import { Switch, Spin } from 'antd';

const DuplicateComponent = ({ info, setinfo, imageDuplicatesList }) => {
	const onChangeHandler = (checked) => {
		if (info?.isSkipDuplicates === checked || info?.startedUploading) return;
		setinfo((prev) => ({ ...prev, isSkipDuplicates: checked }));
	};

	// Show loading state if we have files but duplicate list is not loaded yet
	const isCheckingDuplicates =
		Object.keys(info?.uploadImages || {}).length > 0 && !imageDuplicatesList;

	return (
		<>
			{(info?.duplciatesFound > 0 || isCheckingDuplicates) && (
				<div className="duplicate_div" style={{ width: '100%' }}>
					<div className="text_div">
						<h1>Skip Duplicates</h1>
						<p>Automatically remove photos with the same file name.</p>
						{isCheckingDuplicates ? (
							<p>
								<Spin size="small" style={{ marginRight: '8px' }} />
								Checking for duplicates...
							</p>
						) : (
							<p>{info?.duplciatesFound} Duplicates Found</p>
						)}
					</div>
					<Switch
						checked={info?.isSkipDuplicates || false}
						onChange={onChangeHandler}
						disabled={info?.startedUploading || isCheckingDuplicates}
					/>
				</div>
			)}
		</>
	);
};

export default memo(DuplicateComponent);
