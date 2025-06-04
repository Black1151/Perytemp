"use client";

import { ReactNode, useEffect } from "react";
import { UserAccessControlContextProps, UserContextProps, UserProvider } from "@/providers/UserProvider";
import { WorkflowProvider } from "@/providers/WorkflowProvider";
import DeveloperBoardOptions from "@/app/(site)/DeveloperBoardOptions";
import { useThemeContext } from "@/providers/ChakraThemeProvider";

interface ClientUserProviderProps {
  children: ReactNode;
  userMetadata: UserContextProps;
  userAccessControl: UserAccessControlContextProps;
}

export default function SiteProviders({
  children,
  userMetadata,
  userAccessControl,
}: ClientUserProviderProps) {
  const { setThemeId } = useThemeContext();

  useEffect(() => {
    if (userMetadata.userThemeId) {
      setThemeId(userMetadata.userThemeId);
    } else {
      setThemeId(userMetadata.customerDefaultThemeId);
    }
  }, [userMetadata]);

  return (
    <UserProvider value={userMetadata}>
      {children}
      <DeveloperBoardOptions userMetadata={userMetadata} userAccessControl={userAccessControl}/>
    </UserProvider>
  );
}
