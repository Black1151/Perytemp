"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { themeRegistry, ThemeId } from "@/theme/themes/themeRegistry";

interface IThemeContext {
  themeId: ThemeId | null;
  setThemeId: (theme: ThemeId) => void;
  getUserTheme: () => Promise<void>;
}

const ThemeContext = createContext<IThemeContext>({
  themeId: null,
  setThemeId: () => {},
  getUserTheme: () => Promise.resolve(),
});

export const useThemeContext = () => useContext(ThemeContext);

interface CustomThemeProviderProps {
  children: React.ReactNode;
}

export const ChakraThemeProvider: React.FC<CustomThemeProviderProps> = ({
  children,
}) => {
  const [userThemeId, setUserThemeId] = useState<ThemeId | null>(null);
  const [loadingTheme, setLoadingTheme] = useState(true);

  const getUserTheme = async () => {
    setLoadingTheme(true);

    try {
      const response = await fetch("/api/user/getUserMetadata");
      if (!response.ok) {
        throw new Error("Failed to fetch user metadata");
      }

      const data = await response.json();

      if (data.userThemeId !== undefined && data.userThemeId !== null) {
        setUserThemeId(data.userThemeId);
      }
    } catch (error) {
      console.error("Error fetching user theme:", error);
    } finally {
      setLoadingTheme(false);
    }
  };

  useEffect(() => {
    if (userThemeId === null) {
      return;
    }

    const updateUserTheme = async () => {
      try {
        const response = await fetch("/api/user/updateUserDetails", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userThemeId }),
        });
        if (!response.ok) {
          throw new Error("Failed to update theme preference");
        }
      } catch (error) {
        console.error("Error updating theme:", error);
      }
    };

    updateUserTheme();
  }, [userThemeId]);

  const themeId = userThemeId ?? 1;

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        setThemeId: setUserThemeId,
        getUserTheme,
      }}
    >
      <ChakraProvider theme={themeRegistry[themeId]}>{children}</ChakraProvider>
    </ThemeContext.Provider>
  );
};
