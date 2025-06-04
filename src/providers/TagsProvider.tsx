"use client";

import { createContext, useContext, ReactNode, useState, useMemo } from "react";
import { Tag } from "@/components/AdminDetailsBanners/TagDetailsBanner";

interface TagsContextType {
  recordIds?: RecordIds;
  recordTypeId?: string;
  tags: Tag[];
  setRecordDetails: (recordIds: RecordIds, recordTypeId: string) => void;
  setTags: (tags: Tag[]) => void;
}

type RecordIds = {
  recordCustomerId: string;
  recordId: string;
  recordParentId: string;
};

const TagsContext = createContext<TagsContextType | undefined>(undefined);

interface TagsProviderProps {
  children: ReactNode;
}

export function TagsProvider({ children }: TagsProviderProps) {
  const [recordIds, setRecordIds] = useState<RecordIds>();
  const [recordTypeId, setRecordTypeId] = useState<string>();
  const [tags, setTags] = useState<Tag[]>([]);

  const setRecordDetails = (recordIds: RecordIds, recordTypeId: string) => {
    setRecordIds(recordIds);
    setRecordTypeId(recordTypeId);
  };

  const contextValue = useMemo(
    () => ({
      recordIds,
      recordTypeId,
      tags,
      setRecordDetails,
      setTags,
    }),
    [recordIds, recordTypeId, tags],
  );

  return (
    <TagsContext.Provider value={contextValue}>{children}</TagsContext.Provider>
  );
}

export function useTags() {
  const context = useContext(TagsContext);
  if (context === undefined) {
    throw new Error("useTags must be used within a TagsProvider");
  }
  return context;
}
