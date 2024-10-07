import React, { useState, useRef, memo } from 'react';
import '../../../assets/scss/landingScreen/index.scss';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as AiSalesLogo } from '../../../assets/svg/landingScreen/aiSaleslogo.svg';
import { ReactComponent as AiLinkInBioLogo } from '../../../assets/svg/landingScreen/aiLinkInBioLogo.svg';
import { ReactComponent as InvoiceLogo } from '../../../assets/svg/landingScreen/invoiceLogo.svg';
import { ReactComponent as AiClientFilesLogo } from '../../../assets/svg/landingScreen/aiClientFilesLogo.svg';
import { ReactComponent as AnimatedLogo } from '../../../assets/svg/landingScreen/animatedLogo.svg';
import { gsap } from 'gsap';

const cards = [
	{
		description:
			'Engage leads with AI-driven smart files to close deals faster. Discover how AI can transform your business.',
		title: 'AI Sales Assistance',
		logo: 'AiSalesLogo',
	},
	{
		description: 'Make it easier for your audience to connect with all your essential content.',
		title: 'AI Link in Bio',
		logo: 'AiLinkInBioLogo',
	},
	{
		description:
			'Effortlessly build and customize professional client files with AI, designed to match your style and needs.',
		title: 'AI Client Files',
		logo: 'InvoiceLogo',
	},
	{
		description:
			'Transform your client delivery with AI. Share stunning photo and video galleries in seconds, perfectly tailored to every need',
		title: 'AI Galleries',
		logo: 'AiClientFilesLogo',
	},
];
const logosObject = {
	AiSalesLogo: <AiSalesLogo />,
	AiLinkInBioLogo: <AiLinkInBioLogo />,
	InvoiceLogo: <InvoiceLogo />,
	AiClientFilesLogo: <AiClientFilesLogo />,
};

const Cards = ({ cardsRef }) => {
	const navigate = useNavigate();
	const [hoveredCard, setHoveredCard] = useState(null);
	const cardRefs = useRef([]);

	const handleMouseEnter = (index) => {
		gsap.to(cardRefs.current[index], {
			background: 'linear-gradient(129deg, #121315 27.84%, #202328 131.68%)',
			duration: 0.6,
			ease: 'slow(0.7, 0.7, false)',
		});
		setHoveredCard(index);
	};

	const handleMouseLeave = (index) => {
		gsap.to(cardRefs.current[index], {
			background: 'linear-gradient(0deg, #121315, #121315)',
			duration: 0.6,
			ease: 'slow(0.7, 0.7, false)',
		});
		setHoveredCard(null);
	};

	const handleCardClick = () => {
		return navigate('/verify-user');
	};

	return (
		<div ref={cardsRef} className={'cardsContainer'}>
			{cards?.map((card, index) => (
				<div
					ref={(el) => (cardRefs.current[index] = el)}
					key={index}
					onClick={handleCardClick}
					className={'card'}
					onMouseEnter={() => handleMouseEnter(index)}
					onMouseLeave={() => handleMouseLeave(index)}
				>
					{hoveredCard === index && (
						<span className="animatedLogoContainer">
							<AnimatedLogo />
						</span>
					)}
					<p className={'description'}>{card?.description}</p>
					<nav>
						<div className={'logo'}>{logosObject?.[card?.logo]}</div>
						<h3>{card?.title}</h3>
					</nav>
				</div>
			))}
		</div>
	);
};

export default memo(Cards);
