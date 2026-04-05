import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Sidebar from "../../components/category/Sidebar";
import GameGrid from "../../components/games/GameGrid";
import { mockGames } from "../../components/games/data";

export default function GamesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6 max-w-[1920px] mx-auto flex flex-col md:flex-row gap-12">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Thế giới Trò chơi
              </h2>
              <p className="text-on-surface-variant mt-2 text-sm">
                Khám phá các tựa game nổi bật, game thịnh hành và phát hành mới
                nhất.
              </p>
            </div>
          </div>
          <GameGrid games={mockGames} />
        </div>
      </main>
      <Footer />
    </>
  );
}
