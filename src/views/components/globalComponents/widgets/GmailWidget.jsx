import styles from '../../../../assets/scss/home_page/gmailWidget.module.scss';
import { memo, useCallback, useState } from 'react';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as EditSvg } from '../../../../assets/svg/files/edit.svg';
import { ReactComponent as SendSvg } from '../../../../assets/svg/calendar/send.svg';

const emailBody = `Hi there! 
Thanks again for the insightful demo. I took some time to revise your pitch and I think it has great potential. I’ve added a few points that could enhance the overall message and make it even more compelling. Let’s discuss these changes soon! 
Best, 
Brandn`;

const GmailWidget = () => {
	const [info, setInfo] = useState({ data: {}, editEnabled: false });

	const handleEditClick = useCallback(() => {
		setInfo((prev) => ({ ...prev, editEnabled: true }));
	}, []);

	return (
		<div className={styles.gmailWidgetContainer}>
			<div className={styles.gmailWidgetTitle}>Draft Email Preview </div>
			<div className={styles.gmailWidgetBody}>
				<span>{emailBody}</span>
			</div>
			<div className={styles.buttonsContainer}>
				{/* <button className={styles.eachButton}>
					<CrossSvg />
					Dismiss
				</button> */}
				<button className={styles.eachButton} onClick={handleEditClick}>
					<EditSvg />
					Edit First
				</button>
				<button className={`${styles.eachButton} ${styles.sendSvg}`}>
					<SendSvg />
					Send Now
				</button>
			</div>
		</div>
	);
};

export default memo(GmailWidget);
