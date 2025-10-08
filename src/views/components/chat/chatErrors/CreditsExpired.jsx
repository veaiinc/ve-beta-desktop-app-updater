import { memo, useCallback, useState } from 'react';
import s from '../../../../assets/scss/chat/chatErrors/creditsExpired.module.scss';
import CreditCoinImage from '../../../../assets/images/creditCoin.png';
import AddOnCards from '../../settings/planbilling/addOnCards';

const CreditsExpired = () => {
	const [info, setInfo] = useState({ openUpgradeModal: false });

	const handleUpgradeClick = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			openUpgradeModal: true,
		}));
	}, []);

	const handleCloseUpgrageModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, openUpgradeModal: false }));
	}, []);

	return (
		<div className={s.creditsExpiredContainer}>
			<div className={s.leftContainer}>
				<div className={s.titleContainer}>
					<img src={CreditCoinImage} className={s.coinIcon} alt="coin" />

					<div className={s.title}>You don't have enough credits to continue.</div>
				</div>
				<div className={s.description}>
					Please consider purchasing additional credits to chat and enhance your
					experience. If you need assistance, feel free to reach out to our support team!
				</div>
			</div>
			<div className={s.rightContainer}>
				<div className={s.upgradeBtn} onClick={handleUpgradeClick}>
					Upgrade
				</div>
			</div>

			<AddOnCards
				isOpen={info?.openUpgradeModal}
				closeModal={handleCloseUpgrageModal}
				subscriptionState="addOnPlans"
			/>
		</div>
	);
};

export default memo(CreditsExpired);
