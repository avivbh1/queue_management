import React, { useEffect } from 'react';

const AlertComponent = () => {
  useEffect(() => {
    // Request permission for notifications
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        // Create a new notification
        const notification = new Notification('Alert', {
          body: 'This is an alert!',
        });

        // Handle click event on the notification
        notification.onclick = () => {
          console.log('Notification clicked!');
        };
      }
    });
  }, []);

  return <div>Alert Component</div>;
};

export default AlertComponent;