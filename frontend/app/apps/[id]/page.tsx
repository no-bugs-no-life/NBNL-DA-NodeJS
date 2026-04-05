import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";
import AppDetailHeader from "../../../components/app-details/AppDetailHeader";
import AppOverview from "../../../components/app-details/AppOverview";
import AppScreenshots from "../../../components/app-details/AppScreenshots";
import AppReviews from "../../../components/app-details/AppReviews";
import AppSystemReqs from "../../../components/app-details/AppSystemReqs";
import AppExtraInfo from "../../../components/app-details/AppExtraInfo";
import AppDeveloperInfo from "../../../components/app-details/AppDeveloperInfo";

export default function AppDetailsPage() {
  return (
    <>
      <Navbar />
      <main className="mt-20 max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <AppDetailHeader />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2 space-y-16">
            <AppOverview />
            <AppScreenshots />
            <AppReviews />
          </div>
          <div className="space-y-12">
            <AppSystemReqs />
            <AppExtraInfo />
            <AppDeveloperInfo />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
