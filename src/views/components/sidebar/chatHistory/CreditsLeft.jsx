import { memo, useContext, useEffect, useMemo, useState } from 'react';
import Context from '../../../../context/context';
import AddOnPlans from '../../settings/planbilling/addOnCards';
// import CreditsLeftSvg from '../../../../assets/svg/sidebar/CreditsLeftSvg';
import CreditsCoin from '../../../../assets/images/creditCoin.png';
import { ReactComponent as ChevronRightIcon } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as HourGlassIcon } from '../../../../assets/svg/sidebar/hourGlass.svg';
const CreditsLeft = () => {
	const {
		subscriptionInfo: { currentPlan },
		authInfo: { getAddOnsForCurrentPlan, currentPlanAddOns },
	} = useContext(Context);

	const [info, setInfo] = useState({
		creditsLeft: 0,
		renewalType: '',
		showUpgradeModal: false,
		freeAiCredits: 0,
		paidAiCredits: 0,
		creditsType: '',
	});

	useEffect(() => {
		if (currentPlan) {
			const {
				aiCreditUsage: { dailyUsage, monthlyUsage } = {},
				freeAiCreditLimit: { aiCredits: freeAiCredits, renewalType } = {},
				paidAiCreditLimit: { aiCredits: paidAiCredits } = {},
				addOnAiCredits,
			} = currentPlan || {};

			// let freeAiCredits = 0;
			// let paidAiCredits = 0;
			// let addOnAiCredits = 1000;
			// let dailyUsage = 1000;
			// let monthlyUsage = 0;
			// let renewalType = 'daily';

			const usage = dailyUsage || monthlyUsage || 0;

			const freeAiCreditsLeft = freeAiCredits - usage;
			const paidAiCreditsLeft = paidAiCredits - usage;
			const addOnAiCreditsLeft = addOnAiCredits - usage;

			let creditsLeft = currentPlan?.totalAiCreditLimit - currentPlan?.totalAiCreditUsed || 0;
			// if (freeAiCreditsLeft > 0) {
			//  creditsLeft = freeAiCreditsLeft;
			// } else if (paidAiCreditsLeft > 0) {
			//  creditsLeft = paidAiCreditsLeft;
			// } else if (addOnAiCreditsLeft > 0) {
			//  creditsLeft = addOnAiCreditsLeft;
			// }

			let creditsType =
				freeAiCredits > 0
					? 'Free'
					: paidAiCredits > 0
					? 'Paid'
					: addOnAiCredits > 0
					? 'Add-On'
					: '';

			let totalCredits = freeAiCredits || paidAiCredits || addOnAiCredits || 0;

			setInfo({
				creditsLeft,
				renewalType: renewalType === 'monthly' ? 'this month' : 'today',
				totalCredits,
				freeAiCredits,
				paidAiCredits,
				creditsType,
			});
		}
	}, [currentPlan]);

	useEffect(() => {
		if (!currentPlanAddOns) {
			getAddOnsForCurrentPlan();
		}
	}, []);
	const daysUntilExpiry = useMemo(() => {
		if (!currentPlan?.expiresAt) return null;
		const msLeft = currentPlan?.expiresAt * 1000 - Date.now();
		return Math.ceil(msLeft / (1000 * 60 * 60 * 24));
	}, [currentPlan]);
	// Calculate dynamic strokeDasharray
	const { strokeDasharray } = useMemo(() => {
		const percentage = Math.max(0, Math.min(info?.creditsLeft / info?.totalCredits, 1)); // clamp between 0 and 1
		const circumference = 2 * Math.PI * 12.5; // 12.5 is r
		const filled = percentage * circumference;

		return {
			strokeDasharray: `${filled} ${circumference}`,
		};
	}, [info]);

	return (
		<div
			className={`creditsLeft ${
				!currentPlan?.aiCreditUsage || currentPlan?.totalAiCreditLimit === 0
					? 'displayNone'
					: ''
			}`}
		>
			<div className={`left ${info?.creditsLeft === 0 ? 'noCreditsLeft' : ''}`}>
				<div
					className={`creditsContainer ${info?.creditsLeft === 0 ? 'noCreditsLeft' : ''}`}
				>
					<div className="creditsContainerImage">
						<img src={CreditsCoin} style={{ width: '16px', height: '16px' }} />
						{info?.creditsLeft === 0 ? (
							<div className="credits">You have 0 no credits left!</div>
						) : (
							<div className="credits">
								{Math.round(currentPlan?.totalAiCreditUsed)} C used /
								{currentPlan?.totalAiCreditLimit}
							</div>
						)}
					</div>
					{info?.creditsLeft > 0 && (
						<div className="progressBarContainer">
							{/* Progress fill */}
							<div
								className="progressBar"
								style={{
									width: `${
										(currentPlan?.totalAiCreditUsed /
											currentPlan?.totalAiCreditLimit) *
										100
									}%`,
								}}
							/>
						</div>
					)}
				</div>

				{daysUntilExpiry > 0 && daysUntilExpiry <= 3 && (
					<div className="expiryBannerContainer">
						<HourGlassIcon />
						<div className="expiryBanner">
							{/* {daysUntilExpiry} day{daysUntilExpiry > 1 ? 's' : ''} left in your
						subscription */}
							Your plan expires in {daysUntilExpiry} days
						</div>
					</div>
				)}
				{info?.creditsLeft === 0 ||
					(daysUntilExpiry > 0 && daysUntilExpiry <= 3 && (
						<div
							className="upgrade-btn"
							onClick={() => setInfo({ ...info, showUpgradeModal: true })}
						>
							Upgrade <ChevronRightIcon />
						</div>
					))}
				{info?.showUpgradeModal && (
					<AddOnPlans
						isOpen={info?.showUpgradeModal}
						closeModal={() => setInfo({ ...info, showUpgradeModal: false })}
					/>
				)}
			</div>
			{/* <div className="creditSvg">
                <CreditsLeftSvg strokeDasharray={strokeDasharray} />
            </div> */}
		</div>
	);
};

export default memo(CreditsLeft);
