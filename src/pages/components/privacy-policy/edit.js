import React from "react";
import PropTypes from "prop-types";
import Typography from "../components/Typography";
import classnames from 'classnames';
import { __ } from "@wordpress/i18n";
import {Fragment} from "@wordpress/element";
const { Component } = wp.element;
const { compose } = wp.compose;
const {
  TextControl,
  SelectControl,
  RangeControl,
  Panel,
  PanelBody,
  ToggleControl
} = wp.components;
const {
  InspectorControls,
  ColorPalette,
  RichText,
  BlockControls,
  BlockAlignmentToolbar,
} = wp.blockEditor;
/**
 * Internal dependencies
 */

class Editor extends Component {
  static propTypes = {
    attributes: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    setAttributes: PropTypes.func.isRequired,
  };

  onChangeAttribute = (key, value) => {
    this.props.setAttributes({
      ...this.props.attributes,
      [key]: value,
    });
  };

  onChangePadding = (type, attribute, value) => {
    this.props.setAttributes({
      [attribute]: value,
    });
  };

  onChangeLayout = (value) => {
    this.props.setAttributes({
      formLayout: value,
    });
  };

  formFields = () => {
    let { attributes, setAttributes } = this.props,
      privacyPolicyLabel = attributes.privacyPolicyLabel,
        onlyNotice = attributes.onlyNotice;

    return (
      <PanelBody title="Privacy Policy">
        <TextControl
          className="mrm-inline-label"
          label="Label Text"
          value={privacyPolicyLabel}
          onChange={(state) => this.props.setAttributes({ privacyPolicyLabel: state })}
        />
        <ToggleControl
            className="mrm-switcher-block"
            label="Only Show The Notice"
            checked={onlyNotice}
            onChange={(state) => setAttributes({ onlyNotice: state })}
        />

        <hr className="mrm-hr" />

        <label className="blocks-base-control__label">Row Spacing</label>
        <RangeControl
          value={attributes.rowSpacing}
          onChange={(rowSpacing) =>
            this.onChangeAttribute("rowSpacing", rowSpacing)
          }
          allowReset={true}
          resetFallbackValue={12}
          min={0}
          max={50}
          step={1}
        />
      </PanelBody>
    );
  };

  formStyle = () => {
    let { attributes, setAttributes } = this.props,
      labelTypography = attributes.labelTypography,
      device = attributes.device;

    return (
      <PanelBody title="Label Style" initialOpen={false}>
        <div className="mrm-block-typography">
          <Typography
            label={__("Typography")}
            value={labelTypography}
            onChange={(value) => setAttributes({ labelTypography: value })}
            disableLineHeight
            device={device}
            onDeviceChange={(value) => setAttributes({ device: value })}
          />
        </div>

        <hr className="mrm-hr" />

        <label className="blocks-base-control__label">Label Color</label>
        <ColorPalette
          onChange={(labelColor) =>
            this.onChangeAttribute("labelColor", labelColor)
          }
          value={attributes.labelColor}
        />

        <hr className="mrm-hr" />

        <label className="blocks-base-control__label">Label Spacing</label>
        <RangeControl
          value={attributes.labelSpacing}
          onChange={(labelSpacing) =>
            this.onChangeAttribute("labelSpacing", labelSpacing)
          }
          allowReset={true}
          resetFallbackValue={7}
          min={0}
          max={50}
          step={1}
        />
      </PanelBody>
    );
  };
  inheritTheme = () => {
    let { attributes, setAttributes } = this.props,
        isInheritTheme = attributes.isInheritTheme;
    return (
        <PanelBody title="Style" initialOpen={true}>
          <ToggleControl
              className="mrm-switcher-block"
              label="Inherit style from theme"
              checked={isInheritTheme}
              onChange={(state) => setAttributes({ isInheritTheme: state })}
          />
        </PanelBody>
    )
  }
  inputFieldStyle = () => {
    let { attributes, setAttributes } = this.props,
      inputTypography = attributes.inputTypography,
      device = attributes.device;

    return (
      <PanelBody title="Text Style" initialOpen={false}>

        <PanelBody title="Typography" className="inner--pannel" initialOpen={false}>
          <div className="mrm-block-typography">
            <Typography
              label={__("Enable Typography")}
              value={inputTypography}
              onChange={(value) => setAttributes({ inputTypography: value })}
              disableLineHeight
              device={device}
              onDeviceChange={(value) => setAttributes({ device: value })}
            />
          </div>

          <label className="blocks-base-control__label">Font Size</label>
          <RangeControl
            value={attributes.inputFontSize}
            onChange={(fontSize) =>
              this.onChangeAttribute("inputFontSize", fontSize)
            }
            allowReset={true}
            resetFallbackValue={1}
            min={0}
            max={40}
            step={1}
          />
				</PanelBody>

        <PanelBody title="Color" className="inner--pannel" initialOpen={false}>
          <label className="blocks-base-control__label">Text Color</label>
          <ColorPalette
            onChange={(inputTextColor) =>
              this.onChangeAttribute("inputTextColor", inputTextColor)
            }
            value={attributes.inputTextColor}
          />

          <hr className="mrm-hr" />

          <label className="blocks-base-control__label">Background Color</label>
          <ColorPalette
            onChange={(inputBgColor) =>
              this.onChangeAttribute("inputBgColor", inputBgColor)
            }
            value={attributes.inputBgColor}
          />
				</PanelBody>


        <PanelBody title="Border" className="inner--pannel" initialOpen={false}>
          <label className="blocks-base-control__label">Border Radius</label>
          <RangeControl
            value={attributes.inputBorderRadius}
            onChange={(radius) =>
              this.onChangeAttribute("inputBorderRadius", radius)
            }
            allowReset={true}
            resetFallbackValue={5}
            min={0}
            max={100}
            step={1}
          />

          <label className="blocks-base-control__label">Border Style</label>
          <SelectControl
            value={attributes.inputBorderStyle}
            onChange={(inputBorderStyle) =>
              this.onChangeAttribute("inputBorderStyle", inputBorderStyle)
            }
            options={[
              {
                value: "none",
                label: "None",
              },
              {
                value: "solid",
                label: "Solid",
              },
              {
                value: "dashed",
                label: "Dashed",
              },
              {
                value: "dotted",
                label: "Dotted",
              },
              {
                value: "double",
                label: "Double",
              },
            ]}
          />

          <label className="blocks-base-control__label">Border Width</label>
          <RangeControl
            value={attributes.inputBorderWidth}
            onChange={(border) =>
              this.onChangeAttribute("inputBorderWidth", border)
            }
            allowReset={true}
            resetFallbackValue={1}
            min={0}
            max={5}
            step={1}
          />

          <label className="blocks-base-control__label">Border Color</label>
          <ColorPalette
            onChange={(inputBorderColor) =>
              this.onChangeAttribute("inputBorderColor", inputBorderColor)
            }
            value={attributes.inputBorderColor}
          />
				</PanelBody>

        <PanelBody title="Padding" className="inner--pannel" initialOpen={false}>
          <RangeControl
            label={__("Padding Top", "mrm")}
            value={attributes.inputPaddingTop}
            onChange={(input_padding_top) =>
              setAttributes({ inputPaddingTop: input_padding_top })
            }
            allowReset={true}
            resetFallbackValue={15}
            min={0}
            max={20}
            step={1}
          />

          <RangeControl
            label={__("Padding Right", "mrm")}
            value={attributes.inputPaddingRight}
            onChange={(input_padding_right) =>
              setAttributes({ inputPaddingRight: input_padding_right })
            }
            allowReset={true}
            resetFallbackValue={15}
            min={0}
            max={20}
            step={1}
          />

          <RangeControl
            label={__("Padding Bottom", "mrm")}
            value={attributes.inputPaddingBottom}
            onChange={(input_padding_bottom) =>
              setAttributes({ inputPaddingBottom: input_padding_bottom })
            }
            allowReset={true}
            resetFallbackValue={15}
            min={0}
            max={20}
            step={1}
          />

          <RangeControl
            label={__("Padding Left", "mrm")}
            value={attributes.inputPaddingLeft}
            onChange={(input_padding_left) =>
              setAttributes({ inputPaddingLeft: input_padding_left })
            }
            allowReset={true}
            resetFallbackValue={15}
            min={0}
            max={20}
            step={1}
          />

				</PanelBody>

        <RangeControl
          label={__("Width (%)", "mrm")}
          value={attributes.inputWidth}
          onChange={(input_width) =>
            setAttributes({ inputWidth: input_width })
          }
          allowReset={true}
          resetFallbackValue={'none'}
          min={0}
          max={100}
          step={1}
        />

        <RangeControl
          label={__("Max Width (px)", "mrm")}
          value={attributes.inputMaxWidth}
          onChange={(input_max_width) =>
            setAttributes({ inputMaxWidth: input_max_width })
          }
          allowReset={true}
          resetFallbackValue={'none'}
          min={0}
          max={1000}
          step={1}
        />
      </PanelBody>
    );
  };

