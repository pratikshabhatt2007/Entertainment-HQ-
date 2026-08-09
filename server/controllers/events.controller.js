import { supabase } from '../config/supabase.js';

/**
 * GET /api/events
 * Public: Get all events with optional search, category, and date filters
 */
export const getEvents = async (req, res) => {
  try {
    const { search, category, date, startDate, endDate } = req.query;

    let query = supabase.from('events').select('*').order('event_date', { ascending: true });

    if (search && search.trim() !== '') {
      query = query.ilike('title', `%${search.trim()}%`);
    }

    if (category && category.trim() !== '' && category !== 'All') {
      query = query.eq('category', category.trim());
    }

    if (date) {
      query = query.gte('event_date', date);
    } else if (startDate || endDate) {
      if (startDate) query = query.gte('event_date', startDate);
      if (endDate) query = query.lte('event_date', endDate);
    }

    const { data: events, error } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }

    return res.status(200).json({ events: events || [] });
  } catch (err) {
    console.error('getEvents Controller Error:', err);
    return res.status(500).json({ error: 'Server error while fetching events' });
  }
};

/**
 * GET /api/events/:id
 * Public: Get a single event by ID
 */
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.status(200).json({ event });
  } catch (err) {
    console.error('getEventById Controller Error:', err);
    return res.status(500).json({ error: 'Server error while fetching event' });
  }
};

/**
 * POST /api/events
 * Protected + AdminOnly: Create a new event
 */
export const createEvent = async (req, res) => {
  try {
    const { title, description, category, event_date, event_time, location, capacity, image_url } = req.body;

    if (!title || !event_date || !location || capacity === undefined || capacity === null) {
      return res.status(400).json({ error: 'Title, event_date, location, and capacity are required.' });
    }

    const parsedCapacity = parseInt(capacity, 10);
    if (isNaN(parsedCapacity) || parsedCapacity < 0) {
      return res.status(400).json({ error: 'Capacity must be a non-negative integer.' });
    }

    const newEvent = {
      title,
      description: description || '',
      category: category || 'General',
      event_date,
      event_time: event_time || null,
      location,
      capacity: parsedCapacity,
      image_url: image_url || null,
      created_by: req.user.id,
    };

    const { data: event, error } = await supabase
      .from('events')
      .insert([newEvent])
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return res.status(500).json({ error: error.message || 'Failed to create event' });
    }

    return res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    console.error('createEvent Controller Error:', err);
    return res.status(500).json({ error: 'Server error while creating event' });
  }
};

/**
 * PUT /api/events/:id
 * Protected + AdminOnly: Update an existing event
 */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, event_date, event_time, location, capacity, image_url } = req.body;

    // Check if event exists
    const { data: existingEvent, error: fetchError } = await supabase
      .from('events')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (event_date !== undefined) updates.event_date = event_date;
    if (event_time !== undefined) updates.event_time = event_time;
    if (location !== undefined) updates.location = location;
    if (image_url !== undefined) updates.image_url = image_url;
    if (capacity !== undefined) {
      const parsedCapacity = parseInt(capacity, 10);
      if (isNaN(parsedCapacity) || parsedCapacity < 0) {
        return res.status(400).json({ error: 'Capacity must be a non-negative integer.' });
      }
      updates.capacity = parsedCapacity;
    }

    const { data: updatedEvent, error: updateError } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating event:', updateError);
      return res.status(500).json({ error: updateError.message || 'Failed to update event' });
    }

    return res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (err) {
    console.error('updateEvent Controller Error:', err);
    return res.status(500).json({ error: 'Server error while updating event' });
  }
};

/**
 * DELETE /api/events/:id
 * Protected + AdminOnly: Delete an event
 */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const { data: existingEvent, error: fetchError } = await supabase
      .from('events')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting event:', deleteError);
      return res.status(500).json({ error: deleteError.message || 'Failed to delete event' });
    }

    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('deleteEvent Controller Error:', err);
    return res.status(500).json({ error: 'Server error while deleting event' });
  }
};

/**
 * GET /api/events/:id/attendees
 * Protected + AdminOnly: Get all attendees/registrations for a specific event
 */
export const getEventAttendees = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if event exists
    const { data: existingEvent, error: fetchError } = await supabase
      .from('events')
      .select('id, title')
      .eq('id', id)
      .single();

    if (fetchError || !existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Join registrations with users table
    const { data: attendees, error: attendeesError } = await supabase
      .from('registrations')
      .select(`
        id,
        ticket_id,
        status,
        registered_at,
        users (
          id,
          name,
          email
        )
      `)
      .eq('event_id', id)
      .order('registered_at', { ascending: false });

    if (attendeesError) {
      console.error('Error fetching event attendees:', attendeesError);
      return res.status(500).json({ error: 'Failed to fetch event attendees' });
    }

    return res.status(200).json({
      event: existingEvent,
      totalAttendees: attendees ? attendees.length : 0,
      attendees: attendees || [],
    });
  } catch (err) {
    console.error('getEventAttendees Controller Error:', err);
    return res.status(500).json({ error: 'Server error while fetching attendees' });
  }
};
