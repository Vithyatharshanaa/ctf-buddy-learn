import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Flag, Send, Lightbulb, ChevronLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TerminalCard from '@/components/TerminalCard';
import CategoryBadge from '@/components/CategoryBadge';
import DifficultyBadge from '@/components/DifficultyBadge';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { z } from 'zod';

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

// Validation schema for flag input
const flagSchema = z.string()
  .min(1, 'Flag cannot be empty')
  .max(200, 'Flag is too long')
  .regex(/^[A-Za-z0-9_{}\-!@#$%^&*()+=\[\]]+$/, 'Invalid flag format');

export default function Practice() {
  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get('challenge');
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [flagInput, setFlagInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    if (challengeId && challenges.length > 0) {
      const challenge = challenges.find(c => c.id === challengeId);
      if (challenge) {
        setSelectedChallenge(challenge);
        setFlagInput('');
        setShowHint(false);
        setResult(null);
      }
    }
  }, [challengeId, challenges]);

  const fetchChallenges = async () => {
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

  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChallenge) return;
    
    // Validate flag input
    const validation = flagSchema.safeParse(flagInput.trim());
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    if (!user) {
      toast.error('Please sign in to submit flags');
      return;
    }

    setSubmitting(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Session expired. Please sign in again.');
        return;
      }

      const { data, error } = await supabase.functions.invoke('validate-flag', {
        body: {
          challengeId: selectedChallenge.id,
          flag: flagInput.trim(),
        },
      });

      if (error) {
        console.error('Function error:', error);
        toast.error('Error validating flag. Please try again.');
        return;
      }

      if (data.success) {
        setResult({ success: true, message: data.message });
        toast.success(data.message);
        setSolvedChallenges(prev => [...prev, selectedChallenge.id]);
        setFlagInput('');
      } else if (data.alreadySolved) {
        setResult({ success: true, message: 'You already solved this challenge!' });
        toast.info('You already solved this challenge!');
      } else {
        setResult({ success: false, message: data.message || 'Incorrect flag' });
        toast.error(data.message || 'Incorrect flag. Keep trying!');
      }
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isSolved = selectedChallenge && solvedChallenges.includes(selectedChallenge.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            </div>
          ) : !selectedChallenge ? (
            <>
              {/* Header */}
              <div className="max-w-3xl mx-auto text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6">
                  <Flag className="w-4 h-4 text-primary" />
                  <span className="text-sm font-mono text-muted-foreground">Practice Mode</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-primary text-glow">Practice</span> Challenges
                </h1>
                <p className="text-lg text-muted-foreground">
                  Select a challenge below to start practicing.
                </p>
              </div>
              
              {/* Challenge List */}
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
                {challenges.map((challenge) => {
                  const solved = solvedChallenges.includes(challenge.id);
                  return (
                    <button
                      key={challenge.id}
                      onClick={() => setSelectedChallenge(challenge)}
                      className={`terminal-card p-4 text-left hover:border-primary/50 transition-all ${
                        solved ? 'border-primary/30 bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CategoryBadge category={challenge.category} />
                          <DifficultyBadge difficulty={challenge.difficulty} />
                        </div>
                        {solved && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </div>
                      <h3 className="font-semibold text-foreground">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{challenge.points} points</p>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* Back Button */}
              <div className="max-w-4xl mx-auto mb-6">
                <button
                  onClick={() => {
                    setSelectedChallenge(null);
                    setFlagInput('');
                    setShowHint(false);
                    setResult(null);
                  }}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to challenges
                </button>
              </div>
              
              {/* Challenge Detail */}
              <div className="max-w-4xl mx-auto">
                <div className="terminal-card p-6 md:p-8">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <CategoryBadge category={selectedChallenge.category} />
                    <DifficultyBadge difficulty={selectedChallenge.difficulty} />
                    <span className="text-sm font-mono font-bold text-primary">
                      {selectedChallenge.points} pts
                    </span>
                    {isSolved && (
                      <span className="flex items-center gap-1 text-sm text-primary">
                        <CheckCircle2 className="w-4 h-4" />
                        Solved
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {selectedChallenge.title}
                  </h1>
                  
                  <div className="prose prose-invert max-w-none mb-8">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {selectedChallenge.description}
                    </p>
                  </div>
                  
                  {/* Hint Section */}
                  {selectedChallenge.hint && (
                    <div className="mb-8">
                      {!showHint ? (
                        <button
                          onClick={() => setShowHint(true)}
                          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Lightbulb className="w-4 h-4" />
                          Show hint
                        </button>
                      ) : (
                        <div className="p-4 rounded-lg bg-muted border border-border">
                          <div className="flex items-center gap-2 text-sm text-foreground mb-2">
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                            Hint
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {selectedChallenge.hint}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Result Message */}
                  {result && (
                    <div className={`mb-6 p-4 rounded-lg border ${
                      result.success 
                        ? 'bg-primary/10 border-primary/30 text-primary' 
                        : 'bg-destructive/10 border-destructive/30 text-destructive'
                    }`}>
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                        {result.message}
                      </div>
                    </div>
                  )}
                  
                  {/* Flag Submission */}
                  <div className="border-t border-border pt-6">
                    {!user ? (
                      <div className="text-center py-6">
                        <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground mb-4">
                          Sign in to submit flags and track your progress.
                        </p>
                        <Link to="/auth">
                          <Button variant="terminal">Sign In</Button>
                        </Link>
                      </div>
                    ) : isSolved ? (
                      <div className="text-center py-6">
                        <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />
                        <p className="text-primary font-medium">
                          You've already solved this challenge!
                        </p>
                        <Link to="/challenges" className="mt-4 inline-block">
                          <Button variant="outline">Try Another Challenge</Button>
                        </Link>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmitFlag} className="space-y-4">
                        <label className="block">
                          <span className="text-sm font-medium text-foreground mb-2 block">
                            Submit Flag
                          </span>
                          <div className="flex gap-3">
                            <Input
                              type="text"
                              value={flagInput}
                              onChange={(e) => setFlagInput(e.target.value)}
                              placeholder="CTF{your_flag_here}"
                              className="font-mono"
                              disabled={submitting}
                            />
                            <Button 
                              type="submit" 
                              variant="terminal" 
                              disabled={submitting || !flagInput.trim()}
                              className="gap-2"
                            >
                              {submitting ? (
                                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                              Submit
                            </Button>
                          </div>
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Flags are case-sensitive. Format: CTF&#123;flag_text&#125;
                        </p>
                      </form>
                    )}
                  </div>
                </div>
                
                {/* Tips */}
                <div className="mt-8">
                  <TerminalCard title="~/tips.txt">
                    <div className="font-mono text-sm space-y-2">
                      <p className="text-muted-foreground">
                        <span className="text-secondary">#</span> Stuck? Try these:
                      </p>
                      <p className="text-muted-foreground">
                        <span className="text-primary">1.</span> Read the description carefully
                      </p>
                      <p className="text-muted-foreground">
                        <span className="text-primary">2.</span> Use the hint if available
                      </p>
                      <p className="text-muted-foreground">
                        <span className="text-primary">3.</span> Research the category techniques
                      </p>
                      <p className="text-muted-foreground">
                        <span className="text-primary">4.</span> Check the Learn section for guides
                      </p>
                    </div>
                  </TerminalCard>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
