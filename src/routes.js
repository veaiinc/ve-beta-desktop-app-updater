// import Testing from './views/features/meta_Integ/index2';
import ChatLanding from './views/features/meta_Integ/ChatLanding';
import ChatScreen from './views/features/meta_Integ/index';

const routes = [
	{
		path: '/:workspaceId/chats',
		component: <ChatLanding />,
		exact: true,
	},
	{
		path: '/:workspaceId/chats/:pageName',
		component: <ChatScreen />,
		exact: true,
	},
];

export default routes;
