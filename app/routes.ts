import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home/index.tsx"),
    route("auth", "routes/auth/index.tsx"),
] satisfies RouteConfig;
