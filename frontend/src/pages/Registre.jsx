import { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  FileText,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';

export default function Registre({ onNavigateLogin, onRegisterSuccess }) {
  const [personType, setPersonType] = useState('fisica');
  const [fullName, setFullName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [farmName, setFarmName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password.length < 6) {
      setErrorMessage('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas digitadas não coincidem. Por favor, verifique.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Você precisa aceitar os termos de uso e política de privacidade para continuar.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.auth.register({
        fullName,
        document,
        personType,
        email,
        phone,
        farmName,
        password
      });

      const userPayload = response.usuario || {
        nome: fullName,
        email: email,
        perfil: 'Administrador',
        fazenda: farmName
      };

      setSuccessMessage(`Cadastro realizado com sucesso! Bem-vindo(a), ${fullName}!`);
      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess(userPayload);
        } else if (onNavigateLogin) {
          onNavigateLogin();
        }
      }, 1200);
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao realizar cadastro do produtor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden selection:bg-[#237a32]/20 selection:text-[#185824] bg-neutral-900 text-gray-900 font-sans">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=2000&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a2310]/95 via-[#185824]/80 to-[#237a32]/55 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_65%)]" />
      </div>

      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 md:py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white backdrop-blur-md border border-white/20 overflow-hidden flex items-center justify-center shadow-lg shadow-black/10 p-0.5">
            <img
              src="/images/logo_webFarm_1.svg"
              alt="Logo WebFarm"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-white">
                WebFarm
              </span>
              <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded-md bg-[#237a32] text-white uppercase border border-white/10">
                2.0
              </span>
            </div>
            <span className="text-[11px] text-emerald-100/70 font-medium tracking-wide">
              Agro Management Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs md:text-sm text-emerald-100/80">
          <button
            type="button"
            onClick={onNavigateLogin}
            className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-emerald-100 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar ao Login</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-4 md:py-8 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl shadow-black/30 rounded-3xl p-8 sm:p-10 transition-all duration-300 relative">
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#237a32]/40 to-transparent" />

          <div className="text-left mb-6">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#237a32]/10 text-[#237a32] mb-3">
              <User className="w-5 h-5 text-[#237a32]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Criar Conta de Produtor
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Cadastre sua propriedade e centralize sua gestão pecuária e agrícola.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{successMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl max-w-xs">
              <button
                type="button"
                onClick={() => setPersonType('fisica')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${personType === 'fisica'
                    ? 'bg-white text-[#237a32] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Pessoa Física (CPF)
              </button>
              <button
                type="button"
                onClick={() => setPersonType('juridica')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${personType === 'juridica'
                    ? 'bg-white text-[#237a32] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                Pessoa Jurídica (CNPJ)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider" htmlFor="fullName">
                  {personType === 'fisica' ? 'Nome Completo' : 'Razão Social'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={personType === 'fisica' ? 'ex: Carlos Augusto Ramos' : 'ex: Agropecuária Ramos Ltda'}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] hover:bg-white text-gray-800 text-sm rounded-xl border border-gray-200 outline-none focus:bg-white focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/20 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider" htmlFor="document">
                  {personType === 'fisica' ? 'CPF do Produtor' : 'CNPJ da Empresa'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <input
                    id="document"
                    type="text"
                    required
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    placeholder={personType === 'fisica' ? '000.000.000-00' : '00.000.000/0001-00'}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] hover:bg-white text-gray-800 text-sm rounded-xl border border-gray-200 outline-none focus:bg-white focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/20 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider" htmlFor="email">
                  E-mail de Acesso
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="produtor@fazenda.com.br"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] hover:bg-white text-gray-800 text-sm rounded-xl border border-gray-200 outline-none focus:bg-white focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/20 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider" htmlFor="phone">
                  Celular / WhatsApp
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 90000-0000"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] hover:bg-white text-gray-800 text-sm rounded-xl border border-gray-200 outline-none focus:bg-white focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/20 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider" htmlFor="farmName">
                Nome da Propriedade Principal (Fazenda)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  id="farmName"
                  type="text"
                  required
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="ex: Fazenda Santa Maria"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] hover:bg-white text-gray-800 text-sm rounded-xl border border-gray-200 outline-none focus:bg-white focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/20 transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider" htmlFor="password">
                  Criar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#f8f9fa] hover:bg-white text-gray-800 text-sm rounded-xl border border-gray-200 outline-none focus:bg-white focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/20 transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider" htmlFor="confirmPassword">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#f8f9fa] hover:bg-white text-gray-800 text-sm rounded-xl border border-gray-200 outline-none focus:bg-white focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/20 transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[#237a32] focus:ring-[#237a32] border-gray-300 accent-[#237a32]"
                />
                <span className="text-xs text-gray-600 leading-snug">
                  Concordo com os{' '}
                  <a href="#termos" className="text-[#237a32] font-semibold hover:underline">
                    Termos de Uso
                  </a>{' '}
                  e a{' '}
                  <a href="#privacidade" className="text-[#237a32] font-semibold hover:underline">
                    Política de Privacidade LGPD Agro
                  </a>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 px-6 rounded-xl bg-[#237a32] hover:bg-[#185824] disabled:bg-slate-400 text-white font-semibold text-sm tracking-wide shadow-lg shadow-[#237a32]/25 hover:shadow-xl hover:shadow-[#185824]/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Finalizando Cadastro...</span>
                </>
              ) : (
                <>
                  <span>Finalizar Cadastro</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400 font-medium">
                Já é cadastrado na WebFarm?
              </span>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onNavigateLogin}
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all duration-200 shadow-xs hover:border-[#237a32]/40 hover:text-[#215f2d] cursor-pointer"
            >
              <span>Já possui acesso?</span>
              <span className="text-[#237a32] font-bold">Entrar no Sistema</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Criptografia de Ponta a Ponta</span>
            </div>
            <span>Versão 2.4.0 (Enterprise)</span>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-100/70">
        <p>© 2025 WebFarm Software Agrícola Ltda. Todos os direitos reservados.</p>
        <div className="flex items-center gap-6">
          <a className="hover:text-white transition-colors duration-200" href="#termos">
            Termos de Uso
          </a>
          <a className="hover:text-white transition-colors duration-200" href="#privacidade">
            Privacidade LGPD
          </a>
          <a className="hover:text-white transition-colors duration-200" href="#contato">
            Fale com um Especialista Agro
          </a>
        </div>
      </footer>
    </div>
  );
}
