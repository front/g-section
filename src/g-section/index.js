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
    default: '#eeeeee',
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
  overlayColor: {
    type: 'string',
  },
  padding: {
    type: 'number',
    default: 25,
  },
  margin: {
    type: 'number',
    default: 0,
  },
  align: {
    type: 'string',
    default: 'wide',
  },
};

export const name = 'g-section';

export const settings = {
  title: __('Section wrapper'),
  description: __('A customizable wrapper for your blocks.'),
  icon: 'cover-image',

  attributes: blockAttributes,

  edit ({ attributes, className, setAttributes }) {
    const {
      backgroundType, backgroundColor, backgroundImage, backgroundImageData,
      overlayOpacity, overlayColor, align, margin, padding,
    } = attributes;
    const hasImageBg = backgroundType === 'image';

    const containerStyle = {
      backgroundColor: !hasImageBg ? backgroundColor : 'black',
      backgroundImage: hasImageBg && `url('${backgroundImage}')`,
      color: hasImageBg && 'white',
      paddingTop: padding && `${padding}px`,
      paddingBottom: padding && `${padding}px`,
      marginTop: margin && `${margin}px`,
      marginBottom: margin && `${margin}px`,
    };

    const overlayStyle = !hasImageBg ? {} : {
      display: 'block',
      backgroundColor: overlayColor || 'black',
      opacity: parseInt(overlayOpacity, 10) / 100,
    };

    const classes = `${className} align${align}`;
    const buttonCls = { [align]: 'is-active' };

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
        <div className={ classes } style={ containerStyle } { ...backgroundImageData }>
          <div className="g-section-overlay" style={ overlayStyle }></div>
          <div className="g-section-wrapper">
            <InnerBlocks template={ [] } templateLock={ false } />
          </div>
        </div>

        <BlockControls>
          <Toolbar>
            <IconButton label={ __('Wide width') }  icon="align-wide"
              className={ `components-toolbar__control ${buttonCls.wide}` }
              onClick={ () => setAttributes({ align: 'wide' })} />
            <IconButton label={ __('Full width') } icon="align-full-width"
              className={ `components-toolbar__control ${buttonCls.full}` }
              onClick={ () => setAttributes({ align: 'full' }) } />
          </Toolbar>
        </BlockControls>

        <InspectorControls>
          <PanelBody title={ __('Block Settings') }>

            {/* Margin and Padding */}
            <SelectControl
              label={ __('Vertical margin') }
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
              label={ __('Vertical padding') }
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

            { hasImageBg &&
              <BaseControl label={ __('Choose background image') }>
                <MediaUpload type="image"
                  onSelect={ media => onSelectImage(media, 'backgroundImage') } render={ ({ open }) => (
                    <IconButton className="components-toolbar__control" label={ __('Edit image') }
                      icon="format-image" onClick={ open } />
                  )} />
              </BaseControl> }

            { hasImageBg &&
              <RangeControl
                label={ __('Overlay Opacity') } value={ overlayOpacity }
                onChange={ value => setAttributes({ overlayOpacity: value }) }
                min={ 0 } max={ 100 } step={ 5 }
              /> }
          </PanelBody>

          <PanelColorSettings
            title={ __('Color Settings') }
            initialOpen={ !hasImageBg }
            colorSettings={[ !hasImageBg ? {
              value: backgroundColor,
              onChange: value => setAttributes({ backgroundColor: value }),
              label: __('Background Color'),
            } : {
              value: overlayColor,
              onChange: value => setAttributes({ overlayColor: value }),
              label: __('Overlay Color'),
            } ]} />
        </InspectorControls>
      </Fragment>
    );
  },

  save ({ attributes, className }) {
    const {
      backgroundType, backgroundColor, backgroundImage, backgroundImageData,
      overlayOpacity, overlayColor, align, margin, padding,
    } = attributes;
    const hasImageBg = backgroundType === 'image';

    const containerStyle = {
      backgroundColor: !hasImageBg ? backgroundColor : 'black',
      backgroundImage: hasImageBg && `url('${backgroundImage}')`,
      color: backgroundType === 'image' && 'white',
      paddingTop: padding && `${padding}px`,
      paddingBottom: padding && `${padding}px`,
      marginTop: margin && `${margin}px`,
      marginBottom: margin && `${margin}px`,
    };
    const overlayStyle = !hasImageBg ? {} : {
      display: 'block',
      backgroundColor: overlayColor || 'black',
      opacity: parseInt(overlayOpacity, 10) / 100,
    };
    const classes = `${className} align${align}`;

    return (
      <div className={ classes } style={ containerStyle } { ...backgroundImageData }>
        <div className="g-section-overlay" style={ overlayStyle }></div>
        <div className="g-section-wrapper">
          <InnerBlocks.Content />
        </div>
      </div>
    );
  },
};
