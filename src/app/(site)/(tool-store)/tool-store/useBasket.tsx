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
  licensedUsers: number;
  ownedSubscriptionInfo: SubscriptionInfo[];
  content: BasketItem[];
  totals: Totals;
  annualDiscountPercent: number | null;
  invoiceUrl?: string;
  renewalDate?: string;
}

export interface SubscriptionInfo {
  /** This is the subscription‐record’s PK */
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
};

const BasketContext = createContext<BasketContextType | undefined>(undefined);

interface BasketProviderProps {
  children: ReactNode;
}

export const BasketProvider = ({ children }: BasketProviderProps) => {
  const { fetchClient } = useFetchClient();
  const [basket, setBasket] = useState<Basket | null>(null);
  const [subscription, setSubscription] = useState<Basket | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  //   console.log("[Basket] POST /api/basket — creating new basket");
  //   setError(null);

  //   const defaultPayload = {
  //     quantity: 0,
  //     subscriptions: ["626b1c62-a5cd-4478-aa88-5935bf8023df"],
  //     isAnnual: true,
  //   };

  //   try {
  //     const data = await fetchClient<{ resource: Basket }>("/api/basket", {
  //       method: "POST",
  //       body: defaultPayload,
  //     });

  //     console.log("[Basket] POST response:", data);

  //     if (data && data.resource) {
  //       setBasket(data.resource);
  //     } else {
  //       const err = new Error("Failed to create basket");
  //       console.error("[Basket] POST error:", err);
  //       setError(err);
  //     }
  //   } catch (err: any) {
  //     console.error("[Basket] POST exception:", err);
  //     setError(err);
  //   }
  // };

  /**
   * GET /api/basket — fetch the current basket
   */
  const getBasket = async () => {
    console.log("[Basket] GET /api/basket — start");
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

      console.log("[Basket] GET response:", response);

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
        console.log("[Basket] GET basket:", response.resource);
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
      console.log("[Basket] GET /api/basket — complete");
    }
  };

  /**
   * GET /api/basket — fetch the current basket
   */
  const getSubscription = async () => {
    console.log("[Subscription] GET /api/basket — start");
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

      console.log("[Subscription] GET response:", response);

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
        console.log("[Subscription] GET basket:", response.resource);
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
      console.log("[Subscription] GET /api/basket/subscription — complete");
    }
  };

  /**
   * PUT /api/basket — update the current basket
   */
  const updateBasket = async (basketUpdate: UpdateBasketProps) => {
    console.log("[Basket] PUT /api/basket — updating basket", basketUpdate);
    setLoading(true);
    setError(null);

    // //If the basketUpdate includes a quanity we need to get the current tools the user owns add add their ids into the basketUpdate
    // if (basketUpdate.quantity) {
    //   const ownedSubscriptionInfo = basket?.ownedSubscriptionInfo || [];

    //   const subscriptions = ownedSubscriptionInfo.map((tool) => tool.uniqueId);
    //   basketUpdate.subscriptions = subscriptions;
    // }

    try {
      const data = await fetchClient<{ resource: any }>("/api/basket", {
        method: "PUT",
        body: JSON.stringify(basketUpdate),
      });

      console.log("[Basket] PUT response:", data);

      if (data && data.resource) {
        console.log("HERE: NEW BASKET", data.resource); 
        setBasket(data.resource);
      } else {
        const err = new Error("Failed to update basket");
        console.error("[Basket] PUT error:", err);
        setError(err);
      }
    } catch (err: any) {
      console.error("[Basket] PUT exception:", err);
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
        console.error("[Basket] No basket found to update");
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

      console.log("[Basket] PUT response:", data);

      if (data && data.resource) {
        console.log("HERE: NEW BASKET", data.resource); 
        setBasket(data.resource);
      } else {
        const err = new Error("Failed to update basket");
        console.error("[Basket] PUT error:", err);
        setError(err);
      }
    } catch (err: any) {
      console.error("[Basket] PUT exception:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * DELETE /api/basket — clear the current basket
   */
  const clearBasket = async () => {
    console.log("[Basket] DELETE /api/basket — clearing basket");
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClient<{ resource: Basket }>("/api/basket", {
        method: "DELETE",
      });

      console.log("[Basket] DELETE response:", data);

      if (data && data.resource) {
        setBasket(data.resource);
      } else {
        const err = new Error("Failed to update basket");
        console.error("[Basket] DELETE error:", err);
        setError(err);
      }
    } catch (err: any) {
      console.error("[Basket] DELETE exception:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * DELETE /api/basket/item — remove an item from the basket
   */
  const removeItemFromBasket = async (itemUId: string) => {
    console.log("[Basket] DELETE /api/basket/item — removing item from basket", itemUId);
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClient<{ resource: Basket }>(`/api/basket/${itemUId}`, {
        method: "DELETE",
      });

      console.log("[Basket] DELETE response:", data);

      if (data && data.resource) {
        setBasket(data.resource);
      } else {
        const err = new Error("Failed to update basket");
        console.error("[Basket] DELETE error:", err);
        setError(err);
      }
    } catch (err: any) {
      console.error("[Basket] DELETE exception:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * PUT /api/basket/voucher — add a voucher to the basket
   */
  const addVoucher = async (voucher: string) => {
    console.log("[Basket] PUT /api/basket/voucher — adding voucher", voucher);
    setLoading(true);
    setError(null);

    try {
      const data = await fetchClient<{ resource: Basket }>("/api/basket/voucher", {
        method: "PUT",
        body: JSON.stringify({ "dicountCode": voucher }),
      });

      console.log("[Basket] PUT response:", data);

      if (data && data.resource) {
        setBasket(data.resource);
      } else {
        const err = new Error("Failed to update basket");
        console.error("[Basket] PUT error:", err);
        setError(err);
      }
    } catch (err: any) {
      console.error("[Basket] PUT exception:", err);
      setError(err);
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
    console.log(
      "[Basket] No new items AND no change in licensed users — clearing basket"
    );
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
      console.log("[Basket Empty?] Basket is empty, clearing basket");
      clearBasket();
    }

    prevBasketRef.current = basket;
  }, [basket]);

  useEffect(() => {
    getBasket();
  }, []);

  return (
    <BasketContext.Provider
      value={{ basket, loading, error, getBasket, updateBasket, clearBasket, removeItemFromBasket, changeLicenseCount, getSubscription, subscription, addVoucher } as BasketContextType}
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
