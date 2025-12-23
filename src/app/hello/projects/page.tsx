import React from 'react'
import CustomBreadcrumb from '@/app/comps/breadCrumb'
import AnimatedSection from '@/app/components/AnimatedSection'
import { FolderOpen } from 'lucide-react'
import CardComp from './CardComp'

export default function page() {
  return (
    <div className="min-h-screen">
      <div className="pl-10 opacity-70 font-mono pt-8">
        <CustomBreadcrumb
          pageNames={[{ name: 'Home', href: '/' }, { name: 'Projects', href: '/hello/projects' }]}
        />
      </div>

      <AnimatedSection className="text-center py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <FolderOpen className="text-[#76ABAE]" size={40} />
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold gradient-text">My Projects</h1>
          </div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            A selection of my work spanning AI/ML, full-stack development, and creative experiments. Click any project card to open a detailed, scrollable preview.
          </p>
        </div>
      </AnimatedSection>

      <div className="px-6 pb-20">
        <CardComp />
      </div>
    </div>
  )
}
