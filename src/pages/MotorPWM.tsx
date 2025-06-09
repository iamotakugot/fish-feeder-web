import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Slider } from "@heroui/slider";
import { Button } from "@heroui/button";
import { FaSlidersH, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { HiCog } from "react-icons/hi";
import { RiBlazeFill } from "react-icons/ri";

// Define the SliderStepMark type based on HeroUI docs
type SliderStepMark = {
  value: number;
  label: string;
};

const MotorPWM = () => {
  // PWM control states
  const { t } = useTranslation();
  const [augerPWM, setAugerPWM] = useState(50);
  const [blowerPWM, setBlowerPWM] = useState(70);

  // Actuator control states
  const [actuatorMoving, setActuatorMoving] = useState<"up" | "down" | null>(
    null,
  );

  // Refs for button press handling
  // const upButtonPressTimer = useRef<NodeJS.Timeout | null>(null);
  // const downButtonPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Define slider marks
  const pwmMarks: SliderStepMark[] = [
    { value: 0, label: "0%" },
    { value: 25, label: "25%" },
    { value: 50, label: "50%" },
    { value: 75, label: "75%" },
    { value: 100, label: "100%" },
  ];

  // Handle actuator button press
  const handleActuatorButtonDown = (direction: "up" | "down") => {
    setActuatorMoving(direction);

    // In a real application, this would trigger an API call to start moving the actuator
    console.log(`Actuator moving ${direction}`);
  };

  // Handle actuator button release
  const handleActuatorButtonUp = () => {
    setActuatorMoving(null);

    // In a real application, this would trigger an API call to stop the actuator
    console.log("Actuator stopped");
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">{t("Motor & PWM Settings")}</h1>

      {/* PWM Controls Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center text-blue-500 mb-4">
            <FaSlidersH className="mr-2 text-xl" />
            <span className="text-lg font-medium">{t("PWM Controls")}</span>
          </div>

          <div className="space-y-8">
            {/* Auger Motor PWM Control */}
            <div className="space-y-2">
              <div className="flex items-center mb-2">
                <HiCog className="text-gray-700 mr-2 text-lg" />
                <span className="text-gray-800 font-medium">
                  {t("PWM1 → Auger Motor")}
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-500 text-sm">
                  {t("Current Setting")}
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {augerPWM}%
                </div>
              </div>

              <Slider
                showTooltip
                aria-label="Auger Motor PWM"
                className="w-full text-gray-800"
                color="primary"
                marks={pwmMarks}
                maxValue={100}
                minValue={0}
                step={1}
                value={augerPWM}
                onChange={(value: number | number[]) =>
                  setAugerPWM(Number(value))
                }
              />
            </div>

            {/* Blower Fan PWM Control */}
            <div className="space-y-2 pt-4 mb-4">
              <div className="flex items-center mb-2">
                <RiBlazeFill className="text-gray-700 mr-2 text-lg" />
                <span className="text-gray-800 font-medium">
                  {t("PWM2 → Blower Fan")}
                </span>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="text-gray-500 text-sm">Current Setting</div>
                <div className="text-lg font-bold text-blue-600">
                  {blowerPWM}%
                </div>
              </div>

              <Slider
                showTooltip
                aria-label="Blower Fan PWM"
                className="w-full text-gray-800"
                color="primary"
                marks={pwmMarks}
                maxValue={100}
                minValue={0}
                step={1}
                value={blowerPWM}
                onChange={(value: number | number[]) =>
                  setBlowerPWM(Number(value))
                }
              />
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>

      {/* Actuator Control Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <div className="flex items-center text-blue-500 mb-4">
            <HiCog className="mr-2 text-xl animate-spin animate-[spin_3s_linear_infinite]" />
            <span className="text-lg font-medium">
              {t("Manual Actuator Control")}
            </span>
          </div>

          <div className="text-sm text-gray-500 mb-4">
            {t("Press and hold buttons to move the actuator. Release to stop.")}
          </div>

          <div className="flex justify-center gap-6">
            {/* Up Button */}
            <Button
              className="h-24 w-24 rounded-full flex flex-col items-center justify-center"
              color="primary"
              onMouseDown={() => handleActuatorButtonDown("up")}
              onMouseLeave={handleActuatorButtonUp}
              onMouseUp={handleActuatorButtonUp}
              onTouchEnd={handleActuatorButtonUp}
              onTouchStart={() => handleActuatorButtonDown("up")}
            >
              <FaArrowUp className="text-xl mb-1" />
              <span>{t("UP")}</span>
              <div
                className={`mt-1 h-2 w-2 rounded-full ${actuatorMoving === "up" ? "bg-green-500" : "bg-gray-300"}`}
              />
            </Button>

            {/* Down Button */}
            <Button
              className="h-24 w-24 rounded-full flex flex-col items-center justify-center"
              color="primary"
              onMouseDown={() => handleActuatorButtonDown("down")}
              onMouseLeave={handleActuatorButtonUp}
              onMouseUp={handleActuatorButtonUp}
              onTouchEnd={handleActuatorButtonUp}
              onTouchStart={() => handleActuatorButtonDown("down")}
            >
              <FaArrowDown className="text-xl mb-1" />
              <span>{t("DOWN")}</span>
              <div
                className={`mt-1 h-2 w-2 rounded-full ${actuatorMoving === "down" ? "bg-green-500" : "bg-gray-300"}`}
              />
            </Button>
          </div>

          <div className="mt-6 text-center">
            <div className="text-sm font-medium text-gray-700">
              {t("Actuator Status")}
            </div>
            <div className="text-md mt-1">
              {actuatorMoving ? (
                <span className="text-green-600 font-medium">
                  {actuatorMoving === "up" ? t("Moving UP") : t("Moving DOWN")}
                </span>
              ) : (
                <span className="text-gray-600">{t("Stopped")}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotorPWM;
