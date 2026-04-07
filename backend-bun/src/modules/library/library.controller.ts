import type { Context } from "hono";
import { BaseController } from "@/shared/base";
import { LibraryService } from "./library.service";

export class LibraryController extends BaseController {
  private readonly service = new LibraryService();

  async getMyLibrary(c: Context) {
    const payload = c.get("jwtPayload");
    if (!payload) return c.json(this.fail("Chưa đăng nhập"), 401);

    const data = await this.service.getMyLibrary(payload.id);
    return c.json(this.ok(data));
  }
}
