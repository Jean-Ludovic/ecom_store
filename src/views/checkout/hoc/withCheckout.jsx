/* eslint-disable no-nested-ternary */
import { SIGNIN } from '@/constants/routes';
import { calculateTotal } from '@/helpers/utils';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

const withCheckout = (Component) =>
  withRouter((props) => {
    const state = useSelector((store) => ({
      isAuth: !!store.auth.id && !!store.auth.role,
      basket: store.basket || [],
      shipping: store.checkout?.shipping || {},
      payment: store.checkout?.payment || {},
      profile: store.profile || {}
    }));

    // sécuriser le shipping
    const isInternational = !!state.shipping?.isInternational;
    const shippingFee = isInternational ? 50 : 0;

    // sécuriser le panier
    const basketArray = Array.isArray(state.basket) ? state.basket : [];
    const subtotal = calculateTotal(
      basketArray.map((product) =>
        Number(product.price || 0) * Number(product.quantity || 0)
      )
    ) || 0;

    // gardes
    if (!state.isAuth) {
      return <Redirect to={SIGNIN} />;
    }

    if (!basketArray.length) {
      return <Redirect to="/" />;
    }

    const finalSubtotal = Number(subtotal + shippingFee) || 0;

    return (
      <Component
        {...props}
        basket={basketArray}
        payment={state.payment}
        profile={state.profile}
        shipping={state.shipping}
        subtotal={finalSubtotal}
      />
    );
  });

export default withCheckout;
