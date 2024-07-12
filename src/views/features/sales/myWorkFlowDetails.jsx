import React, { useContext, useState, useEffect, memo, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MyWorkFlowStatsCard from '../../components/sales/myWorkFlowStatsCard';
import SalesLeadCard from '../../components/sales/salesLeadCard';
import '../../../assets/scss/sales/myWorkFlowDetails.scss';
import { ReactComponent as LeftArrow } from '../../../assets/svg/left-arrow.svg';
import { ReactComponent as Search } from '../../../assets/svg/seach-magnifier.svg';
import { ReactComponent as EmptyState } from '../../../assets/svg/emptyStates/leads-empty-state.svg';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import CreateLeadModal from '../../components/modalsV2/proposalModals/CreateLeadModal';
const _ = require('lodash');

function MyWorkFlowDetails(props) {
	const navigate = useNavigate();
	const location = useLocation();
	const { salesId } = useParams();
	let {
		templates: { workflowslist, getProposals, getTemplatesStatus, getTemplates, moreWorkList },
	} = useContext(Context);

	const [inSights, setInsights] = useState([]);
	const [timeoutId, setTimeoutId] = useState(null);
	const [info, setInfo] = useState({
		data: location?.state?.data,
		proposalData: null,
		loading: true,
		timeout: null,
		modalIsOpen: false,
		createLeadData: null,
	});

	const searchParams = new URLSearchParams(location.search);
	const status = searchParams.get('status');

	const [metaData, setMetaData] = useState({
		page: 1,
		status: status ? status : 'draft',
		hasMore: true,
		hasNextPage: false,
		currentPage: 1,
		search: '',
		searchChanged: false,
	});

	useEffect(() => {
		fetchProposals(1);
		// fetchProposalstatus();
	}, []);

	useEffect(() => {
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [timeoutId]);

	useEffect(() => {
		if (workflowslist) {
			workflowListDataHandling(workflowslist);
		}
	}, [workflowslist]);

	useEffect(() => {
		if (moreWorkList) {
			workflowListDataHandling(workflowslist, true);
		}
	}, [moreWorkList]);

	useEffect(() => {
		if (info?.searchChanged) {
			handleDebounceSearch(info?.search);
		}
	}, [info?.search, info?.searchChanged]);

	const fetchProposalstatus = async () => {
		let response = await getTemplatesStatus(salesId);
		if (response[0]) {
			// setLoading(false);
			setInsights(_.filter(response[1]));
		}
	};

	const fetchProposals = async (page = 1, fetchMore = false, search = null) => {
		const payload = {
			filters: {
				limit: 10,
				page: page,
				templateId: info?.data?._id,
			},
		};

		if (search && search?.length) {
			payload.filters.title = search;
		}

		getProposals(payload, fetchMore);
	};

	const updateProposalsList = async () => {
		fetchProposals(1);
		fetchProposalstatus();
	};

	const refreshFunction = useCallback(async () => {
		fetchProposals(1, false, null);
		setInfo((prev) => ({ ...prev, loading: true, searchChanged: false }));
	}, [fetchProposals]);

	const fetchMoreProposal = useCallback(async () => {
		fetchProposals(info?.currentPage + 1, true);
	}, [fetchProposals, info?.currentPage]);

	const workflowListDataHandling = useCallback(
		async (datavariable, more = false) => {
			const { data, currentPage, hasNextPage } = datavariable;
			let updatedData = [];
			for (let i = 0; i < data.length; i++) {
				const proposalIdfromModuleArray = data?.[i]?.modules?.filter(
					(ele) => ele?.type === 'proposal',
				);

				if (proposalIdfromModuleArray?.length > 0) {
					const proposalFilterArray = data?.[i]?.proposals?.filter(
						(ele) => ele?._id === proposalIdfromModuleArray?.[0]?._id,
					);
					if (proposalFilterArray?.length) {
						let dataObj = {
							...(data?.[i] || {}),
							...(proposalFilterArray?.[0] || {}),
							createdBy: data?.[i]?.createdBy,
						};
						updatedData.push(dataObj);
					}
				}
			}

			setInfo((prev) => ({
				...prev,
				currentPage,
				hasNextPage,
				proposalData: more ? prev.proposalData?.concat(updatedData) : updatedData,
				loading: false,
			}));
		},
		[info?.proposalData],
	);

	const handleDebounceSearch = useCallback(
		(search) => {
			clearInterval(info?.timeout);
			const timeout = setTimeout(() => {
				fetchProposals(1, false, search);
				setInfo((prev) => ({
					...prev,
					loading: true,
					timeout: null,
				}));
			}, 500);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[info?.timeout],
	);

	const closeModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, modalIsOpen: false }));
	}, []);

	const openModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, modalIsOpen: true }));
	}, []);

	return (
		<div className="myWorkFlowDetailsContainer">
			<div className="header">
				<div className="leftSideContent">
					<div onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
						<LeftArrow />
					</div>
					<p>
						{info?.data?.title}{' '}
						<a href={`https://builder.ve.co/${info?.data?._id}`}>
							<span>(EDIT)</span>
						</a>
					</p>
				</div>
				<div className="inputContainer">
					<Search />
					<input
						type="text"
						placeholder="Search Lead"
						value={info?.search}
						onChange={(e) =>
							setInfo((prev) => ({
								...prev,
								search: e.target.value,
								searchChanged: true,
							}))
						}
					/>
				</div>
			</div>
			<MyWorkFlowStatsCard
				hideImage={true}
				workflow={info?.data}
				inSights={inSights[0]}
				singleCard={true}
				activeTab={metaData['status']}
				openModal={openModal}
			/>
			{info?.loading ? (
				''
			) : info?.proposalData?.length === 0 ? (
				<div className="emptyStateContainer">
					<EmptyState />
					<div className="textContainer">
						<p className="mainText">No Lead Yet</p>
						<p className="subText">
							We have no leads available at this stage, you will see them soon
						</p>
					</div>
				</div>
			) : (
				<InfiniteScroll
					dataLength={info?.proposalData?.length || 0}
					next={fetchMoreProposal}
					hasMore={info?.hasNextPage}
					loader={<h4>Loading...</h4>}
					endMessage={''}
					refreshFunction={refreshFunction}
					pullDownToRefresh
					pullDownToRefreshThreshold={50}
				>
					<div className="salesCardContainer">
						{info?.proposalData?.map((proposal, index) => {
							return (
								<SalesLeadCard
									key={index}
									data={proposal}
									fetchProposals={() => updateProposalsList()}
								/>
							);
						})}
					</div>
				</InfiniteScroll>
			)}
			<CreateLeadModal
				workflow={info?.data}
				modalIsOpen={info?.modalIsOpen}
				closeModal={closeModal}
			/>
		</div>
	);
}

export default memo(MyWorkFlowDetails);
