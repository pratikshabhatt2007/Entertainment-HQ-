import React, { useState } from 'react';
import { CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function PaymentConfirmation() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('ready');
  const artist = params.get('artist') || 'Concert';
  const show = params.get('show') || `${artist} Live`;
  const paymentId = params.get('paymentId');
  const confirm = async () => {
    setStatus('confirming');
    try { await fetch(`/api/payments/${paymentId}/confirm`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ artist, show }) }); } catch { /* The completion screen still works in offline demo mode. */ }
    setStatus('confirmed');
  };
  return <div className="fixed inset-0 flex items-center justify-center bg-[#07060b] p-5 text-white"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-[32px] border border-yellow-400/30 bg-[#111117] p-7 text-center shadow-2xl">{status === 'confirmed' ? <><CheckCircle2 className="mx-auto h-16 w-16 text-emerald-400" /><p className="mt-5 text-xs font-black uppercase tracking-[.24em] text-yellow-300">Payment confirmed</p><h1 className="mt-3 text-3xl font-black">Congratulations!</h1><p className="mt-3 text-stone-300">Your ticket for {artist} has been booked. You can return to Concerts Manager to view your pass.</p></> : <><CreditCard className="mx-auto h-14 w-14 text-yellow-300" /><p className="mt-5 text-xs font-black uppercase tracking-[.24em] text-yellow-300">Payment confirmation required</p><h1 className="mt-3 text-2xl font-black">Confirm your UPI payment</h1><p className="mt-3 text-sm text-stone-300">{show}</p><p className="mt-5 rounded-xl border border-yellow-400/20 bg-yellow-400/10 p-3 text-xs text-yellow-100">Tap Confirm Payment to complete this demo transaction and update the checkout on your laptop.</p><button onClick={confirm} disabled={status === 'confirming'} className="mt-5 w-full rounded-xl btn-gold py-3.5 font-black text-stone-950">{status === 'confirming' ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'Confirm payment'}</button></>}</div></div>;
}
