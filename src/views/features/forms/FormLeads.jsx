import React, { memo } from 'react';
import '../../../assets/scss/forms/formLeads.scss';
import { ReactComponent as BackArrowSvg } from '../../../assets/svg/workflow/backarrow.svg';
import { useNavigate } from 'react-router-dom';
const FormLeads = () => {
	const navigate = useNavigate();
	return (
		<div className="formLeadsParentContainer">
			<div className="headerContainer">
				<span className="actionBtn" onClick={() => navigate('/forms')}>
					<BackArrowSvg />
					<span>Back</span>
				</span>
			</div>
		</div>
	);
};

export default memo(FormLeads);
