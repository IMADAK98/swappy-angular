// export const memoize = (fn: any) => {
//   let cache: any = {};
//   return (...args: any) => {
//     const cacheKey = JSON.stringify(args);
//     if (typeof cache[cacheKey] === 'undefined') {
//       const result = fn(...args);
//       cache[cacheKey] = result;
//       return result;
//     } else {
//       return cache[cacheKey];
//     }
//   };
// };

import { Observable } from 'rxjs';

// export function memoize() {
//   const cache = new Map<string, any>();

//   return function (
//     target: any,
//     propertyKey: string,
//     descriptor: PropertyDescriptor,
//   ) {
//     const originalMethod = descriptor.value;
//     descriptor.value = function (...args: any[]) {
//       console.log('Checking if cache is used...');
//       console.log(cache);
//       const cacheKey = JSON.stringify(args);
//       if (!cache.has(cacheKey)) {
//         console.log('Cache miss. Fetching data from server...');

//         const result = originalMethod.apply(this, args);
//         cache.set(cacheKey, result);
//         console.log(`added to cache ${cacheKey}`);
//       } else {
//         console.log(`retrieved from cache ${cacheKey}`);
//         return cache.get(cacheKey);
//       }
//     };

//     return descriptor;
//   };
// }
