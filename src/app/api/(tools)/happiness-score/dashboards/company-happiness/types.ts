// types.ts
export interface Tag {
  tagId: number;
  name: string;
}

export interface ApiResponseItem {
  role: string;
  email: string;
  firstName: string;
  lastName: string;
  userId: number;
  fullName: string;
  employStartDate: string;
  userImageUrl: string;
  userIsActive: boolean;
  userUniqueId: string;
  customerId: number;
  customerName: string;
  companyNo: string;
  customerCode: string;
  customerType: string;
  customerParentName: string | null;
  customerParentId: number | null;
  companySizeId: number;
  companySizeName: string;
  customerIsActive: boolean;
  businessTypeName: string;
  businessTypeId: number;
  siteName: string;
  siteId: number;
  teamName: string;
  teamId: number;
  jobLevelName: string;
  jobLevelId: number;
  deptName: string;
  deptId: number;
  regionName: string;
  regionId: number;
  sectorName: string;
  sectorId: number;
  contractTypeName: string;
  contractTypeId: number;
  multiSite: boolean;
  noOfSites: number;
  noOfUsers: number;
  numberOfEmployees: number;
  webAddress: string;
  remoteWorker: boolean;
  jsonBpRespFull: string;
  jsonBpRespLite: string;
  createdAt: string;
  createdBy: number;
  toolConfigId: number;
  workflowId: number;
  businessProcessId: number;
  workflowInstanceId: number;
  businessProcessInstanceId: number;
  userTags?: Tag[];
  siteTags?: Tag[];
  customerTags?: Tag[];
  jobTitle: string;
}

export interface ApiResponse {
  resource: ApiResponseItem[];
}

export interface Person {
  userId: number;
  imageUrl: string;
  fullName: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  site: string;
  score: number | null;
}

export interface DataPoint {
  value: number;
  title: string;
}

export interface SpeechBubbleData {
  currentScore: number;
  change: number;
  positiveChange: boolean;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterOptionGroup {
  label: string;
  options: FilterOption[];
}
