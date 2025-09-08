import { memo } from 'react';

const CreditsLeftSvg = ({ totalAiCreditLimit, totalAiCreditUsed }) => {
	const totalCircumference = 62.8; // 2 * π * 10 (radius)
	const creditsLeftPercentage =
		totalAiCreditLimit > 0
			? ((totalAiCreditLimit - totalAiCreditUsed) / totalAiCreditLimit) * 100
			: 0;
	const strokeDasharray = `${
		(creditsLeftPercentage / 100) * totalCircumference
	} ${totalCircumference}`;

	return (
		<svg
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="closed-sidebar-icon"
		>
			{/* Background Circle (always fully visible) */}
			<circle cx="12" cy="12" r="10" stroke="var(--primary-button)" strokeWidth="3" fill="none" />
			{/* Progress Circle (shows credits used, starts at left bottom) */}
			<circle
				cx="12"
				cy="12"
				r="10"
				stroke="var(--stroke)"
				strokeWidth="4"
				fill="none"
				strokeDasharray={strokeDasharray}
				strokeDashoffset="0"
				transform="rotate(-90 12 12)" // Start progress at top (0° = -90° in SVG)
			/>
		</svg>
	);
};

export default memo(CreditsLeftSvg);
