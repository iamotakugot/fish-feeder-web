import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import {
  // IoMdSettings,
  IoMdWifi,
  IoMdNotifications,
  IoMdSave,
  IoMdRefresh,
} from "react-icons/io";
import {
  // FaTemperatureHigh,
  FaWeight,
  // FaClock,
  FaDatabase,
} from "react-icons/fa";

const Settings = () => {
  // System Settings
  const [feedingSettings, setFeedingSettings] = useState({
    autoFeedingEnabled: true,
    defaultFeedAmount: "100",
    feedingInterval: "8",
    lowFoodAlert: "20",
    temperatureAlert: "30",
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    feedingAlerts: true,
    temperatureAlerts: true,
    lowFoodAlerts: true,
    systemAlerts: true,
    emailNotifications: false,
  });

  // Network Settings
  const [networkSettings, setNetworkSettings] = useState({
    wifiSSID: "FishFeeder_WiFi",
    piServerIP: "192.168.1.100",
    apiPort: "5000",
    updateInterval: "3",
  });

  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string>("");

  const handleSaveSettings = async () => {
    setSaving(true);

    try {
      // Simulate API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setLastSaved(new Date().toLocaleTimeString());

      // Show success message
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      setFeedingSettings({
        autoFeedingEnabled: true,
        defaultFeedAmount: "100",
        feedingInterval: "8",
        lowFoodAlert: "20",
        temperatureAlert: "30",
      });

      setNotifications({
        feedingAlerts: true,
        temperatureAlerts: true,
        lowFoodAlerts: true,
        systemAlerts: true,
        emailNotifications: false,
      });

      setNetworkSettings({
        wifiSSID: "FishFeeder_WiFi",
        piServerIP: "192.168.1.100",
        apiPort: "5000",
        updateInterval: "3",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              ⚙️ System Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Configure your fish feeder system preferences
            </p>
          </div>
          {lastSaved && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last saved: {lastSaved}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feeding Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-blue-500 dark:text-blue-400 mb-6">
            <FaWeight className="mr-3 text-xl" />
            <h2 className="text-xl font-semibold">Feeding Settings</h2>
          </div>

          <div className="space-y-6">
            {/* Auto Feeding Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Automatic Feeding
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enable scheduled feeding
                </p>
              </div>
              <Switch
                isSelected={feedingSettings.autoFeedingEnabled}
                onValueChange={(checked) =>
                  setFeedingSettings((prev) => ({
                    ...prev,
                    autoFeedingEnabled: checked,
                  }))
                }
              />
            </div>

            {/* Default Feed Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Feed Amount (grams)
              </label>
              <Input
                max="500"
                min="10"
                placeholder="100"
                type="number"
                value={feedingSettings.defaultFeedAmount}
                onChange={(e) =>
                  setFeedingSettings((prev) => ({
                    ...prev,
                    defaultFeedAmount: e.target.value,
                  }))
                }
              />
            </div>

            {/* Feeding Interval */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Feeding Interval (hours)
              </label>
              <Input
                max="24"
                min="1"
                placeholder="8"
                type="number"
                value={feedingSettings.feedingInterval}
                onChange={(e) =>
                  setFeedingSettings((prev) => ({
                    ...prev,
                    feedingInterval: e.target.value,
                  }))
                }
              />
            </div>

            {/* Alert Thresholds */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Low Food Alert (%)
                </label>
                <Input
                  max="50"
                  min="5"
                  placeholder="20"
                  type="number"
                  value={feedingSettings.lowFoodAlert}
                  onChange={(e) =>
                    setFeedingSettings((prev) => ({
                      ...prev,
                      lowFoodAlert: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Temperature Alert (°C)
                </label>
                <Input
                  max="40"
                  min="25"
                  placeholder="30"
                  type="number"
                  value={feedingSettings.temperatureAlert}
                  onChange={(e) =>
                    setFeedingSettings((prev) => ({
                      ...prev,
                      temperatureAlert: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-purple-500 dark:text-purple-400 mb-6">
            <IoMdNotifications className="mr-3 text-xl" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {key
                      .split(/(?=[A-Z])/)
                      .join(" ")
                      .replace(/^\w/, (c) => c.toUpperCase())}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {key === "feedingAlerts" &&
                      "Get notified about feeding events"}
                    {key === "temperatureAlerts" &&
                      "Alerts for temperature changes"}
                    {key === "lowFoodAlerts" &&
                      "Notifications when food is low"}
                    {key === "systemAlerts" && "System status notifications"}
                    {key === "emailNotifications" && "Send alerts via email"}
                  </p>
                </div>
                <Switch
                  isSelected={value}
                  onValueChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, [key]: checked }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Network Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-green-500 dark:text-green-400 mb-6">
            <IoMdWifi className="mr-3 text-xl" />
            <h2 className="text-xl font-semibold">Network Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                WiFi SSID
              </label>
              <Input
                placeholder="Enter WiFi network name"
                value={networkSettings.wifiSSID}
                onChange={(e) =>
                  setNetworkSettings((prev) => ({
                    ...prev,
                    wifiSSID: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pi Server IP Address
              </label>
              <Input
                placeholder="192.168.1.100"
                value={networkSettings.piServerIP}
                onChange={(e) =>
                  setNetworkSettings((prev) => ({
                    ...prev,
                    piServerIP: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Port
                </label>
                <Input
                  placeholder="5000"
                  value={networkSettings.apiPort}
                  onChange={(e) =>
                    setNetworkSettings((prev) => ({
                      ...prev,
                      apiPort: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Update Interval (sec)
                </label>
                <Input
                  max="60"
                  min="1"
                  placeholder="3"
                  type="number"
                  value={networkSettings.updateInterval}
                  onChange={(e) =>
                    setNetworkSettings((prev) => ({
                      ...prev,
                      updateInterval: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-orange-500 dark:text-orange-400 mb-6">
            <FaDatabase className="mr-3 text-xl" />
            <h2 className="text-xl font-semibold">System Information</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    App Version:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    v2.1.0
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Build Date:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    2024-01-15
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Database Size:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    2.4 MB
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Feeds:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    1,247
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Uptime:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    15 days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Last Backup:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Today
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <Button
                className="w-full"
                size="sm"
                startContent={<FaDatabase />}
                variant="bordered"
              >
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            startContent={<IoMdRefresh />}
            variant="bordered"
            onPress={handleResetToDefaults}
          >
            Reset to Defaults
          </Button>
          <Button
            color="primary"
            isLoading={saving}
            startContent={<IoMdSave />}
            onPress={handleSaveSettings}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
