import React, { memo } from 'react';
import '../../../../assets/scss/tasks/listViewHeader.scss';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/tasks/searchWhite.svg';
import { ReactComponent as ThunderSvg } from '../../../../assets/svg/tasks/thunder.svg';
import { ReactComponent as FilterLinesSvg } from '../../../../assets/svg/tasks/filterLines.svg';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';

const ListViewHeader = () => {
	return (
		<div className="listViewHeaderContainer">
			<div className="listViewHeader">
				<div className="listViewHeaderTitle">Tasks</div>
				<div className="listViewHeaderActions">
					<button className="listViewHeaderActionButton">
						<PlusSvg style={{ width: '20px', height: '20px' }} />
					</button>
					<button className="listViewHeaderActionButton">
						<SearchSvg />
					</button>
					<button className="listViewHeaderActionButton">
						<ThunderSvg />
					</button>
					<button className="listViewHeaderActionButton">
						<FilterLinesSvg />
					</button>
					<button className="listViewHeaderActionButton">
						<HorizontalMoreIcon style={{ width: '20px', height: '20px' }} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default memo(ListViewHeader);
