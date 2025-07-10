"use client";

import { FieldError, SubmitHandler, useForm } from "react-hook-form";
import { Button, useTheme, useToast, VStack } from "@chakra-ui/react";
import { DropdownOption, InputField } from "./InputField";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFetchClient } from "@/hooks/useFetchClient";
import {
  TeamFromBE,
  transformTeams,
} from "@/app/api/selectItems/fetchTeamsSelectItems/transformTeams";

export type ProfileCompletionFormInputs = {
  titleId: string;
  firstName: string;
  lastName: string;
  mobile: string;
  jobTitle: string;
  siteId: string;
  departmentId: string;
  teamId: string;
  contractTypeId: string;
  jobLevelId: string;
};

interface ProfileCompletionFormProps {
  isSubmitting: boolean;
  errors: {
    titleId?: FieldError;
    firstName?: FieldError;
    lastName?: FieldError;
    mobile?: FieldError;
    jobTitle?: FieldError;
    siteId?: FieldError;
    departmentId?: FieldError;
    teamId?: FieldError;
    contractTypeId?: FieldError;
    jobLevelId?: FieldError;
  };
  dropdowns: {
    title: DropdownOption[];
    job_type: DropdownOption[];
    job_level: DropdownOption[];
    team: DropdownOption[];
    dept: DropdownOption[];
  };
  departmentsDropdown: DropdownOption[];
  sitesDropdown: DropdownOption[];
}

interface UserResource {
  isProfileRegistered: boolean;
}

interface UserData {
  resource: UserResource;
}

interface UpdateUserResponse {
  userData: UserData;
}

export function ProfileCompletionForm({
  isSubmitting,
  dropdowns,
  departmentsDropdown,
  sitesDropdown,
}: ProfileCompletionFormProps) {
  const theme = useTheme();
  const router = useRouter();
  const toast = useToast();
  const { fetchClient, loading } = useFetchClient();

  const [teamOptions, setTeamOptions] = useState<DropdownOption[]>([]);
  const [isTeamsLoading, setIsTeamsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    setValue,
  } = useForm<ProfileCompletionFormInputs>();

  const handleFormSubmit: SubmitHandler<ProfileCompletionFormInputs> = async (
    formData
  ) => {
    const updatedData = {
      ...formData,
      isProfileRegistered: true,
    };

    try {
      const res: UpdateUserResponse | null = await fetchClient(
        "/api/user/updateUserDetails",
        {
          method: "PUT",
          body: updatedData,
          successMessage: "Profile updated successfully",
          errorMessage: "Try again",
          redirectOnError: false,
        }
      );

      if (res?.userData?.resource?.isProfileRegistered) {
        router.push("/");
      } else {
        console.warn("Profile is not yet fully registered.");
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleDepartmentChange = async (departmentId: string | number) => {
    setValue(
      "departmentId",
      typeof departmentId === "string" ? departmentId : departmentId.toString()
    );
    setIsTeamsLoading(true);

    try {
      const data = await fetchClient("/api/selectItems/fetchTeamsSelectItems", {
        method: "POST",
        body: { departmentId },
        errorMessage: "Failed to fetch teams for the selected department",
      });

      const transformedTeams = transformTeams(
        (data as { resource: TeamFromBE[] }).resource || []
      );

      setTeamOptions(transformedTeams);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch teams for the selected department.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsTeamsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{ width: "100%", maxWidth: "md" }}
    >
      <VStack w="100%">
        <VStack spacing={4} w={300}>
          <InputField
            name="titleId"
            placeholder="Select Title *"
            type="select"
            options={dropdowns?.title}
            error={formErrors.titleId}
            register={() =>
              register("titleId", {
                required: "Title is required",
              })
            }
            focusBorderColor={theme.colors.primary}
          />

          <InputField
            name="firstName"
            placeholder="First name *"
            type="text"
            error={formErrors.firstName}
            register={() =>
              register("firstName", {
                required: "First name is required",
              })
            }
            focusBorderColor={theme.colors.primary}
          />

          <InputField
            name="lastName"
            placeholder="Surname *"
            type="text"
            error={formErrors.lastName}
            register={() =>
              register("lastName", {
                required: "Surname is required",
              })
            }
            focusBorderColor={theme.colors.primary}
          />

          <InputField
            name="mobile"
            placeholder="Mobile *"
            type="text"
            register={() =>
              register("mobile", {
                required: "Mobile is required",
                pattern: {
                  value: /^\+(?:[0-9][\s-]?){6,14}[0-9]$/,
                  message:
                    "Please enter a valid international phone number, starting with + and country code",
                },
              })
            }
            error={formErrors.mobile}
            focusBorderColor={theme.colors.primary}
          />

          <InputField
            name="jobTitle"
            placeholder="Job Title *"
            type="text"
            error={formErrors.jobTitle}
            register={() =>
              register("jobTitle", {
                required: "Job title is required",
              })
            }
            focusBorderColor={theme.colors.primary}
          />

          <InputField
            name="siteId"
            placeholder="Select Main Office Site *"
            type="select"
            error={formErrors.siteId}
            options={sitesDropdown}
            register={() =>
              register("siteId", {
                required: "Main office site is required",
              })
            }
            focusBorderColor={theme.colors.primary}
          />

          <InputField
            name="departmentId"
            placeholder="Select Department"
            type="select"
            options={departmentsDropdown}
            error={formErrors.departmentId}
            register={register}
            focusBorderColor={theme.colors.primary}
            onChange={(value) => handleDepartmentChange(value)}
          />

          <InputField
            name="teamId"
            placeholder="Select Team"
            type="select"
            options={teamOptions}
            error={formErrors.teamId}
            register={() => register("teamId")}
            focusBorderColor={theme.colors.primary}
            disabled={isTeamsLoading || teamOptions.length === 0}
          />

          <InputField
            name="contractTypeId"
            placeholder="Select Contract Type"
            type="select"
            options={dropdowns?.job_type}
            error={formErrors.contractTypeId}
            register={() => register("contractTypeId")}
            focusBorderColor={theme.colors.primary}
          />

          <InputField
            name="jobLevelId"
            placeholder="Select Job Level"
            type="select"
            options={dropdowns?.job_level}
            error={formErrors.jobLevelId}
            register={() => register("jobLevelId")}
            focusBorderColor={theme.colors.primary}
          />

          <Button
            mt={5}
            backgroundColor={theme.colors.primary}
            type="submit"
            w="full"
            isLoading={isSubmitting || loading}
            height={12}
            color="white"
            _hover={{
              color: theme.colors.primary,
              border: `1px solid ${theme.colors.primary}`,
              backgroundColor: "white",
            }}
          >
            Submit
          </Button>
        </VStack>
      </VStack>
    </form>
  );
}
