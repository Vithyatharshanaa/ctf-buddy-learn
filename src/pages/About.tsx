import { Shield, Target, Users, BookOpen, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TerminalCard from '@/components/TerminalCard';

const features = [
  {
    icon: Target,
    title: 'Beginner Focused',
    description: 'Every challenge is designed with beginners in mind. No prior hacking experience needed.',
  },
  {
    icon: Shield,
    title: 'Safe & Legal',
    description: 'Practice in a controlled environment. All challenges are simulated and completely safe.',
  },
  {
    icon: BookOpen,
    title: 'Learn by Doing',
    description: 'Hands-on challenges teach you real techniques used by security professionals.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Join a community of learners on the same journey as you.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-muted-foreground">About Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-primary text-glow">CTF_Learn</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              A platform designed to make cybersecurity education accessible to everyone.
            </p>
          </div>
          
          {/* Mission */}
          <div className="max-w-4xl mx-auto mb-16">
            <TerminalCard title="~/mission.md" className="p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3">Our Mission</h2>
                  <p className="text-muted-foreground">
                    Cybersecurity is one of the most important skills in the digital age, 
                    yet it can seem intimidating to beginners. CTF_Learn was created to break 
                    down those barriers and provide a fun, engaging way to learn security concepts.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3">What is CTF?</h2>
                  <p className="text-muted-foreground">
                    Capture The Flag (CTF) competitions are cybersecurity challenges where 
                    participants solve puzzles to find hidden "flags" - secret strings that 
                    prove you solved the challenge. CTFs are used by security professionals 
                    worldwide to develop and test their skills.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3">Why Practice CTF?</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-1 shrink-0" />
                      <span>Learn real-world security skills in a safe environment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-1 shrink-0" />
                      <span>Develop critical thinking and problem-solving abilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-1 shrink-0" />
                      <span>Prepare for a career in cybersecurity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 text-primary mt-1 shrink-0" />
                      <span>Join a global community of ethical hackers</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TerminalCard>
          </div>
          
          {/* Features */}
          <div className="max-w-5xl mx-auto mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Why <span className="text-secondary">CTF_Learn</span>?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="terminal-card p-6 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Ethics */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="p-6 md:p-8 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-destructive shrink-0" />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3">
                    Ethical Hacking Disclaimer
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    CTF_Learn teaches cybersecurity skills for educational purposes only. 
                    The techniques learned here should never be used against systems you 
                    don't own or have explicit permission to test.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="text-destructive">✕</span>
                      Never attack systems without permission
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-destructive">✕</span>
                      Don't use these skills for malicious purposes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      Practice only on authorized platforms like this one
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      Report vulnerabilities responsibly if you find them
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start?
            </h2>
            <p className="text-muted-foreground mb-8">
              Begin your cybersecurity journey today with our beginner-friendly challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/learn">
                <Button variant="cyber" size="lg" className="gap-2">
                  Start Learning
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/challenges">
                <Button variant="outline" size="lg">
                  View Challenges
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
