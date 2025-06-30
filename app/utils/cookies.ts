import { cookies } from 'next/headers';

export async function sendCookies(name: string, value: string) {
  const cookieStore = await cookies();
  return cookieStore.set({
    name,
    value,
    httpOnly: true,
    path: '/',
  });
}

export async function getCookies(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name);
}

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.delete(name);
}
