export class Router {
  constructor() {
    this.routes = [];
    this.middlewares = [];
  }

  use(path, handler) {
    if (typeof path === 'function') {
      this.middlewares.push({ path: '*', handler: path });
    } else {
      this.middlewares.push({ path, handler });
    }
  }

  get(path, handler) {
    this.routes.push({ method: 'GET', path, handler });
  }

  post(path, handler) {
    this.routes.push({ method: 'POST', path, handler });
  }

  put(path, handler) {
    this.routes.push({ method: 'PUT', path, handler });
  }

  patch(path, handler) {
    this.routes.push({ method: 'PATCH', path, handler });
  }

  delete(path, handler) {
    this.routes.push({ method: 'DELETE', path, handler });
  }

  all(path, handler) {
    this.routes.push({ method: '*', path, handler });
  }

  async handle(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // Build context
    const context = { request, env, ctx, url, params: {} };

    // Execute global middlewares
    for (const middleware of this.middlewares) {
      if (this.matchPath(pathname, middleware.path)) {
        const result = await middleware.handler(context);
        if (result instanceof Response) {
          return result;
        }
      }
    }

    // Find matching route
    for (const route of this.routes) {
      const match = this.matchRoute(pathname, route.path);
      if (match && (route.method === '*' || route.method === method)) {
        context.params = match.params;
        try {
          return await route.handler(context);
        } catch (error) {
          console.error('Route handler error:', error);
          return new Response(JSON.stringify({ 
            success: false, 
            message: error.message || 'Internal Server Error' 
          }), { 
            status: error.status || 500, 
            headers: { 'Content-Type': 'application/json' } 
          });
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Not Found' 
    }), { 
      status: 404, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  matchPath(pathname, pattern) {
    if (pattern === '*') return true;
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      return pathname.startsWith(prefix);
    }
    return pathname === pattern || pathname.startsWith(pattern + '/');
  }

  matchRoute(pathname, pattern) {
    // Handle wildcard
    if (pattern === '*') {
      return { params: {} };
    }

    // Handle prefix wildcard
    if (pattern.endsWith('*')) {
      const prefix = pattern.slice(0, -1);
      if (pathname.startsWith(prefix)) {
        return { params: {} };
      }
      return null;
    }

    // Convert pattern to regex
    const paramNames = [];
    const regexPattern = pattern.replace(/:([^/]+)/g, (match, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });

    const regex = new RegExp(`^${regexPattern}$`);
    const match = pathname.match(regex);

    if (!match) {
      return null;
    }

    const params = {};
    paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });

    return { params };
  }
}

// Helper functions
export function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

export function errorResponse(message, status = 400) {
  return jsonResponse({ success: false, message }, status);
}

export function successResponse(data, message = 'Success') {
  return jsonResponse({ success: true, data, message });
}
