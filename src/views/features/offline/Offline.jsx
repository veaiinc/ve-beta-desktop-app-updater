import s from './offline.module.scss';
import { ReactComponent as VeAILogo } from '../../../assets/svg/veLogo.svg';

const Offline = () => {
	return (
		<div className={s.offlinePageContainer}>
			<nav className={s.navBar}>
				<VeAILogo />
			</nav>
			<main className={s.body}>
				<span className={s.header}>Connect to the internet</span>
				<span className={s.para}>Your're offline. Check your connection</span>
				<button onClick={() => window.location.reload()} className={s.button}>
					Retry
				</button>
			</main>
		</div>
	);
};

export default Offline;
