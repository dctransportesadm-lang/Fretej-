import { LogOut, Moon, Sun, UserCircle, Camera } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface SettingsPageProps {
  user: { name: string; email: string; avatar?: string } | null;
  logout: () => void;
}

export function SettingsPage({ user, logout }: SettingsPageProps) {
  const { theme, toggleTheme } = useTheme();
  const { updateAvatar } = useAuth();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações</h1>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg dark:text-white">Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="h-10 w-10 text-gray-500 dark:text-gray-300" />
                )}
              </div>
              <label 
                htmlFor="profile-avatar-upload" 
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 shadow-sm border-2 border-white dark:border-gray-800"
              >
                <Camera className="h-3 w-3" />
                <input 
                  id="profile-avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{user?.name || 'Usuário'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || 'email@exemplo.com'}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100 dark:border-red-900/30 dark:hover:bg-red-900/20"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair da conta
          </Button>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg dark:text-white">Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
              <span className="text-gray-700 dark:text-gray-200">
                {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
              </span>
            </div>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
          </button>
        </CardContent>
      </Card>
      
      <div className="text-center text-xs text-gray-400 pt-8">
        FretaJá v1.0.0
      </div>
    </div>
  );
}
