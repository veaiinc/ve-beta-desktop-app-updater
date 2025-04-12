import React, { useState, useRef } from 'react';
import '../../../assets/scss/chat/formModel.scss';
import { ReactComponent as ExpandIcon } from '../../../assets/svg/docs/expand.svg';
import { fetchOriginSelection } from '../../../helpers';
import FromModelChatBox from './FromModelChatBox';
const FormModel = ({ workflowTemplateId, moduleTemplateId }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const formRef = useRef(null);
	let origin = fetchOriginSelection();
	const handleExpand = () => {
		setIsExpanded(!isExpanded);
	};
	return (
		<div className={`form-modal-wrapper ${isExpanded ? 'form-modal-wrapper-expanded' : ''}`}>
			<div
				className={`form-model-container ${isExpanded ? 'expanded' : ''}`}
				ref={formRef}
				style={{
					...(isExpanded && {
						'--top': `${formRef.current.getBoundingClientRect().top}px`,
						'--left': `${formRef.current.getBoundingClientRect().left}px`,
					}),
				}}
			>
				<div className="form-model-header">
					<span className="form-model-header-title">VE.AI Form</span>
					<ExpandIcon
						className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
						onClick={handleExpand}
					/>
				</div>
				<div className="form-content">
					{/* {isExpanded && <div className="section-30"><FromModelChatBox /></div>} */}
					<div
						className="section-not-expanded"
						// className={`${!isExpanded ? 'section-not-expanded' : 'section-70'}`}
					>
						<iframe
							src={
								isExpanded
									? `${origin}/${workflowTemplateId}`
									: `${origin}/preview/short/${workflowTemplateId}?module=${moduleTemplateId}&isPubic=${moduleTemplateId?.isPublic}&restrictClick=true`
							}
							title="Builder Preview"
							onClick={(e) => e.stopPropagation()}
							onMouseDown={(e) => e.stopPropagation()}
							onMouseUp={(e) => e.stopPropagation()}
							style={{
								backgroundColor: '#fff',
							}}
							width="100%"
							height="100%"
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FormModel;
