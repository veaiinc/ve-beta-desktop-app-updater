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
	const [info, setInfo] = useState({
		data: { body: emailBody, to: 'test@test.com' },
		editEnabled: false,
	});

	const handleEditClick = useCallback(() => {
		setInfo((prev) => {
			return { ...prev, editEnabled: !prev?.editEnabled };
		});
	}, []);

	const handleContentChange = useCallback((e, type) => {
		setInfo((prev) => {
			if (type === 'body') {
				return { ...prev, data: { ...prev?.data, body: e.target.value } };
			} else if (type === 'to') {
				return { ...prev, data: { ...prev?.data, to: e.target.value } };
			}
			return prev;
		});
	}, []);

	return (
		<div className={styles.gmailWidgetContainer}>
			<div className={styles.gmailWidgetTitle}>Draft Email Preview </div>
			<div className={styles.gmailContent}>
				<div className={styles.to}>
					<div className={styles.toTitle}>To</div>
					<input
						type="text"
						className={styles.toInput}
						value={info?.data?.to || ''}
						disabled={!info?.editEnabled}
						onChange={(e) => handleContentChange(e, 'to')}
					/>
				</div>
				<div className={styles.body}>
					<div className={styles.bodyHeader}>Body</div>
					<div className={styles.gmailWidgetBody}>
						<textarea
							className={styles.textarea}
							value={info?.data?.body || ''}
							rows={8}
							disabled={!info?.editEnabled}
							onChange={(e) => handleContentChange(e, 'body')}
						/>
					</div>
				</div>
				<div className={styles.buttonsContainer}>
					{/* <button className={styles.eachButton}>
					<CrossSvg />
					Dismiss
				</button> */}
					<button className={styles.eachButton} onClick={handleEditClick}>
						<EditSvg />
						{info?.editEnabled ? 'Stop Editing' : 'Edit First'}
					</button>
					<button className={`${styles.eachButton} ${styles.sendSvg}`}>
						<SendSvg />
						Send Now
					</button>
				</div>
			</div>
		</div>
	);
};

export default memo(GmailWidget);
