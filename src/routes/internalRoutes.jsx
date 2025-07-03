import betaRoutes from './betaRoutes';

// layouts
import AuthWrapper from '../views/layouts/authWrapper';

// pages
// import NotesWrapper from '../views/pages/notes/notesWrapper';

const internalRoutes = [
	...betaRoutes,
	{
		path: '/meet/:noteId',
		element: <AuthWrapper title={'Meet'}>{/* <NotesWrapper /> */}</AuthWrapper>,
	},
];

export default internalRoutes;
