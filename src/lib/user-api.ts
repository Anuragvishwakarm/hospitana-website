const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCurrentPatient() {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token);

  const res = await fetch(`${API_URL}/patients/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("STATUS:", res.status);

  if (!res.ok) {
    return null;
  }

  const data = await res.json();

  console.log("USER DATA:", data);

  return data;
}