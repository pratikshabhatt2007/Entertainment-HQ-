import crypto from 'crypto';
import { supabase } from '../config/supabase.js';

/**
 * Generate a unique ticket ID string
 * e.g., TCKT-8F3A2B1C
 */
const generateTicketId = () => {
  const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `TCKT-${randomHex}`;
};

/**
 * POST /api/registrations
 * Protected: Register for an event
 */
export const registerForEvent = async (req, res) => {
  try {
    const { event_id } = req.body;
    const userId = req.user.id;

    if (!event_id) {
      return res.status(400).json({ error: 'event_id is required.' });
    }

    // 1. Check if event exists
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title, capacity')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      return res.status(404).json({ error: 'Event not found.' });
    }

    // 2. Check remaining capacity for the event
    const { count, error: countError } = await supabase
      .from('registrations')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', event_id)
      .eq('status', 'registered');

    if (countError) {
      console.error('Error counting registrations:', countError);
      return res.status(500).json({ error: 'Failed to verify event capacity.' });
    }

    if (count >= event.capacity) {
      return res.status(400).json({ error: 'Event is sold out / at full capacity.' });
    }

    // 3. Prevent duplicate active registration
    const { data: existingReg, error: existingError } = await supabase
      .from('registrations')
      .select('id, status')
      .eq('user_id', userId)
      .eq('event_id', event_id)
      .single();

    if (existingReg && existingReg.status === 'registered') {
      return res.status(400).json({ error: 'You are already registered for this event.' });
    }

    const ticket_id = generateTicketId();

    let registrationResult;

    if (existingReg && existingReg.status === 'cancelled') {
      // Re-activate cancelled registration with a new ticket_id
      const { data: reactivatedReg, error: updateError } = await supabase
        .from('registrations')
        .update({
          status: 'registered',
          ticket_id,
          registered_at: new Date().toISOString(),
        })
        .eq('id', existingReg.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error reactivating registration:', updateError);
        return res.status(500).json({ error: 'Failed to complete registration.' });
      }
      registrationResult = reactivatedReg;
    } else {
      // Create new registration
      const { data: newReg, error: insertError } = await supabase
        .from('registrations')
        .insert([
          {
            user_id: userId,
            event_id,
            status: 'registered',
            ticket_id,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting registration:', insertError);
        return res.status(500).json({ error: insertError.message || 'Failed to complete registration.' });
      }
      registrationResult = newReg;
    }

    return res.status(201).json({
      message: 'Successfully registered for event',
      registration: registrationResult,
      event: {
        id: event.id,
        title: event.title,
      },
    });
  } catch (err) {
    console.error('registerForEvent Controller Error:', err);
    return res.status(500).json({ error: 'Server error during event registration.' });
  }
};

/**
 * PUT /api/registrations/:id/cancel
 * Protected: Cancel an existing registration (Owner or Admin)
 */
export const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // 1. Fetch registration
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('id, user_id, event_id, status, ticket_id')
      .eq('id', id)
      .single();

    if (fetchError || !registration) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    // 2. Authorization check (Only owning user or admin)
    if (registration.user_id !== userId && !isAdmin) {
      return res.status(403).json({ error: 'Access denied. You can only cancel your own registrations.' });
    }

    // 3. Status check
    if (registration.status === 'cancelled') {
      return res.status(400).json({ error: 'Registration is already cancelled.' });
    }

    // 4. Update status to cancelled
    const { data: updatedReg, error: updateError } = await supabase
      .from('registrations')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error cancelling registration:', updateError);
      return res.status(500).json({ error: 'Failed to cancel registration.' });
    }

    return res.status(200).json({
      message: 'Registration cancelled successfully',
      registration: updatedReg,
    });
  } catch (err) {
    console.error('cancelRegistration Controller Error:', err);
    return res.status(500).json({ error: 'Server error while cancelling registration.' });
  }
};

/**
 * GET /api/registrations/my
 * Protected: Get all registrations for the logged-in user with event details
 */
export const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: registrations, error } = await supabase
      .from('registrations')
      .select(`
        id,
        status,
        ticket_id,
        registered_at,
        events (
          id,
          title,
          description,
          category,
          event_date,
          event_time,
          location,
          capacity,
          image_url
        )
      `)
      .eq('user_id', userId)
      .order('registered_at', { ascending: false });

    if (error) {
      console.error('Error fetching user registrations:', error);
      return res.status(500).json({ error: 'Failed to fetch registrations.' });
    }

    return res.status(200).json({ registrations: registrations || [] });
  } catch (err) {
    console.error('getMyRegistrations Controller Error:', err);
    return res.status(500).json({ error: 'Server error while fetching registrations.' });
  }
};

/**
 * GET /api/registrations/my/history
 * Protected: Get past event registrations for the logged-in user
 */
export const getMyRegistrationHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const { data: registrations, error } = await supabase
      .from('registrations')
      .select(`
        id,
        status,
        ticket_id,
        registered_at,
        events!inner (
          id,
          title,
          description,
          category,
          event_date,
          event_time,
          location,
          capacity,
          image_url
        )
      `)
      .eq('user_id', userId)
      .lt('events.event_date', today)
      .order('registered_at', { ascending: false });

    if (error) {
      console.error('Error fetching registration history:', error);
      return res.status(500).json({ error: 'Failed to fetch registration history.' });
    }

    return res.status(200).json({ registrations: registrations || [] });
  } catch (err) {
    console.error('getMyRegistrationHistory Controller Error:', err);
    return res.status(500).json({ error: 'Server error while fetching registration history.' });
  }
};
