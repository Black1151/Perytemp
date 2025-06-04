import {Badge, Flex, Text} from "@chakra-ui/react";

interface TagProps {
    id: number;
    name: string;
    colour: string;
}

export const Tag = ({id, name, colour}: TagProps) => {
    return (
        <Flex direction="row" gap={4}>
            <Badge
                px={2}
                py={1}
                borderRadius="md"
                backgroundColor={colour}
                border={"1px solid"}
                borderColor={"white"}
                color="white"
                fontSize={['xs', 'sm', 'md']}
            >
                <Text fontSize={['xs', 'sm', 'md']}>
                    {name}
                </Text>
            </Badge>
        </Flex>
    );
};
