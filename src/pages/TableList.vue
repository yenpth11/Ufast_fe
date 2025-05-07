<!-- Vue.js Post Office Employee Account Management Interface -->
<template>
  <div class="container">
    <div class="main-content">

      <div style="display: flex; flex-direction: column; width: 100%;">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />

<div class="function-tabs" style="display: flex; width: 100%;">
  <div @click="activeTab = 'requests'" :class="{ active: activeTab === 'requests' }" class="tab-item">
    <i class="fas fa-inbox"></i> <!-- Example icon for requests -->
    <span>Yêu cầu tài khoản mới</span>
    <span class="badge" v-if="pendingRequests.length">{{ pendingRequests.length }}</span>
  </div>
  <div @click="activeTab = 'accounts'" :class="{ active: activeTab === 'accounts' }" class="tab-item">
    <i class="fas fa-users"></i> <!-- Example icon for accounts -->
    <span>Tài khoản đã cấp</span>
  </div>
  <div @click="activeTab = 'create'" :class="{ active: activeTab === 'create' }" class="tab-item">
    <i class="fas fa-plus"></i> <!-- Example icon for create -->
    <span>Tạo tài khoản mới</span>
  </div>
</div>

      <div class="content">
        <!-- Tab: Yêu cầu tài khoản mới -->
        <div v-if="activeTab === 'requests'" class="tab-content">
  <h2><i class="fas fa-inbox"></i> Yêu cầu tài khoản mới <span class="count">({{ pendingRequests.length }})</span></h2>

  <div class="filter-bar">
    <div class="search">
      <i class="fas fa-search"></i>
      <input type="text" v-model="searchTerm" placeholder="Tìm kiếm theo tên/SĐT">
    </div>
    <div class="filter">
      <select v-model="roleFilter">
        <option value="">Tất cả vai trò</option>
        <option value="manager">Nhân viên quản lý</option>
        <option value="driver">Tài xế</option>
      </select>
    </div>
  </div>

  <div class="table-container">
    <table v-if="filteredRequests.length">
      <thead>
        <tr>
          <th>Họ tên</th>
          <th>SĐT</th>
          <th>Vai trò</th>
          <th>Ngày yêu cầu</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in filteredRequests" :key="request.id">
          <td>{{ request.name }}</td>
          <td>{{ request.phone }}</td>
          <td>
            <span class="tag" :class="request.role">
              {{ request.role === 'manager' ? 'Nhân viên quản lý' : 'Tài xế' }}
            </span>
          </td>
          <td>{{ formatDate(request.requestDate) }}</td>
          <td class="actions">
            <button @click="approveRequest(request)" class="btn-approve"><i class="fas fa-check"></i>Duyệt</button>
            <button @click="rejectRequest(request)" class="btn-reject"><i class="fas fa-times"></i>Từ chối</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="empty-state">
      <p>Không có yêu cầu tài khoản mới nào</p>
    </div>
  </div>
