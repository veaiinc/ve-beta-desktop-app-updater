import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AddGallery from './AddGallery';
import Gallerys from './Gallerys';
import GalleryPage from './GalleryPage';
import GalleryViewer from './GalleryViewer';
import AlbumSettings from './AlbumSettings';
const GalleryRoutes = () => {
	return (
		<Routes>
			<Route path="" element={<AddGallery />} />
			<Route path="add-gallery" element={<Gallerys />} />
			<Route path="gallery-page" element={<GalleryPage />} />
			<Route path="album-settings" element={<AlbumSettings />} />
			<Route path="gallery-viewer" element={<GalleryViewer />} />
		</Routes>
	);
};

export default GalleryRoutes;
