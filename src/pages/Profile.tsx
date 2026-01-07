import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Trophy, Flag, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TerminalCard from '@/components/TerminalCard';
import CategoryBadge from '@/components/CategoryBadge';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';

type Category = 'web' | 'crypto' | 'forensics' | 'linux' | 'reverse';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Profile {
  id: string;
  username: string | null;
  total_points: number;
  created_at: string;
}

interface SolvedChallenge {
  id: string;
  solved_at: string;
  challenge: {
    id: string;
    title: string;
    category: Category;
    difficulty: Difficulty;
    points: number;
  };
}

export default function Profile() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [solvedChallenges, setSolvedChallenges] = useState<SolvedChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate('/auth');
        } else {
          setUser(session.user);
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchSolvedChallenges(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
        fetchProfile(session.user.id);
        fetchSolvedChallenges(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchSolvedChallenges = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_solves')
      .select(`
        id,
        solved_at,
        challenge:challenges(id, title, category, difficulty, points)
      `)
      .eq('user_id', userId)
      .order('solved_at', { ascending: false });

    if (!error && data) {
      setSolvedChallenges(data as unknown as SolvedChallenge[]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="terminal-card p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {profile?.username || 'Anonymous Hacker'}
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {profile ? formatDate(profile.created_at) : ''}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <Trophy className="w-8 h-8 text-primary mb-2" />
                  <span className="text-2xl font-bold text-primary">
                    {profile?.total_points || 0}
                  </span>
                  <span className="text-xs text-muted-foreground">Total Points</span>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="terminal-card p-4 text-center">
                <Flag className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-2xl font-bold text-foreground block">
                  {solvedChallenges.length}
                </span>
                <span className="text-xs text-muted-foreground">Challenges Solved</span>
              </div>
              
              <div className="terminal-card p-4 text-center">
                <span className="text-2xl font-bold text-primary block">
                  {solvedChallenges.filter(s => s.challenge?.category === 'web').length}
                </span>
                <span className="text-xs text-muted-foreground">Web</span>
              </div>
              
              <div className="terminal-card p-4 text-center">
                <span className="text-2xl font-bold text-accent block">
                  {solvedChallenges.filter(s => s.challenge?.category === 'crypto').length}
                </span>
                <span className="text-xs text-muted-foreground">Crypto</span>
              </div>
              
              <div className="terminal-card p-4 text-center">
                <span className="text-2xl font-bold text-secondary block">
                  {solvedChallenges.filter(s => s.challenge?.category === 'linux').length}
                </span>
                <span className="text-xs text-muted-foreground">Linux</span>
              </div>
            </div>
            
            {/* Solved Challenges */}
            <TerminalCard title="~/solved_challenges.log">
              {solvedChallenges.length === 0 ? (
                <div className="text-center py-8">
                  <Flag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    You haven't solved any challenges yet.
                  </p>
                  <Link to="/challenges">
                    <Button variant="terminal" className="gap-2">
                      Start Hacking
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {solvedChallenges.map((solve) => (
                    <Link
                      key={solve.id}
                      to={`/practice?challenge=${solve.challenge?.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <CategoryBadge category={solve.challenge?.category} />
                        <span className="font-medium text-foreground">
                          {solve.challenge?.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-primary font-mono">
                          +{solve.challenge?.points} pts
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {formatDate(solve.solved_at)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </TerminalCard>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
