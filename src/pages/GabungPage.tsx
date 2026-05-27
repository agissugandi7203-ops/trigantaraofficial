import { useState } from 'react';
import { motion } from 'motion/react';
import { JURUSAN_LIST, KELAS_LIST } from '../data/constants';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ShieldCheck, ChevronRight, CornerDownLeft } from 'lucide-react';

export default function GabungPage() {
  const [form, setForm] = useState({ nama_lengkap: '', kelas: '', jurusan: '', no_hp: '', alamat: '', motivasi: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { ref, isVisible } = useScrollAnimation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.nama_lengkap || !form.kelas || !form.jurusan || !form.no_hp) {
      setError('Mohon lengkapi semua bidang yang wajib diisi.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Gagal mengirim pendaftaran.');
      }

      setSuccess(true);
      setForm({ nama_lengkap: '', kelas: '', jurusan: '', no_hp: '', alamat: '', motivasi: '' });
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Coba lagi nanti.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-24 min-h-screen bg-cream-bg text-brand-dark">
      {/* Hero Banner */}
      <section className="bg-brand-orange py-16 lg:py-20 text-center border-b-4 border-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute top-5 left-10 text-4xl opacity-15">⚜️</div>
          <div className="absolute bottom-5 right-10 text-4xl opacity-15">⛺</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-kids font-bold uppercase bg-brand-yellow text-brand-dark border-2 border-brand-dark shadow-[2px_2px_0_rgba(0,0,0,0.15)] mb-4">
            Pendaftaran Anggota
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-black text-white tracking-tight mb-3">Gabung Kami</h1>
          <p className="text-[#FAF6F0] text-sm sm:text-lg max-w-xl mx-auto font-sans font-medium opacity-90">Isi formulir di bawah untuk mendaftar sebagai calon anggota Pramuka Trigantara.</p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div ref={ref} className={`animate-slide-up ${isVisible ? 'visible' : ''}`}>
            {success ? (
              <SuccessMessage onReset={() => setSuccess(false)} />
            ) : (
              <form onSubmit={handleSubmit} className="bg-cream-card rounded-[2rem] border-4 border-brand-dark p-6 sm:p-10 shadow-[8px_8px_0_#2A1B15] space-y-6">
                <div className="flex items-center gap-3.5 pb-6 border-b border-brand-dark/15">
                  <span className="w-12 h-12 rounded-2xl bg-brand-yellow border-2 border-brand-dark flex items-center justify-center shadow-[2.5px_2.5px_0_#2A1B15] select-none text-xl">
                    ⚜️
                  </span>
                  <div>
                    <h2 className="font-serif text-2xl font-black text-brand-dark">Formulir Pendaftaran</h2>
                    <p className="text-xs font-kids font-bold text-brand-dark/50">Data pendaftaran akan diverifikasi langsung oleh Pembina.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-xs font-kids font-bold text-brand-dark/75 mb-1.5 uppercase">
                      Nama Lengkap <span className="text-brand-orange">*</span>
                    </label>
                    <input
                      type="text" name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange}
                      placeholder="Masukkan nama lengkap sesuai identitas"
                      className="w-full px-4 py-3 bg-[#FAF6F0] border-2 border-brand-dark rounded-xl text-sm font-sans font-medium text-brand-dark focus:outline-none focus:bg-white focus:shadow-[2.5px_2.5px_0_#2A1B15] transition-all"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Kelas */}
                    <div>
                      <label className="block text-xs font-kids font-bold text-brand-dark/75 mb-1.5 uppercase">
                        Kelas <span className="text-brand-orange">*</span>
                      </label>
                      <select
                        name="kelas" value={form.kelas} onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FAF6F0] border-2 border-brand-dark rounded-xl text-sm font-kids font-bold text-brand-dark focus:outline-none focus:bg-white focus:shadow-[2.5px_2.5px_0_#2A1B15] transition-all cursor-pointer"
                      >
                        <option value="">Pilih kelas</option>
                        {KELAS_LIST.map((k) => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>

                    {/* Jurusan */}
                    <div>
                      <label className="block text-xs font-kids font-bold text-brand-dark/75 mb-1.5 uppercase">
                        Jurusan <span className="text-brand-orange">*</span>
                      </label>
                      <select
                        name="jurusan" value={form.jurusan} onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#FAF6F0] border-2 border-brand-dark rounded-xl text-sm font-kids font-bold text-brand-dark focus:outline-none focus:bg-white focus:shadow-[2.5px_2.5px_0_#2A1B15] transition-all cursor-pointer"
                      >
                        <option value="">Pilih jurusan</option>
                        {JURUSAN_LIST.map((j) => <option key={j} value={j}>{j}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* No HP */}
                  <div>
                    <label className="block text-xs font-kids font-bold text-brand-dark/75 mb-1.5 uppercase">
                      No. HP / WhatsApp <span className="text-brand-orange">*</span>
                    </label>
                    <input
                      type="tel" name="no_hp" value={form.no_hp} onChange={handleChange}
                      placeholder="Contoh: 08123456789"
                      className="w-full px-4 py-3 bg-[#FAF6F0] border-2 border-brand-dark rounded-xl text-sm font-sans font-medium text-brand-dark focus:outline-none focus:bg-white focus:shadow-[2.5px_2.5px_0_#2A1B15] transition-all"
                    />
                  </div>

                  {/* Alamat */}
                  <div>
                    <label className="block text-xs font-kids font-bold text-brand-dark/75 mb-1.5 uppercase">Alamat Rumah</label>
                    <input
                      type="text" name="alamat" value={form.alamat} onChange={handleChange}
                      placeholder="Masukkan alamat domisili (opsional)"
                      className="w-full px-4 py-3 bg-[#FAF6F0] border-2 border-brand-dark rounded-xl text-sm font-sans font-medium text-brand-dark focus:outline-none focus:bg-white focus:shadow-[2.5px_2.5px_0_#2A1B15] transition-all"
                    />
                  </div>

                  {/* Motivasi */}
                  <div>
                    <label className="block text-xs font-kids font-bold text-brand-dark/75 mb-1.5 uppercase">Motivasi Bergabung</label>
                    <textarea
                      name="motivasi" value={form.motivasi} onChange={handleChange} rows={4}
                      placeholder="Ceritakan alasan dan apa yang ingin kamu pelajari di Pramuka Trigantara (opsional)"
                      className="w-full px-4 py-3 bg-[#FAF6F0] border-2 border-brand-dark rounded-xl text-sm font-sans font-medium text-brand-dark focus:outline-none focus:bg-white focus:shadow-[2.5px_2.5px_0_#2A1B15] transition-all resize-none"
                    />
                  </div>
                </div>

                {error && (
                  <div className="px-4 py-3.5 bg-brand-orange/10 border-2 border-brand-dark text-brand-orange rounded-xl text-xs sm:text-sm font-kids font-bold">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-brand-green text-white font-kids font-bold text-sm sm:text-base rounded-full border-2 border-brand-dark shadow-[4px_4px_0_#2A1B15] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed select-none cursor-pointer"
                >
                  {submitting ? 'Mengirim Pendaftaran...' : 'Kirim Formulir Pendaftaran ➔'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[2rem] border-4 border-brand-dark p-8 sm:p-10 text-center shadow-[8px_8px_0_#2A1B15] space-y-6"
    >
      <div className="w-20 h-20 rounded-full bg-brand-green/10 border-2 border-brand-dark flex items-center justify-center mx-auto shadow-[3px_3px_0_#2A1B15]">
        <ShieldCheck className="w-10 h-10 text-brand-green" />
      </div>
      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-black text-brand-dark">Pendaftaran Terkirim!</h2>
        <p className="text-xs sm:text-sm text-brand-dark/70 font-sans leading-relaxed max-w-md mx-auto">
          Terima kasih telah mendaftar. Pendaftaran kamu akan segera ditinjau oleh Dewan Kehormatan ambalan Trigantara. Kami akan menghubungi kamu melalui nomor WhatsApp yang dicantumkan.
        </p>
      </div>
      <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
        <Link
          to="/"
          className="px-6 py-2.5 bg-brand-dark text-white rounded-full text-xs font-kids font-bold border-2 border-brand-dark shadow-[3px_3px_0_rgba(255,255,255,0.7)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer inline-flex items-center justify-center gap-1"
        >
          <span>Kembali ke Beranda</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={onReset}
          className="px-6 py-2.5 bg-white text-brand-dark rounded-full text-xs font-kids font-bold border-2 border-brand-dark shadow-[3px_3px_0_#2A1B15] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer"
        >
          Daftar Lagi
        </button>
      </div>
    </motion.div>
  );
}
