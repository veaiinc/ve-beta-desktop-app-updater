import React, { memo } from 'react';
import ToggleSwitch from '../../components/input/slider';
import { ReactComponent as EditIcon } from '../../../assets/svg/workflow/edit.svg';
import { ReactComponent as DuplicateIcon } from '../../../assets/svg/worflow_builder/buildercard/duplicate.svg';
import { ReactComponent as LinkIcon } from '../../../assets/svg/activity/link.svg';
import { ReactComponent as EyeIcon } from '../../../assets/svg/worflow_builder/buildercard/eye.svg';
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

const SessionCards = ({ item }) => {
	const navigate = useNavigate();

	const formatDuration = (duration) => {
		if (!duration) return '';
		return `${duration.unitCount} ${duration.unitType}`;
	};

	return (
		<>
			<div className="sessionGridContainer" key={item._id}>
				<div className="sessionGridItem">
					<div className="sessionImage letterAvatar">
						<span>{item.sessionName.charAt(0).toUpperCase() || '?'}</span>
					</div>
					<div className="sessionContent">
						<div className="sessionHeader">
							<span>{item.sessionName}</span>
							<ToggleSwitch
								id={item._id}
								value={item.sessionEnabled}
								onChange={() => {
									console.log('toggle');
								}}
							/>
						</div>
						<div className="sessionInfo">
							<div className="duration">{formatDuration(item.sessionDuration)}</div>
							<div className="priceSeparator">|</div>
							<div className="price">{item.price || 'FREE'}</div>
						</div>
						<div className="location">{item.location}</div>
					</div>
				</div>
				<div className="sessionActions">
					<Tooltip title="Edit" placement="bottom">
						<EditIcon
							onClick={() => {
								navigate(`/scheduling/edit/${item._id}?from=scheduler`);
							}}
						/>
					</Tooltip>
					<Tooltip title="Duplicate" placement="bottom">
						<DuplicateIcon />
					</Tooltip>
					<Tooltip title="Copy Link" placement="bottom">
						<LinkIcon />
					</Tooltip>
					<Tooltip title="View" placement="bottom">
						<EyeIcon />
					</Tooltip>
				</div>
			</div>
		</>
	);
};

export default memo(SessionCards);
