import Image from "next/image";
import Header from "./component/Header";
import SignIn from "./component/sigin/SignIn";
import { HeroSection } from "./component/landingpage/HeroSection";
import { SignInSection } from "./component/sigin/SignInSection";
import { FeaturesSection } from "./component/landingpage/features/FeaturesSection";
import { CTASection } from "./component/landingpage/features/CTASection";
import { Footer } from "./component/Footer";




export default function Home() {
  return (
    <main className="bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-900 ease-in-out min-h-screen">

      <Header />
      <HeroSection />
      <SignInSection />
      <FeaturesSection />
      {/* <CTASection/> */}
      <Footer />
    </main>

  );
}
