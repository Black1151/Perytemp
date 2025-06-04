import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Textarea,
  Text,
  useTheme,
} from "@chakra-ui/react";
import { BigUpTeamMember } from "../types";
import TeamMemberAutocomplete from "../components/TeamMemberAutocomplete";
import PerygonCard from "@/components/layout/PerygonCard";

interface SubmitScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  teamMembers: BigUpTeamMember[];
  categories: { id: number; name: string }[];
}

const SubmitScoreModal: React.FC<SubmitScoreModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teamMembers,
  categories,
}) => {
  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      teamMember: "",
      category: "",
      message: "",
    },
  });

  const message = watch("message", "");
  const maxLength = 256;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const theme = useTheme();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
      returnFocusOnClose={false}
    >
      <ModalOverlay />
      <ModalContent>
        <PerygonCard bg={theme.components.submitScoreModal.baseStyle.elementBG}>
          <ModalHeader
            fontSize="2xl"
            color={theme.components.masonryCardItem.baseStyle.primaryTextColor}
          >
            Give Recognition
          </ModalHeader>
          <ModalCloseButton color="white" />
          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <ModalBody>
              {/* TEAM MEMBER */}
              <FormControl mb={4} isRequired isInvalid={!!errors.teamMember}>
                <FormLabel
                  color={
                    theme.components.masonryCardItem.baseStyle.primaryTextColor
                  }
                >
                  Team Member
                </FormLabel>
                <Controller
                  name="teamMember"
                  control={control}
                  rules={{ required: "Team Member is required" }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TeamMemberAutocomplete
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      teamMembers={teamMembers}
                      placeholder="Start typing to search..."
                    />
                  )}
                />
                <FormErrorMessage>
                  {errors.teamMember?.message}
                </FormErrorMessage>
              </FormControl>

              {/* CATEGORY */}
              <FormControl mb={4} isRequired isInvalid={!!errors.category}>
                <FormLabel
                  color={
                    theme.components.masonryCardItem.baseStyle.primaryTextColor
                  }
                >
                  Category
                </FormLabel>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <Select
                      placeholder="Choose a category..."
                      {...field}
                      bg="elementBG"
                      color="primaryTextColor"
                      borderColor="primary"
                      _hover={{ borderColor: "primary" }}
                      _focus={{ bg: "elementBG", color: "primaryTextColor" }}
                      sx={{
                        option: {
                          backgroundColor: "elementBG",
                          color: "primaryTextColor",
                        },
                      }}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
              </FormControl>

              {/* MESSAGE */}
              <FormControl mb={4} isRequired isInvalid={!!errors.message}>
                <FormLabel
                  color={
                    theme.components.masonryCardItem.baseStyle.primaryTextColor
                  }
                >
                  Message
                </FormLabel>
                <Controller
                  name="message"
                  control={control}
                  rules={{ required: "Message is required" }}
                  render={({ field }) => (
                    <>
                      <Textarea
                        placeholder="Enter your message here..."
                        maxLength={maxLength}
                        {...field}
                        bg="elementBG"
                        color={theme.colors.primaryTextColor}
                        borderColor="primary"
                        _hover={{ borderColor: "primary" }}
                      />
                      <Text
                        fontSize="sm"
                        color={
                          theme.components.masonryCardItem.baseStyle
                            .primaryTextColor
                        }
                      >
                        {message.length}/{maxLength} characters
                      </Text>
                    </>
                  )}
                />
                <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                bg="primary"
                color="white"
                mr={3}
                type="submit"
                _hover={{ bg: "white", color: "primary" }}
              >
                Submit
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                borderColor="primary"
                color="white"
                _hover={{ bg: "rgba(255, 20, 147, 0.1)", borderColor: "white" }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </PerygonCard>
      </ModalContent>
    </Modal>
  );
};

export default SubmitScoreModal;
