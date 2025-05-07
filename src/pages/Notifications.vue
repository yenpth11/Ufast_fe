<template>
    <div class="employee-management">
      <div class="main-container">
        <nav class="horizontal-nav">
          <ul>
            <li :class="{ active: currentView === 'employees' }">
              <a @click.prevent="changeView('employees')">
                <i class="fas fa-users"></i> Danh sách nhân viên
              </a>
            </li>
            <li :class="{ active: currentView === 'managers' }">
              <a @click.prevent="changeView('managers')">
                <i class="fas fa-user-tie"></i> Nhân viên quản lý
              </a>
            </li>
  <li :class="{ active: currentView === 'drivers' }">
    <a @click.prevent="changeView('drivers')">
      <i class="fas fa-motorcycle"></i> Tài xế
    </a>
  </li>
          </ul>
        </nav>
  
        <main class="content">

    <!-- Create Account Modal -->
    <div v-if="showAccountModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isAccountEditMode ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản mới' }}</h3>
          <button @click="closeAccountModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveAccount">
            <div class="employee-info">
              <div class="employee-avatar">
                <img :src="currentEmployee.avatar || '/img/default-avatar.png'" :alt="currentEmployee.name">
              </div>
              <div class="employee-details">
                <h4>{{ currentEmployee.name }}</h4>
                <p class="role">{{ getRoleName(currentEmployee.role) }}</p>
                <p class="department">{{ getDepartmentName(currentEmployee.departmentId) }}</p>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="username">Tên đăng nhập</label>
                <input 
                  type="text" 
                  id="username" 
                  v-model="accountForm.username" 
                  required
                  :disabled="isAccountEditMode"
                >
                <small v-if="!isAccountEditMode">Tên đăng nhập sẽ được tạo tự động từ email hoặc tên nhân viên</small>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="accountForm.email" 
                  required
                >
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="password">Mật khẩu</label>
                <div class="password-input">
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    id="password" 
                    v-model="accountForm.password" 
                    required
                  >
                  <button 
                    type="button" 
                    class="toggle-password" 
                    @click="showPassword = !showPassword"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <small v-if="!isAccountEditMode">Hệ thống sẽ tạo một mật khẩu ngẫu nhiên</small>
              </div>
              <div class="form-group">
                <label for="role">Vai trò hệ thống</label>
                <select id="role" v-model="accountForm.systemRole" required>
                  <option v-if="currentEmployee.role === 'manager'" value="admin">Quản trị viên</option>
                  <option v-if="currentEmployee.role === 'manager'" value="manager">Nhân viên quản lý</option>
                  <option v-if="currentEmployee.role === 'driver'" value="driver">Tài xế</option>
                  <option value="user">Người dùng thông thường</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="notificationMethod">Phương thức gửi thông tin</label>
                <select id="notificationMethod" v-model="accountForm.notificationMethod" required>
                  <option value="sms">SMS (tin nhắn)</option>
                  <option value="email">Email</option>
                  <option value="both">Cả SMS và Email</option>
                </select>
              </div>
              <div class="form-group">
                <label for="accountStatus">Trạng thái tài khoản</label>
                <select id="accountStatus" v-model="accountForm.status" required>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm khóa</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="phoneNumber">Số điện thoại xác thực</label>
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  v-model="accountForm.phone" 
                  :required="accountForm.notificationMethod !== 'email'"
                >
                <small v-if="!currentEmployee.phone && accountForm.notificationMethod !== 'email'" class="text-danger">
                  * Nhân viên chưa cập nhật số điện thoại
                </small>
              </div>
              <div class="form-group">
                <label>Thông tin bổ sung</label>
                <div class="checkbox-group">
                  <label>
                    <input type="checkbox" v-model="accountForm.requirePasswordChange">
                    Yêu cầu đổi mật khẩu khi đăng nhập lần đầu
                  </label>
                </div>
                <div class="checkbox-group">
                  <label>
                    <input type="checkbox" v-model="accountForm.enableTwoFactor">
                    Bật xác thực hai yếu tố
                  </label>
                </div>
              </div>
            </div>

            <div class="notification-preview">
              <h4>Xem trước thông báo</h4>
              <div class="preview-container">
                <div v-if="accountForm.notificationMethod !== 'email'" class="sms-preview">
                  <div class="preview-header">
                    <i class="fas fa-sms"></i> SMS
                  </div>
                  <div class="preview-content">
                    <p>Kính gửi {{ currentEmployee.name }},</p>
                    <p>Tài khoản của bạn đã được tạo trên hệ thống Quản lý nhân viên.</p>
                    <p>Tên đăng nhập: {{ accountForm.username }}</p>
                    <p>Mật khẩu: {{ accountForm.password }}</p>
                    <p>Truy cập hệ thống tại: https://quanlynhanvien.example.com</p>
                  </div>
                </div>
                <div v-if="accountForm.notificationMethod !== 'sms'" class="email-preview">
                  <div class="preview-header">
                    <i class="fas fa-envelope"></i> Email
                  </div>
                  <div class="preview-content">
                    <h5>Thông tin tài khoản hệ thống Quản lý nhân viên</h5>
                    <p>Kính gửi {{ currentEmployee.name }},</p>
                    <p>Chúng tôi xin thông báo tài khoản của bạn đã được tạo thành công trên hệ thống Quản lý nhân viên.</p>
                    <p><strong>Thông tin đăng nhập:</strong></p>
                    <ul>
                      <li>Tên đăng nhập: <strong>{{ accountForm.username }}</strong></li>
                      <li>Mật khẩu: <strong>{{ accountForm.password }}</strong></li>
                      <li>URL đăng nhập: <a href="#">https://quanlynhanvien.example.com</a></li>
                    </ul>
                    <p v-if="accountForm.requirePasswordChange"><strong>Lưu ý:</strong> Bạn sẽ được yêu cầu đổi mật khẩu khi đăng nhập lần đầu.</p>
                    <p>Vui lòng liên hệ với quản trị viên nếu bạn cần hỗ trợ.</p>
                    <p>Trân trọng,<br>Ban Quản lý hệ thống</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="closeAccountModal" class="btn btn-secondary">Hủy</button>
              <button type="submit" class="btn btn-primary">
                {{ isAccountEditMode ? 'Cập nhật tài khoản' : 'Tạo và gửi thông tin' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Bulk Account Creation Modal -->
    <div v-if="showBulkAccountModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Tạo tài khoản hàng loạt</h3>
          <button @click="closeBulkAccountModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="bulk-settings">
            <h4>Cài đặt tài khoản</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label>Loại nhân viên</label>
                <div class="checkbox-group">
                  <label>
                    <input type="checkbox" v-model="bulkSettings.includeManagers">
                    Nhân viên quản lý
                  </label>
                </div>
                <div class="checkbox-group">
                  <label>
                    <input type="checkbox" v-model="bulkSettings.includeDrivers">
                    Tài xế
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label for="bulkNotificationMethod">Phương thức gửi thông tin</label>
                <select id="bulkNotificationMethod" v-model="bulkSettings.notificationMethod" required>
                  <option value="sms">SMS (tin nhắn)</option>
                  <option value="email">Email</option>
                  <option value="both">Cả SMS và Email</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Cài đặt bảo mật</label>
                <div class="checkbox-group">
                  <label>
                    <input type="checkbox" v-model="bulkSettings.requirePasswordChange">
                    Yêu cầu đổi mật khẩu khi đăng nhập lần đầu
                  </label>
                </div>
                <div class="checkbox-group">
                  <label>
                    <input type="checkbox" v-model="bulkSettings.enableTwoFactor">
                    Bật xác thực hai yếu tố
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label for="bulkPasswordLength">Độ dài mật khẩu</label>
                <select id="bulkPasswordLength" v-model="bulkSettings.passwordLength">
                  <option value="8">8 ký tự</option>
                  <option value="10">10 ký tự</option>
                  <option value="12">12 ký tự</option>
                  <option value="16">16 ký tự</option>
                </select>
              </div>
            </div>
          </div>

          <div class="employee-selection">
            <h4>Danh sách nhân viên ({{ eligibleEmployeesCount }} nhân viên hợp lệ)</h4>
            <p class="info-text">Chỉ hiển thị các nhân viên chưa có tài khoản và có thông tin liên hệ hợp lệ.</p>
            
            <div class="selection-controls">
              <button @click="selectAllEligible" class="btn btn-sm btn-outline">Chọn tất cả</button>
              <button @click="deselectAll" class="btn btn-sm btn-outline">Bỏ chọn tất cả</button>
            </div>

            <div class="employees-list">
              <div v-for="employee in eligibleEmployees" :key="employee.id" class="employee-item">
                <label class="employee-checkbox">
                  <input type="checkbox" v-model="selectedBulkEmployees" :value="employee.id">
                  <div class="employee-list-info">
                    <div class="employee-name">{{ employee.name }}</div>
                    <div class="employee-meta">
                      <span :class="'role-badge-sm ' + employee.role">{{ getRoleName(employee.role) }}</span>
                      <span class="department-name">{{ getDepartmentName(employee.departmentId) }}</span>
                    </div>
                    <div class="employee-contact">
                      <span v-if="employee.email"><i class="fas fa-envelope"></i> {{ employee.email }}</span>
                      <span v-if="employee.phone"><i class="fas fa-phone"></i> {{ employee.phone }}</span>
                    </div>
                  </div>
                </label>
              </div>
              <div v-if="eligibleEmployees.length === 0" class="no-employees">
                Không có nhân viên hợp lệ để tạo tài khoản
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeBulkAccountModal" class="btn btn-secondary">Hủy</button>
            <button 
              @click="createBulkAccounts" 
              class="btn btn-primary"
              :disabled="selectedBulkEmployees.length === 0"
            >
              Tạo {{ selectedBulkEmployees.length }} tài khoản
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmationModal" class="modal">
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h3>{{ confirmationTitle }}</h3>
          <button @click="closeConfirmationModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p>{{ confirmationMessage }}</p>
          <div class="form-actions">
            <button @click="closeConfirmationModal" class="btn btn-secondary">Hủy</button>
            <button @click="confirmAction" class="btn" :class="confirmationButtonClass">{{ confirmationButtonText }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Result Modal -->
    <div v-if="showResultModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Kết quả thao tác</h3>
          <button @click="closeResultModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="result-summary">
            <div class="result-icon" :class="{'success': resultSuccess, 'error': !resultSuccess}">
              <i :class="resultSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
            </div>
            <div class="result-message">{{ resultMessage }}</div>
          </div>

          <div v-if="bulkCreationResults.length > 0" class="bulk-results">
            <h4>Chi tiết kết quả</h4>
            <table class="result-table">
              <thead>
                <tr>
                  <th>Nhân viên</th>
                  <th>Tên đăng nhập</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(result, index) in bulkCreationResults" :key="index">
                  <td>{{ result.employeeName }}</td>
                  <td>{{ result.username }}</td>
                  <td :class="{'text-success': result.success, 'text-danger': !result.success}">
                    <i :class="result.success ? 'fas fa-check' : 'fas fa-times'"></i>
                    {{ result.message }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="form-actions">
            <button @click="closeResultModal" class="btn btn-primary">Đóng</button>
          </div>
        </div>
      </div>
    </div>


          <!-- Dashboard View -->
          <div v-if="currentView === 'dashboard'" class="dashboard">
            <h2>Tổng quan</h2>
            <div class="stats-container">
              <div class="stat-card">
                <h3>Tổng nhân viên</h3>
                <div class="stat-value">{{ totalEmployees }}</div>
              </div>
              <div class="stat-card">
                <h3>Nhân viên quản lý</h3>
                <div class="stat-value">{{ managers.length }}</div>
              </div>
              <div class="stat-card">
                <h3>Tài xế</h3>
                <div class="stat-value">{{ drivers.length }}</div>
              </div>
              <div class="stat-card">
                <h3>Nhân viên mới (tháng này)</h3>
                <div class="stat-value">{{ newEmployeesThisMonth }}</div>
              </div>
            </div>
  
            <div class="recent-activities">
              <h3>Hoạt động gần đây</h3>
              <ul class="activity-list">
                <li v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
                  <span class="activity-time">{{ activity.time }}</span>
                  <span class="activity-description">{{ activity.description }}</span>
                </li>
              </ul>
            </div>
          </div>
  
          <!-- All Employees View -->
          <div v-if="currentView === 'employees'" class="employees-view">
            <div class="view-header">
              <h2>Danh sách nhân viên</h2>
              <div class="actions">
                <div class="search-bar">
                  <input type="text" v-model="searchQuery" placeholder="Tìm kiếm nhân viên...">
                </div>
                <button @click="openAddEmployeeModal" class="btn btn-primary">
                  <i class="fas fa-plus"></i> Thêm nhân viên
                </button>
              </div>
            </div>
  
            <div class="filters">
              <select v-model="departmentFilter">
                <option value="">Tất cả phòng ban</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
              </select>
              <select v-model="roleFilter">
                <option value="">Tất cả vị trí</option>
                <option value="manager">Nhân viên quản lý</option>
                <option value="driver">Tài xế</option>
                <option value="staff">Nhân viên khác</option>
              </select>
              <select v-model="statusFilter">
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang làm việc</option>
                <option value="inactive">Nghỉ việc</option>
                <option value="onleave">Đang nghỉ phép</option>
              </select>
            </div>
  
            <table class="employees-table">
              <thead>
                <tr>
                  <th @click="sortBy('id')">
                    Mã NV
                    <i :class="getSortIcon('id')"></i>
                  </th>
                  <th @click="sortBy('name')">
                    Họ tên
                    <i :class="getSortIcon('name')"></i>
                  </th>
                  <th @click="sortBy('role')">
                    Vị trí
                    <i :class="getSortIcon('role')"></i>
                  </th>
                  <th @click="sortBy('department')">
                    Phòng ban
                    <i :class="getSortIcon('department')"></i>
                  </th>
                  <th @click="sortBy('joinDate')">
                    Ngày vào làm
                    <i :class="getSortIcon('joinDate')"></i>
                  </th>
                  <th @click="sortBy('status')">
                    Trạng thái
                    <i :class="getSortIcon('status')"></i>
                  </th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="employee in filteredEmployees" :key="employee.id">
                  <td>{{ employee.id }}</td>
                  <td>{{ employee.name }}</td>
                  <td>
                    <span :class="'role-badge ' + employee.role">
                      {{ getRoleName(employee.role) }}
                    </span>
                  </td>
                  <td>{{ getDepartmentName(employee.departmentId) }}</td>
                  <td>{{ formatDate(employee.joinDate) }}</td>
                  <td>
                    <span :class="'status-badge ' + employee.status">
                      {{ getStatusName(employee.status) }}
                    </span>
                  </td>
                  <td class="actions">
                    <button @click="viewEmployeeDetails(employee)" class="btn-icon" title="Xem chi tiết">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="editEmployee(employee)" class="btn-icon" title="Sửa">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="confirmDeleteEmployee(employee)" class="btn-icon delete" title="Xóa">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredEmployees.length === 0">
                  <td colspan="7" class="no-data">Không tìm thấy nhân viên nào</td>
                </tr>
              </tbody>
            </table>
  
            <div class="pagination">
              <button @click="prevPage" :disabled="currentPage === 1" class="btn-page">
                <i class="fas fa-chevron-left"></i>
              </button>
              <span>Trang {{ currentPage }} / {{ totalPages }}</span>
              <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-page">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
  
          <!-- Managers View -->
          <div v-if="currentView === 'managers'" class="managers-view">
            <div class="view-header">
              <h2>Nhân viên quản lý</h2>
              <div class="actions">
                <div class="search-bar">
                  <input type="text" v-model="managerSearchQuery" placeholder="Tìm kiếm quản lý...">
                </div>
                <button @click="openAddManagerModal" class="btn btn-primary">
                  <i class="fas fa-plus"></i> Thêm quản lý
                </button>
              </div>
            </div>
  
            <div class="manager-cards">
              <div v-for="manager in filteredManagers" :key="manager.id" class="manager-card">
                <div class="manager-avatar">
                  <img :src="manager.avatar || '/img/default-avatar.png'" :alt="manager.name">
                </div>
                <div class="manager-info">
                  <h3>{{ manager.name }}</h3>
                  <p class="manager-title">{{ manager.title }}</p>
                  <p class="manager-department">{{ getDepartmentName(manager.departmentId) }}</p>
                  <div class="manager-contacts">
                    <div class="contact-item">
                      <i class="fas fa-envelope"></i> {{ manager.email }}
                    </div>
                    <div class="contact-item">
                      <i class="fas fa-phone"></i> {{ manager.phone }}
                    </div>
                  </div>
                  <div class="manager-stats">
                    <div class="stat">
                      <span class="stat-label">Nhân viên quản lý:</span>
                      <span class="stat-value">{{ manager.subordinatesCount }}</span>
                    </div>
                    <div class="stat">
                      <span class="stat-label">Dự án hiện tại:</span>
                      <span class="stat-value">{{ manager.currentProjects }}</span>
                    </div>
                  </div>
                </div>
                <div class="manager-actions">
                  <button @click="viewManagerDetails(manager)" class="btn-icon" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="editManager(manager)" class="btn-icon" title="Sửa">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="confirmDeleteManager(manager)" class="btn-icon delete" title="Xóa">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Drivers View -->
          <div v-if="currentView === 'drivers'" class="drivers-view">
            <div class="view-header">
              <h2>Tài xế</h2>
              <div class="actions">
                <div class="search-bar">
                  <input type="text" v-model="driverSearchQuery" placeholder="Tìm kiếm tài xế...">
                </div>
                <button @click="openAddDriverModal" class="btn btn-primary">
                  <i class="fas fa-plus"></i> Thêm tài xế
                </button>
              </div>
            </div>
  
            <table class="drivers-table">
              <thead>
                <tr>
                  <th @click="sortDriversBy('id')">
                    Mã tài xế
                    <i :class="getDriversSortIcon('id')"></i>
                  </th>
                  <th @click="sortDriversBy('name')">
                    Họ tên
                    <i :class="getDriversSortIcon('name')"></i>
                  </th>
                  <th @click="sortDriversBy('licenseType')">
                    Loại bằng lái
                    <i :class="getDriversSortIcon('licenseType')"></i>
                  </th>
                  <th @click="sortDriversBy('licenseExpiry')">
                    Hạn bằng lái
                    <i :class="getDriversSortIcon('licenseExpiry')"></i>
                  </th>
                  <th @click="sortDriversBy('vehicleAssigned')">
                    Phương tiện
                    <i :class="getDriversSortIcon('vehicleAssigned')"></i>
                  </th>
                  <th @click="sortDriversBy('status')">
                    Trạng thái
                    <i :class="getDriversSortIcon('status')"></i>
                  </th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="driver in filteredDrivers" :key="driver.id">
                  <td>{{ driver.id }}</td>
                  <td>{{ driver.name }}</td>
                  <td>{{ driver.licenseType }}</td>
                  <td :class="{ 'expiring-soon': isLicenseExpiringSoon(driver.licenseExpiry) }">
                    {{ formatDate(driver.licenseExpiry) }}
                  </td>
                  <td>{{ driver.vehicleAssigned || 'Chưa phân công' }}</td>
                  <td>
                    <span :class="'status-badge ' + driver.status">
                      {{ getDriverStatusName(driver.status) }}
                    </span>
                  </td>
                  <td class="actions">
                    <button @click="viewDriverDetails(driver)" class="btn-icon" title="Xem chi tiết">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button @click="editDriver(driver)" class="btn-icon" title="Sửa">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="assignVehicle(driver)" class="btn-icon" title="Phân công xe">
                      <i class="fas fa-car"></i>
                    </button>
                    <button @click="confirmDeleteDriver(driver)" class="btn-icon delete" title="Xóa">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredDrivers.length === 0">
                  <td colspan="7" class="no-data">Không tìm thấy tài xế nào</td>
                </tr>
              </tbody>
            </table>
          </div>
  
      <!-- Employee Detail Modal -->
      <div v-if="showEmployeeModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>{{ isEditMode ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới' }}</h3>
            <button @click="closeModal" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveEmployee">
              <div class="form-row">
                <div class="form-group">
                  <label for="employeeName">Họ tên</label>
                  <input type="text" id="employeeName" v-model="employeeForm.name" required>
                </div>
                <div class="form-group">
                  <label for="employeeEmail">Email</label>
                  <input type="email" id="employeeEmail" v-model="employeeForm.email" required>
                </div>
              </div>
  
              <div class="form-row">
                <div class="form-group">
                  <label for="employeePhone">Số điện thoại</label>
                  <input type="tel" id="employeePhone" v-model="employeeForm.phone">
                </div>
                <div class="form-group">
                  <label for="employeeBirthday">Ngày sinh</label>
                  <input type="date" id="employeeBirthday" v-model="employeeForm.birthday">
                </div>
              </div>
  
              <div class="form-row">
                <div class="form-group">
                  <label for="employeeRole">Vị trí</label>
                  <select id="employeeRole" v-model="employeeForm.role" required>
                    <option value="manager">Nhân viên quản lý</option>
                    <option value="driver">Tài xế</option>
                    <option value="staff">Nhân viên khác</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="employeeDepartment">Phòng ban</label>
                  <select id="employeeDepartment" v-model="employeeForm.departmentId" required>
                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">{{ dept.name }}</option>
                  </select>
                </div>
              </div>
  
              <div class="form-row">
                <div class="form-group">
                  <label for="employeeJoinDate">Ngày vào làm</label>
                  <input type="date" id="employeeJoinDate" v-model="employeeForm.joinDate" required>
                </div>
                <div class="form-group">
                  <label for="employeeStatus">Trạng thái</label>
                  <select id="employeeStatus" v-model="employeeForm.status" required>
                    <option value="active">Đang làm việc</option>
                    <option value="inactive">Nghỉ việc</option>
                    <option value="onleave">Đang nghỉ phép</option>
                  </select>
                </div>
              </div>
  
              <!-- Trường thông tin đặc thù cho quản lý -->
              <div v-if="employeeForm.role === 'manager'" class="role-specific-fields">
                <h4>Thông tin quản lý</h4>
                <div class="form-row">
                  <div class="form-group">
                    <label for="managerTitle">Chức danh</label>
                    <input type="text" id="managerTitle" v-model="employeeForm.managerInfo.title">
                  </div>
                  <div class="form-group">
                    <label for="managerLevel">Cấp bậc</label>
                    <select id="managerLevel" v-model="employeeForm.managerInfo.level">
                      <option value="junior">Cấp thấp</option>
                      <option value="middle">Cấp trung</option>
                      <option value="senior">Cấp cao</option>
                    </select>
                  </div>
                </div>
              </div>
  
              <!-- Trường thông tin đặc thù cho tài xế -->
              <div v-if="employeeForm.role === 'driver'" class="role-specific-fields">
                <h4>Thông tin tài xế</h4>
                <div class="form-row">
                  <div class="form-group">
                    <label for="driverLicenseNumber">Số bằng lái</label>
                    <input type="text" id="driverLicenseNumber" v-model="employeeForm.driverInfo.licenseNumber">
                  </div>
                  <div class="form-group">
                    <label for="driverLicenseType">Loại bằng lái</label>
                    <select id="driverLicenseType" v-model="employeeForm.driverInfo.licenseType">
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                      <option value="E">E</option>
                      <option value="F">F</option>
                    </select>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="driverLicenseExpiry">Hạn bằng lái</label>
                    <input type="date" id="driverLicenseExpiry" v-model="employeeForm.driverInfo.licenseExpiry">
                  </div>
                  <div class="form-group">
                    <label for="driverVehicle">Phương tiện đang sử dụng</label>
                    <select id="driverVehicle" v-model="employeeForm.driverInfo.vehicleAssigned">
                      <option value="">Chưa phân công</option>
                      <option v-for="vehicle in availableVehicles" :key="vehicle.id" :value="vehicle.id">
                        {{ vehicle.name }} ({{ vehicle.licensePlate }})
                      </option>
                    </select>
                  </div>
                </div>
              </div>
  
              <div class="form-actions">
                <button type="button" @click="closeModal" class="btn btn-secondary">Hủy</button>
                <button type="submit" class="btn btn-primary">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <!-- Confirm Delete Modal -->
      <div v-if="showConfirmDeleteModal" class="modal">
        <div class="modal-content modal-sm">
          <div class="modal-header">
            <h3>Xác nhận xóa</h3>
            <button @click="closeConfirmDeleteModal" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <p>Bạn có chắc chắn muốn xóa nhân viên <strong>{{ employeeToDelete.name }}</strong>?</p>
            <p class="text-danger">Hành động này không thể hoàn tác.</p>
            <div class="form-actions">
              <button @click="closeConfirmDeleteModal" class="btn btn-secondary">Hủy</button>
              <button @click="deleteEmployee" class="btn btn-danger">Xóa</button>
            </div>
          </div>
        </div>
      </div>
    </main>    
    </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EmployeeManagement',
    data() {
      return {
        currentUser: {
          id: 'admin1',
          name: 'Nguyễn Văn Admin',
          role: 'admin'
        },
        currentView: 'dashboard',
        searchQuery: '',
        managerSearchQuery: '',
        driverSearchQuery: '',
        departmentFilter: '',
        roleFilter: '',
        statusFilter: '',
        currentPage: 1,
        itemsPerPage: 10,
        sortKey: 'id',
        sortOrder: 'asc',
        driversSortKey: 'id',
        driversSortOrder: 'asc',
  
        // Modals
        showEmployeeModal: false,
        showConfirmDeleteModal: false,
        isEditMode: false,
        employeeToDelete: null,
  
        // Form data
        employeeForm: {
          id: null,
          name: '',
          email: '',
          phone: '',
          birthday: '',
          role: 'staff',
          departmentId: 1,
          joinDate: '',
          status: 'active',
          managerInfo: {
            title: '',
            level: 'middle',
          },
          driverInfo: {
            licenseNumber: '',
            licenseType: 'B2',
            licenseExpiry: '',
            vehicleAssigned: ''
          }
        },
  
        // Sample data
        employees: [
          {
            id: 'NV001',
            name: 'Trần Văn A',
            email: 'tranvana@company.com',
            phone: '0901234567',
            birthday: '1985-05-15',
            role: 'manager',
            departmentId: 1,
            joinDate: '2018-03-10',
            status: 'active',
            managerInfo: {
              title: 'Trưởng phòng Nhân sự',
              level: 'senior',
              subordinatesCount: 12,
              currentProjects: 3
            }
          },
          {
            id: 'NV002',
            name: 'Nguyễn Thị B',
            email: 'nguyenthib@company.com',
            phone: '0912345678',
            birthday: '1990-08-22',
            role: 'manager',
            departmentId: 2,
            joinDate: '2019-04-15',
            status: 'active',
            managerInfo: {
              title: 'Trưởng phòng Kinh doanh',
              level: 'middle',
              subordinatesCount: 8,
              currentProjects: 2
            }
          },
          {
            id: 'TX001',
            name: 'Lê Văn C',
            email: 'levanc@company.com',
            phone: '0923456789',
            birthday: '1992-11-30',
            role: 'driver',
            departmentId: 3,
            joinDate: '2020-07-05',
            status: 'active',
            driverInfo: {
              licenseNumber: 'DL12345',
              licenseType: 'B2',
              licenseExpiry: '2025-11-30',
              vehicleAssigned: 'Toyota Innova - 51F-12345'
            }
          },
          {
            id: 'TX002',
            name: 'Phạm Văn D',
            email: 'phamvand@company.com',
            phone: '0934567890',
            birthday: '1988-02-25',
            role: 'driver',
            departmentId: 3,
            joinDate: '2021-01-10',
            status: 'onleave',
            driverInfo: {
              licenseNumber: 'DL67890',
              licenseType: 'C',
              licenseExpiry: '2024-08-15',
              vehicleAssigned: 'Ford Transit - 51F-67890'
            }
          },
          {
            id: 'NV003',
            name: 'Võ Thị E',
            email: 'vothie@company.com',
            phone: '0945678901',
            birthday: '1995-07-08',
            role: 'staff',
            departmentId: 1,
            joinDate: '2022-05-20',
            status: 'active'
          }
        ],
  
        departments: [
          { id: 1, name: 'Phòng Nhân sự' },
          { id: 2, name: 'Phòng Kinh doanh' },
          { id: 3, name: 'Phòng Vận chuyển' },
          { id: 4, name: 'Phòng Tài chính' },
          { id: 5, name: 'Phòng Kỹ thuật' }
        ],
  
        availableVehicles: [
          { id: 'Toyota Innova - 51F-12345', name: 'Toyota Innova', licensePlate: '51F-12345' },
          { id: 'Ford Transit - 51F-67890', name: 'Ford Transit', licensePlate: '51F-67890' },
          { id: 'Honda Civic - 51F-24680', name: 'Honda Civic', licensePlate: '51F-24680' },
          { id: 'Toyota Fortuner - 51F-13579', name: 'Toyota Fortuner', licensePlate: '51F-13579' }
        ],
  
        recentActivities: [
          { time: '10:30 AM, 06/05/2025', description: 'Nguyễn Thị B đã cập nhật thông tin cá nhân' },
          { time: '09:15 AM, 06/05/2025', description: 'Lê Văn C đã được phân công xe mới' },
          { time: '08:45 AM, 06/05/2025', description: 'Phạm Văn D đã đăng ký nghỉ phép' },
          { time: '04:30 PM, 05/05/2025', description: 'Trần Văn A đã thêm nhân viên mới: Võ Thị E' },
          { time: '02:15 PM, 05/05/2025', description: 'Nguyễn Thị B đã tạo dự án mới' }
        ]
      };
    },
    computed: {
      // Lọc danh sách nhân viên
      filteredEmployees() {
        let result = [...this.employees];
  
        // Áp dụng tìm kiếm
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          result = result.filter(emp => 
            emp.name.toLowerCase().includes(query) || 
            emp.id.toLowerCase().includes(query) ||
            emp.email.toLowerCase().includes(query)
          );
        }
  
        // Áp dụng lọc phòng ban
        if (this.departmentFilter) {
          result = result.filter(emp => emp.departmentId === parseInt(this.departmentFilter));
        }
  
        // Áp dụng lọc vị trí
        if (this.roleFilter) {
          result = result.filter(emp => emp.role === this.roleFilter);
        }
  
        // Áp dụng lọc trạng thái
        if (this.statusFilter) {
          result = result.filter(emp => emp.status === this.statusFilter);
        }
  
        // Sắp xếp
        result.sort((a, b) => {
          let valA = a[this.sortKey];
          let valB = b[this.sortKey];
          
          if (this.sortKey === 'department') {
            valA = this.getDepartmentName(a.departmentId);
            valB = this.getDepartmentName(b.departmentId);
          }
          
          if (typeof valA === 'string') {
            if (this.sortOrder === 'asc') {
              return valA.localeCompare(valB);
            } else {
              return valB.localeCompare(valA);
            }
          } else {
            if (this.sortOrder === 'asc') {
              return valA - valB;
            } else {
              return valB - valA;
            }
          }
        });
  
        // Phân trang
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const paginatedItems = result.slice(startIndex, startIndex + this.itemsPerPage);
        
        return paginatedItems;
      },
  
      totalPages() {
        const filteredCount = this.filteredEmployees.length;
        return Math.ceil(filteredCount / this.itemsPerPage) || 1;
      },
  
      // Lấy danh sách quản lý
      managers() {
        return this.employees.filter(emp => emp.role === 'manager');
      },
  
      // Lọc danh sách quản lý theo tìm kiếm
      filteredManagers() {
        if (!this.managerSearchQuery) {
          return this.managers;
        }
        
        const query = this.managerSearchQuery.toLowerCase();
        return this.managers.filter(manager => 
          manager.name.toLowerCase().includes(query) || 
          manager.id.toLowerCase().includes(query) ||
          manager.email.toLowerCase().includes(query) ||
          (manager.managerInfo && manager.managerInfo.title.toLowerCase().includes(query))
        );
      },
  
      // Lấy danh sách tài xế
      drivers() {
        return this.employees.filter(emp => emp.role === 'driver');
      },
  
      // Lọc danh sách tài xế theo tìm kiếm
      filteredDrivers() {
        let result = [...this.drivers];
        
        if (this.driverSearchQuery) {
          const query = this.driverSearchQuery.toLowerCase();
          result = result.filter(driver => 
            driver.name.toLowerCase().includes(query) || 
            driver.id.toLowerCase().includes(query) ||
            driver.email.toLowerCase().includes(query) ||
            (driver.driverInfo && driver.driverInfo.licenseNumber.toLowerCase().includes(query))
          );
        }
  
        // Sắp xếp tài xế
        result.sort((a, b) => {
          let valA, valB;
          
          if (this.driversSortKey === 'licenseType') {
            valA = a.driverInfo?.licenseType;
            valB = b.driverInfo?.licenseType;
          } else if (this.driversSortKey === 'licenseExpiry') {
            valA = a.driverInfo?.licenseExpiry;
            valB = b.driverInfo?.licenseExpiry;
          } else if (this.driversSortKey === 'vehicleAssigned') {
            valA = a.driverInfo?.vehicleAssigned || '';
            valB = b.driverInfo?.vehicleAssigned || '';
          } else {
            valA = a[this.driversSortKey];
            valB = b[this.driversSortKey];
          }
          
          if (typeof valA === 'string') {
            if (this.driversSortOrder === 'asc') {
              return valA.localeCompare(valB);
            } else {
              return valB.localeCompare(valA);
            }
          } else {
            if (this.driversSortOrder === 'asc') {
              return valA - valB;
            } else {
              return valB - valA;
            }
          }
        });
        
        return result;
      },
  
      // Tổng số nhân viên
      totalEmployees() {
        return this.employees.length;
      },
  
      // Số nhân viên mới trong tháng này
      newEmployeesThisMonth() {
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        return this.employees.filter(emp => {
          const joinDate = new Date(emp.joinDate);
          return joinDate >= firstDayOfMonth;
        }).length;
      }
    },
    methods: {
      // Chuyển đổi view
      changeView(view) {
        this.currentView = view;
        // Reset trang về 1 khi chuyển view
        this.currentPage = 1;
      },
  
      // Sắp xếp danh sách nhân viên
      sortBy(key) {
        if (this.sortKey === key) {
          // Nếu đang sắp xếp theo key này, đổi chiều sắp xếp
          this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          // Nếu sắp xếp theo key mới, mặc định là tăng dần
          this.sortKey = key;
          this.sortOrder = 'asc';
        }
      },
  
      // Trả về icon cho sắp xếp
      getSortIcon(key) {
        if (this.sortKey !== key) {
          return 'fas fa-sort';
        }
        return this.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
      },
  
      // Sắp xếp danh sách tài xế
      sortDriversBy(key) {
        if (this.driversSortKey === key) {
          // Nếu đang sắp xếp theo key này, đổi chiều sắp xếp
          this.driversSortOrder = this.driversSortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          // Nếu sắp xếp theo key mới, mặc định là tăng dần
          this.driversSortKey = key;
          this.driversSortOrder = 'asc';
        }
      },
  
      // Trả về icon cho sắp xếp tài xế
      getDriversSortIcon(key) {
        if (this.driversSortKey !== key) {
          return 'fas fa-sort';
        }
        return this.driversSortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
      },
  
      // Chuyển đến trang trước
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
  
      // Chuyển đến trang sau
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
  
      // Lấy tên phòng ban từ id
      getDepartmentName(id) {
        const dept = this.departments.find(d => d.id === id);
        return dept ? dept.name : 'Chưa phân công';
      },
  
      // Lấy tên vị trí từ mã
      getRoleName(role) {
        const roles = {
          'manager': 'Quản lý',
          'driver': 'Tài xế',
          'staff': 'Nhân viên'
        };
        return roles[role] || role;
      },
  
      // Lấy tên trạng thái từ mã
      getStatusName(status) {
        const statuses = {
          'active': 'Đang làm việc',
          'inactive': 'Nghỉ việc',
          'onleave': 'Đang nghỉ phép'
        };
        return statuses[status] || status;
      },
  
      // Lấy tên trạng thái tài xế từ mã
      getDriverStatusName(status) {
        const statuses = {
          'active': 'Sẵn sàng',
          'driving': 'Đang lái xe',
          'inactive': 'Nghỉ việc',
          'onleave': 'Đang nghỉ phép',
          'maintenance': 'Bảo trì xe'
        };
        return statuses[status] || status;
      },
  
      // Format ngày tháng
      formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
      },
  
      // Kiểm tra bằng lái sắp hết hạn
      isLicenseExpiringSoon(dateString) {
        if (!dateString) return false;
        
        const expiryDate = new Date(dateString);
        const now = new Date();
        
        // Tính số ngày còn lại
        const daysRemaining = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));
        
        // Nếu còn dưới 30 ngày, coi là sắp hết hạn
        return daysRemaining >= 0 && daysRemaining <= 30;
      },
  
      // Mở modal thêm nhân viên
      openAddEmployeeModal() {
        this.isEditMode = false;
        // Reset form
        this.employeeForm = {
          id: null,
          name: '',
          email: '',
          phone: '',
          birthday: '',
          role: 'staff',
          departmentId: 1,
          joinDate: new Date().toISOString().split('T')[0], // Ngày hiện tại
          status: 'active',
          managerInfo: {
            title: '',
            level: 'middle',
          },
          driverInfo: {
            licenseNumber: '',
            licenseType: 'B2',
            licenseExpiry: '',
            vehicleAssigned: ''
          }
        };
        this.showEmployeeModal = true;
      },
  
      // Mở modal thêm quản lý
      openAddManagerModal() {
        this.isEditMode = false;
        // Reset form với role là manager
        this.employeeForm = {
          id: null,
          name: '',
          email: '',
          phone: '',
          birthday: '',
          role: 'manager',
          departmentId: 1,
          joinDate: new Date().toISOString().split('T')[0], // Ngày hiện tại
          status: 'active',
          managerInfo: {
            title: '',
            level: 'middle',
            subordinatesCount: 0,
            currentProjects: 0
          }
        };
        this.showEmployeeModal = true;
      },
  
      // Mở modal thêm tài xế
      openAddDriverModal() {
        this.isEditMode = false;
        // Reset form với role là driver
        this.employeeForm = {
          id: null,
          name: '',
          email: '',
          phone: '',
          birthday: '',
          role: 'driver',
          departmentId: 3, // Mặc định phòng vận chuyển
          joinDate: new Date().toISOString().split('T')[0], // Ngày hiện tại
          status: 'active',
          driverInfo: {
            licenseNumber: '',
            licenseType: 'B2',
            licenseExpiry: '',
            vehicleAssigned: ''
          }
        };
        this.showEmployeeModal = true;
      },
  
      // Xem chi tiết nhân viên
      viewEmployeeDetails(employee) {
        // Xem chi tiết sẽ được implement khi cần
        console.log('Xem chi tiết nhân viên:', employee);
      },
  
      // Chỉnh sửa nhân viên
      editEmployee(employee) {
        this.isEditMode = true;
        // Copy thông tin nhân viên vào form
        this.employeeForm = JSON.parse(JSON.stringify(employee));
        this.showEmployeeModal = true;
      },
  
      // Xem chi tiết quản lý
      viewManagerDetails(manager) {
        // Xem chi tiết sẽ được implement khi cần
        console.log('Xem chi tiết quản lý:', manager);
      },
  
      // Chỉnh sửa quản lý
      editManager(manager) {
        this.isEditMode = true;
        // Copy thông tin quản lý vào form
        this.employeeForm = JSON.parse(JSON.stringify(manager));
        this.showEmployeeModal = true;
      },
  
      // Xem chi tiết tài xế
      viewDriverDetails(driver) {
        // Xem chi tiết sẽ được implement khi cần
        console.log('Xem chi tiết tài xế:', driver);
      },
  
      // Chỉnh sửa tài xế
      editDriver(driver) {
        this.isEditMode = true;
        // Copy thông tin tài xế vào form
        this.employeeForm = JSON.parse(JSON.stringify(driver));
        this.showEmployeeModal = true;
      },
  
      // Phân công xe cho tài xế
      assignVehicle(driver) {
        this.isEditMode = true;
        // Copy thông tin tài xế vào form
        this.employeeForm = JSON.parse(JSON.stringify(driver));
        // Focus vào trường phân công xe
        this.showEmployeeModal = true;
        // Trong thực tế, cần thêm logic để focus vào trường phân công xe
      },
  
      // Mở modal xác nhận xóa
      confirmDeleteEmployee(employee) {
        this.employeeToDelete = employee;
        this.showConfirmDeleteModal = true;
      },
  
      // Mở modal xác nhận xóa quản lý
      confirmDeleteManager(manager) {
        this.employeeToDelete = manager;
        this.showConfirmDeleteModal = true;
      },
  
      // Mở modal xác nhận xóa tài xế
      confirmDeleteDriver(driver) {
        this.employeeToDelete = driver;
        this.showConfirmDeleteModal = true;
      },
  
      // Lưu nhân viên (thêm mới hoặc cập nhật)
      saveEmployee() {
        if (this.isEditMode) {
          // Cập nhật nhân viên
          const index = this.employees.findIndex(emp => emp.id === this.employeeForm.id);
          if (index !== -1) {
            this.employees.splice(index, 1, { ...this.employeeForm });
          }
        } else {
          // Thêm nhân viên mới
          // Tạo ID mới dựa vào role
          let newId;
          if (this.employeeForm.role === 'manager') {
            // Tìm ID quản lý lớn nhất hiện tại
            const managerIds = this.managers.map(m => parseInt(m.id.replace('NV', '')));
            const maxId = managerIds.length > 0 ? Math.max(...managerIds) : 0;
            newId = `NV${String(maxId + 1).padStart(3, '0')}`;
          } else if (this.employeeForm.role === 'driver') {
            // Tìm ID tài xế lớn nhất hiện tại
            const driverIds = this.drivers.map(d => parseInt(d.id.replace('TX', '')));
            const maxId = driverIds.length > 0 ? Math.max(...driverIds) : 0;
            newId = `TX${String(maxId + 1).padStart(3, '0')}`;
          } else {
            // Tìm ID nhân viên lớn nhất hiện tại
            const staffIds = this.employees
              .filter(e => e.role === 'staff')
              .map(s => parseInt(s.id.replace('NV', '')));
            const maxId = staffIds.length > 0 ? Math.max(...staffIds) : 0;
            newId = `NV${String(maxId + 1).padStart(3, '0')}`;
          }
          
          // Thêm nhân viên mới với ID mới
          this.employees.push({
            ...this.employeeForm,
            id: newId
          });
        }
        
        // Đóng modal
        this.closeModal();
        
        // Hiển thị thông báo thành công (trong thực tế có thể sử dụng toast hoặc notification)
        alert(this.isEditMode ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
      },
  
      // Xóa nhân viên
      deleteEmployee() {
        const index = this.employees.findIndex(emp => emp.id === this.employeeToDelete.id);
        if (index !== -1) {
          this.employees.splice(index, 1);
        }
        
        // Đóng modal xác nhận xóa
        this.closeConfirmDeleteModal();
        
        // Hiển thị thông báo thành công
        alert('Xóa nhân viên thành công!');
      },
  
      // Đóng modal nhân viên
      closeModal() {
        this.showEmployeeModal = false;
      },
  
      // Đóng modal xác nhận xóa
      closeConfirmDeleteModal() {
        this.showConfirmDeleteModal = false;
        this.employeeToDelete = null;
      },
  
      // Đăng xuất
      logout() {
        // Trong thực tế, cần thêm logic đăng xuất
        alert('Đăng xuất thành công!');
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
  }
  
  /* Biến CSS */
  :root {
    --primary-color: #4a6cf7;
    --secondary-color: #6c757d;
    --success-color: #28a745;
    --danger-color: #dc3545;
    --warning-color: #ffc107;
    --info-color: #17a2b8;
    --light-color: #f8f9fa;
    --dark-color: #343a40;
    --body-bg: #f5f7fb;
    --sidebar-bg: #ffffff;
    --header-bg: #ffffff;
    --border-color: #e9ecef;
    --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  /* Typography */
  body {
    font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
    color: #333;
    background-color: var(--body-bg);
    line-height: 1.5;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  /* Layout */
  .employee-management {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    background-color: var(--header-bg);
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .header h1 {
    font-size: 1.25rem;
    color: var(--dark-color);
  }
  
  .user-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .btn-logout {
    background-color: transparent;
    border: 1px solid var(--border-color);
    color: var(--secondary-color);
    padding: 0.375rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-logout:hover {
    background-color: var(--secondary-color);
    color: white;
  }
  
  .main-container {
    display: flex;
    flex-grow: 1;
  }
  
  .sidebar {
    width: 250px;
    background-color: var(--sidebar-bg);
    border-right: 1px solid var(--border-color);
    padding: 1rem 0;
  }
  
  .sidebar nav ul {
    list-style: none;
  }
  
  .sidebar nav ul li {
    margin-bottom: 0.25rem;
  }
  
  .sidebar nav ul li a {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    color: var(--dark-color);
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .sidebar nav ul li a i {
    margin-right: 0.75rem;
    width: 20px;
    text-align: center;
  }
  
  .sidebar nav ul li a:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .sidebar nav ul li.active a {
    background-color: var(--primary-color);
    color: white;
  }
  
  .content {
    flex-grow: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }
  
  /* Dashboard */
  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .stat-card {
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
  }
  
  .stat-card h3 {
    font-size: 0.875rem;
    color: var(--secondary-color);
    margin-bottom: 0.5rem;
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 600;
    color: var(--primary-color);
  }
  
  .recent-activities {
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
  }
  
  .activity-list {
    list-style: none;
    margin-top: 1rem;
  }
  
  .activity-item {
    display: flex;
    border-bottom: 1px solid var(--border-color);
    padding: 0.75rem 0;
  }
  
  .activity-item:last-child {
    border-bottom: none;
  }
  
  .activity-time {
    width: 180px;
    color: var(--secondary-color);
    font-size: 0.875rem;
  }
  
  /* Vĩnh Hằng Views */
  .view-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .search-bar input {
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    width: 250px;
  }
  
  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .filters select {
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
  }
  
  /* Tables */
  .employees-table, .drivers-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: var(--shadow);
    border-radius: 8px;
    overflow: hidden;
  }
  
  .employees-table th, .employees-table td,
  .drivers-table th, .drivers-table td {
    padding: 0.75rem 1rem;
    text-align: left;
  }
  
  .employees-table th, .drivers-table th {
    background-color: #f8f9fa;
    font-weight: 500;
    cursor: pointer;
  }
  
  .employees-table tbody tr:not(:last-child),
  .drivers-table tbody tr:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  }
  
  .employees-table tbody tr:hover,
  .drivers-table tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  .role-badge, .status-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .role-badge.manager {
    background-color: rgba(74, 108, 247, 0.1);
    color: var(--primary-color);
  }
  
  .role-badge.driver {
    background-color: rgba(23, 162, 184, 0.1);
    color: var(--info-color);
  }
  
  .role-badge.staff {
    background-color: rgba(108, 117, 125, 0.1);
    color: var(--secondary-color);
  }
  
  .status-badge.active {
    background-color: rgba(40, 167, 69, 0.1);
    color: var(--success-color);
  }
  
  .status-badge.inactive {
    background-color: rgba(220, 53, 69, 0.1);
    color: var(--danger-color);
  }
  
  .status-badge.onleave {
    background-color: rgba(255, 193, 7, 0.1);
    color: var(--warning-color);
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: var(--secondary-color);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
  }
  
  .btn-icon:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .btn-icon.delete:hover {
    color: var(--danger-color);
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    gap: 1rem;
  }
  
  .btn-page {
    background: none;
    border: 1px solid var(--border-color);
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  .btn-page:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-page:not(:disabled):hover {
    background-color: var(--primary-color);
    color: white;
  }
  
  .no-data {
    text-align: center;
    padding: 2rem;
    color: var(--secondary-color);
  }
  
  /* Manager Cards */
  .manager-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }
  
  .manager-card {
    background-color: white;
    border-radius: 8px;
    box-shadow: var(--shadow);
    padding: 1.5rem;
    display: flex;
    position: relative;
  }
  
  .manager-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 1rem;
    flex-shrink: 0;
  }
  
  .manager-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .manager-info {
    flex-grow: 1;
  }
  
  .manager-title {
    color: var(--primary-color);
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  
  .manager-department {
    color: var(--secondary-color);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  
  .manager-contacts {
    margin-bottom: 0.5rem;
  }
  
  .contact-item {
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }
  
  .contact-item i {
    width: 16px;
    margin-right: 0.5rem;
    color: var(--secondary-color);
  }
  
  .manager-stats {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  
  .stat {
    font-size: 0.875rem;
  }
  
  .stat-label {
    color: var(--secondary-color);
  }
  
  .manager-actions {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    gap: 0.5rem;
  }
  
  /* Driver specific */
  .expiring-soon {
    color: var(--danger-color);
    font-weight: 500;
  }
  
  /* Buttons */
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background-color: var(--primary-color);
    color: white;
  }
  
  .btn-primary:hover {
    background-color: #3a5bd9;
  }
  
  .btn-secondary {
    background-color: var(--secondary-color);
    color: white;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
  }
  
  .btn-danger {
    background-color: var(--danger-color);
    color: white;
  }
  
  .btn-danger:hover {
    background-color: #c82333;
  }
  
  /* Modals */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  .horizontal-nav ul li a {
    display: block;
    padding: 10px 15px;
    text-decoration: none;
    color: #b97b7b; /* Default text color */
    transition: background-color 0.2s ease, color 0.2s ease; /* Smooth transition */
  }
  
  .horizontal-nav ul li a:hover {
    background-color: #e9ecef; /* Very light gray background on hover - Bootstrap's light */
    color: #007bff; /* Example: Blue text color on hover */
  }
  
  .horizontal-nav ul li.active a {
    /* Style for the active/selected item */
    background-color: #007bff;
    color: white;
  }
  
  /* Keep the active background on hover */
  .horizontal-nav ul li.active a:hover {
    background-color: #007bff; /* Keep the active background color */
    color: white; /* Keep the active text color */
  }
  /* Horizontal Navigation Styles */
  .horizontal-nav {
    background-color: var(--header-bg);
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .horizontal-nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    justify-content: center;
  }
  
  .horizontal-nav ul li {
    flex-grow: 1;
    text-align: center;
  }
  
  .horizontal-nav ul li a {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    color: var(--dark-color);
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .horizontal-nav ul li a i {
    margin-right: 0.5rem;
    width: 20px;
    text-align: center;
  }
  
  .horizontal-nav ul li a:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .horizontal-nav ul li.active a {
    background-color: var(--primary-color);
    color: white;
  }
  
  /* Remove previous sidebar styles */
  .main-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .content {
    flex-grow: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }
  </style>