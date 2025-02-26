import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CustomLink = ({ title,href }: { title: string; href: string }) => {
  return (
    <Link href={href} prefetch={true} className="border-b-2 flex justify-between items-center hover:bg-secondary/85 hover:text-blue-600 pb-2 pt-4 px-1">
        <div>{title}</div>
        <div>
          <ArrowRight className="w-4 h-4"/>
        </div>
    </Link>
  );
};

export default CustomLink;
