import { useState } from "react";
import { Menu, X, BarChart3, Settings, Upload, Shield, AlertTriangle, Clock } from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Sensors", href: "/sensors", icon: Shield },
  { name: "Manual Alert", href: "/manual-alert", icon: AlertTriangle },
  { name: "Event History", href: "/event-history", icon: Clock },
  { name: "Data Upload", href: "/upload", icon: Upload },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center overflow-hidden">
                  <img src="/placeholder.svg" alt="SafeMine Logo" className="h-5 w-5 object-contain" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">
                    SafeMine Dashboard
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    Real-time Mining Safety Monitoring
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `nav-button ${isActive ? "active" : ""}`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Status Indicator */}
            <div className="flex items-center gap-2">
              <div className="pulse-animation w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                System Online
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-sm">
            <nav className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `nav-button w-full ${isActive ? "active" : ""}`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}