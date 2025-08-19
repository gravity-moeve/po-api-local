import { getScenarios } from '../controllers/scenariosController';

export const handleScenariosRoute = (req: Request) => {
  if (req.method === 'GET') {
    return new Response(JSON.stringify(getScenarios(), null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
