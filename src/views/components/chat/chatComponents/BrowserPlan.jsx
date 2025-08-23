import React, { memo } from 'react';
import s from '../../../../assets/scss/chat/chatComponents/browserPlan.module.scss';

const BrowserPlan = ({ browserPlan = null }) => {
	return (
		<div className={s.browserPlanContainer}>
			<div className={s.titleContainer}>
				<div className={s.header}>My Plan is:</div>
				<div className={s.title}>{browserPlan?.task || ''}</div>
			</div>

			<div className={s.actionsContainer}>
				<div className={s.actionsTitle}>I will do the following:</div>
				<ul className={s.actions}>
					{browserPlan?.action?.map((action, index) => {
						return (
							<li className={s.action} key={index}>
								{action || ''}
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export default memo(BrowserPlan);
