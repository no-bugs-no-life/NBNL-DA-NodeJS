import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { OrdersService } from "@/modules/orders";

interface LibraryItem {
  id: string;
  appId: string;
  title: string;
  image: string;
  playTime: number;
  lastPlayed: string;
  installedAt: string;
  type: "game" | "app";
  source: "order";
}

interface AppDocLite {
  _id: ObjectId;
  category?: ObjectId;
}

interface CategoryDocLite {
  _id: ObjectId;
  name?: string;
}

export class LibraryService {
  private readonly ordersService = new OrdersService();

  private get db() {
    // biome-ignore lint/style/noNonNullAssertion: DB is initialized on app bootstrap
    return mongoose.connection.db!;
  }

  async getMyLibrary(userId: string): Promise<LibraryItem[]> {
    const orders = await this.ordersService.getUserOrders(userId);

    // Build appId list from orders for precise type mapping.
    const appIds = [
      ...new Set(
        orders.flatMap((order) => (order.items || []).map((item) => item.app)).filter(Boolean),
      ),
    ].filter((id) => ObjectId.isValid(id));

    const objectAppIds = appIds.map((id) => new ObjectId(id));

    const appDocs: AppDocLite[] =
      objectAppIds.length > 0
        ? ((await this.db
            .collection("apps")
            .find({ _id: { $in: objectAppIds } })
            .project({ _id: 1, category: 1 })
            .toArray()) as AppDocLite[])
        : [];

    const categoryIds = [
      ...new Set(appDocs.map((a) => a.category?.toString()).filter(Boolean)),
    ].map((id) => new ObjectId(id as string));

    const categoryDocs: CategoryDocLite[] =
      categoryIds.length > 0
        ? ((await this.db
            .collection("categories")
            .find({ _id: { $in: categoryIds } })
            .project({ _id: 1, name: 1 })
            .toArray()) as CategoryDocLite[])
        : [];

    const appCategoryMap = new Map<string, string>();
    const categoryNameMap = new Map<string, string>(
      categoryDocs.map((c) => [c._id.toString(), (c.name || "").toLowerCase()]),
    );

    for (const app of appDocs) {
      const categoryName = app.category
        ? categoryNameMap.get(app.category.toString()) || ""
        : "";
      appCategoryMap.set(app._id.toString(), categoryName);
    }

    const map = new Map<string, LibraryItem>();

    for (const order of orders) {
      for (const item of order.items || []) {
        const appId = item.app;
        const orderDate = order.createdAt
          ? new Date(order.createdAt).toISOString()
          : new Date().toISOString();

        const categoryName = appCategoryMap.get(appId) || "";
        const type: "game" | "app" = categoryName.includes("game")
          ? "game"
          : "app";

        const existed = map.get(appId);
        if (!existed) {
          map.set(appId, {
            id: appId,
            appId,
            title: item.name,
            image: item.iconUrl || "",
            playTime: 0,
            lastPlayed: orderDate,
            installedAt: orderDate,
            type,
            source: "order",
          });
          continue;
        }

        if (new Date(orderDate).getTime() > new Date(existed.lastPlayed).getTime()) {
          existed.lastPlayed = orderDate;
        }

        if (new Date(orderDate).getTime() < new Date(existed.installedAt).getTime()) {
          existed.installedAt = orderDate;
        }
      }
    }

    return [...map.values()].sort(
      (a, b) =>
        new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime(),
    );
  }
}
