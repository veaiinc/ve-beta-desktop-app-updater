import { memo, useCallback, useContext } from 'react';
import '../../../../assets/scss/chat/chatComponents/textSelector.scss';
import Context from '../../../../context/context';

const TextSelector = ({
	styles = {},
	text = '',
	visible = false,
	handleReplyElementClose = null,
}) => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);

	const handleAskClick = useCallback(() => {
		updateStateValues({
			chatReplyData: text,
		});
		handleReplyElementClose?.();
	}, [text]);

	const handleMouseDown = useCallback((e) => {
		e?.stopPropagation();
	}, []);

	return (
		<div
			className="chat-reply-container"
			style={{
				...styles,
				opacity: visible ? 1 : 0,
				zIndex: visible ? 50 : -1,
				pointerEvents: visible ? 'auto' : 'none',
			}}
			onMouseDown={handleMouseDown}
		>
			<div className="ask-btn-container" onClick={handleAskClick}>
				Ask
			</div>
		</div>
	);
};

export default memo(TextSelector);
