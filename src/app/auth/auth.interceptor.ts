import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  //   Check if the request URL matches the route to exempt
  if (
    req.url === 'http://localhost:8000/api/v1/auth/register' ||
    req.url === 'http://localhost:8000/api/v1/auth/login'
  ) {
    // Return the original request without modifying it
    return next(req);
  }

  // Clone the request and add Authorization header if token exists
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });
  console.log(req);

  // Proceed with the modified or original request
  return next(authReq);
};
