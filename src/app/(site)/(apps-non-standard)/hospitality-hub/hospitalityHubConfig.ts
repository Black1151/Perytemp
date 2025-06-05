export type HospitalityHubCategory = {
  key: string;
  displayName: string;
  image: string;
  optionalFields?: {
    location?: boolean;
    date?: boolean;
  };
};

import config from './hospitalityHubConfig.json';

export default config as HospitalityHubCategory[];
