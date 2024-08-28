import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
} from '@stripe/react-stripe-js';
import CheckoutForm from '../../components/CheckoutForm';

const stripePromise = loadStripe('your_stripe_public_key');

const backendUrl = 'http://localhost:8000/api';

export default function EventDetail() {
  const [session] = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (session && id) {
      axios
        .get(`${backendUrl}/events/${id}/`, {
          headers: {
            Authorization: `Token ${session.accessToken}`,
          },
        })
        .then((response) => {
          setEvent(response.data);
        });
    }
  }, [session, id]);

  if (!session) {
    return <div>Please login to view this event.</div>;
  }

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>
      <p>Price: ${event.price}</p>
      <Elements stripe={stripePromise}>
        <CheckoutForm
          eventId={event.id}
          accessToken={session.accessToken}
        />
      </Elements>
    </div>
  );
}
