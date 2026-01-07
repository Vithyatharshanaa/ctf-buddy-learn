import { Terminal, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <span className="font-mono font-bold text-lg text-primary">
                CTF_Learn
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Learn cybersecurity through hands-on Capture The Flag challenges. 
              Start your hacking journey today.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/learn" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Learn CTF
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Challenges
                </Link>
              </li>
              <li>
                <Link to="/practice" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Practice
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Categories</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground text-sm">Web Exploitation</li>
              <li className="text-muted-foreground text-sm">Cryptography</li>
              <li className="text-muted-foreground text-sm">Forensics</li>
              <li className="text-muted-foreground text-sm">Linux</li>
              <li className="text-muted-foreground text-sm">Reverse Engineering</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-1">
                  About Us
                </Link>
              </li>
              <li>
                <a 
                  href="https://ctftime.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-1"
                >
                  CTFtime <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-1"
                >
                  GitHub <Github className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 CTF_Learn. Built for learning. Hack responsibly.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-muted-foreground">
              <span className="text-primary">$</span> echo "Happy Hacking!"
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
