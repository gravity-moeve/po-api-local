import { getStatuses } from '../controllers/statusesController';
import { createResponse, createErrorResponse } from '../utils/responseUtils';

export const handleStatusesRoute = (req: Request) => {
  if (req.method === 'GET') {
    return createResponse(getStatuses());
  }
  
  return createErrorResponse("Method not allowed", 405);
};
