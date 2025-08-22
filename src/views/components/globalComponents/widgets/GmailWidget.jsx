import styles from '../../../../assets/scss/globalComponents/widgets/gmailWidget.module.scss';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as EditSvg } from '../../../../assets/svg/files/edit.svg';
import { ReactComponent as SendSvg } from '../../../../assets/svg/calendar/send.svg';
import validator from 'validator';
import { message } from '../CustomToast';
import Context from '../../../../context/context';
import Spinner from '../../loaders/Spinner';
const GmailWidget = ({
	widgetData = null,
	title = 'Draft Email Preview',
	widgetInfo,
	onChange,
	showSkipBtn = false,
}) => {
	const {
		templates: { sendCustomEmailToClients },
	} = useContext(Context);
	const [info, setInfo] = useState({
		data: {},
		editEnabled: false,
		showCC: false,
		showBCC: false,
		sendEmailLoader: false,
		skipping: false,
	});

	useEffect(() => {
		if (widgetData) {
			const { body, to, from, subject, cc, bcc } = widgetData || {};
			setInfo((prev) => {
				return {
					...prev,
					data: {
						body: body || '',
						to: to || '',
						from: from || '',
						subject: subject || '',
						cc: cc || '',
						bcc: bcc || '',
					},
					editEnabled: false,
					showCC: cc ? true : false,
					showBCC: bcc ? true : false,
					sendEmailLoader: false,
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
			return {
				...prev,
				data: {
					...prev?.data,
					[type]: e.target.value,
				},
			};
		});
	}, []);

	const handleSendClick = useCallback(async () => {
		if (info?.sendEmailLoader) {
			return;
		}
		if (!validator?.isEmail(info?.data?.to)) {
			message.error('Invalid receiver email');
			return;
		} else if (info?.data?.cc && !validator?.isEmail(info?.data?.cc)) {
			message.error('Invalid cc email');
			return;
		} else if (info?.data?.bcc && !validator?.isEmail(info?.data?.bcc)) {
			message.error('Invalid bcc email');
			return;
		} else if (!info?.data?.body?.length) {
			message.error('Email body cannot be empty');
			return;
		}
		setInfo((prev) => {
			return { ...prev, sendEmailLoader: true };
		});
		const payload = {
			clientEmail: info?.data?.to,
			mailContent: {
				htmlBody: info?.data?.body || '',
				subject: info?.data?.subject || '',
			},
		};
		if (info?.data?.cc?.length) {
			payload.mailContent.cc = [info?.data?.cc];
		}
		if (info?.data?.bcc?.length) {
			payload.mailContent.bcc = [info?.data?.bcc];
		}
		const response = await sendCustomEmailToClients(payload);

		if (response?.[0]) {
			message.success('Email sent successfully');
		} else {
			message.error('Unable to send email, please check if you connected your gmail account');
		}

		setInfo((prev) => {
			return { ...prev, sendEmailLoader: false };
		});
	}, [info?.data, info?.sendEmailLoader]);

	const handleSkip = useCallback(() => {
		if (info?.skipping) return;
		setInfo((prev) => ({
			...prev,
			skipping: true,
		}));
		onChange?.({ skip: true, widgetInfo });
	}, [onChange, widgetInfo, info?.skipping]);

	return (
		<div className={styles.gmailWidgetContainer}>
			<div className={styles.gmailWidgetTitle}>{title}</div>
			<div className={styles.gmailContent}>
				<div className={styles.wrapper}>
					<div className={styles.title}>Subject</div>
					<input
						type="text"
						className={styles.input}
						value={info?.data?.subject || ''}
						disabled={!info?.editEnabled}
						onChange={(e) => handleContentChange(e, 'subject')}
						onKeyDown={(e) => e?.stopPropagation()}
					/>
				</div>
				<div className={styles.wrapper}>
					<div className={styles.title}>To</div>
					<input
						type="text"
						className={styles.input}
						value={info?.data?.to || ''}
						disabled={!info?.editEnabled}
						onChange={(e) => handleContentChange(e, 'to')}
						onKeyDown={(e) => e?.stopPropagation()}
					/>
				</div>

				<div className={styles.ccBccContainer}>
					<div className={styles.ccBccHeader}>
						<button
							className={`${styles.ccButton} ${info?.showCC ? styles.active : ''}`}
							onClick={() => setInfo((prev) => ({ ...prev, showCC: !prev?.showCC }))}
						>
							CC
						</button>
						<button
							className={`${styles.bccButton} ${info?.showBCC ? styles.active : ''}`}
							onClick={() =>
								setInfo((prev) => ({ ...prev, showBCC: !prev?.showBCC }))
							}
						>
							BCC
						</button>
					</div>
					{info?.showCC ? (
						<div className={styles.wrapper}>
							<div className={styles.title}>CC</div>
							<input
								type="text"
								className={styles.input}
								value={info?.data?.cc || ''}
								disabled={!info?.editEnabled}
								onChange={(e) => handleContentChange(e, 'cc')}
							/>
						</div>
					) : (
						''
					)}
					{info?.showBCC ? (
						<div className={styles.wrapper}>
							<div className={styles.title}>BCC</div>
							<input
								type="text"
								className={styles.input}
								value={info?.data?.bcc || ''}
								disabled={!info?.editEnabled}
								onChange={(e) => handleContentChange(e, 'bcc')}
							/>
						</div>
					) : (
						''
					)}
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
					{showSkipBtn && (
						<button className={styles.eachButton} onClick={handleSkip}>
							<CrossSvg />
							Dismiss
							{info?.skipping && <Spinner width={16} height={16} />}
						</button>
					)}

					<button className={styles.eachButton} onClick={handleEditClick}>
						<EditSvg />
						{info?.editEnabled ? 'Stop Editing' : 'Edit First'}
					</button>
					<button
						className={`${styles.eachButton} ${styles.sendSvg}`}
						onClick={handleSendClick}
						disabled={info?.sendEmailLoader}
					>
						<SendSvg />
						{info?.sendEmailLoader ? 'Sending...' : 'Send Now'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default memo(GmailWidget);
