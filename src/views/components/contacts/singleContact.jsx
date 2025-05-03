import { memo, useState } from 'react';
import '../../../assets/scss/contacts/singleContact.scss';
import TaskWidget from '../globalComponents/TaskWidget';
import AutomationWidget from '../globalComponents/AutomationWidget';
import CalenderWidget from '../globalComponents/CalenderWidget';
import QuickActions from '../globalComponents/QuickActions';
import DocsGrid from '../files/DocsGrid';

const SingleContact = ({ selectedContact, selectedOptions }) => {
	const [info, setInfo] = useState({
		totalCount: null,
	});
	const handleTotalChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, totalCount: data }));
	};

	return (
		<div className="right-section" style={{ width: '100%', alignItems: 'center' }}>
			<div className="titleContainer">
				<div className="innerTitleContainer">
					<div className="titleContainer-left">
						<div className="titleContainer-left-top">
							<div></div>
							<div className="titleContainer-left-top-right">
								<div className="titleContianerTitleText">
									{selectedContact?.name}
								</div>
								<div className="titleContainerDescription">
									{selectedContact?.email}
								</div>
							</div>
						</div>
						<QuickActions />
					</div>
				</div>
			</div>
			{selectedOptions === 'Overview' && (
				<div className="widget-container">
					<div>
						<TaskWidget height={'520px'} />
					</div>
					<div>
						<AutomationWidget height={'520px'} />
					</div>
					<div>
						<CalenderWidget height={'520px'} />
					</div>
				</div>
			)}
			{selectedOptions === 'About' && (
				<div className="about-container">
					<div className="basicDetailsContainer">
						<div className="detailsTitle">Basic Details</div>
						<div className="eachDetailInfo">
							<div className="eachDetailLabel">Name</div>
							<div className="eachDetailValue">{selectedContact?.name}</div>
						</div>
						<div className="eachDetailInfo">
							<div className="eachDetailLabel">Email</div>
							<div className="eachDetailValue">{selectedContact?.email}</div>
						</div>
						<div className="eachDetailInfo">
							<div className="eachDetailLabel">Phone Number</div>
							<div className="eachDetailValue">{selectedContact?.phoneNumber}</div>
						</div>
					</div>
					<div></div>
				</div>
			)}
			{selectedOptions === 'Files' && (
				<DocsGrid handleTotalChange={handleTotalChange} clientId={selectedContact?._id} />
			)}
		</div>
	);
};

export default memo(SingleContact);
