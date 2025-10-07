import { memo, useContext, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import s from '../../../../assets/scss/sidebar/creditsUpgradeTooltip.module.scss';
import Context from '../../../../context/context';
import CreditsLeftSvg from '../chatHistory/CreditsLeftSvg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import AddOnCards from '../../settings/planbilling/addOnCards';

const CreditsUpgradeTooltip = ({ children }) => {
	const {
		subscriptionInfo: { currentPlan, subscriptionPlans, getAllSubscriptionPlan },
	} = useContext(Context);
	const [info, setInfo] = useState({
		addOnCardsModalOpen: false,
		subscriptionState: null,
		openTooltip: false,
	});

	const currentPlanData = subscriptionPlans?.find(
		(plan) => plan._id === currentPlan?.currentPlanId,
	);

	// ✅ Extract the plan title (fallback to 'Free' or currentPlan?.currentPlan if not found)
	const currentPlanTitle = currentPlanData?.plan || currentPlan?.currentPlan || 'Free';

	useEffect(() => {
		if (!subscriptionPlans) {
			getAllSubscriptionPlan();
		}
	}, [subscriptionPlans]);

	return (
		<>
			<Tooltip
				open={info?.openTooltip}
				onOpenChange={(value) => {
					setInfo((prev) => ({ ...prev, openTooltip: value }));
				}}
				title={
					<div className={s.settingsPlans}>
						<div className={s.settingsCredits}>
							<div className={s.settingsCreditsLeft}>
								<CreditsLeftSvg
									totalAiCreditLimit={currentPlan?.totalAiCreditLimit}
									totalAiCreditUsed={currentPlan?.totalAiCreditUsed}
								/>
								<span className={s.settingsCreditsTitle}>Credits</span>
							</div>
							<div
								className={s.settingsCreditsCount}
								onClick={(e) => {
									e.stopPropagation();
									setInfo((prev) => ({
										...prev,
										addOnCardsModalOpen: true,
										subscriptionState: 'addOnPlans',
										selectedPeriodProp: 'One Time Purchase ',
										openTooltip: false,
									}));
								}}
							>
								<span className={s.settingsCreditsLeftCount}>
									{(
										currentPlan?.totalAiCreditLimit -
										currentPlan?.totalAiCreditUsed
									).toFixed(2)}
								</span>
								<ChevronRightThinSvg />
							</div>
						</div>
						<div className={s.settingCurrentPlan}>
							<div className={s.settingPlanName}>{currentPlanTitle}</div>
							<div
								className={s.settingsUpgrade}
								onClick={(e) => {
									e.stopPropagation();
									setInfo((prev) => ({
										...prev,
										addOnCardsModalOpen: true,
										openTooltip: false,
										subscriptionState: 'upgradeSubscription',
									}));
								}}
							>
								Upgrade
							</div>
						</div>
					</div>
				}
				arrow={false}
				color="transparent"
				placement="topRight"
			>
				{children}
			</Tooltip>
			<AddOnCards
				isOpen={info?.addOnCardsModalOpen}
				closeModal={() => {
					setInfo((prev) => ({
						...prev,
						addOnCardsModalOpen: false,
					}));
				}}
				subscriptionState={info?.subscriptionState}
				selectedPeriodProp={info?.selectedPeriodProp}
			/>
		</>
	);
};

export default memo(CreditsUpgradeTooltip);
