/// <reference types="applepayjs" />

import { API } from '@/api';
import { Alert } from '@mui/material';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import './ApplePayButton.css';

type ApplePayButtonProps = {
  amount: number;
  orderId: string;
  onError: (message: string) => void;
  onPaymentAuthorized: () => void;
};

type ApplePayAuthorizationResponse = {
  success: boolean;
  message?: string;
};

type ApplePayMerchantSession = Record<string, unknown>;

type ApplePayErrorBoundaryState = {
  hasError: boolean;
};

class ApplePayErrorBoundary extends Component<
  { children: ReactNode },
  ApplePayErrorBoundaryState
> {
  state: ApplePayErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ApplePayErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Apple Pay UI error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error">
          Apple Pay could not be initialized. Please use another payment method.
        </Alert>
      );
    }

    return this.props.children;
  }
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error
  ) {
    if (typeof error.message === 'string') {
      return error.message;
    }
    if (
      Array.isArray(error.message) &&
      error.message.every(message => typeof message === 'string')
    ) {
      return error.message.join('; ');
    }
  }
  return 'Apple Pay payment failed.';
};

function ApplePayButtonContent({
  amount,
  orderId,
  onError,
  onPaymentAuthorized,
}: ApplePayButtonProps) {
  const isHttpsPage =
    typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isAvailable =
    isHttpsPage &&
    typeof ApplePaySession !== 'undefined' &&
    ApplePaySession.canMakePayments();

  const handleClick = () => {
    if (!isHttpsPage) {
      onError(
        'Apple Pay requires an HTTPS URL. Localhost over HTTP is not supported for this payment session.'
      );
      return;
    }

    if (!isAvailable) {
      onError('Apple Pay is not available in this browser or device.');
      return;
    }

    try {
      const session = new ApplePaySession(3, {
        countryCode: 'UA',
        currencyCode: 'UAH',
        supportedNetworks: ['visa', 'masterCard'],
        merchantCapabilities: ['supports3DS'],
        total: {
          label: 'Flower Store',
          amount: amount.toFixed(2),
          type: 'final',
        },
      });

      session.onvalidatemerchant = async (event) => {
        try {
          const merchantSession = await API.post<ApplePayMerchantSession>(
            'payments/apple-pay/test/merchant-session',
            { validationURL: event.validationURL }
          );
          session.completeMerchantValidation(merchantSession);
        } catch (error: unknown) {
          session.abort();
          onError(getErrorMessage(error));
        }
      };

      session.onpaymentauthorized = async (event) => {
        try {
          const result = await API.post<ApplePayAuthorizationResponse>(
            'payments/apple-pay/test/authorize',
            {
              orderId,
              paymentToken: event.payment.token,
            }
          );

          if (!result.success) {
            session.completePayment(ApplePaySession.STATUS_FAILURE);
            onError(
              result.message ?? 'Apple Pay payment was not authorized.'
            );
            return;
          }

          session.completePayment(ApplePaySession.STATUS_SUCCESS);
          onPaymentAuthorized();
        } catch (error: unknown) {
          session.completePayment(ApplePaySession.STATUS_FAILURE);
          onError(getErrorMessage(error));
        }
      };

      session.begin();
    } catch (error: unknown) {
      onError(getErrorMessage(error));
    }
  };

  if (!isHttpsPage) {
    return (
      <p role="status">
        Apple Pay requires an HTTPS URL. Use an HTTPS tunnel or a configured
        local HTTPS server to test it.
      </p>
    );
  }

  if (!isAvailable) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="apple-pay-button-with-text apple-pay-button-black-with-text"
      aria-label="Pay with Apple Pay"
    >
      <span className="text">Pay with</span>
      <span className="logo" />
    </button>
  );
}

export function ApplePayButton(props: ApplePayButtonProps) {
  return (
    <ApplePayErrorBoundary>
      <ApplePayButtonContent {...props} />
    </ApplePayErrorBoundary>
  );
}
