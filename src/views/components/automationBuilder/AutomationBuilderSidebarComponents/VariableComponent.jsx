import React, { useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/variableComponent.scss';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { Tooltip } from 'antd';
const exampleResponse = {
	ok: true,
	user: {
		id: 'U07JFV32J3G',
		team_id: 'T06TPFSDUCQ',
		name: 'saikumar',
		deleted: false,
		color: '674b1b',
		real_name: 'saikumar',
		tz: 'Asia/Kolkata',
		tz_label: 'India Standard Time',
		tz_offset: 19800,
		profile: {
			title: '',
			phone: '',
			skype: '',
			real_name: 'saikumar',
			real_name_normalized: 'saikumar',
			display_name: 'saikumar',
			display_name_normalized: 'saikumar',
			fields: null,
			status_text: '',
			status_emoji: '',
			status_emoji_display_info: [],
			status_expiration: 0,
			avatar_hash: 'gaa0894fb8a5',
			first_name: 'saikumar',
			last_name: '',
			image_24:
				'https://secure.gravatar.com/avatar/aa0894fb8a52cecc01924502d4c7d3aa.jpg?s=24&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0015-24.png',
			image_32:
				'https://secure.gravatar.com/avatar/aa0894fb8a52cecc01924502d4c7d3aa.jpg?s=32&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0015-32.png',
			image_48:
				'https://secure.gravatar.com/avatar/aa0894fb8a52cecc01924502d4c7d3aa.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0015-48.png',
			image_72:
				'https://secure.gravatar.com/avatar/aa0894fb8a52cecc01924502d4c7d3aa.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0015-72.png',
			image_192:
				'https://secure.gravatar.com/avatar/aa0894fb8a52cecc01924502d4c7d3aa.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0015-192.png',
			image_512:
				'https://secure.gravatar.com/avatar/aa0894fb8a52cecc01924502d4c7d3aa.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0015-512.png',
			status_text_canonical: '',
			team: 'T06TPFSDUCQ',
		},
		is_admin: false,
		is_owner: false,
		is_primary_owner: false,
		is_restricted: false,
		is_ultra_restricted: false,
		is_bot: false,
		is_app_user: false,
		updated: 1724747387,
		is_email_confirmed: true,
		who_can_share_contact_card: 'EVERYONE',
	},
	response_metadata: {
		scopes: [
			'chat:write',
			'users:read',
			'channels:join',
			'channels:read',
			'groups:read',
			'im:read',
			'mpim:read',
		],
		acceptedScopes: ['users:read'],
	},
};

const VariableComponent = ({ value, onChange }) => {
	const [info, setInfo] = useState({
		open: false,
	});

	const handleInfo = (updateInfo) => {
		setInfo({
			...info,
			...updateInfo,
		});
	};

	return (
		<div className="variableComponentContainer">
			<div className="inputContainer">
				<input
					type="text"
					placeholder="Variable Name"
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
			</div>
			<Tooltip
				open={info?.open}
				onOpenChange={(open) => {
					if (!open) {
						handleInfo({
							open: false,
						});
					}
				}}
				trigger="click"
				title={
					<div className="variableTooltipContainer">
						<div className="variableTooltipHeader">
							<ChevronRightThinSvg style={{ rotate: '180deg' }} />
							<span className="variableTooltipHeaderTitle">Variable name</span>
						</div>
						<div className="variableTooltipBody">
							<div className="variableListItem">
								<span className="variableListItemTitle">Variable name</span>
								<div className="variableListRightContainer">
									3 <ChevronRightThinSvg />
								</div>
							</div>
							<div className="variableListItem">
								<span className="variableListItemTitle">Variable name</span>
								<div className="variableListRightContainer">
									3 <ChevronRightThinSvg />
								</div>
							</div>
							<div className="variableListItem">
								<span className="variableListItemTitle">Variable name</span>
								<div className="variableListRightContainer">
									3 <ChevronRightThinSvg />
								</div>
							</div>
						</div>
					</div>
				}
				placement="bottom"
				arrow={false}
				color="transparent"
				overlayStyle={{
					minWidth: 'fit-content',
				}}
			>
				<button
					className="insertVariableButton"
					onClick={() => {
						handleInfo({
							open: !info?.open,
						});
					}}
				>
					Insert variable
				</button>
			</Tooltip>
		</div>
	);
};

export default VariableComponent;
