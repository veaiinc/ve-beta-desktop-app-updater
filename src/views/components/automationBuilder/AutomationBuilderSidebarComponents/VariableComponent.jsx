import React from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/variableComponent.scss';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';

import { Tooltip } from 'antd';
const VariableComponent = () => {
	return (
		<div className="variableComponentContainer">
			<div className="inputContainer">
				<input type="text" placeholder="Variable Name" />
			</div>
			<Tooltip
				title={
					<div className="variableTooltipContainer">
						<div className="variableTooltipHeader">
							<ChevronRightThinSvg style={{ rotate: '180deg' }} />
							<span className="variableTooltipHeaderTitle">Variable name</span>
						</div>
						<div className="variableTooltipBody">
							<div className="variableListItem">
								<span className="variableListItemTitle">Variable name</span>
								<div className="variableListRightContainer">
									3 <ChevronRightThinSvg />
								</div>
							</div>
							<div className="variableListItem">
								<span className="variableListItemTitle">Variable name</span>
								<div className="variableListRightContainer">
									3 <ChevronRightThinSvg />
								</div>
							</div>
							<div className="variableListItem">
								<span className="variableListItemTitle">Variable name</span>
								<div className="variableListRightContainer">
									3 <ChevronRightThinSvg />
								</div>
							</div>
						</div>
					</div>
				}
				placement="bottom"
				arrow={false}
				color="transparent"
				overlayStyle={{
					minWidth: 'fit-content',
				}}
			>
				<button className="insertVariableButton">Insert variable</button>
			</Tooltip>
		</div>
	);
};

export default VariableComponent;
