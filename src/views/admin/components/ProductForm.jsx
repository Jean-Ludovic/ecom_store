/* eslint-disable jsx-a11y/label-has-associated-control */
import { CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import { ImageLoader } from '@/components/common';
import {
  CustomColorInput, CustomCreatableSelect, CustomInput, CustomTextarea
} from '@/components/formik';
import {
  Field, FieldArray, Form, Formik
} from 'formik';
import { useFileHandler } from '@/hooks';
import PropType from 'prop-types';
import React from 'react';
import * as Yup from 'yup';

// Default brand names that I used. You can use what you want
const brandOptions = [
  { value: 'BMW', label: 'BMW' },
  { value: 'MERCEDES', label: 'MERCEDES' },
  { value: 'FERRARI', label: 'FERRARI' },
  { value: 'LAMBORGHINI', label: 'LAMBORGHINI' },
  { value: 'CHEVROLET', label: 'CHEVROLET' }
];

// ex : tailles de jantes
const sizeOptions = [
  { value: 17, label: '17"' },
  { value: 18, label: '18"' },
  { value: 19, label: '19"' },
  { value: 20, label: '20"' }
];

// éventuellement pour les mots-clés aussi :
const keywordOptions = [
  { value: 'sport', label: 'Sport' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' }
];

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .required('Product name is required.')
    .max(60, 'Product name must only be less than 60 characters.'),
  brand: Yup.string()
    .required('Brand name is required.'),
  price: Yup.number()
    .positive('Price is invalid.')
    .integer('Price should be an integer.')
    .required('Price is required.'),
  description: Yup.string()
    .required('Description is required.'),
  maxQuantity: Yup.number()
    .positive('Max quantity is invalid.')
    .integer('Max quantity should be an integer.')
    .required('Max quantity is required.'),
  keywords: Yup.array()
    .of(Yup.string())
    .min(1, 'Please enter at least 1 keyword for this product.'),
  sizes: Yup.array()
    .of(Yup.number())
    .min(1, 'Please enter a size for this product.'),
  isFeatured: Yup.boolean(),
  isRecommended: Yup.boolean(),
  availableColors: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Please add a default color for this product.'),

  // Thumbnail URL : vide accepté, sinon URL valide
  imageUrl: Yup.string()
    .transform((value, originalValue) =>
      originalValue === '' ? null : value
    )
    .nullable()
    .url('Image URL is invalid.'),

  // URLs de collection : vide accepté, sinon URL valide
  extraImageUrls: Yup.array()
    .of(
      Yup.string()
        .transform((value, originalValue) =>
          originalValue === '' ? null : value
        )
        .nullable()
        .url('Collection image URL is invalid.')
    )
    .nullable()
});

