// import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ContextState from '../context/ContextStates';
const withRouter = (Component) => {
	return (props) => {
		const location = useLocation();
		const navigate = useNavigate();
		const navigateData = useNavigate();
		const params = useParams();

		return (
			<ContextState>
				<Component
					{...props}
					router={{
						location,
						navigate,
						navigateData,
						params,
					}}
				/>
			</ContextState>
		);
	};
};

export default withRouter;