</div>

        <!-- Tab: Tài khoản đã cấp -->
        <div v-if="activeTab === 'accounts'" class="tab-content">
          <h2>Tài khoản đã cấp <span class="count">({{ approvedAccounts.length }})</span></h2>
          
          <div class="filter-bar">
            <div class="search">
              <input type="text" v-model="accountSearchTerm" placeholder="Tìm kiếm theo tên/SĐT">
            </div>
            <div class="filter">
              <select v-model="accountRoleFilter">
                <option value="">Tất cả vai trò</option>
                <option value="manager">Nhân viên quản lý</option>
                <option value="driver">Tài xế</option>
              </select>
            </div>
          </div>

          <div class="table-container">
            <table v-if="filteredAccounts.length">
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>SĐT</th>
                  <th>Vai trò</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="account in filteredAccounts" :key="account.id">
                  <td>{{ account.name }}</td>
                  <td>{{ account.phone }}</td>
                  <td>
                    <span class="tag" :class="account.role">
                      {{ account.role === 'manager' ? 'Nhân viên quản lý' : 'Tài xế' }}
                    </span>
                  </td>
                  <td>{{ formatDate(account.createdDate) }}</td>
                  <td>
                    <span class="status" :class="account.active ? 'active' : 'inactive'">
                      {{ account.active ? 'Hoạt động' : 'Đã khóa' }}
                    </span>
                  </td>
                  <td class="actions">
                    <button v-if="account.active" @click="deactivateAccount(account)" class="btn-deactivate">Khóa</button>
                    <button v-else @click="activateAccount(account)" class="btn-activate">Mở khóa</button>
                    <button @click="resetPassword(account)" class="btn-reset">Đặt lại MK</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else class="empty-state">
              <p>Không có tài khoản nào</p>
            </div>
          </div>
        </div>

        <!-- Tab: Tạo tài khoản mới -->
        <div v-if="activeTab === 'create'" class="tab-content">
          <h2>Tạo tài khoản mới</h2>
          
          <form @submit.prevent="createAccount" class="create-form">
            <div class="form-group">
              <label for="name">Họ và tên</label>
              <input type="text" id="name" v-model="newAccount.name" required>
            </div>
            
            <div class="form-group">
              <label for="phone">Số điện thoại</label>
              <input type="tel" id="phone" v-model="newAccount.phone" required>
            </div>
            
            <div class="form-group">
              <label for="role">Vai trò</label>
              <select id="role" v-model="newAccount.role" required>
                <option value="" disabled>Chọn vai trò</option>
                <option value="manager">Nhân viên quản lý</option>
                <option value="driver">Tài xế</option>
              </select>
            </div>

            <div class="form-group" v-if="newAccount.role === 'manager'">
              <label for="permissions">Quyền hạn</label>
              <div class="checkbox-group">
                <label class="checkbox">
                  <input type="checkbox" v-model="newAccount.permissions.manageDrivers">
                  <span>Quản lý tài xế</span>
                </label>
                <label class="checkbox">
                  <input type="checkbox" v-model="newAccount.permissions.manageOrders">
                  <span>Quản lý đơn hàng</span>
                </label>
                <label class="checkbox">
                  <input type="checkbox" v-model="newAccount.permissions.viewReports">
                  <span>Xem báo cáo</span>
                </label>
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">Email (tùy chọn)</label>
              <input type="email" id="email" v-model="newAccount.email">
            </div>
            
            <div class="form-group">
              <label for="notes">Ghi chú (tùy chọn)</label>
              <textarea id="notes" v-model="newAccount.notes" rows="3"></textarea>
            </div>
            
            <div class="form-actions">
              <button type="button" @click="resetForm" class="btn-cancel">Hủy bỏ</button>
              <button type="submit" class="btn-submit">Tạo tài khoản</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>

    <!-- Modal: Xác nhận duyệt tài khoản -->
    <div class="modal" v-if="showApproveModal">
      <div class="modal-content">
        <h3>Xác nhận duyệt tài khoản</h3>
        <p>Bạn có chắc chắn muốn duyệt tài khoản cho <strong>{{ selectedRequest?.name }}</strong>?</p>
        <p>Thông tin tài khoản sẽ được gửi đến số điện thoại <strong>{{ selectedRequest?.phone }}</strong>.</p>
        
        <div class="form-group">
          <label for="password">Mật khẩu mặc định</label>
          <div class="password-field">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="defaultPassword" readonly>
            <button type="button" @click="regeneratePassword" class="btn-regenerate">Tạo mới</button>
            <button type="button" @click="showPassword = !showPassword" class="btn-show">
              {{ showPassword ? 'Ẩn' : 'Hiện' }}
            </button>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="closeModal" class="btn-cancel">Hủy bỏ</button>
          <button @click="confirmApprove" class="btn-confirm">Xác nhận</button>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <div class="toast" v-if="notification.show" :class="notification.type">
      <div class="toast-content">
        <span class="toast-message">{{ notification.message }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountManagement',
  data() {
    return {
      activeTab: 'requests',
      currentUser: {
        id: 'admin123',
        name: 'Quản trị viên',
        role: 'admin'
      },
      // Dữ liệu mẫu: Danh sách yêu cầu tài khoản
      pendingRequests: [
        { 
          id: 'req1', 
          name: 'Nguyễn Văn A', 
          phone: '0912345678', 
          role: 'manager', 
          requestDate: new Date(2025, 4, 5) 
        },
        { 
          id: 'req2', 
          name: 'Trần Thị B', 
          phone: '0923456789', 
          role: 'driver', 
          requestDate: new Date(2025, 4, 6) 
        },
        { 
          id: 'req3', 
          name: 'Lê Văn C', 
          phone: '0934567890', 
          role: 'manager', 
          requestDate: new Date(2025, 4, 7) 
        },
      ],
      // Dữ liệu mẫu: Danh sách tài khoản đã cấp
      approvedAccounts: [
        { 
          id: 'acc1', 
          name: 'Phạm Thị D', 
          phone: '0945678901', 
          role: 'manager', 
          createdDate: new Date(2025, 4, 1),
          active: true 
        },
        { 
          id: 'acc2', 
          name: 'Hoàng Văn E', 
          phone: '0956789012', 
          role: 'driver', 
          createdDate: new Date(2025, 4, 2),
          active: true 
        },
        { 
          id: 'acc3', 
          name: 'Đỗ Thị F', 
          phone: '0967890123', 
          role: 'driver', 
          createdDate: new Date(2025, 4, 3),
          active: false 
        },
      ],
      // Form tạo tài khoản mới
      newAccount: {
        name: '',
        phone: '',
        role: '',
        email: '',
        notes: '',
        permissions: {
          manageDrivers: false,
          manageOrders: false,
          viewReports: false
        }
      },
      // Tìm kiếm và lọc
      searchTerm: '',
      roleFilter: '',
      accountSearchTerm: '',
      accountRoleFilter: '',
      // Modal xác nhận
      showApproveModal: false,
      selectedRequest: null,
      defaultPassword: '',
      showPassword: false,
      // Thông báo
      notification: {
        show: false,
        message: '',
        type: 'success'
      }
    }
  },
  computed: {
    filteredRequests() {
      return this.pendingRequests.filter(request => {
        const matchSearch = !this.searchTerm || 
          request.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          request.phone.includes(this.searchTerm);
          
        const matchRole = !this.roleFilter || request.role === this.roleFilter;
        
        return matchSearch && matchRole;
      });
    },
    filteredAccounts() {
      return this.approvedAccounts.filter(account => {
        const matchSearch = !this.accountSearchTerm || 
          account.name.toLowerCase().includes(this.accountSearchTerm.toLowerCase()) ||
          account.phone.includes(this.accountSearchTerm);
          
        const matchRole = !this.accountRoleFilter || account.role === this.accountRoleFilter;
        
        return matchSearch && matchRole;
      });
    }
  },
  methods: {
    formatDate(date) {
      return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    },
    approveRequest(request) {
      this.selectedRequest = request;
      this.defaultPassword = this.generatePassword();
      this.showApproveModal = true;
    },
    confirmApprove() {
      // Thêm tài khoản mới vào danh sách đã duyệt
      this.approvedAccounts.push({
        id: `acc${this.approvedAccounts.length + 1}`,
        name: this.selectedRequest.name,
        phone: this.selectedRequest.phone,
        role: this.selectedRequest.role,
        createdDate: new Date(),
        active: true
      });
      
      // Xóa khỏi danh sách yêu cầu
      this.pendingRequests = this.pendingRequests.filter(req => req.id !== this.selectedRequest.id);
      
      // Hiển thị thông báo
      this.showNotification('Tài khoản đã được duyệt và thông tin đã được gửi đến số điện thoại của nhân viên', 'success');
      
      // Đóng modal
      this.closeModal();
    },
    rejectRequest(request) {
      if (confirm(`Bạn có chắc chắn muốn từ chối yêu cầu tài khoản của ${request.name}?`)) {
        this.pendingRequests = this.pendingRequests.filter(req => req.id !== request.id);
        this.showNotification('Yêu cầu tài khoản đã bị từ chối', 'error');
      }
    },
    deactivateAccount(account) {
      if (confirm(`Bạn có chắc chắn muốn khóa tài khoản của ${account.name}?`)) {
        const idx = this.approvedAccounts.findIndex(acc => acc.id === account.id);
        if (idx !== -1) {
          this.approvedAccounts[idx].active = false;
          this.showNotification('Tài khoản đã bị khóa', 'warning');
        }
      }
    },
    activateAccount(account) {
      const idx = this.approvedAccounts.findIndex(acc => acc.id === account.id);
      if (idx !== -1) {
        this.approvedAccounts[idx].active = true;
        this.showNotification('Tài khoản đã được mở khóa', 'success');
      }
    },
    resetPassword(account) {
      const newPassword = this.generatePassword();
      if (confirm(`Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản của ${account.name}?\nMật khẩu mới: ${newPassword}`)) {
        this.showNotification('Mật khẩu đã được đặt lại và gửi tới số điện thoại của nhân viên', 'success');
      }
    },
    createAccount() {
      // Thêm tài khoản mới vào danh sách đã duyệt
      this.approvedAccounts.push({
        id: `acc${this.approvedAccounts.length + 1}`,
        name: this.newAccount.name,
        phone: this.newAccount.phone,
        role: this.newAccount.role,
        email: this.newAccount.email || '',
        notes: this.newAccount.notes || '',
        permissions: { ...this.newAccount.permissions },
        createdDate: new Date(),
        active: true
      });
      
      // Hiển thị thông báo
      this.showNotification('Tài khoản đã được tạo và thông tin đã được gửi đến số điện thoại của nhân viên', 'success');
      
      // Reset form
      this.resetForm();
    },
    resetForm() {
      this.newAccount = {
        name: '',
        phone: '',
        role: '',
        email: '',
        notes: '',
        permissions: {
          manageDrivers: false,
          manageOrders: false,
          viewReports: false
        }
      };
    },
    generatePassword() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    },
    regeneratePassword() {
      this.defaultPassword = this.generatePassword();
    },
    closeModal() {
      this.showApproveModal = false;
      this.selectedRequest = null;
      this.defaultPassword = '';
      this.showPassword = false;
    },
    showNotification(message, type = 'success') {
      this.notification = {
        show: true,
        message,
        type
      };
      
      // Tự động ẩn thông báo sau 3 giây
      setTimeout(() => {
        this.notification.show = false;
      }, 3000);
    },
    logout() {
      if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        // Xử lý đăng xuất
        alert('Đã đăng xuất thành công!');
      }
    }
  }
};
</script>

