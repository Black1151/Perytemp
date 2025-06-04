import {useState} from "react";

export type DrawerStateOptions = "closed" | "half-open" | "fully-open";

interface UseDrawerStateProps {
    initialState?: DrawerStateOptions;
    canHalf?: boolean;
    canFull?: boolean;
}

interface UseDrawerStateReturn {
    drawerState: DrawerStateOptions;
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
}

const UseDrawerState = ({
                            initialState = "closed",
                            canHalf = false,
                            canFull = false,
                        }: UseDrawerStateProps): UseDrawerStateReturn => {
    const [drawerState, setDrawerState] =
        useState<DrawerStateOptions>(initialState);

    const closeDrawer = () => {
        setDrawerState("closed");
    };

    const openDrawer = () => {
        if (canFull) {
            setDrawerState("fully-open");
        } else if (canHalf) {
            setDrawerState("half-open");
        } else {
            closeDrawer();
        }
    };

    const toggleDrawer = () => {
        setDrawerState((prevState) => {
            if (prevState === "fully-open") {
                return canHalf ? "half-open" : "closed"
            }

            if (prevState === "half-open") {
                return canFull ? "fully-open" : "closed"
            }

            return prevState;

        });
    };

    return {
        drawerState,
        openDrawer,
        closeDrawer,
        toggleDrawer,
    };
};

export default UseDrawerState;
