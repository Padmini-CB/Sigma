'use client';

interface BootcampOption {
  id: string;
  name: string;
  details: string;
}

const bootcampOptions: BootcampOption[] = [
  { id: 'da-bootcamp', name: 'Data Analytics Bootcamp 5.0', details: '₹12,900 · 7+ Projects · Job Assistance' },
  { id: 'de-bootcamp', name: 'Data Engineering Bootcamp', details: 'AWS, Snowflake, Airflow · 100TB+ Data' },
  { id: 'ds-bootcamp', name: 'GenAI & Data Science 3.0', details: '₹15,000 · RAG, LangChain · Build in Public' },
  { id: 'ai-engineering-bootcamp', name: 'AI Engineering Bootcamp 1.0', details: '75 Days Intensive · Live Sessions · 8+ Projects' },
  { id: 'bundle', name: 'Bundle (DA + AI Toolkit)', details: 'Best value combination' },
  { id: 'general', name: 'Padmini General', details: 'Brand-level creatives' },
];

interface BootcampStepProps {
  onSelect: (bootcamp: string) => void;
  onBack: () => void;
}

export default function BootcampStep({ onSelect, onBack }: BootcampStepProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 font-ui text-sm text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white text-center mb-4">
        Which program is this for?
      </h2>
      <p className="font-body text-gray-400 text-center mb-12">
        Select the bootcamp or product you&apos;re promoting
      </p>

      <div className="space-y-4">
        {bootcampOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="group w-full bg-white rounded-xl border-2 border-gray-100 p-5 text-left hover:border-brand-purple/50 hover:shadow-md transition-all duration-200 flex items-center justify-between"
          >
            <div>
              <h3 className="font-headline text-lg font-bold text-brand-navy group-hover:text-brand-purple transition-colors">
                {option.name}
              </h3>
              <p className="font-body text-sm text-gray-500 mt-1">
                {option.details}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-4">
              <svg className="w-4 h-4 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
