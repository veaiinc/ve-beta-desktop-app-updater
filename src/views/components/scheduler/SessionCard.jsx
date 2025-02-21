import React, { memo } from 'react';
import ToggleSwitch from '../../components/input/slider';
import { ReactComponent as EditIcon } from '../../../assets/svg/workflow/edit.svg';
import { ReactComponent as DuplicateIcon } from '../../../assets/svg/worflow_builder/buildercard/duplicate.svg';
import { ReactComponent as LinkIcon } from '../../../assets/svg/activity/link.svg';
import { ReactComponent as EyeIcon } from '../../../assets/svg/worflow_builder/buildercard/eye.svg';
import { Tooltip } from 'antd';

const SessionCards = ({ item }) => {
	return (
		<>
			<div className="sessionGridContainer" key={item.id}>
				<div className="sessionGridItem">
					<div className="sessionImage">
						<img src={item?.image} alt={item.title} />
					</div>
					<div className="sessionContent">
						<div className="sessionHeader">
							<h3>{item.title}</h3>
							<ToggleSwitch
								checked={item.isActive}
								onChange={() => {
									console.log('toggle');
								}}
							/>
						</div>
						<div className="sessionInfo">
							<div className="duration">{item.duration}</div>
							<div className="price">{item.price}</div>
						</div>
						<div className="location">{item.location}</div>
					</div>
				</div>
				<div className="sessionActions">
					<Tooltip title="Edit" placement="bottom">
						<EditIcon />
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
