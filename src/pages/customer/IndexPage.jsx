import React from "react";
import { menuData } from "../../assets/menuData";
import Hero from "../../component/customer/Hero";
import BrandValue from "../../component/customer/BrandValue";
import PromoCarousel from "../../component/customer/PromoCarousel";
import OrderStep from "../../component/customer/OrderStep";
import FinalCTA from "../../component/customer/FinalCTA";
import Footer from "../../component/customer/Footer";
import InteractivePoolGrid from "../../component/customer/InteractivePoolGrid";

export default function IndexPage({ t }) {
  const topSales = menuData?.filter((item) => item.badge === "top-sale") || [];
  const newUpdates = menuData?.filter((item) => item.badge === "new") || [];
  const promotions = menuData?.filter((item) => item.badge === "promo") || [];

  const highlightItems = [
    ...promotions.slice(0, 1),
    ...topSales.slice(0, 2),
    ...newUpdates.slice(0, 1),
  ];

  return (
    <div className="bg-[#eeeeee] min-h-screen flex flex-col font-['IBM_Plex_Sans_Thai']">
      <div className="w-full bg-[#242424] pt-24 pb-8">
        <Hero />
      </div>

      <main className="flex-1 w-full flex flex-col">
        <BrandValue />

        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-12 mb-12">
          {highlightItems.length > 0 && (
            <PromoCarousel
              title="SERIOUS SELECTIONS"
              items={highlightItems}
              t={t}
            />
          )}
        </div>

        <OrderStep />
      </main>

      {/* Interactive Grid แบบลายน้ำกระเพื่อม ครอบส่วนจบของเว็บ */}
      <InteractivePoolGrid>
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-20">
          <FinalCTA />
        </div>
        <div className="w-full mt-20">
          <Footer />
        </div>
      </InteractivePoolGrid>
    </div>
  );
}
