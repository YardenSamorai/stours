import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">S-Tours Admin</h1>
          <p className="text-primary-200">הרשמה למערכת הניהול</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-white shadow-2xl rounded-2xl',
              headerTitle: 'text-slate-800',
              headerSubtitle: 'text-slate-600',
              formButtonPrimary: 'bg-primary-600 hover:bg-primary-700',
            }
          }}
        />
      </div>
    </div>
  );
}
