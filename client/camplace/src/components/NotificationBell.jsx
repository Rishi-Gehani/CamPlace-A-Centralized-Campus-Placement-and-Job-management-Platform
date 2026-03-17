import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, CheckCheck, Clock, MessageSquare, Briefcase, Megaphone, FileText, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";

const NOTIFICATION_ICONS = {
  job: <Briefcase className="text-blue-500" size={16} />,
  notice: <Megaphone className="text-orange-500" size={16} />,
  resource: <FileText className="text-purple-500" size={16} />,
  query: <MessageSquare className="text-green-500" size={16} />,
  application: <CheckCircle className="text-indigo-500" size={16} />
};

const NOTIFICATION_ROUTES = {
  job: "/jobs",
  notice: "/notices",
  resource: "/interview-resources",
  query: "/profile", // Or a specific query page if it exists
  application: "/profile" // Or a specific application tracker
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const socket = useSocket();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/notifications", {
        headers: {
          "x-auth-token": localStorage.getItem("token")
        }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  // Refresh when panel is opened
  useEffect(() => {
    if (isOpen && user) {
      fetchNotifications();
    }
  }, [isOpen, user, fetchNotifications]);

  useEffect(() => {
    if (socket) {
      socket.on("new_notification", (notification) => {
        // Only refresh if it's for this user or a broadcast
        if (!notification.recipient || notification.recipient === user.id || notification.recipient === user._id) {
          fetchNotifications();
        }
      });

      return () => {
        socket.off("new_notification");
      };
    }
  }, [socket, user, fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          "x-auth-token": localStorage.getItem("token")
        }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/notifications/read-all", {
        method: "PUT",
        headers: {
          "x-auth-token": localStorage.getItem("token")
        }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    setIsOpen(false);
    const route = NOTIFICATION_ROUTES[notification.type];
    if (route) {
      navigate(route);
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return then.toLocaleDateString();
  };

  if (!user || user.role === 'admin') return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden z-[100]"
          >
            <div className="p-4 border-b border-black/5 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  <CheckCheck size={12} />
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 border-b border-black/5 cursor-pointer transition-colors hover:bg-gray-50 flex gap-3 ${
                      !notification.isRead ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      !notification.isRead ? "bg-white shadow-sm" : "bg-gray-100"
                    }`}>
                      {NOTIFICATION_ICONS[notification.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${!notification.isRead ? "font-bold text-secondary" : "text-secondary/60"}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={10} className="text-secondary/30" />
                        <span className="text-[10px] text-secondary/40 font-medium">
                          {formatTimestamp(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-secondary/40">No notifications yet</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 bg-gray-50/50 text-center border-t border-black/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary/30">
                  End of notifications
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
