import { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/contacts/singleContact.scss';
// import TaskWidget from '../globalComponents/TaskWidget';
// import AutomationWidget from '../globalComponents/AutomationWidget';
// import CalenderWidget from '../globalComponents/CalenderWidget';
// import QuickActions from '../globalComponents/QuickActions';
import DocsGrid from '../files/DocsGrid';
import ActivityContact from './ActivityContact';
import OverviewContact from './overViewContact';
import { statusTextmapper } from '../../features/files/Files';

const SingleContact = ({ selectedContact, selectedOptions }) => {
	const navigate = useNavigate();
	const [viewMode, setViewMode] = useState('card');

	// const handleTotalChange = (data) => {
	// 	setInfo((prevInfo) => ({ ...prevInfo, totalCount: data }));
	// };

	const handleCreateDoc = useCallback(() => {
		const name = selectedContact?.name || selectedContact?.firstName || '';
		const email = selectedContact?.email || '';
		const phoneNumber = selectedContact?.phoneNumber || selectedContact?.phone || '';

		navigate(
			`/builder/create-document?name=${encodeURIComponent(name)}&email=${encodeURIComponent(
				email,
			)}&phoneNumber=${encodeURIComponent(phoneNumber)}`,
		);
	}, [selectedContact]);

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
					// handleTotalChange={handleTotalChange}
					statusTextmapper={statusTextmapper}
					clientId={selectedContact?._id}
					handleDocClick={handleDocClick}
					handleCreateDoc={handleCreateDoc}
					viewMode={viewMode}
					setViewMode={setViewMode}
				/>
			)}
		</div>
	);
};

export default memo(SingleContact);
