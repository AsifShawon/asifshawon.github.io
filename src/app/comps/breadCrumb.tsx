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
          <React.Fragment key={`crumb-${index}`}>
            <BreadcrumbItem className="flex items-center">
              <BreadcrumbLink href={page.href}>
                {page.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {/* Separator should not be inside the <li> */}
            <BreadcrumbSeparator />
          </React.Fragment>
        ))}

        {/* Last item as BreadcrumbPage without a link */}
        <BreadcrumbItem key={`last-${lastPage?.name}`}>
          <BreadcrumbPage>{lastPage.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
