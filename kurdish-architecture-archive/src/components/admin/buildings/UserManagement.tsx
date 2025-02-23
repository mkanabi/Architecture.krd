import React from 'react';
import { User } from '@prisma/client';
import { Edit, Trash, UserPlus, Check, X } from 'lucide-react';

interface UserManagementProps {
  language: 'en' | 'ku';
}

const UserManagement: React.FC<UserManagementProps> = ({ language }) => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isAddingUser, setIsAddingUser] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<string | null>(null);

  const translations = {
    en: {
      title: "User Management",
      addUser: "Add User",
      email: "Email",
      name: "Name",
      role: "Role",
      actions: "Actions",
      save: "Save",
      cancel: "Cancel",
      confirmDelete: "Are you sure you want to delete this user?"
    },
    ku: {
      title: "بەڕێوەبردنی بەکارهێنەران",
      addUser: "زیادکردنی بەکارهێنەر",
      email: "ئیمەیڵ",
      name: "ناو",
      role: "ڕۆڵ",
      actions: "کردارەکان",
      save: "پاشەکەوتکردن",
      cancel: "هەڵوەشاندنەوە",
      confirmDelete: "دڵنیای لە سڕینەوەی ئەم بەکارهێنەرە؟"
    }
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implementation for adding user
  };

  const handleEditUser = async (userId: string) => {
    // Implementation for editing user
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm(translations[language].confirmDelete)) {
      // Implementation for deleting user
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-mono">{translations[language].title}</h2>
        <button
          onClick={() => setIsAddingUser(true)}
          className="bg-black text-white px-6 py-3 flex items-center gap-2 hover:bg-white hover:text-black border-2 border-black transition-colors"
        >
          <UserPlus size={20} />
          {translations[language].addUser}
        </button>
      </div>

      {/* Add User Form */}
      {isAddingUser && (
        <div className="border-4 border-black p-6">
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block font-mono mb-2">{translations[language].email}</label>
              <input
                type="email"
                required
                className="w-full border-2 border-black p-2"
              />
            </div>
            <div>
              <label className="block font-mono mb-2">{translations[language].name}</label>
              <input
                type="text"
                required
                className="w-full border-2 border-black p-2"
              />
            </div>
            <div>
              <label className="block font-mono mb-2">{translations[language].role}</label>
              <select className="w-full border-2 border-black p-2">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsAddingUser(false)}
                className="px-4 py-2 hover:bg-black hover:text-white border-2 border-black transition-colors"
              >
                <X size={20} />
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white hover:bg-white hover:text-black border-2 border-black transition-colors"
              >
                <Check size={20} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="border-4 border-black">
        <table className="w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="p-4 text-left">{translations[language].email}</th>
              <th className="p-4 text-left">{translations[language].name}</th>
              <th className="p-4 text-left">{translations[language].role}</th>
              <th className="p-4 text-left">{translations[language].actions}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b-2 border-black">
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingUser(user.id)}
                      className="p-2 hover:bg-black hover:text-white transition-colors"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 hover:bg-black hover:text-white transition-colors"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;