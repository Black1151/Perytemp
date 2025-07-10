"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { useFetchClient } from "@/hooks/useFetchClient";
import { Toast, useToast } from "@chakra-ui/react";

export interface Basket {
  id: number;
  uniqueId: string;
  userUniqueId: string;
  statusId: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  isAnnual: boolean;
  isFree: boolean;
  customerId: number | null;
  discountCode: string | null;
  quantity: number;
  reason: string | null;
  licensedUsers: number;
  ownedSubscriptionInfo: SubscriptionInfo[];
  content: BasketItem[];
  totals: Totals;
  annualDiscountPercent: number | null;
  invoiceUrl?: string;
  renewalDate?: string;
}

export interface SubscriptionInfo {
  /** This is the subscription‐record's PK */
  id: number;
  subscriptionTypeId: number;
  subscriptionStartDate: string;

  /** All of the ToolConfig fields that come back under ownedSubscriptionInfo */
  name: string;
  displayName: string;
  description: string;
  previewText: string;
  showInSeeMoreList: boolean;
  userAccessGroupNames: string[] | null;
  categoryId: number;
  iconImageUrl: string | null;
  thumbnailImageUrl: string | null;
  previewImageUrl: string | null;
  appUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  logoImageUrl: string | null;
  isTrialable: boolean;
  uniqueId: string;

  annualPrice: string;
  monthlyPrice: string;
  guideHtml: string | null;
  guideFilePath: string | null;

  /** per‐item discounts applied */
  discounts: Discount[];

  /** computed totals after quantity & discounts */
  itemSubtotal: number;
  itemDiscountTotal: number;
  itemGrandTotal: number;
}

export interface BasketItem {
  id: number;
  uniqueId: string;
  basketUniqueId: string;
  toolConfigUniqueId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  newLicences: number;
  isFree: boolean;

  /** these three track the raw line‐item before discounts */
  subTotal: number | null;
  discountTotal: number | null;
  grandTotal: number | null;

  /** your existing ToolConfig shape */
  toolConfig: ToolConfig;

  /** per‐item discounts applied */
  discounts: Discount[];

  /** computed totals after quantity & discounts */
  itemSubtotal: number;
  itemDiscountTotal: number;
  itemGrandTotal: number;
}

export interface ToolConfig {
  id: number;
  name: string;
  displayName: string;
  description: string;
  previewText: string;
  showInSeeMoreList: boolean;
  userAccessGroupNames: string[] | null;
  categoryId: number;
  iconImageUrl: string | null;
  thumbnailImageUrl: string | null;
  previewImageUrl: string | null;
  appUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  logoImageUrl: string | null;
  isTrialable: boolean;
  uniqueId: string;
  workflowId: number;

  annualPrice: string;
  monthlyPrice: string;

  discountedAnnualPrice?: string;
  discountedMonthlyPrice?: string;
  discount?: Discount[];

  guideHtml?: string | null;
  guideFilePath?: string | null;
}

export interface Discount {
  name: string;
  uniqueId: string;
  percent: number;
  amount: number | null;
}

export interface Totals {
  subtotal: string;
  discounts: Discount[];
  discountsTotal: string;
  taxTotal: string;
  grandTotal: string;
}

export interface UpdateBasketProps {
  subscriptions?: string[];
  isAnnual?: boolean;
  quantity?: number;
}

type BasketContextType = {
  basket: Basket | null;
  subscription: Basket | null;
  loading: boolean;
  error: Error | null;
  getBasket: () => Promise<void>;
  updateBasket: (basket: UpdateBasketProps) => Promise<void>;
  clearBasket: () => Promise<void>;
  removeItemFromBasket: (itemUId: string) => Promise<void>;
  changeLicenseCount: (delta: number, isNegative: boolean) => Promise<void>;
  getSubscription: () => Promise<void>;
  addVoucher: (voucher: string) => Promise<void>;
  removeVoucher: () => Promise<void>;
};

const BasketContext = createContext<BasketContextType | undefined>(undefined);

interface BasketProviderProps {
  children: ReactNode;
}

