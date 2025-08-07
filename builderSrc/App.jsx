import { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthenticatedRoute from './services/AuthenticatedRouteWrapper';
import Template from './views/feature/home';
// import Generate from './views/feature/generate';
// import Prompt from './views/feature/prompt';
import BuilderPreview from './views/feature/preview';

import withRouter from './hooks'; // Import the withRouter HOC
// import EditWorkflow from './views/feature/EditWorkflow';
// import DesignBuilder from './views/feature/design-builder';
import { handleCookieSetupOnMounting } from './helper';
// import ShortBuilderPreview from './views/feature/ShortPreview';
import './assets/scss/globalColorsAndTheme.scss';
import CreatedDocument from './views/feature/document/newIndex';
import ViewHomePage from './views/feature/document/viewHomePage';
import EditDocument from './views/components/EditDocument/editDocument';
// import DocumentShare from './views/feature/document/DocumentShare';
import NotFound from './views/feature/NotFound';
const TemplateWithRouter = withRouter(Template);
const BuilderPreviewWithRouter = withRouter(BuilderPreview);
// const ShortBuilderPreviewRouter = withRouter(ShortBuilderPreview);
const CreatedDocumentWithRouter = withRouter(CreatedDocument);
const ViewHomePageWithRouter = withRouter(ViewHomePage);
const EditDocumentWithRouter = withRouter(EditDocument);
// const DocumentShareWithRouter = withRouter(DocumentShare);
class App extends Component {
	render() {
		const data = handleCookieSetupOnMounting();
		return (
			<Routes>
				<Route
					path="/create-document"
					element={
						<AuthenticatedRoute>
							<CreatedDocumentWithRouter />
						</AuthenticatedRoute>
					}
				/>
				<Route
					path="/document/edit/:templateID"
					element={
						<AuthenticatedRoute>
							{/* <CreatedDocumentWithRouter /> */}
							<EditDocumentWithRouter />
						</AuthenticatedRoute>
					}
				/>

				<Route
					path="/document/view/:templateID"
					element={
						<AuthenticatedRoute>
							<ViewHomePageWithRouter />
						</AuthenticatedRoute>
					}
				/>
				<Route
					path="/preview/:templateID"
					element={
						<AuthenticatedRoute>
							<BuilderPreviewWithRouter />
						</AuthenticatedRoute>
					}
				/>
				{/* <Route
					exact
					path="/preview/short/:templateID"
					element={
						<AuthenticatedRoute>
							<ShortBuilderPreviewRouter />
						</AuthenticatedRoute>
					}
				/> */}
				{/* <Route
					exact
					path="/generate/:templateID"
					element={
						<AuthenticatedRoute>
							<Prompt />
						</AuthenticatedRoute>
					}
				/>
				<Route
					exact
					path="/generate/templates/:templateID"
					element={
						<AuthenticatedRoute>
							<Generate />
						</AuthenticatedRoute>
					}
				/> */}
				<Route
					exact
					path="/:templateID"
					element={
						<AuthenticatedRoute>
							<TemplateWithRouter />
						</AuthenticatedRoute>
					}
				/>
				{/* <Route
					exact
					path="/workflow/:templateID"
					element={
						<AuthenticatedRoute>
							<EditWorkflow />
						</AuthenticatedRoute>
					}
				/> */}
				<Route
					exact
					path="/:templateID/:type"
					element={
						<AuthenticatedRoute>
							<TemplateWithRouter />
						</AuthenticatedRoute>
					}
				/>
				{/* <Route
					exact
					path="/design-builder"
					element={
						<AuthenticatedRoute>
							<DesignBuilder />
						</AuthenticatedRoute>
					}
				/> */}
				<Route exact path="/not-found" element={<NotFound />} />

				<Route exact path="*" element={<NotFound />} />
			</Routes>
		);
	}
}

export default App;
