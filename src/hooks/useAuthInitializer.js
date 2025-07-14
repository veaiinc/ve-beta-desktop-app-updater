import useAuth from './useAuth';
import useTheme from './useTheme';
import useIntercom from './useIntercom';
import useSubscription from './useSubscription';
import useTokenExpiry from './useTokenExpiry';
import useAccessControls from './useAccessControls';
import useActiveWorkspace from './useActiveWorkspace';

const useAuthInitializer = () => {
	useAuth();
	useTheme();
	useIntercom();
	useSubscription();
	useTokenExpiry();
	useAccessControls();
	useActiveWorkspace();
};

export default useAuthInitializer;
