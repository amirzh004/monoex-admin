"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { LawsSection } from "@/components/admin/LawsSection"
import { NewsSection } from "@/components/admin/NewsSection"
import { ReviewsSection } from "@/components/admin/ReviewsSection"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("laws")

  const renderContent = () => {
    switch (activeTab) {
      case "laws":
        return <LawsSection />
      case "news":
        return <NewsSection />
      case "reviews":
        return <ReviewsSection />
      default:
        return <LawsSection />
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AdminHeader />
        <div className="flex flex-col lg:flex-row flex-1 pt-16">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 p-4 lg:p-6 lg:ml-64 mt-4 lg:mt-0">
            <div className="max-w-7xl mx-auto w-full">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}