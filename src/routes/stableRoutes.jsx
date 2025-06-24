import InitialHomePage from '../views/features/homePage/InitialHomePage';
import ShareAndEarn from '../views/features/shareAndEarn/ShareAndEarn';
import SettingsWrapper from '../views/features/settings/SettingsWrapper';
import RecentChat from '../views/features/chat/RecentChat';
import AuthWrapper from '../views/layouts/authWrapper';

const stableRoutes = [
	{
		path: '/home',
		element: (
			<AuthWrapper
				title={'Home'}
				outerContainerStyle={{ overflow: 'hidden' }}
				childrenContainerStyles={{ overflow: 'scroll' }}
				showBottomToolbar={false}
			>
				<InitialHomePage />
			</AuthWrapper>
		),
	},
	{
		path: '/share-and-earn',
		element: (
			<AuthWrapper title={'Share and Earn'}>
				<ShareAndEarn />
			</AuthWrapper>
		),
	},
	{
		path: '/settings/:type',
		element: (
			<AuthWrapper title={'Workspace Settings'}>
				<SettingsWrapper />
			</AuthWrapper>
		),
	},
	{
		path: '/chat/:sessionId',
		element: (
			<AuthWrapper
				title={'Chat'}
				showBottomToolbar={false}
				outerContainerStyle={{ paddingRight: '0px', backgroundColor: '' }}
				authParentContainerStyle={{ backgroundColor: 'var(--background-color)' }}
				maxWidth="100%"
				showDynamicWidget={false}
			>
				<RecentChat />
			</AuthWrapper>
		),
	},
];

export default stableRoutes;
