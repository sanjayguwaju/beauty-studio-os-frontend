import { Link } from "react-router";
import { ArrowRight, Scissors, BookOpen, CalendarCheck, Sparkles, BarChart3, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative pt-12 pb-20 sm:pt-24 sm:pb-24 overflow-hidden bg-white dark:bg-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50 via-white to-white dark:from-brand-900/20 dark:via-gray-900 dark:to-gray-900" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-brand-200 dark:border-brand-500/20">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
            <span>Version 2.0 — Now with AI-powered intake &amp; recommendations</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
            The Complete OS for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-600">
              Beauty &amp; Wellness Studios
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            A multi-tenant SaaS platform built for beauty studios, academies, and wellness brands — managing clients, bookings, certifications, billing, and AI-powered insights all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/signup" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-full transition-all shadow-lg shadow-brand-500/30 hover:-translate-y-0.5">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/features" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700/50 rounded-full transition-all">
              Explore Features
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Everything Your Studio Needs</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">From front-desk bookings to backend analytics, BeautyStudio OS handles it all so you can focus on your craft.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="flex space-x-6">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center">
                  <Scissors className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Client &amp; CRM</h3>
                <p className="text-gray-600 dark:text-gray-400">Manage clients, track preferences, view visit history, and maintain detailed profiles — all in one unified record per client.</p>
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Beauty Academy</h3>
                <p className="text-gray-600 dark:text-gray-400">Run your own training programs with course builders, batch scheduling, attendance tracking, and automated certification issuance.</p>
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
                  <CalendarCheck className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Smart Bookings</h3>
                <p className="text-gray-600 dark:text-gray-400">Drag-and-drop booking calendar with client self-service portals, practitioner assignment, and real-time availability management.</p>
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Layer</h3>
                <p className="text-gray-600 dark:text-gray-400">OCR-powered student document intake, AI-generated service recommendations for clients, and intelligent intake automation with human-in-the-loop review.</p>
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">POS &amp; Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">Integrated point-of-sale with invoicing, commissions, inventory deduction, and a live analytics dashboard for revenue and KPI tracking.</p>
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Multi-Tenant &amp; Secure</h3>
                <p className="text-gray-600 dark:text-gray-400">Role-based access control, branch-level management, subscription tiers, and full audit logging — enterprise-grade security built in from day one.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">Ready to run a smarter studio?</h2>
          <p className="text-lg text-brand-100 mb-10">Join studios already using BeautyStudio OS. Get your dedicated environment live in under 5 minutes — no credit card needed.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 text-base font-bold text-brand-900 bg-white hover:bg-gray-50 rounded-full transition-colors">
              Start your free trial
            </Link>
            <Link to="/contact" className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white border border-brand-700 hover:bg-brand-800 rounded-full transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
