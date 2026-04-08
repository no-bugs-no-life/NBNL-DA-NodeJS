import { jwt } from "hono/jwt";
import type { Context, Next } from "hono";
import { env } from "@/config/env";

export const requireAuth = jwt({
    secret: env.JWT_ACCESS_SECRET,
    cookie: "access_token",
    alg: "HS256",
});

export const requireRole = (roles: string[]) => {
    return async (c: Context, next: Next) => {
        await requireAuth(c, async () => {
            const payload = c.get("jwtPayload");
            if (!payload || !roles.includes(payload.role)) {
                return c.json({ success: false, msg: "Không có quyền truy cập" }, 403);
            }
            await next();
        });
    };
};

const ADMIN_ROLES = ["ADMIN", "MODERATOR"];
const DEVELOPER_ROLES = [...ADMIN_ROLES, "DEVELOPER"];

export const requireAdmin = requireRole(ADMIN_ROLES);
export const requireDeveloper = requireRole(DEVELOPER_ROLES);
