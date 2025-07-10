"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  Flex,
  HStack,
  Image,
  Text,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { InputField } from "./InputField";
import { useRouter, useSearchParams } from "next/navigation";
import { emailValidation } from "./validationSchema/validationSchema";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { NextResponse } from "next/server";
import LoginFormButtons from "@/components/forms/LoginFormButtons";
import { DefaultSession } from "next-auth";
import CryptoJS from "crypto-js";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import LinkOnIcon from "@mui/icons-material/Link";
import { transparentize } from "@chakra-ui/theme-tools";

declare module "next-auth" {
  interface Session {
    user: {
      sub?: string;
    } & DefaultSession["user"];
  }
}

export type LoginFormInputs = {
  email: string;
  password: string;
};

export function LoginForm() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const secureLink = searchParams.get("l");
  type ButtonId = "email" | "microsoft" | "google" | "apple";
  const linkAppleAccountSub = searchParams.get("link-apple-account-sub") ?? "";
  const appleAccountLinked = searchParams.get("appleAccountLinked");

  useEffect(() => {
    handleSsoSignIn();
    router.refresh();
  }, []);

  const { fetchClient, loading } = useFetchClient();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<LoginFormInputs>();

  const handleButtonClick = (buttonId: ButtonId) => {
    const callbackUrl = secureLink ? `/login?l=${secureLink}` : "/login";

    switch (buttonId) {
      case "email":
        handleSubmit(handleFormSubmit)();
        break;
      case "microsoft":
        signIn("azure-ad", { callbackUrl: callbackUrl });
        break;
      case "google":
        signIn("google", { callbackUrl: callbackUrl });
        break;
      case "apple":
        signIn("apple", { callbackUrl: callbackUrl });
        break;
      default:
      // Handle default or error case
    }
  };

  const decryptData = async (encryptedData: string) => {
    let NextAuthSession = await getSession();
    if (NextAuthSession !== null) {
      const secretKey = NextAuthSession.accessToken;
      if (secretKey != undefined) {
        const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
      }
    }
  };

  const handleFormSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const searchParams = new URLSearchParams(window.location.search);
    const endpoint = secureLink
      ? `/api/auth/sign-in?l=${secureLink}`
      : "/api/auth/sign-in";

    const linkAppleAccountSub = searchParams.get("link-apple-account-sub");
    if (linkAppleAccountSub == null) {
      const result: { redirectUrl: string } | null = await fetchClient(
        endpoint,
        {
          method: "POST",
          body: { ...data, loginType: "email" },
          successMessage: "Successfully logged in!",
          errorMessage: "Incorrect user or password",
          redirectOnError: false,
        }
      );
      if (result) {
        // await getUserTheme();
        router.push(result.redirectUrl);
      }
    } else {
      const appleSub = String(
        await decryptData(decodeURIComponent(linkAppleAccountSub))
      );

      const appleLinkingResult: {
        redirectUrl: string;
        resource?: { sub?: string };
      } | null = await fetchClient(
        secureLink
          ? `api/auth/link-apple-login?l=${secureLink}`
          : "api/auth/link-apple-login",
        {
          method: "POST",
          body: {
            // Explicitly stringify the request body
            ...data,
            loginType: "email",
            sub: appleSub,
          },
          suppressError: true,
        }
      );
      if (appleLinkingResult !== null) {
        if (appleLinkingResult.redirectUrl) {
          router.push(appleLinkingResult.redirectUrl);
        }
      }
    }
  };

  const handleSsoSignIn = async () => {
    let NextAuthSession = await getSession();
    const endpoint = secureLink
      ? `/api/auth/sign-in?l=${secureLink}`
      : "/api/auth/sign-in";

    const searchParams = new URLSearchParams(window.location.search);
    const isMissingToken = searchParams.get("MissingAuthToken");
    if (isMissingToken !== null) {
      if (isMissingToken == "true") {
        try {
          await signOut({ redirect: false });
        } catch (error) {
          // continue;
        }
      }
    } else {
      if (NextAuthSession !== undefined) {
        if (NextAuthSession !== null) {
          const loginType = () => {
            switch (NextAuthSession.accountProvider) {
              case "azure-ad":
                return 1;
              case "google":
                return 2;
              case "apple":
                return 3;
            }
          };

          let isEmailPrivate = false;
          if (
            NextAuthSession.user?.email !== null &&
            NextAuthSession.user?.email !== undefined
          ) {
            if (NextAuthSession.user?.email.indexOf("privaterelay") !== -1) {
              isEmailPrivate = true;
            }
          }
          if (isEmailPrivate) {
            if (NextAuthSession.providerAccountId != undefined) {
              const result: { redirectUrl?: string; sub?: string } | null =
                await fetchClient(endpoint, {
                  method: "POST",
                  body: {
                    loginType: "sso",
                    email: NextAuthSession.user.email,
                    password: null,
                    accessToken: NextAuthSession.accessToken,
                    type: loginType(),
                    secureLinkUniqueId: NextAuthSession.providerAccountId,
                    sub:
                      NextAuthSession.providerAccountId !== undefined
                        ? NextAuthSession.providerAccountId
                        : null,
                    secureLink: secureLink,
                  },
                  suppressError: true,
                });

              if (result) {
                if (result.sub && result.sub.length > 0) {
                  const secretKey = NextAuthSession.accessToken;
                  if (secretKey !== undefined) {
                    const encryptedToken = CryptoJS.AES.encrypt(
                      result.sub,
                      secretKey
                    ).toString();
                    const appleAccountSubRedirectUrl = secureLink
                      ? `/login/?link-apple-account-sub=${encodeURIComponent(encryptedToken)}&l=${secureLink}`
                      : `/login/?link-apple-account-sub=${encodeURIComponent(encryptedToken)}`;
                    router.push(appleAccountSubRedirectUrl);
                  } else {
                    throw new Error("Encryption key not set");
                  }
                }
                if (result.redirectUrl) {
                  router.push(result.redirectUrl);
                }
              } else {
                const res = NextResponse.json({ success: false });
                res.cookies.delete("next-auth.callback-url");
                res.cookies.delete("next-auth.csrf-token");
                res.cookies.delete("next-auth.session-token");
                res.cookies.delete("__Host-next-auth.csrf-token");
                res.cookies.delete("__Secure-next-auth.callback-url");
                res.cookies.delete("__Secure-next-auth.session-token");

                try {
                  await signOut({ redirect: false });
                } catch (error) {
                  // continue;
                }
              }
            }
          } else {
            const result: { redirectUrl: string } | null = await fetchClient(
              endpoint,
              {
                method: "POST",
                body: {
                  loginType: "sso",
                  email: NextAuthSession.user.email,
                  password: null,
                  accessToken: NextAuthSession.accessToken,
                  type: loginType(),
                  secureLinkUniqueId: NextAuthSession.providerAccountId,
                  sub:
                    NextAuthSession.providerAccountId !== undefined
                      ? NextAuthSession.providerAccountId
                      : null,
                },
                suppressError: true,
              }
            );

            if (result) {
              router.push(result.redirectUrl);
            } else {
              const res = NextResponse.json({ success: false });
              res.cookies.delete("next-auth.callback-url");
              res.cookies.delete("next-auth.csrf-token");
              res.cookies.delete("next-auth.session-token");
              res.cookies.delete("__Host-next-auth.csrf-token");
              res.cookies.delete("__Secure-next-auth.callback-url");
              res.cookies.delete("__Secure-next-auth.session-token");

              try {
                await signOut({ redirect: false });
              } catch (error) {
                // continue;
              }
            }
          }
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{ width: "100%", maxWidth: "sm" }}
      autoComplete={linkAppleAccountSub != "" ? "off" : "on"}
    >
      <VStack spacing={0} w="100%">
        {appleAccountLinked != null && (
          <VStack spacing={0} w={300} gap={2}>
            <LinkOnIcon
              style={{
                width: "48px",
                color: theme.colors.seduloGreen,
                position: "absolute",
                top: "290px",
                height: "auto",
              }}
            />
            <Image
              src="https://perygonblob.blob.core.windows.net/public/AppleToPerygonIcon.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D"
              alt="AppleToPerygon"
              position="absolute"
              objectFit="cover"
              objectPosition="bottom"
              width={"297px"}
              height={"47px"}
              top={"290px"}
            />
            <Text pt="10px" fontSize={["12px", "12px"]} color="gray">
              Your Apple account is now linked to the following Perygon user:
            </Text>
            <Text
              pt="10px"
              mb={["80px", "125px"]}
              fontWeight="bold"
              fontSize={["16px", "12px"]}
              color={theme.colors.primary}
            >
              {appleAccountLinked}
            </Text>
          </VStack>
        )}
        {appleAccountLinked != null && (
          <Button
            mt={5}
            backgroundColor={theme.colors.primary}
            type="submit"
            w="300px"
            isLoading={loading}
            height={12}
            color="white"
            _hover={{
              color: theme.colors.primary,
              border: `1px solid ${theme.colors.primary}`,
              backgroundColor: "white",
            }}
            onClick={() =>
              router.push(secureLink ? `/login/?l=${secureLink}` : "/login")
            }
          >
            Continue
          </Button>
        )}
        {appleAccountLinked == null && (
          <VStack
            spacing={0}
            w={300}
            gap={2}
            position={linkAppleAccountSub != "" ? "relative" : "inherit"}
          >
            {linkAppleAccountSub != "" && (
              <LinkOffIcon
                style={{
                  width: "48px",
                  color: theme.colors.primary,
                  position: "absolute",
                  height: "auto",
                  top: "-70px",
                }}
              />
            )}
            {linkAppleAccountSub != "" && (
              <Image
                src="https://perygonblob.blob.core.windows.net/public/AppleToPerygonIcon.png?sp=r&st=2024-10-29T11:53:27Z&se=2030-11-01T19:53:27Z&sv=2022-11-02&sr=c&sig=6el1LfIDyAeUG4tDxdrAm9t%2FLl8tg0Mysfc9lrB1g5Q%3D"
                alt="AppleToPerygon"
                position="absolute"
                objectFit="cover"
                objectPosition="bottom"
                width={"297px"}
                height={"47px"}
                top="-70px"
              />
            )}
            {linkAppleAccountSub != "" && (
              <Text
                pt={["0px", "10px"]}
                pb={["0px", "0px"]}
                fontSize={["12px", "12px"]}
                color="gray"
              >
                Your Apple account couldn&apos;t be linked to an existing
                Perygon user
              </Text>
            )}
            {linkAppleAccountSub != "" && (
              <Text
                pt={["0px", "10px"]}
                pb={["0px", "15px"]}
                fontSize={["12px", "12px"]}
                color="gray"
              >
                Please log in with your Perygon username and password below in
                order to permanently link this Apple account with your Perygon
                account.
              </Text>
            )}
            <InputField
              name="email"
              placeholder="Email"
              type="text"
              error={formErrors.email}
              icon={
                <EmailIcon
                  style={{
                    width: "20px",
                    color: formErrors.email ? "red" : "lightGray",
                  }}
                />
              }
              register={() => register("email", emailValidation)}
              focusBorderColor={theme.colors.primary}
            />
            <InputField
              name="password"
              placeholder="Password"
              type="password"
              error={formErrors.password}
              icon={
                <LockIcon
                  style={{
                    width: "20px",
                    color: formErrors.password ? "red" : "lightGray",
                  }}
                />
              }
              register={() =>
                register("password", {
                  required: "Password is required",
                })
              }
              focusBorderColor={theme.colors.primary}
            />
            <Flex w="100%" justifyContent="flex-end" h="min">
              {linkAppleAccountSub != "" && (
                <Text
                  fontSize={["16px", "12px"]}
                  cursor="pointer"
                  color={theme.colors.primary}
                  _hover={{ cursor: "pointer" }}
                  onClick={() => router.push("/login")}
                >
                  &raquo; Back to login
                </Text>
              )}
              {linkAppleAccountSub == "" && (
                <Text
                  fontSize={["16px", "12px"]}
                  cursor="pointer"
                  color={theme.colors.primary}
                  _hover={{ cursor: "pointer" }}
                  onClick={() => router.push("/password-recovery")}
                >
                  Forgot password?
                </Text>
              )}
            </Flex>
            {linkAppleAccountSub !== "" && (
              <Button
                mt={5}
                backgroundColor={theme.colors.primary}
                type="submit"
                w="full"
                isLoading={loading}
                height={12}
                color="white"
                _hover={{
                  color: "white",
                  border: `1px solid ${transparentize(theme.colors.primary, 0.8)(theme)}`,
                  backgroundColor: transparentize(theme.colors.primary, 0.85)(theme),
                }}
                onClick={() => handleButtonClick("email")}
              >
                Link this account
              </Button>
            )}
            {linkAppleAccountSub.length < 1 && (
              <Button
                mt={5}
                backgroundColor={theme.colors.primary}
                type="submit"
                w="full"
                isLoading={loading}
                height={12}
                color="white"
                _hover={{
                  color: "white",
                  border: `1px solid ${transparentize(theme.colors.primary, 0.1)(theme)}`,
                  backgroundColor: transparentize(theme.colors.primary, 0.85)(theme),
                }}
                onClick={() => handleButtonClick("email")}
              >
                Login with email
              </Button>
            )}
            {linkAppleAccountSub.length < 1 && (
              <VStack w="100%" spacing={0}>
                {/* <Text pt="10px" fontSize={["16px", "12px"]} color="gray" textAlign={"left"}>
                  Don&apos;t have an account?
                </Text> */}
                <Button
                  mt={1}
                  backgroundColor={"transparent"}
                  type="submit"
                  w="full"
                  isLoading={loading}
                  height={10}
                  color={theme.colors.primary}
                  border={`1px solid ${transparentize(theme.colors.primary, 0.8)(theme)}`}
                  _hover={{
                    color: theme.colors.primary,
                    border: `1px solid ${transparentize(theme.colors.primary, 0.5)(theme)}`,
                    backgroundColor: transparentize(theme.colors.primary, 0.05)(theme),
                  }}
                  onClick={() => router.push("sign-up")}
                >
                  Sign Up
                </Button>
              </VStack>
            )}
            <LoginFormButtons
              loading={loading}
              handleButtonClick={handleButtonClick}
              linkAppleAccountSub={linkAppleAccountSub ?? ""}
            />
          </VStack>
        )}
        <Flex
          gap={1}
          w={"100%"}
          top={6}
          position="relative"
          justify={"space-between"}
          align={"center"}
          direction={"column"}
        >
          <Text p="0" fontSize={["10px", "12px"]} color="gray">
            Sedulo Accountants Limited © 2024 - 2025 (V1.4.1)
          </Text>
          <Link href={"/privacy-policy"}>
            <Text p="0" fontSize={["10px", "12px"]} color="gray">
              Privacy Policy
            </Text>
          </Link>
        </Flex>
      </VStack>
    </form>
  );
}
