import s from './offline.module.scss';
import { ReactComponent as VeAILogo } from '../../../assets/svg/veLogo.svg';

const Offline = () => {
	return (
		<div className={s.offlinePageContainer}>
			<nav className={s.navBar}>
				<VeAILogo />
			</nav>
			<main className={s.body}>
				<h1 className={s.header}>Connect to the internet</h1>
				<p className={s.para}>Your're offline. Check your connection</p>
				<button className={s.button}>Retry</button>
			</main>
		</div>
	);
};

export default Offline;
