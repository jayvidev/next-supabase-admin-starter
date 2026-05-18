import { LoginForm } from './form'

export function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight">Admin login</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Enter your credentials to access the panel.
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted hidden lg:block relative overflow-hidden">
        <img
          src="/images/assets/logo-green-background.webp"
          alt="Vertex Glass"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
