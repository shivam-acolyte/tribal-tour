import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  description?: string;
  className?: string;
}

/**
 * FAQ Section Component
 * Displays FAQs in accordion format with proper semantic HTML
 * Supports FAQPage schema markup
 */
export function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
  description,
  className = "",
}: FAQSectionProps) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container-main px-4 md:px-8 max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-foreground/60 text-lg">{description}</p>
          )}
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`faq-${index}`}
              className="border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="py-4 hover:text-orange transition-colors">
                <h3 className="text-lg font-heading font-semibold text-left">
                  {faq.question}
                </h3>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-foreground/70">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FAQSection;
