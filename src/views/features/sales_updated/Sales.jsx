import React, { memo } from 'react';
import '../../../assets/scss/sales/sales.scss';
import MyWorkflowsCard from '../../components/sales-updated/MyWorkflowsCard';

const Sales = () => {
	const data = [
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
	];
	return (
		<div className="salesParentContainer">
			{data?.map((e, index) => (
				<MyWorkflowsCard />
			))}
		</div>
	);
};

export default memo(Sales);
