import './ApplePayButton.css'

const paymentRequest = {
    countryCode: "US",
    currencyCode: "USD",
    supportedNetworks: ["visa", "masterCard", "amex", "discover"],
    merchantCapabilities: ["supports3DS"],
    total: {
      label: "Your Store",
      amount: "10.00",
    },
  };

const handleMerchantValidation = async (event, session, onValidationFailed) => {
    try {
      const response = await fetch("/validate-apple-pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ validationURL: event.validationURL }),
      });
      const merchantSession = await response.json();
      session.completeMerchantValidation(merchantSession);
    } catch (error) {
      console.error("Merchant validation failed:", error);
      onValidationFailed();
    }
  };

const handlePaymentAuthorization = async (event, session, onPaymentAuthorized) => {
    try {
      const response = await fetch("/process-apple-pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: event.payment.token,
          amount: 1000, // Amount in cents
          currency: "USD",
        }),
      });
      const result = await response.json();
  
      if (result.success) {
        session.completePayment(ApplePaySession.STATUS_SUCCESS);
        onPaymentAuthorized();
      } else {
        session.completePayment(ApplePaySession.STATUS_FAILURE);
      }
    } catch (error) {
      console.error("Payment authorization failed:", error);
      session.completePayment(ApplePaySession.STATUS_FAILURE);
    }
  };

export const ApplePayButton = ({ onPaymentAuthorized, onValidationFailed }) => {
    const handleClick = () => {
      const session = new ApplePaySession(3, paymentRequest);
  
      session.onvalidatemerchant = (event) =>
        handleMerchantValidation(event, session, onValidationFailed);
  
      session.onpaymentauthorized = (event) =>
        handlePaymentAuthorization(event, session, onPaymentAuthorized);
  
      session.begin();
    };
  
    return (
      <button
        onClick={handleClick}
        className="apple-pay-button-with-text apple-pay-button-black-with-text"
      >
        <span className="text">Pay with</span>
        <span className="logo"></span>
      </button>
    );
  };