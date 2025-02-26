import React, { memo } from 'react';
import { ReactComponent as DoubleArrow } from '../../../../assets/svg/worflow_builder/buildercard/doubleArrow.svg';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/headerComponent.scss';

const HeaderComponent = ({ onBack, heading }) => {
	return (
		<div className="automation-builder-header">
			<div className="automation-builder-header-back" onClick={onBack}>
				<DoubleArrow />
			</div>
			<div className="automation-builder-header-heading">{heading}</div>
		</div>
	);
};

export default memo(HeaderComponent);
