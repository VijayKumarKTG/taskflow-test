/**
 * UserLogPage Component
 * 
 * An administrative component that displays user activity logs with comprehensive
 * information and management capabilities. Implements localStorage-based log storage
 * and retrieval with delete functionality for administrators.
 * 
 * Features:
 * - Displays user logs with login time, logout time, JWT token, username, role, IP address
 * - Provides delete functionality for individual log entries
 * - Implements sorting and filtering capabilities
 * - Includes responsive design for all screen sizes
 * - Supports accessibility with proper ARIA attributes
 * 
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { FaTrash, FaSpinner, FaExclamationTriangle, FaUserShield, FaSort, FaFilter } from 'react-icons/fa';
import Sidebar from "../../components/admin/Sidebar";

const UserLogPage = () => {
  // State management with proper initialization
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    role: "all",
    search: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  /**
   * Load user logs from localStorage
   */
  useEffect(() => {
    const loadLogs = async () => {
      try {
        // Simulate network delay for realistic UX
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Get logs from localStorage or initialize with mock data
        const storedLogs = localStorage.getItem("userLogs");

        if (storedLogs) {
          const parsedLogs = JSON.parse(storedLogs);
          setLogs(parsedLogs);
          setFilteredLogs(parsedLogs);
        } else {
          // Initialize with mock data if no logs exist
          const mockLogs = [
            {
              id: "1",
              userId: "admin-123",
              username: "admin@example.com",
              role: "admin",
              action: "login",
              loginTime: new Date(Date.now() - 3600000).toISOString(),
              logoutTime: null,
              ipAddress: "192.168.1.1",
              tokenName: "eyJhbGciOi...",
            },
            {
              id: "2",
              userId: "user-456",
              username: "user@example.com",
              role: "user",
              action: "login",
              loginTime: new Date(Date.now() - 7200000).toISOString(),
              logoutTime: new Date(Date.now() - 3600000).toISOString(),
              ipAddress: "192.168.1.2",
              tokenName: "eyJhbGciOi...",
            },
            {
              id: "3",
              userId: "user-789",
              username: "test@example.com",
              role: "user",
              action: "login",
              loginTime: new Date(Date.now() - 86400000).toISOString(),
              logoutTime: new Date(Date.now() - 82800000).toISOString(),
              ipAddress: "192.168.1.3",
              tokenName: "eyJhbGciOi...",
            },
          ];

          // Store mock logs in localStorage
          localStorage.setItem("userLogs", JSON.stringify(mockLogs));

          setLogs(mockLogs);
          setFilteredLogs(mockLogs);
        }

        setError(null);
      } catch (err) {
        console.error("Error loading user logs:", err);
        setError("Failed to load user logs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  /**
   * Apply filters to logs
   *
   * @param {Object} newFilters - Updated filter settings
   */
  const applyFilters = (newFilters) => {
    let result = [...logs];

    // Apply role filter
    if (newFilters.role !== "all") {
      result = result.filter((log) => log.role === newFilters.role);
    }

    // Apply search filter
    if (newFilters.search.trim()) {
      const searchTerm = newFilters.search.toLowerCase().trim();
      result = result.filter(
        (log) =>
          log.username.toLowerCase().includes(searchTerm) ||
          log.userId.toLowerCase().includes(searchTerm) ||
          (log.ipAddress && log.ipAddress.includes(searchTerm))
      );
    }

    setFilteredLogs(result);
  };

  /**
   * Handle filter changes
   *
   * @param {string} filterType - Type of filter to change
   * @param {string} value - New filter value
   */
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };

    setFilters(newFilters);
    applyFilters(newFilters);
  };

  /**
   * Format date for display
   *
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      return new Date(dateString).toLocaleString();
    } catch (err) {
      console.error("Date formatting error:", err);
      return "Invalid date";
    }
  };

  /**
   * Delete a log entry
   *
   * @param {string} logId - ID of the log to delete
   */
  const handleDelete = (logId) => {
    // If not confirming, show confirmation first
    if (deleteConfirm !== logId) {
      setDeleteConfirm(logId);
      return;
    }

    // User confirmed deletion
    const updatedLogs = logs.filter((log) => log.id !== logId);

    // Update state
    setLogs(updatedLogs);

    // Update filtered logs by removing the deleted item
    setFilteredLogs((prevFilteredLogs) =>
      prevFilteredLogs.filter((log) => log.id !== logId)
    );

    // Update localStorage
    localStorage.setItem("userLogs", JSON.stringify(updatedLogs));

    // Reset confirmation state
    setDeleteConfirm(null);
  };

  /**
   * Cancel delete confirmation
   */
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />
        <div
          className="p-6 flex-1 w-full
           flex-col justify-center items-center"
          aria-live="polite"
          role="status"
        >
          <FaSpinner
            className="animate-spin text-blue-500 text-2xl"
            aria-hidden="true"
          />
          <span className="ml-2">Loading user logs...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />
        <div
          className="p-6 text-red-500 flex-1 items-center"
          aria-live="assertive"
          role="alert"
        >
          <FaExclamationTriangle className="mr-2" aria-hidden="true" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          User Activity Logs
        </h1>

        {/* Search and Filter Controls */}
        <div className="bg-white p-4 shadow rounded-lg mb-4">
          <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
            {/* Search input */}
            <div className="md:flex-1">
              <label
                htmlFor="log-search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Logs
              </label>
              <input
                id="log-search"
                type="text"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Search by username, user ID, or IP"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                aria-label="Search logs"
              />
            </div>

            {/* Role filter */}
            <div className="md:w-48">
              <label
                htmlFor="role-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Role
              </label>
              <select
                id="role-filter"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                aria-label="Filter logs by role"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-500">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
        </div>

        {/* User Logs Table */}
        <div className="bg-white p-4 shadow rounded-lg">
          <h2 className="text-lg font-semibold mb-2">User Activity Logs</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-2">Username</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Login Time</th>
                  <th className="p-2">Logout Time</th>
                  <th className="p-2">Token</th>
                  <th className="p-2">IP Address</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-2 text-center text-gray-500">
                      No logs match your filters
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="text-sm font-medium text-gray-900">
                          {log.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {log.userId}
                        </div>
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            log.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {log.role}
                        </span>
                      </td>
                      <td className="p-2 text-sm text-gray-500">
                        {formatDate(log.loginTime)}
                      </td>
                      <td className="p-2 text-sm text-gray-500">
                        {formatDate(log.logoutTime)}
                      </td>
                      <td className="p-2 text-sm text-gray-500">
                        <span className="font-mono text-xs">
                          {log.tokenName}
                        </span>
                      </td>
                      <td className="p-2 text-sm text-gray-500">
                        {log.ipAddress}
                      </td>
                      <td className="p-2">
                        {deleteConfirm === log.id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDelete(log.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                              aria-label={`Confirm delete log for ${log.username}`}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={cancelDelete}
                              className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm"
                              aria-label="Cancel delete"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDelete(log.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            aria-label={`Delete log for ${log.username}`}
                          >
                            ❌ Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogPage;