import AppStats from "./AppStats";

export default function AppDetailHeader() {
  return (
    <header className="relative py-12 flex flex-col md:flex-row items-start gap-10">
      <div className="w-48 h-48 rounded-[32px] bg-white shadow-xl flex-shrink-0 flex items-center justify-center p-4">
        <img
          alt="Adobe Photoshop Logo"
          className="w-full h-full object-contain"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCae2BgwTaS1UNAnXhe2rBFaF4xGuLmY_ph14CUhreqQS26LD0iD_V6g1IWuQtXBqRZGyIkj0Gp5ItLGgZ7Rk4LvHmv3KM25nx4tLvudtoCOL_4e4MVoc4kvF0A_ghWRoP6-L5wJFvHV4FJ2e4ZBHNAb36iaIrrK1cLNuJKF26aHVIEdl7Nu_OmSya-KPKnpi02Kv1smpp6l9So71GM53ViB7u3Fwc2-ZgYOaHL77ingE9hNNifTxs-QFa0bsggXc8YeHNzbsk-5JQ"
        />
      </div>
      <div className="flex-grow space-y-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight text-on-background mb-2">
            Adobe Photoshop
          </h1>
          <p className="text-xl text-primary font-medium">Adobe Inc.</p>
        </div>
        <AppStats />
        <div className="flex gap-4 items-center">
          <button className="primary-cta text-on-primary px-10 py-3 rounded-lg font-semibold text-lg shadow-lg hover:brightness-110 transition-all scale-95 duration-150 ease-in-out active:scale-90">
            Tải về ngay
          </button>
          <button className="bg-surface-container-high text-on-surface px-6 py-3 rounded-lg font-semibold text-lg hover:bg-surface-dim transition-colors">
            Dùng thử miễn phí
          </button>
        </div>
      </div>
    </header>
  );
}
