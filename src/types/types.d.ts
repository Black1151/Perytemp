export interface UserIdentity {
  userId: number;
  userUniqueId: string;
  customerId: number;
  customerUniqueId: string;
  customerImageUrl: string;
  role: string;
  firstName: string;
  lastname: string;
  userAccessGroups: (string | null)[];
  department: string | null;
  team: string | null;
  userImageUrl: string | null;
}

export interface Tool {
  toolId: number;
  customerId: number;
  customerUniqueId: string;
  isActive: boolean;
  subStartDate: string;
  name: string;
  displayName: string;
  description: string;
  previewText: string;
  showInSeeMoreList: boolean;
  iconImageUrl: string;
  thumbnailImageUrl: string;
  previewImageUrl: string;
  logoImageUrl: string;
  appUrl: string;
  toolCat: string;
  toolWfId: number;
  toolWfReadOnly: boolean;
  startInUi: boolean;
}

export interface User {
  id: number;
  email: string;
  aboutMe?: string;
  jobTitle?: string;
  imageUrl?: string;
  customerId?: number | null;
  siteId?: number;
  teamId?: number;
  role: string;
  firstName?: string;
  lastName?: string;
  telephone?: string;
  mobile?: string;
  vehicleRegistration?: string;
  jobLevelId?: number;
  contractTypeId?: number;
  titleId?: number;
  lastLogin?: string;
  isVerified?: boolean;
  marketingOptOutId?: number;
  uniqueId: string;
  emailVerifiedAt?: string;
  departmentId?: number;
  employStartDate?: string;
  isProfileRegistered?: boolean;
  remoteWorker?: boolean;
  rememberToken?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
  createdByUser?: UserMeta;
  updatedByUser?: UserMeta;
  customer?: Customer;
  site?: Site;
  jobLevel?: JobLevel;
  contractType?: ContractType;
  title?: Title;
  marketingOptOut?: string;
  hobbies?: string[];
  languages?: string[];
}

export interface UserMeta {
  id: number;
  email: string;
  aboutMe?: string | null;
  jobTitle?: string;
  imageUrl?: string;
  customerId?: number | null;
  siteId?: number | null;
  teamId?: number | null;
  role: string;
  firstName?: string;
  lastName?: string;
  telephone?: string;
  mobile?: string | null;
  vehicleRegistration?: string | null;
  jobLevelId?: number | null;
  contractTypeId?: number | null;
  titleId?: number | null;
  lastLogin?: string;
  isVerified?: boolean;
  marketingOptOutId?: number | null;
  uniqueId: string;
  emailVerifiedAt?: string | null;
  departmentId?: number | null;
  employStartDate?: string | null;
  isProfileRegistered?: boolean;
  remoteWorker?: boolean;
  rememberToken?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface Site {
  id: number;
  siteName: string;
  siteEmail?: string;
  siteTel?: string;
  customerId?: number;
  primaryContactId?: number | null;
  address1: string;
  address2: string;
  address3?: string;
  address4?: string;
  postcode: string;
  country?: string | number;
  latitude?: number;
  longitude?: number;
  uniqueId: string;
  siteTypeId?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  customer?: Customer;
}

export interface Customer {
  id: number;
  name: string;
  address1: string;
  address2: string;
  address3?: string;
  address4?: string;
  postcode: string;
  country: string | number;
  customerCode: string;
  webAddress?: string;
  singleSignOn: boolean;
  primaryContactId?: number;
  businessTypeId?: number;
  sectorId?: number;
  regionId?: number;
  companySizeId?: number;
  companyNo?: string;
  sicCode?: string;
  numberOfEmployees?: number;
  parentId?: number | null;
  licensedUsers: number;
  contactLevelId?: number | null;
  imageUrl?: string;
  uniqueId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
  multiSite: boolean;
}

export interface User {
  id: number;
  email: string;
  aboutMe?: string;
  jobTitle?: string;
  imageUrl?: string;
  customerId?: number | null;
  siteId?: number;
  teamId?: number;
  role: string;
  firstName?: string;
  lastName?: string;
  telephone?: string;
  mobile?: string;
  vehicleRegistration?: string;
  jobLevelId?: number;
  contractTypeId?: number;
  titleId?: number;
  lastLogin?: string;
  isVerified?: boolean;
  marketingOptOutId?: number;
  uniqueId: string;
  emailVerifiedAt?: string;
  departmentId?: number;
  employStartDate?: string;
  isProfileRegistered?: boolean;
  remoteWorker?: boolean;
  rememberToken?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
  createdByUser?: UserMeta;
  updatedByUser?: UserMeta;
  customer?: Customer;
  site?: Site;
  jobLevel?: JobLevel;
  contractType?: ContractType;
  title?: Title;
  marketingOptOut?: string;
  hobbies?: string[];
  languages?: string[];
}

export interface Customer {
  id: number;
  name: string;
  address1: string;
  address2?: string;
  address3?: string;
  address4?: string;
  postcode: string;
  country?: string;
  customerCode?: string;
  webAddress?: string;
  singleSignOn: boolean;
  primaryContactId?: number | null;
  businessTypeId: number;
  sectorId: number;
  regionId: number;
  companySizeId: number;
  companyNo?: string;
  sicCode?: string;
  numberOfEmployees?: number;
  parentId?: number | null;
  licensedUsers?: number | null;
  contactLevelId?: number | null;
  imageUrl?: string;
  uniqueId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  multiSite?: boolean;
}

export interface UserMeta {
  id: number;
  email: string;
  aboutMe?: string | null;
  jobTitle?: string;
  imageUrl?: string;
  customerId?: number | null;
  siteId?: number | null;
  teamId?: number | null;
  role: string;
  firstName?: string;
  lastName?: string;
  telephone?: string;
  mobile?: string | null;
  vehicleRegistration?: string | null;
  jobLevelId?: number | null;
  contractTypeId?: number | null;
  titleId?: number | null;
  lastLogin?: string;
  isVerified?: boolean;
  marketingOptOutId?: number | null;
  uniqueId: string;
  emailVerifiedAt?: string | null;
  departmentId?: number | null;
  employStartDate?: string | null;
  isProfileRegistered?: boolean;
  remoteWorker?: boolean;
  rememberToken?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface Site {
  id: number;
  siteName: string;
  siteEmail?: string;
  siteTel?: string;
  customerId?: number;
  primaryContactId?: number | null;
  address1: string;
  address2: string;
  address3?: string;
  address4?: string;
  postcode: string;
  country?: string;
  latitude?: string;
  longitude?: string;
  uniqueId: string;
  siteTypeId?: number | null;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

export interface JobLevel {
  id: number;
  type: string;
  label: string;
  value: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

export interface ContractType {
  id: number;
  type: string;
  label: string;
  value: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

export interface Title {
  id: number;
  type: string;
  label: string;
  value: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}
