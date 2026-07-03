"use client";

// Base pulse animation styling
const skeletonPulse = "bg-slate-200 animate-pulse rounded-lg";

export function ProfileSelectorSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
      {/* Title placeholder */}
      <div className={`${skeletonPulse} h-5 w-48`} />
      {/* Profile Grid placeholders */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5">
        <div className={`${skeletonPulse} h-[48px]`} />
        <div className={`${skeletonPulse} h-[48px]`} />
      </div>
    </div>
  );
}

export function RegistrationFormSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
      {/* Title placeholder */}
      <div className={`${skeletonPulse} h-5 w-52`} />
      {/* Form Fields stack placeholder */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className={`${skeletonPulse} h-[44px] flex-1`} />
        <div className={`${skeletonPulse} h-[44px] w-full sm:w-32`} />
      </div>
    </div>
  );
}
