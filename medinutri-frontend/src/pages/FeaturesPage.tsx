import { Shield, Sparkles, UtensilsCrossed, BarChart3 } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
       title: "AI Food-Drug Interaction Checker",
       description: "Instantly cross-reference your meals with thousands of known medication interactions.",
       icon: Shield,
       color: "text-red-500",
       bg: "bg-red-50"
    },
    {
       title: "Personalized Indian Diet Planning",
       description: "Get nutritious, culturally relevant meal plans tailored to your specific health requirements and dietary restrictions.",
       icon: UtensilsCrossed,
       color: "text-emerald-500",
       bg: "bg-emerald-50"
    },
    {
       title: "Smart Nutrition Tracking",
       description: "Log your daily meals and instantly see your macro breakdowns (proteins, carbs, fats).",
       icon: BarChart3,
       color: "text-blue-500",
       bg: "bg-blue-50"
    },
    {
       title: "AI Chat Assistant",
       description: "Talk to our advanced AI about your diet, medications, and general wellness queries for immediate answers.",
       icon: Sparkles,
       color: "text-purple-500",
       bg: "bg-purple-50"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 py-12">
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">Platform Features</h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            Everything you need for safe medication management and healthy Indian diet planning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {features.map((f, i) => (
             <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 space-y-4 hover:-translate-y-1 transition-transform cursor-default">
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${f.bg} dark:bg-white/5`}>
                 <f.icon className={`w-8 h-8 ${f.color}`} />
               </div>
               <h3 className="text-2xl font-bold dark:text-white">{f.title}</h3>
               <p className="text-slate-600 dark:text-slate-400">{f.description}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
