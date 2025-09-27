# GSAP Text Reveal Animation with ScrollTrigger

This document explains how to create a text reveal animation using GSAP (GreenSock Animation Platform) with ScrollTrigger and SplitText plugins.

## Overview

The animation creates a text reveal effect where text appears to be "painted" or "revealed" as the user scrolls. The effect is achieved by using CSS background gradients on text and animating the background position.

## HTML Structure

```html
<div class="img">
	<!-- Background image container -->
</div>

<div class="text">
	<p>Your text content goes here. This will be animated with the reveal effect.</p>
</div>

<div class="img">
	<!-- Another background image container -->
</div>
```

## CSS Styling

### Base Styles

```css
body {
	margin: 0;
	padding: 0;
	overflow-x: hidden;
	background-color: #161616;
}

.img {
	width: 100%;
	height: 100vh;
	background: url('your-image-url') no-repeat 50% 50%;
	background-size: cover;
	display: flex;
	align-items: center;
	justify-content: center;
}
```

### Text Animation Styles

```css
.text > p > div {
	background: linear-gradient(
		to right,
		rgb(255, 255, 255) 50%,
		/* Visible text color */ rgb(37, 37, 37) 50% /* Hidden text color (matches background) */
	);
	background-size: 200% 100%; /* Double width for gradient positioning */
	background-position-x: 100%; /* Start with text hidden */
	color: transparent; /* Make text transparent to show gradient */
	background-clip: text; /* Clip background to text shape */
	-webkit-background-clip: text; /* WebKit prefix for compatibility */
	margin-left: 50px;
	line-height: 1.2;
	font-size: 10vw; /* Responsive font size */
}
```

## JavaScript Implementation

```javascript
// Configure GSAP
gsap.config({ trialWarn: false });
console.clear();

// Register required plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

// Split text into individual lines for animation
const split = new SplitText('p', { type: 'lines' });

// Animate each line
split.lines.forEach((target) => {
	gsap.to(target, {
		backgroundPositionX: 0, // Animate from 100% to 0%
		ease: 'none', // Linear animation for smooth scroll sync
		scrollTrigger: {
			trigger: target, // Element that triggers the animation
			markers: true, // Show debug markers (remove in production)
			scrub: 1, // Smooth scrubbing tied to scroll position
			start: 'top center', // Animation starts when top of element hits center of viewport
			end: 'bottom center', // Animation ends when bottom of element hits center of viewport
		},
	});
});
```

## How It Works

1. **Text Splitting**: The `SplitText` plugin breaks the paragraph into individual lines
2. **Gradient Background**: Each line gets a linear gradient background that's twice as wide as the text
3. **Initial State**: The gradient starts positioned at 100% (text appears hidden)
4. **Scroll Animation**: As the user scrolls, the background position animates from 100% to 0%
5. **Reveal Effect**: This creates the illusion of text being "painted" or "revealed" from left to right

## Key Concepts

### Background Gradient Technique

-   Uses a 50/50 gradient where one color matches the background (hidden) and the other is the visible text color
-   `background-size: 200% 100%` makes the gradient twice as wide as the text
-   `background-position-x: 100%` initially hides the text
-   Animating to `background-position-x: 0%` reveals the text

### ScrollTrigger Configuration

-   `scrub: 1` creates smooth animation tied to scroll position
-   `start/end` define when the animation begins and ends
-   `markers: true` shows debug markers (remove in production)

### SplitText Usage

-   `type: "lines"` splits text into individual lines
-   Each line can be animated independently
-   Creates more granular control over the animation timing

## Customization Options

### Animation Timing

```javascript
scrollTrigger: {
  start: "top bottom",    // Start when element enters viewport
  end: "bottom top",      // End when element leaves viewport
  scrub: 0.5,             // Faster scrubbing (0.5 seconds)
}
```

### Different Reveal Directions

```css
/* Right to left reveal */
background: linear-gradient(to left, rgb(255, 255, 255) 50%, rgb(37, 37, 37) 50%);
background-position-x: -100%; /* Start from left */
```

### Multiple Colors

```css
background: linear-gradient(to right, #ff6b6b 33%, #4ecdc4 66%, #45b7d1 100%);
```

## Performance Considerations

1. **Remove markers in production**: Set `markers: false` or remove the property
2. **Optimize scroll triggers**: Use `pin: true` if you need to pin elements
3. **Consider mobile performance**: Test on various devices
4. **Use `will-change`**: Add `will-change: transform` to animated elements for better performance

## Browser Compatibility

-   Modern browsers with CSS `background-clip: text` support
-   WebKit browsers need `-webkit-background-clip: text`
-   Fallback: Consider using `mask` property for older browsers

## Dependencies

-   GSAP (GreenSock Animation Platform)
-   ScrollTrigger plugin
-   SplitText plugin

## Installation

```bash
npm install gsap
```

Or include via CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js"></script>
```

## Example Usage in React

```jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const TextReveal = ({ text }) => {
	const textRef = useRef(null);

	useEffect(() => {
		if (textRef.current) {
			const split = new SplitText(textRef.current, { type: 'lines' });

			split.lines.forEach((target) => {
				gsap.to(target, {
					backgroundPositionX: 0,
					ease: 'none',
					scrollTrigger: {
						trigger: target,
						scrub: 1,
						start: 'top center',
						end: 'bottom center',
					},
				});
			});
		}
	}, []);

	return (
		<div className="text">
			<p ref={textRef}>{text}</p>
		</div>
	);
};
```

This animation technique is perfect for creating engaging, scroll-driven text reveals that add visual interest to landing pages and storytelling sections.
