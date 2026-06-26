import { HttpInterceptorFn } from '@angular/common/http';

export const sessionInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionId = localStorage.getItem('sessionId');
  if (sessionId) {
    const cloned = req.clone({ setHeaders: { 'X-Session-ID': sessionId } });
    return next(cloned);
  }
  return next(req);
};
