import { FaTemperatureHigh, FaWeight } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { IoWaterOutline } from "react-icons/io5";
import { MdOutlineWaterDrop } from "react-icons/md";
import { BiBattery } from "react-icons/bi";
import { BsLightningCharge, BsCamera } from "react-icons/bs";
import { TbArrowsCross } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { FaSolarPanel } from "react-icons/fa";
import { MdPower } from "react-icons/md";
import { SiWeightsandbiases } from "react-icons/si";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoUrl, setVideoUrl] = useState("http://localhost:5000/video_feed");
  const fallbackUrl = "https://a9era.pagekite.me/video_feed";

  const handleImageError = () => {
    if (videoUrl === "http://localhost:5000/video_feed") {
      // If localhost fails, try the fallback URL
      setVideoUrl(fallbackUrl);
    } else {
      // If fallback also fails, show error state
      setIsImageLoaded(false);
      setImageError(true);
    }
  };

  return (
    <div className="p-2 max-h-screen">
      <div className="grid grid-cols-12 gap-3">
        {/* Camera Preview */}
        <div className="col-span-12 md:col-span-5 xl:col-span-4 md:row-span-2 xl:row-span-3 aspect-square bg-white rounded-lg shadow-sm p-3 flex flex-col items-center justify-center border border-gray-100">
          {!isImageLoaded && !imageError && (
            <>
              <div className="text-blue-500 text-4xl mb-2">
                <BsCamera />
              </div>
              <h2 className="text-sm text-gray-800 font-semibold mb-1">
                {t("Loading Camera Preview...")}
              </h2>
              <p className="text-xs text-gray-500">
                {t("Please wait while we connect to the camera")}
              </p>
            </>
          )}
          {imageError && (
            <>
              <div className="text-red-500 text-4xl mb-2">
                <BsCamera />
              </div>
              <h2 className="text-sm text-gray-800 font-semibold mb-1">
                {t("Camera Preview Unavailable")}
              </h2>
              <p className="text-xs text-gray-500">
                {t("Unable to connect to camera feed")}
              </p>
            </>
          )}
          <img
            alt="Camera"
            className={`w-full h-full object-contain ${!isImageLoaded ? "hidden" : ""}`}
            src={videoUrl}
            onError={handleImageError}
            onLoad={() => {
              setIsImageLoaded(true);
              setImageError(false);
            }}
          />
        </div>

        {/* Temperature & Humidity Section */}
        <div className="col-span-12 md:col-span-7 xl:col-span-8">
          <h2 className="text-sm font-semibold mb-2 flex items-center">
            <FaTemperatureHigh className="mr-1 text-blue-500" />
            {t("Temperature & Humidity")}
          </h2>
          <div className="grid grid-cols-12 gap-3">
            {/* Temperature */}
            <div className="col-span-6 xl:col-span-4 h-[86px] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm p-3 border border-blue-100">
              <div className="flex items-center text-blue-500 mb-1">
                <FaTemperatureHigh className="mr-1" />
                <span className="text-xs font-medium">{t("Temperature")}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">25.5°C</div>
            </div>

            {/* Humidity */}
            <div className="col-span-6 xl:col-span-4 h-[86px] bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-sm p-3 border border-indigo-100">
              <div className="flex items-center text-indigo-500 mb-1">
                <WiHumidity className="mr-1 text-lg" />
                <span className="text-xs font-medium">{t("Humidity")}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">65%</div>
            </div>

            {/* Water Temperature */}
            <div className="col-span-12 xl:col-span-4 h-[86px] bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg shadow-sm p-3 border border-cyan-100">
              <div className="flex items-center text-cyan-500 mb-1">
                <IoWaterOutline className="mr-1" />
                <span className="text-xs font-medium">
                  {t("Water Temperature")}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800">24°C</div>
            </div>
          </div>
        </div>

        {/* Food Section */}
        <div className="col-span-12 md:col-span-7 xl:col-span-8">
          <h2 className="text-sm font-semibold mb-2 flex items-center">
            <SiWeightsandbiases className="mr-1 text-emerald-500" />
            {t("Food")}
          </h2>
          <div className="grid grid-cols-12 gap-3">
            {/* Food Moisture */}
            <div className="col-span-6 h-[86px] bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg shadow-sm p-3 border border-emerald-100">
              <div className="flex items-center text-emerald-500 mb-1">
                <MdOutlineWaterDrop className="mr-1" />
                <span className="text-xs font-medium">
                  {t("Food Moisture")}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800">75%</div>
            </div>

            {/* Food Weight */}
            <div className="col-span-6 h-[86px] bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-sm p-3 border border-amber-100">
              <div className="flex items-center text-amber-500 mb-1">
                <FaWeight className="mr-1" />
                <span className="text-xs font-medium">{t("Food Weight")}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">2.5kg</div>
            </div>
          </div>
        </div>

        {/* Power System Section */}
        <div className="col-span-12 md:col-span-7 xl:col-span-4">
          <h2 className="text-sm font-semibold mb-2 flex items-center">
            <MdPower className="mr-1 text-blue-500" />
            {t("Power System")}
          </h2>
          <div className="grid grid-cols-12 gap-3">
            {/* System Voltage */}
            <div className="col-span-4 h-[86px] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm p-3 border border-blue-100">
              <div className="flex items-center text-blue-500 mb-1">
                <TbArrowsCross className="mr-1" />
                <span className="text-xs font-medium">{t("Voltage")}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">12.5V</div>
            </div>

            {/* System Current */}
            <div className="col-span-4 h-[86px] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm p-3 border border-blue-100">
              <div className="flex items-center text-blue-500 mb-1">
                <BsLightningCharge className="mr-1" />
                <span className="text-xs font-medium">{t("Current")}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">1.2A</div>
            </div>

            {/* Battery */}
            <div className="col-span-4 h-[86px] bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm p-3 border border-green-100">
              <div className="flex items-center text-green-500 mb-1">
                <BiBattery className="mr-1" />
                <span className="text-xs font-medium">{t("Battery")}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">85%</div>
            </div>
          </div>
        </div>

        {/* Power Solar Section */}
        <div className="col-span-12 md:col-span-5 xl:col-span-4">
          <h2 className="text-sm font-semibold mb-2 flex items-center">
            <FaSolarPanel className="mr-1 text-amber-500" />
            {t("Power Solar")}
          </h2>
          <div className="grid grid-cols-12 gap-3">
            {/* Solar Voltage */}
            <div className="col-span-6 h-[86px] bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-sm p-3 border border-amber-100">
              <div className="flex items-center text-amber-600 mb-1">
                <TbArrowsCross className="mr-1" />
                <span className="text-xs font-medium">{t("Voltage")}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">13.8V</div>
            </div>

            {/* Solar Current */}
            <div className="col-span-6 h-[86px] bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-sm p-3 border border-amber-100">
              <div className="flex items-center text-amber-600 mb-1">
                <BsLightningCharge className="mr-1" />
                <span className="text-xs font-medium">{t("Current")}</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">2.5A</div>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="col-span-12">
          <h2 className="text-sm font-semibold mb-2 flex items-center">
            <IoSettingsOutline className="mr-1 text-purple-500" />
            {t("Status")}
          </h2>
          <div className="grid grid-cols-12 gap-3">
            {/* Last Feed */}
            <div className="col-span-4 h-[86px] bg-white rounded-lg shadow-sm p-3 border border-gray-100">
              <div className="flex items-center text-blue-500 mb-1">
                <MdOutlineWaterDrop className="mr-1" />
                <span className="text-xs font-medium">{t("Last Feed")}</span>
              </div>
              <div className="text-xs space-y-0.5">
                <div className="flex">
                  <span className="text-gray-500 w-14">{t("Time")}:</span>
                  <span className="text-gray-800 font-medium">14:30</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-14">{t("Amount")}:</span>
                  <span className="text-gray-800 font-medium">50g</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="col-span-8 bg-white rounded-lg shadow-sm p-3 border border-gray-100">
              <div className="flex items-center text-purple-500 mb-1">
                <IoSettingsOutline className="mr-1" />
                <span className="text-xs font-medium">
                  {t("System Status")}
                </span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">
                    {t("Relay")}:
                  </span>
                  <span className="text-xs text-green-600 font-medium">ON</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">
                    {t("Fan")}:
                  </span>
                  <span className="text-xs text-red-500 font-medium">OFF</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">
                    {t("Pump")}:
                  </span>
                  <span className="text-xs text-green-600 font-medium">ON</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">
                    {t("Light")}:
                  </span>
                  <span className="text-xs text-red-500 font-medium">OFF</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">
                    {t("Heater")}:
                  </span>
                  <span className="text-xs text-green-600 font-medium">ON</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-1">
                    {t("Filter")}:
                  </span>
                  <span className="text-xs text-green-600 font-medium">ON</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
