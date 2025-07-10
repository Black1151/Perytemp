import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import {
  Box,
  HStack,
  Text,
  VStack,
  Stack,
  useBreakpointValue,
  useToast,
  FormControl,
  Select,
  Spinner,
  useTheme,
} from "@chakra-ui/react";
import { useFetchClient } from "@/hooks/useFetchClient";
import { useUser } from "@/providers/UserProvider";

interface Address {
  address1: string;
  address2: string;
  city: string;
  county: string;
  postcode: string;
  country: string; // holds country code
}

export interface Country {
  id: number;
  type: string;
  label: string;
  value: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

export interface BillingAddressFormHandle {
  /**
   * Returns the current address if valid, otherwise null.
   */
  getAddress: () => Address | null;
}

const BillingAddressForm = forwardRef<BillingAddressFormHandle>((_props, ref) => {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const toast = useToast();
  const { fetchClient } = useFetchClient();
  const [loading, setLoading] = useState(false);
  const user = useUser();
  const theme = useTheme();

  const [address, setAddress] = useState<Address>({
    address1: "",
    address2: "",
    city: "",
    county: "",
    postcode: "",
    country: "337",
  });
  const [countries, setCountries] = useState<Country[]>([]);

  // Fetch countries list
  const fetchCountries = async () => {
    try {
      const data = await fetchClient<{ country?: Array<{ value: number; label: string; name: string }> }>(
        "/api/surveyjs/selectItems?type=country"
      );
      if (!data || !data.country || !Array.isArray(data.country)) {
        console.warn("Unexpected country payload:", data);
        return;
      }
      setCountries(
        data.country.map((c) => ({
          id: c.value,
          type: "country",
          label: c.label,
          value: String(c.value),
          sortOrder: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 0,
          updatedBy: 0,
        }))
      );
    } catch (err) {
      console.error("Error fetching countries:", err);
    }
  };

  // Fetch saved address
  const fetchAddress = async () => {
    if (!user?.user?.customerUniqueId) return;
    try {
      const params = new URLSearchParams({ uniqueId: user.user.customerUniqueId });
      const result = await fetchClient<{ resource?: any }>(`/api/customer/findBy?${params}`);
      if (!result || !result.resource) return;
      const res = result.resource;
      const {
        address1 = "",
        address2 = "",
        address3: rawCity = "",
        address4: rawCounty = "",
        postcode = "",
        country: countryCode = "",
      } = res;
      setAddress({
        address1: address1 || "",
        address2: address2 || "",
        city: rawCity !== "-" ? rawCity : "",
        county: rawCounty !== "-" ? rawCounty : "",
        postcode: postcode || "",
        country: countryCode || "337",
      });
    } catch (err: any) {
      toast({ title: "Error fetching address", description: err.message, status: "error" });
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchCountries();
      await fetchAddress();
      setLoading(false);
    };
    load();
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      getAddress: () => {
        // validate required fields
        const required: Array<keyof Address> = ["address1", "city", "postcode", "country"];
        const labels: Record<keyof Address, string> = {
          address1: "Address line 1",
          address2: "Address line 2",
          city: "Town/City",
          county: "County",
          postcode: "Postcode",
          country: "Country",
        };
        for (const field of required) {
          if (!address[field]?.trim()) {
            return null;
          }
        }
        return address;
      },
    }),
    [address, toast]
  );

  const handleChange = (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Box bg={theme.colors.elementBG} borderRadius="lg" boxShadow="sm" p={6} mt={3} color={theme.colors.primaryTextColor}>
      {!isMobile && (
        <HStack justify="space-between" mb={4}>
          <Text fontSize={[14, 16, 18]} fontWeight="semibold">
            Billing Address
          </Text>
          {loading && <Spinner size="sm" />}
        </HStack>
      )}
      <Stack spacing={3} mb={3}>
        {!loading && (
          <VStack spacing={3} align="stretch">
            <input
              name="address1"
              placeholder="Address line 1"
              value={address.address1}
              onChange={handleChange("address1")}
              required
              autoComplete="address-line1"
              disabled={loading}
              style={{ padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E0", fontSize: "16px", background: "transparent" }}
            />
            <input
              name="address2"
              placeholder="Address line 2 (optional)"
              value={address.address2}
              onChange={handleChange("address2")}
              autoComplete="address-line2"
              disabled={loading}
              style={{ padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E0", fontSize: "16px", background: "transparent" }}
            />
            <input
              name="city"
              placeholder="Town/City"
              value={address.city}
              onChange={handleChange("city")}
              required
              autoComplete="address-level2"
              disabled={loading}
              style={{ padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E0", fontSize: "16px", background: "transparent" }}
            />
            <input
              name="county"
              placeholder="County (optional)"
              value={address.county}
              onChange={handleChange("county")}
              autoComplete="address-level1"
              disabled={loading}
              style={{ padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E0", fontSize: "16px", background: "transparent" }}
            />
            <input
              name="postcode"
              placeholder="Postcode"
              value={address.postcode}
              onChange={handleChange("postcode")}
              required
              autoComplete="postal-code"
              disabled={loading}
              style={{ padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E0", fontSize: "16px", textTransform: "uppercase" , background: "transparent" }}
            />
            <FormControl isRequired>
              <Select
                name="country"
                value={address.country}
                onChange={handleChange("country")}
                disabled={loading}
                placeholder="Select country"
              >
                {countries.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        )}
      </Stack>
    </Box>
  );
});

BillingAddressForm.displayName = "BillingAddressForm";
export default BillingAddressForm;
