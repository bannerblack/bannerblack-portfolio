"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";

const MainBreadcrumb = () => {
  const pathname = usePathname();
  return (
    <div>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">home</BreadcrumbLink>
          </BreadcrumbItem>
          {pathname.split("/").map((path, index) => (
            <>
              <BreadcrumbItem key={index}>
                <BreadcrumbLink href={`/${path}`}>{path}</BreadcrumbLink>
              </BreadcrumbItem>
              {index !== pathname.split("/").length - 1 && (
                <BreadcrumbSeparator />
              )}
            </>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <Separator />
    </div>
  );
};

export default MainBreadcrumb;
