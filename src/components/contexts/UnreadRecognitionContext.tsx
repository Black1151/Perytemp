// contexts/UnreadContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type UnreadContextValue = {
  unread: boolean;
  checkUnread: () => Promise<void>;
  markAsRead: () => Promise<void>;
};

const UnreadContext = createContext<UnreadContextValue | undefined>(undefined);

export const UnreadProvider = ({ children }: { children: React.ReactNode }) => {
  const [unread, setUnread] = useState(false);

  const checkUnread = async () => {
    try {
      const response = await fetch("/api/auth/big-up/checkUnread");
      const data = await response.json();
      setUnread(data.amount > 0);
    } catch (error) {
      console.error("Error fetching unread status:", error);
      setUnread(false);
    }
  };

  const markAsRead = async () => {
    try {
      await fetch("/api/auth/big-up/markAsRead", { method: "GET" });
      setUnread(false);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  useEffect(() => {
    checkUnread();
  }, []);

  const value: UnreadContextValue = {
    unread,
    checkUnread,
    markAsRead,
  };

  return (
    <UnreadContext.Provider value={value}>{children}</UnreadContext.Provider>
  );
};

export const useUnread = () => {
  const context = useContext(UnreadContext);
  if (!context) {
    throw new Error("useUnread must be used within an UnreadProvider");
  }
  return context;
};
