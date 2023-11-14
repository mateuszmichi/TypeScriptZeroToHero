export interface OurRequestType {
  url: string;
  body?: string;
}

export const handleRequest = async (
  request: OurRequestType,
  middleware?: (r: OurRequestType) => void,
) => {
  const body = await fetch(request.url).then((resp) => resp.text());
  request.body = body;
  if (middleware) {
    middleware(request);
  }
  return request;
};
