// deno-lint-ignore-file no-explicit-any

export interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

export async function http<T>(
  request: RequestInfo
): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(
    request
  );

  console.info(
		`Fetching: ${response.url}\n`,
		`Response: ${response.status} ${response.statusText}`
	)

  try {
    const responseJson = await response.json()
    if (responseJson.parsedBody === undefined) {
      response.parsedBody = responseJson;
    } else {
      response.parsedBody = responseJson.parsedBody
    }
  } catch (ex) { 
    console.warn(ex)
    response.parsedBody = undefined
  }

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
}

export async function get<T>(
  path: string,
  args: RequestInit = { method: "get" },
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}

export async function post<T>(
  path: string,
  body: any,
  args: RequestInit = { method: "post", body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } },
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}

export async function put<T>(
  path: string,
  body: any,
  args: RequestInit = { method: "put", body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } },
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}
