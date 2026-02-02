import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Briefcase, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Login = () => {
    const navigate = useNavigate();
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const form = e.target;
        const identifier = form.querySelector('input[type="text"]').value.toLowerCase();
        const password = form.querySelector('input[type="password"]').value;

        fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: identifier, password: password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message.toLowerCase().includes("successful")) {
                    localStorage.setItem('user', JSON.stringify(data));
                    if (data.role === 'ADMIN') navigate('/admin');
                    else if (data.role === 'CLIENT') navigate('/client-dashboard');
                    else if (data.role === 'FREELANCER') {
                        // Redirect to onboarding if profile is not complete
                        if (data.profileCompleteness < 50) {
                            navigate('/freelancer-onboarding');
                        } else {
                            navigate('/freelancer-dashboard');
                        }
                    }
                } else {
                    alert(data.message);
                }
            })
            .catch(() => alert("Login failed. Check backend."));
    };

    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        alert(`Password reset link sent to ${email}`);
        setIsForgotPassword(false);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            <div className="w-full max-w-[450px]">

                <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-white mb-4 shadow-lg shadow-purple-200">
                        <Briefcase size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {isForgotPassword ? 'Reset Password' : 'Welcome Back'}
                    </h1>
                    <p className="text-slate-600">
                        {isForgotPassword
                            ? 'Enter your email to receive a reset link'
                            : 'Sign in to your MicroHire account'}
                    </p>
                </div>

                <Card className="p-8 border-slate-200 shadow-xl">
                    {!isForgotPassword ? (
                        <form onSubmit={handleSubmit} className="space-y-6">

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Email or Username</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="example@gmail.com or username"
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            required
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-slate-700">Password</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsForgotPassword(true)}
                                            className="text-sm font-medium text-purple-600 hover:text-purple-500"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            placeholder="********"
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            required
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button size="lg" className="w-full justify-center">
                                Sign In <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            placeholder="example@gmail.com"
                                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            required
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button size="lg" className="w-full justify-center">
                                Send Reset Link <ArrowRight size={18} className="ml-2" />
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setIsForgotPassword(false)}
                                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}

                    {!isForgotPassword && (
                        <div className="mt-6 text-center text-sm text-slate-600">
                            Don't have an account? <Link to="/signup" className="font-semibold text-purple-600 hover:text-purple-500">Create account</Link>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Login;
