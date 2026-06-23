"use client"

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQS } from "./config"

export default function PricingFaq() {
  return (
    <Accordion className="mx-auto max-w-3xl divide-y divide-border" multiple={false}>
      {FAQS.map((faq, i) => (
        <AccordionItem key={faq.question} value={`faq-${i}`}>
          <AccordionTrigger className="text-base">{faq.question}</AccordionTrigger>
          <AccordionPanel className="max-w-2xl text-[15px] leading-relaxed">
            {faq.answer}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
