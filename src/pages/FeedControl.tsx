import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { BsPlus, BsTrash, BsCamera } from "react-icons/bs";
import { FaWeight, FaPlay } from "react-icons/fa";

import {
  API_CONFIG,
  FishFeederApiClient,
  FeedControlRequest,
} from "../config/api";

const FeedControl = () => {
  const [apiClient] = useState(new FishFeederApiClient());
  const [connectionStatus, setConnectionStatus] = useState(
    "Checking connection...",
  );
  const [loading, setLoading] = useState(false);

  // Feed control states
  const [feedType, setFeedType] = useState("small");
  const [feedAmount, setFeedAmount] = useState("100");
  const [currentWeight, setCurrentWeight] = useState(0);
  const [weightBeforeFeed, setWeightBeforeFeed] = useState(0);
  const [lastFeedTime, setLastFeedTime] = useState<string | null>(null);

  // Automatic feeding
  const [automaticFeeding, setAutomaticFeeding] = useState(false);
  const [newScheduleTime, setNewScheduleTime] = useState("");
  const [newScheduleAmount, setNewScheduleAmount] = useState("100");
  const [schedules, setSchedules] = useState([
    { time: "08:00", amount: "100", type: "breakfast" },
    { time: "12:00", amount: "150", type: "lunch" },
    { time: "18:00", amount: "100", type: "dinner" },
  ]);

  // Feed history and statistics
  const [feedHistory, setFeedHistory] = useState<any[]>([]);
  const [feedStatistics, setFeedStatistics] = useState<any>(null);

  useEffect(() => {
    checkConnection();
    fetchCurrentWeight();
    fetchFeedHistory();
    fetchFeedStatistics();

    // Set up intervals for real-time updates
    const weightInterval = setInterval(fetchCurrentWeight, 3000);
    const historyInterval = setInterval(fetchFeedHistory, 30000);
    const statsInterval = setInterval(fetchFeedStatistics, 60000);

    return () => {
      clearInterval(weightInterval);
      clearInterval(historyInterval);
      clearInterval(statsInterval);
    };
  }, []);

  const checkConnection = async () => {
    try {
      const health = await apiClient.checkHealth();

      setConnectionStatus(
        health.serial_connected
          ? "✅ Connected to Pi Server"
          : "⚠️ Pi Server connected, Arduino disconnected",
      );
    } catch (error) {
      setConnectionStatus("❌ Cannot connect to Pi Server");
    }
  };

  const fetchCurrentWeight = async () => {
    try {
      const sensorData = await apiClient.getSensor(
        API_CONFIG.SENSOR_NAMES.HX711_FEEDER,
      );

      if (sensorData?.values) {
        const weightValue = sensorData.values.find(
          (v: any) => v.type === "weight",
        );

        if (weightValue && typeof weightValue.value === "number") {
          setCurrentWeight(weightValue.value);
        }
      }
    } catch (error) {
      console.error("Failed to fetch weight:", error);
    }
  };

  const fetchFeedHistory = async () => {
    try {
      const history = await apiClient.getFeedHistory();

      if (history?.data) {
        setFeedHistory(history.data);
      }
    } catch (error) {
      console.error("Failed to fetch feed history:", error);
      // Fallback mock data
      setFeedHistory([
        { timestamp: new Date().toISOString(), amount: 100, type: "manual" },
        {
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          amount: 150,
          type: "scheduled",
        },
      ]);
    }
  };

  const fetchFeedStatistics = async () => {
    try {
      const stats = await apiClient.getFeedStatistics();

      if (stats) {
        setFeedStatistics(stats);
      }
    } catch (error) {
      console.error("Failed to fetch feed statistics:", error);
      // Fallback mock data
      setFeedStatistics({
        total_amount_today: 350,
        total_feeds_today: 3,
        average_per_feed: 116.7,
      });
    }
  };

  const handleFeedNow = async () => {
    try {
      setLoading(true);

      // Record weight before feeding
      setWeightBeforeFeed(currentWeight);

      // Take photo first
      await apiClient.takePhoto();

      // Execute feeding command
      const feedRequest: FeedControlRequest = {
        action: feedType as any,
        ...(feedType === "custom" && { amount: parseInt(feedAmount) }),
      };

      const success = await apiClient.feedFish(feedRequest);

      if (success) {
        setLastFeedTime(new Date().toLocaleString());

        // Refresh data after feeding
        setTimeout(() => {
          fetchCurrentWeight();
          fetchFeedHistory();
          fetchFeedStatistics();
        }, 2000);
      } else {
        alert("Feed command failed. Please check Pi server connection.");
      }
    } catch (error) {
      console.error("Feed error:", error);
      alert("Feed failed: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = () => {
    if (newScheduleTime && newScheduleAmount) {
      const newSchedule = {
        time: newScheduleTime,
        amount: newScheduleAmount,
        type: "custom",
      };

      setSchedules([...schedules, newSchedule]);
      setNewScheduleTime("");
      setNewScheduleAmount("100");
    }
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const getPresetAmount = (type: string) => {
    switch (type) {
      case "small":
        return "50";
      case "medium":
        return "100";
      case "large":
        return "200";
      default:
        return feedAmount;
    }
  };

  // const handleAutomaticFeedingChange = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   setAutomaticFeeding(e.target.checked);
  // };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              🍽️ Feed Control Center
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manual feeding, schedules, and feed monitoring
            </p>
          </div>
          <div className="text-right text-sm">
            <div
              className={`font-semibold ${
                connectionStatus.includes("✅")
                  ? "text-green-600 dark:text-green-400"
                  : connectionStatus.includes("⚠️")
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-red-600 dark:text-red-400"
              }`}
            >
              {connectionStatus}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              API: {API_CONFIG.BASE_URL}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Manual Feed Control */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-blue-500 dark:text-blue-400 mb-6">
            <FaPlay className="mr-3 text-xl" />
            <h2 className="text-xl font-semibold">Manual Feed</h2>
          </div>

          {/* Feed Type Selection */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Feed Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["small", "medium", "large", "custom"].map((type) => (
                  <button
                    key={type}
                    className={`p-3 rounded-lg font-medium text-sm transition-colors ${
                      feedType === type
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => {
                      setFeedType(type);
                      if (type !== "custom") {
                        setFeedAmount(getPresetAmount(type));
                      }
                    }}
                  >
                    {type === "custom"
                      ? "Custom"
                      : `${type} (${getPresetAmount(type)}g)`}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            {feedType === "custom" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount (grams)
                </label>
                <Input
                  max="500"
                  min="10"
                  placeholder="Enter amount"
                  type="number"
                  value={feedAmount}
                  onChange={(e) => setFeedAmount(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Current Weight Display */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaWeight className="text-purple-500 dark:text-purple-400 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Weight
                </span>
              </div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {currentWeight.toFixed(1)}g
              </div>
            </div>
            {lastFeedTime && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Last feed: {lastFeedTime}
              </div>
            )}
          </div>

          {/* Feed Button */}
          <Button
            className="w-full h-12 text-lg font-medium"
            color="primary"
            isLoading={loading}
            size="lg"
            startContent={<FaPlay />}
            onPress={handleFeedNow}
          >
            Feed Now ({feedAmount}g)
          </Button>

          {/* Take Photo Button */}
          <Button
            className="w-full mt-3"
            size="sm"
            startContent={<BsCamera />}
            variant="bordered"
            onPress={() => apiClient.takePhoto()}
          >
            Take Photo
          </Button>
        </div>

        {/* Automatic Feeding Schedule */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-green-500 dark:text-green-400">
              <BsPlus className="mr-3 text-xl" />
              <h2 className="text-xl font-semibold">Auto Schedule</h2>
            </div>
            <Switch
              isSelected={automaticFeeding}
              onValueChange={setAutomaticFeeding}
            />
          </div>

          {/* Schedule List */}
          <div className="space-y-3 mb-6">
            {schedules.map((schedule, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {schedule.time}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {schedule.amount}g • {schedule.type}
                  </div>
                </div>
                <Button
                  isIconOnly
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={() => handleRemoveSchedule(index)}
                >
                  <BsTrash />
                </Button>
              </div>
            ))}
          </div>

          {/* Add New Schedule */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <Input
                  size="sm"
                  type="time"
                  value={newScheduleTime}
                  onChange={(e) => setNewScheduleTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount (g)
                </label>
                <Input
                  max="500"
                  min="10"
                  placeholder="100"
                  size="sm"
                  type="number"
                  value={newScheduleAmount}
                  onChange={(e) => setNewScheduleAmount(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="w-full"
              color="success"
              size="sm"
              startContent={<BsPlus />}
              onPress={handleAddSchedule}
            >
              Add Schedule
            </Button>
          </div>
        </div>

        {/* Feed Statistics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-purple-500 dark:text-purple-400 mb-6">
            <FaWeight className="mr-3 text-xl" />
            <h2 className="text-xl font-semibold">Feed Statistics</h2>
          </div>

          {feedStatistics ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                  <div className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                    Today's Total
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    {feedStatistics.total_amount_today}g
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                  <div className="text-sm text-green-600 dark:text-green-400 mb-1">
                    Feed Count
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-300">
                    {feedStatistics.total_feeds_today}
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
                  <div className="text-sm text-purple-600 dark:text-purple-400 mb-1">
                    Average per Feed
                  </div>
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-300">
                    {feedStatistics.average_per_feed.toFixed(1)}g
                  </div>
                </div>
              </div>

              {/* Weight Change Indicator */}
              {weightBeforeFeed > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                  <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">
                    Weight Change
                  </div>
                  <div className="text-lg font-bold text-yellow-900 dark:text-yellow-300">
                    {(weightBeforeFeed - currentWeight).toFixed(1)}g dispensed
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <div className="text-4xl mb-2">📊</div>
              <div>Loading statistics...</div>
            </div>
          )}
        </div>
      </div>

      {/* Feed History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            📋 Recent Feed History
          </h2>
          <Button
            size="sm"
            variant="bordered"
            onPress={() => {
              fetchFeedHistory();
              fetchFeedStatistics();
            }}
          >
            🔄 Refresh
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="text-left text-sm font-medium text-gray-700 dark:text-gray-300 pb-3">
                  Time
                </th>
                <th className="text-left text-sm font-medium text-gray-700 dark:text-gray-300 pb-3">
                  Amount
                </th>
                <th className="text-left text-sm font-medium text-gray-700 dark:text-gray-300 pb-3">
                  Type
                </th>
                <th className="text-left text-sm font-medium text-gray-700 dark:text-gray-300 pb-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {feedHistory.length > 0 ? (
                feedHistory.slice(0, 10).map((feed, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 dark:border-gray-700"
                  >
                    <td className="py-3 text-sm text-gray-900 dark:text-gray-100">
                      {new Date(feed.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-gray-100">
                      {feed.amount}g
                    </td>
                    <td className="py-3 text-sm text-gray-900 dark:text-gray-100">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          feed.type === "manual"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        }`}
                      >
                        {feed.type}
                      </span>
                    </td>
                    <td className="py-3 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                    colSpan={4}
                  >
                    No feed history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeedControl;
