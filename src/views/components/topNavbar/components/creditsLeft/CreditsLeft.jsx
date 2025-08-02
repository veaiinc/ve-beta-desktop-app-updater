import s from './creditsLeft.module.scss';

const CreditsLeft = ({ totalAiCreditLimit, totalAiCreditUsed, openAddOnCardsModal }) => {
	return (
		<>
			<div className={s.creditsLeftContainer}>
				<div className={s.creditsInfo}>
					<h1 className={s.usedCredits}>
						{Math.floor(totalAiCreditLimit - totalAiCreditUsed)} Left
					</h1>
					<h2 className={s.totalCredits}>{Math.floor(totalAiCreditLimit)} Total</h2>
				</div>
				<button onClick={openAddOnCardsModal} className={s.updateBtn}>
					Upgrade
				</button>
			</div>
		</>
	);
};

export default CreditsLeft;
