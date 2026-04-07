import { Hono } from "hono";
import { authRouter } from "@/modules/auth";
import { categoriesRouter } from "@/modules/categories";
import { tagsRouter } from "@/modules/tags";
import { usersRouter } from "@/modules/users";
import { reviewsRouter } from "@/modules/reviews";
import { couponsRouter } from "@/modules/coupons";
import { appsRouter } from "@/modules/apps";
import { subPackagesRouter } from "@/modules/sub-packages";
import { reportsRouter } from "@/modules/reports";
import { notificationsRouter } from "@/modules/notifications";
import { filesRouter } from "@/modules/files";
import { cartsRouter } from "@/modules/carts";
import { ordersRouter } from "@/modules/orders";
import { subscriptionsRouter } from "@/modules/subscriptions";
import { versionsRouter } from "@/modules/versions";

export const appRouter = new Hono();

// Mount modules API routes
appRouter.route("/auth", authRouter);
appRouter.route("/categories", categoriesRouter);
appRouter.route("/tags", tagsRouter);
appRouter.route("/users", usersRouter);
appRouter.route("/reviews", reviewsRouter);
appRouter.route("/coupons", couponsRouter);
appRouter.route("/apps", appsRouter);
appRouter.route("/sub-packages", subPackagesRouter);
appRouter.route("/reports", reportsRouter);
appRouter.route("/notifications", notificationsRouter);
appRouter.route("/files", filesRouter);
appRouter.route("/carts", cartsRouter);
appRouter.route("/orders", ordersRouter);
appRouter.route("/subscriptions", subscriptionsRouter);
appRouter.route("/versions", versionsRouter);

// Export router tổng để nhúng vào app chính
