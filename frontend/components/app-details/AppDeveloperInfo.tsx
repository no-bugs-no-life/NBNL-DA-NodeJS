export default function AppDeveloperInfo() {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
      <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">
        Nhà phát triển
      </h3>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center p-2">
          <img
            alt="Adobe Logo"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIeKmw-DBENAda1uk1gTKwSVB_3GyL75Hs3GczCn4g6zNs_CBcQbjC2uJdV2Z8UK8BM3OXE2G0piCIujpw5yQb-dPsJLKchI8vLneFW7WJbDJus8RVxpJ6z1jS3Ln_dL1-iK24JoYJ3mUQ_PjXyLJuB-KjErmfT1ZaYo6YGaLT_76BPsF3B3yE-dR-EGnZxb2AYwI48cu_PIMbwbhKXcnOhVhzyRVIDuAJMAacARRbyS1066Sm4AU2LKG3zFAhUGm_twf4Du9JecU"
          />
        </div>
        <div>
          <p className="font-bold">Adobe Inc.</p>
          <a
            className="text-primary text-sm font-medium hover:underline"
            href="#"
          >
            Xem tất cả ứng dụng
          </a>
        </div>
      </div>
    </div>
  );
}
