import { useEffect, useLayoutEffect, useRef } from 'react';

const InfiniteScroll = ({
	children,
	dataLength,
	next,
	hasMore = true,
	loader = null,
	endMessage = null,
	scrollThreshold = 0.8,
	onScroll = null,
	scrollableTarget = null,
	height = null,
	className = '',
	inverse = false, // use this for reverse infinite scroll
	style = {},
	hasChildren = true,
	horizontal = false,
	scrollSnap = false, // optional scroll snapping
}) => {
	const sentinelRef = useRef(null);
	const scrollParent = useRef(null);
	const loadingRef = useRef(false);
	const prevScrollHeightRef = useRef(0);

	useEffect(() => {
		const rootEl =
			typeof scrollableTarget === 'string'
				? document.getElementById(scrollableTarget)
				: scrollableTarget || scrollParent.current;

		if (!sentinelRef.current || !hasMore || !rootEl) return;

		const thresholdPx =
			typeof scrollThreshold === 'string' && scrollThreshold.endsWith('px')
				? parseFloat(scrollThreshold)
				: null;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !loadingRef.current) {
					loadingRef.current = true;
					next();
				}
			},
			{
				root: rootEl,
				rootMargin: horizontal
					? thresholdPx
						? `0px ${thresholdPx}px 0px 0px`
						: '0px'
					: thresholdPx
					? `0px 0px ${thresholdPx}px 0px`
					: '0px',
				threshold: typeof scrollThreshold === 'number' ? scrollThreshold : 0.8,
			},
		);

		observer.observe(sentinelRef.current);

		return () => observer.disconnect();
	}, [hasMore, scrollThreshold, next, scrollableTarget, horizontal]);

	useLayoutEffect(() => {
		loadingRef.current = false;

		if (inverse) {
			const targetEl =
				typeof scrollableTarget === 'string'
					? document.getElementById(scrollableTarget)
					: scrollableTarget || scrollParent.current;

			const newScrollHeight = targetEl?.scrollHeight || 0;

			if (prevScrollHeightRef.current && newScrollHeight > prevScrollHeightRef.current) {
				// Adjust scrollTop to keep viewport stable
				targetEl.scrollTop += newScrollHeight - prevScrollHeightRef.current;
			}
			prevScrollHeightRef.current = newScrollHeight;
		}
	}, [dataLength]);

	useEffect(() => {
		const targetEl =
			typeof scrollableTarget === 'string'
				? document.getElementById(scrollableTarget)
				: scrollableTarget || scrollParent.current;

		if (!onScroll || !targetEl) return;

		const handleScroll = (e) => onScroll(e);

		targetEl.addEventListener('scroll', handleScroll);
		return () => targetEl.removeEventListener('scroll', handleScroll);
	}, [onScroll, scrollableTarget]);

	const showLoader =
		hasMore && (hasChildren || (Array.isArray(children) ? children.length > 0 : hasChildren));

	const containerStyle = {
		display: horizontal ? 'flex' : 'block',
		overflowX: horizontal ? 'auto' : 'hidden',
		overflowY: horizontal ? 'hidden' : 'auto',
		whiteSpace: horizontal ? 'nowrap' : 'normal',
		height: height || 'auto',
		scrollSnapType: scrollSnap ? (horizontal ? 'x mandatory' : 'y mandatory') : undefined,
		WebkitOverflowScrolling: 'touch',
		...style,
	};

	return (
		<div
			ref={!scrollableTarget ? scrollParent : undefined}
			style={containerStyle}
			className={className}
		>
			{/* for reverse infinite scroll */}
			{inverse && hasMore && (
				<div
					ref={sentinelRef}
					style={{
						minWidth: horizontal ? '1px' : '100%',
						minHeight: horizontal ? '100%' : '1px',
						marginBottom: '2px',
					}}
				/>
			)}
			{inverse && !hasMore && endMessage}
			{inverse && showLoader && loader}

			{children}

			{/* for normal infinite scroll */}
			{!inverse && showLoader && loader}
			{!inverse && !hasMore && endMessage}
			{!inverse && hasMore && (
				<div
					ref={sentinelRef}
					style={{
						minWidth: horizontal ? '1px' : '100%',
						minHeight: horizontal ? '100%' : '1px',
						marginBottom: '2px',
					}}
				/>
			)}
		</div>
	);
};

export default InfiniteScroll;
