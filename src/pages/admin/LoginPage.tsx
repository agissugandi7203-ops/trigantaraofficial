import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAdmin) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.error) {
      setError(result.error === 'Invalid login credentials'
        ? 'Email atau password salah.'
        : result.error);
    } else {
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="/assets/logo/LOGO TRIGANTARA (2).webp"
              alt="Trigantara"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="font-serif text-2xl font-bold text-zinc-900">Masuk Admin</h1>
            <p className="text-sm text-zinc-400 mt-1">Panel administrasi Trigantara</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@trigantara.id"
                required
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-600 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/10 transition-all"
              />
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-zinc-900 text-white rounded-xl font-semibold text-sm hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Memverifikasi...' : 'Masuk'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
              ← Kembali ke website
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
