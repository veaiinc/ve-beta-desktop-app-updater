import s from './underMaintainence.module.scss';
import { ReactComponent as VeAILogo } from '../../../assets/svg/veLogo.svg';

const UnderMaintainence = () => {
	return (
		<div className={s.offlinePageContainer}>
			<nav className={s.navBar}>
				<VeAILogo />
			</nav>
			<main className={s.body}>
				<span className={s.header}>Our System is under maintainence</span>
				<span className={s.para}>We're working on it. Please check back after 1 hour.</span>
				<button onClick={() => window.location.reload()} className={s.button}>
					Retry
				</button>
			</main>
		</div>
	);
};

export default UnderMaintainence;
