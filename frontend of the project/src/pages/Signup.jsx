import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Briefcase, Mail, Lock, UserCircle, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Signup = () => {
    const [role, setRole] = useState('client'); // 'client' or 'freelancer'
    const [step, setStep] = useState(1); // 1: Registration Details, 2: OTP Verification
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        mobileNo: '0000000000',
        termsAccepted: false
    });
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();

        // Basic validation for admin restriction
        if (formData.name.toLowerCase().includes('admin') || formData.email.includes('admin') || formData.username.includes('admin')) {
            alert("Username, Name or Email cannot contain 'admin'");
            return;
        }

        fetch('http://localhost:8080/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: formData.name,
                username: formData.username.toLowerCase(),
                email: formData.email.toLowerCase(),
                password: formData.password,
                mobileNo: formData.mobileNo,
                role: role.toUpperCase(),
                termsAccepted: formData.termsAccepted
            }),
        })
            .then(res => res.text())
            .then(msg => {
                if (msg.includes("OTP sent successfully")) {
                    alert("OTP sent to your email! Please check and verify.");
                    setStep(2);
                } else {
                    alert(msg);
                }
            })
            .catch(() => alert("Signup initiation failed. Please try again."));
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();

        fetch('http://localhost:8080/api/auth/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.email.toLowerCase(),
                otp: otp
            }),
        })
            .then(res => res.text())
            .then(msg => {
                if (msg.includes("successful")) {
                    alert("Account verified and created successfully!");
                    navigate('/');
                } else {
                    alert(msg);
                }
            })
            .catch(() => alert("Verification failed. Please try again."));
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            <div className="w-full max-w-[500px]">

                <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-white mb-4 shadow-lg shadow-purple-200">
                        <Briefcase size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Join MicroHire</h1>
                    <p className="text-slate-600">
                        {step === 1 ? "Create your account to get started" : "Verify your email to complete registration"}
                    </p>
                </div>

                <Card className="p-8 border-slate-200 shadow-xl">
                    {step === 1 ? (
                        <form onSubmit={handleRegisterSubmit} className="space-y-6">

                            {/* Role Selector */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-900 block">I am a *</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setRole('client')}
                                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${role === 'client'
                                            ? 'border-blue-600 bg-blue-50/50'
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <UserCircle size={28} className={role === 'client' ? 'text-blue-600' : 'text-slate-400'} />
                                        <div className="text-center">
                                            <div className={`font-semibold ${role === 'client' ? 'text-blue-700' : 'text-slate-700'}`}>Client</div>
                                            <div className="text-xs text-slate-500 mt-1">Looking to hire</div>
                                        </div>
                                        {role === 'client' && (
                                            <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setRole('freelancer')}
                                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${role === 'freelancer'
                                            ? 'border-purple-600 bg-purple-50/50'
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <Code size={28} className={role === 'freelancer' ? 'text-purple-600' : 'text-slate-400'} />
                                        <div className="text-center">
                                            <div className={`font-semibold ${role === 'freelancer' ? 'text-purple-700' : 'text-slate-700'}`}>Freelancer</div>
                                            <div className="text-xs text-slate-500 mt-1">Looking for work</div>
                                        </div>
                                        {role === 'freelancer' && (
                                            <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-purple-600 ring-4 ring-purple-100" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            required
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Username</label>
                                    <div className="relative">
                                        <UserCircle className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="username123"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            required
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="example@gmail.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            required
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="********"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            required
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-3 pt-2">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="termsAccepted"
                                        type="checkbox"
                                        checked={formData.termsAccepted}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 border border-slate-300 rounded bg-slate-50 focus:ring-3 focus:ring-purple-300 text-purple-600"
                                        required
                                    />
                                </div>
                                <label htmlFor="terms" className="text-sm text-slate-600">
                                    I agree to the <a href="#" className="font-medium text-purple-600 hover:text-purple-500">Terms of Service</a> and <a href="#" className="font-medium text-purple-600 hover:text-purple-500">Privacy Policy</a>
                                </label>
                            </div>

                            <Button size="lg" className={`w-full justify-center ${role === 'client' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}>
                                Continue <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <div className="text-center space-y-2 mb-6">
                                <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-600 rounded-full mb-2">
                                    <Mail size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900">One Time Password</h3>
                                <p className="text-sm text-slate-600">
                                    Please enter the OTP sent to <span className="font-semibold">{formData.email}</span>
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Enter OTP</label>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-3 text-center text-2xl tracking-widest font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    required
                                    autoComplete="off"
                                    maxLength={6}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button size="lg" className="w-full justify-center bg-green-600 hover:bg-green-700">
                                    Verify & Create Account <CheckCircle size={18} className="ml-2" />
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-sm text-slate-500 hover:text-slate-700 transition"
                                >
                                    Change Email / Back
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-slate-600">
                        Already have an account? <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-500">Sign in</Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

/* Helper separate icon component not exported directly since default export is Signup */
const Code = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
);

export default Signup;

