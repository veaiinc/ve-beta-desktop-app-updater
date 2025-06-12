import React, { useState, useRef, useEffect, memo } from 'react';
import '../../../assets/scss/chat/formWidget.scss';
import { ReactComponent as ExpandIcon } from '../../../assets/svg/docs/expand.svg';
import Template from '../../../../builderSrc/views/feature/home';
import FormModal from './FormModal';
const builderAgentMapper = {
	formBuilderAgent: {
		label: 'Form',
	},
	invoiceBuilderAgent: {
		label: 'Invoice',
	},
	contractBuilderAgent: {
		label: 'Contract',
	},
};
const FormWidget = ({
	workflowTemplateId,
	moduleTemplateId,
	handleSendWebsocketMessage,
	latestStreamMesage,
	lastQuery,
	toggleLatestStreamMessage,
	handleViewDocument,
	showViewDocument = false,
	messageData,
	isLastMessage = false,
	agent = null,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const formRef = useRef(null);

	useEffect(() => {
		if (showViewDocument || isExpanded) return;
		setTimeout(() => {
			let isExpanded =
				messageData?.stream_end && isLastMessage && !messageData?.isOldMessage
					? true
					: false;
			setIsExpanded(isExpanded);
			if (handleViewDocument) {
				handleViewDocument(isExpanded);
			}
		}, 1000);
	}, [messageData?.stream_end, isLastMessage]);

	const handleExpand = () => {
		setIsExpanded(!isExpanded);
		if (handleViewDocument) {
			handleViewDocument(!isExpanded);
		}
	};
	return (
		<div className={`form-widget-wrapper`}>
			<div
				className={`form-widget-container`}
				ref={formRef}
				style={{
					...(isExpanded && {
						'--top': `${formRef.current?.getBoundingClientRect()?.top}px`,
						'--left': `${formRef.current?.getBoundingClientRect()?.left}px`,
					}),
					willChange: 'transform, width, height',
					transform: 'translate3d(0, 0, 0)',
				}}
			>
				<div className="form-widget-header">
					<span className="form-widget-header-title">
						VE.AI {builderAgentMapper[agent]?.label || 'Form'}
					</span>
					<ExpandIcon className={`expand-icon`} onClick={handleExpand} />
				</div>
				<div className="form-content">
					<div className="section-not-expanded">
						<iframe
							src={`${origin}/preview/short/${workflowTemplateId}?module=${moduleTemplateId}&isPubic=${moduleTemplateId?.isPublic}&restrictClick=true`}
							title="Builder Preview"
							onClick={(e) => e.stopPropagation()}
							onMouseDown={(e) => e.stopPropagation()}
							onMouseUp={(e) => e.stopPropagation()}
							style={{
								backgroundColor: '#fff',
								transition: 'opacity 0.3s ease',
								transform: 'translate3d(0, 0, 0)',
								willChange: 'transform, opacity',
							}}
							width="100%"
							height="100%"
						/>
					</div>
				</div>
			</div>
			<FormModal
				isOpen={isExpanded}
				closeModal={handleExpand}
				handleSendWebsocketMessage={handleSendWebsocketMessage}
				latestStreamMesage={latestStreamMesage}
				lastQuery={lastQuery}
				toggleLatestStreamMessage={toggleLatestStreamMessage}
				workflowTemplateId={workflowTemplateId}
				agent={agent}
				builderAgentMapper={builderAgentMapper}
			/>
		</div>
	);
};

export default memo(FormWidget);

{
	/* <iframe
	src={`/builder/${workflowTemplateIdFromProps}?isEmbed=true`} //dont change to fixed url only use origin
	title="Builder Preview"
	onClick={(e) => e.stopPropagation()}
	onMouseDown={(e) => e.stopPropagation()}
	onMouseUp={(e) => e.stopPropagation()}
	style={{
		backgroundColor: '#fff',
		opacity: 0,
		animation: 'fadeIn 0.3s ease forwards',
		transform: 'translate3d(0, 0, 0)',
		willChange: 'transform, opacity',
	}}
	width="100%"
	height="100%"
/> */
}
