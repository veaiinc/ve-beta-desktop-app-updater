import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/slackActions.scss';
import HeaderComponent from './HeaderComponent';
import ActionDetailsBlock from './ActionDetailsBlock';
import Spinner from '../../loaders/Spinner';
import Context from '../../../../context/context';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import {
	containerStyle,
	dropDownStyle,
	dropDownTextStyling,
	selectedValueStyling,
} from '../../../features/automation_builder/automationContentsHelper';
import VariableComponent from './VariableComponent';
import { useCallback } from 'react';
import { message } from 'antd';

const SlackActions = ({ onBack, onSave, loading, selectedAction }) => {
	const {
		automationBuilder: { connectedIntegrations, variables },
	} = useContext(Context);

	const [info, setInfo] = useState({
		title: '',
		description: '',
		slackTeamOptions: [],
		selectedTeam: null,
		selectedChannel: null,
	});

	useEffect(() => {
		if (connectedIntegrations?.slack) {
			setInfo((prev) => ({
				...prev,
				slackTeamOptions: connectedIntegrations?.slack?.map((account) => ({
					appId: account?.app_id,
					label: account?.teamName,
					value: account?.teamId,
					channels:
						account?.channels?.map((channel) => ({
							label: channel?.name,
							value: channel?.id,
						})) || [],
				})),
				selectedTeam: {
					label: connectedIntegrations?.slack?.[0]?.teamName,
					value: connectedIntegrations?.slack?.[0]?.teamId,
					appId: connectedIntegrations?.slack?.[0]?.app_id,
					channels:
						connectedIntegrations?.slack?.[0]?.channels?.map((channel) => ({
							label: channel?.name,
							value: channel?.id,
						})) || [],
				},
				selectedChannel: {
					value: connectedIntegrations?.slack?.[0]?.channels?.[0]?.id,
					label: connectedIntegrations?.slack?.[0]?.channels?.[0]?.name,
				},
			}));
		}
	}, [connectedIntegrations]);

	const updateInfo = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const handleChangeTeam = useCallback((option) => {
		updateInfo({ selectedTeam: option, selectedChannel: option?.channels?.[0] });
	}, []);

	const customSave = useCallback(
		(inputBody) => {
			const variableRegex = /^\{\{.*\}\}$/;
			const variables = {};

			if (!info?.title?.trim()) {
				return message.error('Title is mandatory');
			}
			if (!info?.description?.trim()) {
				return message.error('Description is mandatory');
			}

			for (const key in inputBody) {
				if (variableRegex.test(inputBody[key])) {
					variables[key] = [inputBody[key].slice(2, -2)];
				}
			}
			onSave({
				title: info?.title?.trim(),
				description: info?.description?.trim(),
				type: 'action',
				app: 'slack',
				actionType: inputBody?.action,
				inputBody,
				...(Object.keys(variables)?.length ? { variables } : {}),
			});
		},
		[info, onSave],
	);

	const actionMapper = useMemo(() => {
		return {
			createChannel: (
				<CreateChannel
					loading={loading}
					selectedTeam={info?.selectedTeam}
					slackTeamOptions={info?.slackTeamOptions}
					changeTeam={handleChangeTeam}
					customSave={customSave}
				/>
			),
			sendMessage: (
				<SendMessage
					loading={loading}
					selectedTeam={info?.selectedTeam}
					slackTeamOptions={info?.slackTeamOptions}
					selectedChannel={info?.selectedChannel}
					changeChannel={(option) => updateInfo({ selectedChannel: option })}
					variables={variables}
					changeTeam={handleChangeTeam}
					customSave={customSave}
				/>
			),
			deleteMessage: (
				<DeleteMessage
					loading={loading}
					selectedTeam={info?.selectedTeam}
					slackTeamOptions={info?.slackTeamOptions}
					selectedChannel={info?.selectedChannel}
					changeChannel={(option) => updateInfo({ selectedChannel: option })}
					variables={variables}
					changeTeam={handleChangeTeam}
					customSave={customSave}
				/>
			),
			channelInfo: (
				<ChannelInfo
					loading={loading}
					selectedTeam={info?.selectedTeam}
					slackTeamOptions={info?.slackTeamOptions}
					selectedChannel={info?.selectedChannel}
					changeChannel={(option) => updateInfo({ selectedChannel: option })}
					variables={variables}
					changeTeam={handleChangeTeam}
					customSave={customSave}
				/>
			),
			getManyChannels: <GetManyChannels />,
			joinChannel: <JoinChannel />,
			leaveChannel: <LeaveChannel />,
			renameChannel: <RenameChannel />,
			deleteChannel: <DeleteChannel />,
			channelMembers: <ChannelMembers />,
		};
	}, [
		loading,
		info?.selectedTeam,
		info?.slackTeamOptions,
		info?.selectedChannel,
		handleChangeTeam,
		variables,
		customSave,
		updateInfo,
	]);

	return (
		<div className="slackActionsContainer">
			<HeaderComponent
				heading={selectedAction?.actionLabel}
				onBack={
					info?.emailTemplateIsShown
						? () => updateInfo({ emailTemplateIsShown: false })
						: onBack
				}
			/>

			<ActionDetailsBlock
				title={info?.title}
				description={info?.description}
				updaterFn={updateInfo}
				onChangeButtonClick={onBack}
				actionLabel={selectedAction?.actionLabel}
			/>
			<div className="slackActionsContainerBody">
				{actionMapper?.[selectedAction?.actionType]}
			</div>
		</div>
	);
};

