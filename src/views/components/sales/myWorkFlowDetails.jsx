import React from 'react';
import MyWorkFlowStatsCard from '../../components/sales/myWorkFlowStatsCard';
import SalesLeadCard from '../../components/sales/salesLeadCard';
import '../../../assets/scss/sales/myWorkFlowDetails.scss';
import { ReactComponent as LeftArrow } from '../../../assets/svg/left-arrow.svg';
import { ReactComponent as Search } from '../../../assets/svg/seach-magnifier.svg';

function MyWorkFlowDetails(props) {
	return (
		<div className="container">
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
			<MyWorkFlowStatsCard />
			<div className="salesCardContainer">
				<SalesLeadCard />
				<SalesLeadCard />
				<SalesLeadCard />
				<SalesLeadCard />
				<SalesLeadCard />
			</div>
		</div>
	);
}

export default MyWorkFlowDetails;
