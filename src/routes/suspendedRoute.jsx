import BlockPage from '../views/features/landingScreen/blockPage/BlockPage';
import AuthWrapper from '../views/layouts/authWrapper';

const suspendedRoute = [
	{
		path: '*',
		element: (
			<AuthWrapper>
				<BlockPage />
			</AuthWrapper>
		),
	},
];

export default suspendedRoute;
