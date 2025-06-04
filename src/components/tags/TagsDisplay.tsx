"use client";

import { Wrap } from "@chakra-ui/react";
import { Tag } from "./Tag";

interface TagsDisplayProps {
  tags: {
    id: number;
    name: string;
    colour: string;
  }[];
}

export const TagsDisplay = ({ tags }: TagsDisplayProps) => {
  return (
    <Wrap>
      {tags.map((tag) => (
        <Tag key={tag.id} id={tag.id} name={tag.name} colour={tag.colour} />
      ))}
    </Wrap>
  );
};
