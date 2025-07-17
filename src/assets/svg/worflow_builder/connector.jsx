import React, { memo } from 'react';

const ConnectorSvg = ({ height }) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="2"
		height={height || '64'}
		viewBox="0 0 2 64"
		fill="none"
	>
		<path d="M1 0V64" stroke="#414141" strokeDasharray="8 8" />
	</svg>
);

export default memo(ConnectorSvg);
