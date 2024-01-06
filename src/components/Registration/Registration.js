import { useState, useEffect } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import MainForm from "components/MainForm";
import Checkout from "components/Checkout";
import Confirmation from "components/Confirmation";
import Error from "components/Error";
import Header from 'components/Header';
import IntroHeader from 'components/Header/IntroHeader';
import OrderSummary from "components/OrderSummary";
import Receipt from "components/Receipt";
import { cache, cached } from 'utils';
import { Box, Checkbox } from "@mui/material";
import { StyledPaper, StyledLink, Paragraph } from 'components/Layout/SharedStyles';
import config from 'config';
const { PAYMENT_METHODS, PAYPAL_OPTIONS, ORDER_DEFAULTS, TITLE, CONFIRMATION_CHECK_TITLE, CONFIRMATION_PAYPAL_TITLE, SANDBOX_MODE, SHOW_PRE_REGISTRATION } = config;

export default function Registration() {
  const [registering, setRegistering] = useState(false);
  return (
    SHOW_PRE_REGISTRATION ? (
      registering ? <RealRegistration /> : <PreRegistration setRegistering={setRegistering} />
    ) : <RealRegistration />
  );
}

const PreRegistration = ({ setRegistering }) => {
  return(
    <StyledPaper>
      <p>Please read the Covid Policy and Safety Policy for the 2024 Corvallis Contra Dance Weekend:</p>
      <ul>
        <li><StyledLink to='https://corvallisfolklore.org/home/ccw-faq/#Covid'>Covid Policy</StyledLink> (will open in a new tab)</li>
        <li><StyledLink to='https://corvallisfolklore.org/home/dance-safety-policy/'>Safety Policy</StyledLink> (will open in a new tab)</li>
      </ul>

      <Paragraph sx={{ lineHeight: 2, mt: 4 }}>
        I acknowledge that I have read and agree to follow both the Covid Policy and the Safety Policy for the 2024 Corvallis Contra Dance Weekend. 
        If I am registering two people, I acknowledge that both have read and agreed to these policies.
        <Checkbox onChange={() => setRegistering(true)} />
      </Paragraph>
    </StyledPaper>
  );
}

const RealRegistration = () => {
  const [order, setOrder] = useState(cached('order') || ORDER_DEFAULTS);
  const [currentPage, setCurrentPage] = useState(cached('currentPage') || 1);
  const [error, setError] = useState(null);
  const CONFIRMATION_TITLE = order.electronicPaymentId === 'check' ? CONFIRMATION_CHECK_TITLE : CONFIRMATION_PAYPAL_TITLE;

  // useEffect(() => { logBuildDate() }, []);
  useEffect(() => { cache('order', order) }, [order]);
  useEffect(() => { cache('currentPage', currentPage) }, [currentPage]);

  const content = (
    <>
      {SANDBOX_MODE &&
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '3rem', backgroundColor: 'var(--color-error)' }}>
          TEST MODE ONLY - DO NOT USE FOR REAL REGISTRATION
        </Box>
      }

      {error && <Error error={error} />}

      <Header
        titleText={currentPage === 'confirmation' ? CONFIRMATION_TITLE : TITLE}
        currentPage={currentPage}
      >
        {currentPage === 1 && <IntroHeader />}
        {currentPage === 2 && <OrderSummary order={order} currentPage={currentPage} />}
        {currentPage === 3 && <OrderSummary order={order} currentPage={currentPage} />}
        {currentPage === 'checkout' && <OrderSummary order={order} currentPage={currentPage} />}
        {currentPage === 'confirmation' && <Receipt order={order} />}
      </Header>

      {isFinite(currentPage) &&
        <MainForm
          order={order} setOrder={setOrder}
          currentPage={currentPage} setCurrentPage={setCurrentPage}
        />
      }

      {currentPage === 'checkout' &&
        <Checkout
          order={order} setOrder={setOrder}
          setCurrentPage={setCurrentPage}
          setError={setError}
        />
      }

      {currentPage === 'confirmation' &&
        <Confirmation
          setOrder={setOrder}
          setCurrentPage={setCurrentPage}
        />
      }
    </>
  )

  return PAYMENT_METHODS.includes('paypal') ?
    <PayPalScriptProvider options={PAYPAL_OPTIONS}>
      {content}
    </PayPalScriptProvider>
  : content;
}
