import React, { memo } from 'react';
import { fetchOriginSelection } from '../../../helpers';
let origin = fetchOriginSelection();

const Preview = ({ data }) => {
	return (
		<div className="previewContainer">
			<div style={{ width: '100%', height: '100%' }}>
				<iframe
					src={`${origin}/preview/${data?._id}?workflow=true`}
					title="Builder Preview"
					width="100%"
					height="100%"
				/>
			</div>
		</div>
	);
};

export default memo(Preview);
