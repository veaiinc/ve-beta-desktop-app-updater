// import Testing from './views/features/meta_Integ/index2';
import PublicLayout from './views/features/auth/Auth';
import UserLogin from './views/features/auth/login/userLogin';
import ChatLanding from './views/features/meta_Integ/ChatLanding';
import ChatScreen from './views/features/meta_Integ/index';
import AuthWrapper from './views/layouts/authWrapper';

const routes = [
	//public routes
	{
		path: '/user/:authAction',
		component: (
			<PublicLayout subTitle={'Log in to your workspace'}>
				<UserLogin />
			</PublicLayout>
		),
		exact: true,
	},

	//private routes
	{
		path: '/:workspaceId/chats',
		component: (
			<AuthWrapper>
				<ChatLanding />
			</AuthWrapper>
		),
		exact: true,
	},
	{
		path: '/:workspaceId/chats/:pageName',
		component: (
			<AuthWrapper>
				<ChatScreen />
			</AuthWrapper>
		),
		exact: true,
	},
];

export default routes;
