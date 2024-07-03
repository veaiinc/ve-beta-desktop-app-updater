import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import ToggleSlider from '../../components/input/slider';
import '../../../assets/scss/CompanySettings/branding.scss';

const CompanyBranding = () => {
	const [file, setFile] = useState(null);

	const handleDrop = (acceptedFiles) => {
		setFile(acceptedFiles[0]);
	};
	return (
		<div className="brandingMainContainer">
			{/* logo */}
			<div className="logoMainContainer">
				<div className="logoTextContainer">
					<h1>Logo</h1>
					<p>
						Your logo will automatically display in your emails and pages. We recommend
						a .PNG file with transparency to ensure it looks great on all backgrounds.
					</p>
				</div>

				{/* <div>
					<Dropzone onDrop={handleDrop} accept="image/png" multiple={false}>
						{({ getRootProps, getInputProps }) => (
							<div {...getRootProps({ className: 'dropzone' })}>
								<input {...getInputProps()} />
								<p>Drag 'n' drop a file here, or click to select one</p>
								<span>📎 Click or Drag to upload</span>
							</div>
						)}
					</Dropzone>
					{file && (
						<div>
							<h3>Uploaded file:</h3>
							<p>{file.name}</p>
							<img
								src={URL.createObjectURL(file)}
								alt="Preview"
								style={{ width: '200px' }}
							/>
						</div>
					)}
				</div> */}
			</div>
			{/* Branding */}
			<div className="brandingContainer">
				<div className="brandingTextContainer">
					<h1>Branding</h1>
					<p>These colours will be available as your accent colour</p>
				</div>
			</div>
			{/* Brand Fonts */}
			<div className="brandFontContainer">
				<div className="brandTextContainer">
					<h1>Brand Fonts</h1>
					<p>
						These fonts will be available in your font picker. You can access them while
						editing your email layout blocks, forms, and checkouts.
					</p>
				</div>
				<button>Add New Font</button>
			</div>
			{/* Social Links */}
			<div className="socialLinkContainer">
				<div className="socialLinkTextContainer">
					<h1>Social Links</h1>
					<p>Icons in your emails will automatically link to these URLs</p>
				</div>
			</div>
			{/* Made with love in VE footer */}
			<div className="footerContainer">
				<div className="footerTextContainer">
					<h1>Made with love in VE footer</h1>
					<p>
						This footer automatically links to your unique referral sign-up link so you
						get paid for anyone who signs up through your emails, full page forms, and
						checkouts. You can hide this footer with any paid plan
					</p>
				</div>
				<div>
					<ToggleSlider />
					<p>Enabled</p>
				</div>
			</div>
		</div>
	);
};

export default CompanyBranding;
