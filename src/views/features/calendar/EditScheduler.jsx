import React, { memo } from 'react';
import '../../../assets/scss/scheduler/editScheduler.scss';
import { ReactComponent as Back } from '../../../assets/svg/subscription/back.svg';
import SessionInfoCard from '../../components/scheduler/SessionInfoCard';
import { useNavigate } from 'react-router-dom';

const EditScheduler = () => {
	const navigate = useNavigate();
	return (
		<div className="editSchedulerParentContainer">
			<div className="editSchedulerHeader">
				<Back onClick={() => navigate(-1)} className="backArrow" />
				<SessionInfoCard />
			</div>
		</div>
	);
};

export default memo(EditScheduler);
