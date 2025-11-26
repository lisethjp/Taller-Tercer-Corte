// app/hooks/useApiFetch.ts

type Json = Record<string, any>;

// Siempre localhost y puerto del backend
const DEV_PROTOCOL = "http";
const DEV_HOST = "localhost";   // 👈 SIEMPRE localhost
const DEV_PORT = 8970;

// Esto te da: http://localhost:8970/api
export const API_BASE = `${DEV_PROTOCOL}://${DEV_HOST}:${DEV_PORT}/api`;

interface FetchOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body?: Json | FormData;
  headers?: Record<string, string>;
}

async function doFetch<T>({
  method,
  path,
  body,
  headers = {},
}: FetchOptions): Promise<T> {
  const url = `${API_BASE}/${path.replace(/^\/+/, "")}`;

  const isFormData = body instanceof FormData;

  const finalHeaders: Record<string, string> = {
    ...(headers || {}),
  };

  if (!isFormData) {
    finalHeaders["Content-Type"] =
      finalHeaders["Content-Type"] ?? "application/json";
  }

  console.log("📡 Llamando a:", url); // 👈 Para que veas en consola a dónde pega

  const response = await fetch(url, {
    method,
    headers: finalHeaders,
    body: isFormData ? (body as any) : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    console.log("❌ Error HTTP:", response.status, text);
    throw new Error(
      `Error ${response.status} al llamar ${url}. Respuesta: ${text}`
    );
  }

  try {
    const json = (await response.json()) as T;
    console.log("✅ Respuesta OK:", json);
    return json;
  } catch (e) {
    console.log("⚠️ No llegó JSON, respuesta vacía.");
    return (undefined as unknown) as T;
  }
}

export const api = {
  get: <T = any>(path: string, headers?: Record<string, string>) =>
    doFetch<T>({ method: "GET", path, headers }),

  post: <T = any>(
    path: string,
    body?: Json | FormData,
    headers?: Record<string, string>
  ) => doFetch<T>({ method: "POST", path, body, headers }),

  put: <T = any>(
    path: string,
    body?: Json | FormData,
    headers?: Record<string, string>
  ) => doFetch<T>({ method: "PUT", path, body, headers }),

  del: <T = any>(path: string, headers?: Record<string, string>) =>
    doFetch<T>({ method: "DELETE", path, headers }),
};
