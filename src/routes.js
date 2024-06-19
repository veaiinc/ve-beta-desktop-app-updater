import ChatScreen from './views/features/meta_Integ/index';
import AuthWrapper from './views/layouts/authWrapper';

const routes = [
	//public routes

	//private routes

	{
		path: '/:workspaceId/chats',
		component: (
			<AuthWrapper>
				<ChatScreen />
			</AuthWrapper>
		),
		exact: true,
	},
];

export default routes;
