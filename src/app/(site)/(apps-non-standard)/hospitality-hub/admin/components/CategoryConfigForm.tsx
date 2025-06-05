"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";

interface Props {
  onAdd: () => void;
}

export default function CategoryConfigForm({ onAdd }: Props) {
  const [key, setKey] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState(false);
  const [date, setDate] = useState(false);

  const handleSubmit = async () => {
    await fetch("/api/hospitality-hub/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key,
        displayName,
        image,
        optionalFields: { location, date },
      }),
    });
    setKey("");
    setDisplayName("");
    setImage("");
    setLocation(false);
    setDate(false);
    onAdd();
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md" mb={4}>
      <VStack spacing={3} align="stretch">
        <FormControl>
          <FormLabel>Key</FormLabel>
          <Input value={key} onChange={(e) => setKey(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Display Name</FormLabel>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Image</FormLabel>
          <Input value={image} onChange={(e) => setImage(e.target.value)} />
        </FormControl>
        <Checkbox
          isChecked={location}
          onChange={(e) => setLocation(e.target.checked)}
        >
          Has Location
        </Checkbox>
        <Checkbox isChecked={date} onChange={(e) => setDate(e.target.checked)}>
          Has Date
        </Checkbox>
        <Button onClick={handleSubmit} colorScheme="pink">
          Add Category
        </Button>
      </VStack>
    </Box>
  );
}
