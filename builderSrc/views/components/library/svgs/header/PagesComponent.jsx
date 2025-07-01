// import React from 'react';

const PagesComponent = (props) => {
	return (
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
			>
				<path
					d="M7.82812 3.66406H15.7465L19.4973 7.41488V17.8338"
					stroke="#E8E8E8"
					strokeWidth="1.27632"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M4.5 19.0855V7.41629C4.5 7.08469 4.63172 6.76668 4.8662 6.53221C5.10067 6.29774 5.41868 6.16602 5.75027 6.16602H13.8787C14.0113 6.16613 14.1384 6.2189 14.2321 6.31271L16.856 8.93662C16.9027 8.98321 16.9396 9.03857 16.9648 9.09951C16.99 9.16044 17.0029 9.22576 17.0027 9.29169V19.0855C17.0027 19.4171 16.871 19.7351 16.6365 19.9696C16.402 20.204 16.084 20.3358 15.7524 20.3358H5.75027C5.41868 20.3358 5.10067 20.204 4.8662 19.9696C4.63172 19.7351 4.5 19.4171 4.5 19.0855Z"
					stroke="#E8E8E8"
					strokeWidth="1.27632"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M13.6719 6.16406V8.99801C13.6719 9.13065 13.7246 9.25785 13.8184 9.35164C13.9121 9.44543 14.0393 9.49812 14.172 9.49812H17.0059"
					stroke="#E8E8E8"
					strokeWidth="1.27632"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<text
					x="11" // Horizontal position
					y="15" // Vertical position
					fill="#E8E8E8"
					fontSize="6"
					textAnchor="middle"
					alignmentBaseline="middle"
				>
					{props.value}
				</text>
			</svg>
		</div>
	);
};

export default PagesComponent;
