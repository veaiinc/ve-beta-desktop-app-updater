import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

/**
 * A wrapper component for children of
 * VirtualScroll. Computes inline style and
 * handles whether to display props.children.
 */
const VirtualScrollChild = ({ height, children }) => {
	const [ref, inView] = useInView();
	const style = {
		height: `${height}px`,
		overflow: 'hidden',
	};
	return (
		<div style={style} ref={ref}>
			{inView ? children : null}
		</div>
	);
};

// export default VirtualScrollChild;
/**
 * A container component for infinite scrolling.
 */
const InfiniteScroll = ({ listItems, lastRowHandler }) => {
	const [lastRowRef, lastRowInView] = useInView();
	// if last row is in view, call the last row handler
	useEffect(() => {
		lastRowInView && lastRowHandler();
	}, [lastRowInView]);

	const Elements = listItems.map((listItem, i) => {
		const props = { key: i };
		i === listItems.length - 1 && (props['ref'] = lastRowRef);
		return <div {...props}>{listItem}</div>;
	});
	return <>{Elements}</>;
};

// export default InfiniteScroll;

const VirtualAndInfiniteScroll = ({ listItems, height, lastRowHandler }) => {
	const VirtualScrollChildren = listItems.map((listItem) => (
		<VirtualScrollChild height={height} children={listItem} />
	));

	return <InfiniteScroll listItems={VirtualScrollChildren} lastRowHandler={lastRowHandler} />;
};

export default VirtualAndInfiniteScroll;
