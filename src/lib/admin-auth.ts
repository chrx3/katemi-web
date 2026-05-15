// Simple auth state for client components
// Check if admin is logged in by calling /api/admin/check
export async function checkAdminAuth(): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/check');
    return res.ok;
  } catch {
    return false;
  }
}