export default memo(SlackActions);

const CreateChannel = memo(
	({ loading, selectedTeam, slackTeamOptions, changeTeam, customSave }) => {
		const [info, setInfo] = useState({
			channelName: '',
		});
		const handleSave = useCallback(() => {
			if (!selectedTeam) {
				return message.error('Select a Slack workspace');
			}
			if (!info?.channelName?.trim()) {
				return message.error('Channel name is mandatory');
			}
			customSave({
				action: 'createChannel',
				channelName: info?.channelName,
				connectedTeamId: selectedTeam?.value,
			});
		}, [customSave, info, selectedTeam]);
		return (
			<>
				<h3 className="slackActionsContainerBodyItemHeader">Inputs</h3>
				<div className="slackActionsContainerBodyItem">
					<div className="inputWrapper">
						<span className="inputLabel">Slack Workspace</span>
						<HeadersDropDownComp
							options={slackTeamOptions}
							selectedValue={selectedTeam?.label}
							onChangeFunc={(option) => changeTeam(option)}
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
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={selectedTeam}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Channel Name</span>
						<input
							type="text"
							className="inputField"
							placeholder="Enter channel name"
							value={info?.channelName}
							onChange={(e) => setInfo({ channelName: e.target.value })}
						/>
					</div>
				</div>
				<button className="actionsSaveButton" disabled={loading} onClick={handleSave}>
					{loading ? <Spinner /> : 'Save'}
				</button>
			</>
		);
	},
);

const SendMessage = memo(
	({
		loading,
		selectedTeam,
		slackTeamOptions,
		changeTeam,
		variables,
		changeChannel,
		selectedChannel,
		customSave,
	}) => {
		const [info, setInfo] = useState({
			message: '',
		});

		const updateStateInfo = (data) => {
			setInfo((prev) => ({ ...prev, ...data }));
		};
		const handleSave = useCallback(() => {
			if (!selectedTeam) {
				return message.error('Select a Slack workspace');
			}
			if (!selectedChannel?.value?.trim()?.length) {
				return message.error('Channel is mandatory');
			}
			if (!info?.message?.trim()?.length) {
				return message.error('Message is mandatory');
			}
			customSave({
				action: 'sendMessage',
				channelId: selectedChannel?.value,
				message: info?.message,
				connectedTeamId: selectedTeam?.value,
			});
		}, [customSave, info, selectedChannel, selectedTeam]);
		return (
			<>
				<h3 className="slackActionsContainerBodyItemHeader">Inputs</h3>
				<div className="slackActionsContainerBodyItem">
					<div className="inputWrapper">
						<span className="inputLabel">Slack Workspace</span>
						<HeadersDropDownComp
							options={slackTeamOptions}
							selectedValue={selectedTeam?.label}
							onChangeFunc={(option) => changeTeam(option)}
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
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={selectedTeam}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Channel</span>
						<HeadersDropDownComp
							options={selectedTeam?.channels}
							selectedValue={selectedChannel?.label}
							onChangeFunc={(option) => changeChannel(option)}
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
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={selectedChannel}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Message</span>
						<VariableComponent
							variables={variables?.data}
							value={info?.message}
							onChange={(value) => updateStateInfo({ message: value })}
						/>
					</div>
				</div>
				<button className="actionsSaveButton" disabled={loading} onClick={handleSave}>
					{loading ? <Spinner /> : 'Save'}
				</button>
			</>
		);
	},
);

