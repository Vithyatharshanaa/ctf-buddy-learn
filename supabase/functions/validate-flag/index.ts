import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', success: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verify the user
    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token)
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', success: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = claimsData.claims.sub

    // Parse request body
    const { challengeId, flag } = await req.json()

    if (!challengeId || !flag) {
      return new Response(
        JSON.stringify({ error: 'Challenge ID and flag are required', success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate input
    if (typeof flag !== 'string' || flag.length > 200) {
      return new Response(
        JSON.stringify({ error: 'Invalid flag format', success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use service role to access flags (not exposed to frontend)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Check if already solved
    const { data: existingSolve } = await supabaseAdmin
      .from('user_solves')
      .select('id')
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
      .single()

    if (existingSolve) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'You have already solved this challenge!',
          alreadySolved: true 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch the challenge and validate flag
    const { data: challenge, error: challengeError } = await supabaseAdmin
      .from('challenges')
      .select('id, flag, points, title')
      .eq('id', challengeId)
      .single()

    if (challengeError || !challenge) {
      console.error('Challenge fetch error:', challengeError)
      return new Response(
        JSON.stringify({ error: 'Challenge not found', success: false }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Compare flags (case-sensitive)
    const isCorrect = flag.trim() === challenge.flag

    if (isCorrect) {
      // Record the solve
      const { error: solveError } = await supabaseAdmin
        .from('user_solves')
        .insert({ user_id: userId, challenge_id: challengeId })

      if (solveError) {
        console.error('Solve insert error:', solveError)
        return new Response(
          JSON.stringify({ error: 'Failed to record solve', success: false }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log(`User ${userId} solved challenge ${challenge.title} for ${challenge.points} points`)

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Correct! You earned ${challenge.points} points!`,
          points: challenge.points 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Incorrect flag. Keep trying!' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('Validation error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', success: false }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
