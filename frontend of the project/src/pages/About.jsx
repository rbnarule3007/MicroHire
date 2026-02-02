import React from 'react';
import Card from '../components/common/Card';
import { Target, Users, Globe, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Reimaging Work for the <span className="text-purple-600">Modern World</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            MicroHire is on a mission to democratize access to global talent and high-quality opportunities, ensuring matches are making based on merit, not marketing.
          </p>
        </div>

        {/* Mission/Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {/* Stat 1 */}
          <Card className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 border-none hover:bg-white">
            <div className="mb-4 p-3 bg-white rounded-full shadow-sm">
              <Target className="text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">2026</div>
            <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Founded</div>
          </Card>

          {/* Stat 2 */}
          <Card className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 border-none hover:bg-white">
            <div className="mb-4 p-3 bg-white rounded-full shadow-sm">
              <Users className="text-pink-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1"></div>
            <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Active Users</div>
          </Card>

          {/* Stat 3 */}
          <Card className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 border-none hover:bg-white">
            <div className="mb-4 p-3 bg-white rounded-full shadow-sm">
              <Globe className="text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1"></div>
            <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Countries</div>
          </Card>

          {/* Stat 4 */}
          <Card className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 border-none hover:bg-white">
            <div className="mb-4 p-3 bg-white rounded-full shadow-sm">
              <Award className="text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1"></div>
            <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Projects Done</div>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-slate-200"></div>

            <div className="space-y-12">
              {/* Step 1: Registration - Right */}
              <div className="relative flex items-center justify-between">
                <div className="w-5/12"></div>

                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-4 h-4 rounded-full bg-white border-4 border-blue-500 z-10"></div>

                <div className="w-5/12 pl-8 text-left">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Registration</h3>
                  <p className="text-slate-600">Users sign up as Client or Freelancer.</p>
                </div>
              </div>

              {/* Step 2: Post Project - Left */}
              <div className="relative flex items-center justify-between">
                <div className="w-5/12 pr-8 text-right">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Post Project</h3>
                  <p className="text-slate-600">Client creates a project with budget and deadline.</p>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-4 h-4 rounded-full bg-white border-4 border-green-500 z-10"></div>

                <div className="w-5/12"></div>
              </div>

              {/* Step 3: Contract Assignment - Right */}
              <div className="relative flex items-center justify-between">
                <div className="w-5/12"></div>

                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-4 h-4 rounded-full bg-white border-4 border-red-500 z-10"></div>

                <div className="w-5/12 pl-8 text-left">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Contract Assignment</h3>
                  <p className="text-slate-600">Client assigns contract directly to a Freelancer.</p>
                </div>
              </div>

              {/* Step 4: Completion & Review - Left */}
              <div className="relative flex items-center justify-between">
                <div className="w-5/12 pr-8 text-right">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Completion & Review</h3>
                  <p className="text-slate-600">Work is delivered. Client leaves a Rating & Comment.</p>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-4 h-4 rounded-full bg-white border-4 border-yellow-500 z-10"></div>

                <div className="w-5/12"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl transform rotate-3 opacity-20"></div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Team collaboration"
              className="relative rounded-2xl shadow-xl w-full object-cover h-[400px]"
            />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Built by Freelancers, for Freelancers</h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                We started MicroHire because we were tired of the existing platforms. The bidding wars, the high fees, and the lack of transparency made freelancing harder than it needed to be.
              </p>
              <p>
                Our philosophy is simple: Great work speaks for itself. By focusing on skills and verified portfolios, we remove the friction from hiring and ensure that talent rises to the top naturally.
              </p>
              <p>
                Whether you're a startup looking to scale or an expert looking for your next challenge, we're building the infrastructure to help you succeed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
