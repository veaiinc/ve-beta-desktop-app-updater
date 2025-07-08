import { memo, useCallback } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/unintegratedAgentApps.module.scss';

const UnintegratedAgentApps = ({ apps = ['google', 'slack'] }) => {
	const handleAppClick = useCallback((app) => {}, []);
	return (
		<div className={s.unintegratedAgentAppsContainer}>
			<div className={s.text}>Connect these tools</div>
			<div className={s.appsContainer}>
				{apps?.map((app, index) => (
					<div className={s.appContainer} key={index} onClick={() => handleAppClick(app)}>
						{app || ''}
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(UnintegratedAgentApps);
