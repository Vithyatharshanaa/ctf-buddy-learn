import { Link } from 'react-router-dom';
import { Terminal, Shield, Code, Lock, Search, Cpu, ChevronRight, Flag, Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TerminalCard from '@/components/TerminalCard';

const categories = [
  {
    icon: Code,
    name: 'Web Exploitation',
    description: 'Learn to find vulnerabilities in websites and web applications.',
    color: 'text-primary',
  },
  {
    icon: Lock,
    name: 'Cryptography',
    description: 'Break codes and understand encryption algorithms.',
    color: 'text-accent',
  },
  {
    icon: Search,
    name: 'Forensics',
    description: 'Analyze files, images, and memory dumps for hidden data.',
    color: 'text-orange-400',
  },
  {
    icon: Terminal,
    name: 'Linux',
    description: 'Master command-line skills and Linux system administration.',
    color: 'text-secondary',
  },
  {
    icon: Cpu,
    name: 'Reverse Engineering',
    description: 'Decompile and analyze binary programs.',
    color: 'text-red-400',
  },
];

const stats = [
  { icon: Flag, value: '12+', label: 'Challenges' },
  { icon: Users, value: '1000+', label: 'Learners' },
  { icon: Trophy, value: '5', label: 'Categories' },
];

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Terminal-style badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-mono text-muted-foreground">
                <span className="text-primary">$</span> ./start_learning --mode=beginner
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="text-foreground">Learn </span>
              <span className="text-primary text-glow">Cybersecurity</span>
              <br />
              <span className="text-foreground">Through </span>
              <span className="text-secondary text-glow-secondary">CTF</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Master hacking skills in a safe, legal environment. Capture The Flag challenges 
              teach you real cybersecurity techniques step by step.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/challenges">
                <Button variant="cyber" size="xl" className="gap-2">
                  Start Hacking
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/learn">
                <Button variant="neon" size="xl">
                  Learn the Basics
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-16 md:mt-24 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* What is CTF Section */}
      <section className="py-16 md:py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What is <span className="text-primary">Capture The Flag</span>?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                CTF competitions are cybersecurity challenges where players solve puzzles 
                to find hidden "flags" - secret strings that prove you solved the challenge.
              </p>
            </div>
            
            <TerminalCard title="~/example-flag.txt" className="max-w-lg mx-auto">
              <div className="font-mono text-sm">
                <p className="text-muted-foreground mb-2"># A flag looks like this:</p>
                <p className="text-primary text-glow text-lg">CTF&#123;y0u_f0und_th3_fl4g!&#125;</p>
                <p className="text-muted-foreground mt-4 text-xs">
                  # Submit this to prove you solved the challenge
                </p>
              </div>
            </TerminalCard>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore <span className="text-secondary">Categories</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              CTF challenges come in different categories, each teaching unique skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories.map((category, index) => (
              <Link 
                key={category.name}
                to="/learn"
                className="terminal-card p-6 hover:border-primary/50 transition-all duration-300 hover:scale-105 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/learn">
              <Button variant="outline" className="gap-2">
                Learn more about categories
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground mb-8">
              Create an account to track your progress, earn points, and compete with others.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button variant="cyber" size="lg">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/practice">
                <Button variant="outline" size="lg">
                  Try a Challenge First
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
