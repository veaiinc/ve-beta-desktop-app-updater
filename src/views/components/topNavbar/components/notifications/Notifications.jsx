import React, { useContext, useEffect } from 'react';
import s from './notifications.module.scss';
import Context from '../../../../../context/context';
import InfiniteScroll from '../../../globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../../../helpers';
import moment from 'moment';
import { ReactComponent as NotificationsSvg } from '../../assets/notification.svg';

const Notifications = () => {
	const {
		templates: { getNotificationsList, notificationsList },
	} = useContext(Context);

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

	return (
		<div className={s.notificationsContainer}>
			<header className={s.notificationsHeader}>
				<NotificationsSvg />
				<h2 className={s.title}>Notifications</h2>
			</header>
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
					height={'400px'}
				>
					<div className={s.notificationsList}>
						{notifications.map((notification) => {
							return (
								<div className={s.notificationItem} key={notification._id}>
									<h3 className={s.summary}>{notification.summary}</h3>
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
