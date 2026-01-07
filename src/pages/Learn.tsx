import { Code, Lock, Search, Terminal, Cpu, BookOpen, ChevronRight, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TerminalCard from '@/components/TerminalCard';

const categories = [
  {
    id: 'web',
    icon: Code,
    name: 'Web Exploitation',
    color: 'category-web',
    iconColor: 'text-primary',
    description: 'Web challenges involve finding vulnerabilities in websites and web applications.',
    topics: [
      'HTML/CSS/JavaScript basics',
      'HTTP requests and responses',
      'Cookies and sessions',
      'SQL Injection',
      'Cross-Site Scripting (XSS)',
      'Directory traversal',
    ],
    tools: ['Browser Developer Tools', 'Burp Suite', 'curl'],
    example: {
      title: 'SQL Injection Example',
      content: `# A vulnerable login query:
SELECT * FROM users WHERE username='$input'

# Attack payload:
' OR 1=1 --

# This makes the query always true!`,
    },
  },
  {
    id: 'crypto',
    icon: Lock,
    name: 'Cryptography',
    color: 'category-crypto',
    iconColor: 'text-accent',
    description: 'Crypto challenges involve breaking codes and understanding encryption algorithms.',
    topics: [
      'Classical ciphers (Caesar, Vigenère)',
      'Base64 and hex encoding',
      'XOR encryption',
      'Hash functions (MD5, SHA)',
      'RSA basics',
      'Frequency analysis',
    ],
    tools: ['CyberChef', 'Python', 'OpenSSL'],
    example: {
      title: 'Base64 Decoding',
      content: `# Encoded message:
Q1RGe2hlbGxvX3dvcmxkfQ==

# Decode with Python:
import base64
print(base64.b64decode("Q1RGe2hlbGxvX3dvcmxkfQ=="))

# Result: CTF{hello_world}`,
    },
  },
  {
    id: 'forensics',
    icon: Search,
    name: 'Forensics',
    color: 'category-forensics',
    iconColor: 'text-orange-400',
    description: 'Forensics challenges involve analyzing files, images, and data for hidden information.',
    topics: [
      'File signatures (magic bytes)',
      'Metadata analysis (EXIF)',
      'Steganography',
      'Memory analysis',
      'Network packet analysis',
      'File carving',
    ],
    tools: ['Binwalk', 'Strings', 'Wireshark', 'Exiftool'],
    example: {
      title: 'Finding Hidden Data',
      content: `# Check file type:
$ file mystery.png
mystery.png: PNG image data

# Look for hidden text:
$ strings mystery.png | grep "CTF"
CTF{hidden_in_plain_sight}

# Check metadata:
$ exiftool mystery.png`,
    },
  },
  {
    id: 'linux',
    icon: Terminal,
    name: 'Linux',
    color: 'category-linux',
    iconColor: 'text-secondary',
    description: 'Linux challenges test your command-line skills and system knowledge.',
    topics: [
      'Basic commands (ls, cd, cat)',
      'File permissions',
      'Process management',
      'Shell scripting',
      'SSH and remote access',
      'Log analysis',
    ],
    tools: ['Terminal', 'grep', 'awk', 'sed'],
    example: {
      title: 'Common Linux Commands',
      content: `# List files with permissions:
$ ls -la

# Find files containing "flag":
$ grep -r "flag" /home/

# Read file contents:
$ cat /etc/passwd

# Find setuid binaries:
$ find / -perm -4000 2>/dev/null`,
    },
  },
  {
    id: 'reverse',
    icon: Cpu,
    name: 'Reverse Engineering',
    color: 'category-reverse',
    iconColor: 'text-red-400',
    description: 'Reverse engineering involves analyzing compiled programs to understand their logic.',
    topics: [
      'Assembly language basics',
      'Disassemblers and debuggers',
      'Static vs dynamic analysis',
      'Decompilers',
      'Anti-debugging techniques',
      'Binary exploitation basics',
    ],
    tools: ['Ghidra', 'IDA Free', 'GDB', 'radare2'],
    example: {
      title: 'Using Strings on a Binary',
      content: `# Extract readable strings:
$ strings ./challenge | head -20

# Look for flag format:
$ strings ./challenge | grep "CTF{"
CTF{reverse_engineering_101}

# Run the binary:
$ ./challenge
Enter password: ***`,
    },
  },
];

export default function Learn() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-muted-foreground">Learning Path</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learn <span className="text-primary text-glow">CTF</span> Fundamentals
            </h1>
            <p className="text-lg text-muted-foreground">
              Understand the core concepts behind Capture The Flag challenges. 
              Each category teaches different cybersecurity skills.
            </p>
          </div>
          
          {/* What You'll Learn */}
          <div className="max-w-4xl mx-auto mb-16">
            <TerminalCard title="~/getting-started.md">
              <div className="space-y-4 font-mono text-sm">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-foreground font-medium">Before You Start</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      CTF is about problem-solving, not memorization. Don't worry if you don't know everything 
                      — the goal is to learn by doing. Each challenge teaches something new!
                    </p>
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <p className="text-muted-foreground">
                    <span className="text-secondary">Tip:</span> When stuck, read hints, search online, 
                    and don't be afraid to ask for help. That's how real hackers learn!
                  </p>
                </div>
              </div>
            </TerminalCard>
          </div>
          
          {/* Categories */}
          <div className="space-y-16">
            {categories.map((category, index) => (
              <section 
                key={category.id}
                id={category.id}
                className="scroll-mt-24 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center`}>
                      <category.icon className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        {category.name}
                      </h2>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Topics */}
                    <div className="terminal-card p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Key Topics
                      </h3>
                      <ul className="space-y-2">
                        {category.topics.map((topic) => (
                          <li key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ChevronRight className="w-4 h-4 text-primary" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-6 pt-4 border-t border-border">
                        <h4 className="text-sm font-medium text-foreground mb-2">Common Tools:</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.tools.map((tool) => (
                            <span 
                              key={tool} 
                              className="px-2 py-1 text-xs font-mono bg-muted rounded text-muted-foreground"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Example */}
                    <TerminalCard title={category.example.title}>
                      <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap overflow-x-auto">
                        {category.example.content}
                      </pre>
                    </TerminalCard>
                  </div>
                </div>
              </section>
            ))}
          </div>
          
          {/* CTA */}
          <div className="max-w-3xl mx-auto text-center mt-16 pt-16 border-t border-border">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Practice?
            </h2>
            <p className="text-muted-foreground mb-8">
              Put your knowledge to the test with our beginner-friendly challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/challenges">
                <Button variant="cyber" size="lg" className="gap-2">
                  View Challenges
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/practice">
                <Button variant="outline" size="lg">
                  Quick Practice
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