  getInspectorControls = () => {
    let { attributes } = this.props,
        isInheritTheme = attributes.isInheritTheme;
    return (
      <InspectorControls key="mrm-mrm-form-inspector-controls">
        <div
          id="mrm-block-inspected-inspector-control-wrapper"
          className="mrm-block-control-wrapper"
        >
          <Panel>
            {this.formFields()}
            {this.inheritTheme()}
            {/*{!isInheritTheme && this.formStyle()}*/}
            {!isInheritTheme && this.inputFieldStyle()}
          </Panel>
        </div>
      </InspectorControls>
    );
  };

  render() {
    const {
      attributes: {
        privacyPolicyLabel,
        emailPlaceholder,
        requiredMark,
        inputAlignment,
        inputWidth,
        inputMaxWidth,
        inputBgColor,
        inputFontSize,
        inputTextColor,
        inputBorderRadius,
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
        typography,
        inputTypography,
        labelTypography,
        isInheritTheme,
        className,
        buttonAlign,
        onlyNotice
      },
    } = this.props;

    let fieldSpacing = {
      marginBottom: rowSpacing + "px ",
      width: inputWidth + "% ",
      maxWidth: inputMaxWidth + "px ",
    };
	  if( undefined === inputMaxWidth ){
		  delete fieldSpacing.maxWidth;
	  }
	  if( undefined === inputWidth ){
		  delete fieldSpacing.width;
	  }

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
      backgroundColor: inputBgColor,
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
        this.props.className
        )
    // display the map selector

    return (
      <>
        {this.getInspectorControls()}

        <div className={classNames}  style={fieldSpacing}>
          <div className={`input-wrapper checkbox-input-wrapper mrm-checkbox-group ${isInheritTheme? 'theme-checkbox' : 'custom-checkbox'}`}>
             {!onlyNotice ?
             <input
              type="checkbox"
              name="privacy_policy"
              id="mrm-privacy-policy-input"
              required
            /> :
            null
            }
            <label htmlFor="" className="mrm-privacy-policy-input-label">
              <RichText
                  className="mrm-privacy-policy"
                  tagName="p"
                  type="p"
                  value={privacyPolicyLabel}
                  style={inputStyle}
                  onChange={(content) =>
                      this.props.setAttributes({ privacyPolicyLabel: content })
                  }
              />
              <span className="required-mark">*</span>
            </label>
          </div>
        </div>
      </>
    );
  }
}

export default compose([])(Editor);
