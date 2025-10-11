import React, { useContext, useEffect, useState } from 'react';
import s from './notifications.module.scss';
import Context from '../../../../../context/context';
import InfiniteScroll from '../../../globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../../../helpers';
import moment from 'moment';
import { ReactComponent as NotificationsSvg } from '../../assets/notification.svg';
import DownCaret from '../../assets/DownCaret';

const ellipsisStyle = {
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
};

const Notifications = ({ onClose }) => {
	const {
		templates: { getNotificationsList, notificationsList },
	} = useContext(Context);

	const [info, setInfo] = useState(() => ({
		selectedNotificationId: null,
		showCaret: null,
	}));

	const notificationsLoading = notificationsList === null;
	const notifications = notificationsList?.data ?? [];
	const notificationsLength = notifications?.length ?? 0;
	const emptyNotifications = notificationsLength === 0;
	const hasNextPage = notificationsList?.hasNextPage ?? false;
	const currentPage = notificationsList?.currentPage ?? 1;

	useEffect(() => {
		getNotificationsList();
	}, []);

	const fetchNextNotificationsList = () => {
		getNotificationsList({
			page: currentPage + 1,
			limit: 10,
		});
	};

	const handleClose = () => {
		if (onClose) return onClose();
		try {
			document.body.click();
		} catch (e) {}
	};

	return (
		<div className={s.overlayContainer}>
			<div className={s.notificationsHeader}>
				<h2 className={s.title}>Notification</h2>
			</div>
			{notificationsLoading ? (
				<p className={s.loadingText}>Loading...</p>
			) : emptyNotifications ? (
				<p className={s.emptyText}>No notifications found!</p>
			) : (
				<InfiniteScroll
					dataLength={notificationsLength}
					next={fetchNextNotificationsList}
					hasMore={hasNextPage}
					loader={<FetchMoreLoaderComp />}
					height="340px"
				>
					<div className={s.notificationsList}>
						{notifications.map((notification) => {
							return (
								<div
									onClick={() =>
										setInfo((prev) => ({
											...prev,
											selectedNotificationId:
												info.selectedNotificationId === notification._id
													? null
													: notification._id,
										}))
									}
									onMouseEnter={() =>
										setInfo((prev) => ({
											...prev,
											showCaret: notification._id,
										}))
									}
									onMouseLeave={() =>
										setInfo((prev) => ({
											...prev,
											showCaret: null,
										}))
									}
									className={`${s.notificationItem} ${
										info.selectedNotificationId === notification._id
											? s.selectedNotification
											: ''
									}`}
									key={notification._id}
								>
									<div className={s.summaryContainer}>
										<p
											style={
												info.selectedNotificationId === notification._id
													? {}
													: ellipsisStyle
											}
											className={s.summary}
										>
											{notification.summary}
										</p>
										{info.showCaret === notification._id && (
											<span
												className={
													info.selectedNotificationId === notification._id
														? s.caretDown
														: s.caretUp
												}
											>
												<DownCaret />
											</span>
										)}
									</div>
									<p className={s.time}>
										{moment.unix(notification.timestamp).fromNow()}
									</p>
								</div>
							);
						})}
					</div>
				</InfiniteScroll>
			)}
		</div>
	);
};

export default Notifications;
