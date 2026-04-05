import Link from "next/link";

export default function HomeGames() {
  return (
    <section className="px-8 max-w-screen-2xl mx-auto mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Best-selling Games
        </h2>
        <Link
          href="/category"
          className="text-primary font-semibold text-sm flex items-center gap-1 hover:underline"
        >
          See all{" "}
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Link
          href="/apps/game1"
          className="flex flex-col gap-3 group cursor-pointer block"
        >
          <div className="aspect-[3/4] rounded-lg overflow-hidden relative shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1">
            <img
              className="w-full h-full object-cover"
              alt="game cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuVekkR9i2ZjPdGuSPvTTv8XDPUbpnNT7aXdR4J6Zd_VrNZUrrfDhPPp4jT4Cz8AuRAT8rJDFmeH2DhcP4jK06DeN14QZV8DzOBVwi4pygu8vM0tKcl55TqNK6vKuZKw01TWnLeO-sQ4b-sYFlKrIP8zbE1ZYJrlgejLyL09VmSKSn7kZ6pTsq5mHZ1eX8jXs9p3HbBfgtSTPCXTdm8qtx-ZFYPK-skoCUm1m-I9ebMt--UymayzZyJ6wbVL1UA9VP5_rMYBzbbD8"
            />
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold">
              GAME PASS
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm truncate">Cyber Odyssey</h4>
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">$59.99</span>
              <div className="flex items-center text-amber-500 text-[10px]">
                <span
                  className="material-symbols-outlined text-[10px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="ml-0.5">4.8</span>
              </div>
            </div>
          </div>
        </Link>
        <Link
          href="/apps/game2"
          className="flex flex-col gap-3 group cursor-pointer block"
        >
          <div className="aspect-[3/4] rounded-lg overflow-hidden relative shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1">
            <img
              className="w-full h-full object-cover"
              alt="fantasy landscape"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNKTdrQ6P4cMYKpL9rxfveN2jxSIcRLUhnFzcy6zlE-LZFHHMx6weB7q6GnWWwLr6E9NTtMPMTDOhvS316X5Bfc5750W6V8Gd08ZgNdf-xnbYSK-eYrDaAI0vbtSO1jiKdADoDsMRa_Lco2dsht7TgWrBQ3qaqx2mW6-l0rf_va6TQWTTTM0OQH21hTO6n8Hvac_GetYQVsWqQuZgFCOFwRyDV1AiOwSa4BnbrDJ6rn6wH9RDhpySrCr1uuWOHrJbPhw2Fue7Ehds"
            />
          </div>
          <div>
            <h4 className="font-bold text-sm truncate">Ethereal Realm</h4>
            <div className="flex items-center justify-between">
              <span className="text-xs text-tertiary font-bold">Free</span>
              <div className="flex items-center text-amber-500 text-[10px]">
                <span
                  className="material-symbols-outlined text-[10px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="ml-0.5">4.6</span>
              </div>
            </div>
          </div>
        </Link>
        <Link
          href="/apps/game3"
          className="flex flex-col gap-3 group cursor-pointer block"
        >
          <div className="aspect-[3/4] rounded-lg overflow-hidden relative shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1">
            <img
              className="w-full h-full object-cover"
              alt="action scene"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDn7YwC8z_9E-eTxc-2wHpCiiILXZwaiFKEOwn4KFCic6pWmMsathQFQFGtjNpH971k9S9hWI2kDx3utieM4oGLWz_POp3hlerxQ0XcdAMIT1YyWEDr8zfc2rmBHSbLRadVF-LsqTJCpIE0ZEqYZqDZCGEdjkgAFO3PrFi37bp4CFteDU-7OgDT0q84qQkL3obGo-dQvnUKnLDsIBFRDPD0x-E9RNEoINDrOqN-O7HmeiGZ8L5O9wR8xDS6s5NW0yswJMNNEfz6yo"
            />
          </div>
          <div>
            <h4 className="font-bold text-sm truncate">Tactical Strike</h4>
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">$29.99</span>
              <div className="flex items-center text-amber-500 text-[10px]">
                <span
                  className="material-symbols-outlined text-[10px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="ml-0.5">4.4</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Keeping repetitive game cards slightly shorter here by using the link structure */}
        <Link
          href="/apps/game4"
          className="flex flex-col gap-3 group cursor-pointer block"
        >
          <div className="aspect-[3/4] rounded-lg overflow-hidden relative shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1">
            <img
              className="w-full h-full object-cover"
              alt="racing car"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1zYy0yUK2JHvV5rwfQ9h9rtaKvd6GebSYJlbO6wE062thHNhAzOuWpdfeJWRYh-Fe1v41z7w8xbVME_mw8fR4_Zpk1i6VubBKuziSELOO4Ga3NaMxm0uKfgoXdnLgv9biFbXULjMj0SM4yfohpDLg6oT5vFq0U15FxLAf2ypz4Kc4az4gfUo9H6mUJIDlOSsaf9XcvsaDF7MmYTR3NUy7BcRrlautVpzJLAjPVae7aCEmyX-rfgwSprstbpzGOYmN97_w7uyMsDc"
            />
          </div>
          <div>
            <h4 className="font-bold text-sm truncate">Velocity X</h4>
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">$19.99</span>
              <div className="flex items-center text-amber-500 text-[10px]">
                <span
                  className="material-symbols-outlined text-[10px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="ml-0.5">4.7</span>
              </div>
            </div>
          </div>
        </Link>
        <Link
          href="/apps/game5"
          className="flex flex-col gap-3 group cursor-pointer block"
        >
          <div className="aspect-[3/4] rounded-lg overflow-hidden relative shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1">
            <img
              className="w-full h-full object-cover"
              alt="fantasy character"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJugrmz7eD_g9plkvzUAbrHSCv9UHjWVAE3gGtuJrcOulzLJxVpK25lAhrglRgGrCjFzdtgiXgNFgXqf7BiTcusp4DASVTkHbsWQzmqQ9iE7oRZUlnGYBJ1wtdHTaiWeo4HCC94mcPezQWKdja3ShgHC-r4ofHMDyGEG8g5sb_l_kDOkftoj9EgcvUhehTcg4Y6qiu8A3zzucKdbVB3MrQkSctfz_CCxmaKbclCv_ppzM22DEslj-0EAx_r3ZfOF9yjUIyQAGLQPg"
            />
          </div>
          <div>
            <h4 className="font-bold text-sm truncate">Wonder Woods</h4>
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">$14.99</span>
              <div className="flex items-center text-amber-500 text-[10px]">
                <span
                  className="material-symbols-outlined text-[10px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="ml-0.5">4.9</span>
              </div>
            </div>
          </div>
        </Link>
        <Link
          href="/apps/game6"
          className="flex flex-col gap-3 group cursor-pointer block"
        >
          <div className="aspect-[3/4] rounded-lg overflow-hidden relative shadow-md group-hover:shadow-xl transition-all group-hover:-translate-y-1">
            <img
              className="w-full h-full object-cover"
              alt="gothic cathedral"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZ6YazAQ-bc6xUh7NAYzTUVmA6j0EcuCr0wXLOsPd3PJST1pk-tL-yQa6Y_fjx36KpqgSqTVFFgMp--eOnNCGlTVmOjod9dFcNCKD_rKzL2umNjcgCJJAwT7Jd9bujyqAYOM9Dx5yrM6f0SFmiRQxDFDyRp8dwrl3cZ0FJg4tJxiWVECMPhpyF3w72uApmLWKUyN0qDi_doxEV6vyZMFHdZcstIddBzpj39kx1dFRL62M1syna1ENS-3JkpRnlEZ9OoDJYe72yR5c"
            />
          </div>
          <div>
            <h4 className="font-bold text-sm truncate">Gothic Legends</h4>
            <div className="flex items-center justify-between">
              <span className="text-xs text-tertiary font-bold">Free</span>
              <div className="flex items-center text-amber-500 text-[10px]">
                <span
                  className="material-symbols-outlined text-[10px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="ml-0.5">4.5</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
