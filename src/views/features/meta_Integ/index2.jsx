import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
const Testing = () => {
	const navigate = useNavigate();
	const { workspaceId } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();

	return (
		<div
			style={{ width: '100%', height: '100%', border: '2px solid red' }}
			onClick={() => navigate(-1)}
		>
			Hello
		</div>
	);
};

export default Testing;
