type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  '/owner(.*)': ['owner'],
  '/tenant(.*)': ['tenant'],
  // '/guest(.*)': ['tenant'],
  //  '/(.*)': ['tenant'],
  //   '/parent(.*)': ['tenant'],
  //   '/list/teachers': ['owner'],
};
