import { useEffect, useState } from 'react';
import {
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';

export const withRouter = (WrappedComponent) => (props) => {
	const params = useParams();
	const navigate = useNavigate();
	const locations = useLocation();

	const [searchParams] = useSearchParams();

	return (
		<WrappedComponent
			{...props}
			locations={locations}
			params={params}
			navigate={navigate}
			searchParams={[...searchParams]}
		/>
	);
};
