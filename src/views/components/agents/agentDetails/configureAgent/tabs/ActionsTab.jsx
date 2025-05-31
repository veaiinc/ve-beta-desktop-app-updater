import { memo } from 'react';
import s from './actionsTab.module.scss';
import { ReactComponent as SearchSvg } from '../../../../../../assets/svg/searc.svg';

const ActionsTab = () => {
	return (
		<div className={s?.actionsTabContainer}>
			<div className={s?.searchInputContainer}>
				<div className={s?.searchIcon}>
					<SearchSvg />
				</div>
				<input type="text" placeholder="Browse tools" className={s?.searchInput} />
			</div>
			<div className={s?.actionsContainer}>
				<div className={s?.actionItem}>
					<div className={s?.leftContainer}>
						<div className={s?.actionIcon}></div>
						<div className={s?.titleContainer}>
							<p className={s?.title}>Create a form</p>
							<p className={s?.description}>Create a form</p>
						</div>
					</div>
					<div className={s?.rightContainer}></div>
				</div>
			</div>
		</div>
	);
};

export default memo(ActionsTab);
