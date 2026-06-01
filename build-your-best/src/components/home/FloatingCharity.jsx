import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, X } from "lucide-react";

const FloatingCharityBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50">
      <div className="relative bg-[#00337C] text-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <button
          onClick={() => setVisible(false)}
          className="absolute top-3 right-3 text-white/70 hover:text-white"
          aria-label="Close charity banner"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-5 pr-10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-[#FFD166]" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-white/70 mb-1">
                BYBS Charity Merch Campaign
              </p>

              <h3 className="font-semibold text-lg leading-snug">
                Buy Merch. Build Hope.
              </h3>

              <p className="text-sm text-white/80 mt-1">
                Support our visit to Divine Mercy Charity Home in South Sudan.
              </p>

              <Link
                to="/charity-merch"
                className="inline-flex mt-4 bg-white text-[#00337C] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
              >
                Support the Mission
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCharityBanner;