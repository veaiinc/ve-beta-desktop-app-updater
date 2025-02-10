import { Drawer } from 'antd';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import '../../../../assets/scss/sidebarNotifications.scss';
import { ReactComponent as Back } from '../../../../assets/svg/sidebar/notifications/back.svg';
import { ReactComponent as Search } from '../../../../assets/svg/sidebar/notifications/search.svg';
import { ReactComponent as Filter } from '../../../../assets/svg/sidebar/notifications/filter.svg';
import { ReactComponent as Menu } from '../../../../assets/svg/sidebar/notifications/menu.svg';
import { ReactComponent as WhiteDot } from '../../../../assets/svg/sidebar/notifications/white-dot.svg';
import Context from '../../../../context/context';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';

const initialState = {
	loading: true,
	activityLogsData: [],
	currentPage: 1,
	hasNextPage: false,
};

const ctaMapper = [
	{
		id: 1,
		icon: <Back />,
		action: 'back',
	},
	{
		id: 2,
		icon: <Search />,
		action: 'search',
	},
	{
		id: 3,
		icon: <Filter />,
		action: 'filter',
	},
	{
		id: 4,
		icon: <Menu />,
		action: 'menu',
	},
];

const infiniteScrollHeight = 'calc(100vh - 72px)';

const Notifications = ({ showNotificationsDrawer, setShowNotificationsDrawer }) => {
	let {
		templates: { getActivityLogs, activityLogs, moreActivityLogs },
	} = useContext(Context);

	const [info, setInfo] = useState({ ...initialState });

	useEffect(() => {
		if (showNotificationsDrawer) {
			getActivityLogsData(1);
		}
	}, [showNotificationsDrawer]);

	useEffect(() => {
		if (activityLogs) {
			handleActivityLogsData(activityLogs);
		}
	}, [activityLogs]);

	useEffect(() => {
		if (moreActivityLogs) {
			handleActivityLogsData(moreActivityLogs, true);
		}
	}, [moreActivityLogs]);

	const handleActivityLogsData = useCallback(
		(incomingData, fetchMore = false) => {
			const { currentPage, data, hasNextPage } = incomingData;
			let activityLogsData = data;
			if (fetchMore) {
				activityLogsData = [...info?.activityLogsData, ...data];
			}

			setInfo((prev) => ({
				...prev,
				loading: false,
				activityLogsData: activityLogsData,
				hasNextPage,
				currentPage,
			}));
		},
		[info],
	);

	const getActivityLogsData = useCallback(
		(page, fetchMore = false) => {
			const payload = {
				filters: {
					limit: 30,
					page: page,
				},
			};

			getActivityLogs(payload, fetchMore);
		},
		[info?.hasNextPage, info?.loading],
	);

	const fetchMoreActivityLogs = useCallback(() => {
		if (info?.hasNextPage) {
			getActivityLogsData(info?.currentPage + 1, true);
		}
	}, [info?.currentPage, info?.hasNextPage]);

	const formatTimestamp = (timestamp) => {
		return moment.unix(timestamp).fromNow();
	};

	const handleCloseDrawer = () => {
		setShowNotificationsDrawer(false);
		setInfo({ ...initialState });
	};

	const handleCtaClick = (action) => {
		if (action === 'back') {
			handleCloseDrawer();
		}
	};

	return (
		<Drawer
			title={null}
			open={showNotificationsDrawer}
			onClose={handleCloseDrawer}
			placement="left"
			width={346}
			rootClassName="sidebar-notifications-drawer"
			closeIcon={null}
		>
			<div className="notifications-drawer-container">
				<div className="header">
					<h1 className="title">Notifications</h1>
					<div className="cta-container">
						{ctaMapper?.map((cta) => (
							<div onClick={() => handleCtaClick(cta?.action)} key={cta?.id}>
								{cta?.icon}
							</div>
						))}
					</div>
				</div>
				<div className="body">
					{info?.loading ? (
						<div className="loading-state">
							<p className="message">Loading notifications...</p>
						</div>
					) : info?.activityLogsData?.length === 0 ? (
						<div className="empty-state">
							<p className="message">No notifications yet!</p>
						</div>
					) : (
						<InfiniteScroll
							dataLength={info?.activityLogsData?.length || 0}
							next={fetchMoreActivityLogs}
							hasMore={info?.hasNextPage}
							loader={<FetchMoreLoaderComp />}
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								gap: '8px',
								flex: '1 0 0',
								alignSelf: 'stretch',
							}}
							height={infiniteScrollHeight}
						>
							{info?.activityLogsData?.map((activityLog) => (
								<div key={activityLog?._id} className="activity-log">
									<WhiteDot />
									<p className="summary">
										{activityLog?.summary || ''}
										<br />
										<span className="action">{activityLog?.action}</span>
									</p>
									<p className="time">
										{activityLog?.timestamp
											? formatTimestamp(activityLog?.timestamp)
											: ''}
									</p>
								</div>
							))}
						</InfiniteScroll>
					)}
				</div>
			</div>
		</Drawer>
	);
};

export default Notifications;
