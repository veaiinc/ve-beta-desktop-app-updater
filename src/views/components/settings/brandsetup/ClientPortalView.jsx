import React, { memo } from 'react';
import '../../../../assets/scss/AccountSettings/clientportal_view.scss';
import { ReactComponent as VEAI } from '../../../../assets/svg/ve.svg';
const ClientPortalView = () => {
	return (
		<div className="loginWrapper">
			<div className="updatedLoginContainer">
				<div className="imageContainer">
					<div className="ShapDiv">
						{/* {this.props?.workflowData?.logo_s3_500w_key ? (
                    <img
                        src={
                            this.props?.workflowData
                                ?.logo_s3_500w_key || ''
                        }
                        alt="Image inside blob"
                    />
                ) : (
                    ''
                )} */}
					</div>
					<div className="detailsSection">
						<h1 className="clientName">{`Dear Samantha & Akhil`}</h1>
						<p className="title">
							Hoping this could be start of something great together
						</p>
					</div>
				</div>

				<div className="inputSectionWrapper">
					<span className="inputWrappertext">
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
							// className={
							//     isEmail(this.state.email)
							//         ? 'submitBtn'
							//         : 'disabledSubmitBtn'
							// }
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
