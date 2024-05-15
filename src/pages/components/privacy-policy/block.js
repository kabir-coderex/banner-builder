/**
 * External dependencies
 */
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { __ } from "@wordpress/i18n";
const { RawHTML, Component, useEffect } = wp.element;
const { RichText } = wp.blockEditor;

/**
 * Internal dependencies
 */

const mrmPrivacyPolicy = ({
  attributes: {
    formLayout,
    inputAlignment,
    inputWidth,
    inputMaxWidth,
    inputBgColor,
    inputFontSize,
    inputTextColor,
    inputBorderRadius,
    privacyPolicyLabel,
    inputPaddingTop,
    inputPaddingRight,
    inputPaddingBottom,
    inputPaddingLeft,
    inputBorderStyle,
    inputBorderWidth,
    inputBorderColor,
    rowSpacing,

    labelColor,
    labelSpacing,

    inputTypography,
    labelTypography,
    isInheritTheme,
    Typography,
    className,
    onlyNotice
  },
}) => {
  let layout = formLayout;
  let fieldSpacing = {
    marginBottom: rowSpacing + "px ",
    width: inputWidth + "% ",
    maxWidth: inputMaxWidth + "px ",
  };

  let labelStyle = {
    color: labelColor,
    marginBottom: labelSpacing + "px",
    fontWeight: labelTypography.weight,
    fontFamily: labelTypography.family,
  };
  let checkboxLabelColor = {
    color: labelColor,
  };

  let inputStyle = {
    backgroundColor: inputBgColor ? inputBgColor : 'transparent',
    color: inputTextColor,
    fontSize: inputFontSize + "px",
    borderRadius: inputBorderRadius + "px",
    paddingTop: inputPaddingTop + "px",
    paddingRight: inputPaddingRight + "px",
    paddingBottom: inputPaddingBottom + "px",
    paddingLeft: inputPaddingLeft + "px",
    borderStyle: inputBorderStyle,
    borderWidth: inputBorderWidth + "px",
    borderColor: inputBorderColor,
    fontWeight: inputTypography.weight,
    fontFamily: inputTypography.family,
  };
  let mrm_form_group = 'mrm-form-group';
  if( isInheritTheme ){
    inputStyle = {}
    labelStyle = {}
    mrm_form_group = '';
  }
  const classNames = classnames(
      `${mrm_form_group}`,
      'mrm-input-group',
      `alignment-${inputAlignment}`,
      'privacy-policy',
      className
  )
  
  return (
    <>
      <div className={classNames} style={fieldSpacing}>
        <div className={`input-wrapper checkbox-input-wrapper mrm-checkbox-group  ${isInheritTheme? 'theme-checkbox' : 'custom-checkbox'}`}>
          {!onlyNotice ?
              <input
              required
              type="checkbox"
              name="privacy_policy"
              id="mrm-privacy-policy-input" /> :
            null
            }
          <label htmlFor="mrm-privacy-policy-input" className="mrm-privacy-policy-input-label">
            <RichText.Content
                className="mrm-privacy-policy"
                tagName="p"
                type="p"
                value={privacyPolicyLabel}
                style={inputStyle}
            />
            <span className="required-mark">*</span>
          </label>
        </div>

      </div>
    </>
  );
};

mrmPrivacyPolicy.propTypes = {
  attributes: PropTypes.object.isRequired,
};
export default mrmPrivacyPolicy;
