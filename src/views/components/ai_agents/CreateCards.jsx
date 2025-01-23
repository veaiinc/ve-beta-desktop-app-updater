/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/ai_agents/customCards.scss';
import { ReactComponent as Loader } from '../../../assets/svg/ai_agents/loader.svg';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp, fetchOriginSelection } from '../../../helpers';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as ThreeDotsVerticalIcon } from '../../../assets/svg/home_page/workflows/DotsThreeVertical.svg';
let origin = fetchOriginSelection();

const CreateCards = () => {
	const navigate = useNavigate();
	let {
		templates: { toggleCreateLeadModal },
	} = useContext(Context);
	const createCardsOptions = [
		{
			title: 'Lead',
			subText: 'Create a Lead ',
			dotColor: '#EDA145',
			onClick: () => {
				toggleCreateLeadModal({ createLeadModalContextState: true });
			},
		},
		{
			title: 'Meeting',
			subText: 'Create Meeting ',
			dotColor: '#F95A2C',
			onClick: () => {
				navigate('/calendar');
			},
		},
		{
			title: 'Workflow',
			subText: 'Create a Workflow ',
			dotColor: '#07982F',
			onClick: () => {
				navigate('/playbook');
			},
		},
		{
			title: 'Task',
			subText: 'Create a Task ',
			dotColor: '#6055EC',
			onClick: () => {
				navigate('/tasks');
			},
		},
		// { title: 'Schedule', subText: 'Check the Schedule ', dotColor: '#FCD7A5' },
		// { title: 'New Design', subText: 'Check New Designs for and templates ', dotColor: '#4F8E8D' },
	];
	return (
		<div className="aiAgentsCreatecards">
			<div className="createCardsHeader" style={{ alignSelf: 'stretch' }}>
				<span className="createCardsHeaderTexct">Create</span>+
			</div>

			<div className="createCardsHolderContainer">
				{createCardsOptions?.map((ele, index) => (
					<div
						className="createSubCardOptionsdcards"
						key={index}
						onClick={ele?.onClick}
						style={{ cursor: 'pointer' }}
					>
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
				<ThreeDotsVerticalIcon />
			</div>

			<div style={{ width: '100%' }}>
				<InfiniteScroll
					dataLength={info?.activityLogsData?.length || 0}
					next={fetchMoreActivityLogs}
					hasMore={info?.hasNextPage}
					loader={<FetchMoreLoaderComp />}
					style={{
						// display: 'flex',
						// flexDirection: 'column',
						// gap: '8px',
						// width: '100%',
						// padding: '0px 20px 0px 20px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'flex-start',
						gap: '8px',
						flex: '1 0 0',
						alignSelf: 'stretch',
					}}
					height={'340px'}
				>
					{info?.activityLogsData?.map((ele, index) => (
						<div className="aiAgentsActivityCards" key={index}>
							<span
								className="aiAgentsActivityCardsHeaderText"
								style={{ textTransform: 'capitalize' }}
							>
								{ele?.summary || ''}
							</span>

							<div className="aiAgentsActivityCardsSubText">text</div>
							<span className="aiAgentsActivityCardTime">
								{ele?.timestamp ? formatTimestamp(ele?.timestamp) : ''}
							</span>
						</div>
					))}
				</InfiniteScroll>
			</div>
		</div>
	);
});

const Drafts = memo(() => {
	let {
		templates: {
			getDrafStateWorkflowtemplates,
			draftStateWorkflowtemplates,
			moreDraftStateWorkflowtemplates,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		loading: true,
		draftData: [],
		page: 1,
		hasNextPage: false,
	});

	useEffect(() => {
		getDraftStateWorflowTemplateData(1);
	}, []);

	useEffect(() => {
		if (draftStateWorkflowtemplates) {
			handleDraftData(draftStateWorkflowtemplates);
		}
	}, [draftStateWorkflowtemplates]);

	useEffect(() => {
		if (moreDraftStateWorkflowtemplates) {
			handleDraftData(moreDraftStateWorkflowtemplates, true);
		}
	}, [moreDraftStateWorkflowtemplates]);

	const handleDraftData = useCallback(
		(incomingData, fetchMore = false) => {
			const { currentPage, data, hasNextPage } = incomingData;
			let draftData = data;
			if (fetchMore) {
				draftData = [...info?.draftData, ...data];
			}

			setInfo((prev) => ({
				...prev,
				loading: false,
				draftData: draftData,
				hasNextPage,
				currentPage,
			}));
		},
		[info],
	);

	const getDraftStateWorflowTemplateData = useCallback(
		(page, fetchMore = false) => {
			const payload = {
				filters: {
					limit: 10,
					page: page,
					type: 'workspace',
					status: 'draft',
					sortBy: 'createdAt',
					sortType: -1,
				},
			};

			getDrafStateWorkflowtemplates(payload, fetchMore);
		},
		[info?.hasNextPage, info?.loading],
	);

	const fetchMoreDraftsData = useCallback(() => {
		if (info?.hasNextPage) {
			getDraftStateWorflowTemplateData(info?.page + 1, true);
		}
	}, [info?.page, info?.hasNextPage]);

	const formatTimestamp = (timestamp) => {
		return moment.unix(timestamp).fromNow();
	};

	const onDraftClick = useCallback((id) => {
		window.location.href = `${origin}/${id}`;
	}, []);

	return (
		<div className="aiAgentsDraftsContainer">
			<div className="createCardsHeader">
				<span className="createCardsHeaderTexct">Drafts</span>
				<ThreeDotsVerticalIcon />
			</div>

			<div style={{ width: '100%' }}>
				{info?.loading ? (
					<div className="drafLoaderContainer">
						{[{}, {}, {}, {}]?.map((ele, index) => (
							<Skeleton
								style={{ height: '63px', borderRadius: '10px' }}
								key={index}
							/>
						))}
					</div>
				) : (
					<InfiniteScroll
						dataLength={info?.draftData?.length || 0}
						next={fetchMoreDraftsData}
						hasMore={info?.hasNextPage}
						loader={<FetchMoreLoaderComp />}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '8px',
							flex: '1 0 0',
						}}
						height={'340px'}
					>
						{info?.draftData?.map((ele, index) => (
							<div
								className="aiAgentsDraftsCard"
								key={index}
								style={{
									// justifyContent: 'center',
									minHeight: '63px',
									cursor: 'pointer',
								}}
								onClick={() => onDraftClick(ele?._id)}
							>
								<span className="aiAgentsDraftsCardIcon"></span>
								<span
									className="aiAgentsDraftsCardText"
									style={{
										fontFamily: 'Inter',
										fontSize: '12px',
										fontStyle: 'normal',
										fontWeight: '500',
										lineHeight: 'normal',
										color: '#E8E8E8',
									}}
								>
									{ele?.title}
								</span>
								<span className="aiAgentsDraftsCardTime">
									{ele?.createdAt ? formatTimestamp(ele?.createdAt) : ''}
								</span>
							</div>
						))}
					</InfiniteScroll>
				)}
			</div>
		</div>
	);
});

const Notes = memo(() => {
	return (
		<div className="aiAgentsNotesContainer">
			<div className="createCardsHeader">
				<span className="createCardsHeaderTexct">Notes</span>
				<ThreeDotsVerticalIcon />
			</div>

			<div className="aiAgentsNotesCard">
				<span
					className="aiAgentsNotesCardHeaderText"
					style={{ textTransform: 'capitalize' }}
				>
					jgkrke
				</span>

				<div className="aiAgentsNotesCardSubText">text</div>
				<span className="aiAgentsNotesCardTime">a day ago</span>
			</div>
		</div>
	);
});

export { Activity, Drafts, Notes };
