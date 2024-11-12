import React, { memo } from 'react';
import '../../../assets/scss/sales/activity/emailModal.scss';
import { Drawer } from 'antd';
import { ReactComponent as CloseSvg } from '../../../assets/svg/close.svg';
import { ReactComponent as EmailSvg } from '../../../assets/svg/activity/email.svg';

const EmailModal = ({ modalIsOpen, showDrawer }) => {
	return (
		<Drawer
			onClose={showDrawer}
			open={modalIsOpen}
			width={480}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="emailSidePanel">
				<div className="innerContainer">
					<div className="headerContainer">
						<div className="headerInfo">
							<div className="logoContainer">
								<EmailSvg />
								<span className="logoText">Email</span>
							</div>
							<div className="headerTitle">James Stark</div>
						</div>
						<div className="closeBtn" onClick={showDrawer}>
							<CloseSvg />
						</div>
					</div>

					<div className="emialMetaDataContainer">
						<div className="metaDataContainer">
							<div className="emailRow">
								<span className="emailLabel">From</span>
								<span className="emailContent">
									Avinash Ganeshan
									<span className="emailAddress"> &lt;avinash@gmail.com&gt;</span>
								</span>
							</div>
							<div className="emailRow">
								<span className="emailLabel">To</span>
								<span className="emailContent">
									johnmichael@gmail.com
									{/* <span className="emailAddress">johnmichael@gmail.com</span> */}
								</span>
							</div>
							<div className="emailRow">
								<span className="emailLabel">CC</span>
								<span className="emailContent email-multiple-addresses">
									johnmichael@gmail.com, johnwick@gmail.com
									{/* <span className="emailAddress">johnmichael@gmail.com</span>, */}
									{/* <span className="emailAddress">johnwick@gmail.com</span> */}
								</span>
							</div>
						</div>
					</div>

					<div className="emailSubjectContainer">
						<span className="subjectTitle">Subject</span>
						<span className="subjectDesc">Thanks For Your Enquiry</span>
					</div>

					<div className="emailBodyParentContainer">
						<div className="bodyTag">Email Body</div>
						<div className="bodyContentContainer">
							Email body Data
							{/* Dear Clientname,
							<br />
							We truly appreciate your interest in CompanyName. After carefully
							considering your needs, we've created a personalised proposal just for
							you. You can view your proposal using the exclusive link and access PIN
							below:
							<br />
							View proposal
							<br />
							Your Access PIN is AccessPin
							<br />
							<br />
							Weve designed this proposal to perfectly fit your requirements, but if
							you need any further customisations, please feel free to reach out.
							<br />
							<br />
							Our commitment is to ensure everything is exactly as you envision it.
							You deserve the best, and were here to deliver it. Were excited to bring
							your vision to life and look forward to working with you.
							<br />
							<br />
							Best regards,
							<br />
							UserName */}
						</div>
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(EmailModal);
