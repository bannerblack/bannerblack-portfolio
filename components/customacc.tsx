"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const HorizontalAccordion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex space-x-4 w-full p-4 h-100 border border-border rounded-md mb-20">
      {accordionData.map((item, index) => (
        <div key={index} className="flex">
          {/* Button */}
          <Button
            onClick={() => toggle(index)}
            className="w-20 min-w-[80px] h-full"
            variant="outline"
          >
            <div className="text-xl rotate-[-90deg]">{item.title}</div>
          </Button>

          {/* Panel with Framer Motion for smooth width animation */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: openIndex === index ? 600 : 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className={cn(
              "overflow-hidden p-2 text-sm h-full",
              openIndex === index ? "w-[600px]" : "w-0"
            )}
          >
            {openIndex === index && <p>{item.content}</p>}
          </motion.div>
        </div>
      ))}
    </div>
  );
};

const accordionData = [
  { title: "Night Channels by Bulgyoongi", content: "Content for item 1" },
  { title: "Ruten by Hone_No_Zui", content: "Content for item 2" },
  { title: "I am the Dragon by Hone_No_Zui", content: "Content for item 3" },
];

export default HorizontalAccordion;
