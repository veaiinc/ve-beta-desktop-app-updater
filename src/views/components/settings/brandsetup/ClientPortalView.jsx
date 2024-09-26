import React, { memo } from 'react';
import '../../../../assets/scss/AccountSettings/clientportal_view.scss';
import { ReactComponent as VEAI } from '../../../../assets/svg/ve.svg';
const ClientPortalView = ({ themeProperties, logoUrl }) => {
	return (
		<div
			className="loginWrapper"
			style={{ background: themeProperties?.backgroundColor?.value }}
		>
			<div className="updatedLoginContainer">
				<div className="imageContainer">
					<div
						className="ShapDiv"
						style={{ background: themeProperties?.logoShapeColor?.value }}
					>
						{logoUrl ? <img src={logoUrl} alt="Image inside blob" /> : ''}
					</div>
					<div className="detailsSection">
						<h1 className="clientName">{`Dear Samantha & Akhil`}</h1>
						<p className="title" style={{ color: themeProperties?.textColor?.value }}>
							Hoping this could be start of something great together
						</p>
					</div>
				</div>

				<div className="inputSectionWrapper">
					<span
						className="inputWrappertext"
						style={{ color: themeProperties?.textColor?.value }}
					>
						Please type the email address to access your file
					</span>

					<div className="formContainer" style={{ flexDirection: 'column' }}>
						<div className="emailInputWrapper">
							{/* <Email /> */}
							<input
								type="email"
								placeholder="Enter Your Name"
								className="emailInputWrapperClass"
								style={{
									height: '42px',
								}}
								disabled={true}
							/>
						</div>
						<div className="emailInputWrapper">
							{/* <Email /> */}
							<input
								type="email"
								placeholder="johnappleseed@email.com"
								className="emailInputWrapperClass"
								style={{
									height: '42px',
								}}
								disabled={true}
							/>
						</div>
						<div
							style={{
								background: themeProperties?.buttonColor?.value,
								color: themeProperties?.buttonText?.value,
							}}
							className="submitBtn"
						>
							Submit
						</div>
					</div>
				</div>
			</div>
			<a className="footer" href="https://ve.ai">
				<span className="footerText">Made With</span>
				<VEAI />
			</a>
		</div>
	);
};

export default memo(ClientPortalView);
