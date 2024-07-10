import React, { useContext, useState, useEffect, memo } from 'react';
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
const _ = require('lodash');

function MyWorkFlowDetails(props) {
	const navigate = useNavigate();
	const location = useLocation();
	const { salesId } = useParams();
	let {
		templates: { workflowslist, getProposals, getTemplatesStatus, getTemplates },
	} = useContext(Context);
	const [workspaceId, setWorkspaceId] = useState(localStorage.getItem('workspaceId'));
	const [templateDetails, setTemplateDetails] = useState([]);
	const [inSights, setInsights] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [searchInput, setSearchInput] = useState('');
	const [timeoutId, setTimeoutId] = useState(null);
	const [info, setInfo] = useState({
		data: location?.state?.data,
		proposalData: null,
	});

	const searchParams = new URLSearchParams(location.search);
	const status = searchParams.get('status');

	const [metaData, setMetaData] = useState({
		page: 1,
		status: status ? status : 'draft',
		hasMore: true,
		hasNextPage: false,
		currentPage: 1,
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
			const { data, currentPage, hasNextPage } = workflowslist;
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
			console.log(updatedData);

			setInfo((prev) => ({
				...prev,
				currentPage,
				hasNextPage,
				proposalData: updatedData,
				isLoading: false,
			}));
		}
	}, [workflowslist]);

	const fetchProposalstatus = async () => {
		let response = await getTemplatesStatus(salesId);
		if (response[0]) {
			setLoading(false);
			setInsights(_.filter(response[1]));
		}
	};

	const fetchProposals = async (page = 1, fetchMore = false, search = null) => {
		const payload = {
			filters: {
				limit: 100,
				page: page,
			},
		};
		getProposals(payload);
	};

	const handleSearchInput = (e) => {
		const { value } = e.target;

		setSearchInput(value);

		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		if (value.length > 3) {
			const id = setTimeout(() => {
				fetchProposals(1);
			}, 500);

			setTimeoutId(id);
		}
	};

	const updateProposalsList = async () => {
		fetchProposals(1);
		fetchProposalstatus();
	};

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
					<input type="text" placeholder="Search Lead" onChange={handleSearchInput} />
				</div>
			</div>
			<MyWorkFlowStatsCard
				hideImage={true}
				workflow={info?.data}
				inSights={inSights[0]}
				singleCard={true}
				activeTab={metaData['status']}
			/>
			{isLoading ? (
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
					next={fetchProposals}
					hasMore={info?.hasNextPage}
					loader={<h4>Loading...</h4>}
					endMessage={''}
					refreshFunction={() => fetchProposals(1)}
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
		</div>
	);
}

export default memo(MyWorkFlowDetails);
