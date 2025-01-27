import React, { Fragment } from 'react';
import { ReactComponent as ChevronRightThinIcon } from '../../../../../../assets/svg/tasks/chevronRightThin.svg';
import { fetchOriginSelection } from '../../../../../../helpers';
import '../../../../../../assets/scss/home_page/workflows/workflowCard.scss';

const origin = fetchOriginSelection();
const FilesTab = ({ data }) => {
	return (
		<div className="files-container">
			<div className="file">
				<div className="left">
					<iframe
						src={`${origin}/preview/${data?._id}?module=${data?.moduleTemplates?.[0]?._id}&isPubic=${data?.moduleTemplates?.[0]?.isPublic}&restrictClick=true`}
						title="Builder Preview"
						width="100%"
						height="100%"
						style={{ zoom: 0.3 }}
					/>
				</div>

				<div className="right-text">
					<div className="title">{data?.title} </div>
					<div className="labels">
						{data?.moduleTemplates?.map((template, index) => {
							if (index === 0) {
								return <div key={index}>{template?.label} </div>;
							}
							return (
								<Fragment key={index}>
									<ChevronRightThinIcon />
									<div>{template?.label}</div>
								</Fragment>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilesTab;
