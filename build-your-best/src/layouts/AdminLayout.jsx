import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main id="admin-main-content" className="min-w-0 flex-1 px-4 pb-6 pt-20 sm:px-6 lg:pt-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
