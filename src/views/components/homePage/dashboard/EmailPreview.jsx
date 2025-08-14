import styles from '../../../../assets/scss/home_page/emailPreview.module.scss';
import { memo } from 'react';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as EditSvg } from '../../../../assets/svg/files/edit.svg';
import { ReactComponent as SendSvg } from '../../../../assets/svg/calendar/send.svg';
import { fill } from 'lodash';

const emailBody = `Hi there! 
Thanks again for the insightful demo. I took some time to revise your pitch and I think it has great potential. I’ve added a few points that could enhance the overall message and make it even more compelling. Let’s discuss these changes soon! 
Best, 
Brandn`;

const EmailPreview = () => {
	return (
		<div className={styles.emailPreviewContainer}>
			<div className={styles.emailPreviewTitle}>Draft Email Preview </div>
			<div className={styles.emailPreviewBody}>
				<span>{emailBody}</span>
			</div>
			<div className={styles.buttonsContainer}>
				<button className={styles.eachButton}>
					<CrossSvg />
					Dismiss
				</button>
				<button className={styles.eachButton}>
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

export default memo(EmailPreview);
