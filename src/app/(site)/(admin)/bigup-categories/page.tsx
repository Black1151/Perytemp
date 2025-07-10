"use client";

import { redirect } from "next/navigation";
import DataGridComponent from "@/components/agGrids/DataGridComponent";
import { categoryFields } from "../../../../components/agGrids/dataFields/recognitionCategoryFields";
import AdminHeader from "@/components/AdminHeader";
import { useState, useEffect } from "react";
import { useUser } from "@/providers/UserProvider";
import { Spinner, useTheme, Center } from "@chakra-ui/react";

export default function RecognitionCategoriesPage() {
  const [categories, setCategories] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const { user } = useUser();
  const theme = useTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const customerId = user?.role === 'PA' ? null : user?.customerId;
        const url = customerId ? `/api/bigup?customerId=${customerId}` : '/api/bigup';
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCategories();
    }
  }, [user]);

  if (error) return <div>Failed to load categories.</div>;
  if (isLoading) return (
    <Center h="80vh">
      <Spinner size="xl" color={theme.colors.elementBG} />
    </Center>
  );

  const categoryData = categories?.resource || [];
  const categoryCount = categoryData.length;

  return (
    <>
      <AdminHeader headingText={"Recognition Categories"} dataCount={categoryCount} />
      <DataGridComponent
        data={categoryData}
        initialFields={categoryFields}
        createNewUrl={"/bigup-categories/create"}
      />
    </>
  );
}
