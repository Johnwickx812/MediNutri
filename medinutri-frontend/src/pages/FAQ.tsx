export default function FAQ() {
  const faqs = [
    { q: "What is a food-drug interaction?", a: "A food-drug interaction occurs when a food or beverage alters the effect of a medication you are taking, either reducing its effectiveness or causing dangerous side effects." },
    { q: "Is MediNutri completely free?", a: "Yes, our core safety checkers and Indian diet planning features are completely free to use." },
    { q: "Can it track conditions like diabetes?", a: "Absolutely. During setup, you can select specific health goals (like Diabetic Friendly) which adjusts our AI diet planner and macronutrient targets." },
    { q: "Is my medical data safe?", a: "We employ strict security measures and do not share your individual medication or dietary data with third parties." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 py-12">
      <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Frequently Asked Questions</h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            Everything you need to know about medication safety and nutrition tracking.
          </p>
        </div>

        <div className="space-y-4">
           {faqs.map((f, i) => (
             <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-md border border-slate-100 dark:border-white/5">
                <h3 className="text-xl font-bold mb-2 dark:text-white">{f.q}</h3>
                <p className="text-slate-600 dark:text-slate-400">{f.a}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
