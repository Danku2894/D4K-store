import { FiLock } from 'react-icons/fi';
import Breadcrumb from '@components/common/Breadcrumb';
import AccountNav from '@components/profile/AccountNav';
import ChangePasswordForm from '@components/profile/ChangePasswordForm';

const ChangePasswordPage = () => {
  const breadcrumbItems = [
    { label: 'My Account', path: '/profile' },
    { label: 'Change Password', path: '/profile/password' },
  ];

  return (
    <div className="min-h-screen bg-light-50">
      <div className="container-street py-6">
        <Breadcrumb items={breadcrumbItems} />

        {/* Page Header */}
        <div className="py-8 border-b-4 border-dark-950 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <FiLock size={48} className="text-dark-950" />
            <div>
              <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight glitch-street">
                SECURITY
              </h1>
              <p className="text-gray-600 font-bold uppercase tracking-wide mt-2">
                MANAGE YOUR PASSWORD AND SECURITY
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <AccountNav />
          </aside>

          <main className="lg:col-span-3">
            <ChangePasswordForm />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
