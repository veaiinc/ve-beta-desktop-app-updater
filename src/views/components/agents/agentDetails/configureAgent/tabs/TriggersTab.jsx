import { memo } from 'react';
import s from './triggersTab.module.scss';

const TriggersTab = () => {
	return (
		<div className={s?.container}>
			<header className={s?.titleSubtitleContainer}>
				<h1 className={s?.title}>Triggers</h1>
				<h2 className={s?.subtitle}>
					Triggers are events that can be used to trigger actions.
				</h2>
			</header>
			<div className={s?.connectedTriggersContainer}>
				<h1 className={s?.title}>Connected Triggers</h1>
			</div>
		</div>
	);
};

export default memo(TriggersTab);
