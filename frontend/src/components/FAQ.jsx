import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { faqData } from '../data/mock';

const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-otx-gray">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-otx-bordo font-semibold text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-otx-text mt-3 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-otx-text/70 text-lg">
            Todo lo que necesitás saber antes de contratar.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl shadow-sm p-2">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((item, index) => (
              <AccordionItem 
                key={item.id} 
                value={`item-${item.id}`}
                className="border-b border-otx-gray last:border-b-0"
              >
                <AccordionTrigger className="px-6 py-5 hover:no-underline group">
                  <div className="flex items-start gap-4 text-left">
                    <div className="w-8 h-8 bg-otx-bordo/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-otx-bordo transition-colors duration-300">
                      <HelpCircle className="text-otx-bordo group-hover:text-white transition-colors" size={18} />
                    </div>
                    <span className="font-semibold text-otx-text group-hover:text-otx-bordo transition-colors">
                      {item.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5">
                  <div className="pl-12">
                    <p className="text-otx-text/70 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-otx-text/70 mb-4">
            ¿Tenés otra pregunta? No dudes en consultarnos.
          </p>
          <a href="#contacto">
            <button className="text-otx-bordo hover:text-otx-bordo-light font-semibold transition-colors">
              Contactanos →
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
