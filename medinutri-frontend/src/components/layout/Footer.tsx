import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-secondary/30 py-8 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
              <img src="/medinutri.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-semibold">{t.common.appName}</span>
          </div>

          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-sm text-muted-foreground">
              {t.footer.disclaimer}
            </p>
            <Link to="/feedback" className="text-xs text-primary hover:underline">
              {t.feedback.title}
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}