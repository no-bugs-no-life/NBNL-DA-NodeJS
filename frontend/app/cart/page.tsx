"use client";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  useMyCart,
  useAddToCart,
  useRemoveFromCart,
  useClearCart,
  useUpdateCartItem,
} from "@/hooks/useCart";
import { CartItem, CartAppItem } from "@/hooks/useCart";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "@/configs/api";
import { useEffect, useMemo, useState } from "react";

export default function CartPage() {
  const { data: cart, isLoading } = useMyCart();
  const removeMutation = useRemoveFromCart();
  const clearMutation = useClearCart();
  const addMutation = useAddToCart();
  const updateMutation = useUpdateCartItem();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const items = cart?.items || [];

  const itemAppIds = useMemo(
    () =>
      items
        .map((i) => (i.appId as unknown as CartAppItem)?._id)
        .filter(Boolean) as string[],
    [items],
  );

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => itemAppIds.includes(id)));
  }, [itemAppIds]);

  const handleToggleSelect = (appId: string) => {
    setSelectedIds((prev) =>
      prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === itemAppIds.length) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(itemAppIds);
  };

  const handleRemove = async (appId: string) => {
    try {
      await removeMutation.mutateAsync(appId);
      setSelectedIds((prev) => prev.filter((id) => id !== appId));
    } catch {
      /* silent */
    }
  };

  const handleUpdateQuantity = async (appId: string, nextQty: number) => {
    const quantity = Math.max(1, nextQty);
    try {
      await updateMutation.mutateAsync({ appId, data: { quantity } });
    } catch {
      /* silent */
    }
  };

  const handleClearSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm("Xoá các mục đã chọn khỏi giỏ hàng?")) return;

    try {
      await Promise.all(selectedIds.map((id) => removeMutation.mutateAsync(id)));
      setSelectedIds([]);
    } catch {
      /* silent */
    }
  };

  const handleClear = async () => {
    if (!confirm("Xoá toàn bộ giỏ hàng?")) return;
    try {
      await clearMutation.mutateAsync();
      setSelectedIds([]);
    } catch {
      /* silent */
    }
  };

  return (
    <>
      <Navbar />
      <main className="mt-20 max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="mb-10 pt-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Giỏ hàng của bạn
            </h1>
            <p className="text-on-surface-variant mt-2 text-lg">
              Xác nhận các ứng dụng bạn muốn mua trước khi thanh toán.
            </p>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleClear}
              disabled={clearMutation.isPending}
              className="text-sm text-red-500 hover:text-red-600 font-semibold"
            >
              Xoá tất cả
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <CartItemListWrapper
              items={items}
              isLoading={isLoading}
              onRemove={handleRemove}
              onUpdateQuantity={handleUpdateQuantity}
              onToggleSelect={handleToggleSelect}
              selectedIds={selectedIds}
              onSelectAll={handleSelectAll}
              removingId={removeMutation.variables}
              updatingId={updateMutation.variables?.appId}
            />
          </div>
          <div>
            <CartSummary
              cart={cart}
              isLoading={isLoading}
              selectedIds={selectedIds}
              onAddApp={() => setShowAddModal(true)}
              onClearSelected={handleClearSelected}
            />
          </div>
        </div>
      </main>

      {showAddModal && (
        <AddAppModal
          currentAppIds={items
            .map((i) => (i.appId as unknown as CartAppItem)?._id)
            .filter(Boolean)}
          onAdd={async (appId, itemType) => {
            await addMutation.mutateAsync({ appId, itemType });
            setShowAddModal(false);
          }}
          isAdding={addMutation.isPending}
          onClose={() => setShowAddModal(false)}
        />
      )}

      <Footer />
    </>
  );
}

// ===== Add App Modal =====

