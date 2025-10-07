import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
	applyTranslucency,
	removeTranslucency,
	isTranslucencySupported,
} from '../helpers/translucencyUtils';
import { isAntdComponent } from '../helpers/antdTranslucencyUtils';

/**
 * Enhanced TranslucencyHelper Component
 *
 * This component provides advanced translucency support for Electron applications.
 * It automatically applies translucency effects to elements with better performance
 * and error handling.
 */
const TranslucencyHelper = ({
	children,
	className = '',
	translucencyLevel = 'medium',
	enablePerformanceOptimization = true,
	includeBorder = true,
	includeShadow = true,
	customBackground = null,
	onTranslucencyChange = null,
	disabled = false,
	style = {},
	...props
}) => {
	const containerRef = useRef(null);
	const [isTranslucent, setIsTranslucent] = useState(false);
	const [isSupported, setIsSupported] = useState(true);

	// Check if translucency is supported
	useEffect(() => {
		const supported = isTranslucencySupported();
		setIsSupported(supported);

		if (!supported) {
			console.warn('TranslucencyHelper: Backdrop-filter not supported in this browser');
		}
	}, []);

	// Apply translucency effect
	const applyEffect = useCallback(() => {
		const container = containerRef.current;
		if (!container || !isSupported || disabled) return;

		try {
			// Check if container is an Ant Design component
			const isAntd = isAntdComponent(container);

			applyTranslucency(container, {
				level: translucencyLevel,
				performanceOptimized: enablePerformanceOptimization,
				includeBorder,
				includeShadow,
				customBackground,
				preserveAntdStyles: true, // Always preserve Ant Design styles
			});

			setIsTranslucent(true);
			onTranslucencyChange?.(true, translucencyLevel);

			// Log component type for debugging
			if (isAntd) {
				console.log('TranslucencyHelper: Applied Ant Design translucency to', container);
			}
		} catch (error) {
			console.error('TranslucencyHelper: Error applying translucency:', error);
		}
	}, [
		translucencyLevel,
		enablePerformanceOptimization,
		includeBorder,
		includeShadow,
		customBackground,
		isSupported,
		disabled,
		onTranslucencyChange,
	]);

	// Remove translucency effect
	const removeEffect = useCallback(() => {
		const container = containerRef.current;
		if (!container) return;

		try {
			removeTranslucency(container);
			setIsTranslucent(false);
			onTranslucencyChange?.(false, null);
		} catch (error) {
			console.error('TranslucencyHelper: Error removing translucency:', error);
		}
	}, [onTranslucencyChange]);

	// Apply translucency on mount and when dependencies change
	useEffect(() => {
		if (disabled) {
			removeEffect();
		} else {
			applyEffect();
		}

		// Cleanup function
		return () => {
			removeEffect();
		};
	}, [applyEffect, removeEffect, disabled]);

	// Handle resize events for performance optimization
	useEffect(() => {
		if (!enablePerformanceOptimization) return;

		const handleResize = () => {
			// Reapply translucency after resize for better performance
			if (isTranslucent && !disabled) {
				requestAnimationFrame(() => {
					applyEffect();
				});
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [applyEffect, isTranslucent, disabled, enablePerformanceOptimization]);

	// Enhanced container styles
	const containerStyle = {
		position: 'relative',
		zIndex: 1,
		height: '100%',
		background: 'transparent',
		...style,
	};

	// Add data attributes for debugging and tracking
	const dataAttributes = {
		'data-translucency-helper': 'true',
		'data-translucency-level': translucencyLevel,
		'data-translucency-enabled': !disabled,
		'data-translucency-supported': isSupported,
	};

	return (
		<div
			ref={containerRef}
			className={`translucency-helper ${className} ${
				disabled ? 'translucency-disabled' : ''
			}`}
			style={containerStyle}
			{...dataAttributes}
			{...props}
		>
			{children}
		</div>
	);
};

export default TranslucencyHelper;
