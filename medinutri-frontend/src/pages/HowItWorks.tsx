import { ClipboardList, AlertTriangle, TrendingUp } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    { icon: ClipboardList, title: "1. Profile Setup", desc: "Enter your age, weight, health conditions, and current medications." },
    { icon: AlertTriangle, title: "2. Log Meals & Check Safety", desc: "Log your daily meals. We run an instant background check for interactions." },
    { icon: TrendingUp, title: "3. Track & Improve", desc: "View weekly analytics, generate reports, and meet your nutritional goals safely." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">How It Works</h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            Start protecting your health in three simple steps.
          </p>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-10 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-primary before:to-blue-500">
           {steps.map((st, i) => (
             <div key={i} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
               <div className="flex items-center justify-center w-20 h-20 rounded-full border-4 border-slate-50 bg-white dark:border-slate-950 dark:bg-slate-900 shadow font-bold text-primary z-10 md:mx-auto shrink-0">
                  <st.icon className="w-8 h-8" />
               </div>
               <div className="w-[calc(100%-6rem)] md:w-[calc(50%-4rem)] bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl ml-4 md:ml-0">
                  <h3 className="font-bold text-xl mb-1">{st.title}</h3>
                  <p className="text-slate-500">{st.desc}</p>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
