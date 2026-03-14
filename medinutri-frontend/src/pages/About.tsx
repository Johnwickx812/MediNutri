import { ShieldCheck, HeartPulse, Activity } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">About MediNutri</h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            Your AI-Powered Food-Drug Interaction & Diet Safety Platform
          </p>
        </div>

        <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 space-y-6">
          <h2 className="text-3xl font-bold flex items-center gap-3"><HeartPulse className="h-8 w-8 text-primary" /> Our Mission</h2>
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
            MediNutri was created with a singular mission: to eliminate the preventable dangers of food-drug interactions. By combining advanced AI with comprehensive medical databases, we provide users with real-time safety alerts and personalized Indian diet planning that securely align with their prescribed medications.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-emerald-500" /> Medication Safety</h3>
              <p className="text-slate-600 dark:text-slate-400">
                We monitor every meal you log against your active medications to instantly flag high-risk combos like Grapefruit &amp; Statins.
              </p>
           </div>
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><Activity className="h-6 w-6 text-blue-500" /> Nutrition Tracking</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Beyond safety, we help you hit your wellness goals with customized macronutrient tracking and analytics for diabetes or general health.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
