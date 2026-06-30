import logging
import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        method = request.method
        path = request.url.path
        
        logger.info(f"IN {method} {path}")  # ❌ Removed emoji
        
        try:
            response = await call_next(request)
            
            duration = time.time() - start_time
            status_code = response.status_code
            
            logger.info(
                f"OUT {method} {path} - Status: {status_code} - Duration: {duration:.2f}s"  
            )
            
            return response
            
        except Exception as e:
            duration = time.time() - start_time
            logger.error(
                f"ERROR {method} {path} - {str(e)} - Duration: {duration:.2f}s",
                exc_info=True
            )
            raise