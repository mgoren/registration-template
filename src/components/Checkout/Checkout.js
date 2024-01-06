import { useState, useEffect } from "react";
import { push, ref, serverTimestamp } from "firebase/database";
import { renderToStaticMarkup } from 'react-dom/server';
import { scrollToTop, warnBeforeUserLeavesSite, fullName } from 'utils';
import db from 'firebase.js';
import PaypalCheckoutButton from 'components/PaypalCheckoutButton';
import Check from "components/Check";
import Loading from 'components/Loading';
import Receipt, { AdditionalPersonReceipt } from 'components/Receipt';
import TogglePaymentMode from 'components/TogglePaymentMode';
import ButtonRow from 'components/ButtonRow/index.js';
import { StyledPaper, Title } from 'components/Layout/SharedStyles';
import { Hidden } from '@mui/material';
import { MyMobileStepper } from 'components/MyStepper';
import StripeCheckoutWrapper from "components/StripeCheckoutWrapper";
import config from 'config';
const { PAYMENT_METHODS, EMAIL_CONTACT, NUM_PAGES } = config;

export default function Checkout({ order, setOrder, setError, setCurrentPage }) {
  const [paying, setPaying] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [processingMessage, setProcessingMessage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [paypalButtonsLoaded, setPaypalButtonsLoaded] = useState(false);

  useEffect(() => { scrollToTop() },[]);

  useEffect(() => {
    if (window.location.hostname !== 'localhost') {
      window.addEventListener('beforeunload', warnBeforeUserLeavesSite);
      return () => window.removeEventListener('beforeunload', warnBeforeUserLeavesSite);
    }
  }, []);

  const total = order.admissionCost * order.admissionQuantity + order.donation;

  const handleClickBackButton = () => {
    setError(null);
    setCurrentPage(NUM_PAGES);
  }

	const saveOrderToFirebase = async () => {
    try {
      setError(null);
      setProcessing('Saving registration...');
      setProcessing(true);

      const initialOrder = {
        ...order,
        people: order.people.slice(0, order.admissionQuantity).map(updateApartment),
        total,
        deposit: paymentMethod === 'check' ? 0 : total,
        timestamp: serverTimestamp()
      };
      const receipt = renderToStaticMarkup(<Receipt order={initialOrder} currentPage='confirmation' />);
      const additionalPersonReceipt = renderToStaticMarkup(<AdditionalPersonReceipt order={initialOrder} />);
      const initialOrderWithReceipt = { ...initialOrder, receipt, additionalPersonReceipt };
      setOrder(initialOrderWithReceipt);

      await push(ref(db, 'orders/'), initialOrderWithReceipt);
      console.log('initial order saved to firebase');
      setProcessingMessage('Processing payment...');
      return true;
    } catch (err) {
      console.err(`error saving order to firebase`, err);
      setError(`We encountered an error saving your information, so your payment was not processed. Please try again or contact ${EMAIL_CONTACT}.`);
      setPaying(false);
      setProcessing(false);
      return false;
    }
	};

  const updateOrderInFirebase = async ({ electronicPaymentId }) => {
    setProcessingMessage(electronicPaymentId === 'check' ? 'Updating registration...' : 'Payment successful. Updating registration...');
    setProcessing(true);

    // add electronicPaymentId to the right record in Firebase

    
    //   setError(paymentMethod === 'check' ? 
    //   `We encountered an issue recording your information: ${err}. Please contact ${EMAIL_CONTACT}.` 
    //   : `Your payment was processed successfully but we encountered an issue recording your information: ${err}. Please contact ${EMAIL_CONTACT}.`
    // );

    setPaying(false);
    setProcessing(false);
    setCurrentPage('confirmation');
  }

  return (
    <section>
      <StyledPaper align='center'>

        {processing && <Loading processing={true} text={processingMessage} />}

        {!processing &&
          <Title>Amount due: ${total}</Title>
        }

        {paymentMethod === 'stripe' &&
          <StripeCheckoutWrapper
            total={total}
            name={fullName(order.people[0])}
            email={order.people[0].email}
            setError={setError}
            processing={processing} setProcessing={setProcessing}
            saveOrderToFirebase={saveOrderToFirebase} updateOrderInFirebase={updateOrderInFirebase}
          />
        }

        {paymentMethod === 'paypal' &&
          <PaypalCheckoutButton 
            paypalButtonsLoaded={paypalButtonsLoaded} setPaypalButtonsLoaded={setPaypalButtonsLoaded}
            total={total} 
            setError={setError} 
            setPaying={setPaying} 
            processing={processing}
            saveOrderToFirebase={saveOrderToFirebase} updateOrderInFirebase={updateOrderInFirebase}
          />
        }

        {paymentMethod === 'check' && 
          <>
            <Check 
              processing={processing}
              saveOrderToFirebase={saveOrderToFirebase} updateOrderInFirebase={updateOrderInFirebase}
            />
          </>
        }

        {!paying && !processing && (paymentMethod === 'check' || paymentMethod === 'stripe' || paypalButtonsLoaded) &&
          <TogglePaymentMode paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} setError={setError} />
        }
      </StyledPaper>

      {!paying && !processing &&
        <>
          <Hidden smDown>
            <ButtonRow backButtonProps = {{ onClick: handleClickBackButton }} />
          </Hidden>

          <Hidden smUp>
            <MyMobileStepper currentPage={'checkout'} onClickBack={handleClickBackButton} />
          </Hidden>
        </>
      }
    </section>
  );
}

function updateApartment(person) {
  return (person.apartment && /^\d/.test(person.apartment)) ? { ...person, apartment: `#${person.apartment}` } : person;
}
