import React, { useState, useEffect } from 'react';
import { UserPlus, Edit, Trash, Eye, EyeOff } from 'lucide-react';
import { Role } from '@prisma/client';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

interface UserManagementProps {
  language: 'en' | 'ku';
}

interface UserFormData {
  email: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
  role: Role;
}

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  
  // Length checks
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // Complexity checks
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  // Ensure we don't go beyond 5
  if (hasUppercase) strength += 1;
  if (hasLowercase) strength += 1;
  if (hasNumber) strength += 1;
  if (hasSpecialChar) strength += 1;
  
  return Math.min(strength, 5);
};

const UserManagement: React.FC<UserManagementProps> = ({ language }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const translations = {
    en: {
      addUser: "Add User",
      editUser: "Edit User",
      name: "Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      passwordStrength: "Password Strength",
      role: "Role",
      admin: "Admin",
      user: "User",
      noUsers: "No users found",
      save: "Save",
      cancel: "Cancel",
      createdAt: "Created At",
      updatedAt: "Updated At",
      passwordStrengths: [
        'Very Weak',
        'Weak',
        'Moderate',
        'Strong',
        'Very Strong',
        'Extremely Strong'
      ],
      validationErrors: {
        emailRequired: "Email is required",
        emailInvalid: "Invalid email format",
        passwordRequired: "Password is required for new users",
        passwordTooShort: "Password must be at least 8 characters",
        confirmPasswordRequired: "Please confirm your password",
        passwordMismatch: "Passwords do not match"
      }
    },
    ku: {
      addUser: "زیادکردنی بەکارهێنەر",
      editUser: "دەستکاریکردنی بەکارهێنەر",
      name: "ناو",
      email: "ئیمەیڵ",
      password: "وشەی تێپەڕ",
      confirmPassword: "دووپاتکردنەوەی وشەی تێپەڕ",
      passwordStrength: "هێزی وشەی تێپەڕ",
      role: "ڕۆڵ",
      admin: "بەڕێوەبەر",
      user: "بەکارهێنەر",
      noUsers: "هیچ بەکارهێنەرێک نەدۆزرایەوە",
      save: "پاشەکەوتکردن",
      cancel: "پاشگەزبوونەوە",
      createdAt: "کاتی دروستکردن",
      updatedAt: "کاتی نوێکردنەوە",
      passwordStrengths: [
        'زۆر لاواز',
        'لاواز',
        'مامناوەند',
        'بەهێز',
        'زۆر بەهێز',
        'تەواو بەهێز'
      ],
      validationErrors: {
        emailRequired: "ئیمەیڵ پێویستە",
        emailInvalid: "فۆڕمی ئیمەیڵ هەڵەیە",
        passwordRequired: "وشەی تێپەڕ بۆ بەکارهێنەری نوێ پێویستە",
        passwordTooShort: "وشەی تێپەڕ دەبێت لە 8 پیت زیاتر بێت",
        confirmPasswordRequired: "تکایە وشەی تێپەڕەکەت دووپات بکەوە",
        passwordMismatch: "وشەی تێپەڕەکان یەک ناگرنەوە"
      }
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const validateForm = (data: UserFormData) => {
    const errors: Record<string, string> = {};

    // Email validation with more robust regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!data.email) {
      errors.email = translations[language].validationErrors.emailRequired;
    } else if (!emailRegex.test(data.email)) {
      errors.email = translations[language].validationErrors.emailInvalid;
    }

    // Password validation for new users
    if (!currentUser?.id) {
      if (!data.password) {
        errors.password = translations[language].validationErrors.passwordRequired;
      } else if (data.password.length < 8) {
        errors.password = translations[language].validationErrors.passwordTooShort;
      }

      if (!data.confirmPassword) {
        errors.confirmPassword = translations[language].validationErrors.confirmPasswordRequired;
      } else if (data.password !== data.confirmPassword) {
        errors.confirmPassword = translations[language].validationErrors.passwordMismatch;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = (strength: number) => {
    return translations[language].passwordStrengths[strength] || 
           translations[language].passwordStrengths[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: UserFormData = {
      email: (e.currentTarget as HTMLFormElement).email.value,
      name: (e.currentTarget as HTMLFormElement).name.value || undefined,
      password: (e.currentTarget as HTMLFormElement).password?.value,
      confirmPassword: (e.currentTarget as HTMLFormElement).confirmPassword?.value,
      role: (e.currentTarget as HTMLFormElement).role.value as Role
    };

    if (!validateForm(formData)) return;

    try {
      const endpoint = currentUser?.id 
        ? `/api/users/${currentUser.id}` 
        : '/api/users';
      
      const method = currentUser?.id ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save user');
      }

      const savedUser = await response.json();

      setUsers(prev => 
        currentUser?.id 
          ? prev.map(u => u.id === savedUser.id ? savedUser : u)
          : [...prev, savedUser]
      );

      setIsModalOpen(false);
      setCurrentUser(null);
      setPasswordStrength(0);
    } catch (error) {
      console.error('Error saving user:', error);
      alert(translations[language].save + ' failed');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm(translations[language].noUsers)) return;

    try {
      const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(translations[language].noUsers + ' failed');
    }
  };

  return (
    <div className="space-y-8" dir={language === 'ku' ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-mono">{translations[language].addUser}</h2>
        <button 
          onClick={() => {
            setCurrentUser(null);
            setIsModalOpen(true);
          }} 
          className="bg-black text-white px-4 py-2 flex items-center gap-2 hover:bg-gray-800"
        >
          <UserPlus size={20} />
          {translations[language].addUser}
        </button>
      </div>

      <div className="border-4 border-black overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4 text-left">{translations[language].name}</th>
              <th className="p-4 text-left">{translations[language].email}</th>
              <th className="p-4 text-left">{translations[language].role}</th>
              <th className="p-4 text-left">{translations[language].createdAt}</th>
              <th className="p-4 text-left">{translations[language].updatedAt}</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map(user => (
                <tr key={user.id} className="border-b-2 border-black">
                  <td className="p-4">{user.name || 'N/A'}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">{new Date(user.createdAt).toLocaleString()}</td>
                  <td className="p-4">{new Date(user.updatedAt).toLocaleString()}</td>
                  <td className="p-4 flex gap-2">
                    <button 
                      onClick={() => {
                        setCurrentUser(user);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  {translations[language].noUsers}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl mb-4">
              {currentUser?.id 
                ? translations[language].editUser 
                : translations[language].addUser}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2">{translations[language].name}</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={currentUser?.name || ''}
                  placeholder={translations[language].name}
                  className="w-full border p-2"
                />
              </div>

              <div>
                <label className="block mb-2">{translations[language].email}</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={currentUser?.email || ''}
                  placeholder={translations[language].email}
                  className="w-full border p-2"
                />
                {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
              </div>

              {!currentUser?.id && (
                <>
                  <div className="relative">
                    <label className="block mb-2">{translations[language].password}</label>
                    <div className="flex items-center">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder={translations[language].password}
                        className="w-full border p-2 pr-10"
                        onChange={handlePasswordChange}
                      />
                      <button
                        type="button"
                        className="absolute right-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {formErrors.password && <p className="text-red-500">{formErrors.password}</p>}
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label>{translations[language].passwordStrength}</label>
                      <span 
                        className={`
                          ${passwordStrength <= 1 ? 'text-red-500' : 
                            passwordStrength <= 3 ? 'text-yellow-500' : 
                            'text-green-500'}
                        `}
                      >
                        {getPasswordStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-gray-200">
                      <div 
                        className={`h-1 ${
                          passwordStrength <= 1 ? 'bg-red-500 w-1/4' : 
                          passwordStrength <= 3 ? 'bg-yellow-500 w-/3' :
                          // Continuation of the previous code block
                         passwordStrength <= 3 ? 'bg-yellow-500 w-1/2' : 
                         'bg-green-500 w-full'
                       }`}
                     />
                   </div>
                 </div>

                 <div>
                   <label className="block mb-2">{translations[language].confirmPassword}</label>
                   <input
                     type={showPassword ? "text" : "password"}
                     name="confirmPassword"
                     placeholder={translations[language].confirmPassword}
                     className="w-full border p-2"
                   />
                   {formErrors.confirmPassword && <p className="text-red-500">{formErrors.confirmPassword}</p>}
                 </div>
               </>
             )}

             <div>
               <label className="block mb-2">{translations[language].role}</label>
               <select
                 name="role"
                 defaultValue={currentUser?.role || 'USER'}
                 className="w-full border p-2"
               >
                 <option value="USER">{translations[language].user}</option>
                 <option value="ADMIN">{translations[language].admin}</option>
               </select>
             </div>

             <div className="flex justify-end space-x-2">
               <button 
                 type="button"
                 onClick={() => setIsModalOpen(false)}
                 className="px-4 py-2 border"
               >
                 {translations[language].cancel}
               </button>
               <button 
                 type="submit"
                 className="px-4 py-2 bg-black text-white"
               >
                 {translations[language].save}
               </button>
             </div>
           </form>
         </div>
       </div>
     )}
   </div>
 );
};

export default UserManagement;