import { useNavigate } from 'react-router-dom';

const isAuthenticated = () => {
	const usertoken = localStorage.getItem('usertoken');
	const workspaceId = localStorage.getItem('workspaceId');
	const region = localStorage.getItem('region') || 'ap-south-1';

	if (usertoken && workspaceId) {
		return true;
	}

	return false;
};

const AuthenticatedRoute = ({ children }) => {
	const navigate = useNavigate();
	if (!isAuthenticated()) {
		navigate('/');
		return null;
	}

	return children;
};

export default AuthenticatedRoute;
