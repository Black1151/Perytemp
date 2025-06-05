"use client";

import { VStack, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CategoryFormProps {
  category: string;
  itemId?: string;
  initialData?: any;
}

const fieldsMap: Record<string, { name: string; label: string }[]> = {
  hotels: [
    { name: "name", label: "Name" },
    { name: "location", label: "Location" },
    { name: "rating", label: "Rating" },
    { name: "description", label: "Description" },
    { name: "image", label: "Image URL" },
  ],
  rewards: [
    { name: "name", label: "Name" },
    { name: "points", label: "Points" },
    { name: "description", label: "Description" },
    { name: "expiryDate", label: "Expiry Date" },
    { name: "image", label: "Image URL" },
  ],
  events: [
    { name: "name", label: "Name" },
    { name: "date", label: "Date" },
    { name: "location", label: "Location" },
    { name: "description", label: "Description" },
    { name: "image", label: "Image URL" },
  ],
  medical: [
    { name: "provider", label: "Provider" },
    { name: "speciality", label: "Speciality" },
    { name: "location", label: "Location" },
    { name: "contact", label: "Contact" },
    { name: "image", label: "Image URL" },
  ],
  legal: [
    { name: "provider", label: "Provider" },
    { name: "speciality", label: "Speciality" },
    { name: "location", label: "Location" },
    { name: "contact", label: "Contact" },
    { name: "image", label: "Image URL" },
  ],
};

export default function CategoryForm({ category, itemId, initialData }: CategoryFormProps) {
  const { fetchClient, loading } = useFetchClient();
  const router = useRouter();
  const [formData, setFormData] = useState<any>(initialData || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const method = itemId ? "PUT" : "POST";
    const url = itemId
      ? `/api/hospitality-hub/${category}/${itemId}`
      : `/api/hospitality-hub/${category}`;

    const result = await fetchClient(url, {
      method,
      body: formData,
      successMessage: itemId ? "Updated successfully" : "Created successfully",
      redirectOnError: false,
    });

    if (result) {
      router.push(`/hospitality-hub/admin`);
    }
  };

  const handleDelete = async () => {
    if (!itemId) return;
    if (!confirm("Are you sure you want to delete this item?")) return;

    const result = await fetchClient(`/api/hospitality-hub/${category}/${itemId}`,
      {
        method: "DELETE",
        successMessage: "Deleted successfully",
        redirectOnError: false,
      });

    if (result) {
      router.push(`/hospitality-hub/admin`);
    }
  };

  const fields = fieldsMap[category] || [];

  return (
    <VStack spacing={4} align="stretch" mt={4}>
      {fields.map((field) => (
        <FormControl key={field.name}>
          <FormLabel>{field.label}</FormLabel>
          <Input
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
          />
        </FormControl>
      ))}
      <Button onClick={handleSubmit} isLoading={loading} colorScheme="blue">
        {itemId ? "Update" : "Create"}
      </Button>
      {itemId && (
        <Button onClick={handleDelete} colorScheme="red" isLoading={loading}>
          Delete
        </Button>
      )}
    </VStack>
  );
}
