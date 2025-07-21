import PageLoader from '../views/features/app/PageLoader';

// Display a loader until the workspaceMode is determined, regardless of the current route.

const fallbackRoute = [
	{
		path: '*',
		element: <PageLoader />,
	},
];

export default fallbackRoute;
