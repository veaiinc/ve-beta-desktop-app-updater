import { memo, useCallback, useContext, useEffect, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/inAppActions.scss';
import ActionDetailsBlock from './ActionDetailsBlock';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import { Spin } from 'antd';
import {
	containerStyle,
	dropDownStyle,
	dropDownTextStyling,
	selectedValueStyling,
} from '../../../features/automationBuilder/automationContentsHelper';
import { message } from '../../globalComponents/CustomToast';
// import VariableComponent from './VariableComponent';
import Context from '../../../../context/context';

const AgentAction = ({
	onBack,
	onSave,
	loading,
	selectedAction,
	activeStepsData,
	handleChangeClick,
}) => {
	const {
		// automationBuilder: { connectedIntegrations, variables, addStep, updateStep },
		knowledgeAgent: {
			assistantListForAutomation,
			getKnowledgeAssistantsListForAutomation,
			getActiveKnowledgeAgentForAutomation,
			currentAgentAutomation,
		},
		profileInfo: { tennantSettingsData },
		automationBuilder: { variables },
	} = useContext(Context);

	const [info, setInfo] = useState({
		title: '',
		description: '',
		duration: '1',
		selectedAssistant: null,
		searchQuery: '',
		query: '',
	});

	const {
		data: agents = [],
		currentPage = 1,
		hasNextPage = false,
	} = assistantListForAutomation || {};

	useEffect(() => {
		if (!assistantListForAutomation) {
			const page = 1;
			const limit = 100;
			const append = false;
			getKnowledgeAssistantsListForAutomation(page, limit, append);
		}
	}, [assistantListForAutomation]);
	useEffect(() => {
		if (activeStepsData) {
			setInfo((prev) => ({
				...prev,
				title: activeStepsData?.title,
				description: activeStepsData?.description,
				query: activeStepsData?.inputBody?.query,
			}));
		}
	}, [activeStepsData]);

	useEffect(() => {
		if (activeStepsData && assistantListForAutomation) {
			const assistantId = activeStepsData?.inputBody?.assistantId;
			const selectedAssistant = agents?.find((item) => item?._id === assistantId);
			if (selectedAssistant || currentAgentAutomation?._id === assistantId) {
				setInfo((prev) => ({
					...prev,
					selectedAssistant: selectedAssistant || currentAgentAutomation,
				}));
			} else {
				getActiveKnowledgeAgentForAutomation(assistantId);
			}
		}
	}, [activeStepsData, assistantListForAutomation, currentAgentAutomation]);

	const updateInfo = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const createNewNode = useCallback(async () => {
		let { title, description, selectedAssistant, query } = info;
		if (!title?.trim().length) {
			message.error('Title is mandatory');
			return;
		}
		if (!description?.trim().length) {
			message.error('Description is mandatory');
			return;
		}

		if (!selectedAssistant) {
			message.error('Select an agent');
			return;
		}

		const payload = {
			title: title,
			description: description,
			type: 'action',
			app: 'agent',
			inputBody: {
				assistantId: selectedAssistant?._id,
				query,
				timeZone: tennantSettingsData?.locationDetails?.timezone,
			},
			actionType: 'agent',
		};

		onSave(payload, false);
	}, [info, onSave, tennantSettingsData]);

	const onChange = useCallback((data) => {
		if (data?.searchQuery !== undefined) {
			updateInfo({ searchQuery: data?.searchQuery });
		} else {
			updateInfo({ selectedAssistant: data });
		}
	}, []);

	const handleFetchMore = () => {
		if (hasNextPage) {
			const page = currentPage + 1;
			const limit = 100;
			const append = true;
			getKnowledgeAssistantsListForAutomation(page, limit, append);
		}
	};

	return (
		<div className="inAppActionsContainer">
			<HeaderComponent onBack={onBack} heading="Connect Agent" />
			<ActionDetailsBlock
				heading="Actions"
				actionLabel="Connect Agent"
				title={info?.title}
				description={info?.description}
				updaterFn={updateInfo}
				onChangeButtonClick={onBack}
				showChangeButton={activeStepsData ? false : true}
			/>
			<div className="inAppActionsInputsContainer">
				<h2 className="InputBlockHeading">Inputs</h2>
				<div className="inputWrapper">
					<span className="inputLabel">Agent</span>
					<HeadersDropDownComp
						options={agents}
						selectedValue={info?.selectedAssistant?.name}
						onChangeFunc={onChange}
						showIcon={false}
						containerStyle={{
							...containerStyle,
							background: '#1C1C1C',
							border: '1px solid #2C2D2E',
							borderRadius: '12px',
							height: '40px',
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{
							...dropDownStyle,
							background: '#1C1C1C',
							border: '1px solid #2C2C2C',
						}}
						dropDownTextStyling={{
							...dropDownTextStyling,
							color: '#FFFFFF',
						}}
						showSelectedValueTick={true}
						labelField="name"
						uniqueIdentifierForTickIcon={'_id'}
						selectedValueObj={info?.selectedAssistant}
						selectedValueStyle={{
							...selectedValueStyling,
							color: '#FFFFFF',
						}}
						fetchMoreData={handleFetchMore}
						hasNextPage={hasNextPage}
					/>
				</div>

				<div className="inputWrapper">
					<span className="inputLabel">Prompt</span>
					{/* <VariableComponent
						variables={variables?.data}
						value={info?.query}
						onChange={(value) => updateInfo({ query: value })}
					/> */}

					<textarea
						className="inputTextarea"
						name=""
						placeholder="Prompt"
						value={info?.query}
						onChange={(e) => updateInfo({ query: e.target.value })}
					/>
				</div>
			</div>

			<button className="actionsSaveButton" onClick={createNewNode} disabled={loading}>
				{loading ? <Spin /> : 'Save'}
			</button>
		</div>
	);
};

export default memo(AgentAction);
