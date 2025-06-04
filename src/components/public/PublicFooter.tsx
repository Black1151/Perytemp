import React from "react";
import { Flex, Link } from "@chakra-ui/react";

const PublicFooter = () => {
  return (
    <Flex justify={"space-between"} align={"center"} w={["95%", "90%", "85%"]}>
      <Link
        href={"https://sedulo.co.uk/"}
        color="white"
        _hover={{ textDecoration: "underline", cursor: "pointer" }}
        isExternal
      >
        Sedulo Accountants Limited
      </Link>
      <Link
        href={
          "https://sedulo.co.uk/wp-content/uploads/2024/07/Sedulo-Privacy-Notice.pdf"
        }
        color="white"
        _hover={{ textDecoration: "underline", cursor: "pointer" }}
        isExternal
      >
        Sedulo Privacy Policy
      </Link>
    </Flex>
  );
};

export default PublicFooter;
