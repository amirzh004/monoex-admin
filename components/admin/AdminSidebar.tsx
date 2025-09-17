"use client"

import { FileText, Newspaper, Star } from "lucide-react"

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const tabs = [
    { id: "laws", label: "Законодательство", icon: FileText },
    { id: "news", label: "Новости", icon: Newspaper },
    { id: "reviews", label: "Отзывы", icon: Star },
  ]

  return (
    <aside className="w-full lg:w-64 lg:fixed lg:top-16 lg:bottom-0 lg:left-0 bg-white border-b lg:border-r border-gray-300 z-10">
      <nav
        className="
          p-4 flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2
          overflow-x-auto lg:overflow-x-visible
          scrollbar-hide
        "
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`
                flex items-center justify-start flex-shrink-0 
                lg:w-full px-4 py-3 rounded-lg text-sm font-medium 
                transition-colors duration-200 font-sans
                ${isActive
                  ? "bg-[#2c3e50] text-white shadow-md hover:bg-[#2a3a4f] cursor-default"
                  : "bg-transparent text-gray-700 hover:bg-gray-100 cursor-pointer"}
              `}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}