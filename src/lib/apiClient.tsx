import { cookies } from "next/headers";

type FetchOptions = RequestInit & {
  headers?: HeadersInit;
};

const apiClient = async (url: string, options: FetchOptions = {}) => {
  const cookieStore = cookies();
  const authToken = cookieStore.get("auth_token")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  if (authToken) {
    (headers as Record<string, string>)["Authorization"] =
      `Bearer ${authToken}`;
  }

  const fetchOptions: FetchOptions = {
    ...options,
    headers,
  };

  return await fetch(`${process.env.BE_URL}${url}`, fetchOptions);
};

export default apiClient;
