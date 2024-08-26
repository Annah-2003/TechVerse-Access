import React, { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';

const backendUrl = 'http://localhost:8000/api';

const CheckoutForm = ({ eventId, accessToken }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPaymentProcessing(true);

    try {
      // Create payment intent
      const response = await axios.post(
        `${backendUrl}/payments/create_payment_intent/`,
        { event_id: eventId },
        {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        }
      );

      const clientSecret = response.data.client_secret;

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        console.log(result.error.message);
        alert('Payment failed');
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          alert('Payment successful!');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error processing payment');
    }

    setPaymentProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        type="submit"
        disabled={!stripe || paymentProcessing}
      >
        {paymentProcessing ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
};

export default CheckoutForm;
