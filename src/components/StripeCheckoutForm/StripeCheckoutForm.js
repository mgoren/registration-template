import { useState, useEffect } from 'react';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import Loading from 'components/Loading';
import { Button } from '@mui/material';
import config from 'config';
const { EMAIL_CONTACT } = config;

export default function StripeCheckoutForm({ setError, processing, setProcessing, clientSecretRef, saveOrderToFirebase, updateOrderInFirebase }) {
  const [ready, setReady] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (stripe && elements) {
      setReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const isOrderSaved = await saveOrderToFirebase(); // initial order without payment info
    if (isOrderSaved) {
      processPayment();
    }
  };

  const processPayment = async () => {
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: "http://localhost:3000/error-contact-support", // not needed for cards or apple/google pay
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      // console.log(result.error.message);
      setProcessing(false);
      setError(`Stripe encountered an error: ${result.error.message}. Please try again or contact ${EMAIL_CONTACT}.`);
      // if they try again, will result in duplicate db/sheet entry tho! <-- TODO: fix this
    } else if (result.paymentIntent.status === 'succeeded') {
      // console.log('success', result);
      clientSecretRef.current = null;
      updateOrderInFirebase({ electronicPaymentId: result.paymentIntent.id });
    } else {
      // console.log('unexpected Stripe status', result);
      setProcessing(false);
      setError(`Stripe encountered an unexpected error: ${result.error.message}. Please contact ${EMAIL_CONTACT}.`);
      // will also likely redirect to return_url, which is just an error page in this case
    }
  };

  return (
    <>
      {ready &&
        <form onSubmit={handleSubmit}>
          <PaymentElement />
          <Button type='submit' variant='contained' color='success' disabled={!stripe || processing} sx={{ my: 2 }}>Register and submit payment</Button>
        </form>
      }
      {!ready &&
        <Loading isHeading={false} text='Loading payment options...' />
      }
    </>
  );
}
