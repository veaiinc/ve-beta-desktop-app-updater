import React, { useCallback, useContext, useEffect, useState } from 'react';
import withRouter from '../../hooks';
import Template from './home';
import BuilderPreview from './preview';
import { useParams } from 'react-router-dom';
import Context from '../../context/context';

const EditWorkflow = () => {
	// for this route this template Id is ==- workflow Id as route says workflow =true
	const { templateID } = useParams();

	const {
		templates: { getSmartFileData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		mode: 'preview', //preview,edit
	});

	//useEffects
	useEffect(() => {
		getSmartFileInfo();
	}, []);

	const handleSave = useCallback(
		(data) => {
			setInfo((prev) => ({ ...prev, mode: data }));
		},
		[info],
	);

	//function defination
	const getSmartFileInfo = useCallback(async () => {
		const payload = {
			getWorkflowWithModulesId: templateID,
		};
		getSmartFileData(payload);
	}, [templateID]);

	return (
		<div className="editWorkflowContainer">
			{info?.mode === 'edit' ? (
				<Template showNewHeader={true} editingWorflow={true} handleSave={handleSave} />
			) : (
				<BuilderPreview
					homeWrapperStyle={{
						width: '50%',
						overflowY: 'auto',
						position: 'relative',
					}}
					showSmartFileSideBar={true}
					showHeader={true}
					editingWorflow={true}
					handleSave={handleSave}
				/>
			)}
		</div>
	);
};

export default withRouter(EditWorkflow);
