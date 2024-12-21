const MessageConstants = {
  EMAIL_IS_NOT_REGISTERED: {
    message: 'Email does not belong to any account',
    code: 'EMAIL_IS_NOT_REGISTERED',
  },

  EMAIL_IS_NOT_FOUND: {
    message: 'Email is not found',
    code: 'EMAIL_IS_NOT_FOUND',
  },

  EMAIL_OR_PASSWORD_IS_INCORRECT: {
    message: 'Email or password is incorrect',
    code: 'EMAIL_OR_PASSWORD_IS_INCORRECT',
  },

  TOKEN_EXPIRED: {
    message: 'Token is expired',
    code: 'TOKEN_EXPIRED',
  },
  TOKEN_INVALID: {
    message: 'Token is invalid',
    code: 'TOKEN_INVALID',
  },

  OTP_INVALID: {
    message: 'OTP is invalid',
    code: 'OTP_INVALID',
  },
  OTP_EXPIRED: {
    message: 'OTP is expired',
    code: 'OTP_EXPIRED',
  },

  OLD_PASSWORD_WRONG: {
    message: 'Old password is wrong',
    code: 'OLD_PASSWORD_WRONG',
  },

  CART_NOT_FOUND: {
    message: 'Cart not found',
    code: 'CART_NOT_FOUND',
  },

  POSITIVE_QUANTITY_CART: {
    message: 'Quantity must be a integet greater than 0',
    code: 'POSITIVE_QUANTITY_CART',
  },

  NO_PRODUCT_IN_CART: {
    message: 'There is no product with this ID in your cart',
    code: 'NO_PRODUCT_IN_CART',
  },

  QUANTITY_IS_EXCEED_ALLOWED_QUANTITY: {
    message: 'The quantity you entered exceeds the current quantity in your cart',
    code: 'QUANTITY_IS_EXCEED_ALLOWED_QUANTITY',
  },
};
export default MessageConstants;
