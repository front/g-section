/* eslint react/jsx-key: 0 */

/**
 * External dependencies
 */
import React from 'react';
import { element, i18n, components, editor } from 'wp';

/**
 * Internal dependencies
 */
import './style.scss';

const { Fragment } = element;
const { __ } = i18n;
const { PanelBody, BaseControl, RangeControl, IconButton, Toolbar, SelectControl } = components;
const { InnerBlocks, InspectorControls, PanelColorSettings, MediaUpload, BlockControls } = editor;


const blockAttributes = {
  backgroundType: {
    type: 'string',
    default: 'color',
  },
  backgroundColor: {
    type: 'string',
  },
  backgroundImage: {
    type: 'string',
    default: 'https://placeimg.com/1200/600/nature/grayscale',
  },
  backgroundImageData:{
    type: 'object',
    default: {},
  },
  overlayOpacity: {
    type: 'number',
    default: 40,
  },
  contentWidth: {
    type: 'number',
  },
  padding: {
    type: 'number',
    default: 50,
  },
  margin: {
    type: 'number',
    default: 0,
  },
};

export const name = 'g-section';

export const settings = {
  title: __('Section'),
  description: __('A customizable section block.'),
  icon: 'cover-image',

  attributes: blockAttributes,

  edit ({ attributes, className, setAttributes }) {
    const {
      backgroundType, backgroundColor, backgroundImage, backgroundImageData,
      overlayOpacity, contentWidth, margin, padding,
    } = attributes;

    const containerStyle = {
      backgroundColor: backgroundType === 'color' ? backgroundColor : 'black',
      backgroundImage: backgroundType === 'image' && `url('${backgroundImage}')`,
      color: backgroundType === 'image' && 'white',
      paddingTop: padding && `${padding}px`,
      paddingBottom: padding && `${padding}px`,
      marginTop: margin && `${margin}px`,
      marginBottom: margin && `${margin}px`,
    };
    const overlayStyle = backgroundType === 'color' ? {} : {
      display: 'block',
      opacity: parseInt(overlayOpacity, 10) / 100,
    };
    const wrapperStyle = {
      maxWidth: contentWidth && `${contentWidth}px`,
    };

    const onSelectImage = (media, field) => {
      const dataAttrs = {};

      if (media.data) {
        dataAttrs[`${field}Data`] = Object.keys(media.data)
        .reduce((result, key) => {
          result[`data-${key.replace('_', '-')}`] = media.data[key];
          return result;
        }, {});
      }

      setAttributes({
        [field]: media.url,
        ...dataAttrs,
      });
    };

    return (
      <Fragment>
        <div className={ className } style={ containerStyle } { ...backgroundImageData }>
          <div className="g-section-overlay" style={ overlayStyle }></div>
          <div className="g-section-wrapper" style={ wrapperStyle }>
            <InnerBlocks template={ [] } templateLock={ false } />
          </div>
        </div>

        { backgroundType === 'image' && <BlockControls>
          <Toolbar>
            <MediaUpload type="image"
              onSelect={ media => onSelectImage(media, 'backgroundImage') } render={ ({ open }) => (
                <IconButton className="components-toolbar__control" label={ __('Edit image') }
                  icon="edit" onClick={ open } />
              ) }
            />
          </Toolbar>
        </BlockControls> }

        <InspectorControls>
          <PanelBody title={ __('Block Settings') }>
            <BaseControl label={ __('Content Width in pixels') } id="block-hero-section-content-width-input">
              <input
                type="number"
                id="block-hero-section-content-width-input"
                value={ contentWidth }
                onChange={ ev => setAttributes({ contentWidth: parseInt(ev.target.value, 10) || undefined }) }
                step="10"
                placeholder="Full width"
              />
            </BaseControl>

            {/* Margin and Padding */}
            <SelectControl
              label={ __('Margin') }
              value={ margin }
              options={ [{
                label: __('None'), value: 0,
              }, {
                label: __('Small'), value: 25,
              }, {
                label: __('Medium'), value: 75,
              }, {
                label: __('Large'), value: 125,
              }] }
              onChange={ value => setAttributes({ margin: parseInt(value, 10) }) }
            />
            <SelectControl
              label={ __('Padding') }
              value={ padding }
              options={ [{
                label: __('None'), value: 0,
              }, {
                label: __('Small'), value: 25,
              }, {
                label: __('Medium'), value: 75,
              }, {
                label: __('Large'), value: 125,
              }] }
              onChange={ value => setAttributes({ padding: parseInt(value, 10) }) }
            />

            {/* Background control */}
            <SelectControl
              label={ __('Background Type') }
              value={ backgroundType }
              options={ [{
                label: __('Solid Color'), value: 'color',
              }, {
                label: __('Image'), value: 'image',
              }] }
              onChange={ value => setAttributes({ backgroundType: value }) }
            />

            { backgroundType === 'image' &&
              <RangeControl
                label={ __('Overlay Opacity') } value={ overlayOpacity }
                onChange={ value => setAttributes({ overlayOpacity: value }) }
                min={ 0 } max={ 100 } step={ 5 }
              /> }
          </PanelBody>

          { backgroundType !== 'image' && <PanelColorSettings
            title={ __('Color Settings') }
            initialOpen={ true }
            colorSettings={ [{
              value: backgroundColor,
              onChange: value => setAttributes({ backgroundColor: value }),
              label: __('Background Color'),
            }] }></PanelColorSettings>
          }
        </InspectorControls>
      </Fragment>
    );
  },

  save ({ attributes, className }) {
    const {
      backgroundType, backgroundColor, backgroundImage, backgroundImageData,
      overlayOpacity, contentWidth, margin, padding,
    } = attributes;

    const containerStyle = {
      backgroundColor: backgroundType === 'color' ? backgroundColor : 'black',
      backgroundImage: backgroundType === 'image' && `url('${backgroundImage}')`,
      color: backgroundType === 'image' && 'white',
      paddingTop: padding && `${padding}px`,
      paddingBottom: padding && `${padding}px`,
      marginTop: margin && `${margin}px`,
      marginBottom: margin && `${margin}px`,
    };
    const overlayStyle = backgroundType === 'color' ? {} : {
      display: 'block',
      opacity: parseInt(overlayOpacity, 10) / 100,
    };
    const wrapperStyle = {
      maxWidth: contentWidth && `${contentWidth}px`,
    };

    return (
      <div className={ className } style={ containerStyle } { ...backgroundImageData }>
        <div className="g-section-overlay" style={ overlayStyle }></div>
        <div className="g-section-wrapper" style={ wrapperStyle }>
          <InnerBlocks.Content />
        </div>
      </div>
    );
  },
};
