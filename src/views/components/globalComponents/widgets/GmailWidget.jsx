import styles from '../../../../assets/scss/home_page/gmailWidget.module.scss';
import { memo, useCallback, useEffect, useState } from 'react';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as EditSvg } from '../../../../assets/svg/files/edit.svg';
import { ReactComponent as SendSvg } from '../../../../assets/svg/calendar/send.svg';
import validator from 'validator';
import { message } from '../CustomToast';

const GmailWidget = ({ widgetData = null }) => {
	const [info, setInfo] = useState({
		data: {},
		editEnabled: false,
	});

	useEffect(() => {
		if (widgetData) {
			setInfo((prev) => {
				return {
					...prev,
					data: {
						body: widgetData?.body || '',
						to: widgetData?.to || '',
						from: widgetData?.from || '',
						subject: widgetData?.subject || '',
					},
					editEnabled: false,
				};
			});
		}
	}, [widgetData]);

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
			} else if (type === 'subject') {
				return { ...prev, data: { ...prev?.data, subject: e.target.value } };
			}
			return prev;
		});
	}, []);

	const handleSendClick = useCallback(() => {
		if (!validator?.isEmail(info?.data?.to)) {
			message.error('Invalid sender email');
			return;
		}
	}, [info?.data]);

	return (
		<div className={styles.gmailWidgetContainer}>
			<div className={styles.gmailWidgetTitle}>Draft Email Preview </div>
			<div className={styles.gmailContent}>
				<div className={styles.subject}>
					<div className={styles.subjectTitle}>Subject</div>
					<input
						type="text"
						className={styles.subjectInput}
						value={info?.data?.subject || ''}
						disabled={!info?.editEnabled}
						onChange={(e) => handleContentChange(e, 'subject')}
						onKeyDown={(e) => e?.stopPropagation()}
					/>
				</div>
				<div className={styles.to}>
					<div className={styles.toTitle}>To</div>
					<input
						type="text"
						className={styles.toInput}
						value={info?.data?.to || ''}
						disabled={!info?.editEnabled}
						onChange={(e) => handleContentChange(e, 'to')}
						onKeyDown={(e) => e?.stopPropagation()}
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
							onKeyDown={(e) => e?.stopPropagation()}
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
					<button
						className={`${styles.eachButton} ${styles.sendSvg}`}
						onClick={handleSendClick}
					>
						<SendSvg />
						Send Now
					</button>
				</div>
			</div>
		</div>
	);
};

export default memo(GmailWidget);
