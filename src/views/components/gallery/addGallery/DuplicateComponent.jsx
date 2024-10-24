import React from 'react';
import { Switch } from 'antd';

const DuplicateComponent = ({ info, setinfo }) => {
	const onChangeHandler = (checked) => {
		if (info?.isSkipDuplicates === checked) return;
		setinfo((prev) => ({ ...prev, isSkipDuplicates: checked }));
	};

	return (
		<div className="duplicate_div" style={{ width: '100%' }}>
			<div className="text_div">
				<h1>Skip Duplicates</h1>
				<p>Automatically remove photos with the same file name.</p>
				<p>
					{
						Object.keys(info?.uploadImages || {}).filter(
							(key) => info.uploadImages[key]?.isDuplicate,
						)?.length
					}{' '}
					Duplicates Found
				</p>
			</div>
			<Switch
				checked={info?.isSkipDuplicates || false}
				onChange={onChangeHandler}
				disabled={info?.startedUploading}
			/>
		</div>
	);
};

export default DuplicateComponent;
