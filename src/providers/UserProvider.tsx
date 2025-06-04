"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFetchClient } from "@/hooks/useFetchClient";
import { Role } from "@/types/user";

export interface UserContextProps {
  userId: number;
  userUniqueId: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  siteId?: number;
  siteName?: string;
  remoteWorker?: boolean;
  departmentId?: number;
  deptName?: string;
  teamId?: number;
  teamName?: string;
  jobLevelId?: number;
  jobLevel?: string;
  contractTypeId?: number;
  contractType?: string;
  employStartDate?: string;
  userIsActive?: boolean;
  customerId?: number;
  customerName?: string;
  customerCode?: string;
  customerType?: string;
  webAddress?: string;
  noOfUsers?: number;
  noOfSites?: number;
  businessTypeId?: number;
  businessTypeName?: string;
  sectorId?: number;
  sectorName?: string;
  regionId?: number;
  regionName?: string;
  companySizeId?: number;
  companyNo?: string;
  numberOfEmployees?: number;
  multiSite?: boolean;
  customerParentId?: number | null;
  customerParentName?: string | null;
  customerIsActive?: boolean;
  userImageUrl?: string;
  custImageUrl?: string;
  customerUniqueId?: string;
  teamManagerCount?: number;
  parentCustImageUrl?: string;
  groupNames: string[] | null;
  userThemeId?: number | null;
  customerIsFree?: boolean;
  customerIsFreeUntilDate?: string | null;
  customerDefaultThemeId: number;
  subscribedTools: string[];
}

export interface UserAccessControlContextProps {
  role: Role;
  customerId?: number;
  teamManagerCount?: number;
  groupNames: string[] | null;
  customerIsFree?: boolean;
  customerIsFreeUntilDate?: string | null;
  subscribedTools: string[];
}

interface UserProviderProps {
  user: UserContextProps | null;
  userAccessControl: UserAccessControlContextProps | null;
  showDeveloperBoard: boolean;
  updateShowDeveloperBoard: (value: boolean) => void;
}

const UserContext = createContext<UserProviderProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{
  value?: UserContextProps;
  children: ReactNode;
}> = ({ value, children }) => {
  const [user, setUser] = useState<UserContextProps | null>(value || null);
  const [userAccessControl, setUserAccessControl] = useState<UserAccessControlContextProps | null>(null)
  const [showDeveloperBoard, setShowDeveloperBoard] = useState<boolean>(false);
  const { fetchClient } = useFetchClient();

  useEffect(() => {
    // Update the user context when `value` (userMetadata) changes
    if (value) {
      setUser(value);
    }
  }, [value]);

  const getUserMetadata = async (): Promise<void> => {
    try {
      const res = await fetchClient(`/api/user/getUserMetadata`);
      setUser(res as UserContextProps); // Explicitly casting response as UserContextProps
    } catch (error) {
      console.error("Error fetching user metadata:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setUserAccessControl({
        role: user.role,
        customerId: user.customerId,
        teamManagerCount: user.teamManagerCount,
        groupNames: user.groupNames,
        customerIsFree: user.customerIsFree,
        customerIsFreeUntilDate: user.customerIsFreeUntilDate,
        subscribedTools: user.subscribedTools,
      });
    } else {
      setUserAccessControl(null);
    }
  }, [user]);

  const updateShowDeveloperBoard = (value: boolean): void => {
    setShowDeveloperBoard(value);
  };

  return (
    <UserContext.Provider
      value={{ user, userAccessControl, showDeveloperBoard, updateShowDeveloperBoard }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
