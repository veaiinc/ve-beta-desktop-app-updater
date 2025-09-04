import useAuth from './useAuth';
import useTheme from './useTheme';
import useSubscription from './useSubscription';
import useTokenExpiry from './useTokenExpiry';
import useAccessControls from './useAccessControls';
import useWorkspaceMode from './useWorkspaceMode';
import registerOfflineSW from '../helpers/registerOfflineSW';

const useAuthInitializer = () => {
	registerOfflineSW();
	const { authLoading } = useAuth();
	const { workspaceModeLoading, workspaceMode } = useWorkspaceMode();
	useTheme();
	useSubscription();
	useTokenExpiry();
	const { accessControlsLoading } = useAccessControls();

	const authInitialized = authLoading || accessControlsLoading || workspaceModeLoading;
	return { authInitialized, workspaceMode };
};

export default useAuthInitializer;
