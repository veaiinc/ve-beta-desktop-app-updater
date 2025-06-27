import PageLoader from '../features/app/PageLoader';
import useTheme from '../hooks/useTheme';
import useWorkspaceMode from '../hooks/useWorkspaceMode';

const Public = ({ children }) => {
	useTheme();
	const { loading } = useWorkspaceMode();
	return loading ? <PageLoader /> : <>{children}</>;
};

export default Public;
