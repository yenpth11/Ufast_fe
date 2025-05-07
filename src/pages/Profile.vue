<!-- Admin Account Management Page (Improved) -->
<template>
  <div class="admin-account-container">
    <div class="main-content">
      <div class="account-tabs">
        <div 
          class="tab" 
          :class="{ active: currentTab === 'info' }" 
          @click="currentTab = 'info'"
        >
          <svg class="tab-icon" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
          </svg>
          Thông tin cá nhân
        </div>
        <div 
          class="tab" 
          :class="{ active: currentTab === 'password' }" 
          @click="currentTab = 'password'"
        >
          <svg class="tab-icon" viewBox="0 0 24 24">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path>
          </svg>
          Đổi mật khẩu
        </div>
      </div>

      <section class="content">
        <!-- Thông tin cá nhân -->
        <div v-if="currentTab === 'info'" class="account-section">
          <h2>Thông Tin Cá Nhân</h2>
          <div class="profile-card">
            <div class="profile-header">
              <div class="profile-avatar">
                <img :src="adminAvatar" alt="Avatar" />
              </div>
              <div class="profile-info">
                <h3>{{ adminName }}</h3>
                <p class="role">Quản trị viên</p>
                <p class="last-login">
                  <svg class="info-icon" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path>
                  </svg>
                  Đăng nhập lần cuối: {{ lastLogin }}
                </p>
              </div>
            </div>

            <div class="profile-details">
              <div class="detail-item">
                <div class="detail-label">
                  <svg class="detail-icon" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                  </svg>
                  Họ và tên:
                </div>
                <div class="detail-value">{{ adminInfo.fullName }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">
                  <svg class="detail-icon" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                  </svg>
                  Email:
                </div>
                <div class="detail-value">{{ adminInfo.email }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">
                  <svg class="detail-icon" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path>
                  </svg>
                  Số điện thoại:
                </div>
                <div class="detail-value">{{ adminInfo.phone }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">
                  <svg class="detail-icon" viewBox="0 0 24 24">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"></path>
                  </svg>
                  Chức vụ:
                </div>
                <div class="detail-value">{{ adminInfo.position }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">
                  <svg class="detail-icon" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
                  </svg>
                  Địa chỉ:
                </div>
                <div class="detail-value">{{ adminInfo.address }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">
                  <svg class="detail-icon" viewBox="0 0 24 24">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"></path>
                  </svg>
                  Ngày tạo tài khoản:
                </div>
                <div class="detail-value">{{ adminInfo.createdAt }}</div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-change-password" @click="currentTab = 'password'">
                <svg class="btn-icon" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"></path>
                </svg>
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        <!-- Đổi mật khẩu -->
        <div v-if="currentTab === 'password'" class="account-section">
          <h2>Đổi Mật Khẩu</h2>
          <div class="password-card">
            <form @submit.prevent="updatePassword">
              <div class="form-group">
                <label for="currentPassword">Mật khẩu hiện tại</label>
                <div class="password-input">
                  <input 
                    :type="showCurrentPassword ? 'text' : 'password'" 
                    id="currentPassword" 
                    v-model="passwordForm.currentPassword" 
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                  <button 
                    type="button" 
                    class="toggle-password" 
                    @click="showCurrentPassword = !showCurrentPassword"
                  >
                    <svg class="eye-icon" viewBox="0 0 24 24">
                      <path v-if="showCurrentPassword" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path>
                      <path v-else d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="newPassword">Mật khẩu mới</label>
                <div class="password-input">
                  <input 
                    :type="showNewPassword ? 'text' : 'password'" 
                    id="newPassword" 
                    v-model="passwordForm.newPassword" 
                    placeholder="Nhập mật khẩu mới"
                    required
                  />
                  <button 
                    type="button" 
                    class="toggle-password" 
                    @click="showNewPassword = !showNewPassword"
                  >
                    <svg class="eye-icon" viewBox="0 0 24 24">
                      <path v-if="showNewPassword" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path>
                      <path v-else d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
                    </svg>
                  </button>
                </div>
                <div class="password-strength" :class="passwordStrength">
                  <span>Độ mạnh: {{ passwordStrengthText }}</span>
                  <div class="strength-bar">
                    <div class="strength-indicator" :style="{ width: passwordStrengthPercent + '%' }"></div>
                  </div>
                </div>
                <ul class="password-requirements">
                  <li :class="{ valid: hasUppercase }">Ít nhất 1 ký tự viết hoa</li>
                  <li :class="{ valid: hasLowercase }">Ít nhất 1 ký tự viết thường</li>
                  <li :class="{ valid: hasNumber }">Ít nhất 1 chữ số</li>
                  <li :class="{ valid: hasSpecial }">Ít nhất 1 ký tự đặc biệt</li>
                  <li :class="{ valid: hasMinLength }">Ít nhất 8 ký tự</li>
                </ul>
              </div>

              <div class="form-group">
                <label for="confirmPassword">Xác nhận mật khẩu</label>
                <div class="password-input">
                  <input 
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    id="confirmPassword" 
                    v-model="passwordForm.confirmPassword" 
                    placeholder="Xác nhận mật khẩu mới"
                    required
                  />
                  <button 
                    type="button" 
                    class="toggle-password" 
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <svg class="eye-icon" viewBox="0 0 24 24">
                      <path v-if="showConfirmPassword" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path>
                      <path v-else d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
                    </svg>
                  </button>
                </div>
                <span v-if="!passwordsMatch && passwordForm.confirmPassword" class="error-message">
                  <svg class="error-icon" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                  </svg>
                  Mật khẩu không khớp
                </span>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-save" :disabled="!formValid">
                  <svg class="btn-icon" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                  </svg>
                  Cập nhật mật khẩu
                </button>
                <button type="button" class="btn-cancel" @click="resetPasswordForm">
                  <svg class="btn-icon" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                  </svg>
                  Hủy bỏ
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminAccountPage',
  data() {
    return {
      adminName: 'Nguyễn Văn A',
      adminAvatar: '/admin-avatar.png',
      lastLogin: '07/05/2025, 08:30',
      showDropdown: false,
      currentTab: 'info',
      
      // Thông tin quản trị viên
      adminInfo: {
        fullName: 'Nguyễn Văn A',
        email: 'admin@example.com',
        phone: '0912345678',
        position: 'Quản trị viên cao cấp',
        address: 'Số 123, Đường Lê Lợi, Quận 1, Hà Nội',
        createdAt: '01/01/2024'
      },
      
      // Form đổi mật khẩu
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false
    };
  },
  computed: {
    // Kiểm tra tính hợp lệ của mật khẩu
    hasUppercase() {
      return /[A-Z]/.test(this.passwordForm.newPassword);
    },
    hasLowercase() {
      return /[a-z]/.test(this.passwordForm.newPassword);
    },
    hasNumber() {
      return /[0-9]/.test(this.passwordForm.newPassword);
    },
    hasSpecial() {
      return /[!@#$%^&*(),.?":{}|<>]/.test(this.passwordForm.newPassword);
    },
    hasMinLength() {
      return this.passwordForm.newPassword.length >= 8;
    },
    passwordStrength() {
      const score = [
        this.hasUppercase,
        this.hasLowercase,
        this.hasNumber,
        this.hasSpecial,
        this.hasMinLength
      ].filter(Boolean).length;
      
      if (score <= 2) return 'weak';
      if (score <= 4) return 'medium';
      return 'strong';
    },
    passwordStrengthText() {
      switch (this.passwordStrength) {
        case 'weak': return 'Yếu';
        case 'medium': return 'Trung bình';
        case 'strong': return 'Mạnh';
        default: return '';
      }
    },
    passwordStrengthPercent() {
      switch (this.passwordStrength) {
        case 'weak': return 30;
        case 'medium': return 70;
        case 'strong': return 100;
        default: return 0;
      }
    },
    passwordsMatch() {
      return this.passwordForm.newPassword === this.passwordForm.confirmPassword;
    },
    formValid() {
      return (
        this.passwordForm.currentPassword &&
        this.passwordForm.newPassword &&
        this.passwordForm.confirmPassword &&
        this.passwordsMatch &&
        this.passwordStrength !== 'weak'
      );
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    updatePassword() {
      // Xử lý cập nhật mật khẩu
      alert('Cập nhật mật khẩu thành công!');
      this.resetPasswordForm();
      this.currentTab = 'info';
    },
    resetPasswordForm() {
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      this.showCurrentPassword = false;
      this.showNewPassword = false;
      this.showConfirmPassword = false;
    },
    logout() {
      // Xử lý đăng xuất
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
  font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
}

/* Container */
.admin-account-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f5ff;
  color: #333;
}

/* Header */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: linear-gradient(135deg, #3a5fe7 0%, #1e40af 100%);
  color: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 42px;
  margin-right: 15px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.logo h1 {
  font-size: 22px;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.user-info {
  display: flex;
  align-items: center;
}

.welcome {
  margin-right: 15px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.avatar {
  position: relative;
  cursor: pointer;
}

.avatar img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.avatar img:hover {
  border-color: #fff;
  transform: scale(1.05);
}

.dropdown-menu {
  position: absolute;
  top: 55px;
  right: 0;
  background-color: #fff;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  overflow: hidden;
  width: 220px;
  z-index: 10;
  animation: slideDown 0.3s ease;
  transform-origin: top right;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-menu ul {
  list-style: none;
}

.dropdown-menu ul li {
  padding: 14px 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dropdown-menu ul li:last-child {
  border-bottom: none;
}

.dropdown-menu ul li .icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  fill: #667eea;
}

.dropdown-menu ul li:hover {
  background-color: #f3f7ff;
  color: #3a5fe7;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 40px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

/* Tabs */
.account-tabs {
  display: flex;
  margin-bottom: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.tab {
  flex: 1;
  padding: 16px 20px;
  font-size: 15px;
  cursor: pointer;
  text-align: center;
  color: #555;
  font-weight: 500;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 3px solid transparent;
}

.tab-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  fill: currentColor;
}

.tab:hover {
  color: #3a5fe7;
  background-color: #f3f7ff;
}

.tab.active {
  color: #3a5fe7;
  border-bottom-color: #3a5fe7;
  background-color: #f3f7ff;
}

/* Content */
.content {
  padding: 0;
}

/* Account Section */
.account-section {
  width: 100%;
}

.account-section h2 {
  color: #2d3748;
  margin-bottom: 25px;
  font-weight: 600;
  font-size: 24px;
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 15px;
}

.account-section h2::before {
  content: '';
  position: absolute;
  left: 0;
  height: 24px;
  width: 5px;
  background: linear-gradient(to bottom, #3a5fe7, #1e40af);
  border-radius: 10px;
}

/* Profile Card */
.profile-card, .password-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  padding: 30px;
  margin-bottom: 30px;
  transition: all 0.3s;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.profile-card:hover, .password-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.profile-avatar {
  margin-right: 25px;
}

.profile-avatar img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f3f7ff;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.profile-info h3 {
  font-size: 22px;
  color: #2d3748;
  margin-bottom: 8px;
  font-weight: 600;
}

.profile-info .role {
  font-size: 15px;
  color: #3a5fe7;
  margin-bottom: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.profile-info .last-login {
  font-size: 13px;
  color: #718096;
  display: flex;
  align-items: center;
}

.info-icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  fill: #718096;
}

/* Profile Details */
.profile-details {
  margin-bottom: 30px;
}

.detail-item {
  display: flex;
  margin-bottom: 18px;
  padding-bottom: 18px;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  width: 180px;
  font-weight: 600;
  color: #4a5568;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.detail-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  fill: #667eea;
}

.detail-value {
  flex: 1;
  color: #2d3748;
  font-size: 15px;
}

/* Form Elements */
.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  color: #4a5568;
  font-weight: 600;
}

.password-input {
  position: relative;
}

input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s;
  color: #2d3748;
  background-color: #f9fafc;
}

input[type="password"]:focus,
input[type="text"]:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  background-color: #fff;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #718096;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-icon {
  width: 20px;
  height: 20px;
  fill: #718096;
  transition: fill 0.2s;
}

.toggle-password:hover .eye-icon {
  fill: #3a5fe7;
}

/* Password Strength */
.password-strength {
  margin-top: 12px;
  font-size: 13px;
  display: flex;
  flex-direction: column;
}

.password-strength.weak {
  color: #e53e3e;
}

.password-strength.medium {
  color: #ed8936;
}

.password-strength.strong {
  color: #38a169;
}

.strength-bar {
  height: 6px;
  background-color: #edf2f7;
  border-radius: 3px;
  margin-top: 8px;
  overflow: hidden;
}

.strength-indicator {
  height: 6px;
  border-radius: 3px;
  transition: width 0.3s;
}

.weak .strength-indicator {
  background-color: #e53e3e;
}

.medium .strength-indicator {
  background-color: #ed8936;
}

.strong .strength-indicator {
  background-color: #38a169;
}

/* Password Requirements */
.password-requirements {
  list-style: none;
  margin-top: 15px;
  font-size: 13px;
  color: #718096;
  background-color: #f9fafc;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.password-requirements li {
  margin-bottom: 8px;
  padding-left: 25px;
  position: relative;
}

.password-requirements li:last-child {
  margin-bottom: 0;
}

.password-requirements li:before {
  content: "×";
  position: absolute;
  left: 0;
  color: #e53e3e;
  font-size: 16px;
  font-weight: bold;
}

.password-requirements li.valid:before {
  content: "✓";
  color: #38a169;
}

/* Error Message */
.error-message {
  color: #e53e3e;
  font-size: 13px;
  margin-top: 8px;
  display: flex;
  align-items: center;
}

.error-icon {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  fill: #e53e3e;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 35px;
}

.btn-save, .btn-cancel, .btn-change-password {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.btn-save {
  background: linear-gradient(135deg, #3a5fe7 0%, #1e40af 100%);
  color: #fff;
}

.btn-save:hover {
  box-shadow: 0 4px 12px rgba(58, 95, 231, 0.3);
  transform: translateY(-2px);
}

.btn-save:disabled {
  background: linear-gradient(135deg, #a5b4fc 0%, #818cf8 100%);
  cursor: not-allowed;
  box-shadow: none;
  transform: translateY(0);
}

.btn-cancel {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.btn-cancel:hover {
  background-color: #e5e7eb;
}

.btn-change-password {
  background: linear-gradient(135deg, #3a5fe7 0%, #1e40af 100%);
  color: #fff;
}

.btn-change-password:hover {
  box-shadow: 0 4px 12px rgba(58, 95, 231, 0.3);
  transform: translateY(-2px);
}

.btn-icon {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  fill: currentColor;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-header {
    padding: 15px;
  }
  
  .logo h1 {
    font-size: 18px;
  }
  
  .welcome {
    display: none;
  }
  
  .main-content {
    padding: 20px 15px;
  }
  
  .account-tabs {
    flex-direction: column;
  }
  
  .tab {
    border-bottom: none;
    border-left: 3px solid transparent;
    justify-content: flex-start;
  }
  
  .tab.active {
    border-bottom: none;
    border-left: 3px solid #3a5fe7;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-avatar {
    margin-right: 0;
    margin-bottom: 20px;
  }
  
  .detail-item {
    flex-direction: column;
  }
  
  .detail-label {
    width: 100%;
    margin-bottom: 8px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-save, .btn-cancel, .btn-change-password {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .profile-card, .password-card {
    padding: 20px;
  }
}
</style>