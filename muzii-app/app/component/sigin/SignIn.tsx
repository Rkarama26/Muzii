'use client';
import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function SignIn() {
  // should be wrapped inside a session providers
  const session = useSession();

  const handleSignIn = async () => {
    try {
      await signIn('google');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex justify-between">
        <div>
          {session.data?.user && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="hidden md:inline-flex" onClick={handleSignOut}>
                  Logout
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign out</p>
              </TooltipContent>
            </Tooltip>
          )}
          {!session.data?.user && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="hidden md:inline-flex" onClick={handleSignIn}>
                  Signin
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign in with Google</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
