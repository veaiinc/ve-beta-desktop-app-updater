import React from 'react';
import '../../../../assets/scss/workflowBuilder/workflowBuilderSidebarComponents/conditions.scss';
import { ReactComponent as DoubleArrow } from '../../../../assets/svg/worflow_builder/buildercard/doubleArrow.svg';
import { ReactComponent as Search } from '../../../../assets/svg/worflow_builder/buildercard/search.svg';

const Conditions = ({ onCLose }) => {
	return (
		<div className="actionSidebarComponents">
			<div className="actionSidebarComponentsHeader">
				<span onClick={onCLose} style={{ cursor: 'pointer' }}>
					<DoubleArrow />
				</span>
			</div>

			<div className="actionSideBarSearchbarContainer">
				<div className="actionSidebarSearch">
					<span style={{ paddingTop: '12px', paddingBottom: '12px' }}>
						<Search />
					</span>
					<input className="actionSideBarSearchInput" placeholder="Search Conditions" />
				</div>
			</div>
		</div>
	);
};

export default Conditions;
