import React, { useEffect, useContext, memo } from 'react';
import '../../../assets/scss/settings/notifications.scss';
import Context from '../../../context/context';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../../components/loaders/Spinner';
import { FetchMoreLoaderComp } from '../../../helpers';

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
const page = 1;
const limit = 15;

const AICreditsUsage = () => {
	const {
		companyInfo: { getAICreditsUsedData, AICreditsData },
	} = useContext(Context);
	const nextPage = AICreditsData?.nextPage;

	useEffect(() => {
		getAICreditsUsedData(page, limit);
	}, []);

	const fetchMoreAICredits = () => {
		getAICreditsUsedData(nextPage, limit);
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
							loader={<FetchMoreLoaderComp />}
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
														?.unix(UnitAICreditsData.createdAt)
														?.format('MMMM D, YYYY h:mm A')
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
			</div>
		</div>
	);
};

export default memo(AICreditsUsage);
