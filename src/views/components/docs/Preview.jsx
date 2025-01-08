import React, { memo } from 'react';

const Preview = () => {
	return (
		<div className="previewContainer">
			<div style={{ width: '100%', height: '100%' }}>
				<iframe
					// src={`${origin}/preview/${globalTemplateId}?module=${e?._id}&isPubic=${e?.isPublic}&restrictClick=true`}
					src={``}
					title="Builder Preview"
					width="100%"
					height="100%"
				/>
			</div>
		</div>
	);
};

export default memo(Preview);
