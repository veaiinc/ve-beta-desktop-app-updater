// fontLoader.js
import FontFaceObserver from 'fontfaceobserver';

export const loadFont = (fontName, fontUrl) => {
	const font = new FontFaceObserver(fontName);

	// Add the font to the document
	const fontFace = new FontFace(fontName, `url(${fontUrl})`);
	document.fonts.add(fontFace);

	// Return a promise that resolves when the font is loaded
	return font
		.load()
		.then(() => {})
		.catch((error) => {
			console.error(`Failed to load font "${fontName}":`, error);
		});
};
