import ChatScreen from './views/features/meta_Integ/index';
import AuthWrapper from './views/layouts/authWrapper';
import LoginScreen from './views/features/signin';

const routes = [
	{
		path: '/',
		component: <LoginScreen />,
	},
	{
		path: '/:workspaceId/inbox',
		component: (
			<AuthWrapper title={'Inbox'}>
				<ChatScreen />
			</AuthWrapper>
		),
		exact: true,
	},
];

export default routes;
