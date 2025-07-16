import WorkspaceNotFound from '../views/features/app/WorkspaceNotFound';
import AuthWrapper from '../views/layouts/authWrapper';

const workspaceNotFoundRoute = [
	{
		path: '*',
		element: (
			<AuthWrapper title={'Workspace Not Found'}>
				<WorkspaceNotFound />
			</AuthWrapper>
		),
	},
];

export default workspaceNotFoundRoute;
