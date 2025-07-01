// import React from 'react';
import { useParams } from 'react-router-dom';
// import { Header } from '../Header/Index';
const FormBuilder = () => {
	const { templateID } = useParams();
	return (
		<div>
			<div>Karthik</div>
			{/* <Header
				title={'Form Builder'}
				mobileViewLocked={false}
				preview={false}
				previewType={'d'}
				previewMode={'d'}
				setPreview={() => {}}
				saveSections={() => {}}
				publish={() => {}}
				isSaveLoading={false}
				isPublishLoading={false}
				modules={[]}
				module={null}
				getModuleInfo={() => {}}
				updatePublishedTemplate={() => {}}
				activeModuleId={null}
				isWorkflow={false}
				managePages={() => {}}
				settingEnabled={false}
				setSettingEnabled={() => {}}
				handleShare={() => {}}
				handleAddClientInShare={() => {}}
				duplicateModules={[]}
				showThemeSettings={() => {}}
				isTemplateID={false}
				renderModules={() => {}}
				handleDuplicateTemplate={() => {}}
				handleDeleteOpen={() => {}}
			/> */}
		</div>
	);
};

export default FormBuilder;
