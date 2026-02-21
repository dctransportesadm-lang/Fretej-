import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Cone, Loader2, UserCircle, Plus } from 'lucide-react';

type AuthView = 'login' | 'register' | 'recovery';

export function AuthPage() {
  const { login, register, recoverPassword } = useAuth();
  const [view, setView] = useState<AuthView>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (view === 'login') {
        await login(email, password);
      } else if (view === 'register') {
        await register(name, email, password, avatar);
      } else if (view === 'recovery') {
        await recoverPassword(email);
        setView('login');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="bg-orange-500 p-3 rounded-xl shadow-lg transform -rotate-6">
          <Cone className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">FretaJá</h1>
      </div>

      <Card className="w-full max-w-md shadow-xl border-gray-200">
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-xl">
            {view === 'login' && 'Acesse sua conta'}
            {view === 'register' && 'Crie sua conta'}
            {view === 'recovery' && 'Recuperar senha'}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {view === 'login' && 'Entre com suas credenciais para continuar'}
            {view === 'register' && 'Preencha os dados abaixo para começar'}
            {view === 'recovery' && 'Digite seu email para receber as instruções'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'register' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="relative w-24 h-24">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                      {avatar ? (
                        <img src={avatar} alt="Avatar preview" className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 shadow-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nome</label>
                  <Input
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {view !== 'recovery' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Senha</label>
                  {view === 'login' && (
                    <button
                      type="button"
                      onClick={() => setView('recovery')}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-100 text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {view === 'login' && 'Entrar'}
              {view === 'register' && 'Cadastrar'}
              {view === 'recovery' && 'Enviar Link'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            {view === 'login' && (
              <p className="text-gray-500">
                Não tem uma conta?{' '}
                <button
                  onClick={() => setView('register')}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Cadastre-se
                </button>
              </p>
            )}
            {(view === 'register' || view === 'recovery') && (
              <button
                onClick={() => {
                  setView('login');
                  setError('');
                }}
                className="text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1 mx-auto"
              >
                Voltar para o login
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
