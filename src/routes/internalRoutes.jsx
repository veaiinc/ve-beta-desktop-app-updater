import betaRoutes from './betaRoutes';

// layouts
import AuthWrapper from '../views/layouts/authWrapper';

// pages
import NotesWrapper from '../views/features/notesModule/NotesWrapper';
import MeetBot from '../views/features/meetBot/meetBot';

const internalRoutes = [
	...betaRoutes,
	{
		path: '/meet',
		element: (
			<AuthWrapper title={'Meet'}>
				<MeetBot />
			</AuthWrapper>
		),
	},
	{
		path: '/meet/:noteId',
		element: (
			<AuthWrapper title={'Meet'}>
				<NotesWrapper />
			</AuthWrapper>
		),
	},
];

export default internalRoutes;
