import { DropdownOption } from "@/components/forms/InputField";

export type TeamFromBE = {
  id: number;
  name: string;
};

export const transformTeams = (teams: TeamFromBE[]): DropdownOption[] => {
  return teams.map((team) => ({
    value: team.id,
    label: team.name,
  }));
};
