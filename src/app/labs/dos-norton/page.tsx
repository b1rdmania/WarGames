/**
 * Redirect from legacy dos-norton route to terminal
 * This route is deprecated - use /labs/terminal instead
 */

import { redirect } from 'next/navigation';

export default function DosNortonRedirect() {
  redirect('/labs/terminal');
}
