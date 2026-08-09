import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext(null);

// Initial default registered events for demo/instant user preview if empty
const DEMO_REGISTERED_EVENTS = [
  {
    id: 'reg-dd-2026',
    ticket_id: 'DD-AURA-88412',
    event_id: 'evt-diljit-aura-mumbai',
    status: 'registered',
    registered_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    reminder_days: 3,
    events: {
      id: 'evt-diljit-aura-mumbai',
      title: 'Diljit Dosanjh AURA Mumbai Stadium Night',
      category: 'AURA World Tour',
      event_date: '2026-08-30',
      event_time: '18:30:00',
      location: 'DY Patil Stadium, Navi Mumbai',
      image_url: '/images/singer_concert_1.jpg',
    },
  },
  {
    id: 'reg-dd-2026-2',
    ticket_id: 'DD-AURA-10492',
    event_id: 'evt-diljit-aura-delhi',
    status: 'registered',
    registered_at: new Date(Date.now() - 86400000).toISOString(),
    reminder_days: 1,
    events: {
      id: 'evt-diljit-aura-delhi',
      title: 'Diljit Dosanjh AURA Delhi Crown Show',
      category: 'AURA World Tour',
      event_date: '2026-09-12',
      event_time: '19:00:00',
      location: 'Jawaharlal Nehru Stadium, New Delhi',
      image_url: '/images/singer_concert_2.jpg',
    },
  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [permission, setPermission] = useState('default');
  const [toastMessage, setToastMessage] = useState(null);

  // Load initial saved data from localStorage
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    
    const savedNotifications = localStorage.getItem('entertainmenthq_notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter((n) => !n.read).length);
    } else {
      // Default welcome & reminder notification
      const defaultNotifs = [
        {
          id: 101,
          type: 'event_reminder',
          title: '⏰ Reminder: Diljit Dosanjh AURA Mumbai is approaching',
          message: 'Your Mumbai spotlight pass is active. The concert goes live soon at DY Patil Stadium.',
          eventId: 'evt-diljit-aura-mumbai',
          read: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 102,
          type: 'event_registration',
          title: '✅ Registration Confirmed: Diljit Dosanjh AURA Delhi',
          message: 'You have registered for the Delhi show. Ticket ID: DD-AURA-10492.',
          eventId: 'evt-diljit-aura-delhi',
          read: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      setNotifications(defaultNotifs);
      setUnreadCount(2);
      localStorage.setItem('entertainmenthq_notifications', JSON.stringify(defaultNotifs));
    }

    const savedRegistrations = localStorage.getItem('entertainmenthq_registrations');
    if (savedRegistrations) {
      setRegisteredEvents(JSON.parse(savedRegistrations));
    } else {
      setRegisteredEvents(DEMO_REGISTERED_EVENTS);
      localStorage.setItem('entertainmenthq_registrations', JSON.stringify(DEMO_REGISTERED_EVENTS));
    }
  }, []);

  // Automated background check for upcoming event reminders
  useEffect(() => {
    if (registeredEvents.length === 0) return;

    const checkReminders = () => {
      const now = new Date();

      registeredEvents.forEach((reg) => {
        const ev = reg.events || reg;
        const evDateStr = ev.event_date || ev.date;
        if (!evDateStr) return;

        const eventDate = new Date(evDateStr);
        const diffMs = eventDate - now;
        const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        // Trigger reminder notification if event is within 3 days or today
        if (daysUntil >= 0 && daysUntil <= 7) {
          const reminderKey = `reminder_${ev.id || reg.event_id}_${daysUntil}d`;
          const alreadySent = notifications.some((n) => n.key === reminderKey);

          if (!alreadySent) {
            addNotification({
              key: reminderKey,
              type: 'event_reminder',
              title: daysUntil === 0 
                ? `⚡ EVENT TODAY: ${ev.title}`
                : `⏰ REMINDER (${daysUntil} Day${daysUntil > 1 ? 's' : ''} Left): ${ev.title}`,
              message: daysUntil === 0
                ? `${ev.title} is happening TODAY! Venue: ${ev.location}. Don't forget your ticket!`
                : `${ev.title} is coming up in ${daysUntil} day${daysUntil > 1 ? 's' : ''}! Venue: ${ev.location}`,
              eventId: ev.id || reg.event_id,
              eventDate: evDateStr,
            });
          }
        }
      });
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000); // check every minute
    return () => clearInterval(interval);
  }, [registeredEvents, notifications]);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }
    return false;
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification,
    };
    
    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.read).length);
    localStorage.setItem('entertainmenthq_notifications', JSON.stringify(updated));

    if (permission === 'granted' && !notification.silent) {
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Browser notification error:', e);
      }
    }
  };

  const addRegistration = (registrationData) => {
    const updated = [registrationData, ...registeredEvents.filter(r => r.event_id !== registrationData.event_id)];
    setRegisteredEvents(updated);
    localStorage.setItem('entertainmenthq_registrations', JSON.stringify(updated));

    const evTitle = registrationData.events?.title || 'Event Pass';
    
    // Add confirmation notification
    addNotification({
      type: 'event_registration',
      title: `🎉 Registered: ${evTitle}`,
      message: `Registration successful! Ticket ID: ${registrationData.ticket_id || 'REGISTERED'}. Saved to your Notification Center & Tickets.`,
      eventId: registrationData.event_id,
    });

    showToast(`Registered successfully for ${evTitle}!`);
  };

  const cancelRegistration = (registrationId) => {
    const cancelled = registeredEvents.filter((registration) => registration.id !== registrationId);
    setRegisteredEvents(cancelled);
    localStorage.setItem('entertainmenthq_registrations', JSON.stringify(cancelled));
    showToast('Your concert pass has been cancelled.');
  };

  const setCustomReminder = (event, daysBefore = 1) => {
    const evTitle = event.title || event.name || 'Event';
    
    addNotification({
      type: 'event_reminder',
      title: `🔔 Reminder Scheduled: ${evTitle}`,
      message: `You will be notified ${daysBefore} day${daysBefore > 1 ? 's' : ''} before ${evTitle} on ${event.event_date || event.date}.`,
      eventId: event.id,
      eventDate: event.event_date || event.date,
    });

    showToast(`🔔 Reminder set for "${evTitle}" (${daysBefore} day${daysBefore > 1 ? 's' : ''} before)!`);
  };

  const markAsRead = (id) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.read).length);
    localStorage.setItem('entertainmenthq_notifications', JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    setUnreadCount(0);
    localStorage.setItem('entertainmenthq_notifications', JSON.stringify(updated));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('entertainmenthq_notifications');
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        registeredEvents,
        permission,
        toastMessage,
        requestPermission,
        addNotification,
        addRegistration,
        cancelRegistration,
        setCustomReminder,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
