import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flag, Filter, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryBadge from '@/components/CategoryBadge';
import DifficultyBadge from '@/components/DifficultyBadge';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

type Category = 'web' | 'crypto' | 'forensics' | 'linux' | 'reverse';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  points: number;
  hint: string | null;
}

const categoryFilters: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'web', label: 'Web' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'forensics', label: 'Forensics' },
  { value: 'linux', label: 'Linux' },
  { value: 'reverse', label: 'Reverse' },
];

const difficultyFilters: { value: Difficulty | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchSolvedChallenges(session.user.id), 0);
        } else {
          setSolvedChallenges([]);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchSolvedChallenges(session.user.id);
      }
    });

    fetchChallenges();

    return () => subscription.unsubscribe();
  }, []);

  const fetchChallenges = async () => {
    // Fetch challenges without the flag field
    const { data, error } = await supabase
      .from('challenges')
      .select('id, title, description, category, difficulty, points, hint')
      .order('difficulty', { ascending: true })
      .order('points', { ascending: true });

    if (error) {
      console.error('Error fetching challenges:', error);
    } else {
      setChallenges(data as Challenge[]);
    }
    setLoading(false);
  };

  const fetchSolvedChallenges = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_solves')
      .select('challenge_id')
      .eq('user_id', userId);

    if (!error && data) {
      setSolvedChallenges(data.map(s => s.challenge_id));
    }
  };

  const filteredChallenges = challenges.filter((challenge) => {
    if (categoryFilter !== 'all' && challenge.category !== categoryFilter) return false;
    if (difficultyFilter !== 'all' && challenge.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6">
              <Flag className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-muted-foreground">Challenge Arena</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-primary text-glow">CTF</span> Challenges
            </h1>
            <p className="text-lg text-muted-foreground">
              Test your skills with these beginner-friendly challenges. 
              {!user && (
                <Link to="/auth" className="text-primary hover:underline ml-1">
                  Sign in to track your progress.
                </Link>
              )}
            </p>
          </div>
          
          {/* Filters */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Filters</span>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Category:</span>
                  <div className="flex gap-1">
                    {categoryFilters.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => setCategoryFilter(filter.value)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          categoryFilter === filter.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Difficulty:</span>
                  <div className="flex gap-1">
                    {difficultyFilters.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => setDifficultyFilter(filter.value)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          difficultyFilter === filter.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Challenges Grid */}
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Loading challenges...
                </div>
              </div>
            ) : filteredChallenges.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No challenges match your filters.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredChallenges.map((challenge, index) => {
                  const isSolved = solvedChallenges.includes(challenge.id);
                  
                  return (
                    <Link
                      key={challenge.id}
                      to={`/practice?challenge=${challenge.id}`}
                      className={`terminal-card p-6 hover:border-primary/50 transition-all duration-300 group animate-fade-in ${
                        isSolved ? 'border-primary/30 bg-primary/5' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <CategoryBadge category={challenge.category} />
                          <DifficultyBadge difficulty={challenge.difficulty} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-bold text-primary">
                            {challenge.points} pts
                          </span>
                          {isSolved ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          ) : user ? (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          ) : null}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {challenge.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {challenge.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {isSolved ? 'Solved!' : 'Click to attempt'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Info */}
          <div className="max-w-3xl mx-auto text-center mt-12 pt-12 border-t border-border">
            <p className="text-muted-foreground mb-4">
              Need help getting started?
            </p>
            <Link to="/learn">
              <Button variant="outline" className="gap-2">
                Read the Learning Guide
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
