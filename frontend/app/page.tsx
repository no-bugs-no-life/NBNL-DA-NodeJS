import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HomeHero from "../components/home/HomeHero";
import HomeTrending from "../components/home/HomeTrending";
import HomeGames from "../components/home/HomeGames";
import HomeCollections from "../components/home/HomeCollections";
import HomeProductivity from "../components/home/HomeProductivity";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-12">
        <HomeHero />
        <HomeTrending />
        <HomeGames />
        <HomeCollections />
        <HomeProductivity />
      </main>
      <Footer />
    </>
  );
}