<style scoped>
/* Reset CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

/* Container */
.container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1e88e5;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: 1px solid white;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Main Content Layout */
.main-content {
  display: flex;
  min-height: calc(100vh - 64px);
}
.content {
  border: 1px solid #ddd;
  margin-top: 10px;
  width: 100%; /* Make content take full width */
}

/* Function Tabs - Horizontal Menu */
.function-tabs {
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
}

.tab-item {
  padding: 1rem 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  position: relative;
  flex: 1;
  text-align: center;
  gap: 0.5rem;
}

.tab-item:hover {
  background-color: #f5f5f5;
}

.tab-item.active {
  background-color: #e3f2fd;
  color: #1e88e5;
  border-bottom: 3px solid #1e88e5;
}

.badge {
  background-color: #f44336;
  color: white;
  border-radius: 10px;
  padding: 0.1rem 0.5rem;
  font-size: 0.8rem;
}

/* Content Area */
.content {
  flex: 1;
  padding: 2rem;
  overflow-x: auto;
}

/* Include Font Awesome (or your preferred icon library) */
/* Example: */
/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" /> */

.tab-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-top: 0;
}

.tab-content h2 {
  margin-bottom: 1.5rem;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
}

.tab-content h2 .count {
  background-color: #007bff;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
  font-size: 0.875rem;
}

