import React from 'react';

const CreditsLeftSvg = ({ totalAiCreditLimit, totalAiCreditUsed }) => {
	const totalCircumference = 62.8; // 2 * π * 10 (radius)
	const creditsUsedPercentage =
		totalAiCreditLimit > 0 ? (totalAiCreditUsed / totalAiCreditLimit) * 100 : 0;
	const strokeDasharray = `${
		(creditsUsedPercentage / 100) * totalCircumference
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
			<circle
				cx="12"
				cy="12"
				r="10"
				stroke="var(--stroke, #2b2e31)"
				strokeWidth="4"
				fill="none"
			/>
			{/* Progress Circle (shows credits used, starts at left bottom) */}
			<circle
				cx="12"
				cy="12"
				r="10"
				stroke="var(--primary-button, #1890ff)"
				strokeWidth="4"
				fill="none"
				strokeDasharray={strokeDasharray}
				strokeDashoffset="0"
				transform="rotate(135 12 12)" // Start progress at left bottom (135° counterclockwise)
			/>
		</svg>
	);
};

export default CreditsLeftSvg;
