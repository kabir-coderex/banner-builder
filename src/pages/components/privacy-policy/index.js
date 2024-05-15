/**
 * BLOCK: Basic with ESNext
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 *
 * Using inline styles - no external stylesheet needed.  Not recommended!
 * because all of these styles will appear in `post_content`.
 */
import React from "react";
import attributes from "./attributes";
import Edit from "./edit";
import icon from './icon';
import mrmPrivacyPolicy from "./block";

// Save CSS in Database/File

const {__} = wp.i18n;
const {registerBlockType} = wp.blocks;

/**
 * Register Basic Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made available as an option to any
 * editor interface where blocks are implemented.
 *
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */

function PrivacyBlockBlock(){
    registerBlockType( "mrmformfield/privacy-policy-block", {
        title: __( "Privacy Policy  Checkbox", "mrm" ),
        category: "common",
        icon: icon.pricing,
        supports: {
            align: ['left', 'right', 'center']
        },
        attributes: attributes,
        edit: Edit,
        save: mrmPrivacyPolicy,
    });
}


export default PrivacyBlockBlock;
