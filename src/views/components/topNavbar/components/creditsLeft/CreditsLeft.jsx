import s from './creditsLeft.module.scss';

const CreditsLeft = ({ totalAiCreditLimit, totalAiCreditUsed, openAddOnCardsModal }) => {
	const roundedTotalAiCreditLimit = Math.max(0, Math.floor(totalAiCreditLimit));
	const roundedTotalAiCreditUsed = Math.max(0, Math.floor(totalAiCreditUsed));
	const roundedTotalAiCreditLeft = Math.max(
		0,
		roundedTotalAiCreditLimit - roundedTotalAiCreditUsed,
	);

	return (
		<>
			<div className={s.creditsLeftContainer}>
				<div className={s.creditsInfo}>
					<h1 className={s.usedCredits}>{roundedTotalAiCreditLeft} Left</h1>
					<h2 className={s.totalCredits}>{roundedTotalAiCreditLimit} Total</h2>
				</div>
				<button onClick={openAddOnCardsModal} className={s.updateBtn}>
					Upgrade
				</button>
			</div>
		</>
	);
};

export default CreditsLeft;
