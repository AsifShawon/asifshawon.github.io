"use client";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface BreadcrumbProps {
  pageNames: { name: string; href: string }[]; // Expecting an array of objects with name and href properties
}

const CustomBreadcrumb: React.FC<BreadcrumbProps> = ({ pageNames }) => {
  const breadcrumbItems = pageNames.slice(0, -1); // All but the last page
  const lastPage = pageNames[pageNames.length - 1]; // The last page as the breadcrumb page

  return (
    <Breadcrumb className="flex items-center">
      <BreadcrumbList className="flex">
        {breadcrumbItems.map((page, index) => (
          <>
            <BreadcrumbItem key={index} className="flex items-center">
              <BreadcrumbLink href={page.href}>
                {page.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {/* Separator should not be inside the <li> */}
            <BreadcrumbSeparator key={`sep-${index}`} />
          </>
        ))}

        {/* Last item as BreadcrumbPage without a link */}
        <BreadcrumbItem>
          <BreadcrumbPage>{lastPage.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
