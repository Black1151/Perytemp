'use client';

import React, {useState} from 'react';
import {Avatar, Flex, Text} from "@chakra-ui/react";
import StaffHappinessDetailModal
    from "@/app/(site)/(apps)/happiness-score/dashboard/company-dashboard/StaffHappinessDetailModal";
import {useWorkflow} from "@/providers/WorkflowProvider";

interface StaffHappinessDetailsProps {
    data: {
        userId?: number;
        fullName?: string;
        userImageUrl?: string;
        imageUrl?: string;
    }
}

const StaffHappinessDetailsRenderer: React.FC<StaffHappinessDetailsProps> = ({data}) => {
    const {toolId, workflowId} = useWorkflow();
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [staffHappinessDetailsModalData, setStaffHappinessDetailsModalData] = useState<any>(null);

    const handleUserClick = () => {
        if (data.userId) {
            fetchHappinessScoreTwoMonthHistory(data.userId);
        }
    };

    const fetchHappinessScoreTwoMonthHistory = async (userId: number) => {
        try {
            const response = await fetch("/api/happiness-score/dashboards/user-current-happiness", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({toolId: toolId, workflowId: workflowId, businessProcessId: 1, userId}),
            });

            if (!response.ok) throw new Error("Failed to fetch happiness scores.");
            const result = await response.json();
            setStaffHappinessDetailsModalData(result.resource);
            setIsUserModalOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Flex
                alignItems="center"
                w="100%"
                h="100%"
                py={1}
                onClick={handleUserClick}
                cursor="pointer"
                gap={[2, 4]}
            >
                <Avatar name={data.fullName}
                        src={data.userImageUrl || data.imageUrl || ""}
                        size="sm" sx={{fontSize: "0.65rem"}}/>
                <Text>{data.fullName}</Text>
            </Flex>

            {isUserModalOpen && staffHappinessDetailsModalData && (
                <StaffHappinessDetailModal
                    isOpen={isUserModalOpen}
                    onClose={() => {
                        setIsUserModalOpen(false);
                        setStaffHappinessDetailsModalData(null);
                    }}
                    {...staffHappinessDetailsModalData}
                />
            )}
        </>
    );
};

export default StaffHappinessDetailsRenderer;