const ProductForm = ({ product, onSubmit, isLoading }) => {
  const initFormikValues = {
    name: product?.name || '',
    brand: product?.brand || '',
    price: product?.price || 0,
    maxQuantity: product?.maxQuantity || 0,
    description: product?.description || '',
    keywords: product?.keywords || [],
    sizes: product?.sizes || [],
    isFeatured: product?.isFeatured || false,
    isRecommended: product?.isRecommended || false,
    availableColors: product?.availableColors || [],
    imageUrl: product?.imageUrl || product?.image || '',
    extraImageUrls: [] // important pour FieldArray
  };

  const {
    imageFile,
    isFileLoading,
    onFileChange,
    removeImage
  } = useFileHandler({ image: {}, imageCollection: product?.imageCollection || [] });

  const onSubmitForm = (form) => {
    const isEditing = Boolean(product && (product.image || product.imageUrl));

    // -------- THUMBNAIL / MAIN IMAGE --------
    const finalImage =
      imageFile?.image?.file
      || form.imageUrl
      || product?.image
      || product?.imageUrl
      || '';

    if (!finalImage && !isEditing) {
      // eslint-disable-next-line no-alert
      alert('Product thumbnail image is required (file or URL).');
      return;
    }

    // -------- IMAGE COLLECTION --------
    // 1) Fichiers uploadés via useFileHandler
    const fileCollection = imageFile.imageCollection || [];

    // 2) URLs saisies dans le formulaire
    const urlCollection = (form.extraImageUrls || [])
      .filter((u) => u && u.trim() !== '')
      .map((url, index) => ({
        id: `url-${index}-${Date.now()}`,
        url
      }));

    const finalImageCollection = [
      ...fileCollection,
      ...urlCollection
    ];

    onSubmit({
      ...form,
      quantity: 1,
      name_lower: form.name.toLowerCase(),
      dateAdded: new Date().getTime(),
      image: finalImage,
      imageCollection: finalImageCollection
    });
  };

  return (
    <div>
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validationSchema={FormSchema}
        onSubmit={onSubmitForm}
      >
        {({ values, setValues }) => (
          <Form className="product-form">
            <div className="product-form-inputs">
              <div className="d-flex">
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="name"
                    type="text"
                    label="* Product Name"
                    placeholder="Gago"
                    style={{ textTransform: 'capitalize' }}
                    component={CustomInput}
                  />
                </div>
                &nbsp;
                <div className="product-form-field">
                  <CustomCreatableSelect
                    defaultValue={{ label: values.brand, value: values.brand }}
                    name="brand"
                    iid="brand"
                    options={brandOptions}
                    disabled={isLoading}
                    placeholder="Select/Create Brand"
                    label="* Brand"
                  />
                </div>
              </div>

              <div className="product-form-field">
                <Field
                  disabled={isLoading}
                  name="description"
                  id="description"
                  rows={3}
                  label="* Product Description"
                  component={CustomTextarea}
                />
              </div>

              <div className="d-flex">
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="price"
                    id="price"
                    type="number"
                    label="* Price"
                    component={CustomInput}
                  />
                </div>
                &nbsp;
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="maxQuantity"
                    type="number"
                    id="maxQuantity"
                    label="* Max Quantity"
                    component={CustomInput}
                  />
                </div>
              </div>

              <div className="d-flex">
                <div className="product-form-field">
                  <CustomCreatableSelect
                    defaultValue={values.keywords.map((key) => ({ value: key, label: key }))}
                    name="keywords"
                    iid="keywords"
                    isMulti
                    disabled={isLoading}
                    options={keywordOptions}
                    placeholder="Create/Select Keywords"
                    label="* Keywords"
                  />
                </div>
                &nbsp;
                <div className="product-form-field">
                  <CustomCreatableSelect
                    defaultValue={values.sizes.map((size) => ({ value: size, label: size }))}
                    name="sizes"
                    iid="sizes"
                    type="number"
                    isMulti
                    disabled={isLoading}
                    options={sizeOptions}
                    placeholder="Create/Select Sizes"
                    label="* Sizes (Millimeter)"
                  />
                </div>
              </div>

              {/* COLORS */}
              <div className="product-form-field">
                <FieldArray
                  name="availableColors"
                  disabled={isLoading}
                  component={CustomColorInput}
                />
              </div>

              {/* IMAGE COLLECTION URLS */}
              <div className="product-form-field">
                <span className="d-block padding-s">Image Collection URLs</span>
                <FieldArray
                  name="extraImageUrls"
                  render={(arrayHelpers) => (
                    <div>
                      {values.extraImageUrls && values.extraImageUrls.length > 0 && (
                        values.extraImageUrls.map((url, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center margin-b-s"
                          >
                            <Field
                              disabled={isLoading}
                              name={`extraImageUrls[${index}]`}
                              type="text"
                              placeholder="https://example.com/image.jpg"
                              component={CustomInput}
                              label={index === 0 ? 'Collection Image URL' : ''}
                            />
                            &nbsp;
                            <button
                              type="button"
                              className="button button-small"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      )}

                      <button
                        type="button"
                        className="button button-small"
                        onClick={() => arrayHelpers.push('')}
                        disabled={isLoading}
                      >
                        + Add URL
                      </button>
                    </div>
                  )}
                />
              </div>

              {/* IMAGE COLLECTION FILES */}
              <div className="product-form-field">
                <span className="d-block padding-s">Image Collection</span>
                {!isFileLoading && (
                  <label htmlFor="product-input-file-collection">
                    <input
                      disabled={isLoading}
                      hidden
                      id="product-input-file-collection"
                      multiple
                      onChange={(e) => onFileChange(e, { name: 'imageCollection', type: 'multiple' })}
                      readOnly={isLoading}
                      type="file"
                    />
                    Choose Images
                  </label>
                )}
              </div>

              <div className="product-form-collection">
                <>
                  {imageFile.imageCollection.length >= 1 && (
                    imageFile.imageCollection.map((image) => (
                      <div
                        className="product-form-collection-image"
                        key={image.id}
                      >
                        <ImageLoader
                          alt=""
                          src={image.url}
                        />
                        <button
                          className="product-form-delete-image"
                          onClick={() => removeImage({ id: image.id, name: 'imageCollection' })}
                          title="Delete Image"
                          type="button"
                        >
                          <i className="fa fa-times-circle" />
                        </button>
                      </div>
                    ))
                  )}
                </>
              </div>

              <br />

              <div className="d-flex">
                <div className="product-form-field">
                  <input
                    checked={values.isFeatured}
                    className=""
                    id="featured"
                    onChange={(e) => setValues({ ...values, isFeatured: e.target.checked })}
                    type="checkbox"
                  />
                  <label htmlFor="featured">
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; Add to Featured &nbsp;
                    </h5>
                  </label>
                </div>
                <div className="product-form-field">
                  <input
                    checked={values.isRecommended}
                    className=""
                    id="recommended"
                    onChange={(e) => setValues({ ...values, isRecommended: e.target.checked })}
                    type="checkbox"
                  />
                  <label htmlFor="recommended">
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; Add to Recommended &nbsp;
                    </h5>
                  </label>
                </div>
              </div>

              <br />
              <br />
              <br />

              <div className="product-form-field product-form-submit">
                <button
                  className="button"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? <LoadingOutlined /> : <CheckOutlined />}
                  &nbsp;
                  {isLoading ? 'Saving Product' : 'Save Product'}
                </button>
              </div>
            </div>

            {/* ---- THUMBNAIL ---- */}
            <div className="product-form-file">
              <div className="product-form-field">
                <span className="d-block padding-s">* Thumbnail</span>
                {!isFileLoading && (
                  <label htmlFor="product-input-file">
                    <input
                      disabled={isLoading}
                      hidden
                      id="product-input-file"
                      onChange={(e) => onFileChange(e, { name: 'image', type: 'single' })}
                      readOnly={isLoading}
                      type="file"
                    />
                    Choose Image
                  </label>
                )}
              </div>

              <div className="product-form-field">
                <Field
                  disabled={isLoading}
                  name="imageUrl"
                  type="text"
                  label="Or Image URL"
                  placeholder="https://example.com/image.jpg"
                  component={CustomInput}
                />
                <small>
                  You can either upload an image or provide an image URL.
                </small>
              </div>

              <div className="product-form-image-wrapper">
                {(imageFile.image.url
                  || values.imageUrl
                  || product.image
                  || product.imageUrl) && (
                  <ImageLoader
                    alt=""
                    className="product-form-image-preview"
                    src={
                      imageFile.image.url
                      || values.imageUrl
                      || product.image
                      || product.imageUrl
                    }
                  />
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

ProductForm.propTypes = {
  product: PropType.shape({
    name: PropType.string,
    brand: PropType.string,
    price: PropType.number,
    maxQuantity: PropType.number,
    description: PropType.string,
    keywords: PropType.arrayOf(PropType.string),
    imageCollection: PropType.arrayOf(PropType.object),
    sizes: PropType.arrayOf(PropType.oneOfType([PropType.string, PropType.number])),
    image: PropType.string,
    imageUrl: PropType.string,
    isFeatured: PropType.bool,
    isRecommended: PropType.bool,
    availableColors: PropType.arrayOf(PropType.string)
  }).isRequired,
  onSubmit: PropType.func.isRequired,
  isLoading: PropType.bool.isRequired
};

export default ProductForm;
