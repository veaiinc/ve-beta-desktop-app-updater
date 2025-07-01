import useAuth from './useAuth';
import useTheme from './useTheme';
import useIntercom from './useIntercom';
import useSubscription from './useSubscription';
import useTokenExpiry from './useTokenExpiry';
import useAccessControls from './useAccessControls';
import useWorkspaceMode from './useWorkspaceMode';

const useAuthInitializer = () => {
	useAuth();
	useTheme();
	useIntercom();
	useSubscription();
	useTokenExpiry();
	useAccessControls();
	const { loading } = useWorkspaceMode();

	return { loading };
};

export default useAuthInitializer;
