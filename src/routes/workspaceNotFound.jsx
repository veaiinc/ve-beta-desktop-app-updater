import PageLoader from '../views/features/app/PageLoader';

const workspaceNotFoundRoute = [
	{
		path: '*',
		element: <PageLoader />,
	},
];

export default workspaceNotFoundRoute;
