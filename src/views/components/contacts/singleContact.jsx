import { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/contacts/singleContact.scss';
import TaskWidget from '../globalComponents/TaskWidget';
import AutomationWidget from '../globalComponents/AutomationWidget';
import CalenderWidget from '../globalComponents/CalenderWidget';
import QuickActions from '../globalComponents/QuickActions';
import DocsGrid from '../files/DocsGrid';
import ActivityContact from './ActivityContact';
import OverviewContact from './overViewContact';

const SingleContact = ({ selectedContact, selectedOptions }) => {
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		totalCount: null,
	});
	const handleTotalChange = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, totalCount: data }));
	};

	const handleCreateDoc = useCallback(() => {
		navigate(`/builder/create-document`);
	}, []);

	const handleDocClick = useCallback(
		(doc) => {
			if (doc) {
				const version = doc?.version;
				version === 0 || version === null
					? navigate(`/smart-file/${doc?.templateId}/${doc?._id}`)
					: navigate(`/builder/document/view/${doc?._id}?workflow=true`);
			}
		},
		[navigate],
	);

	return (
		<div className="right-section" style={{ width: '100%', alignItems: 'center' }}>
			{selectedOptions === 'Overview' && <OverviewContact />}
			{selectedOptions === 'Activity' && <ActivityContact />}
			{selectedOptions === 'Files' && (
				<DocsGrid
					handleTotalChange={handleTotalChange}
					clientId={selectedContact?._id}
					handleDocClick={handleDocClick}
					handleCreateDoc={handleCreateDoc}
				/>
			)}
		</div>
	);
};

export default memo(SingleContact);
