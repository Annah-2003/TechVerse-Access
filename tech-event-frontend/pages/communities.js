import { useEffect, useState} from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/client';

const backendUrl = 'http://localhost:8000/api'

export default function Communities() {
    const [communities, setCommunities] = useState([])
    const [session ] = useSession();

    useEffect(() => {
        if (session) {
            axios
            .get(`${backendUrl}/communities`, {  headers: {
                Authorization: `Token ${session.accessToken}`,
              },
            })
            .then((response) => {
              setCommunities(response.data);
            });
        }
    }, [session]);
}