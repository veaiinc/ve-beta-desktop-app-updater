import s from './pageLoader.module.scss';
import useTheme from '../../../hooks/useTheme';
import WorkspaceNotFound from './WorkspaceNotFound';

const PageLoader = () => {
	useTheme();
	return (
		<div className={s.loaderContainer}>
			<WorkspaceNotFound />
		</div>
	);
};

export default PageLoader;
