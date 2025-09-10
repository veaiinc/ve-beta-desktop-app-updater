import { memo, useEffect, useRef, useState, useCallback } from 'react';
import InfiniteScroll from '../../globalComponents/InfiniteScroll';
import Skeleton from 'react-loading-skeleton';

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

const FullImagesComponent = ({
	galleryCredentials,
	fetchMoreImages,
	imagesList,
	largeImageFunction,
	info,
	setInfo,
	selectedImages,
	isAiFace,
	activeImageIndex,
	isThumbnailClicked,
}) => {
	// In GalleryViewer, we want to show all images regardless of selectedImages
	const displayedImages = isAiFace ? imagesList?.images : imagesList?.docs;

	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [dragStart, setDragStart] = useState(null);
	const imageContainerRef = useRef({});
	const observerRef = useRef(null);
	const isKeyNavigating = useRef(false); // Flag to track if navigation is via keyboard

	// Reset zoom and drag on active image change
	useEffect(() => {
		setDragOffset({ x: 0, y: 0 });
		setInfo((prev) => ({
			...prev,
			imageScalling: 1,
		}));
	}, [info?.activeImage, setInfo]);

	// Set up IntersectionObserver to detect centered image
	useEffect(() => {
		const observerOptions = {
			root: document.getElementById('activeImageWrapper-target'),
			rootMargin: '0px',
			threshold: 0.5, // Trigger when 10% of the image is visible
		};

		observerRef.current = new IntersectionObserver((entries) => {
			// Skip observer updates during thumbnail clicks or keyboard navigation
			if (isKeyNavigating.current || isThumbnailClicked.current) return;

			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const imageId = entry.target.id;
					const index = displayedImages.findIndex((img) => img._id === imageId);
					if (index !== -1 && imageId !== info.activeImage) {
						setInfo((prev) => ({
							...prev,
							activeImage: imageId,
							activeImageIndex: index,
						}));
					}
				}
			});
		}, observerOptions);

		// Observe all image containers
		Object.values(imageContainerRef.current).forEach((el) => {
			if (el) observerRef.current.observe(el);
		});

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, [displayedImages, info.activeImage, setInfo, isThumbnailClicked]);
	const handleKeyDown = useCallback(
		(e) => {
			// Prevent default browser scrolling behavior for arrow keys
			if (['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
				e.preventDefault();
			}

			const currentIndex = info.activeImageIndex || 0;
			const nextIndex = Math.min(currentIndex + 1, displayedImages.length - 1);
			const prevIndex = Math.max(currentIndex - 1, 0);

			isKeyNavigating.current = true; // Set flag to disable IntersectionObserver

			if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
				const prevImage = displayedImages[prevIndex];
				if (prevImage) {
					setInfo((prev) => ({
						...prev,
						activeImage: prevImage._id,
						activeImageIndex: prevIndex,
					}));
					requestAnimationFrame(() => {
						document.getElementById(prevImage._id)?.scrollIntoView({
							behavior: 'smooth',
							block: 'center',
							inline: 'center',
						});
						// Reset the flag after scroll completes (approximate duration)
						setTimeout(() => {
							isKeyNavigating.current = false;
						}, 500); // Adjust based on smooth scroll duration
					});
				}
			} else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
				const nextImage = displayedImages[nextIndex];
				if (nextImage) {
					setInfo((prev) => ({
						...prev,
						activeImage: nextImage._id,
						activeImageIndex: nextIndex,
					}));
					requestAnimationFrame(() => {
						document.getElementById(nextImage._id)?.scrollIntoView({
							behavior: 'smooth',
							block: 'center',
							inline: 'center',
						});
						// Reset the flag after scroll completes
						setTimeout(() => {
							isKeyNavigating.current = false;
						}, 500); // Adjust based on smooth scroll duration
					});
				}
				// Trigger fetchMoreImages when reaching the last image
				if (
					nextIndex === displayedImages.length - 1 &&
					!selectedImages &&
					imagesList?.hasNextPage
				) {
					fetchMoreImages();
				}
			}
		},
		[
			displayedImages,
			setInfo,
			fetchMoreImages,
			imagesList,
			selectedImages,
			info.activeImageIndex,
		],
	);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleKeyDown]);

	const handleDrag = (dx, dy, imageRef, scale) => {
		if (!imageRef?.current) return;

		const container = imageRef.current;
		const imgEl = container.querySelector('img');
		if (!imgEl) return;

		const containerRect = container.getBoundingClientRect();
		const imgWidth = imgEl.offsetWidth * scale;
		const imgHeight = imgEl.offsetHeight * scale;

		const maxX = Math.max((imgWidth - containerRect.width) / 2, 0);
		const maxY = Math.max((imgHeight - containerRect.height) / 2, 0);

		setDragOffset((prev) => ({
			x: clamp(prev.x + dx, -maxX, maxX),
			y: clamp(prev.y + dy, -maxY, maxY),
		}));
	};

	return (
		<div className="activeImageWrapper" id="activeImageWrapper-target">
			<InfiniteScroll
				dataLength={displayedImages.length}
				next={selectedImages ? () => {} : fetchMoreImages}
				hasMore={selectedImages ? false : imagesList?.hasNextPage || false}
				loader={<h4 style={{ color: 'white', textAlign: 'center' }}>Loading...</h4>}
				scrollableTarget="activeImageWrapper-target"
				style={{
					display: 'flex',
					flexDirection: 'row',
					gap: '72px',
					alignItems: 'center',
					width: '100vw',
				}}
				horizontal={true}
			>
				{galleryCredentials && imagesList
					? displayedImages.map((image, index) => {
							const params = `Key-Pair-Id=${galleryCredentials?.['Key-Pair-Id']}&Signature=${galleryCredentials?.Signature}&Policy=${galleryCredentials?.Policy}`;
							const src = `${galleryCredentials?.baseURL}/${image?.activeVersion?.s3_optimized?.key}?${params}`;
							const isActive = image?._id === info?.activeImage;
							const scale = isActive ? info?.imageScalling || 1 : 1;
							const translateX = isActive ? dragOffset.x : 0;
							const translateY = isActive ? dragOffset.y : 0;

							const ref = (el) => {
								if (el) {
									imageContainerRef.current[image?._id] = el;
									if (observerRef.current) {
										observerRef.current.observe(el);
									}
								}
							};

							return (
								<div
									key={image?._id} // Use unique _id as key
									className="imageContainer"
									id={image?._id}
									ref={ref}
									onMouseDown={(e) => {
										if (scale > 1 && isActive) {
											e.preventDefault();
											setDragStart({ x: e.clientX, y: e.clientY });
										}
									}}
									onMouseMove={(e) => {
										if (dragStart && isActive) {
											const dx = e.clientX - dragStart.x;
											const dy = e.clientY - dragStart.y;
											handleDrag(
												dx,
												dy,
												{
													current: imageContainerRef.current[image._id],
												},
												scale,
											);
											setDragStart({ x: e.clientX, y: e.clientY });
										}
									}}
									onMouseUp={() => setDragStart(null)}
									onMouseLeave={() => setDragStart(null)}
									onTouchStart={(e) => {
										if (scale > 1 && isActive) {
											const touch = e.touches[0];
											setDragStart({ x: touch.clientX, y: touch.clientY });
										}
									}}
									onTouchMove={(e) => {
										if (dragStart && isActive) {
											const touch = e.touches[0];
											const dx = touch.clientX - dragStart.x;
											const dy = touch.clientY - dragStart.y;
											handleDrag(
												dx,
												dy,
												{
													current: imageContainerRef.current[image._id],
												},
												scale,
											);
											setDragStart({ x: touch.clientX, y: touch.clientY });
										}
									}}
									onTouchEnd={() => setDragStart(null)}
									style={{ cursor: scale > 1 && isActive ? 'grab' : 'default' }}
								>
									<img
										src={src}
										alt={`Gallery image ${index}`}
										style={{
											transform: `
                        translate(${translateX}px, ${translateY}px)
                        scale(${scale})
                        rotate(${image?.rotation || 0}deg)
                      `,
											transformOrigin: 'center',
											cursor: scale > 1 && isActive ? 'grab' : 'default',
											userSelect: 'none',
											maxWidth: '100%',
										}}
										draggable={false}
										onClick={() => largeImageFunction(image?._id, index)}
									/>
								</div>
							);
					  })
					: [...Array(5)].map((_, index) => (
							<div
								key={`skeleton-${index}`}
								className="imageContainer"
								style={{ width: '500px' }}
							>
								<Skeleton width="800px" height="900px" />
							</div>
					  ))}
			</InfiniteScroll>
		</div>
	);
};

export default memo(FullImagesComponent);
