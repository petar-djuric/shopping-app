import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: Pusher;
    Echo: Echo;
  }
}

window.Pusher = require('pusher-js');

export function createSocketConnection(accessToken: string) {

  if (!window.Echo) {
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.REACT_APP_PUSHER_PUBLIC_KEY,
        wsHost: process.env.REACT_APP_WEBSOCKET_HOST,
        wsPort: process.env.REACT_APP_WEBSOCKET_PORT,
        forceTLS: false,
        disableStats: true,
        authorizer: (channel: any, options: any) => {
            return {
                authorize: (socketId: string, callback: any) => {
                    axios.post(process.env.REACT_APP_API_BACKEND_URL + '/broadcasting/auth', {
                        // eslint-disable-next-line camelcase
                        socket_id: socketId,
                        // eslint-disable-next-line camelcase
                        channel_name: channel.name
                    }, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    },)
                        .then(response => {
                            callback(false, response.data);
                        })
                        .catch(error => {
                            callback(true, error);
                        });
                }
            };
        },
    });
  }
}
