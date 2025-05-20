import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import ToggleSwitch from '../../components/input/slider';
import EditIcon from '../../../assets/svg/workflow/edit.svg?react';
import DuplicateIcon from '../../../assets/svg/tasks/duplicate.svg?react';
import LinkIcon from '../../../assets/svg/activity/link.svg?react';
import EyeIcon from '../../../assets/svg/my_templates/openedEye.svg?react';
import { Tooltip } from 'antd';

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
