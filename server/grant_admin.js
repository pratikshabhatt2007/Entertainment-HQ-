import { supabase } from './config/supabase.js';

const targetEmail = 'aksharjain034@gmail.com';

async function grantAdmin() {
  console.log(`🔍 Granting Admin access to "${targetEmail}"...`);

  // 1. Update public.users table
  const { data: updatedUser, error: dbError } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('email', targetEmail)
    .select();

  if (dbError) {
    console.error('Error updating public.users role:', dbError);
  } else if (updatedUser && updatedUser.length > 0) {
    console.log('✅ Successfully updated public.users role to "admin" for:', updatedUser[0]);
  } else {
    console.log(`⚠️ User "${targetEmail}" not found in public.users yet. Attempting upsert...`);
    // Upsert user as admin
    const { data: upsertData, error: upsertErr } = await supabase
      .from('users')
      .upsert([
        {
          name: 'Akshar Jain',
          email: targetEmail,
          role: 'admin',
          password_hash: '[ADMIN_GRANTED]',
        },
      ], { onConflict: 'email' })
      .select();

    if (upsertErr) {
      console.error('Upsert Error:', upsertErr);
    } else {
      console.log('✅ Successfully upserted Admin profile in public.users:', upsertData);
    }
  }
}

grantAdmin();
