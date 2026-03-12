import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Lock, Search, Share2 } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-950/40 backdrop-blur-lg border-b border-primary-500/30 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
            <h1 className="text-2xl font-bold gradient-text">Notes</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Simple, Secure Note Management
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Capture and organize your thoughts in one secure place. Built for simplicity and security with modern technology.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Get Started Free <ArrowRight className="inline ml-2" size={20} />
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 gradient-text">Why Choose Notes?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Lock size={32} />}
              title="Secure & Private"
              description="Your notes are encrypted and only you can access them. We never share your data."
            />
            <FeatureCard
              icon={<Search size={32} />}
              title="Easy Search"
              description="Find your notes instantly with our powerful search functionality."
            />
            <FeatureCard
              icon={<Share2 size={32} />}
              title="Clean Interface"
              description="A beautiful, distraction-free interface designed for productivity."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center glass-lg rounded-2xl p-12 border-2">
          <h3 className="text-3xl font-bold mb-4 text-white">Ready to get started?</h3>
          <p className="text-slate-300 mb-8">
            Join thousands of users who trust Notes for their note-taking needs.
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-block">
            Create Your Account Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary-500/30 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-slate-300">
          <p className="mb-4">
            This project is a demonstration application intended for educational purposes.
            It should not be used in production environments without additional security hardening and infrastructure.
          </p>
          <p className="text-sm">
            © 2024 Notes Management. <a href="https://github.com" className="text-primary-400 hover:text-primary-300 transition-colors">GitHub</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="glass rounded-lg p-6 text-center border-2 hover:shadow-lg hover:shadow-primary-500/30 transition-all">
      <div className="text-primary-400 mb-4 flex justify-center">{icon}</div>
      <h4 className="text-xl font-semibold mb-2 text-white">{title}</h4>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}
