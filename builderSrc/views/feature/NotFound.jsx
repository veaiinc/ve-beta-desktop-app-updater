import React, { useEffect, useState } from 'react';
import '../../assets/scss/not-found.scss';
import { ReactComponent as VE } from '../../assets/svg/ve.svg';
import { ReactComponent as VeMobile } from '../../assets/svg/veMobile.svg';
import { useSearchParams } from 'react-router-dom';

const MESSAGE_CONSTANTS = {
	expired: "I'm sorry this file is expired",
	notFound: 'Page not found',
	templateNotFound: 'Template not found',
	workflowNotFound: 'Workflow not found',
	designBuilderNotFound: 'Design builder not found',
	workspaceNotFound: 'Workspace not found',
	invalidToken: 'Your access token has expired or is invalid. Please log in again to continue.',
};

const NotFound = ({ notFoundMessage = null, subText = null, link = null, buttonName = null }) => {
	const [searchParams] = useSearchParams();
	const [isMobile, setIsMobile] = useState(false);
	const [info, setInfo] = useState({
		messageText: notFoundMessage || null,
		subText: subText || null,
		link: link || null,
		buttonName: buttonName || null,
	});
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768); // Adjust width as needed
		};
		const handleSearchParams = () => {
			const details = {};
			if (searchParams.get('messageText')) {
				details.messageText = searchParams.get('messageText');
			}
			if (searchParams.get('subText')) {
				details.subText = searchParams.get('subText');
			}
			if (searchParams.get('link')) {
				details.link = searchParams.get('link');
			}
			if (searchParams.get('buttonName')) {
				details.buttonName = searchParams.get('buttonName');
			}

			setInfo((prev) => ({ ...prev, ...details }));
		};
		handleSearchParams(); // Check search params on load
		handleResize(); // Check screen size on load
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	if (isMobile) {
		return (
			<div className="expiredParentContainerMobile">
				<VeMobile />
				<div className="expiredContentContainer">
					<span className="expiredText">
						{MESSAGE_CONSTANTS[info.messageText] ||
							info.messageText ||
							MESSAGE_CONSTANTS.notFound}
					</span>
				</div>
				<div className="expiredFooter">
					<span className="footerSubText">
						{info.subText ||
							'If you are still intrested, get in touch with your ve.ai dashboard'}
					</span>
					<a
						className="contactBusinessButton"
						href={info.link || 'https://ve.ai/home'}
						target="_blank"
					>
						{info.buttonName || 'Back to Dashboard'}
					</a>
				</div>
			</div>
		);
	}
	return (
		<div className="expiredParentContainer">
			<VE />
			<div className="expiredContentContainer">
				{/* <span className="expiredClientNameStyling">Hi, Kierra Levin</span> */}
				<span className="expiredText">
					{MESSAGE_CONSTANTS[info.messageText] ||
						info.messageText ||
						MESSAGE_CONSTANTS.notFound}
				</span>
			</div>

			<div className="expiredFooter">
				<span className="footerSubText">
					{info.subText ||
						'If you are still intrested, get in touch with your ve.ai dashboard'}
				</span>
				<a
					className="contactBusinessButton"
					href={info.link || 'https://ve.ai/home'}
					target="_blank"
				>
					{info.buttonName || 'Back to Dashboard'}
				</a>
			</div>
		</div>
	);
};

export default NotFound;
