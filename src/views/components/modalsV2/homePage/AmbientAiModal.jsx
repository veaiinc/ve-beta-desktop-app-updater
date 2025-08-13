import { memo, useMemo, useRef } from 'react';
import AmbientAiInfo from '../../../features/homePage/ambientAi/AmbientAiInfo';
import '../../../../assets/scss/home_page/modals/ambientAiModal.scss';
import { Drawer } from 'antd';
import Onboard from '../../../features/homePage/ambientAi/Onboard';
import AskVe from '../../../features/homePage/ambientAi/AskVe';

const AmbientAiModal = ({
	open,
	onClose,
	data,
	onNextCardClick,
	onPrevCardClick,
	totalDocs,
	selectedCardNumber,
	selectedOption = null,
	trainedFeedbackIds = null,
	setTrainedFeedbackIds = null,
}) => {
	const resizableContainerRef = useRef(null);
	const widthRef = useRef(null);
	const animationFrameId = useRef(null);
	const mouseXPosition = useRef(null);

	const handleMouseDown = (e) => {
		if (!resizableContainerRef.current) return;

		mouseXPosition.current = e.clientX;
		widthRef.current = resizableContainerRef.current.offsetWidth;

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const handleMouseMove = (e) => {
		if (!resizableContainerRef.current || widthRef.current == null) return;
		if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);

		animationFrameId.current = requestAnimationFrame(() => {
			const deltaX = mouseXPosition.current - e.clientX;
			const newWidth = widthRef.current + deltaX;

			const minWidth = 600;
			const maxWidth = window.innerWidth * 0.8 || 1000;
			const clampedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

			resizableContainerRef.current.style.width = `${clampedWidth}px`;
			resizableContainerRef.current.style.userSelect = 'none';

			widthRef.current = clampedWidth;
			mouseXPosition.current = e.clientX;
		});
	};

	const handleMouseUp = () => {
		if (animationFrameId.current) {
			cancelAnimationFrame(animationFrameId.current);
			animationFrameId.current = null;
		}
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	};

	const componentMapper = useMemo(() => {
		return {
			onboard: <Onboard onClose={onClose} />,
			integration: <div>Integration</div>,
			askVe: <AskVe />,
		};
	}, [onClose]);

	return (
		<>
			{open && <div onClick={onClose} className="custom-mask"></div>}
			<Drawer
				open={open}
				onClose={onClose}
				placement="right"
				width={'auto'}
				style={{ padding: '0px', backgroundColor: 'transparent' }}
				styles={{ header: { display: 'none' }, body: { padding: '0px', width: 'auto' } }}
				rootClassName="ambient-ai-drawer"
				forceRender={false}
				// maskClassName="drawer-mask"
			>
				<div className="ambient-ai-wrapper" ref={resizableContainerRef}>
					<div className="drag-handler" onMouseDown={handleMouseDown} />

					{selectedOption === 'onboarding' ? (
						componentMapper[data?.type]
					) : (
						<AmbientAiInfo
							data={data}
							trainedFeedbackIds={trainedFeedbackIds}
							setTrainedFeedbackIds={setTrainedFeedbackIds}
							totalDocs={totalDocs}
							selectedCardNumber={selectedCardNumber}
							onNextCardClick={onNextCardClick}
							onPrevCardClick={onPrevCardClick}
							onClose={onClose}
						/>
					)}
				</div>
			</Drawer>
		</>
	);
};

export default memo(AmbientAiModal);
