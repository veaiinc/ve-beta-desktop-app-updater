import { useNavigate } from 'react-router-dom';

const isAuthenticated = () => {
	const usertoken = localStorage.getItem('usertoken');
	const workspaceID = localStorage.getItem('workspaceID');
	const region = localStorage.getItem('region') || 'ap-south-1';

	if (usertoken && workspaceID) {
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
