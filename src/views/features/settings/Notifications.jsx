import React, { useEffect, useContext } from 'react';
import '../../../assets/scss/settings/notifications.scss';
import Context from '../../../context/context';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../../components/loaders/Spinner';

const AICreditsUsedRowData = [
	{
		id: 1,
		label: 'Type',
		width: '240px',
	},
	{
		id: 2,
		label: 'Credits Used',
		width: '240px',
	},
	{
		id: 3,
		label: 'Used By',
		width: '240px',
	},
	{
		id: 4,
		label: 'Used At',
		width: '240px',
	},
	{
		id: 5,
		label: 'Used For',
		width: '240px',
	},
];

const Notifications = () => {
	const {
		companyInfo: { getAICreditsUsedData, AICreditsData },
	} = useContext(Context);

	useEffect(() => {
		getAICreditsUsedData(1, 15);
	}, []);

	useEffect(() => {
		console.log('AICreditsData', AICreditsData);
	}, [AICreditsData]);

	const fetchMoreAICredits = () => {
		getAICreditsUsedData(AICreditsData?.nextPage, 15);
	};

	return (
		<div className="notifications-main-container">
			<div className="notifications-container">
				<h1 className="notifications-header-title">AI Credits Used</h1>
				<div className="credits-table-container">
					<div
						id="AICreditsContainer"
						style={{ flex: 1, overflowY: 'auto', maxHeight: '100%', height: '100%' }}
					>
						<InfiniteScroll
							className="workflows-infinite-scroll"
							dataLength={AICreditsData?.data?.length || 0}
							height={310}
							scrollableTarget="AICreditsContainer"
							hasMore={AICreditsData?.hasNextPage}
							next={fetchMoreAICredits}
							loader={
								<div
									style={{
										color: 'white',
										textAlign: 'center',
										fontSize: '10px',
										padding: '4px',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										gap: '4px',
									}}
								>
									<span>Fetching More Files...</span>
									<Spinner width={'12px'} height={'12px'} />
								</div>
							}
						>
							<div className="table w-1200px">
								{AICreditsUsedRowData?.map((item) => (
									<div
										key={item?.id}
										className="table-header"
										style={{ width: item?.width }}
									>
										{item?.label}
									</div>
								))}
							</div>
							<div className="divider w-1200px"></div>
							<div className="ai-credits-data-container">
								{AICreditsData?.data?.map((UnitAICreditsData) => (
									<div key={UnitAICreditsData?.id} className="table w-1200px">
										<div className="column" style={{ width: '240px' }}>
											{UnitAICreditsData?.type}
										</div>
										<div className="column" style={{ width: '240px' }}>
											{UnitAICreditsData?.usageCost}
										</div>
										<div className="column" style={{ width: '240px' }}>
											{UnitAICreditsData?.usedBy}
										</div>
										<div className="column" style={{ width: '240px' }}>
											{UnitAICreditsData?.createdAt
												? moment
														.unix(UnitAICreditsData.createdAt)
														.format('MMMM D, YYYY h:mm A')
												: ''}
										</div>
										<div className="column" style={{ width: '240px' }}>
											{UnitAICreditsData?.usedFor}
										</div>
									</div>
								))}
							</div>
						</InfiniteScroll>
					</div>
				</div>
				<ul className="menu-items"></ul>
			</div>
		</div>
	);
};

export default Notifications;