/* Style for the icon in the heading */
.tab-content h2 i {
  margin-right: 0.5rem; /* Space between icon and text */
  font-size: 1.25rem; /* Adjust icon size as needed */
  color: #007bff; /* Icon color */
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.filter-bar .search {
  display: flex;
  align-items: center; /* Vertically align icon and input */
}

.filter-bar .search i {
  margin-right: 0.5rem; /* Space between icon and input */
  color: #6c757d; /* Icon color */
}

.filter-bar .search input {
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  width: 250px;
  font-size: 1rem;
}

.filter-bar .filter select {
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  font-size: 1rem;
}

.table-container {
  overflow-x: auto;
}

.table-container table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.table-container th,
.table-container td {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  text-align: left;
}

.table-container th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

/* Style for icons in table header */
.table-container th i {
  margin-left: 0.25rem; /* Space between text and icon */
  font-size: 0.9rem; /* Adjust icon size as needed */
  color: #495057; /* Icon color */
}

.table-container tbody tr:hover {
  background-color: #f1f3f5;
}

.tag {
  display: inline-block;
  padding: 0.4rem 0.6rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
}

.tag.manager {
  background-color: #17a2b8;
}

.tag.driver {
  background-color: #28a745;
}

.actions {
  text-align: center;
}

/* Style for icons in action buttons */
.actions button i {
  margin-right: 0.25rem; /* Space between text and icon */
  font-size: 0.9rem; /* Adjust icon size as needed */
}

.btn-approve,
.btn-reject {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: opacity 0.2s ease-in-out;
  display: inline-flex; /* Use flexbox to align icon and text */
  align-items: center; /* Vertically center icon and text */
  justify-content: center; /* Center content horizontally */
}

.btn-approve {
  background-color: #28a745;
  color: white;
  margin-right: 0.5rem;
}

.btn-reject {
  background-color: #dc3545;
  color: white;
}

.btn-approve:hover,
.btn-reject:hover {
  opacity: 0.8;
}

.empty-state {
  padding: 2rem;
  text-align: center;
  color: #6c757d;
  font-style: italic;
}
.count {
  font-weight: normal;
  color: #666;
  margin-left: 0.5rem;
  font-size: 0.9rem;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.search {
  flex: 1;
  margin-right: 1rem;
}

.search input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

.filter select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  min-width: 150px;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 500;
  color: #555;
  background-color: #f9f9f9;
}

td .tag {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

td .tag.manager {
  background-color: #e3f2fd;
  color: #1e88e5;
}

td .tag.driver {
  background-color: #e8f5e9;
  color: #43a047;
}

td .status {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

td .status.active {
  background-color: #e8f5e9;
  color: #43a047;
}

td .status.inactive {
  background-color: #ffebee;
  color: #e53935;
}

td.actions {
  display: flex;
  gap: 0.5rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

/* Button Styles */
button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  border: none;
  transition: all 0.3s;
}

.btn-approve {
  background-color: #1e88e5;
  color: white;
}

.btn-approve:hover {
  background-color: #1976d2;
}

.btn-reject {
  background-color: #f44336;
  color: white;
}

.btn-reject:hover {
  background-color: #e53935;
}

.btn-deactivate {
  background-color: #ff9800;
  color: white;
}

.btn-deactivate:hover {
  background-color: #f57c00;
}

.btn-activate {
  background-color: #43a047;
  color: white;
}

.btn-activate:hover {
  background-color: #388e3c;
}

.btn-reset {
  background-color: #9e9e9e;
  color: white;
}

.btn-reset:hover {
  background-color: #757575;
}

/* Form Styles */
.create-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #333;
}

.btn-cancel:hover {
  background-color: #e0e0e0;
}

.btn-submit {
  background-color: #1e88e5;
  color: white;
}

.btn-submit:hover {
  background-color: #1976d2;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
}

.modal-content h3 {
  margin-bottom: 1rem;
  color: #333;
}

.password-field {
  display: flex;
  gap: 0.5rem;
}

.password-field input {
  flex: 1;
}

.btn-regenerate {
  background-color: #9e9e9e;
  color: white;
}

.btn-show {
  background-color: #f5f5f5;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-confirm {
  background-color: #43a047;
  color: white;
}

.btn-confirm:hover {
  background-color: #388e3c;
}

/* Toast Notification */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 4px;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: slide-in 0.3s ease-out forwards;
  z-index: 2000;
  max-width: 350px;
}

.toast.success {
  background-color: #43a047;
}

.toast.error {
  background-color: #e53935;
}

.toast.warning {
  background-color: #ff9800;
}

.toast.info {
  background-color: #1e88e5;
}

.toast-content {
  display: flex;
  align-items: center;
}

.toast-message {
  margin-left: 0.5rem;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media screen and (max-width: 992px) {
  .main-content {
    flex-direction: column;
  }
  
  .function-tabs {
    flex-wrap: wrap;
  }
  
  .tab-item {
    padding: 0.75rem 1rem;
    white-space: nowrap;
  }
  
  .content {
    padding: 1rem;
  }
}

@media screen and (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
  }
  
  .search {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .tab-content {
    padding: 1rem;
  }
  
  td.actions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .toast {
    max-width: 90%;
    left: 5%;
    right: 5%;
  }
  .tab-item {
  padding: 10px 15px;
  cursor: pointer;
  border: 1px solid #ccc;
  margin-right: 5px;
  display: flex; /* Align icon and text */
  align-items: center; /* Vertically center items */
}

.tab-item i {
  margin-right: 5px; /* Space between icon and text */
}

.tab-item.active {
  background-color: #eee;
}
}
</style>