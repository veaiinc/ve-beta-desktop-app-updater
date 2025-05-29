import { memo, useState } from 'react';
import '../../../assets/scss/contacts/singleContact.scss';
import TaskWidget from '../globalComponents/TaskWidget';
import AutomationWidget from '../globalComponents/AutomationWidget';
import CalenderWidget from '../globalComponents/CalenderWidget';
import QuickActions from '../globalComponents/QuickActions';
import DocsGrid from '../files/DocsGrid';
import ActivityContact from './ActivityContact';
import OverviewContact from './overViewContact';
import { useNavigate } from 'react-router-dom';
const SingleContact = ({ selectedContact, selectedOptions }) => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		totalCount: null,
	});
	const handleTotalChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, totalCount: data }));
	};

	return (
		<div className="right-section" style={{ width: '100%', alignItems: 'center' }}>
			{selectedOptions === 'Overview' && <OverviewContact />}
			{selectedOptions === 'Activity' && <ActivityContact />}
			{selectedOptions === 'Files' && (
				<DocsGrid
					handleTotalChange={handleTotalChange}
					clientId={selectedContact?._id}
					handleCreateDoc={() => navigate(`/builder/create-document`)}
				/>
			)}
		</div>
	);
};

export default memo(SingleContact);
