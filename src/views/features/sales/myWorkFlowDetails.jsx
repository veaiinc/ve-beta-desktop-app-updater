import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MyWorkFlowStatsCard from '../../components/sales/myWorkFlowStatsCard';
import SalesLeadCard from '../../components/sales/salesLeadCard';
import '../../../assets/scss/sales/myWorkFlowDetails.scss';
import { ReactComponent as LeftArrow } from '../../../assets/svg/left-arrow.svg';
import { ReactComponent as Search } from '../../../assets/svg/seach-magnifier.svg';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
const _ = require('lodash');

function MyWorkFlowDetails(props) {
	const { salesId } = useParams();
	const [workspaceId, setWorkspaceId] = useState('');
	const [proposalData, setProposalData] = useState([]);
	const [templateDetails, setTemplateDetails] = useState([]);
	const [inSights, setInsights] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [searchInput, setSearchInput] = useState('');
	const [timeoutId, setTimeoutId] = useState(null);

	const [metaData, setMetaData] = useState({
		page: 1,
		hasMore: true,
	});

	let {
		templates: { getProposals, getTemplatesStatus, getTemplates },
	} = useContext(Context);

	useEffect(() => {
		const fetchWorkspaceId = async () => {
			const id = localStorage.getItem('workspaceId');
			setWorkspaceId(id);
		};

		fetchWorkspaceId();
	}, [workspaceId]);

	useEffect(() => {
		if (workspaceId) {
			fetchProposals();
			fetchProposalstatus();
			fetchTemplatesDetails();
		}
	}, [workspaceId]);

	useEffect(() => {
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [timeoutId]);

	const fetchTemplatesDetails = async () => {
		let response = await getTemplates(salesId);
		if (response[0]) {
			setLoading(false);
			setTemplateDetails(response[1][0]);
		}
	};
	const fetchProposalstatus = async () => {
		let response = await getTemplatesStatus(salesId);
		if (response[0]) {
			setLoading(false);
			setInsights(_.filter(response[1]));
		}
	};

	const fetchProposals = async (page = null) => {
		let response = await getProposals(salesId, page ? page : metaData['page'], searchInput);
		if (response[0]) {
			setLoading(false);
			setProposalData([...proposalData, ...response[1].data]);
			if (response[1].totalPages > metaData['page']) {
				setMetaData((prevState) => ({
					...prevState,
					page: metaData['page'] + 1,
					hasMore: true,
				}));
			} else {
				setMetaData((prevState) => ({
					...prevState,
					hasMore: false,
				}));
			}
		}
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

	return (
		<div className="myWorkFlowDetailsContainer">
			<div className="header">
				<div className="leftSideContent">
					<a href="/sales">
						<LeftArrow />
					</a>
					<p>
						{templateDetails.title} <span>(EDIT)</span>
					</p>
				</div>
				<div className="inputContainer">
					<Search />
					<input type="text" placeholder="Search Lead" onChange={handleSearchInput} />
				</div>
			</div>
			<MyWorkFlowStatsCard
				hideImage={true}
				workflow={templateDetails}
				inSights={inSights[0]}
			/>
			{isLoading ? (
				''
			) : (
				<InfiniteScroll
					dataLength={proposalData.length}
					next={fetchProposals}
					hasMore={metaData['hasMore']}
					loader={<h4>Loading...</h4>}
					endMessage={''}
					refreshFunction={() => fetchProposals(1)}
					pullDownToRefresh
					pullDownToRefreshThreshold={50}
				>
					<div className="salesCardContainer">
						{proposalData.map((proposal, index) => {
							return <SalesLeadCard key={index} />;
						})}
					</div>
				</InfiniteScroll>

				// 	<div className="salesCardContainer">

				// 		<SalesLeadCard />
				// 		<SalesLeadCard />
				// 		<SalesLeadCard />
				// 		<SalesLeadCard />
				// 	</div>
			)}
		</div>
	);
}

export default MyWorkFlowDetails;
