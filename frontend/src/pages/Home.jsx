import React from 'react';
import { ArrowRight, Code, Palette, BarChart, CheckCircle, Shield, Zap, Globe, Star } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen pt-20 bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-6">
                <Zap size={14} className="fill-blue-600" />
                <span>Fixed Price • Skill-Based • No Bidding</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                Connect with <br />
                <span className="text-blue-600">Top Tier <br /> Freelance talent.</span>
              </h1>

              <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                Skip the bidding wars. Our platform matches you with vetted specialists instantly based on your project's specific skill requirements.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 items-center mb-12">
                <Link to="/signup">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-blue-200 shadow-xl">
                    Get Started <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/about" className="font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                  How it works
                </Link>
              </div>

              <div className="flex items-center gap-12">
                <div>
                  <div className="font-bold text-2xl text-slate-900">10k+</div>
                  <div className="text-sm text-slate-500 font-medium">Experts</div>
                </div>
                <div>
                  <div className="font-bold text-2xl text-slate-900">98%</div>
                  <div className="text-sm text-slate-500 font-medium">Success Rate</div>
                </div>
                <div>
                  <div className="font-bold text-2xl text-slate-900">24/7</div>
                  <div className="text-sm text-slate-500 font-medium">Support</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white w-full max-w-lg">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Freelancer Dashboard"
                  className="w-full h-auto object-cover"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              {/* Floating Badge 1 - Verified Talent */}
              <div className="absolute top-20 left-0 md:-left-12 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white flex items-center gap-3 animate-bounce-slow">
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                  <Shield size={20} className="fill-green-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Verified Talent</div>
                  <div className="text-xs text-slate-500">100% Secure</div>
                </div>
              </div>

              {/* Floating Badge 2 - Global Network */}
              <div className="absolute bottom-10 right-0 md:-right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white flex items-center gap-3 animate-pulse-slow">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  <Globe size={20} />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Global Network</div>
                  <div className="text-xs text-slate-500">Worldwide Reach</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose MicroHire?</h2>
            <p className="text-slate-600">We stripped away the complexity of traditional freelancing platforms to focus on what matters: Quality and Speed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-shadow border-slate-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Fast Hiring</h3>
              <p className="text-slate-600 leading-relaxed">
                Skip the proposal review fatigue. Our algorithm matches you with the right talent in minutes, not days.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow border-slate-100">
              <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Skill Matching</h3>
              <p className="text-slate-600 leading-relaxed">
                We verify skills so you don't have to. Get matched based on proven expertise, not just a claimed portfolio.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Trusted Freelancers</h3>
              <p className="text-slate-600 leading-relaxed">
                Every freelancer is vetted. Secure payments and satisfaction guarantees standard on every contract.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Services/Categories Preview */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Top Skills</h2>
              <p className="text-slate-600">Hire professionals across various domains.</p>
            </div>
            <Link to="/about" className="hidden md:flex items-center text-blue-600 font-medium hover:text-blue-700">
              View all services <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Frontend Development Service */}
            <div className="group bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer border border-slate-100">
              <div className="w-12 h-12 rounded-lg bg-blue-500 bg-opacity-10 flex items-center justify-center text-blue-600">
                <Code />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Frontend Development</h4>
                <p className="text-xs text-slate-500">120+ freelancers</p>
              </div>
              <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100" />
            </div>

            {/* UI/UX Design Service */}
            <div className="group bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer border border-slate-100">
              <div className="w-12 h-12 rounded-lg bg-pink-500 bg-opacity-10 flex items-center justify-center text-pink-600">
                <Palette />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors">UI/UX Design</h4>
                <p className="text-xs text-slate-500">85+ freelancers</p>
              </div>
              <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-pink-600 transition-colors opacity-0 group-hover:opacity-100" />
            </div>

            {/* Data Analysis Service */}
            <div className="group bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer border border-slate-100">
              <div className="w-12 h-12 rounded-lg bg-green-500 bg-opacity-10 flex items-center justify-center text-green-600">
                <BarChart />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors">Data Analysis</h4>
                <p className="text-xs text-slate-500">60+ freelancers</p>
              </div>
              <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100" />
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
