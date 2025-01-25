import React from 'react';
import { ReactComponent as ChevronRightThinIcon } from '../../../../../../assets/svg/tasks/chevronRightThin.svg';
import { fetchOriginSelection } from '../../../../../../helpers';

const origin = fetchOriginSelection();
const FilesTab = ({ data }) => {
	console.log(data);
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
								return <div>{template?.label} </div>;
							}
							return (
								<>
									<ChevronRightThinIcon />
									<div>{template?.label}</div>
								</>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilesTab;
