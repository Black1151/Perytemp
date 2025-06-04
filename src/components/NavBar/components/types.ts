// components/NavBar/types.ts
export interface MenuItemProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  orderGroup: number;
}