const DeleteMessage = memo(
	({
		loading,
		selectedTeam,
		slackTeamOptions,
		changeTeam,
		variables,
		changeChannel,
		selectedChannel,
		customSave,
	}) => {
		const [info, setInfo] = useState({
			messageId: '',
		});

		const updateStateInfo = (data) => {
			setInfo((prev) => ({ ...prev, ...data }));
		};
		const handleSave = useCallback(() => {
			if (!selectedTeam) {
				return message.error('Select a Slack workspace');
			}
			if (!selectedChannel?.value?.trim()?.length) {
				return message.error('Channel is mandatory');
			}
			if (!info?.messageId?.trim()?.length) {
				return message.error('Message id is mandatory');
			}
			customSave({
				action: 'deleteMessage',
				channelId: selectedChannel?.value,
				messageId: info?.messageId,
				connectedTeamId: selectedTeam?.value,
			});
		}, [customSave, info, selectedChannel, selectedTeam]);
		return (
			<>
				<h3 className="slackActionsContainerBodyItemHeader">Inputs</h3>
				<div className="slackActionsContainerBodyItem">
					<div className="inputWrapper">
						<span className="inputLabel">Slack Workspace</span>
						<HeadersDropDownComp
							options={slackTeamOptions}
							selectedValue={selectedTeam?.label}
							onChangeFunc={(option) => changeTeam(option)}
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
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={selectedTeam}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Channel</span>
						<HeadersDropDownComp
							options={selectedTeam?.channels}
							selectedValue={selectedChannel?.label}
							onChangeFunc={(option) => changeChannel(option)}
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
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={selectedChannel}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Message id</span>
						<VariableComponent
							variables={variables?.data}
							value={info?.messageId}
							onChange={(value) => updateStateInfo({ messageId: value })}
						/>
					</div>
				</div>
				<button className="actionsSaveButton" disabled={loading} onClick={handleSave}>
					{loading ? <Spinner /> : 'Save'}
				</button>
			</>
		);
	},
);

const ChannelInfo = memo(
	(
		loading,
		selectedTeam,
		slackTeamOptions,
		changeTeam,
		variables,
		changeChannel,
		selectedChannel,
		customSave,
	) => {
		const [info, setInfo] = useState({
			messageId: '',
		});

		const updateStateInfo = (data) => {
			setInfo((prev) => ({ ...prev, ...data }));
		};
		const handleSave = useCallback(() => {
			if (!selectedTeam) {
				return message.error('Select a Slack workspace');
			}
			if (!selectedChannel?.value?.trim()?.length) {
				return message.error('Channel is mandatory');
			}
			if (!info?.messageId?.trim()?.length) {
				return message.error('Message id is mandatory');
			}
			customSave({
				action: 'deleteMessage',
				channelId: selectedChannel?.value,
				messageId: info?.messageId,
				connectedTeamId: selectedTeam?.value,
			});
		}, [customSave, info, selectedChannel, selectedTeam]);
		return (
			<>
				<h3 className="slackActionsContainerBodyItemHeader">Inputs</h3>
				<div className="slackActionsContainerBodyItem">
					<div className="inputWrapper">
						<span className="inputLabel">Slack Workspace</span>
						<HeadersDropDownComp
							options={slackTeamOptions}
							selectedValue={selectedTeam?.label}
							onChangeFunc={(option) => changeTeam(option)}
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
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={selectedTeam}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Channel</span>
						<HeadersDropDownComp
							options={selectedTeam?.channels}
							selectedValue={selectedChannel?.label}
							onChangeFunc={(option) => changeChannel(option)}
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
							uniqueIdentifierForTickIcon={'value'}
							selectedValueObj={selectedChannel}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="inputWrapper">
						<span className="inputLabel">Message id</span>
						<VariableComponent
							variables={variables?.data}
							value={info?.messageId}
							onChange={(value) => updateStateInfo({ messageId: value })}
						/>
					</div>
				</div>
				<button className="actionsSaveButton" disabled={loading} onClick={handleSave}>
					{loading ? <Spinner /> : 'Save'}
				</button>
			</>
		);
	},
);

const GetManyChannels = memo(() => {
	return <div>GetManyChannels</div>;
});

const JoinChannel = memo(() => {
	return <div>JoinChannel</div>;
});

const LeaveChannel = memo(() => {
	return <div>LeaveChannel</div>;
});

const RenameChannel = memo(() => {
	return <div>RenameChannel</div>;
});

const DeleteChannel = memo(() => {
	return <div>DeleteChannel</div>;
});

const ChannelMembers = memo(() => {
	return <div>ChannelMembers</div>;
});
