import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MyWorkFlowStatsCard from '../../components/sales/myWorkFlowStatsCard';
import SalesLeadCard from '../../components/sales/salesLeadCard';
import '../../../assets/scss/sales/myWorkFlowDetails.scss';
import { ReactComponent as LeftArrow } from '../../../assets/svg/left-arrow.svg';
import { ReactComponent as Search } from '../../../assets/svg/seach-magnifier.svg';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';

function MyWorkFlowDetails(props) {
	const { salesId } = useParams();
	const [workspaceId, setWorkspaceId] = useState('');
	const [proposalData, setProposalData] = useState([]);
	const [isLoading, setLoading] = useState(true);
	const [metaData, setMetaData] = useState({
		page: 1,
		hasMore: true,
	});

	let {
		templates: { getProposals },
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
			fetchTemplates();
		}
	}, [workspaceId]);

	const fetchTemplates = async (page = null) => {
		let response = await getProposals(page ? page : metaData['page']);
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

	return (
		<div className="myWorkFlowDetailsContainer">
			<div className="header">
				<div className="leftSideContent">
					<LeftArrow />
					<p>
						Workflow Name <span>(EDIT)</span>
					</p>
				</div>
				<div className="inputContainer">
					<Search />
					<input type="text" placeholder="Search" />
				</div>
			</div>
			<MyWorkFlowStatsCard workflow={{ _id: '', title: '', displayImageURL: '' }} />
			{isLoading ? (
				''
			) : (
				<InfiniteScroll
					dataLength={proposalData.length}
					next={fetchTemplates}
					hasMore={metaData['hasMore']}
					loader={<h4 style={{ color: 'red' }}>Loading...</h4>}
					endMessage={
						<p style={{ textAlign: 'center' }}>
							<b>Yay! You have seen it all</b>
						</p>
					}
					refreshFunction={() => fetchTemplates(1)}
					pullDownToRefresh
					pullDownToRefreshThreshold={50}
					pullDownToRefreshContent={
						<h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
					}
					releaseToRefreshContent={
						<h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
					}
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
