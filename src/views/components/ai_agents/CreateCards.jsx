/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_agents/customCards.scss';
import { ReactComponent as Loader } from '../../../assets/svg/ai_agents/loader.svg';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import moment from 'moment';

const createCardsOptions = [
	{ title: 'Proposal', subText: 'Create a Proposal ', dotColor: '#EDA145' },
	{ title: 'Pitch Deck', subText: 'Create your Brand Pitch Deck ', dotColor: '#F95A2C' },
	{ title: 'Workflow', subText: 'Create a Workflow ', dotColor: '#07982F' },
	{ title: 'Notes', subText: 'Create a Note ', dotColor: '#6055EC' },
	{ title: 'Schedule', subText: 'Check the Schedule ', dotColor: '#FCD7A5' },
	{ title: 'New Design', subText: 'Check New Designs for and templates ', dotColor: '#4F8E8D' },
];

const activityCards = [
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},

	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},

	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
	{
		title: 'Contract Signed',
		subtext: 'I am testing',
		time: '1d ago',
	},
];

const actionMapper = {
	update: 'Updated',
	create: 'Created',
	upload: 'Uploaded',
	download: 'Downloaded',
	view: 'Viewed',
	share: 'Shared',
	send: 'Sent',
	insert: 'Inserted',
};

const CreateCards = () => {
	return (
		<div className="aiAgentsCreatecards">
			<div className="createCardsHeader">
				<span className="createCardsHeaderTexct">Create</span>+
			</div>

			<div className="createCardsHolderContainer">
				{createCardsOptions?.map((ele, index) => (
					<div className="createSubCardOptionsdcards" key={index}>
						<div className="createSubCardOptionsdcardsHeader">
							<div
								className="createOptionsCardDotContainer"
								style={{ backgroundColor: ele?.dotColor || '' }}
							></div>
							<span className="createcardOprtionsTitle">{ele?.title}</span>
						</div>
						<span className="createOptionsSubTextStyling">{ele?.subText}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(CreateCards);

const Activity = memo(() => {
	let {
		templates: { getActivityLogs, activityLogs, moreActivityLogs },
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: false,
		activityLogsData: [],
		page: 1,
		hasNextPage: false,
	});

	useEffect(() => {
		getActivityLogsData(1);
	}, []);

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
			getActivityLogsData(info?.page + 1, true);
		}
	}, [info?.page, info?.hasNextPage]);

	const formatTimestamp = (timestamp) => {
		return moment.unix(timestamp).fromNow();
	};

	return (
		<div className="aiAgentsAcitivityContainer">
			<div className="createCardsHeader">
				<span className="createCardsHeaderTexct">Activity</span>
				<Loader />
			</div>

			<div style={{ width: '100%' }}>
				<InfiniteScroll
					dataLength={info?.activityLogsData?.length || 0}
					next={fetchMoreActivityLogs}
					hasMore={info?.hasNextPage}
					loader={<FetchMoreLoaderComp />}
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
						width: '100%',
					}}
					height={'340px'}
					className="activityLogsInifiniteScroll"
				>
					{info?.activityLogsData?.map((ele, index) => (
						<div className="aiAgentsActivityCards" key={index}>
							<span
								className="aiAgentsActivityCardsHeaderText"
								style={{ textTransform: 'capitalize' }}
							>
								{`${actionMapper?.[ele?.action] || ele?.action} ${ele?.entity}`}
							</span>
							<div className="aiAgentsActivityCardsSubTextHolder">
								<span className="aiAgentsActivityCardssubTextStyling">
									{ele?.userName}
								</span>
								<span className="aiAgentsActivityCardTime">
									{formatTimestamp(ele?.timestamp)}
								</span>
							</div>
						</div>
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
});

const Drafts = memo(() => {
	return (
		<div className="aiAgentsAcitivityContainer">
			<div className="createCardsHeader">
				<span className="createCardsHeaderTexct">Drafts</span>
			</div>

			<div className="aiAgentsactivityCardsholder">
				{activityCards?.map((ele, index) => (
					<div
						className="aiAgentsActivityCards"
						key={index}
						style={{ justifyContent: 'center' }}
					>
						{/* <span className="aiAgentsActivityCardsHeaderText">{ele?.title}</span> */}
						<div className="aiAgentsActivityCardsSubTextHolder">
							<span
								className="aiAgentsActivityCardssubTextStyling"
								style={{
									fontFamily: 'Inter',
									fontSize: '12px',
									fontStyle: 'normal',
									fontWeight: '500',
									lineHeight: 'normal',
									color: '#E8E8E8',
								}}
							>
								{ele?.subtext}
							</span>
							<span className="aiAgentsActivityCardTime">{ele?.time}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
});

export { Activity, Drafts };
