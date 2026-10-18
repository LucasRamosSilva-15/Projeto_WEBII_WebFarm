import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Layers,
  TrendingUp,
  Users,
  CheckCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronRight,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';
import TermosDeUsoModal from '../components/TermosDeUsoModal';
import LgpdAgroModal from '../components/LgpdAgroModal';
import EspecialistaAgroModal from '../components/EspecialistaAgroModal';

export default function Login({ onLogin, onNavigateRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTermosOpen, setIsTermosOpen] = useState(false);
  const [isLgpdOpen, setIsLgpdOpen] = useState(false);
  const [isEspecialistaOpen, setIsEspecialistaOpen] = useState(false);

  useEffect(() => {
    try {
      const savedIdentifier = localStorage.getItem('webfarm_remember_identifier');
      if (savedIdentifier) {
        setIdentifier(savedIdentifier);
        setRememberMe(true);
      }
    } catch {}
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await api.auth.login({
        identificador: identifier,
        senha: password
      });

      if (rememberMe) {
        try {
          localStorage.setItem('webfarm_remember_identifier', identifier);
        } catch {}
      } else {
        try {
          localStorage.removeItem('webfarm_remember_identifier');
        } catch {}
      }

      const userPayload = response.usuario || {
        nome: 'Lucas Ramos',
        email: identifier.includes('@') ? identifier : `${identifier}@fazenda.com.br`,
        perfil: 'Administrador'
      };

      if (onLogin) {
        onLogin(userPayload);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Falha ao autenticar. Verifique suas credenciais.');
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
              Agro & Services Management
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs md:text-sm text-emerald-100/80">
          <span className="hidden sm:inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-emerald-100">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            Ambiente Seguro &amp; Criptografado
          </span>
          <a
            className="hover:text-white transition-colors duration-200 text-xs font-medium underline-offset-4 hover:underline"
            href="#suporte"
          >
            Ajuda &amp; Suporte
          </a>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 py-4 md:py-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 text-white">
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>A nova era da gestão agropecuária</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Gerenciamento inteligente para a sua{' '}
                <span className="bg-gradient-to-r from-emerald-200 via-white to-emerald-300 bg-clip-text text-transparent">
                  propriedade rural.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-emerald-50/85 max-w-xl font-normal leading-relaxed">
                Centralize operações pecuárias, planejamento de safra, maquinários e fluxo financeiro em uma única plataforma desenhada para a máxima rentabilidade do produtor.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300/80">
                Pilares Integrados do Sistema
              </span>
              <div className="grid grid-cols-1 gap-3.5">
                <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5">
                  <div className="p-2.5 rounded-xl bg-[#237a32]/80 group-hover:bg-[#237a32] border border-emerald-400/20 text-white shadow-sm transition-colors duration-200 shrink-0">
                    <Layers className="w-5 h-5 text-emerald-100" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-base font-semibold text-white group-hover:text-emerald-200 transition-colors duration-200">
                      Controle de Animais e Produção
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100/75 mt-0.5 leading-snug">
                      Rastreabilidade de rebanho, pesagens periódicas, taxa de lotação e produtividade por lote.
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5">
                  <div className="p-2.5 rounded-xl bg-[#237a32]/80 group-hover:bg-[#237a32] border border-emerald-400/20 text-white shadow-sm transition-colors duration-200 shrink-0">
                    <TrendingUp className="w-5 h-5 text-emerald-100" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-base font-semibold text-white group-hover:text-emerald-200 transition-colors duration-200">
                      Gestão Financeira e Movimentações
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100/75 mt-0.5 leading-snug">
                      DRE agrícola, centros de custos, contas a pagar/receber e fluxo de caixa simplificado.
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5">
                  <div className="p-2.5 rounded-xl bg-[#237a32]/80 group-hover:bg-[#237a32] border border-emerald-400/20 text-white shadow-sm transition-colors duration-200 shrink-0">
                    <Users className="w-5 h-5 text-emerald-100" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-base font-semibold text-white group-hover:text-emerald-200 transition-colors duration-200">
                      Organização de Maquinários e Equipe
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100/75 mt-0.5 leading-snug">
                      Controle de horímetro, manutenções preventivas, ordens de serviço e jornada de operadores.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-emerald-100/70 border-t border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Normas Mapa &amp; Rastreabilidade</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Disponível Online e Offline</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Emissão de NFP-e Integrada</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/40 shadow-2xl shadow-black/30 rounded-3xl p-8 sm:p-10 transition-all duration-300 relative">
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#237a32]/40 to-transparent" />

              <div className="text-left mb-6">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-[#237a32]/10 text-[#237a32] mb-3">
                  <Lock className="w-5 h-5 text-[#237a32]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Acessar Sistema
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Informe suas credenciais para gerenciar sua fazenda.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label
                    className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    htmlFor="identifier"
                  >
                    E-mail ou CPF / CNPJ do Produtor
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] hover:bg-white text-gray-800 text-sm rounded-xl border border-gray-200/90 transition-all duration-200 outline-none focus:bg-white focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/20 shadow-xs placeholder:text-gray-400"
                      id="identifier"
                      placeholder="produtor@fazenda.com.br ou CPF/CNPJ"
                      required
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      className="block text-xs font-semibold text-gray-700 uppercase tracking-wider"
                      htmlFor="password"
                    >
                      Senha
                    </label>
                    <a
                      className="text-xs font-medium text-[#215f2d] hover:text-[#185824] transition-colors hover:underline"
                      href="#recuperar-senha"
                    >
                      Esqueci minha senha
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      className="w-full pl-10 pr-11 py-3 bg-[#f8f9fa] hover:bg-white text-gray-800 text-sm rounded-xl border border-gray-200/90 transition-all duration-200 outline-none focus:bg-white focus:border-[#237a32] focus:ring-2 focus:ring-[#237a32]/20 shadow-xs placeholder:text-gray-400"
                      id="password"
                      placeholder="Digite sua senha de acesso"
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                      id="togglePassword"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      className="w-4 h-4 rounded text-[#237a32] focus:ring-[#237a32] border-gray-300 accent-[#237a32]"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="text-xs text-gray-600 font-normal">
                      Lembrar minhas credenciais
                    </span>
                  </label>
                </div>

                <button
                  className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#237a32] hover:bg-[#185824] disabled:bg-slate-400 text-white font-semibold text-sm tracking-wide shadow-lg shadow-[#237a32]/25 hover:shadow-xl hover:shadow-[#185824]/30 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Autenticando...</span>
                    </>
                  ) : (
                    <>
                      <span>Entrar no Sistema</span>
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
                    Novo produtor rural?
                  </span>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onNavigateRegister}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-all duration-200 shadow-xs hover:border-[#237a32]/40 hover:text-[#215f2d] cursor-pointer"
                >
                  <span>Ainda não tem conta?</span>
                  <span className="text-[#237a32] font-bold">Cadastre-se grátis</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#237a32]" />
                </button>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>Versão 2.4.0 (Enterprise)</span>
                <span className="text-emerald-700 font-medium">Servidores Operacionais</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-100/70">
        <p>© 2026 WebFarm Software Agrícola Ltda. Todos os direitos reservados.</p>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setIsTermosOpen(true)}
            className="hover:text-white transition-colors duration-200 cursor-pointer active:scale-95"
          >
            Termos de Uso
          </button>
          <button
            type="button"
            onClick={() => setIsLgpdOpen(true)}
            className="hover:text-white transition-colors duration-200 cursor-pointer active:scale-95"
          >
            Privacidade LGPD
          </button>
          <button
            type="button"
            onClick={() => setIsEspecialistaOpen(true)}
            className="hover:text-white transition-colors duration-200 cursor-pointer active:scale-95"
          >
            Fale com um Especialista Agro
          </button>
        </div>
      </footer>

      <TermosDeUsoModal
        isOpen={isTermosOpen}
        onClose={() => setIsTermosOpen(false)}
      />

      <LgpdAgroModal
        isOpen={isLgpdOpen}
        onClose={() => setIsLgpdOpen(false)}
      />

      <EspecialistaAgroModal
        isOpen={isEspecialistaOpen}
        onClose={() => setIsEspecialistaOpen(false)}
      />
    </div>
  );
}
