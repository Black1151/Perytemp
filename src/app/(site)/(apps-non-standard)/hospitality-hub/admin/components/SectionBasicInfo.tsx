import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Box,
  useTheme,
  FormHelperText,
} from "@chakra-ui/react";
import { useFormContext, useWatch } from "react-hook-form";
import { transparentize } from "@chakra-ui/theme-tools";
import { useEffect } from "react";

// Use the same constants as AddItemModalSplitPane for validation
const TITLE_MIN = 5;
const TITLE_MAX = 35;
const DESC_MIN = 120;
const DESC_MAX = 500;

function SectionBasicInfo() {
  const {
    register,
    formState: { errors, touchedFields },
    trigger,
  } = useFormContext();
  const theme = useTheme();
  const itemType = useWatch({ name: "itemType" });

  // Show errors for title and description on mount
  useEffect(() => {
    trigger(["name", "description"]);
  }, [trigger]);

  return (
    <Box
      p={4}
      border="1px solid"
      borderColor={transparentize(theme.colors.primaryTextColor, 0.15)(theme)}
      borderRadius="md"
      bg={theme.colors.elementBG}
    >
      <VStack align="stretch" spacing={4}>
        <FormControl isRequired isInvalid={!!errors.name && touchedFields.name}>
          <FormLabel color={theme.colors.primaryTextColor}>Title</FormLabel>
          <Input
            {...register("name", {
              required: "Title is required",
              minLength: {
                value: TITLE_MIN,
                message: `Title must be at least ${TITLE_MIN} characters`,
              },
              maxLength: {
                value: TITLE_MAX,
                message: `Title must be at most ${TITLE_MAX} characters`,
              },
            })}
            borderColor={transparentize(
              theme.colors.primaryTextColor,
              0.15
            )(theme)}
            _hover={{ borderColor: theme.colors.primary }}
            _focus={{
              borderColor: theme.colors.primary,
              boxShadow: `0 0 0 1px ${theme.colors.primary}`,
            }}
            color={theme.colors.primaryTextColor}
            placeholder="Enter the item name"
          />
          <FormHelperText color={theme.colors.secondaryTextColor}>
            Enter a concise, descriptive title for the item ({TITLE_MIN}-
            {TITLE_MAX} characters).
          </FormHelperText>
          {typeof errors.name?.message === "string" && touchedFields.name && (
            <Box color="red.500" fontSize="sm" mt={1}>
              {errors.name.message}
            </Box>
          )}
        </FormControl>
        <FormControl
          isRequired
          isInvalid={!!errors.description && touchedFields.description}
        >
          <FormLabel color={theme.colors.primaryTextColor}>
            Description
          </FormLabel>
          <Textarea
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: DESC_MIN,
                message: `Description must be at least ${DESC_MIN} characters`,
              },
              maxLength: {
                value: DESC_MAX,
                message: `Description must be at most ${DESC_MAX} characters`,
              },
            })}
            borderColor={transparentize(
              theme.colors.primaryTextColor,
              0.15
            )(theme)}
            _hover={{ borderColor: theme.colors.primary }}
            _focus={{
              borderColor: theme.colors.primary,
              boxShadow: `0 0 0 1px ${theme.colors.primary}`,
            }}
            color={theme.colors.primaryTextColor}
            placeholder="Enter a description"
          />
          <FormHelperText color={theme.colors.secondaryTextColor}>
            Provide a detailed description of the item, including any important
            information users should know ({DESC_MIN}-{DESC_MAX} characters).
          </FormHelperText>
          {typeof errors.description?.message === "string" &&
            touchedFields.description && (
              <Box color="red.500" fontSize="sm" mt={1}>
                {errors.description.message}
              </Box>
            )}
        </FormControl>
        <FormControl>
          <FormLabel color={theme.colors.primaryTextColor}>Item Type</FormLabel>
          <Select
            {...register("itemType")}
            borderColor={transparentize(
              theme.colors.primaryTextColor,
              0.15
            )(theme)}
            _hover={{ borderColor: theme.colors.primary }}
            _focus={{
              borderColor: theme.colors.primary,
              boxShadow: `0 0 0 1px ${theme.colors.primary}`,
            }}
            color={theme.colors.primaryTextColor}
            placeholder="Select item type"
          >
            <option value="singleDayBookable">Single Day Bookable</option>
            <option value="singleDayBookableWithStartEnd">
              Single Day Bookable With Start and End
            </option>
            <option value="multiDayBookable">Multi Day Bookable</option>
            <option value="info(tel)">Info (with a telephone)</option>
            <option value="info(code)">
              Info (with discount/voucher code)
            </option>
            <option value="info(email)">Info (with an email)</option>
            <option value="info(link)">Info (with a link)</option>
          </Select>
          <FormHelperText color={theme.colors.secondaryTextColor}>
            Choose the type that best fits how this item can be booked or used.
          </FormHelperText>
        </FormControl>
        {/* Conditionally render infoContent field for info types */}
        {(itemType === "info(tel)" ||
          itemType === "info(code)" ||
          itemType === "info(email)" ||
          itemType === "info(link)") && (
          <FormControl
            isRequired
            isInvalid={!!errors.infoContent && touchedFields.infoContent}
          >
            <FormLabel color={theme.colors.primaryTextColor}>
              {itemType === "info(tel)" && "Telephone Number"}
              {itemType === "info(code)" && "Discount/Voucher Code"}
              {itemType === "info(email)" && "Email Address"}
              {itemType === "info(link)" && "Link URL"}
            </FormLabel>
            <Input
              {...register("infoContent", {
                required: "This field is required for the selected info type",
                validate: (value) => {
                  if (itemType === "info(tel)") {
                    return (
                      /^\+?\d+$/.test(value) ||
                      "Enter a valid telephone number (numbers only, may start with +)"
                    );
                  }
                  if (itemType === "info(code)") {
                    return (
                      value.length >= 3 || "Code must be at least 3 characters"
                    );
                  }
                  if (itemType === "info(email)") {
                    return (
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                      "Enter a valid email address"
                    );
                  }
                  if (itemType === "info(link)") {
                    if (!/^https?:\/\//i.test(value)) {
                      return "Please include http:// or https:// at the beginning of the URL";
                    }
                    try {
                      new URL(value);
                      return true;
                    } catch {
                      return "Enter a valid URL";
                    }
                  }               
                  return true;
                },
              })}
              borderColor={transparentize(
                theme.colors.primaryTextColor,
                0.15
              )(theme)}
              _hover={{ borderColor: theme.colors.primary }}
              _focus={{
                borderColor: theme.colors.primary,
                boxShadow: `0 0 0 1px ${theme.colors.primary}`,
              }}
              color={theme.colors.primaryTextColor}
              placeholder={
                itemType === "info(tel)"
                  ? "Enter telephone number"
                  : itemType === "info(code)"
                    ? "Enter discount or voucher code"
                    : itemType === "info(email)"
                      ? "Enter email address"
                      : itemType === "info(link)"
                        ? "Enter link URL"
                        : ""
              }
            />
            {typeof errors.infoContent?.message === "string" &&
              touchedFields.infoContent && (
                <Box color="red.500" fontSize="sm" mt={1}>
                  {errors.infoContent.message}
                </Box>
              )}
          </FormControl>
        )}
        <FormControl>
          <FormLabel color={theme.colors.primaryTextColor}>
            How To Details
          </FormLabel>
          <Textarea
            {...register("howToDetails")}
            borderColor={transparentize(
              theme.colors.primaryTextColor,
              0.15
            )(theme)}
            _hover={{ borderColor: theme.colors.primary }}
            _focus={{
              borderColor: theme.colors.primary,
              boxShadow: `0 0 0 1px ${theme.colors.primary}`,
            }}
            color={theme.colors.primaryTextColor}
            placeholder="Enter how-to details (optional)"
          />
          <FormHelperText color={theme.colors.secondaryTextColor}>
            Optionally, provide step-by-step instructions or guidelines for
            using or booking this item.
          </FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel color={theme.colors.primaryTextColor}>Extra Info</FormLabel>
          <Textarea
            {...register("extraDetails")}
            borderColor={transparentize(
              theme.colors.primaryTextColor,
              0.15
            )(theme)}
            _hover={{ borderColor: theme.colors.primary }}
            _focus={{
              borderColor: theme.colors.primary,
              boxShadow: `0 0 0 1px ${theme.colors.primary}`,
            }}
            color={theme.colors.primaryTextColor}
            placeholder="Enter any extra details (optional)"
          />
          <FormHelperText color={theme.colors.secondaryTextColor}>
            Optionally, add any additional information that may be helpful for
            users.
          </FormHelperText>
        </FormControl>
      </VStack>
    </Box>
  );
}

export default SectionBasicInfo;
