import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

const Freelancers = () => {
    const [freelancers, setFreelancers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('http://localhost:8080/api/freelancers/all')
            .then(res => res.json())
            .then(data => {
                setFreelancers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch freelancers", err);
                setLoading(false);
            });
    }, []);

    // Local helper replaced by imported util

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Find Freelancers</h1>
                    <p className="text-gray-500 mt-1">Discover top talent for your next project.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-500">Loading freelancers...</div>
                ) : freelancers.length > 0 ? freelancers.map((freelancer) => (
                    <div key={freelancer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6 text-center">
                            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl mx-auto mb-4 border-2 border-white shadow-sm">
                                {freelancer.fullName?.substring(0, 2).toUpperCase()}
                            </div>
                            <h3 className="font-bold text-gray-900">{freelancer.fullName}</h3>
                            <p className="text-sm text-blue-600 font-medium mb-1">{freelancer.title || 'Freelancer'}</p>

                            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    <span>{freelancer.rating || 0.0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    <span>{freelancer.location || 'Remote'}</span>
                                </div>
                            </div>

                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex items-center justify-center border-t border-gray-100">
                            <div className="flex gap-4">
                                <Link
                                    to={`/client-dashboard/freelancer/${freelancer.id}`}
                                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    View Profile
                                </Link>
                                <a
                                    href={`mailto:${freelancer.email}?subject=Project Opportunity&body=Hi ${freelancer.fullName},`}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    Contact
                                </a>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-12 text-gray-500">No freelancers found.</div>
                )}
            </div>
        </div>
    );
};

export default Freelancers;
