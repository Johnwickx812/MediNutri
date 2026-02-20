import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Pill,
  UtensilsCrossed,
  AlertTriangle,
  ArrowRight,
  Shield,
  Heart,
  Sparkles,
  CheckCircle
} from "lucide-react";

export default function Home() {
  const { userMedications, getTodaysCalories, getTodaysMeals } = useApp();
  const { t } = useLanguage();

  // Feature cards with translations
  const features = [
    {
      icon: Pill,
      title: t.home.trackMedications,
      description: t.home.trackMedicationsDesc,
      link: "/medications",
      color: "bg-blue-500",
    },
    {
      icon: UtensilsCrossed,
      title: t.home.logYourDiet,
      description: t.home.logYourDietDesc,
      link: "/diet",
      color: "bg-amber-500",
    },
    {
      icon: AlertTriangle,
      title: t.home.checkInteractions,
      description: t.home.checkInteractionsDesc,
      link: "/interactions",
      color: "bg-red-500",
    },
  ];

  // Benefits with translations
  const benefits = [
    t.home.benefit1,
    t.home.benefit2,
    t.home.benefit3,
    t.home.benefit4,
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
        <div className="container relative px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-white backdrop-blur-sm animate-fade-up">
              <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>{t.home.personalHealthCompanion}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white animate-fade-up stagger-1 tracking-tight">
              {t.home.heroTitle1}
              <br className="hidden sm:block" />
              <span className="text-white/90">{t.home.heroTitle2}</span>
            </h1>

            <p className="text-base md:text-xl text-white/80 max-w-2xl mx-auto animate-fade-up stagger-2 leading-relaxed px-2">
              {t.home.heroDescription}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-6 md:pt-8 animate-fade-up stagger-3 px-4 sm:px-0">
              <Link to="/medications" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-xl h-12 md:h-14 px-8 text-base md:text-lg font-bold group">
                  {t.home.getStarted}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/interactions" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 h-12 md:h-14 px-8 text-base md:text-lg bg-white/10 backdrop-blur-sm"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  {t.home.checkSafety}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats (if user has data) */}
      {(userMedications.length > 0 || getTodaysMeals().length > 0) && (
        <section className="py-8 -mt-12 relative z-10">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title={t.home.yourMedications}
                value={userMedications.length}
                subtitle={t.home.activeMedicines}
                icon={Pill}
                className="animate-fade-up"
              />
              <StatCard
                title={t.home.todaysCalories}
                value={getTodaysCalories().toFixed(1)}
                subtitle={`${getTodaysMeals().length} ${t.home.mealsLogged}`}
                icon={UtensilsCrossed}
                className="animate-fade-up stagger-1"
              />
              <StatCard
                title={t.home.safetyStatus}
                value={t.home.protected}
                subtitle={t.home.interactionsMonitored}
                icon={Shield}
                className="animate-fade-up stagger-2"
              />
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t.home.everythingYouNeed}{" "}
              <span className="text-primary">{t.home.healthyLiving}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.home.simpleTools}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link key={feature.title} to={feature.link}>
                <Card className={`h-full animate-fade-up stagger-${index + 1}`}>
                  <CardContent className="p-6 space-y-4">
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.color} text-white`}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <div className="flex items-center text-primary font-medium">
                      {t.common.learnMore}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                {t.home.whyChoose}{" "}
                <span className="text-primary">{t.common.appName}?</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                {t.home.simpleTools}
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3 animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-2xl flex items-center justify-center animate-pulse-glow overflow-hidden">
                      <img src="/medinutri.png" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">{t.home.yourHealthMatters}</h3>
                  <p className="text-muted-foreground">
                    {t.home.yourHealthMattersDesc}
                  </p>
                  <Link to="/interactions">
                    <Button className="w-full h-12 text-lg mt-4">
                      <Shield className="mr-2 h-5 w-5" />
                      {t.home.checkFoodSafetyNow}
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <Card className="gradient-bg p-8 md:p-12 text-center text-white">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                {t.home.readyToTakeControl}
              </h2>
              <p className="text-white/80 text-lg">
                {t.home.startTracking}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/medications">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg font-semibold">
                    {t.home.addFirstMedication}
                    <Pill className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}