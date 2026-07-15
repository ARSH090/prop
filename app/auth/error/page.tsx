import { AFXCard } from '@/components/ui/afx-card'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-bg-base text-text-primary">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <AFXCard className="bg-bg-surface border border-border-subtle p-6 space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">
              Sorry, something went wrong.
            </h2>
            {params?.error ? (
              <p className="text-sm text-text-secondary font-mono bg-red-500/10 p-2.5 rounded border border-red-500/20">
                Code error: {params.error}
              </p>
            ) : (
              <p className="text-sm text-text-secondary">
                An unspecified error occurred.
              </p>
            )}
          </AFXCard>
        </div>
      </div>
    </div>
  )
}
