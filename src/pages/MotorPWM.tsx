import { useState } from "react";
import { Slider } from "@heroui/slider";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { FaSlidersH, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { HiCog } from "react-icons/hi";
import { RiBlazeFill } from "react-icons/ri";

import {
  API_CONFIG,
  FishFeederApiClient,
  ActuatorControlRequest,
  DirectControlRequest,
  BlowerControlRequest,
} from "../config/api";

// Define the SliderStepMark type based on HeroUI docs
type SliderStepMark = {
  value: number;
  label: string;
};

const MotorPWM = () => {
  // PWM control states
  const [augerPWM, setAugerPWM] = useState(50);
  const [blowerPWM, setBlowerPWM] = useState(70);

  // Actuator control states
  const [actuatorMoving, setActuatorMoving] = useState<
    "up" | "down" | "extend" | "retract" | null
  >(null);

  // Pi server states
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Ready");
  const [apiClient] = useState(new FishFeederApiClient());

  // Direct command states
  const [customCommand, setCustomCommand] = useState("");
  const [commandResponse, setCommandResponse] = useState("");

  // Define slider marks
  const pwmMarks: SliderStepMark[] = [
    { value: 0, label: "0%" },
    { value: 25, label: "25%" },
    { value: 50, label: "50%" },
    { value: 75, label: "75%" },
    { value: 100, label: "100%" },
  ];

  // Handle actuator control via Pi server API
  const handleActuatorControl = async (
    action: ActuatorControlRequest["action"],
  ) => {
    try {
      setLoading(true);
      setConnectionStatus("Sending command...");

      const request: ActuatorControlRequest = { action };
      const response = await apiClient.controlActuator(request);

      console.log(`Actuator ${action} response:`, response);

      if (response.status === "success") {
        setConnectionStatus(`✅ Actuator ${action} successful`);
        setActuatorMoving(action === "stop" ? null : action);
      } else {
        setConnectionStatus(`❌ Actuator ${action} failed`);
      }
    } catch (error) {
      console.error(`Failed to control actuator:`, error);
      setConnectionStatus(`❌ Error: ${error}`);
      // Update local state anyway for demo
      setActuatorMoving(action === "stop" ? null : action);
    } finally {
      setLoading(false);
    }
  };

  // Handle direct Arduino command
  const handleDirectCommand = async (command: string) => {
    try {
      setLoading(true);
      setConnectionStatus("Sending direct command...");

      const request: DirectControlRequest = { command };
      const response = await apiClient.directControl(request);

      console.log(`Direct command response:`, response);

      if (response.status === "success") {
        setConnectionStatus(`✅ Command sent: ${command}`);
        setCommandResponse(JSON.stringify(response, null, 2));
      } else {
        setConnectionStatus(`❌ Command failed: ${command}`);
        setCommandResponse(JSON.stringify(response, null, 2));
      }
    } catch (error) {
      console.error(`Failed to send direct command:`, error);
      setConnectionStatus(`❌ Error: ${error}`);
      setCommandResponse(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle blower control for PWM demo
  const handleBlowerPWM = async (speed: number) => {
    try {
      setLoading(true);
      const request: BlowerControlRequest = { action: "speed", value: speed };
      const response = await apiClient.controlBlower(request);

      if (response.status === "success") {
        setConnectionStatus(`✅ Blower speed set to ${speed}`);
      }
    } catch (error) {
      console.error(`Failed to set blower speed:`, error);
      setConnectionStatus(`❌ Blower control error`);
    } finally {
      setLoading(false);
    }
  };

  // Predefined Arduino commands for quick access
  const quickCommands = [
    { label: "Get All Sensors", command: "S:ALL" },
    { label: "Auger Forward", command: "G:1" },
    { label: "Auger Reverse", command: "G:2" },
    { label: "Auger Stop", command: "G:0" },
    { label: "Blower On", command: "B:1" },
    { label: "Blower Off", command: "B:0" },
    { label: "Relay 1 On", command: "R:1" },
    { label: "Relay 1 Off", command: "R:01" },
    { label: "Relay 2 On", command: "R:2" },
    { label: "Relay 2 Off", command: "R:02" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Motor & PWM Settings
        </h1>
      </div>

      {/* Connection Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Pi Server Status
            </div>
            <div
              className={`font-semibold ${
                connectionStatus.includes("✅")
                  ? "text-green-600 dark:text-green-400"
                  : connectionStatus.includes("❌")
                    ? "text-red-600 dark:text-red-400"
                    : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {connectionStatus}
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            API: {API_CONFIG.BASE_URL}
          </div>
        </div>
      </div>

      {/* PWM Controls Section */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-blue-500 dark:text-blue-400 mb-6">
            <FaSlidersH className="mr-3 text-2xl" />
            <span className="text-xl font-semibold">
              PWM Controls (Arduino Commands)
            </span>
          </div>

          <div className="space-y-10">
            {/* Auger Motor PWM Control */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <HiCog className="text-gray-700 dark:text-gray-300 mr-3 text-xl" />
                <span className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
                  PWM1 → Auger Motor (Speed Control)
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Current Setting
                  </div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {augerPWM}% ({Math.round(augerPWM * 2.55)}/255)
                  </div>
                </div>
              </div>

              <div className="px-2 mb-6">
                <Slider
                  showTooltip
                  aria-label="Auger Motor PWM"
                  className="w-full"
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <Button
                  className="h-12"
                  color="primary"
                  isLoading={loading}
                  size="md"
                  onPress={() =>
                    handleDirectCommand(`SPD:${Math.round(augerPWM * 2.55)}`)
                  }
                >
                  Set Speed
                </Button>
                <Button
                  className="h-12"
                  isLoading={loading}
                  size="md"
                  variant="bordered"
                  onPress={() => handleDirectCommand("G:1")}
                >
                  Forward
                </Button>
                <Button
                  className="h-12"
                  isLoading={loading}
                  size="md"
                  variant="bordered"
                  onPress={() => handleDirectCommand("G:2")}
                >
                  Reverse
                </Button>
                <Button
                  className="h-12"
                  color="danger"
                  isLoading={loading}
                  size="md"
                  variant="bordered"
                  onPress={() => handleDirectCommand("G:0")}
                >
                  Stop
                </Button>
              </div>
            </div>

            {/* Blower Fan PWM Control */}
            <div className="space-y-6 pt-8 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center mb-4">
                <RiBlazeFill className="text-gray-700 dark:text-gray-300 mr-3 text-xl" />
                <span className="text-gray-800 dark:text-gray-200 font-semibold text-lg">
                  PWM2 → Blower Fan (API Control)
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Current Setting
                  </div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {blowerPWM}% ({Math.round(blowerPWM * 2.55)}/255)
                  </div>
                </div>
              </div>

              <div className="px-2 mb-6">
                <Slider
                  showTooltip
                  aria-label="Blower Fan PWM"
                  className="w-full"
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                <Button
                  className="h-12"
                  color="primary"
                  isLoading={loading}
                  size="md"
                  onPress={() => handleBlowerPWM(Math.round(blowerPWM * 2.55))}
                >
                  Set Blower Speed (API)
                </Button>
                <Button
                  className="h-12"
                  isLoading={loading}
                  size="md"
                  variant="bordered"
                  onPress={() => handleDirectCommand("B:1")}
                >
                  Blower On
                </Button>
                <Button
                  className="h-12"
                  color="danger"
                  isLoading={loading}
                  size="md"
                  variant="bordered"
                  onPress={() => handleDirectCommand("B:0")}
                >
                  Blower Off
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actuator Control Section */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-blue-500 dark:text-blue-400 mb-4">
            <HiCog className="mr-2 text-xl animate-spin animate-[spin_3s_linear_infinite]" />
            <span className="text-lg font-medium">
              Linear Actuator Control (Pi Server API)
            </span>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Control the linear actuator using Pi server API endpoints.
          </div>

          <div className="flex justify-center gap-6">
            {/* Up Button */}
            <Button
              className="h-24 w-24 rounded-full flex flex-col items-center justify-center"
              color="primary"
              isLoading={loading && actuatorMoving === "up"}
              onPress={() => handleActuatorControl("up")}
            >
              <FaArrowUp className="text-xl mb-1" />
              <span>UP</span>
              <div
                className={`mt-1 h-2 w-2 rounded-full ${actuatorMoving === "up" ? "bg-green-500" : "bg-gray-300"}`}
              />
            </Button>

            {/* Stop Button */}
            <Button
              className="h-24 w-24 rounded-full flex flex-col items-center justify-center"
              color="warning"
              isLoading={loading}
              onPress={() => handleActuatorControl("stop")}
            >
              <span className="text-xl mb-1">⏹</span>
              <span>STOP</span>
              <div
                className={`mt-1 h-2 w-2 rounded-full ${actuatorMoving === null ? "bg-green-500" : "bg-gray-300"}`}
              />
            </Button>

            {/* Down Button */}
            <Button
              className="h-24 w-24 rounded-full flex flex-col items-center justify-center"
              color="primary"
              isLoading={loading && actuatorMoving === "down"}
              onPress={() => handleActuatorControl("down")}
            >
              <FaArrowDown className="text-xl mb-1" />
              <span>DOWN</span>
              <div
                className={`mt-1 h-2 w-2 rounded-full ${actuatorMoving === "down" ? "bg-green-500" : "bg-gray-300"}`}
              />
            </Button>
          </div>

          <div className="mt-6 text-center">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Actuator Status
            </div>
            <div className="text-md mt-1">
              {actuatorMoving ? (
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Moving {actuatorMoving.toUpperCase()}
                </span>
              ) : (
                <span className="text-gray-600 dark:text-gray-400">
                  Stopped
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Direct Arduino Command Control */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-purple-500 dark:text-purple-400 mb-4">
            <HiCog className="mr-2 text-xl" />
            <span className="text-lg font-medium">Direct Arduino Commands</span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {quickCommands.map((cmd, index) => (
                <Button
                  key={index}
                  className="text-xs"
                  isLoading={loading}
                  size="sm"
                  variant="bordered"
                  onPress={() => handleDirectCommand(cmd.command)}
                >
                  {cmd.label}
                </Button>
              ))}
            </div>

            <div className="mt-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Arduino command (e.g., G:1, SPD:127)"
                  size="sm"
                  value={customCommand}
                  onChange={(e) => setCustomCommand(e.target.value)}
                />
                <Button
                  color="secondary"
                  isLoading={loading}
                  size="sm"
                  onPress={() => {
                    if (customCommand.trim()) {
                      handleDirectCommand(customCommand.trim());
                      setCustomCommand("");
                    }
                  }}
                >
                  Send
                </Button>
              </div>
            </div>

            {commandResponse && (
              <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Response:
                </div>
                <div className="bg-white dark:bg-gray-800 border dark:border-gray-600 rounded p-2 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-auto max-h-32">
                  {commandResponse}
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 text-xs text-blue-800 dark:text-blue-200">
              <div className="font-medium mb-2">
                📋 Available Arduino Commands:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>• S:ALL - Get all sensors</div>
                <div>• G:1/G:2/G:0 - Auger forward/reverse/stop</div>
                <div>• B:1/B:0 - Blower on/off</div>
                <div>• R:1/R:01 - Relay 1 on/off</div>
                <div>• R:2/R:02 - Relay 2 on/off</div>
                <div>• SPD:&lt;val&gt; - Set motor speed (0-255)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status Footer */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        {connectionStatus}
      </div>
    </div>
  );
};

export default MotorPWM;
