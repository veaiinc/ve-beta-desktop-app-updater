import { memo, useState } from 'react';
import '../scss/sidebarIcon.scss';
const SidebarIcon = () => {
	const [active, setActive] = useState(false);
	return (
		<svg
			className={`sidebar-icon ${!active ? 'active' : ''}`}
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			onClick={() => setActive(!active)}
			style={{ cursor: 'pointer' }}
		>
			<g clipPath="url(#clip0_17288_15123)">
				<path
					className="vertical-line"
					d="M6.875 3.75V16.25"
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M16.875 3.75H3.125C2.77982 3.75 2.5 4.02982 2.5 4.375V15.625C2.5 15.9702 2.77982 16.25 3.125 16.25H16.875C17.2202 16.25 17.5 15.9702 17.5 15.625V4.375C17.5 4.02982 17.2202 3.75 16.875 3.75Z"
					strokeWidth="1.25"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_17288_15123">
					<rect width="20" height="20" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
};

export default memo(SidebarIcon);
