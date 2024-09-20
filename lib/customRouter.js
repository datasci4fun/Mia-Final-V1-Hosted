// C:\Users\blixa\Documents\xampp\git\Mia-Final-V1\lib\customRouter.js

import Router from 'next/router';
import { filterAllowedParams, generateUrlWithQueryString } from './queryStringHelper'; // Import the helper functions

const customRouter = {};

customRouter.pushRouteWithQuery = function (route, params = {}, options = {}) {
  const currentQuery = Router.query;

  // If no additional params are provided, retain the current query parameters
  if (!Object.keys(params).length) {
    const routeWithParams = generateUrlWithQueryString(route, currentQuery);
    Router.push(routeWithParams, undefined, options);
  } else {
    // Merge current and new parameters, filtering only allowed ones
    const filteredParams = filterAllowedParams(currentQuery);
    const allParams = { ...filteredParams, ...params };
    const routeWithParams = generateUrlWithQueryString(route, allParams);
    Router.push(routeWithParams, undefined, options);
  }
};

export default customRouter;
