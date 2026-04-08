import { Hono } from "hono";
import { analyticsRouter } from "@/modules/analytics";
import { appsRouter } from "@/modules/apps";
import { authRouter } from "@/modules/auth";
import { cartsRouter } from "@/modules/carts";
import { categoriesRouter } from "@/modules/categories";
import { couponsRouter } from "@/modules/coupons";
import { dashboardRouter } from "@/modules/dashboard";
import { developersRouter } from "@/modules/developers";
import { filesRouter } from "@/modules/files";
import { notificationsRouter } from "@/modules/notifications";
import { ordersRouter } from "@/modules/orders";
import { libraryRouter } from "@/modules/library";
import { reportsRouter } from "@/modules/reports";
import { adminReviewsRouter, reviewsRouter } from "@/modules/reviews";
import { subPackagesRouter } from "@/modules/sub-packages";
import { subscriptionsRouter } from "@/modules/subscriptions";
import { tagsRouter } from "@/modules/tags";
import { usersRouter } from "@/modules/users";
import { versionsRouter } from "@/modules/versions";
import { wishlistsRouter } from "@/modules/wishlists";

export const appRouter = new Hono();

// Mount modules API routes
appRouter.route("/auth", authRouter);
appRouter.route("/categories", categoriesRouter);
appRouter.route("/tags", tagsRouter);
appRouter.route("/users", usersRouter);
appRouter.route("/reviews", reviewsRouter);
appRouter.route("/admin/reviews", adminReviewsRouter);
appRouter.route("/coupons", couponsRouter);
appRouter.route("/apps", appsRouter);
appRouter.route("/sub-packages", subPackagesRouter);
appRouter.route("/reports", reportsRouter);
appRouter.route("/notifications", notificationsRouter);
appRouter.route("/files", filesRouter);
appRouter.route("/carts", cartsRouter);
appRouter.route("/orders", ordersRouter);
appRouter.route("/library", libraryRouter);
appRouter.route("/subscriptions", subscriptionsRouter);
appRouter.route("/versions", versionsRouter);
appRouter.route("/dashboard", dashboardRouter);
appRouter.route("/developers", developersRouter);
appRouter.route("/wishlists", wishlistsRouter);
appRouter.route("/analytics", analyticsRouter);

// Export router tổng để nhúng vào app chính
