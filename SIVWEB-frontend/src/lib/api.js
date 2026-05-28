const API_BASE_URL = "http://localhost:3000";

export async function getCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/csrf-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "No se pudo obtener el token CSRF");
  }

  const data = await response.json();
  return data.csrfToken;
}

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {} } = options;
  const upperMethod = method.toUpperCase();
  const requestHeaders = { ...headers };

  if (upperMethod !== "GET" && upperMethod !== "HEAD" && upperMethod !== "OPTIONS") {
    const csrfToken = await getCsrfToken();
    requestHeaders["x-csrf-token"] = csrfToken;
  }

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: upperMethod,
    credentials: "include",
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    let message = "Error en la solicitud";

    if (contentType.includes("application/json")) {
      const errorPayload = await response.json().catch(() => null);
      message = errorPayload?.message || errorPayload?.error || message;
    } else {
      message = (await response.text().catch(() => "")) || message;
    }

    throw new Error(message);
  }

  const responseType = response.headers.get("content-type") || "";
  if (responseType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}
