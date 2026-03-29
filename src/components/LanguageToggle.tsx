import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      className="group relative flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground hover:shadow-card"
    >
      <Globe className="h-3.5 w-3.5 text-primary transition-transform group-hover:rotate-12" />
      <span className="font-semibold">{language === 'en' ? 'हिंदी' : 'EN'}</span>
    </button>
  );
}
