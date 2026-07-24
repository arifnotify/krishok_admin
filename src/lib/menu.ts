import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  Users,
  Image,
  Zap,
  MapPin,
  Phone,
  Gift,
  Wallet,
  History,
  Settings,
  Bike,
} from "lucide-react";


export const menu = [
  {
    title: "MAIN",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },


  {
    title: "MANAGEMENT",
    items: [
      {
        name: "Orders",
        href: "/dashboard/orders",
        icon: ShoppingCart,
      },

      {
        name: "Products",
        href: "/dashboard/products",
        icon: Package,
      },

      {
        name: "Categories",
        href: "/dashboard/categories",
        icon: Layers,
      },

      {
        name: "Users",
        href: "/dashboard/users",
        icon: Users,
      },

      {
        name: "Riders",
        href: "/dashboard/riders",
        icon: Bike,
      },
    ],
  },


  {
    title: "MARKETING",
    items: [
      {
        name: "Banners",
        href: "/dashboard/banners",
        icon: Image,
      },

      {
        name: "Flash Sale",
        href: "/dashboard/flash-sale",
        icon: Zap,
      },
    ],
  },


  {
    title: "REWARD",
    items: [
      {
        name: "Reward Settings",
        href: "/dashboard/reward-settings",
        icon: Gift,
      },

      {
        name: "Reward Wallet",
        href: "/dashboard/reward-wallets",
        icon: Wallet,
      },

      {
        name: "Transactions",
        href: "/dashboard/reward-transactions",
        icon: History,
      },
    ],
  },


  {
    title: "SYSTEM",
    items: [
      {
        name: "Locations",
        href: "/dashboard/locations",
        icon: MapPin,
      },

      {
        name: "Support",
        href: "/dashboard/support-links",
        icon: Phone,
      },

      {
        name: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];