import PageLoader from '../features/app/PageLoader';
import useTheme from '../../hooks/useTheme';
import useWorkspaceMode from '../../hooks/useWorkspaceMode';
import CustomToast from '../components/globalComponents/CustomToast';

const Public = ({ children }) => {
	useTheme();
	const { workspaceModeLoading } = useWorkspaceMode();

	return workspaceModeLoading ? (
		<PageLoader />
	) : (
		<>
			{children}
			<CustomToast />
		</>
	);
};

export default Public;
