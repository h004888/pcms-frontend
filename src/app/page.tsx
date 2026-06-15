// =====================================================
// PCMS - Root page: redirect to /home (or /login if not authed)
// =====================================================

import { redirect } from 'next/navigation';

export default function HomePage() {
  // Server-side: just redirect to home. Client-side will handle auth check.
  redirect('/home');
}