export const BasketProvider = ({ children }: BasketProviderProps) => {
  const { fetchClient } = useFetchClient();
  const toast = useToast();
  const [basket, setBasket] = useState<Basket | null>(null);
  const [subscription, setSubscription] = useState<Basket | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * GET /api/basket — fetch the current basket
   */
  const getBasket = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchClient<{
        resource: Basket;
        message?: string;
      }>("/api/basket", {
        method: "GET",
        redirectOnError: false,
      });

      const isEmptyObject =
        response &&
        response.resource &&
        Object.keys(response.resource).length === 0;

      const couldNotRetrieve =
        response?.message && response.message.includes("Couldn't retrieve");

      if (isEmptyObject || couldNotRetrieve) {
        console.error("[Basket] ERROR: No basket found");
        return;
      }

      if (response && response.resource) {
        setBasket(response.resource);
      } else {
        const err = new Error("No basket data returned");
        console.error("[Basket] GET error:", err);
        setError(err);
      }
    } catch (err: any) {
      console.error("[Basket] GET exception:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * GET /api/basket — fetch the current basket
   */
  const getSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchClient<{
        resource: Basket;
        message?: string;
      }>("/api/basket/subscription", {
        method: "GET",
        redirectOnError: false,
      });

      const isEmptyObject =
        response &&
        response.resource &&
        Object.keys(response.resource).length === 0;

      const couldNotRetrieve =
        response?.message && response.message.includes("Couldn't retrieve");

      if (isEmptyObject || couldNotRetrieve) {
        console.error("[Subscription] ERROR: No basket found");
        return;
      }

      if (response && response.resource) {
        setSubscription(response.resource);
      } else {
        const err = new Error("No basket data returned");
        console.error("[Subscription] GET error:", err);
        setError(err);
      }
    } catch (err: any) {
      console.error("[Subscription] GET exception:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * PUT /api/basket — update the current basket
   */
  const updateBasket = async (basketUpdate: UpdateBasketProps) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchClient<{ resource: any }>("/api/basket", {
        method: "PUT",
        body: JSON.stringify(basketUpdate),
      });

      if (data && data.resource) {
        setBasket(data.resource);
      } else {
        const err = new Error("Failed to update basket");
        setError(err);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * PUT /api/basket — update the current basket
   */
  const changeLicenseCount = async (delta: number, isNegative: boolean) => {
    setLoading(true);
    setError(null);

    if(!basket) {
        return;
      }

    const basketUpdate = {
      quantity: (basket?.quantity ?? basket.licensedUsers) + (isNegative ? -delta : delta),
    };

    try {
      const data = await fetchClient<{ resource: any }>("/api/basket", {
        method: "PUT",
        body: JSON.stringify(basketUpdate),
      });


      if (data && data.resource) {
        setBasket(data.resource);
      } else {
        const err = new Error("Failed to update basket");
        setError(err);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * DELETE /api/basket — clear the current basket
   */
  const clearBasket = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClient<{ resource: Basket }>("/api/basket", {
        method: "DELETE",
      });

      if (data && data.resource) {
        setBasket(data.resource);
      } else {
        const err = new Error("Failed to update basket");
        setError(err);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * DELETE /api/basket/item — remove an item from the basket
   */
  const removeItemFromBasket = async (itemUId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClient<{ resource: Basket }>(`/api/basket/${itemUId}`, {
        method: "DELETE",
      });

      if (data && data.resource) {
        setBasket(data.resource);
      } else {
        const err = new Error("Failed to update basket");
        setError(err);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * PUT /api/basket/voucher — add a voucher to the basket
   */
  const addVoucher = async (voucher: string) => {
    if (!voucher?.trim()) {
      throw new Error("Please enter a valid voucher code");
    }

    // Clean the voucher code
    const cleanVoucher = voucher.trim().replace(/^["']|["']$/g, '');

    setLoading(true);
    setError(null);

    try {
      const data = await fetchClient<{ resource: Basket }>("/api/basket/voucher", {
        method: "PUT",
        body: JSON.stringify(cleanVoucher),
      });

      if (!data?.resource) {
        throw new Error("Failed to apply voucher");
      }

      if (data.resource.discountCode === null) {
        if (data.resource.reason) {
          toast({
            title: "Voucher Issue",
            description: data.resource.reason,
            status: "error",
            duration: 10000,
            isClosable: true,
          });
          throw new Error(data.resource.reason);
        } else {
          toast({
            title: "Voucher Invalid",
            description: "Please contact sales",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        setBasket(data.resource);
      }
    } catch (err: any) {
      const error = new Error(err.message || "Failed to apply voucher");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeVoucher = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchClient<{ resource: Basket }>("/api/basket/voucher/remove", {
        method: "PUT",
      });

      if (!data?.resource) {
        throw new Error("Failed to remove voucher");
      }

      setBasket(data.resource);
    } catch (err: any) {
      const error = new Error(err.message || "Failed to remove voucher");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check for empty basket states and if is empty, clear the basket
   */
  const checkForEmptyBasket = (basket: Basket | null) => {
  if (!basket?.totals) return false;

  const noNewItems =
    basket.content.length === basket.ownedSubscriptionInfo.length;
  const noSeatChange =
    basket.licensedUsers === basket.quantity;

  if (noNewItems && noSeatChange) {
    return true;
  }

  return false;
};

  const prevBasketRef = useRef<Basket | null>(null);

  useEffect(() => {
    const prev = prevBasketRef.current;
    const nowEmpty = basket && checkForEmptyBasket(basket);
    const wasNonEmpty = prev && !checkForEmptyBasket(prev);

    if (nowEmpty && wasNonEmpty) {
      clearBasket();
    }

    prevBasketRef.current = basket;
  }, [basket]);

  useEffect(() => {
    getBasket();
  }, []);

  return (
    <BasketContext.Provider
      value={{ basket, loading, error, getBasket, updateBasket, clearBasket, removeItemFromBasket, changeLicenseCount, getSubscription, subscription, addVoucher, removeVoucher } as BasketContextType}
    >
      {children}
    </BasketContext.Provider>
  );
};

/**
 * Custom hook to consume BasketContext
 */
export const useBasket = (): BasketContextType => {
  const context = useContext(BasketContext);
  if (!context)
    throw new Error("useBasket must be used within a <BasketProvider>");
  return context;
};
