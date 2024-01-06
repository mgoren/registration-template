import { useState } from 'react';
import Reaptcha from 'reaptcha';
import { Typography, Box, Button } from '@mui/material';
import config from 'config';
const { CAPTCHA_KEY, CHECK_ADDRESS, CHECK_TO } = config;

export default function Check({ saveOrderToFirebase, updateOrderInFirebase, processing }) {
  const [verified, setVerified] = useState(false);

  const handleRegister = async () => {
    const isOrderSaved = await saveOrderToFirebase(); // initial order without payment info
    if (isOrderSaved) {
      await updateOrderInFirebase({ electronicPaymentId: 'check' });
    }
  }

  return (
    <section>
      {!processing &&
        <>
          <Typography sx={{ mt: 2 }}>
            Make your check out to {CHECK_TO}<br />
            Write your name in the memo area, and mail to:
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <span dangerouslySetInnerHTML={{ __html: CHECK_ADDRESS }}></span>
          </Typography>

          <Box sx={{ my: 3 }}>
            <Reaptcha
              sitekey={CAPTCHA_KEY}
              onVerify={() => setVerified(true)}
              onExpire={() => setVerified(false)}
            />
          </Box>

          <Button variant='contained' color='success' disabled={!verified} onClick={handleRegister} sx={{ mb: 2 }}>
            Register and agree to send a check
          </Button>
        </>
      }
    </section>
  );
}
