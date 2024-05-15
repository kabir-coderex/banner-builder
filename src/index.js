/**
 * External dependencies
 */
import { render } from '@wordpress/element';

/**
 * Internal dependencies
 */
import App from './App';

// Import the stylesheet for the plugin.
import './style/tailwind.css';
import './style/main.scss';

// Render the App component into the DOM
const dynamicPricingElement = document.getElementById('guttenberg-banner-builder');

if (dynamicPricingElement) {
	render(<App />, dynamicPricingElement);
}

import { registerCoreBlocks } from "@wordpress/block-library";
import domReady from "@wordpress/dom-ready";
const { registerBlockType} = wp.blocks;
const { __ } = wp.i18n;
import { MediaUpload } from '@wordpress/media-utils';


domReady(function () {
    registerCoreBlocks();
});