function AddAppModal({
  currentAppIds,
  onAdd,
  isAdding,
  onClose,
}: {
  currentAppIds: string[];
  onAdd: (appId: string, itemType: string) => void;
  isAdding: boolean;
  onClose: () => void;
}) {
  const { data: apps, isLoading } = useQuery({
    queryKey: ["apps", "for-cart"],
    queryFn: async () => {
      const res = await axios.get(
        `${API_URL}/api/v1/apps?limit=100&status=active`,
      );
      const payload = res.data?.data;
      return (Array.isArray(payload) ? payload : payload?.docs || []) as any[];
    },
  });

  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [itemType, setItemType] = useState<string>("one_time");

  const filtered = (apps || []).filter(
    (a: any) =>
      !currentAppIds.includes(a._id) &&
      (a.price > 0 || a.subscriptionPrice > 0) &&
      (a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.developerId?.name?.toLowerCase().includes(search.toLowerCase())),
  );

  const handleSubmit = () => {
    if (!selectedApp) return;
    onAdd(selectedApp._id, itemType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <ModalHeader onClose={onClose} />
        <div className="p-6 overflow-y-auto flex-1">
          {selectedApp ? (
            <SelectTypePanel
              app={selectedApp}
              itemType={itemType}
              onTypeChange={setItemType}
              onBack={() => setSelectedApp(null)}
              onSubmit={handleSubmit}
              isAdding={isAdding}
            />
          ) : (
            <AppSearchPanel
              apps={filtered}
              isLoading={isLoading}
              search={search}
              onSearchChange={setSearch}
              onSelect={setSelectedApp}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ModalHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
      <h2 className="text-xl font-bold text-slate-800">
        Thêm ứng dụng vào giỏ hàng
      </h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>
    </div>
  );
}

function AppSearchPanel({
  apps,
  isLoading,
  search,
  onSearchChange,
  onSelect,
}: {
  apps: any[];
  isLoading: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  onSelect: (a: any) => void;
}) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Tìm kiếm ứng dụng..."
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
      />
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-slate-50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <span className="material-symbols-outlined text-4xl mb-2 block">
            search_off
          </span>
          <p className="text-sm">Không tìm thấy ứng dụng phù hợp</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[50vh] overflow-y-auto">
          {apps.map((app) => (
            <button
              key={app._id}
              onClick={() => onSelect(app)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                <img
                  src={app.iconUrl || "https://i.sstatic.net/l60Hf.png"}
                  alt={app.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">
                  {app.name}
                </p>
                <p className="text-xs text-slate-500">
                  {app.developerId?.name || "N/A"}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-sm text-slate-800">
                  ${app.price || 0}
                  {(app.price === 0 || !app.price) && app.subscriptionPrice > 0
                    ? ` + $${app.subscriptionPrice}/mo`
                    : ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SelectTypePanel({
  app,
  itemType,
  onTypeChange,
  onBack,
  onSubmit,
  isAdding,
}: {
  app: any;
  itemType: string;
  onTypeChange: (v: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  isAdding: boolean;
}) {
  const hasSubscription = app.subscriptionPrice > 0;

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-semibold"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>{" "}
        Quay lại
      </button>

      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
        <div className="w-16 h-16 rounded-xl bg-white overflow-hidden border border-slate-200 shrink-0">
          <img
            src={app.iconUrl || "https://i.sstatic.net/l60Hf.png"}
            alt={app.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-bold text-slate-800">{app.name}</p>
          <p className="text-xs text-slate-500">{app.developerId?.name}</p>
          <p className="text-sm font-semibold text-blue-600 mt-1">
            {app.price > 0 ? `$${app.price}` : "Miễn phí"}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Chọn loại mua hàng
        </label>
        <div className="space-y-2">
          {app.price > 0 && (
            <label
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${itemType === "one_time" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}
            >
              <input
                type="radio"
                name="itemType"
                value="one_time"
                checked={itemType === "one_time"}
                onChange={() => onTypeChange("one_time")}
                className="accent-blue-600"
              />
              <div>
                <p className="font-semibold text-sm text-slate-800">
                  Mua một lần
                </p>
                <p className="text-xs text-slate-500">
                  Thanh toán ${app.price} một lần, sở hữu vĩnh viễn
                </p>
              </div>
              <span className="ml-auto font-bold text-slate-800">
                ${app.price}
              </span>
            </label>
          )}
          {hasSubscription && (
            <label
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${itemType === "subscription" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}
            >
              <input
                type="radio"
                name="itemType"
                value="subscription"
                checked={itemType === "subscription"}
                onChange={() => onTypeChange("subscription")}
                className="accent-blue-600"
              />
              <div>
                <p className="font-semibold text-sm text-slate-800">Đăng ký</p>
                <p className="text-xs text-slate-500">
                  Thanh toán ${app.subscriptionPrice}/tháng, hủy bất kỳ lúc nào
                </p>
              </div>
              <span className="ml-auto font-bold text-slate-800">
                ${app.subscriptionPrice}/mo
              </span>
            </label>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
        >
          Huỷ
        </button>
        <button
          onClick={onSubmit}
          disabled={isAdding}
          className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {isAdding && (
            <span className="material-symbols-outlined text-sm animate-spin">
              progress_activity
            </span>
          )}
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}

// ===== Cart Item List =====

function CartItemListWrapper({
  items,
  isLoading,
  onRemove,
  onUpdateQuantity,
  onToggleSelect,
  selectedIds,
  onSelectAll,
  removingId,
  updatingId,
}: {
  items: CartItem["items"];
  isLoading: boolean;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onToggleSelect: (id: string) => void;
  selectedIds: string[];
  onSelectAll: () => void;
  removingId?: string;
  updatingId?: string;
}) {
  if (isLoading) return <LoadingSkeleton />;
  if (items.length === 0) return <EmptyCart />;

  const appIds = items
    .map((item) => (item.appId as unknown as CartAppItem)?._id)
    .filter(Boolean) as string[];
  const allSelected = appIds.length > 0 && selectedIds.length === appIds.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <button
          onClick={onSelectAll}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
        </button>
        <span className="text-xs text-on-surface-variant">
          Đã chọn {selectedIds.length}/{appIds.length}
        </span>
      </div>

      {items.map((item) => {
        const app = item.appId as unknown as CartAppItem;
        const appId = app?._id;
        const price =
          item.itemType === "subscription"
            ? app?.subscriptionPrice
            : app?.price;
        return (
          <CartItemCard
            key={item._id}
            item={item}
            app={app}
            price={price || 0}
            isSelected={selectedIds.includes(appId)}
            onToggleSelect={() => onToggleSelect(appId)}
            onIncrease={() => onUpdateQuantity(appId, item.quantity + 1)}
            onDecrease={() => onUpdateQuantity(appId, Math.max(1, item.quantity - 1))}
            isUpdating={updatingId === appId}
            isRemoving={removingId === appId}
            onRemove={() => onRemove(appId)}
          />
        );
      })}
    </div>
  );
}

function CartItemCard({
  item,
  app,
  price,
  isSelected,
  onToggleSelect,
  onIncrease,
  onDecrease,
  isUpdating,
  isRemoving,
  onRemove,
}: {
  item: CartItem["items"][0];
  app: CartAppItem;
  price: number;
  isSelected: boolean;
  onToggleSelect: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  isUpdating: boolean;
  isRemoving: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="flex bg-surface-container-lowest p-4 rounded-xl shadow-sm gap-6 items-center">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggleSelect}
        className="w-4 h-4 accent-blue-600"
      />
      <div className="w-24 h-24 bg-surface-container rounded-lg flex-shrink-0 p-2 overflow-hidden">
        <img
          alt={app?.name || ""}
          className="w-full h-full object-contain"
          src={app?.iconUrl}
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-lg">{app?.name || "N/A"}</h3>
        <p className="text-sm text-on-surface-variant font-medium">
          {item.itemType === "subscription"
            ? `Subscription · ${item.plan}`
            : "Mua một lần"}
        </p>

        <div className="mt-3 inline-flex items-center rounded-lg border border-slate-200 overflow-hidden">
          <button
            onClick={onDecrease}
            disabled={isUpdating || item.quantity <= 1}
            className="px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
          >
            −
          </button>
          <span className="px-3 py-1.5 text-sm font-semibold min-w-10 text-center">
            {item.quantity}
          </span>
          <button
            onClick={onIncrease}
            disabled={isUpdating}
            className="px-3 py-1.5 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          onClick={onRemove}
          disabled={isRemoving}
          className="text-error text-sm font-semibold mt-2 hover:underline disabled:opacity-50 flex items-center gap-1"
        >
          {isRemoving ? "Đang xoá..." : "Xoá"}
        </button>
      </div>
      <div className="text-right">
        <span className="font-bold text-xl">
          {price === 0 ? "Miễn phí" : `$${price}`}
        </span>
      </div>
    </div>
  );
}

// ===== Cart Summary =====

function CartSummary({
  cart,
  isLoading,
  selectedIds,
  onAddApp,
  onClearSelected,
}: {
  cart: CartItem | null | undefined;
  isLoading: boolean;
  selectedIds: string[];
  onAddApp: () => void;
  onClearSelected: () => void;
}) {
  const items = cart?.items || [];

  const selectedItems = items.filter((item) => {
    const app = item.appId as unknown as CartAppItem;
    return selectedIds.includes(app?._id);
  });

  const sourceItems = selectedItems.length > 0 ? selectedItems : items;

  const subtotal = sourceItems.reduce((sum, item) => {
    const app = item.appId as unknown as CartAppItem;
    const price =
      item.itemType === "subscription"
        ? app?.subscriptionPrice || 0
        : app?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="bg-surface-container-low p-8 rounded-3xl sticky top-24 space-y-4">
      <h3 className="text-2xl font-bold mb-2">Tóm tắt đơn hàng</h3>
      <div className="space-y-4 mb-6 border-b border-outline-variant/20 pb-6">
        <div className="flex justify-between text-on-surface-variant">
          <span>
            Tạm tính ({sourceItems.length} sản phẩm
            {selectedItems.length > 0 ? " đã chọn" : ""})
          </span>
          <span className="font-medium text-on-surface">
            {isLoading ? "..." : `$${subtotal.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-on-surface-variant">
          <span>Khuyến mãi</span>
          <span className="font-medium text-error">-$0.00</span>
        </div>
      </div>
      <div className="flex justify-between font-bold text-xl mb-4">
        <span>Tổng cộng</span>
        <span className="text-primary">
          {isLoading ? "..." : `$${subtotal.toFixed(2)}`}
        </span>
      </div>

      {selectedIds.length > 0 && (
        <button
          onClick={onClearSelected}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors"
        >
          <span className="material-symbols-outlined text-base">delete</span>
          Xoá mục đã chọn ({selectedIds.length})
        </button>
      )}

      {/* Nút thêm ứng dụng */}
      <button
        onClick={onAddApp}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-blue-300 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-colors"
      >
        <span className="material-symbols-outlined text-base">add</span>
        Thêm ứng dụng
      </button>

      <a
        href="/checkout"
        className="block w-full text-center bg-primary text-on-primary py-4 rounded-xl font-bold hover:brightness-110 transition-all"
      >
        Tiến hành thanh toán
      </a>
      <p className="text-xs text-on-surface-variant mt-2 text-center">
        Bằng việc thanh toán, bạn đồng ý với Điều khoản dịch vụ của APKBugs
        Store.
      </p>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="text-center py-20">
      <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">
        shopping_cart
      </span>
      <h3 className="text-xl font-bold text-slate-500">Giỏ hàng trống</h3>
      <p className="text-slate-400 mt-2">Hãy thêm ứng dụng vào giỏ hàng</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex bg-surface-container-lowest p-4 rounded-xl gap-6 items-center animate-pulse"
        >
          <div className="w-24 h-24 bg-slate-100 rounded-lg shrink-0" />
          <div className="flex-grow space-y-2">
            <div className="h-5 bg-slate-100 rounded w-1/2" />
            <div className="h-4 bg-slate-100 rounded w-1/3" />
          </div>
          <div className="h-6 bg-slate-100 rounded w-16" />
        </div>
      ))}
    </div>
  );
}
