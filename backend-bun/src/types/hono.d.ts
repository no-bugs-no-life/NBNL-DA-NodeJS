import "hono";

declare module "hono" {
    interface ContextVariableMap {
        jwtPayload: {
            id: string;
            role: string;
            email?: string;
            exp?: number;
            iat?: number;
        };
    }

    interface HonoRequest<Path = string, Input = Record<string, never>> {
        valid(target: "query" | "json" | "param" | "form" | "header" | "cookie"): unknown;
    }
}
