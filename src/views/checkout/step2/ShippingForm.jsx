/* eslint-disable jsx-a11y/label-has-associated-control */
import { CustomInput } from '@/components/formik';
import { Field } from 'formik';
import React from 'react';

const ShippingForm = () => {
  return (
    <div className="checkout-shipping-wrapper">
      <div className="checkout-shipping-form">
        <div className="checkout-fieldset">
          <div className="d-block checkout-field">
            <Field
              name="fullname"
              type="text"
              label="* Full Name"
              placeholder="Enter your full name"
              component={CustomInput}
              style={{ textTransform: 'capitalize' }}
            />
          </div>
          <div className="d-block checkout-field">
            <Field
              name="email"
              type="email"
              label="* Email Address"
              placeholder="Enter your email address"
              component={CustomInput}
            />
          </div>
        </div>

        <div className="checkout-fieldset">
          <div className="d-block checkout-field">
            <Field
              name="address"
              type="text"
              label="* Shipping Address"
              placeholder="Enter full shipping address"
              component={CustomInput}
            />
          </div>

          {/* 👉 téléphone simple, comme un input normal */}
          <div className="d-block checkout-field">
            <Field
              name="mobile"
              type="text"
              label="* Mobile Number"
              placeholder="Enter your mobile number"
              component={CustomInput}
            />
          </div>
        </div>

        <div className="checkout-fieldset">
          <Field name="isInternational">
            {({ field, form, meta }) => (
              <div className="checkout-field">
                {meta.touched && meta.error ? (
                  <span className="label-input label-error">{meta.error}</span>
                ) : (
                  <label
                    className="label-input"
                    htmlFor={field.name}
                  >
                    Shipping Option
                  </label>
                )}
                <div className="checkout-checkbox-field">
                  <input
                    checked={field.value}
                    id={field.name}
                    onChange={(e) => {
                      form.setValues({ ...form.values, [field.name]: e.target.checked });
                    }}
                    value={meta.value}
                    type="checkbox"
                  />
                  <label className="d-flex w-100" htmlFor={field.name}>
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; International Shipping &nbsp;
                      <span className="text-subtle">7-14 days</span>
                    </h5>
                    <h4 className="margin-0">$50.00</h4>
                  </label>
                </div>
              </div>
            )}
          </Field>
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;
