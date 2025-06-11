import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import {
  // IoMdSettings,
  IoMdWifi,
  IoMdNotifications,
  IoMdSave,
  IoMdRefresh,
  IoMdTrash,
  IoMdDownload,
  IoMdCloudUpload,
} from "react-icons/io";
import {
  // FaTemperatureHigh,
  FaWeight,
  // FaClock,
  FaDatabase,
  FaCog,
  FaShieldAlt,
} from "react-icons/fa";
import { MdInfo, MdAutoDelete, MdBackup } from "react-icons/md";

const Settings = () => {
  const navigate = useNavigate();

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

  // System Maintenance Settings
  const [maintenanceSettings, setMaintenanceSettings] = useState({
    autoBackup: true,
    backupInterval: "24",
    dataRetention: "30",
    debugMode: false,
    performanceMonitoring: true,
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

      setMaintenanceSettings({
        autoBackup: true,
        backupInterval: "24",
        dataRetention: "30",
        debugMode: false,
        performanceMonitoring: true,
      });
    }
  };

  const handleClearData = () => {
    if (confirm("⚠️ This will clear all feeding history and logs. Are you sure?")) {
      localStorage.clear();
      alert("Data cleared successfully!");
    }
  };

  const handleExportData = () => {
    const data = {
      feedingSettings,
      notifications,
      maintenanceSettings,
      exportDate: new Date().toISOString(),
      version: "v2.1.0"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fish-feeder-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBackupData = async () => {
    try {
      alert("Backup initiated! Data will be saved to Firebase.");
      // Here you would implement actual backup to Firebase
    } catch (error) {
      alert("Backup failed. Please try again.");
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
                  max="50"
                  min="10"
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
                    {key === "feedingAlerts" && "Feeding Alerts"}
                    {key === "temperatureAlerts" && "Temperature Alerts"}
                    {key === "lowFoodAlerts" && "Low Food Alerts"}
                    {key === "systemAlerts" && "System Alerts"}
                    {key === "emailNotifications" && "Email Notifications"}
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

        {/* System Maintenance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-green-500 dark:text-green-400 mb-6">
            <FaCog className="mr-3 text-xl" />
            <h2 className="text-xl font-semibold">System Maintenance</h2>
          </div>

          <div className="space-y-4">
            {/* Auto Backup */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auto Backup
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Automatically backup system data
                </p>
              </div>
              <Switch
                isSelected={maintenanceSettings.autoBackup}
                onValueChange={(checked) =>
                  setMaintenanceSettings((prev) => ({
                    ...prev,
                    autoBackup: checked,
                  }))
                }
              />
            </div>

            {/* Backup Interval */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Backup Interval (hours)
              </label>
              <Input
                max="168"
                min="1"
                placeholder="24"
                type="number"
                value={maintenanceSettings.backupInterval}
                onChange={(e) =>
                  setMaintenanceSettings((prev) => ({
                    ...prev,
                    backupInterval: e.target.value,
                  }))
                }
              />
            </div>

            {/* Data Retention */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Retention (days)
              </label>
              <Input
                max="365"
                min="7"
                placeholder="30"
                type="number"
                value={maintenanceSettings.dataRetention}
                onChange={(e) =>
                  setMaintenanceSettings((prev) => ({
                    ...prev,
                    dataRetention: e.target.value,
                  }))
                }
              />
            </div>

            {/* Debug Mode */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Debug Mode
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Enable detailed logging
                </p>
              </div>
              <Switch
                isSelected={maintenanceSettings.debugMode}
                onValueChange={(checked) =>
                  setMaintenanceSettings((prev) => ({
                    ...prev,
                    debugMode: checked,
                  }))
                }
              />
            </div>

            {/* Performance Monitoring */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Performance Monitoring
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Track system performance
                </p>
              </div>
              <Switch
                isSelected={maintenanceSettings.performanceMonitoring}
                onValueChange={(checked) =>
                  setMaintenanceSettings((prev) => ({
                    ...prev,
                    performanceMonitoring: checked,
                  }))
                }
              />
            </div>

            {/* Maintenance Actions */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600 space-y-3">
              <Button
                className="w-full"
                color="secondary"
                size="sm"
                startContent={<MdBackup />}
                variant="bordered"
                onPress={handleBackupData}
              >
                Manual Backup
              </Button>
              <Button
                className="w-full"
                color="warning"
                size="sm"
                startContent={<IoMdDownload />}
                variant="bordered"
                onPress={handleExportData}
              >
                Export Settings
              </Button>
              <Button
                className="w-full"
                color="danger"
                size="sm"
                startContent={<IoMdTrash />}
                variant="bordered"
                onPress={handleClearData}
              >
                Clear All Data
              </Button>
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
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <FaShieldAlt className="text-green-500" />
                <span>System Status: Online & Secure</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '95%'}}></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">System Health: 95%</p>
            </div>
          </div>
        </div>

        {/* About & Project Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-purple-500 dark:text-purple-400 mb-6">
            <MdInfo className="mr-3 text-xl" />
            <h2 className="text-xl font-semibold">เกี่ยวกับโปรเจค</h2>
          </div>

          <div className="space-y-4">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Stand-Alone Automatic Fish Feeder
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                using Internet of Things
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                วิศวกรรมไฟฟ้าอุตสาหกรรม มหาวิทยาลัยเทคโนโลยีสุรนารี
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                รายชื่อคณะผู้จัดทำ
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="font-mono text-blue-600 dark:text-blue-400">B6523404</div>
                  <div className="text-gray-700 dark:text-gray-300">นายพีรวัตน์ กองสอน</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="font-mono text-blue-600 dark:text-blue-400">B6523442</div>
                  <div className="text-gray-700 dark:text-gray-300">นายภักรพงษ์ พิศพิง</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="font-mono text-blue-600 dark:text-blue-400">B6523497</div>
                  <div className="text-gray-700 dark:text-gray-300">นายสุรวิชั แสนกวีสุข</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <Button
                className="w-full"
                color="secondary"
                size="sm"
                startContent={<MdInfo />}
                variant="bordered"
                onPress={() => {
                  localStorage.removeItem("splash-seen");
                  navigate("/splash");
                }}
              >
                ดู Splash Screen อีกครั้ง
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
