'use client'
import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react'
 
export default function SignIn() {
    // should be wrapped inside a sesion providers
    const session = useSession();


    return (
        <div className='flex justify-between'>
            <div>
                {session.data?.user && <Button variant="ghost"  className='hidden md:inline-flex' onClick={() => signOut()}>Logout</Button>}
                {!session.data?.user && <Button variant="ghost"  className='hidden md:inline-flex' onClick={() => signIn()}>Signin</Button>}
            </div>
        </div>
    )
}
