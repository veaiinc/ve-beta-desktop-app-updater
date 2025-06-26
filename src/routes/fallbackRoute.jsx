import PageLoader from '../views/features/app/PageLoader';

const fallbackRoute = [
	{
		path: '*',
		element: <PageLoader />,
	},
];

export default fallbackRoute;
