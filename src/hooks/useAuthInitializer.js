import useAuth from './useAuth';
import useTheme from './useTheme';
import useIntercom from './useIntercom';
import useSubscription from './useSubscription';
import useTokenExpiry from './useTokenExpiry';
import useAccessControls from './useAccessControls';
import useWorkspaceMode from './useWorkspaceMode';

const useAuthInitializer = () => {
	const { authLoading } = useAuth();
	const { workspaceModeLoading } = useWorkspaceMode();
	useTheme();
	useIntercom();
	useSubscription();
	useTokenExpiry();
	const { accessControlsLoading } = useAccessControls();

	const authInitialized = authLoading || accessControlsLoading || workspaceModeLoading;
	return { authInitialized };
};

export default useAuthInitializer;
