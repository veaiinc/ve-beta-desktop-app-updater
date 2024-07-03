import React from 'react';
import ReusableButtonSettings from '../workspace_settings/ReusableButtonSettings';
import '../../../assets/scss/CompanySettings/gallery.scss';
const CompanyGallery = () => {
	return (
		<div className="companyGalleryMainContainer">
			<div className="galleryMain">
				<h1>Gallery</h1>
				<div className="gallerySubContainer">
					<div>
						<h1>Gallery Watermark</h1>
						<p>Update your watermark for your gallery pictures</p>
					</div>

					<ReusableButtonSettings text={'Update Preference'} />
				</div>
				<div className="gallerySubContainer">
					<div>
						<h1>Client Settings</h1>
						<p>Decide how your clients access your galleries</p>
					</div>
					<ReusableButtonSettings text={'Update Preference'} />
				</div>
				<div className="gallerySubContainer">
					<div>
						<h1>Gallery Form</h1>
						<p>Collect data from visitors who access your galleries</p>
					</div>
					<ReusableButtonSettings text={'Update Preference'} />
				</div>
				<div className="gallerySubContainer">
					<h1>Gallery Theme</h1>
					<p>Customise how Gallery looks on your Device</p>
				</div>
				<div className="ThemeButtons">
					<ReusableButtonSettings text={'Light'} />
					<ReusableButtonSettings text={'Dark'} />
				</div>
			</div>
		</div>
	);
};

export default CompanyGallery;
