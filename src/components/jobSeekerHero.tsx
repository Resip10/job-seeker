import { Briefcase, Users, TrendingUp, Award } from "lucide-react"

export function JobSeekerHero() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="relative z-10 flex flex-col justify-start px-12 py-8 text-white w-full">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Find Your Dream Job
            <br />
            <span className="text-blue-300">Start Today</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Join thousands of professionals who found their perfect career match through our platform.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-2 mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">50K+</div>
            <div className="text-sm text-slate-400">Active Users</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-2 mx-auto">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">95%</div>
            <div className="text-sm text-slate-400">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-2 mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">1000+</div>
            <div className="text-sm text-slate-400">Companies</div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <p className="text-slate-200 mb-4 italic">
            &quot;This platform completely transformed my job search. I found my dream role in just 2 weeks!&quot;
          </p>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              SJ
            </div>
            <div className="ml-3">
              <div className="font-medium text-white">Sarah Johnson</div>
              <div className="text-sm text-slate-400">Software Engineer at TechCorp</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
