const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function ApiRequest({
  pathname,
  method = "GET",
  token,
  headers = {},
  body = null,
  params = {},
}: {
  pathname: string;
  method?: string;
  token: string;
  headers?: Record<string, string>;
  body?: any;
  params?: { [key: string]: string | number | boolean };
}) {
  try {
    let url = `${API_BASE_URL}${pathname}`;

    if (method === "GET" && Object.keys(params).length > 0) {
      const query = new URLSearchParams(params).toString();
      url += `?${query}`;
    }

    const defaultHeaders = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // default bearer
      ...headers, // merge additional headers
    };

    const options = {
      method,
      headers: defaultHeaders,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${url}`, options);
    // const data = await response.json().catch(() => null);
    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: error.message,
    };
  }
}
