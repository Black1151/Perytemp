"use client";

import { Spinner, useDisclosure, VStack, Button } from "@chakra-ui/react";
import { SubmitHandler } from "react-hook-form";
import {
  SignUpForm as IndividualSignUpForm,
  SignUpFormInputs,
} from "@/components/forms/SignUpForm";
import { CompanySignUpForm } from "@/components/forms/CompanySignUpForm";
import { useRouter, useSearchParams } from "next/navigation";
import { SignUpSuccessModal } from "./SignUpSuccessModal";
import { useFetchClient } from "@/hooks/useFetchClient";
import { SignUpTypeSelector } from "./SignUpTypeSelector";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePanel } from "@/components/login/SignUpCard";
import { ArrowBack, Business, PersonAdd } from "@mui/icons-material";

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const SignUpPageClient = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { fetchClient, loading } = useFetchClient();
  const { setTitle, setDescription, setActions } = usePanel();

  const searchParams = useSearchParams();
  const initialType = searchParams.get("signUpType");

  const [signUpType, setSignUpType] = useState<
    "company" | "individual" | null
  >(initialType === "company" || initialType === "individual"
    ? (initialType as "company" | "individual")
    : null
  );

  useEffect(() => {
    if (initialType === "company" || initialType === "individual") {
      setSignUpType(initialType as "company" | "individual");
    }
  }, [initialType]);

  const onEmployeeSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    const endpoint ="/api/auth/sign-up"

    const result = await fetchClient(endpoint, {
      method: "POST",
      body: data,
      errorMessage: "Email already in use",
      redirectOnError: false,
    });

    if (result) {
      onOpen();
    }
  };

  const onCompanySubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    const endpoint ="/api/auth/sign-up-company"

    const result = await fetchClient(endpoint, {
      method: "POST",
      body: data,
      errorMessage: "Email already in use",
      redirectOnError: false,
    });

    if (result) {
      onOpen();
    }
  };

  const handleClose = () => {
    onClose();
    router.push("/login");
  };

  useEffect(() => {
    if (signUpType === null) {
      setTitle("Choose sign up type");
      setDescription("Select whether you are signing up as a new company or an individual.");
      setActions([
        { label: "Back To Login", href: "/login", icon: <ArrowBack /> },
      ]);
    } else if (signUpType === "individual") {
      setTitle("Join an existing company");
      setDescription("Is your company already using Perygon? Please fill in the form to join your collegues. Please use your work email.");
      setActions([
        { label: "Sign Up as a Company", href: "/sign-up?signUpType=company", icon: <Business /> },
        { label: "Back To Login", href: "/login", icon: <ArrowBack />},
      ]);
    }
    else if (signUpType === "company") {
      setTitle("Sign up your company");
      setDescription("Please fill in the form below to sign up as a company. Please use your work email.");
      setActions([
        { label: "Join an exisiting company", href: "/sign-up?signUpType=individual", icon: <PersonAdd /> },
        { label: "Back To Login", href: "/login", icon: <ArrowBack /> },
      ]);
    }
  }, [signUpType, setActions, setDescription, setTitle]);

  return (
    <VStack spacing={0} w="full" h="100%" align="stretch" justify="space-between" id="testing2">
      <AnimatePresence mode="wait">
        {signUpType === "individual" ? (
          <motion.div
            key="individual"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <IndividualSignUpForm
              onSubmit={onEmployeeSubmit}
              isSubmitting={loading}
              errors={{}}
            />
          </motion.div>
        ) : signUpType === "company" ? (
          <motion.div
            key="company"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <CompanySignUpForm
              onSubmit={onCompanySubmit}
              isSubmitting={loading}
              errors={{}}
            />
          </motion.div>
        ) : loading ? (
          <motion.div
            key="company"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Spinner />
          </motion.div>
        ) : (
          <motion.div
            id="testing"
            key="selector"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
            style={{ width: "100%" }}
          >
            <SignUpTypeSelector signUpType={null} setSignUpType={setSignUpType} />
          </motion.div>
        )}
      </AnimatePresence>
      <SignUpSuccessModal isOpen={isOpen} onClose={handleClose} />
    </VStack>
  );
};

export default SignUpPageClient;
