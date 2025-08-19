export const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400"
};

export const createResponse = (data: any, status: number = 200) => {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: corsHeaders
  });
};

export const createErrorResponse = (message: string, status: number = 400) => {
  return createResponse({ error: message }, status);
};

export const handlePreflight = () => {
  return new Response(null, { 
    status: 200, 
    headers: corsHeaders 
  });
};
